import { BufferTarget, Mp4OutputFormat, Output, Quality, VideoSample, VideoSampleSource, canEncodeVideo } from 'mediabunny';

// Captures a video so a briefing / flight can be saved and played back (or
// edited, e.g. in DaVinci Resolve) elsewhere. Shared by the objectives and
// drone pages.
//
// Preferred path: WebCodecs H.264 encoding muxed into a regular MP4 by
// mediabunny. Unlike MediaRecorder output, that file has a constant frame
// rate, a key frame every second and a proper index (duration + seek table),
// which is what editors expect. MediaRecorder's VP9 WebM has none of those
// and makes Resolve show green frames or crash.
//
// Fallback (no WebCodecs / no H.264 encoder / no MediaStreamTrackProcessor,
// e.g. Firefox): MediaRecorder, preferring MP4 over WebM when supported.
// That output is fragmented and variable-frame-rate, so it is only a last
// resort and a warning is logged when it is used.

// ≈ 60 MB per minute; the whole recording is held in memory until stop.
// The encoder spends the whole budget even on slow, dark scenes, so this
// directly sets the file size (16 Mbps gave 937 MB for 7.8 min).
const BITRATE = 8_000_000;
const KEY_FRAME_INTERVAL_SECONDS = 1;
// Output boxes to try, long side × short side, largest first. Tab capture
// records physical pixels (CSS size × devicePixelRatio, i.e. OS scaling ×
// browser zoom), so a 960×540 page can arrive as 4K or more. The capture is
// scaled down, keeping its aspect ratio, to the largest box the hardware
// encoder accepts. Capped at 1080p: the drone 3D scene renders at no more
// than 2× CSS size anyway, and 4K files are ~3× larger for sharper HUD text
// only.
const OUTPUT_BOXES: [number, number][] = [[1920, 1080], [1280, 720]];
const FIRST_FRAME_TIMEOUT_MS = 3000;
// A tab capture changes size right after it starts (seen in Edge: the first
// frame was 3360×2054, every later one 3360×1890 — likely the browser's
// "sharing this tab" UI settling). The video size is only locked once the
// capture size has been stable for SIZE_STABLE_MS (giving up after
// SIZE_SETTLE_MAX_MS); frames before that are skipped.
const SIZE_STABLE_MS = 300;
const SIZE_SETTLE_MAX_MS = 1500;
const FILE_BASENAME = 'tsam-objective-briefing';

const FALLBACK_MIME_TYPES = [
	'video/mp4;codecs=avc1.640028',
	'video/mp4',
	'video/webm;codecs=vp9',
	'video/webm',
];

// H.264 (4:2:0) needs even frame dimensions.
const toEven = (n: number) => Math.max(2, Math.floor(n / 2) * 2);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type EncodeSettings = {
	width: number;
	height: number;
	hardwareAcceleration: HardwareAcceleration;
};

// Continuously reads the capture, keeping only the most recent frame (older
// ones are closed right away so the capture pipeline never stalls).
// MediaStreamTrackProcessor is Chromium-only; its typings come with
// mediabunny (@types/dom-mediacapture-transform).
class FrameGrabber {
	public latest: VideoFrame | null = null;
	public sizeChangedAt = 0;
	private reader: ReadableStreamDefaultReader<VideoFrame>;
	private reading: Promise<void>;

	constructor(
		// A clone of the capture track, so cancelling the reader can never end
		// the original track (which the MediaRecorder fallback may still need).
		private track: MediaStreamVideoTrack,
	) {
		this.reader = new MediaStreamTrackProcessor({ track }).readable.getReader();
		this.reading = this.read();
	}

	private async read() {
		for (;;) {
			const { value, done } = await this.reader.read();
			if (done) return;
			const previous = this.latest;
			if (!previous || previous.displayWidth !== value.displayWidth || previous.displayHeight !== value.displayHeight) {
				this.sizeChangedAt = performance.now();
			}
			previous?.close();
			this.latest = value;
		}
	}

	// Resolves with the capture size once it has been stable for
	// SIZE_STABLE_MS (or SIZE_SETTLE_MAX_MS has passed), null if no frame
	// arrives at all.
	public async waitForStableSize(): Promise<{ width: number; height: number } | null> {
		const start = performance.now();
		while (!this.latest) {
			if (performance.now() - start > FIRST_FRAME_TIMEOUT_MS) return null;
			await sleep(10);
		}
		const firstAt = performance.now();
		while (performance.now() - this.sizeChangedAt < SIZE_STABLE_MS && performance.now() - firstAt < SIZE_SETTLE_MAX_MS) {
			await sleep(20);
		}
		return this.latest && { width: this.latest.displayWidth, height: this.latest.displayHeight };
	}

	public async close() {
		await this.reader.cancel().catch(() => { });
		await this.reading.catch(() => { });
		this.latest?.close();
		this.latest = null;
		this.track.stop();
	}
}

type Mp4Session = {
	output: Output;
	grabber: FrameGrabber;
	stopRequested: boolean;
	// Resolves once the frame pump has exited; false if encoding failed.
	pumped: Promise<boolean>;
};

export class Recorder {
	private stream?: MediaStream;
	private mp4?: Mp4Session;
	private mediaRecorder?: MediaRecorder;
	private chunks: Blob[] = [];
	public isRecording = false;
	private starting = false;

	constructor(
		private canvas: HTMLCanvasElement,
		private fps = 30,
	) { }

	public async start() {
		if (this.isRecording || this.starting) return;
		this.starting = true;

		try {
			this.stream = await this.captureStream();
			const track = this.stream.getVideoTracks()[0];
			const hasWebCodecs = typeof VideoEncoder !== 'undefined'
				&& typeof MediaStreamTrackProcessor !== 'undefined';

			if (hasWebCodecs) {
				try {
					this.mp4 = await this.startMp4(track);
				} catch (err) {
					console.warn('MP4 encoder unavailable; falling back to MediaRecorder (fragmented, variable frame rate).', err);
					this.startMediaRecorder(this.stream);
				}
			} else {
				console.warn('WebCodecs unavailable; falling back to MediaRecorder (fragmented, variable frame rate).');
				this.startMediaRecorder(this.stream);
			}
			this.isRecording = true;
			// "Stop sharing" clicked while starting: the 'ended' handler's stop()
			// was ignored then, so apply it now.
			if (track.readyState === 'ended') this.stop();
		} catch (err) {
			console.error('Recording failed to start', err);
			this.releaseStream();
		} finally {
			this.starting = false;
		}
	}

	public stop() {
		if (!this.isRecording) return;
		this.isRecording = false;

		if (this.mp4) {
			const session = this.mp4;
			this.mp4 = undefined;
			void this.finishMp4(session);
		} else if (this.mediaRecorder) {
			this.mediaRecorder.stop();
			this.mediaRecorder = undefined;
			this.releaseStream();
		}
	}

	// canvas.captureStream() only ever sees the WebGL canvas' own pixels —
	// it misses the HUD, which is a separate HTML/CSS overlay (plus the
	// CSS2DRenderer label layer) stacked on top of the canvas in the DOM.
	// Tab capture records the whole rendered page instead, so the HUD ends
	// up in the video. `preferCurrentTab` (Chromium-only) pre-selects this
	// tab in the picker; unsupported/denied browsers fall back to the old
	// canvas-only capture rather than failing to record at all.
	private async captureStream(): Promise<MediaStream> {
		try {
			const displayMediaOptions = {
				video: { frameRate: this.fps },
				preferCurrentTab: true,
			} as DisplayMediaStreamOptions;
			const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
			// The user can end the capture from the browser's "Stop sharing" bar.
			stream.getVideoTracks()[0].addEventListener('ended', () => this.stop());
			return stream;
		} catch {
			return this.canvas.captureStream(this.fps);
		}
	}

	// Picks the output size from the settled capture size (the delivered
	// frames, not the track settings, which can disagree — seen in Edge):
	// the largest box the hardware encoder accepts, else the largest box
	// software encoding can do.
	private async pickEncodeSettings(frameWidth: number, frameHeight: number): Promise<EncodeSettings> {
		const long = Math.max(frameWidth, frameHeight);
		const short = Math.min(frameWidth, frameHeight);
		for (const hardwareAcceleration of ['prefer-hardware', 'no-preference'] as const) {
			for (const [boxLong, boxShort] of OUTPUT_BOXES) {
				const scale = Math.min(1, boxLong / long, boxShort / short);
				const width = toEven(frameWidth * scale);
				const height = toEven(frameHeight * scale);
				if (await canEncodeVideo('avc', { width, height, bitrate: BITRATE, frameRate: this.fps, hardwareAcceleration })) {
					return { width, height, hardwareAcceleration };
				}
			}
		}
		throw new Error(`No H.264 encoder supports a ${frameWidth}×${frameHeight} capture`);
	}

	private async startMp4(track: MediaStreamTrack): Promise<Mp4Session> {
		const grabber = new FrameGrabber(track.clone() as MediaStreamVideoTrack);
		try {
			const size = await grabber.waitForStableSize();
			if (!size) throw new Error('No video frame received from the capture');
			const { width: frameWidth, height: frameHeight } = size;

			const { width, height, hardwareAcceleration } = await this.pickEncodeSettings(frameWidth, frameHeight);
			console.info(`Recording ${frameWidth}×${frameHeight} capture as ${width}×${height} H.264 MP4 @ ${BITRATE / 1e6} Mbps (${hardwareAcceleration})`);

			const output = new Output({
				// 'in-memory' writes the index (moov) at the start of the file.
				format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
				target: new BufferTarget(),
			});

			const source = new VideoSampleSource({
				codec: 'avc',
				quality: new Quality({ bitrate: BITRATE }),
				keyFrameInterval: KEY_FRAME_INTERVAL_SECONDS,
				latencyMode: 'quality',
				hardwareAcceleration,
				// Every frame is fitted into the settled capture size. 'contain'
				// never crops — a window resized mid-recording gets letterboxed
				// instead of losing the HUD at the edges.
				sizeChangeBehavior: 'contain',
				transform: { width, height },
			});
			output.addVideoTrack(source, { frameRate: this.fps });
			await output.start();

			const session: Mp4Session = { output, grabber, stopRequested: false, pumped: Promise.resolve(true) };
			session.pumped = this.pumpFrames(session, source);
			return session;
		} catch (err) {
			await grabber.close();
			throw err;
		}
	}

	// Emits exactly one frame per 1/fps of wall-clock time, each a copy of the
	// latest captured frame, with timestamps n / fps. Tab capture only emits
	// frames when the page changes, so this is what makes the frame rate
	// constant. Samples are added one at a time (awaiting encoder
	// backpressure), so timestamps can never be duplicated or out of order.
	private async pumpFrames(session: Mp4Session, source: VideoSampleSource): Promise<boolean> {
		const frameMs = 1000 / this.fps;
		const startTime = performance.now();
		let frameIndex = 0;
		try {
			while (!session.stopRequested) {
				const wait = startTime + frameIndex * frameMs - performance.now();
				const latest = session.grabber.latest;
				if (wait > 0 || !latest) {
					await sleep(Math.max(wait, 5));
					continue;
				}
				const sample = new VideoSample(latest.clone(), {
					timestamp: frameIndex / this.fps,
					duration: 1 / this.fps,
				});
				try {
					await source.add(sample);
				} finally {
					sample.close();
				}
				frameIndex++;
			}
			return true;
		} catch (err) {
			console.error('Recording failed', err);
			return false;
		} finally {
			await session.grabber.close();
		}
	}

	private async finishMp4(session: Mp4Session) {
		try {
			session.stopRequested = true;
			if (!await session.pumped) {
				await session.output.cancel();
				return;
			}
			await session.output.finalize();
			const buffer = (session.output.target as BufferTarget).buffer;
			if (buffer) this.download(new Blob([buffer], { type: 'video/mp4' }), 'mp4');
		} catch (err) {
			console.error('Recording failed to finalize', err);
		} finally {
			this.releaseStream();
		}
	}

	private startMediaRecorder(stream: MediaStream) {
		const mimeType = FALLBACK_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
		const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';

		this.chunks = [];
		const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: BITRATE });
		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) this.chunks.push(e.data);
		};
		recorder.onstop = () => this.download(new Blob(this.chunks, { type: recorder.mimeType }), extension);
		recorder.start();
		this.mediaRecorder = recorder;
	}

	private releaseStream() {
		this.stream?.getTracks().forEach((track) => track.stop());
		this.stream = undefined;
	}

	private download(blob: Blob, extension: string) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${FILE_BASENAME}.${extension}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	}
}

import { BufferTarget, Mp4OutputFormat, Output, Quality, VideoSample, VideoSampleSource, canEncodeVideo } from 'mediabunny';

// Captures a video so a briefing / flight can be saved and played back (or
// edited, e.g. in DaVinci Resolve) elsewhere. Shared by the objectives and
// drone pages.
//
// Preferred path: WebCodecs H.264 encoding muxed into a regular MP4 by
// mediabunny. Unlike MediaRecorder output, that file has a constant frame
// rate, regular key frames and a proper index (duration + seek table),
// which is what editors expect. MediaRecorder's VP9 WebM has none of those
// and makes Resolve show green frames or crash.
//
// Fallback (no WebCodecs / no H.264 encoder / no MediaStreamTrackProcessor,
// e.g. Firefox): MediaRecorder, preferring MP4 over WebM when supported.
// That output is fragmented and variable-frame-rate, so it is only a last
// resort and a warning is logged when it is used.

// ≈ 60 MB per minute; the whole recording is held in memory until stop.
const BITRATE = 8_000_000;
// Software encoding by default: the GPU's H.264 encoder (AMD, Windows) started
// skipping frames after each key frame (frozen picture every second) after a
// driver update, in both Edge and Chrome, ignoring the bitrate settings. The
// browser's software encoder keeps up at 1080p60 and does not depend on GPU
// drivers. Hardware is only used if software cannot encode the size.
// `?encoder=gpu` in the page URL tries the GPU first instead, e.g. to check
// whether a later driver fixed it.
const USE_GPU = new URLSearchParams(window.location.search).get('encoder') === 'gpu';
const ENCODER_PREFERENCE = USE_GPU
	? ['prefer-hardware', 'prefer-software', 'no-preference'] as const
	: ['prefer-software', 'prefer-hardware', 'no-preference'] as const;
// Software: variable, since constant made each key frame eat the budget of
// the frames after it (a visible quality pulse). GPU: constant, since in
// variable mode it starved the frames after each key frame even harder.
const BITRATE_MODE = USE_GPU ? 'constant' : 'variable';
// Each key frame causes a small quality dip; every 2 s keeps that rare while
// seeking in editors stays quick.
const KEY_FRAME_INTERVAL_SECONDS = 2;
// Output boxes to try, long side × short side, largest first. Tab capture
// records physical pixels (CSS size × devicePixelRatio, i.e. OS scaling ×
// browser zoom), so a 960×540 page can arrive as 4K or more — or, in a
// small window at 100% OS scaling, as less than 1080p. The capture is
// scaled (down or up), keeping its aspect ratio, to fill the largest box the
// encoder accepts, so recordings are always HD. Capped at 1080p:
// the drone 3D scene renders at no more than 2× CSS size anyway, and 4K
// files are ~3× larger for sharper HUD text only.
const OUTPUT_BOXES: [number, number][] = [[1920, 1080], [1280, 720]];
const FIRST_FRAME_TIMEOUT_MS = 3000;
// A tab capture changes size right after it starts (seen in Edge: the first
// frame was 3360×2054, every later one 3360×1890 — likely the browser's
// "sharing this tab" UI settling). The video size is only locked once the
// capture size has been stable for SIZE_STABLE_MS (giving up after
// SIZE_SETTLE_MAX_MS); frames before that are skipped.
const SIZE_STABLE_MS = 300;
const SIZE_SETTLE_MAX_MS = 1500;
// The browser rounds the size it scales the capture to (seen: 1918×1080 for
// a 1920×1080 request); that close size is used as the output size as is.
const SCALE_TOLERANCE_PX = 8;
// Captured frames waiting for the encoder; beyond this the oldest are
// dropped, so a stalled encoder cannot exhaust memory.
const MAX_QUEUED_FRAMES = 30;
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

// Continuously reads the capture into a queue. Until recording starts
// (`queueing` false) only the most recent frame is kept, older ones are
// closed right away so the capture pipeline never stalls; while recording,
// every frame is queued for the pump.
// MediaStreamTrackProcessor is Chromium-only; its typings come with
// mediabunny (@types/dom-mediacapture-transform).
class FrameGrabber {
	public queue: VideoFrame[] = [];
	public queueing = false;
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

	public get latest(): VideoFrame | null {
		return this.queue[this.queue.length - 1] ?? null;
	}

	private async read() {
		for (;;) {
			const { value, done } = await this.reader.read();
			if (done) return;
			const previous = this.latest;
			if (!previous || previous.displayWidth !== value.displayWidth || previous.displayHeight !== value.displayHeight) {
				this.sizeChangedAt = performance.now();
			}
			this.queue.push(value);
			const keep = this.queueing ? MAX_QUEUED_FRAMES : 1;
			while (this.queue.length > keep) this.queue.shift()!.close();
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

	// Asks the browser to deliver frames of about width×height, scaled in its
	// own (GPU) capture pipeline. Resolves with the size it then delivers, or
	// null if it refuses or delivers something else.
	public async scaleTo(width: number, height: number): Promise<{ width: number; height: number } | null> {
		const isClose = () => {
			const frame = this.latest;
			return !!frame
				&& Math.abs(frame.displayWidth - width) <= SCALE_TOLERANCE_PX
				&& Math.abs(frame.displayHeight - height) <= SCALE_TOLERANCE_PX
				&& frame.displayWidth % 2 === 0 && frame.displayHeight % 2 === 0;
		};
		if (!isClose()) {
			try {
				await this.track.applyConstraints({ width: { max: width }, height: { max: height } });
			} catch (err) {
				console.warn('Capture could not be scaled by the browser', err);
				return null;
			}
			const start = performance.now();
			while (!isClose() && performance.now() - start < SIZE_SETTLE_MAX_MS) await sleep(20);
		}
		return isClose() ? { width: this.latest!.displayWidth, height: this.latest!.displayHeight } : null;
	}

	public async close() {
		await this.reader.cancel().catch(() => { });
		await this.reading.catch(() => { });
		this.queue.forEach((frame) => frame.close());
		this.queue = [];
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
		// Matches a 60 Hz screen: the page renders, and the tab capture
		// delivers, one frame per refresh, so each lands in its own video
		// frame (see pumpFrames).
		private fps = 60,
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
	// the capture scaled to fill the largest box the preferred encoder
	// accepts (see ENCODER_PREFERENCE), else the next one.
	private async pickEncodeSettings(frameWidth: number, frameHeight: number): Promise<EncodeSettings> {
		const long = Math.max(frameWidth, frameHeight);
		const short = Math.min(frameWidth, frameHeight);
		for (const hardwareAcceleration of ENCODER_PREFERENCE) {
			for (const [boxLong, boxShort] of OUTPUT_BOXES) {
				const scale = Math.min(boxLong / long, boxShort / short);
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

			const target = await this.pickEncodeSettings(frameWidth, frameHeight);
			const { hardwareAcceleration } = target;
			// Scaling in the browser's capture pipeline is cheap. Otherwise
			// mediabunny resizes every frame through a canvas on the main
			// thread, which is too slow for 60 fps from a 4K tab.
			const scaled = await grabber.scaleTo(target.width, target.height);
			const { width, height } = scaled ?? target;
			console.info(
				`Recording ${frameWidth}×${frameHeight} capture as ${width}×${height} H.264 MP4 @ ${BITRATE / 1e6} Mbps, `
				+ `${this.fps} fps (${hardwareAcceleration}, ${scaled ? 'scaled by the browser' : 'scaled per frame'})`,
			);

			const output = new Output({
				// 'in-memory' writes the index (moov) at the start of the file.
				format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
				target: new BufferTarget(),
			});

			const source = new VideoSampleSource({
				codec: 'avc',
				quality: new Quality({ bitrate: BITRATE }),
				bitrateMode: BITRATE_MODE,
				keyFrameInterval: KEY_FRAME_INTERVAL_SECONDS,
				latencyMode: 'quality',
				hardwareAcceleration,
				// Frames of any other size (window resized mid-recording) are
				// fitted into the output size. 'contain' never crops — they get
				// letterboxed instead of losing the HUD at the edges.
				sizeChangeBehavior: 'contain',
				// Any `transform` makes mediabunny resize every frame, so it is
				// only set when the browser could not scale the capture itself.
				...(scaled ? {} : { transform: { width, height } }),
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

	// Writes each captured frame into the constant-frame-rate grid by its own
	// capture timestamp: slot = round((t - t0) · fps), video time = slot / fps.
	// (Sampling the latest frame on a separate timer beats against the
	// screen refresh: some frames get written twice and the next one skipped.)
	// Gaps, where the page did not change so tab capture sent nothing, are
	// filled by repeating the previous frame, which keeps the frame rate
	// constant for editors. Samples are added one at a time (awaiting encoder
	// backpressure), in increasing slot order.
	private async pumpFrames(session: Mp4Session, source: VideoSampleSource): Promise<boolean> {
		const grabber = session.grabber;
		const slotUs = 1e6 / this.fps;
		// Drop the frame held for sizing, so the first written frame is fresh.
		grabber.queue.forEach((frame) => frame.close());
		grabber.queue = [];
		grabber.queueing = true;

		let firstTimestamp: number | null = null;
		let lastSlot = -1;
		let previous: VideoFrame | null = null;
		const write = async (frame: VideoFrame, slot: number) => {
			const sample = new VideoSample(frame.clone(), { timestamp: slot / this.fps, duration: 1 / this.fps });
			try {
				await source.add(sample);
			} finally {
				sample.close();
			}
		};
		try {
			while (!session.stopRequested) {
				const frame = grabber.queue.shift();
				if (!frame) {
					await sleep(2);
					continue;
				}
				firstTimestamp ??= frame.timestamp;
				const slot = Math.round((frame.timestamp - firstTimestamp) / slotUs);
				if (slot <= lastSlot) {
					frame.close();
					continue;
				}
				if (previous) {
					for (let gap = lastSlot + 1; gap < slot; gap++) await write(previous, gap);
					previous.close();
				}
				await write(frame, slot);
				previous = frame;
				lastSlot = slot;
			}
			return true;
		} catch (err) {
			console.error('Recording failed', err);
			return false;
		} finally {
			previous?.close();
			await grabber.close();
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

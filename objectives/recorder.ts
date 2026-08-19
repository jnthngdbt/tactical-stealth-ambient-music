// Captures a video (webm) via MediaRecorder so the looping briefing can be
// saved and played back elsewhere, without any interactivity being required
// at playback time.
export class Recorder {
	private mediaRecorder?: MediaRecorder;
	private stream?: MediaStream;
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

		// canvas.captureStream() only ever sees the WebGL canvas' own pixels —
		// it misses the HUD, which is a separate HTML/CSS overlay (plus the
		// CSS2DRenderer label layer) stacked on top of the canvas in the DOM.
		// Tab capture records the whole rendered page instead, so the HUD ends
		// up in the video. `preferCurrentTab` (Chromium-only) pre-selects this
		// tab in the picker; unsupported/denied browsers fall back to the old
		// canvas-only capture rather than failing to record at all.
		try {
			const displayMediaOptions = {
				video: { frameRate: this.fps },
				preferCurrentTab: true,
			} as DisplayMediaStreamOptions;
			this.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
			this.stream.getVideoTracks()[0].addEventListener('ended', () => this.stop());
		} catch {
			this.stream = this.canvas.captureStream(this.fps);
		}

		const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';

		this.chunks = [];
		this.mediaRecorder = new MediaRecorder(this.stream, { mimeType, videoBitsPerSecond: 12_000_000 });
		this.mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) this.chunks.push(e.data);
		};
		this.mediaRecorder.onstop = () => this.download();
		this.mediaRecorder.start();
		this.isRecording = true;
		this.starting = false;
	}

	public stop() {
		if (!this.isRecording || !this.mediaRecorder) return;
		this.mediaRecorder.stop();
		this.stream?.getTracks().forEach((track) => track.stop());
		this.isRecording = false;
	}

	private download() {
		const blob = new Blob(this.chunks, { type: 'video/webm' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'tsam-objective-briefing.webm';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	}
}

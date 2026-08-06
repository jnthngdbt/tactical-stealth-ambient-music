// Captures the canvas as a video (webm) via MediaRecorder so the looping
// briefing can be saved and played back elsewhere, without any interactivity
// being required at playback time.
export class Recorder {
	private mediaRecorder?: MediaRecorder;
	private chunks: Blob[] = [];
	public isRecording = false;

	constructor(
		private canvas: HTMLCanvasElement,
		private fps = 30,
	) { }

	public start() {
		if (this.isRecording) return;

		const stream = this.canvas.captureStream(this.fps);
		const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';

		this.chunks = [];
		this.mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12_000_000 });
		this.mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) this.chunks.push(e.data);
		};
		this.mediaRecorder.onstop = () => this.download();
		this.mediaRecorder.start();
		this.isRecording = true;
	}

	public stop() {
		if (!this.isRecording || !this.mediaRecorder) return;
		this.mediaRecorder.stop();
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

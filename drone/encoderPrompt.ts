import type { EncoderChoice } from '../objectives/recorder.ts';

// Asks which H.264 encoder to record with (#encoderPrompt, index.html).
// G or Enter → GPU (recommended), C → CPU, Esc or a click outside → cancel.
// Resolves with the choice, or null when cancelled. While open, it swallows
// every key so the page's other shortcuts (M, H, E, R…) don't fire.
// The choice is made by a key press or click, which also gives the
// user activation that the tab-capture prompt (getDisplayMedia) needs.
export function askEncoder(): Promise<EncoderChoice | null> {
	const panel = document.getElementById('encoderPrompt');
	if (!panel) return Promise.resolve('gpu');

	return new Promise((resolve) => {
		function close(choice: EncoderChoice | null) {
			window.removeEventListener('keydown', onKeyDown, { capture: true });
			window.removeEventListener('pointerdown', onPointerDown, { capture: true });
			panel!.removeEventListener('click', onClick);
			// hidden synchronously, before the caller starts the tab capture
			panel!.hidden = true;
			resolve(choice);
		}

		function onKeyDown(event: KeyboardEvent) {
			event.preventDefault();
			event.stopImmediatePropagation();
			if (event.repeat) return;
			const key = event.key.toLowerCase();
			if (key === 'g' || key === 'enter') close('gpu');
			else if (key === 'c') close('cpu');
			else if (key === 'escape') close(null);
		}

		function onClick(event: MouseEvent) {
			const option = (event.target as HTMLElement).closest<HTMLElement>('[data-encoder]');
			if (option) close(option.dataset.encoder as EncoderChoice);
		}

		function onPointerDown(event: PointerEvent) {
			if (!panel!.contains(event.target as Node)) {
				event.stopImmediatePropagation();
				// also swallow the click that follows, so a click on REC only
				// cancels instead of reopening the prompt
				window.addEventListener('click', (click) => click.stopImmediatePropagation(), { capture: true, once: true });
				close(null);
			}
		}

		// capture phase on window: runs before the page's own keydown handlers
		window.addEventListener('keydown', onKeyDown, { capture: true });
		window.addEventListener('pointerdown', onPointerDown, { capture: true });
		panel.addEventListener('click', onClick);
		panel.hidden = false;
	});
}

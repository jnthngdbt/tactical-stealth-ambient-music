import { OBJECTIVES } from './mission.ts';
import type { TimelineState } from './timeline.ts';

// Drives the tactical HUD overlay (DOM) from the current TimelineState.
export class Hud {
	private subtitleEl = document.getElementById('hudSubtitle') as HTMLElement;
	private panelEl = document.getElementById('hudPanel') as HTMLElement;
	private codeEl = document.getElementById('hudCode') as HTMLElement;
	private titleEl = document.getElementById('hudObjTitle') as HTMLElement;
	private descEl = document.getElementById('hudDesc') as HTMLElement;
	private progressEl = document.getElementById('hudProgress') as HTMLElement;
	private counterEl = document.getElementById('hudCounter') as HTMLElement;
	private dots: HTMLElement[] = [];

	constructor() {
		const dotsContainer = document.getElementById('hudDots') as HTMLElement;
		OBJECTIVES.forEach((objective) => {
			const dot = document.createElement('div');
			dot.className = 'hud-dot';
			dot.title = `${objective.code} — ${objective.title}`;
			dotsContainer.appendChild(dot);
			this.dots.push(dot);
		});
		this.counterEl.textContent = `00 / ${String(OBJECTIVES.length).padStart(2, '0')}`;
	}

	public update(state: TimelineState) {
		const active = state.activeObjective >= 0 ? OBJECTIVES[state.activeObjective] : null;

		this.panelEl.classList.toggle('visible', !!active);
		if (active) {
			this.codeEl.textContent = active.code;
			this.titleEl.textContent = active.title;
			this.descEl.textContent = active.description;
			this.progressEl.style.width = `${state.holdProgress * 100}%`;
		}

		switch (state.phase) {
			case 'intro':
				this.subtitleEl.textContent = 'FACILITY OVERVIEW';
				break;
			case 'approach':
				this.subtitleEl.textContent = 'ADVANCING TO NEXT OBJECTIVE';
				break;
			case 'hold':
				this.subtitleEl.textContent = 'OBJECTIVE IN PROGRESS';
				break;
			case 'outro':
				this.subtitleEl.textContent = 'MISSION COMPLETE — RETURNING TO OVERWATCH';
				break;
		}

		const completed = Math.min(OBJECTIVES.length, Math.floor(state.pathProgress + 1e-6));
		this.counterEl.textContent = `${String(completed).padStart(2, '0')} / ${String(OBJECTIVES.length).padStart(2, '0')}`;

		this.dots.forEach((dot, i) => {
			dot.classList.toggle('done', state.pathProgress >= i + 1);
			dot.classList.toggle('active', state.activeObjective === i);
		});
	}
}

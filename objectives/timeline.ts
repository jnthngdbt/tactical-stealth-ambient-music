import * as THREE from 'three';
import { OBJECTIVES, OVERVIEW, TIMING } from './mission.ts';

// Smoothstep easing for camera transitions between shots.
function ease(t: number): number {
	return t * t * (3 - 2 * t);
}

// Rotate `pos` around `center` (on the Y axis) by `angle` radians.
function orbit(pos: THREE.Vector3, center: THREE.Vector3, angle: number): THREE.Vector3 {
	const offset = new THREE.Vector3().subVectors(pos, center);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const x = offset.x * cos - offset.z * sin;
	const z = offset.x * sin + offset.z * cos;
	return new THREE.Vector3(center.x + x, pos.y, center.z + z);
}

export type Phase = 'intro' | 'approach' | 'hold' | 'outro';

export interface TimelineState {
	camPos: THREE.Vector3;
	camLookAt: THREE.Vector3;
	activeObjective: number; // index into OBJECTIVES, or -1 while not holding on one
	holdProgress: number; // 0..1 progress within the current hold (for the HUD timer)
	pathProgress: number; // 0..OBJECTIVES.length, how far the mission has advanced
	phase: Phase;
}

interface Segment {
	kind: Phase;
	duration: number;
	objectiveIndex: number; // -1 for intro/outro
}

// Builds and evaluates the briefing's camera choreography. Every shot is
// derived from fixed anchors (the overview shot and each objective's
// close-up), and orbit oscillations always return to their start position,
// so the whole sequence loops without a visible seam.
export class Timeline {
	private segments: Segment[] = [];
	public totalDuration = 0;

	constructor() {
		this.segments.push({ kind: 'intro', duration: TIMING.intro, objectiveIndex: -1 });
		OBJECTIVES.forEach((_, i) => {
			this.segments.push({ kind: 'approach', duration: TIMING.approach, objectiveIndex: i });
			this.segments.push({ kind: 'hold', duration: TIMING.hold, objectiveIndex: i });
		});
		this.segments.push({ kind: 'outro', duration: TIMING.outro, objectiveIndex: -1 });

		this.totalDuration = this.segments.reduce((sum, seg) => sum + seg.duration, 0);
	}

	public evaluate(rawTime: number): TimelineState {
		let localT = rawTime % this.totalDuration;

		for (const seg of this.segments) {
			if (localT <= seg.duration) return this.evaluateSegment(seg, localT);
			localT -= seg.duration;
		}

		return this.evaluateSegment(this.segments[0], 0);
	}

	private evaluateSegment(seg: Segment, localT: number): TimelineState {
		const objectiveCount = OBJECTIVES.length;

		if (seg.kind === 'intro') {
			const angle = TIMING.introOrbitAmplitude * Math.sin((2 * Math.PI * localT) / seg.duration);
			return {
				camPos: orbit(OVERVIEW.pos, OVERVIEW.lookAt, angle),
				camLookAt: OVERVIEW.lookAt.clone(),
				activeObjective: -1,
				holdProgress: 0,
				pathProgress: 0,
				phase: 'intro',
			};
		}

		if (seg.kind === 'outro') {
			const last = OBJECTIVES[objectiveCount - 1];
			const k = ease(THREE.MathUtils.clamp(localT / seg.duration, 0, 1));
			return {
				camPos: last.camPos.clone().lerp(OVERVIEW.pos, k),
				camLookAt: last.target.clone().lerp(OVERVIEW.lookAt, k),
				activeObjective: -1,
				holdProgress: 0,
				pathProgress: objectiveCount,
				phase: 'outro',
			};
		}

		if (seg.kind === 'approach') {
			const objective = OBJECTIVES[seg.objectiveIndex];
			const prevPos = seg.objectiveIndex === 0 ? OVERVIEW.pos : OBJECTIVES[seg.objectiveIndex - 1].camPos;
			const prevLookAt = seg.objectiveIndex === 0 ? OVERVIEW.lookAt : OBJECTIVES[seg.objectiveIndex - 1].target;
			const k = ease(THREE.MathUtils.clamp(localT / seg.duration, 0, 1));
			return {
				camPos: prevPos.clone().lerp(objective.camPos, k),
				camLookAt: prevLookAt.clone().lerp(objective.target, k),
				activeObjective: -1,
				holdProgress: 0,
				pathProgress: seg.objectiveIndex + k,
				phase: 'approach',
			};
		}

		// hold
		const objective = OBJECTIVES[seg.objectiveIndex];
		const angle = TIMING.holdOrbitAmplitude * Math.sin((2 * Math.PI * localT) / seg.duration);
		return {
			camPos: orbit(objective.camPos, objective.target, angle),
			camLookAt: objective.target.clone(),
			activeObjective: seg.objectiveIndex,
			holdProgress: localT / seg.duration,
			pathProgress: seg.objectiveIndex + 1,
			phase: 'hold',
		};
	}
}

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { enuToLocal } from '../tiles.ts';
import * as CONST from '../constants.ts';

export interface SpawnPoint {
	east: number; // metres east of the site origin
	north: number; // metres north of the site origin
}

const UP = new THREE.Vector3(0, 1, 0);

// The shared heading every operator drifts toward, derived once from the
// compass bearing constant (0 = north/+Z, clockwise; tiles frame has +X west).
const SHARED_DIRECTION = new THREE.Vector3(
	-Math.sin(THREE.MathUtils.degToRad(CONST.PATROL_BEARING_DEG)),
	0,
	Math.cos(THREE.MathUtils.degToRad(CONST.PATROL_BEARING_DEG)),
).normalize();

let sharedShadowTexture: THREE.Texture | null = null;

// Soft dark radial gradient used to ground the operator's blob on the
// terrain (like a shadow/heat-signature smudge seen from above), generated
// once and shared.
function getShadowTexture(): THREE.Texture {
	if (sharedShadowTexture) return sharedShadowTexture;

	const size = 128;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
	gradient.addColorStop(0.6, 'rgba(0,0,0,0.4)');
	gradient.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	sharedShadowTexture = new THREE.CanvasTexture(canvas);
	return sharedShadowTexture;
}

// Builds the flat, ground-level square bracket (tactical "target lock"
// reticle) around the operator, matching the HUD's own corner-bracket motif.
function buildReticleGeometry(): THREE.BufferGeometry {
	const s = CONST.OPERATOR_RETICLE_SIZE;
	const c = CONST.OPERATOR_RETICLE_CORNER;
	const corners = [
		[-s, -s],
		[s, -s],
		[-s, s],
		[s, s],
	] as const;

	const points: THREE.Vector3[] = [];
	for (const [cx, cz] of corners) {
		const sx = Math.sign(cx);
		const sz = Math.sign(cz);
		points.push(new THREE.Vector3(cx, 0, cz), new THREE.Vector3(cx - sx * c, 0, cz));
		points.push(new THREE.Vector3(cx, 0, cz), new THREE.Vector3(cx, 0, cz - sz * c));
	}

	return new THREE.BufferGeometry().setFromPoints(points);
}

// A single operator, rendered as a dark, matte silhouette — grounded by a
// soft shadow decal and tagged with a bright square tactical reticle — that
// steadily drifts in the shared patrol direction, creeping cautiously most
// of the time and dashing in occasional brisk bursts, but never stopping.
// Stays clamped to the streaming tiles' ground height.
export class Operator extends THREE.Group {
	private body: THREE.Mesh;
	private head: THREE.Mesh;
	private shadowDecal: THREE.Mesh;
	private shadowMaterial: THREE.MeshBasicMaterial;
	private reticle: THREE.LineSegments;
	private reticleMaterial: THREE.LineBasicMaterial;
	private leaderLine: THREE.Line;
	private leaderMaterial: THREE.LineBasicMaterial;
	private labelEl: HTMLDivElement;

	private spawn = new THREE.Vector3();
	private dashing = false;
	private dashRemaining = 0;
	private groundY = 0;
	private swayPhase = Math.random() * Math.PI * 2;
	private groundSampleCooldown = Math.random() * CONST.GROUND_SAMPLE_INTERVAL;
	private pulsePhase = Math.random() * Math.PI * 2;
	private avoidYaw = 0; // current steering deviation (radians) off the shared heading, going around an obstacle
	private avoidSide = 0; // -1/1 once committed to a side to turn toward, 0 while undecided
	private clearHold = 0; // seconds the path ahead has read clear, gated before straightening back out

	constructor(
		spawnPoint: SpawnPoint,
		name: string,
		color: number = CONST.OPERATOR_COLOR,
	) {
		super();

		// Dark, matte body silhouette — a hunched torso plus a smaller head,
		// non-uniformly scaled and randomly rotated so it reads as a crouching
		// figure rather than a geometric blob, grounded by a soft shadow decal
		// instead of glowing.
		const bodyMaterial = new THREE.MeshBasicMaterial({ color: CONST.OPERATOR_BODY_COLOR, toneMapped: false });

		this.body = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_BODY_RADIUS, 12, 8), bodyMaterial);
		this.body.scale.set(CONST.OPERATOR_BODY_WIDTH_SCALE, CONST.OPERATOR_BODY_HEIGHT_SCALE, CONST.OPERATOR_BODY_DEPTH_SCALE);
		this.body.position.y = CONST.OPERATOR_BODY_RADIUS * CONST.OPERATOR_BODY_HEIGHT_SCALE;

		const bodyTopY = this.body.position.y + CONST.OPERATOR_BODY_RADIUS * CONST.OPERATOR_BODY_HEIGHT_SCALE;
		this.head = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_HEAD_RADIUS, 10, 8), bodyMaterial);
		this.head.position.set((Math.random() - 0.5) * 0.1, bodyTopY + CONST.OPERATOR_HEAD_RADIUS * 0.5, (Math.random() - 0.5) * 0.1);

		// slight random heading so a cluster of operators doesn't look copy-pasted
		this.body.rotation.y = Math.random() * Math.PI * 2;

		this.shadowMaterial = new THREE.MeshBasicMaterial({
			map: getShadowTexture(),
			transparent: true,
			depthWrite: false,
			toneMapped: false,
		});
		this.shadowDecal = new THREE.Mesh(new THREE.CircleGeometry(CONST.OPERATOR_SHADOW_RADIUS, 24), this.shadowMaterial);
		this.shadowDecal.rotation.x = -Math.PI / 2;
		this.shadowDecal.position.y = 0.02;

		// Bright square tactical reticle — a "target lock" bracket, echoing the
		// HUD's own corner-bracket motif — is what actually highlights the body.
		const hex = `#${new THREE.Color(color).getHexString()}`;
		this.reticleMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, toneMapped: false });
		this.reticle = new THREE.LineSegments(buildReticleGeometry(), this.reticleMaterial);
		this.reticle.position.y = 0.04;

		this.add(this.body, this.head, this.shadowDecal, this.reticle);

		// Drone-feed style ID tag: a single diagonal leader line off the
		// operator's head out to a floating callsign label, rendered through
		// CSS2D so the text stays crisp.
		const anchor = new THREE.Vector3(CONST.LABEL_ANCHOR_OFFSET, CONST.LABEL_ANCHOR_HEIGHT, 0);
		this.leaderMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7, toneMapped: false });
		const leaderPoints = [new THREE.Vector3(0, CONST.LABEL_LINE_START_HEIGHT, 0), anchor];
		this.leaderLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(leaderPoints), this.leaderMaterial);
		this.add(this.leaderLine);

		this.labelEl = document.createElement('div');
		this.labelEl.className = 'operator-label';
		this.labelEl.textContent = name;
		this.labelEl.style.color = hex;
		this.labelEl.style.borderLeftColor = hex;
		const label = new CSS2DObject(this.labelEl);
		label.position.copy(anchor);
		label.center.set(0, 0.5);
		this.add(label);

		enuToLocal(spawnPoint.east, spawnPoint.north, 0, this.position);
		this.spawn.copy(this.position);
		this.dashRemaining = THREE.MathUtils.randFloat(CONST.OPERATOR_DASH_INTERVAL_MIN, CONST.OPERATOR_DASH_INTERVAL_MAX);
	}

	// Blends the shared patrol direction with a pull back toward the spawn
	// point once the operator has wandered past the leash radius, so the group
	// keeps advancing together while still looping within the mapped area.
	private computeBaseDirection(): THREE.Vector3 {
		const toSpawn = new THREE.Vector3().subVectors(this.spawn, this.position);
		toSpawn.y = 0;
		const distance = toSpawn.length();
		if (distance <= CONST.PATROL_LEASH_RADIUS) return SHARED_DIRECTION.clone();

		const towardSpawn = toSpawn.normalize();
		const overshoot = THREE.MathUtils.clamp((distance - CONST.PATROL_LEASH_RADIUS) / CONST.PATROL_LEASH_RADIUS, 0, 1);

		// rotate the shared heading toward "back to spawn" by an angle rather
		// than linearly blending the two vectors — once an operator has walked
		// straight out for a while, "back to spawn" ends up nearly opposite
		// SHARED_DIRECTION, and a linear lerp between near-opposite vectors
		// passes through a near-zero vector, stalling the operator in place
		let angle = SHARED_DIRECTION.angleTo(towardSpawn);
		if (SHARED_DIRECTION.x * towardSpawn.z - SHARED_DIRECTION.z * towardSpawn.x < 0) angle = -angle;

		return SHARED_DIRECTION.clone().applyAxisAngle(UP, angle * overshoot);
	}

	// Samples the ground height a bit further along a candidate heading, to
	// check whether walking that way would step onto/off a misclassified
	// rooftop, since the tiles mesh has no road/building tags.
	private probeHeight(heading: THREE.Vector3, sampleGround: (x: number, z: number) => number): number {
		const probe = this.position.clone().addScaledVector(heading, CONST.OBSTACLE_LOOKAHEAD_DISTANCE);
		return sampleGround(probe.x, probe.z);
	}

	// Turns the desired heading away from the direct line to the target by up
	// to a wide angle for as long as the ground ahead keeps stepping up/down
	// (walking around the obstacle's silhouette instead of just offsetting a
	// fixed distance, so even large rooftops get fully skirted), easing back
	// onto the direct heading once the path ahead is flat again. Since this
	// only ever rotates the (unit-length) goal direction, walking speed stays
	// perfectly constant whether avoiding or not.
	private steerAroundObstacles(delta: number, goalDir: THREE.Vector3, sampleGround: (x: number, z: number) => number): THREE.Vector3 {
		const heading = goalDir.clone().applyAxisAngle(UP, this.avoidYaw);

		// check a small fan of angles around the heading, not just dead ahead, so
		// a building edge that isn't exactly in front is still caught early
		const isBlocked = (dir: THREE.Vector3) => Math.abs(this.probeHeight(dir, sampleGround) - this.groundY) > CONST.OBSTACLE_STEP_THRESHOLD;
		const fanLeft = heading.clone().applyAxisAngle(UP, CONST.OBSTACLE_FAN_ANGLE);
		const fanRight = heading.clone().applyAxisAngle(UP, -CONST.OBSTACLE_FAN_ANGLE);
		const blocked = isBlocked(heading) || isBlocked(fanLeft) || isBlocked(fanRight);

		if (blocked) {
			this.clearHold = 0;
			if (this.avoidSide === 0) {
				// first sighting of the obstacle: commit to whichever side looks flatter
				const left = goalDir.clone().applyAxisAngle(UP, CONST.OBSTACLE_PROBE_ANGLE);
				const right = goalDir.clone().applyAxisAngle(UP, -CONST.OBSTACLE_PROBE_ANGLE);
				const leftDiff = Math.abs(this.probeHeight(left, sampleGround) - this.groundY);
				const rightDiff = Math.abs(this.probeHeight(right, sampleGround) - this.groundY);
				this.avoidSide = leftDiff <= rightDiff ? 1 : -1;
			}
			this.avoidYaw = THREE.MathUtils.clamp(
				this.avoidYaw + this.avoidSide * CONST.OBSTACLE_TURN_SPEED * delta,
				-CONST.OBSTACLE_MAX_YAW,
				CONST.OBSTACLE_MAX_YAW,
			);
		} else {
			// require a short run of clear readings before straightening out, so
			// a corner glimpsed as briefly clear doesn't turn straight back into it
			this.clearHold += delta;
			if (this.clearHold >= CONST.OBSTACLE_CLEAR_HOLD) {
				this.avoidSide = 0;
				const step = CONST.OBSTACLE_TURN_SPEED * delta;
				this.avoidYaw = Math.abs(this.avoidYaw) <= step ? 0 : this.avoidYaw - Math.sign(this.avoidYaw) * step;
			}
		}

		return goalDir.clone().applyAxisAngle(UP, this.avoidYaw);
	}

	// Toggles between a steady creep and a brisk dash on a randomized cadence,
	// since speed variety is no longer tied to specific patrol segments.
	private updateDash(delta: number) {
		if (this.dashing) {
			this.dashRemaining -= delta;
			if (this.dashRemaining <= 0) {
				this.dashing = false;
				this.dashRemaining = THREE.MathUtils.randFloat(CONST.OPERATOR_DASH_INTERVAL_MIN, CONST.OPERATOR_DASH_INTERVAL_MAX);
			}
		} else {
			this.dashRemaining -= delta;
			if (this.dashRemaining <= 0) {
				this.dashing = true;
				this.dashRemaining = THREE.MathUtils.randFloat(CONST.OPERATOR_DASH_DURATION_MIN, CONST.OPERATOR_DASH_DURATION_MAX);
			}
		}
	}

	public tick(delta: number, sampleGround: (x: number, z: number) => number) {
		this.updateDash(delta);
		const speed = this.dashing ? CONST.OPERATOR_DASH_SPEED : CONST.OPERATOR_CREEP_SPEED;
		const baseDir = this.computeBaseDirection();
		const heading = this.steerAroundObstacles(delta, baseDir, sampleGround);

		if (!this.dashing) {
			// cautious lateral sway while creeping, as a small nudge to the
			// heading (renormalized below) rather than an extra speed component
			this.swayPhase += delta * 0.9;
			const side = new THREE.Vector3(-heading.z, 0, heading.x);
			heading.addScaledVector(side, Math.sin(this.swayPhase) * CONST.OPERATOR_SWAY).normalize();
		}

		// heading is always unit length, so speed stays exactly constant whether
		// walking straight, swaying, or steering around an obstacle — the operator
		// is always moving, never stopping
		this.position.addScaledVector(heading, speed * delta);

		this.groundSampleCooldown -= delta;
		if (this.groundSampleCooldown <= 0) {
			this.groundSampleCooldown = CONST.GROUND_SAMPLE_INTERVAL;
			this.groundY = sampleGround(this.position.x, this.position.z);
		}
		// ease toward the sampled ground height instead of snapping, so any
		// residual step (the avoidance above can't catch every case) reads as a
		// climb rather than a sudden pop
		const maxVerticalStep = CONST.OPERATOR_VERTICAL_SPEED * delta;
		this.position.y += THREE.MathUtils.clamp(this.groundY - this.position.y, -maxVerticalStep, maxVerticalStep);

		// slow "breathing" pulse on the reticle while creeping, sharper pulse while dashing across the open
		this.pulsePhase += delta * (this.dashing ? 6 : 2.2);
		const pulse = 0.65 + 0.35 * Math.sin(this.pulsePhase);
		this.reticleMaterial.opacity = 0.55 + 0.4 * pulse;
		this.shadowMaterial.opacity = 0.55 + 0.25 * pulse;

		// the ID tag reads brightest while dashing across open ground
		this.leaderMaterial.opacity = 0.4 + 0.4 * pulse;
		this.labelEl.style.opacity = `${0.5 + 0.5 * pulse}`;
	}
}

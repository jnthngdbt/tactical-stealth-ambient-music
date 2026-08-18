import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { enuToLocal } from '../tiles.ts';
import * as CONST from '../constants.ts';

// A single checkpoint in an operator's patrol path.
export interface Checkpoint {
	east: number; // metres east of the site origin
	north: number; // metres north of the site origin
}

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
// walks its configured patrol path, creeping cautiously most of the time and
// dashing in occasional brisk bursts, but never stopping. Stays clamped to
// the streaming tiles' ground height.
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

	private dashing = false;
	private dashRemaining = 0;
	private groundY = 0;
	private groundSampleCooldown = Math.random() * CONST.GROUND_SAMPLE_INTERVAL;
	private pulsePhase = Math.random() * Math.PI * 2;

	// Patrol path (world-local positions) walked in order, reversing
	// direction at either end (ping-pong) once it reaches either checkpoint.
	private path: THREE.Vector3[];
	private pathIndex = 0;
	private pathDirection = 1;

	constructor(
		trajectory: Checkpoint[],
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

		this.path = trajectory.map((checkpoint) => enuToLocal(checkpoint.east, checkpoint.north, 0));

		// the first checkpoint doubles as the spawn point
		this.position.copy(this.path[0] ?? new THREE.Vector3());
		this.dashRemaining = THREE.MathUtils.randFloat(CONST.OPERATOR_DASH_INTERVAL_MIN, CONST.OPERATOR_DASH_INTERVAL_MAX);
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

	// Walks straight toward the current checkpoint, advancing (and reversing
	// direction at either end, ping-pong style) once arrived. Checkpoints
	// were hand-placed to dodge obstacles, so no avoidance steering is
	// applied here — the path itself is trusted.
	private tickPath(delta: number, speed: number) {
		const target = this.path[this.pathIndex];
		const toTarget = new THREE.Vector3().subVectors(target, this.position);
		toTarget.y = 0;
		const distance = toTarget.length();

		if (distance <= CONST.PATH_ARRIVAL_RADIUS) {
			const next = this.pathIndex + this.pathDirection;
			if (next < 0 || next >= this.path.length) this.pathDirection *= -1;
			this.pathIndex += this.pathDirection;
			return;
		}

		const heading = toTarget.normalize();
		this.position.addScaledVector(heading, Math.min(speed * delta, distance));
	}

	public tick(delta: number, sampleGround: (x: number, z: number) => number) {
		this.updateDash(delta);
		const speed = this.dashing ? CONST.OPERATOR_DASH_SPEED : CONST.OPERATOR_CREEP_SPEED;

		if (this.path.length >= 2) this.tickPath(delta, speed);

		this.groundSampleCooldown -= delta;
		if (this.groundSampleCooldown <= 0) {
			this.groundSampleCooldown = CONST.GROUND_SAMPLE_INTERVAL;
			this.groundY = sampleGround(this.position.x, this.position.z);
		}
		// ease toward the sampled ground height instead of snapping, so any
		// terrain step reads as a climb rather than a sudden pop
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

	// Frees GPU resources and the CSS2D label DOM node — called when tearing
	// down cinematic mode (see main.ts's mode toggle) so switching back and
	// forth doesn't leak geometry/materials/labels each time.
	public dispose() {
		this.body.geometry.dispose();
		this.head.geometry.dispose();
		(this.body.material as THREE.Material).dispose();
		this.shadowDecal.geometry.dispose();
		this.shadowMaterial.dispose();
		this.reticle.geometry.dispose();
		this.reticleMaterial.dispose();
		this.leaderLine.geometry.dispose();
		this.leaderMaterial.dispose();
		this.labelEl.remove();
	}
}

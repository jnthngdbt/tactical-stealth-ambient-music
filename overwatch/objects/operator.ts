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

let sharedHaloTexture: THREE.Texture | null = null;

// Same soft-edged gradient idea as the ground shadow, but opaque at its core
// and meant to sit behind the body/head spheres — since it's a camera-facing
// sprite (always billboarded) rather than geometry, depth testing lets only
// the fringe beyond the solid silhouette show through, feathering the
// otherwise hard sphere edge without a real (expensive) blur pass.
function getHaloTexture(): THREE.Texture {
	if (sharedHaloTexture) return sharedHaloTexture;

	const size = 128;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0, 'rgba(0,0,0,0.9)');
	gradient.addColorStop(0.35, 'rgba(0,0,0,0.5)');
	gradient.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	sharedHaloTexture = new THREE.CanvasTexture(canvas);
	return sharedHaloTexture;
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
// dashing in occasional brisk bursts, but never stopping. Altitude is linearly
// interpolated between the current leg's two checkpoints (each sampled once
// against the streaming tiles) rather than raycast continuously at the
// operator's own position, so a stray prop/tree mesh between checkpoints
// can't yank the operator up onto it.
export class Operator extends THREE.Group {
	private body: THREE.Mesh;
	private head: THREE.Mesh;
	private leftLeg: THREE.Mesh;
	private rightLeg: THREE.Mesh;
	private headBasePosition: THREE.Vector3;
	private leftLegBasePosition: THREE.Vector3;
	private rightLegBasePosition: THREE.Vector3;
	private idlePhase = Math.random() * Math.PI * 2;
	private walkPhase = Math.random() * Math.PI * 2;
	private bodyMaterial: THREE.MeshBasicMaterial;
	private haloSprite: THREE.Sprite;
	private haloMaterial: THREE.SpriteMaterial;
	private shadowDecal: THREE.Mesh;
	private shadowMaterial: THREE.MeshBasicMaterial;
	private reticle: THREE.LineSegments;
	private reticleMaterial: THREE.LineBasicMaterial;
	private leaderLine: THREE.Line;
	private leaderMaterial: THREE.LineBasicMaterial;
	private tagEl: HTMLDivElement;
	private labelEl: HTMLDivElement;

	private dashing = false;
	private dashRemaining = 0;
	private pulsePhase = Math.random() * Math.PI * 2;

	// Patrol path (world-local positions) walked in order, reversing
	// direction at either end (ping-pong) once it reaches either checkpoint.
	private path: THREE.Vector3[];
	private pathIndex = 0;
	private pathDirection = 1;

	// Altitude of the current leg's two endpoints (checkpoint indices), each
	// sampled once against the tiles rather than re-raycast every frame along
	// the way — the operator's height is linearly interpolated between them
	// based on how far along the leg it has walked.
	private legFromIndex = 0;
	private legFromAltitude = 0;
	private legToAltitude = 0;
	private legFromReady = false; // the leg's *start* checkpoint has a real (non-NaN) sample
	private legToReady = false; // the leg's *end* checkpoint has a real (non-NaN) sample
	private hasSnappedToGround = false; // true once the very first real sample has placed the operator
	private altitudeSampleCooldown = Math.random() * CONST.GROUND_SAMPLE_INTERVAL;

	constructor(
		trajectory: Checkpoint[],
		name: string,
		color: number = CONST.OPERATOR_COLOR,
	) {
		super();

		// Dark, matte body silhouette — a hunched torso plus a smaller head,
		// non-uniformly scaled and randomly rotated so it reads as a crouching
		// figure rather than a geometric blob, grounded by a soft shadow decal
		// instead of glowing. Kept semi-transparent (fixed opacity, not
		// pulsing) rather than fully opaque, to soften the contrast against
		// the terrain.
		this.bodyMaterial = new THREE.MeshBasicMaterial({
			color: CONST.OPERATOR_BODY_COLOR,
			transparent: true,
			opacity: CONST.OPERATOR_BODY_OPACITY_BASE,
			toneMapped: false,
		});

		this.body = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_BODY_RADIUS, 12, 8), this.bodyMaterial);
		this.body.scale.set(CONST.OPERATOR_BODY_WIDTH_SCALE, CONST.OPERATOR_BODY_HEIGHT_SCALE, CONST.OPERATOR_BODY_DEPTH_SCALE);
		this.body.position.y = CONST.OPERATOR_BODY_RADIUS * CONST.OPERATOR_BODY_HEIGHT_SCALE;

		const bodyTopY = this.body.position.y + CONST.OPERATOR_BODY_RADIUS * CONST.OPERATOR_BODY_HEIGHT_SCALE;
		this.head = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_HEAD_RADIUS, 10, 8), this.bodyMaterial);
		this.head.position.set((Math.random() - 0.5) * 0.1, bodyTopY + CONST.OPERATOR_HEAD_RADIUS * 0.5, (Math.random() - 0.5) * 0.1);

		// Two "leg" spheres under the torso, sunk deep enough into it
		// (OPERATOR_LEG_OVERLAP) to read as legs growing out of the body
		// rather than floating balls stuck underneath.
		const legOffsetY =
			(CONST.OPERATOR_BODY_RADIUS * CONST.OPERATOR_BODY_HEIGHT_SCALE + CONST.OPERATOR_LEG_RADIUS) *
			(1 - CONST.OPERATOR_LEG_OVERLAP);
		const legY = this.body.position.y - legOffsetY;
		this.leftLeg = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_LEG_RADIUS, 10, 8), this.bodyMaterial);
		this.leftLeg.position.set(-CONST.OPERATOR_LEG_SPREAD, legY, 0);
		this.rightLeg = new THREE.Mesh(new THREE.SphereGeometry(CONST.OPERATOR_LEG_RADIUS, 10, 8), this.bodyMaterial);
		this.rightLeg.position.set(CONST.OPERATOR_LEG_SPREAD, legY, 0);

		// resting positions the idle sway / leg swing (see tick) oscillate around
		this.headBasePosition = this.head.position.clone();
		this.leftLegBasePosition = this.leftLeg.position.clone();
		this.rightLegBasePosition = this.rightLeg.position.clone();

		// slight random heading so a cluster of operators doesn't look copy-pasted
		this.body.rotation.y = Math.random() * Math.PI * 2;

		// Soft blurred fringe: a billboard sprite sitting behind the solid body/head,
		// sized a bit larger so only its feathered edge peeks out past the hard
		// sphere silhouette, softening the contrast against the terrain.
		this.haloMaterial = new THREE.SpriteMaterial({
			map: getHaloTexture(),
			color: CONST.OPERATOR_BODY_COLOR,
			transparent: true,
			depthWrite: false,
			opacity: CONST.OPERATOR_HALO_OPACITY,
			toneMapped: false,
		});
		this.haloSprite = new THREE.Sprite(this.haloMaterial);
		this.haloSprite.scale.setScalar(CONST.OPERATOR_HALO_SIZE);
		this.haloSprite.position.y = bodyTopY * 0.6;

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

		this.add(this.haloSprite, this.body, this.head, this.leftLeg, this.rightLeg, this.shadowDecal, this.reticle);

		// Drone-feed style ID tag: a diagonal leader line off the operator's
		// head out to a floating callsign label. The label is a DOM element
		// (CSS2DObject) laid out with a fixed pixel offset from the head, so
		// it never changes position/angle as the camera orbits. The line
		// needs the same camera-independent screen placement, but rendering
		// it as DOM (a rotated div) looked flat and aliased compared to the
		// old real WebGL line — so instead it's a genuine THREE.Line (crisp,
		// catches bloom like the reticle) whose two endpoints are recomputed
		// every frame in updateLeaderLine() to project onto those same fixed
		// screen pixels, keeping the "3D line" look while staying rotation-independent.
		this.leaderMaterial = new THREE.LineBasicMaterial({
			color,
			transparent: true,
			opacity: 0.7,
			toneMapped: false,
			depthTest: false, // always visible through terrain/buildings, like the DOM label it leads to
		});
		this.leaderLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), this.leaderMaterial);
		this.leaderLine.frustumCulled = false; // endpoints are recomputed in screen space, not bounded by local geometry
		this.leaderLine.renderOrder = 999; // draw after opaque scene geometry so depthTest:false doesn't get overpainted
		this.add(this.leaderLine);

		const angleRad = THREE.MathUtils.degToRad(CONST.LABEL_LINE_ANGLE_DEG);
		const dx = CONST.LABEL_LINE_LENGTH_PX * Math.cos(angleRad);
		const dy = -CONST.LABEL_LINE_LENGTH_PX * Math.sin(angleRad); // screen Y grows downward, so "up" is negative

		this.tagEl = document.createElement('div');
		this.tagEl.className = 'operator-tag';

		this.labelEl = document.createElement('div');
		this.labelEl.className = 'operator-label';
		this.labelEl.textContent = name;
		this.labelEl.style.color = hex;
		this.labelEl.style.borderLeftColor = hex;
		this.labelEl.style.left = `${dx}px`;
		this.labelEl.style.top = `${dy}px`;
		this.tagEl.appendChild(this.labelEl);

		const tag = new CSS2DObject(this.tagEl);
		tag.position.set(0, CONST.LABEL_ANCHOR_HEIGHT, 0);
		this.add(tag);

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
			this.legFromIndex = this.pathIndex;
			const next = this.pathIndex + this.pathDirection;
			if (next < 0 || next >= this.path.length) this.pathDirection *= -1;
			this.pathIndex += this.pathDirection;
			// the new leg's start is exactly the checkpoint we just left, whose
			// altitude we already know — carry it over instead of losing
			// readiness and waiting on a fresh sample for a spot already visited
			this.legFromAltitude = this.legToAltitude;
			this.legFromReady = this.legToReady;
			this.legToReady = false;
			return;
		}

		const heading = toTarget.normalize();
		this.position.addScaledVector(heading, Math.min(speed * delta, distance));
	}

	public tick(delta: number, sampleGround: (x: number, z: number) => number, camera: THREE.Camera) {
		this.updateDash(delta);
		const speed = this.dashing ? CONST.OPERATOR_DASH_SPEED : CONST.OPERATOR_CREEP_SPEED;

		const legBefore = this.legFromIndex;
		const targetBefore = this.pathIndex;
		this.tickPath(delta, speed);
		const legChanged = this.legFromIndex !== legBefore || this.pathIndex !== targetBefore;

		let targetY: number | null = null;
		this.altitudeSampleCooldown -= delta;
		if (!this.legFromReady || !this.legToReady || legChanged || this.altitudeSampleCooldown <= 0) {
			this.altitudeSampleCooldown = CONST.GROUND_SAMPLE_INTERVAL;
			const from = this.path[this.legFromIndex];
			const to = this.path[this.pathIndex];
			const fromSample = sampleGround(from.x, from.z);
			const toSample = sampleGround(to.x, to.z);
			// keep the last real sample instead of overwriting it with NaN
			// (an unloaded spot), which would otherwise pull the leg flat
			if (!Number.isNaN(fromSample)) { this.legFromAltitude = fromSample; this.legFromReady = true; }
			if (!Number.isNaN(toSample)) { this.legToAltitude = toSample; this.legToReady = true; }
		}

		// only the *start* checkpoint needs to be ready to place the operator —
		// right at spawn/leg-start the walked fraction is ~0, so the still-
		// loading far endpoint doesn't matter yet (and self-corrects once its
		// own sample arrives, well before the operator gets close to it)
		if (this.legFromReady) {
			// interpolate by how far along the leg we've walked (horizontal
			// distance only — this.position.y already carries real altitude,
			// so mixing it into a 3D distanceTo would throw off the ratio)
			const from = this.path[this.legFromIndex];
			const to = this.path[this.pathIndex];
			const legLength = Math.hypot(to.x - from.x, to.z - from.z);
			const remaining = Math.hypot(to.x - this.position.x, to.z - this.position.z);
			const t = legLength > 1e-4 ? THREE.MathUtils.clamp(1 - remaining / legLength, 0, 1) : 1;
			targetY = THREE.MathUtils.lerp(this.legFromAltitude, this.legToAltitude, t) + CONST.OPERATOR_GROUND_OFFSET;
		}

		if (targetY !== null) {
			if (!this.hasSnappedToGround) {
				// snap straight to the checkpoint's altitude the first time tiles
				// have actually loaded here, instead of easing/falling from y=0
				this.hasSnappedToGround = true;
				this.position.y = targetY;
			} else {
				// ease toward the target altitude instead of snapping, so any
				// change still reads as a climb rather than a sudden pop
				const maxVerticalStep = CONST.OPERATOR_VERTICAL_SPEED * delta;
				this.position.y += THREE.MathUtils.clamp(targetY - this.position.y, -maxVerticalStep, maxVerticalStep);
			}
		}

		// slow "breathing" pulse on the reticle while creeping, sharper pulse while dashing across the open
		this.pulsePhase += delta * (this.dashing ? 6 : 2.2);
		const pulse = 0.65 + 0.35 * Math.sin(this.pulsePhase);
		this.reticleMaterial.opacity = 0.55 + 0.4 * pulse;
		this.shadowMaterial.opacity = 0.55 + 0.25 * pulse;

		this.updateIdleSway(delta);
		this.updateLegSwing(delta, speed);
		this.updateLeaderLine(camera);
	}

	// Recomputes the 3D leader line's two endpoints every frame so that, once
	// projected through the current camera, they always land on the same fixed
	// screen pixels (anchor + gap, through to anchor + gap + length) — matching
	// the label's fixed on-screen offset above regardless of camera rotation,
	// while still being real WebGL geometry (so it stays crisp and catches
	// bloom like the reticle, instead of looking like a flat rotated DOM div).
	private updateLeaderLine(camera: THREE.Camera) {
		this.updateMatrixWorld();
		const anchorWorld = new THREE.Vector3(0, CONST.LABEL_ANCHOR_HEIGHT, 0).applyMatrix4(this.matrixWorld);
		const anchorNdc = anchorWorld.clone().project(camera);

		const width = window.innerWidth;
		const height = window.innerHeight;
		const anchorPx = new THREE.Vector2((anchorNdc.x + 1) * 0.5 * width, (1 - anchorNdc.y) * 0.5 * height);

		const angleRad = THREE.MathUtils.degToRad(CONST.LABEL_LINE_ANGLE_DEG);
		const dirPx = new THREE.Vector2(Math.cos(angleRad), -Math.sin(angleRad)); // screen Y grows downward
		const lineLength = CONST.LABEL_LINE_LENGTH_PX - CONST.LABEL_LINE_GAP_START_PX - CONST.LABEL_LINE_GAP_END_PX;

		// same NDC depth as the anchor for both ends, so unprojecting places them
		// on the screen-facing plane through the anchor (constant view-space z)
		const pxToWorld = (px: THREE.Vector2) =>
			new THREE.Vector3((px.x / width) * 2 - 1, 1 - (px.y / height) * 2, anchorNdc.z).unproject(camera);

		const startWorld = pxToWorld(anchorPx.clone().addScaledVector(dirPx, CONST.LABEL_LINE_GAP_START_PX));
		const endWorld = pxToWorld(anchorPx.clone().addScaledVector(dirPx, CONST.LABEL_LINE_GAP_START_PX + lineLength));

		const toLocal = new THREE.Matrix4().copy(this.matrixWorld).invert();
		const startLocal = startWorld.applyMatrix4(toLocal);
		const endLocal = endWorld.applyMatrix4(toLocal);

		const position = this.leaderLine.geometry.attributes.position as THREE.BufferAttribute;
		position.setXYZ(0, startLocal.x, startLocal.y, startLocal.z);
		position.setXYZ(1, endLocal.x, endLocal.y, endLocal.z);
		position.needsUpdate = true;
	}

	// Subtle bob/sway on the head, so the operator never reads as a frozen
	// statue even between the leg swing's steps.
	private updateIdleSway(delta: number) {
		this.idlePhase += delta * CONST.OPERATOR_IDLE_SWAY_SPEED;
		const amount = CONST.OPERATOR_IDLE_SWAY_AMOUNT;

		this.head.position.set(
			this.headBasePosition.x + Math.sin(this.idlePhase) * amount,
			this.headBasePosition.y + Math.sin(this.idlePhase * 1.6 + 1.1) * amount * 0.6,
			this.headBasePosition.z,
		);
	}

	// Alternating forward/back leg stride, its phase driven by distance
	// walked (speed * delta) rather than raw time, so a dash burst visibly
	// quickens the stride instead of just ticking a fixed-rate clock.
	private updateLegSwing(delta: number, speed: number) {
		this.walkPhase += delta * speed * CONST.OPERATOR_LEG_SWING_RATE;
		const leftStride = Math.sin(this.walkPhase);
		const rightStride = -leftStride;

		this.leftLeg.position.set(
			this.leftLegBasePosition.x,
			this.leftLegBasePosition.y + Math.max(0, leftStride) * CONST.OPERATOR_LEG_SWING_LIFT,
			this.leftLegBasePosition.z + leftStride * CONST.OPERATOR_LEG_SWING_DISTANCE,
		);

		this.rightLeg.position.set(
			this.rightLegBasePosition.x,
			this.rightLegBasePosition.y + Math.max(0, rightStride) * CONST.OPERATOR_LEG_SWING_LIFT,
			this.rightLegBasePosition.z + rightStride * CONST.OPERATOR_LEG_SWING_DISTANCE,
		);
	}

	// True once this operator's altitude reflects a real tile sample rather
	// than its coordinate-space y=0 default — lets the camera (see app.ts)
	// hold off following the group centroid until every operator's real
	// ground height is known, instead of chasing a moving target while
	// tiles are still streaming in.
	public isGroundReady(): boolean {
		return this.hasSnappedToGround;
	}

	// Frees GPU resources and the CSS2D label DOM node — called when tearing
	// down cinematic mode (see main.ts's mode toggle) so switching back and
	// forth doesn't leak geometry/materials/labels each time.
	public dispose() {
		this.body.geometry.dispose();
		this.head.geometry.dispose();
		this.leftLeg.geometry.dispose();
		this.rightLeg.geometry.dispose();
		(this.body.material as THREE.Material).dispose();
		this.haloMaterial.dispose();
		this.shadowDecal.geometry.dispose();
		this.shadowMaterial.dispose();
		this.reticle.geometry.dispose();
		this.reticleMaterial.dispose();
		this.leaderLine.geometry.dispose();
		this.leaderMaterial.dispose();
		this.tagEl.remove();
	}
}

import type * as THREE from 'three';
import type { NightGradingPass } from './NightGradingPass.ts';
import { setTerrainDimColor } from './tiles.ts';
import { setOperatorBodyColor } from './objects/operator.ts';
import * as CONST from './constants.ts';

// Applies a named vibe preset (constants.ts's VIBE_PRESETS) to an
// already-running render pipeline, in place — shared by cinematic mode
// (main.ts) and the path editor (pathEditor.ts) so Alt+1..4 behaves
// identically in both instead of two separate copies drifting apart.
export function applyVibe(name: CONST.VibeName, renderer: THREE.WebGLRenderer, nightPass: NightGradingPass): void {
	const preset = CONST.VIBE_PRESETS[name];
	renderer.setClearColor(preset.backgroundColor);
	nightPass.uniforms.tint.value.setHex(preset.nightTint);
	nightPass.uniforms.saturation.value = preset.nightSaturation;
	nightPass.uniforms.vignette.value = preset.nightVignette;
	setTerrainDimColor(preset.terrainDimColor);
	setOperatorBodyColor(preset.operatorBodyColor);
}

export function vibeLabel(name: CONST.VibeName): string {
	if (name === 'moonlit') return 'Moonlit';
	if (name === 'grayscale') return 'Grayscale';
	if (name === 'thermal') return 'Thermal';
	return 'Cinematic';
}

// Alt+digit shortcut → vibe, shared by main.ts and pathEditor.ts.
const VIBE_BY_KEY: Record<string, CONST.VibeName> = {
	'1': 'cinematic',
	'2': 'moonlit',
	'3': 'grayscale',
	'4': 'thermal',
};

export function vibeForKey(event: KeyboardEvent): CONST.VibeName | null {
	if (!event.altKey) return null;
	// event.code so Alt+digit still resolves on layouts where Alt changes event.key
	const digit = event.code.startsWith('Digit') ? event.code.slice(5) : event.key;
	return VIBE_BY_KEY[digit] ?? null;
}

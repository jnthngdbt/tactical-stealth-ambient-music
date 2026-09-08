import type * as THREE from 'three';
import type { NightGradingPass } from './NightGradingPass.ts';
import { setTerrainDimColor } from './tiles.ts';
import * as CONST from './constants.ts';

// Applies a named vibe preset (constants.ts's VIBE_PRESETS) to an
// already-running render pipeline, in place — shared by cinematic mode
// (main.ts) and the path editor (pathEditor.ts) so Alt+1/2 behaves
// identically in both instead of two separate copies drifting apart.
export function applyVibe(name: CONST.VibeName, renderer: THREE.WebGLRenderer, nightPass: NightGradingPass): void {
	const preset = CONST.VIBE_PRESETS[name];
	renderer.setClearColor(preset.backgroundColor);
	nightPass.uniforms.tint.value.setHex(preset.nightTint);
	nightPass.uniforms.saturation.value = preset.nightSaturation;
	nightPass.uniforms.vignette.value = preset.nightVignette;
	setTerrainDimColor(preset.terrainDimColor);
}

export function vibeLabel(name: CONST.VibeName): string {
	return name === 'moonlit' ? 'Moonlit' : 'Cinematic';
}

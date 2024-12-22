import{O as Y,h as L,B as G,F as I,g as f,U as T,a as h,n as g,H as v,N as K,o as Q,e as S,V as p,A as Z,f as H,p as q,q as b,r as J,s as $,c as ee,d as te,W as ie,t as se,u as V,v as re,i as ae,b as E}from"./three.module-Cy7qVQ5_.js";const O={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class c{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const oe=new Y(-1,1,1,-1,0,1);class ne extends G{constructor(){super(),this.setAttribute("position",new I([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new I([0,2,0,0,2,0],2))}}const le=new ne;class M{constructor(e){this._mesh=new L(le,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,oe)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class W extends c{constructor(e,i){super(),this.textureID=i!==void 0?i:"tDiffuse",e instanceof f?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=T.clone(e.uniforms),this.material=new f({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new M(this.material)}render(e,i,t){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=t.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class N extends c{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,t){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,u;this.inverse?(o=0,u=1):(o=1,u=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(u),s.buffers.stencil.setLocked(!0),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class he extends c{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ue{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const t=e.getSize(new h);this._width=t.width,this._height=t.height,i=new g(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:v}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new W(O),this.copyPass.material.blending=K,this.clock=new Q}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const i=this.renderer.getRenderTarget();let t=!1;for(let r=0,s=this.passes.length;r<s;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,t),o.needsSwap){if(t){const u=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}N!==void 0&&(o instanceof N?t=!0:o instanceof he&&(t=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new h);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const t=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(t,r),this.renderTarget2.setSize(t,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(t,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class de extends c{constructor(e,i,t=null,r=null,s=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=t,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new S}render(e,i,t){const r=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:t),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const fe={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new S(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class x extends c{constructor(e,i,t,r){super(),this.strength=i!==void 0?i:1,this.radius=t,this.threshold=r,this.resolution=e!==void 0?new h(e.x,e.y):new h(256,256),this.clearColor=new S(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new g(s,o,{type:v}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const y=new g(s,o,{type:v});y.texture.name="UnrealBloomPass.h"+d,y.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(y);const R=new g(s,o,{type:v});R.texture.name="UnrealBloomPass.v"+d,R.texture.generateMipmaps=!1,this.renderTargetsVertical.push(R),s=Math.round(s/2),o=Math.round(o/2)}const u=fe;this.highPassUniforms=T.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new f({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(n[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new h(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const X=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=X,this.bloomTintColors=[new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const C=O;this.copyUniforms=T.clone(C.uniforms),this.blendMaterial=new f({uniforms:this.copyUniforms,vertexShader:C.vertexShader,fragmentShader:C.fragmentShader,blending:Z,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new S,this.oldClearAlpha=1,this.basic=new H,this.fsQuad=new M(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,i){let t=Math.round(e/2),r=Math.round(i/2);this.renderTargetBright.setSize(t,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(t,r),this.renderTargetsVertical[s].setSize(t,r),this.separableBlurMaterials[s].uniforms.invSize.value=new h(1/t,1/r),t=Math.round(t/2),r=Math.round(r/2)}render(e,i,t,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=t.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=t.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let u=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[n].uniforms.direction.value=x.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=x.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this.fsQuad.render(e),u=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const i=[];for(let t=0;t<e;t++)i.push(.39894*Math.exp(-.5*t*t/(e*e))/e);return new f({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new h(.5,.5)},direction:{value:new h(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new f({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}x.BlurDirectionX=new h(1,0);x.BlurDirectionY=new h(0,1);class ce extends c{constructor(e,i,t,r={}){super(),this.pixelSize=e,this.resolution=new h,this.renderResolution=new h,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new q,this.fsQuad=new M(this.pixelatedMaterial),this.scene=i,this.camera=t,this.normalEdgeStrength=r.normalEdgeStrength||.3,this.depthEdgeStrength=r.depthEdgeStrength||.4,this.beautyRenderTarget=new g,this.beautyRenderTarget.texture.minFilter=b,this.beautyRenderTarget.texture.magFilter=b,this.beautyRenderTarget.texture.type=v,this.beautyRenderTarget.depthTexture=new J,this.normalRenderTarget=new g,this.normalRenderTarget.texture.minFilter=b,this.normalRenderTarget.texture.magFilter=b,this.normalRenderTarget.texture.type=v}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(e,i){this.resolution.set(e,i),this.renderResolution.set(e/this.pixelSize|0,i/this.pixelSize|0);const{x:t,y:r}=this.renderResolution;this.beautyRenderTarget.setSize(t,r),this.normalRenderTarget.setSize(t,r),this.fsQuad.material.uniforms.resolution.value.set(t,r,1/t,1/r)}setPixelSize(e){this.pixelSize=e,this.setSize(this.resolution.x,this.resolution.y)}render(e,i){const t=this.fsQuad.material.uniforms;t.normalEdgeStrength.value=this.normalEdgeStrength,t.depthEdgeStrength.value=this.depthEdgeStrength,e.setRenderTarget(this.beautyRenderTarget),e.render(this.scene,this.camera);const r=this.scene.overrideMaterial;e.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,e.render(this.scene,this.camera),this.scene.overrideMaterial=r,t.tDiffuse.value=this.beautyRenderTarget.texture,t.tDepth.value=this.beautyRenderTarget.depthTexture,t.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(i),this.clear&&e.clear()),this.fsQuad.render(e)}createPixelatedMaterial(){return new f({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new $(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D tDiffuse;
				uniform sampler2D tDepth;
				uniform sampler2D tNormal;
				uniform vec4 resolution;
				uniform float normalEdgeStrength;
				uniform float depthEdgeStrength;
				varying vec2 vUv;

				float getDepth(int x, int y) {

					return texture2D( tDepth, vUv + vec2(x, y) * resolution.zw ).r;

				}

				vec3 getNormal(int x, int y) {

					return texture2D( tNormal, vUv + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;

				}

				float depthEdgeIndicator(float depth, vec3 normal) {

					float diff = 0.0;
					diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
					return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;

				}

				float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {

					float depthDiff = getDepth(x, y) - depth;
					vec3 neighborNormal = getNormal(x, y);

					// Edge pixels should yield to faces who's normals are closer to the bias normal.
					vec3 normalEdgeBias = vec3(1., 1., 1.); // This should probably be a parameter.
					float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
					float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

					// Only the shallower pixel should detect the normal edge.
					float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);

					return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;

				}

				float normalEdgeIndicator(float depth, vec3 normal) {

					float indicator = 0.0;

					indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
					indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
					indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
					indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);

					return step(0.1, indicator);

				}

				void main() {

					vec4 texel = texture2D( tDiffuse, vUv );

					float depth = 0.0;
					vec3 normal = vec3(0.0);

					if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {

						depth = getDepth(0, 0);
						normal = getNormal(0, 0);

					}

					float dei = 0.0;
					if (depthEdgeStrength > 0.0)
						dei = depthEdgeIndicator(depth, normal);

					float nei = 0.0;
					if (normalEdgeStrength > 0.0)
						nei = normalEdgeIndicator(depth, normal);

					float Strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);

					gl_FragColor = texel * Strength;

				}
			`})}}const me={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};class pe extends c{constructor(e=.5,i=!1){super();const t=me;this.uniforms=T.clone(t.uniforms),this.material=new f({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=i,this.fsQuad=new M(this.material)}render(e,i,t,r){this.uniforms.tDiffuse.value=t.texture,this.uniforms.time.value+=r,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const U=.7,z=3,ge=.05,ve=.2,xe=1,we=3,B=new ee,l=new te(75,window.innerWidth/window.innerHeight,.1,1e3);l.position.z=2;const w=new ie;w.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(w.domElement);w.toneMapping=se;w.outputColorSpace=V;const be=new re;be.load("https://cdn.midjourney.com/9b6e2976-aa7a-4cda-b089-1a481818df87/0_1.png",a=>{a.colorSpace=V;const e=a.image.width/a.image.height,i=new ae(10,10/e),t=new H({map:a}),r=new L(i,t);B.add(r)});const m=new ue(w);m.addPass(new de(B,l));const Te={uniforms:{tDiffuse:{value:null},time:{value:0},noiseIntensity:{value:.1}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float noiseIntensity;

    // Random function
    float random(vec2 uv) {
      return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123) - 0.5;
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float noise = random(vUv + time);
      gl_FragColor = vec4(color.rgb + noise * noiseIntensity, color.a);
    }
  `},D=new W(Te);m.addPass(D);const k=new ce(5,B,l);m.addPass(k);const Se=new pe(1.5);m.addPass(Se);const Me=new x(new h(window.innerWidth,window.innerHeight),.2,.4,.85);m.addPass(Me);let F=!1,_=new h,P=new p;window.addEventListener("mousedown",a=>{F=!0,_.set(a.clientX,a.clientY),P.copy(l.position)});window.addEventListener("mousemove",a=>{if(F){const i=(a.clientX-_.x)/window.innerWidth,t=(a.clientY-_.y)/window.innerHeight;var e=8;l.position.x=P.x+i*e,l.position.y=P.y-t*e}});window.addEventListener("mouseup",()=>{F=!1});window.addEventListener("wheel",a=>{var e=.001;l.position.z+=a.deltaY*e*l.position.z,l.position.z=E.clamp(l.position.z,U,z)});window.addEventListener("resize",()=>{l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight),m.setSize(window.innerWidth,window.innerHeight)});const A=.0015,Ce=2,ye=new Q;function j(){const a=ye.getElapsedTime();D.uniforms.time.value=a,D.uniforms.noiseIntensity.value=De(l.position.z),k.setPixelSize(Re(l.position.z));{const e=performance.now()/Ce;l.position.x+=Math.sin(e)*A*(Math.random()-.5),l.position.y+=Math.cos(e)*A*(Math.random()-.5)}requestAnimationFrame(j),m.render()}function Re(a){return E.mapLinear(a,U,z,we,xe)}function De(a){return E.mapLinear(a,U,z,ve,ge)}j();

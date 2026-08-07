var q=Object.defineProperty;var ee=(a,e,t)=>e in a?q(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var l=(a,e,t)=>ee(a,typeof e!="symbol"?e+"":e,t);import{U as D,I as te,J as ie,K as oe,N as re,O as se,X as ae,Y as ne,Z as le,_ as ce,e as d,a as m,$ as A,a0 as B,g as E,V as u,a1 as ue,f as M,c as he,W as de,a2 as me,d as pe,b as L,G as F,i as ge,h as S,a3 as fe,m as ve,v as be,a4 as Me,r as W,D as Q,a5 as Te,a6 as Ce,a7 as we,B as xe,j as Se,a8 as Ee,o as Ie}from"./three.module-DP9u_-zm.js";import{P as X,F as J,C as Pe,E as Re,R as _e}from"./RenderPass-BhvcOfrW.js";const ye={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Oe extends X{constructor(){super();const e=ye;this.uniforms=D.clone(e.uniforms),this.material=new te({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new J(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ie.getTransfer(this._outputColorSpace)===oe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===re?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===se?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ae?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ne?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===le?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ce&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Ae={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new d(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class T extends X{constructor(e,t,i,s){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new m(e.x,e.y):new m(256,256),this.clearColor=new d(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new A(o,r,{type:B}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let p=0;p<this.nMips;p++){const y=new A(o,r,{type:B});y.texture.name="UnrealBloomPass.h"+p,y.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(y);const O=new A(o,r,{type:B});O.texture.name="UnrealBloomPass.v"+p,O.texture.generateMipmaps=!1,this.renderTargetsVertical.push(O),o=Math.round(o/2),r=Math.round(r/2)}const n=Ae;this.highPassUniforms=D.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new E({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];o=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let p=0;p<this.nMips;p++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[p])),this.separableBlurMaterials[p].uniforms.invSize.value=new m(1/o,1/r),o=Math.round(o/2),r=Math.round(r/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new u(1,1,1),new u(1,1,1),new u(1,1,1),new u(1,1,1),new u(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const C=Pe;this.copyUniforms=D.clone(C.uniforms),this.blendMaterial=new E({uniforms:this.copyUniforms,vertexShader:C.vertexShader,fragmentShader:C.fragmentShader,blending:ue,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new d,this.oldClearAlpha=1,this.basic=new M,this.fsQuad=new J(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let o=0;o<this.nMips;o++)this.renderTargetsHorizontal[o].setSize(i,s),this.renderTargetsVertical[o].setSize(i,s),this.separableBlurMaterials[o].uniforms.invSize.value=new m(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,o){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),o&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let n=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[c].uniforms.direction.value=T.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=T.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),n=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,o&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=r}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new E({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new m(.5,.5)},direction:{value:new m(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new E({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}T.BlurDirectionX=new m(1,0);T.BlurDirectionY=new m(0,1);const G=329738,Be=1452077,Ne=.35,k=2772308,De=.4,Le=857112,Ue=.55,z=4881797,_=3535056,I=3822944,Fe=3042127,Ge=2373949,ke=140,ze=340;class je{constructor(){l(this,"scene",new he);l(this,"camera");l(this,"renderer",new de({antialias:!0}));l(this,"composer");this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.body.appendChild(this.renderer.domElement),this.scene.background=new d(G),this.scene.fog=new me(G,ke,ze),this.camera=new pe(42,window.innerWidth/window.innerHeight,.1,1e3),this.composer=new Re(this.renderer),this.composer.addPass(new _e(this.scene,this.camera)),this.composer.addPass(new T(new m(window.innerWidth,window.innerHeight),.55,.5,.35)),this.composer.addPass(new Oe),window.addEventListener("resize",()=>this.onResize())}onResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),this.composer.setSize(window.innerWidth,window.innerHeight)}render(){this.composer.render()}}const K=[{label:"Gatehouse",position:[-55,-50],size:[9,7,9]},{label:"Barracks",position:[-25,-55],size:[26,9,14]},{label:"Comms Tower",position:[40,-30],size:[9,26,9]},{label:"Command",position:[0,0],size:[34,12,24]},{label:"Armory",position:[-45,25],size:[15,8,12]},{label:"LZ Pad",position:[50,45],size:[18,.6,18]}];function w(a,e){const[t,i]=K[a].position;return new u(t,e,i)}const h=[{code:"OBJ-01",title:"BREACH PERIMETER",description:"Slip past the gatehouse sensors and breach the outer perimeter undetected.",buildingIndex:0,target:w(0,4),camPos:new u(-78,24,-18)},{code:"OBJ-02",title:"CUT COMMUNICATIONS",description:"Silence the relay tower to blind the garrison's response.",buildingIndex:2,target:w(2,14),camPos:new u(66,34,-56)},{code:"OBJ-03",title:"EXTRACT INTEL",description:"Infiltrate command and copy the mainframe's classified archive.",buildingIndex:3,target:w(3,6),camPos:new u(30,20,40)},{code:"OBJ-04",title:"RIG DEMOLITIONS",description:"Plant charges in the armory ahead of departure.",buildingIndex:4,target:w(4,4),camPos:new u(-70,18,52)},{code:"OBJ-05",title:"EXFILTRATE",description:"Break contact and reach the extraction point before the QRF arrives.",buildingIndex:5,target:w(5,1),camPos:new u(78,26,72)}],v={pos:new u(0,100,125),lookAt:new u(0,0,-5)},b={intro:6,approach:2.6,hold:4.2,outro:5,introOrbitAmplitude:.16,holdOrbitAmplitude:.12};new m(0,0);const Ve=150;function j(a){return a*a*(3-2*a)}function V(a,e,t){const i=new u().subVectors(a,e),s=Math.cos(t),o=Math.sin(t),r=i.x*s-i.z*o,n=i.x*o+i.z*s;return new u(e.x+r,a.y,e.z+n)}class He{constructor(){l(this,"segments",[]);l(this,"totalDuration",0);this.segments.push({kind:"intro",duration:b.intro,objectiveIndex:-1}),h.forEach((e,t)=>{this.segments.push({kind:"approach",duration:b.approach,objectiveIndex:t}),this.segments.push({kind:"hold",duration:b.hold,objectiveIndex:t})}),this.segments.push({kind:"outro",duration:b.outro,objectiveIndex:-1}),this.totalDuration=this.segments.reduce((e,t)=>e+t.duration,0)}evaluate(e){let t=e%this.totalDuration;for(const i of this.segments){if(t<=i.duration)return this.evaluateSegment(i,t);t-=i.duration}return this.evaluateSegment(this.segments[0],0)}evaluateSegment(e,t){const i=h.length;if(e.kind==="intro"){const r=b.introOrbitAmplitude*Math.sin(2*Math.PI*t/e.duration);return{camPos:V(v.pos,v.lookAt,r),camLookAt:v.lookAt.clone(),activeObjective:-1,holdProgress:0,pathProgress:0,phase:"intro"}}if(e.kind==="outro"){const r=h[i-1],n=j(L.clamp(t/e.duration,0,1));return{camPos:r.camPos.clone().lerp(v.pos,n),camLookAt:r.target.clone().lerp(v.lookAt,n),activeObjective:-1,holdProgress:0,pathProgress:i,phase:"outro"}}if(e.kind==="approach"){const r=h[e.objectiveIndex],n=e.objectiveIndex===0?v.pos:h[e.objectiveIndex-1].camPos,c=e.objectiveIndex===0?v.lookAt:h[e.objectiveIndex-1].target,f=j(L.clamp(t/e.duration,0,1));return{camPos:n.clone().lerp(r.camPos,f),camLookAt:c.clone().lerp(r.target,f),activeObjective:-1,holdProgress:0,pathProgress:e.objectiveIndex+f,phase:"approach"}}const s=h[e.objectiveIndex],o=b.holdOrbitAmplitude*Math.sin(2*Math.PI*t/e.duration);return{camPos:V(s.camPos,s.target,o),camLookAt:s.target.clone(),activeObjective:e.objectiveIndex,holdProgress:t/e.duration,pathProgress:e.objectiveIndex+1,phase:"hold"}}}class We{constructor(){l(this,"subtitleEl",document.getElementById("hudSubtitle"));l(this,"panelEl",document.getElementById("hudPanel"));l(this,"codeEl",document.getElementById("hudCode"));l(this,"titleEl",document.getElementById("hudObjTitle"));l(this,"descEl",document.getElementById("hudDesc"));l(this,"progressEl",document.getElementById("hudProgress"));l(this,"counterEl",document.getElementById("hudCounter"));l(this,"dots",[]);const e=document.getElementById("hudDots");h.forEach(t=>{const i=document.createElement("div");i.className="hud-dot",i.title=`${t.code} — ${t.title}`,e.appendChild(i),this.dots.push(i)}),this.counterEl.textContent=`00 / ${String(h.length).padStart(2,"0")}`}update(e){const t=e.activeObjective>=0?h[e.activeObjective]:null;switch(this.panelEl.classList.toggle("visible",!!t),t&&(this.codeEl.textContent=t.code,this.titleEl.textContent=t.title,this.descEl.textContent=t.description,this.progressEl.style.width=`${e.holdProgress*100}%`),e.phase){case"intro":this.subtitleEl.textContent="FACILITY OVERVIEW";break;case"approach":this.subtitleEl.textContent="ADVANCING TO NEXT OBJECTIVE";break;case"hold":this.subtitleEl.textContent="OBJECTIVE IN PROGRESS";break;case"outro":this.subtitleEl.textContent="MISSION COMPLETE — RETURNING TO OVERWATCH";break}const i=Math.min(h.length,Math.floor(e.pathProgress+1e-6));this.counterEl.textContent=`${String(i).padStart(2,"0")} / ${String(h.length).padStart(2,"0")}`,this.dots.forEach((s,o)=>{s.classList.toggle("done",e.pathProgress>=o+1),s.classList.toggle("active",e.activeObjective===o)})}}class Qe{constructor(e,t=30){l(this,"mediaRecorder");l(this,"chunks",[]);l(this,"isRecording",!1);this.canvas=e,this.fps=t}start(){if(this.isRecording)return;const e=this.canvas.captureStream(this.fps),t=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";this.chunks=[],this.mediaRecorder=new MediaRecorder(e,{mimeType:t,videoBitsPerSecond:12e6}),this.mediaRecorder.ondataavailable=i=>{i.data.size>0&&this.chunks.push(i.data)},this.mediaRecorder.onstop=()=>this.download(),this.mediaRecorder.start(),this.isRecording=!0}stop(){!this.isRecording||!this.mediaRecorder||(this.mediaRecorder.stop(),this.isRecording=!1)}download(){const e=new Blob(this.chunks,{type:"video/webm"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="tsam-objective-briefing.webm",document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(t.href)}}class Xe extends F{constructor({size:e=320}={}){super();const t=new ge(e,e),i=new M({color:Be,transparent:!0,opacity:Ne,depthWrite:!1}),s=new S(t,i);s.rotation.x=-Math.PI/2,s.position.y=-.02;const o=new fe(e,e/5,k,k),r=o.material;r.transparent=!0,r.opacity=De,this.add(s),this.add(o)}}class Je extends F{constructor({position:t,size:i}){super();l(this,"edges");l(this,"baseColor",new d(z));l(this,"activeColor",new d(_));l(this,"currentColor",new d(z));l(this,"target",0);const[s,o]=t,[r,n,c]=i,f=new ve(r,n,c),C=new S(f,new M({color:Le,transparent:!0,opacity:Ue,depthWrite:!1}));this.edges=new be(new Me(f),new W({color:this.baseColor.clone()})),this.add(C),this.add(this.edges),this.position.set(s,n/2,o)}setActive(t){this.target=t?1:0}tick(t){this.currentColor.lerp(this.target?this.activeColor:this.baseColor,Math.min(1,t*4)),this.edges.material.color.copy(this.currentColor)}}class Ke extends F{constructor({position:t,height:i=26}){super();l(this,"ring");l(this,"ringMaterial");l(this,"beacon");l(this,"beaconMaterial");l(this,"currentColor",new d(I));this.ringMaterial=new M({color:I,transparent:!0,opacity:.25,side:Q,depthWrite:!1}),this.ring=new S(new Te(2.2,2.8,40),this.ringMaterial),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.05,this.beaconMaterial=new M({color:I,transparent:!0,opacity:.16,depthWrite:!1}),this.beacon=new S(new Ce(.08,.08,i,8,1,!0),this.beaconMaterial),this.beacon.position.y=i/2,this.add(this.ring),this.add(this.beacon),this.position.copy(t)}update(t,i,s){const o=t==="done"?Fe:t==="active"?_:I;this.currentColor.lerp(new d(o),Math.min(1,s*4));const r=t==="active"?.55+.35*i:t==="done"?.4:.22,n=t==="active"?1+.18*i:1;this.ringMaterial.color.copy(this.currentColor),this.ringMaterial.opacity=r,this.beaconMaterial.color.copy(this.currentColor),this.beaconMaterial.opacity=r*.55,this.ring.scale.setScalar(n)}}class Ye extends we{constructor(t){const i=t.map(n=>new u(n.x,.15,n.z)),s=new xe().setFromPoints(i),o=new Float32Array(i.length*3);s.setAttribute("color",new Se(o,3));const r=new W({vertexColors:!0,transparent:!0,opacity:.9});super(s,r);l(this,"colors");l(this,"vertexCount");this.colors=o,this.vertexCount=i.length,this.setProgress(0)}setProgress(t){const i=new d(Ge),s=new d(_);for(let o=0;o<this.vertexCount;o++){const r=L.clamp(t-o,0,1),n=i.clone().lerp(s,r);this.colors[o*3]=n.r,this.colors[o*3+1]=n.g,this.colors[o*3+2]=n.b}this.geometry.attributes.color.needsUpdate=!0}}class $e extends S{constructor(e){const t=Math.PI/6,i=new Ee(e,64,0,t),s=new M({color:_,transparent:!0,opacity:.015,depthWrite:!1,side:Q});super(i,s),this.rotation.x=-Math.PI/2,this.position.y=.03}update(e,t=.35){this.rotation.z=-e*t}}const g=new je;g.scene.add(new Xe);const Y=new $e(Ve);g.scene.add(Y);const Ze=K.map(a=>{const e=new Je(a);return g.scene.add(e),e}),qe=h.map(a=>{const e=new Ke({position:a.target});return g.scene.add(e),e}),$=new Ye(h.map(a=>a.target));g.scene.add($);const N=new He,et=new We,U=new Qe(g.renderer.domElement),x=document.getElementById("recordBtn");let R=!1,P=null;x.addEventListener("click",()=>{U.isRecording||R||(R=!0,x.classList.add("armed"))});const H=new Ie;function Z(){requestAnimationFrame(Z);const a=H.getDelta(),e=H.elapsedTime,t=e%N.totalDuration;R&&t<.05&&(U.start(),R=!1,P=e+N.totalDuration,x.classList.remove("armed"),x.classList.add("recording")),P!==null&&e>=P&&(U.stop(),P=null,x.classList.remove("recording"));const i=N.evaluate(e);g.camera.position.copy(i.camPos),g.camera.lookAt(i.camLookAt),Ze.forEach((o,r)=>{const n=h.findIndex(c=>c.buildingIndex===r);o.setActive(n>=0&&i.activeObjective===n),o.tick(a)});const s=.5+.5*Math.sin(e*3.2);qe.forEach((o,r)=>{const n=i.pathProgress>=r+1?"done":i.activeObjective===r?"active":"pending";o.update(n,s,a)}),$.setProgress(i.pathProgress),Y.update(e),et.update(i),g.render()}Z();

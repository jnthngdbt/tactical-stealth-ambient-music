var A=Object.defineProperty;var B=(o,e,t)=>e in o?A(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var r=(o,e,t)=>B(o,typeof e!="symbol"?e+"":e,t);import{O as F,B as j,F as P,h as Z,g as w,U as D,a as d,n as W,H as U,N as H,o as z,e as I,V as Y,b as _,c as Q,d as O,W as V,p as X,i as G}from"./three.module-B6jDhfqD.js";const N={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class m{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const K=new F(-1,1,1,-1,0,1);class J extends j{constructor(){super(),this.setAttribute("position",new P([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new P([0,2,0,0,2,0],2))}}const q=new J;class ${constructor(e){this._mesh=new Z(q,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,K)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ee extends m{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof w?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=D.clone(e.uniforms),this.material=new w({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new $(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class y extends m{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const a=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let i,h;this.inverse?(i=0,h=1):(i=1,h=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),s.buffers.stencil.setFunc(a.ALWAYS,i,4294967295),s.buffers.stencil.setClear(h),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(a.EQUAL,1,4294967295),s.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),s.buffers.stencil.setLocked(!0)}}class te extends m{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ie{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new d);this._width=n.width,this._height=n.height,t=new W(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:U}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ee(N),this.copyPass.material.blending=H,this.clock=new z}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let a=0,s=this.passes.length;a<s;a++){const i=this.passes[a];if(i.enabled!==!1){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),i.needsSwap){if(n){const h=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}y!==void 0&&(i instanceof y?n=!0:i instanceof te&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new d);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(n,a),this.renderTarget2.setSize(n,a);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class se extends m{constructor(e,t,n=null,a=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=a,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new I}render(e,t,n){const a=e.autoClear;e.autoClear=!1;let s,i;this.overrideMaterial!==null&&(i=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=i),e.autoClear=a}}const f=new w({uniforms:{resolution:{value:new d(window.innerWidth,window.innerHeight)},pixelSize:{value:3},time:{value:0},noiseIntensity:{value:.1},diffuseTexture:{value:null}},vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,fragmentShader:`
		uniform vec2 resolution;
		uniform float pixelSize;
		uniform float time;
		uniform float noiseIntensity;
		uniform sampler2D diffuseTexture; // Renamed
		varying vec2 vUv;

		// Generate random noise
		float random(vec2 st) {
			return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
		}

		void main() {
			// Sample the texture normally, without pixelation
			vec4 texColor = texture2D(diffuseTexture, vUv);

			// Calculate pixelation size and coordinates
			vec2 dxy = pixelSize / resolution;
			vec2 coord = dxy * floor(vUv / dxy);

			// Add pixelated noise
			float noise = random(coord * time) * noiseIntensity;
			texColor.rgb += noise;

			gl_FragColor = texColor;
		}
	`});class ne{constructor(e,t,n,a,s){r(this,"window");r(this,"camera");r(this,"renderer");r(this,"composer");r(this,"planeSize");r(this,"isPanning",!1);r(this,"panSpeedFactor",10);r(this,"minZoomCameraPosZ",.8);r(this,"isSideZooming",!1);r(this,"sideZoomZoneWidth",.15);r(this,"sideZoomPos",0);r(this,"scrollZoomSpeedFactor",.001);r(this,"sideZoomSpeedFactor",.002);r(this,"startMouse",new d);r(this,"startCameraPosition",new Y);this.window=e,this.camera=t,this.renderer=n,this.composer=a,this.planeSize=s,e.addEventListener("mousedown",i=>{this.isSideZoomZone(i.clientX)?this.onSideZoomStart(i.clientY):this.onPanStart(i.clientX,i.clientY)}),e.addEventListener("mousemove",i=>{this.isSideZooming?this.onSideZoom(i.clientY):this.onPan(i.clientX,i.clientY)}),e.addEventListener("mouseup",()=>{this.isSideZooming?this.onSideZoomEnd():this.onPanEnd()}),e.addEventListener("touchstart",i=>{this.isSideZoomZone(i.touches[0].clientX)?this.onSideZoomStart(i.touches[0].clientY):this.onPanStart(i.touches[0].clientX,i.touches[0].clientY)}),e.addEventListener("touchmove",i=>{this.isSideZooming?this.onSideZoom(i.touches[0].clientY):this.onPan(i.touches[0].clientX,i.touches[0].clientY)}),e.addEventListener("touchend",()=>{this.isSideZooming?this.onSideZoomEnd():this.onPanEnd()}),e.addEventListener("wheel",i=>{this.onZoom(i.deltaY*this.scrollZoomSpeedFactor)}),e.addEventListener("resize",()=>{this.onResize()})}update(e){}isSideZoomZone(e){return e/this.window.innerWidth>1-this.sideZoomZoneWidth}onSideZoomStart(e){this.isSideZooming=!0,this.sideZoomPos=e}onSideZoom(e){const t=e-this.sideZoomPos;this.sideZoomPos=e,this.onZoom(t*this.sideZoomSpeedFactor)}onSideZoomEnd(){this.isSideZooming=!1}onZoom(e){this.camera.position.z+=e*this.camera.position.z,this.restrictCameraPosition()}onPanStart(e,t){this.isPanning=!0,this.startMouse.set(e,t),this.startCameraPosition.copy(this.camera.position)}onPanEnd(){this.isPanning=!1}onPan(e,t){if(!this.isPanning)return;const n=(e-this.startMouse.x)/this.window.innerWidth,a=(t-this.startMouse.y)/this.window.innerHeight;this.camera.position.x=this.startCameraPosition.x+n*this.panSpeedFactor,this.camera.position.y=this.startCameraPosition.y-a*this.panSpeedFactor,this.restrictCameraPosition()}onResize(){this.camera.aspect=this.window.innerWidth/this.window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.window.innerWidth,this.window.innerHeight),this.composer.setSize(this.window.innerWidth,this.window.innerHeight),this.restrictCameraPosition()}restrictCameraPosition(){const t=this.camera.position.z,n=.85*this.camera.fov/2*(Math.PI/180),a=this.camera.aspect,s=2*t*Math.tan(n),i=s*a,h=(this.planeSize.x-i)/2,l=(this.planeSize.y-s)/2,R=this.planeSize.y/(2*Math.tan(n)),L=this.planeSize.x/(2*Math.tan(n)*a),T=Math.min(R,L);this.camera.position.x=_.clamp(this.camera.position.x,-h,h),this.camera.position.y=_.clamp(this.camera.position.y,-l,l),this.camera.position.z=_.clamp(this.camera.position.z,this.minZoomCameraPosZ,T)}}class ae{constructor(e,t=.0015,n=2){r(this,"camera");r(this,"amplitude",.0015);r(this,"speed",2);this.camera=e,this.amplitude=t,this.speed=n}update(e){const t=e/this.speed;this.camera.position.x+=Math.sin(t)*this.amplitude*(Math.random()-.5),this.camera.position.y+=Math.cos(t)*this.amplitude*(Math.random()-.5)}}const S=new Q,p=new O(75,window.innerWidth/window.innerHeight,.1,1e3);p.position.z=2;const g=new V({antialias:!0});g.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(g.domElement);const b=["jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_2e4dae5c-a670-4c21-a6c0-abe8f0757a25.png","jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_f081fe34-33ad-4b6b-bf7d-63a0b79bb8b8.png","jnthngdbt_Dark_theme_heavily_fortified_concrete_multi-building__71c05842-c354-4d31-bd7c-fc93629f3f38.png","jnthngdbt_Heavily_defended_desert_concrete_multi-building_bunke_4e449e81-c3bd-4d08-94ec-aa464fb40833.png","jnthngdbt_Heavily_fortified_and_defended_desert_concrete_multi-_0a2ed1db-e1f4-4419-8dbf-ce26f915394e.png","jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_74d166ca-8493-4f48-a146-64ca25121cab.png","jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_92a6a60d-4ee6-40bd-82ed-1df5387ec3a8.png","jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_354daa91-edcb-4e11-a44f-f56a098819f8.png","jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_0701d598-e389-4b2a-a124-7589788e4d04.png","jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_ce184244-4427-4403-9573-914a55257101.png","jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_6cc95bcb-8818-4a4b-882c-8f8367139ad8.png","jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cdcc27e2-b964-4ba4-9990-92acce687e7c.png","jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cf4c2416-c763-45a1-8ef7-d1381616799a.png","jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_4a24248c-3833-4961-bb7f-372992a6cb87.png","jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_f0371757-ae87-48d0-b7c5-856f2e4edb59.png"],oe="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/binoculars/high-res/";var u=new d(0,0),v;const re=new X;function x(o){o<0?c=b.length-1:o>=b.length?c=0:c=o;const e=b[c];re.load(oe+e,t=>{f.uniforms.diffuseTexture.value=t,f.uniforms.resolution.value.set(t.image.width,t.image.height);const n=t.image.width/t.image.height;u.set(10,10/n);const a=new G(u.x,u.y);S.remove(v),v=new Z(a,f),S.add(v)})}var c=3;x(c);var M;(M=document.getElementById("prevImageBtn"))==null||M.addEventListener("click",()=>x(c-1));var E;(E=document.getElementById("nextImageBtn"))==null||E.addEventListener("click",()=>x(c+1));const C=new ie(g);C.addPass(new se(S,p));var he=new ne(window,p,g,C,u),ce=new ae(p,.0015,2);const le=new z;function k(){const o=le.getElapsedTime();f.uniforms.time.value=o,he.update(o),ce.update(o),requestAnimationFrame(k),C.render()}k();
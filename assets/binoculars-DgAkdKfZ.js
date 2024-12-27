var P=Object.defineProperty;var b=(a,e,t)=>e in a?P(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var o=(a,e,t)=>b(a,typeof e!="symbol"?e+"":e,t);import{O as y,B as E,F as v,h as x,g as p,U as M,a as c,n as R,H as T,N as L,o as C,e as z,V as A,b as k,c as B,d as F,W as D,p as U,i as O}from"./three.module-B6jDhfqD.js";const H={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class f{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const W=new y(-1,1,1,-1,0,1);class Q extends E{constructor(){super(),this.setAttribute("position",new v([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new v([0,2,0,0,2,0],2))}}const V=new Q;class Y{constructor(e){this._mesh=new x(V,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,W)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class j extends f{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof p?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=M.clone(e.uniforms),this.material=new p({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Y(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class w extends f{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let n,h;this.inverse?(n=0,h=1):(n=1,h=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,n,4294967295),s.buffers.stencil.setClear(h),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class G extends f{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class I{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new c);this._width=i.width,this._height=i.height,t=new R(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:T}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new j(H),this.copyPass.material.blending=L,this.clock=new C}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const n=this.passes[r];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),n.needsSwap){if(i){const h=this.renderer.getContext(),g=this.renderer.state.buffers.stencil;g.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),g.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}w!==void 0&&(n instanceof w?i=!0:n instanceof G&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new c);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class N extends f{constructor(e,t,i=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new z}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let s,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),e.autoClear=r}}const l=new p({uniforms:{resolution:{value:new c(window.innerWidth,window.innerHeight)},pixelSize:{value:3},time:{value:0},noiseIntensity:{value:.08},diffuseTexture:{value:null}},vertexShader:`
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
  `}),X=1.5,Z=4;class K{constructor(e,t,i,r){o(this,"window");o(this,"camera");o(this,"renderer");o(this,"composer");o(this,"isPanning",!1);o(this,"scrollZoomSpeedFactor",.001);o(this,"panSpeedFactor",8);o(this,"startMouse",new c);o(this,"startCameraPosition",new A);this.window=e,this.camera=t,this.renderer=i,this.composer=r,e.addEventListener("mousedown",s=>{this.onPanStart(s.clientX,s.clientY)}),e.addEventListener("mousemove",s=>{this.onPan(s.clientX,s.clientY)}),e.addEventListener("mouseup",()=>{this.onPanEnd()}),e.addEventListener("touchstart",s=>{this.onPanStart(s.touches[0].clientX,s.touches[0].clientY)}),e.addEventListener("touchmove",s=>{this.onPan(s.touches[0].clientX,s.touches[0].clientY)}),e.addEventListener("touchend",()=>{this.onPanEnd()}),e.addEventListener("wheel",s=>{this.onZoom(s.deltaY)}),e.addEventListener("resize",()=>{this.onResize()})}update(e){}onZoom(e){this.camera.position.z+=e*this.scrollZoomSpeedFactor*this.camera.position.z,this.camera.position.z=k.clamp(this.camera.position.z,X,Z)}onPanStart(e,t){this.isPanning=!0,this.startMouse.set(e,t),this.startCameraPosition.copy(this.camera.position)}onPanEnd(){this.isPanning=!1}onPan(e,t){if(!this.isPanning)return;const i=(e-this.startMouse.x)/this.window.innerWidth,r=(t-this.startMouse.y)/this.window.innerHeight;this.camera.position.x=this.startCameraPosition.x+i*this.panSpeedFactor,this.camera.position.y=this.startCameraPosition.y-r*this.panSpeedFactor}onResize(){this.camera.aspect=this.window.innerWidth/this.window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.window.innerWidth,this.window.innerHeight),this.composer.setSize(this.window.innerWidth,this.window.innerHeight)}}class J{constructor(e,t=.0015,i=2){o(this,"camera");o(this,"amplitude",.0015);o(this,"speed",2);this.camera=e,this.amplitude=t,this.speed=i}update(e){const t=e/this.speed;this.camera.position.x+=Math.sin(t)*this.amplitude*(Math.random()-.5),this.camera.position.y+=Math.cos(t)*this.amplitude*(Math.random()-.5)}}const _=new B,d=new F(75,window.innerWidth/window.innerHeight,.1,1e3);d.position.z=2;const u=new D({antialias:!0});u.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(u.domElement);const q="jnthngdbt_Heavily_defended_desert_concrete_multi-building_bunke_4e449e81-c3bd-4d08-94ec-aa464fb40833.png",$="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/binoculars/high-res/",ee=new U;ee.load($+q,a=>{l.uniforms.diffuseTexture.value=a,l.uniforms.resolution.value.set(a.image.width,a.image.height);const e=a.image.width/a.image.height,t=new O(10,10/e),i=new x(t,l);_.add(i)});const m=new I(u);m.addPass(new N(_,d));var te=new K(window,d,u,m),se=new J(d,.0015,2);const ie=new C;function S(){const a=ie.getElapsedTime();l.uniforms.time.value=a,te.update(a),se.update(a),requestAnimationFrame(S),m.render()}S();

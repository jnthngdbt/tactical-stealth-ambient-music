import{O as M,B as R,F as x,h as S,g as u,U as T,a as f,n as E,H as z,N as A,o as b,e as L,c as k,d as B,W as D,p as U,i as O,b as F,V as W}from"./three.module-B6jDhfqD.js";const H={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class c{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Q=new M(-1,1,1,-1,0,1);class j extends R{constructor(){super(),this.setAttribute("position",new x([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new x([0,2,0,0,2,0],2))}}const V=new j;class G{constructor(e){this._mesh=new S(V,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Q)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class I extends c{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof u?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=T.clone(e.uniforms),this.material=new u({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new G(this.material)}render(e,t,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class _ extends c{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,a){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let n,l;this.inverse?(n=0,l=1):(n=1,l=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,n,4294967295),s.buffers.stencil.setClear(l),s.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class N extends c{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Y{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const a=e.getSize(new f);this._width=a.width,this._height=a.height,t=new E(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:z}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new I(H),this.copyPass.material.blending=A,this.clock=new b}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let a=!1;for(let r=0,s=this.passes.length;r<s;r++){const n=this.passes[r];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),n.needsSwap){if(a){const l=this.renderer.getContext(),v=this.renderer.state.buffers.stencil;v.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),v.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}_!==void 0&&(n instanceof _?a=!0:n instanceof N&&(a=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new f);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const a=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(a,r),this.renderTarget2.setSize(a,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(a,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class X extends c{constructor(e,t,a=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=a,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new L}render(e,t,a){const r=e.autoClear;e.autoClear=!1;let s,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),e.autoClear=r}}const h=new u({uniforms:{resolution:{value:new f(window.innerWidth,window.innerHeight)},pixelSize:{value:3},time:{value:0},noiseIntensity:{value:.08},diffuseTexture:{value:null}},vertexShader:`
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
  `}),K=1.5,Z=4,y=new k,o=new B(75,window.innerWidth/window.innerHeight,.1,1e3);o.position.z=2;const d=new D({antialias:!0});d.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(d.domElement);const q="jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_0701d598-e389-4b2a-a124-7589788e4d04.png",J="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/binoculars/high-res/",$=new U;$.load(J+q,i=>{h.uniforms.diffuseTexture.value=i,h.uniforms.resolution.value.set(i.image.width,i.image.height);const e=i.image.width/i.image.height,t=new O(10,10/e),a=new S(t,h);y.add(a)});const w=new Y(d);w.addPass(new X(y,o));let g=!1,p=new f,m=new W;window.addEventListener("mousedown",i=>{g=!0,p.set(i.clientX,i.clientY),m.copy(o.position)});window.addEventListener("mousemove",i=>{if(g){const t=(i.clientX-p.x)/window.innerWidth,a=(i.clientY-p.y)/window.innerHeight;var e=8;o.position.x=m.x+t*e,o.position.y=m.y-a*e}});window.addEventListener("mouseup",()=>{g=!1});window.addEventListener("wheel",i=>{var e=.001;o.position.z+=i.deltaY*e*o.position.z,o.position.z=F.clamp(o.position.z,K,Z)});window.addEventListener("resize",()=>{o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),d.setSize(window.innerWidth,window.innerHeight),w.setSize(window.innerWidth,window.innerHeight)});const C=.0015,ee=2,te=new b;function P(){const i=te.getElapsedTime();h.uniforms.time.value=i;{const e=performance.now()/ee;o.position.x+=Math.sin(e)*C*(Math.random()-.5),o.position.y+=Math.cos(e)*C*(Math.random()-.5)}requestAnimationFrame(P),w.render()}P();

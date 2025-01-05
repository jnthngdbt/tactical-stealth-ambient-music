import{V as k,C as y,E as x,U as M,g as L,c as S,d as D,W as F,i as _,p,h as b,m as C,b as m,A as z,q as U,o as j}from"./three.module-DKLVStQ4.js";import{P as A,F as R,E as W,R as K}from"./RenderPass-Cc3PnOOd.js";const a=new x(0,0,0,"YXZ"),c=new k,H={type:"change"},Q={type:"lock"},q={type:"unlock"},g=Math.PI/2;class V extends y{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=G.bind(this),this._onPointerlockChange=I.bind(this),this._onPointerlockError=T.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),c.crossVectors(o.up,c),o.position.addScaledVector(c,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(c,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function G(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;a.setFromQuaternion(n.quaternion),a.y-=t*.002*this.pointerSpeed,a.x-=o*.002*this.pointerSpeed,a.x=Math.max(g-this.maxPolarAngle,Math.min(g-this.minPolarAngle,a.x)),n.quaternion.setFromEuler(a),this.dispatchEvent(H)}function I(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Q),this.isLocked=!0):(this.dispatchEvent(q),this.isLocked=!1)}function T(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const X={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class Y extends A{constructor(t=.5,o=!1){super();const n=X;this.uniforms=M.clone(n.uniforms),this.material=new L({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new R(this.material)}render(t,o,n,P){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=P,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}document.body.style.margin="0";document.body.style.overflow="hidden";const d=new S,r=new D(75,window.innerWidth/window.innerHeight,.1,1e3),h=new F({antialias:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const O=new _(500,500),B=new p({color:11184810}),w=new b(O,B);w.rotation.x=-Math.PI/2;w.receiveShadow=!0;d.add(w);for(let e=0;e<100;e++){const t=new C(m.randFloat(30,60),m.randFloat(30,60),m.randFloat(30,60)),o=new p({color:16777215}),n=new b(t,o);n.position.set(m.randFloat(-250,250),t.parameters.height/2,m.randFloat(-250,250)),n.castShadow=!0,n.receiveShadow=!0,d.add(n)}const Z=new z(71582788);d.add(Z);const f=new U(8978312);f.intensity=100.5;f.decay=1;d.add(f);r.position.set(0,10,0);r.add(f);d.add(r);const s=new k,u=100,l=new V(r,h.domElement);document.addEventListener("click",()=>{l.lock()});l.addEventListener("lock",()=>{console.log("Pointer locked")});l.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const i={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":i.forward=!0;break;case"KeyS":i.backward=!0;break;case"KeyA":i.left=!0;break;case"KeyD":i.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":i.forward=!1;break;case"KeyS":i.backward=!1;break;case"KeyA":i.left=!1;break;case"KeyD":i.right=!1;break}});const v=new W(h),J=new K(d,r);v.addPass(J);const N=new Y(2,!1);v.addPass(N);const $=new j;function E(){requestAnimationFrame(E);const e=$.getDelta();l.isLocked&&(s.x-=s.x*10*e,s.z-=s.z*10*e,i.forward&&(s.z-=u*e),i.backward&&(s.z+=u*e),i.left&&(s.x-=u*e),i.right&&(s.x+=u*e),l.moveRight(s.x*e),l.moveForward(-s.z*e),r.position.y=5+.2*s.length()),v.render(e)}E();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),v.setSize(window.innerWidth,window.innerHeight)});

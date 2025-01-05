import{V as x,C as b,E,U as P,g as S,c as M,d as L,W as _,i as F,p as y,h as D,m as C,b as u,A as z,q as j,o as V}from"./three.module-DKLVStQ4.js";import{P as A,F as H,E as R,R as W,S as p}from"./RenderPass-CJHg-nUb.js";const a=new E(0,0,0,"YXZ"),c=new x,K={type:"change"},Q={type:"lock"},q={type:"unlock"},g=Math.PI/2;class B extends b{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=G.bind(this),this._onPointerlockChange=I.bind(this),this._onPointerlockError=T.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),c.crossVectors(o.up,c),o.position.addScaledVector(c,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(c,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function G(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;a.setFromQuaternion(n.quaternion),a.y-=t*.002*this.pointerSpeed,a.x-=o*.002*this.pointerSpeed,a.x=Math.max(g-this.maxPolarAngle,Math.min(g-this.minPolarAngle,a.x)),n.quaternion.setFromEuler(a),this.dispatchEvent(K)}function I(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Q),this.isLocked=!0):(this.dispatchEvent(q),this.isLocked=!1)}function T(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const X={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class Y extends A{constructor(t=.5,o=!1){super();const n=X;this.uniforms=P.clone(n.uniforms),this.material=new S({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new H(this.material)}render(t,o,n,U){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=U,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const O={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float h;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

			gl_FragColor = sum;

		}`},Z={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float v;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

			gl_FragColor = sum;

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const l=new M,r=new L(75,window.innerWidth/window.innerHeight,.1,1e3),m=new _({antialias:!0});m.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(m.domElement);const J=new F(500,500),N=new y({color:11184810}),w=new D(J,N);w.rotation.x=-Math.PI/2;w.receiveShadow=!0;l.add(w);for(let e=0;e<100;e++){const t=new C(u.randFloat(30,60),u.randFloat(30,60),u.randFloat(30,60)),o=new y({color:16777215}),n=new D(t,o);n.position.set(u.randFloat(-250,250),t.parameters.height/2,u.randFloat(-250,250)),n.castShadow=!0,n.receiveShadow=!0,l.add(n)}const $=new z(71582788);l.add($);const f=new j(13421772);f.intensity=100.5;f.decay=1;l.add(f);r.position.set(0,10,0);r.add(f);l.add(r);const s=new x,h=100,v=new B(r,m.domElement);document.addEventListener("click",()=>{v.lock()});v.addEventListener("lock",()=>{console.log("Pointer locked")});v.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const i={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":i.forward=!0;break;case"KeyS":i.backward=!0;break;case"KeyA":i.left=!0;break;case"KeyD":i.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":i.forward=!1;break;case"KeyS":i.backward=!1;break;case"KeyA":i.left=!1;break;case"KeyD":i.right=!1;break}});const d=new R(m),ee=new W(l,r);d.addPass(ee);const te=new p(Z);d.addPass(te);const oe=new p(O);d.addPass(oe);const ne=new Y(2,!1);d.addPass(ne);const ie=new V;function k(){requestAnimationFrame(k);const e=ie.getDelta();v.isLocked&&(s.x-=s.x*10*e,s.z-=s.z*10*e,i.forward&&(s.z-=h*e),i.backward&&(s.z+=h*e),i.left&&(s.x-=h*e),i.right&&(s.x+=h*e),v.moveRight(s.x*e),v.moveForward(-s.z*e),r.position.y=5+.2*s.length()),d.render(e)}k();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight),d.setSize(window.innerWidth,window.innerHeight)});

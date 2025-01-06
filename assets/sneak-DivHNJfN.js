import{V as p,C as M,E as L,U as _,g as F,c as C,d as z,W as j,i as V,p as k,h as U,m as A,b as u,A as H,q as R,o as W}from"./three.module-DKLVStQ4.js";import{P as K,F as Q,E as q,R as I,S as b}from"./RenderPass-CJHg-nUb.js";const c=new L(0,0,0,"YXZ"),l=new p,X={type:"change"},Y={type:"lock"},B={type:"unlock"},x=Math.PI/2;class G extends M{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=T.bind(this),this._onPointerlockChange=O.bind(this),this._onPointerlockError=Z.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),l.crossVectors(o.up,l),o.position.addScaledVector(l,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(l,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function T(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;c.setFromQuaternion(n.quaternion),c.y-=t*.002*this.pointerSpeed,c.x-=o*.002*this.pointerSpeed,c.x=Math.max(x-this.maxPolarAngle,Math.min(x-this.minPolarAngle,c.x)),n.quaternion.setFromEuler(c),this.dispatchEvent(X)}function O(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Y),this.isLocked=!0):(this.dispatchEvent(B),this.isLocked=!1)}function Z(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const J={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class N extends K{constructor(t=.5,o=!1){super();const n=J;this.uniforms=_.clone(n.uniforms),this.material=new F({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new Q(this.material)}render(t,o,n,S){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=S,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const $={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},ee={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const a=new C,P=5,r=new z(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,P,0);const h=new j({antialias:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const te=new V(500,500),oe=new k({color:8947848}),f=new U(te,oe);f.rotation.x=-Math.PI/2;f.receiveShadow=!0;a.add(f);const g=f.clone();g.rotation.x=Math.PI/2;g.position.y=20;a.add(g);const y=200,D=400;for(let e=0;e<100;e++){const t=new A(u.randFloat(30,60),u.randFloat(30,60),u.randFloat(30,60)),o=new k({color:13421772}),n=new U(t,o);n.position.set(u.randFloat(-y,y),t.parameters.height/2,u.randFloat(-D,D)),n.castShadow=!0,n.receiveShadow=!0,a.add(n)}const ne=new H(71582788);a.add(ne);const w=new R(8947848);w.intensity=10.5;w.decay=.7;a.add(w);r.add(w);a.add(r);const s=new p,m=50,v=new G(r,h.domElement);document.addEventListener("click",()=>{v.lock()});v.addEventListener("lock",()=>{console.log("Pointer locked")});v.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const i={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":i.forward=!0;break;case"KeyS":i.backward=!0;break;case"KeyA":i.left=!0;break;case"KeyD":i.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":i.forward=!1;break;case"KeyS":i.backward=!1;break;case"KeyA":i.left=!1;break;case"KeyD":i.right=!1;break}});const d=new q(h),ie=new I(a,r);d.addPass(ie);const se=new b(ee);d.addPass(se);const re=new b($);d.addPass(re);const ae=new N(2,!1);d.addPass(ae);const ce=new W;function E(){requestAnimationFrame(E);const e=ce.getDelta();v.isLocked&&(s.x-=s.x*10*e,s.z-=s.z*10*e,i.forward&&(s.z-=m*e),i.backward&&(s.z+=m*e),i.left&&(s.x-=m*e),i.right&&(s.x+=m*e),v.moveRight(s.x*e),v.moveForward(-s.z*e),r.position.y=P+20*s.length()/m),d.render(e)}E();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),d.setSize(window.innerWidth,window.innerHeight)});

import{V as M,C as z,E as j,U as A,g as V,c as W,d as H,W as R,i as K,p as L,h as p,m as Q,b as l,F as q,A as X,q as Y,o as B}from"./three.module-BLdKcLw8.js";import{P as G,F as I,E as T,R as Z,S as F}from"./RenderPass-DD_OJLqm.js";const a=new j(0,0,0,"YXZ"),c=new M,$={type:"change"},O={type:"lock"},J={type:"unlock"},U=Math.PI/2;class N extends z{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=ee.bind(this),this._onPointerlockChange=te.bind(this),this._onPointerlockError=oe.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),c.crossVectors(o.up,c),o.position.addScaledVector(c,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(c,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function ee(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;a.setFromQuaternion(n.quaternion),a.y-=t*.002*this.pointerSpeed,a.x-=o*.002*this.pointerSpeed,a.x=Math.max(U-this.maxPolarAngle,Math.min(U-this.minPolarAngle,a.x)),n.quaternion.setFromEuler(a),this.dispatchEvent($)}function te(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(O),this.isLocked=!0):(this.dispatchEvent(J),this.isLocked=!1)}function oe(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const ne={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class se extends G{constructor(t=.5,o=!1){super();const n=ne;this.uniforms=A.clone(n.uniforms),this.material=new V({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new I(this.material)}render(t,o,n,C){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=C,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ie={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},re={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const m=new W,w=.8,r=new H(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,w,0);const f=new R({antialias:!0});f.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(f.domElement);const ae=new K(500,500),ce=new L({color:8947848}),b=new p(ae,ce);b.rotation.x=-Math.PI/2;b.receiveShadow=!0;m.add(b);new p;const E=200,P=200;for(let e=0;e<100;e++){const t=new Q(l.randFloat(10,60),l.randFloat(4,20),l.randFloat(10,60)),o=new L({color:13421772,side:q}),n=new p(t,o);n.position.set(l.randFloat(-E,E),t.parameters.height/2,l.randFloat(-P,P)),n.castShadow=!0,n.receiveShadow=!0,m.add(n)}const le=new X(71582788);m.add(le);const g=new Y(8947848);g.intensity=10.5;g.decay=.7;m.add(g);r.add(g);m.add(r);const i=new M,d=new N(r,f.domElement);document.addEventListener("click",()=>{d.lock()});d.addEventListener("lock",()=>{console.log("Pointer locked")});d.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const s={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":s.forward=!0;break;case"KeyS":s.backward=!0;break;case"KeyA":s.left=!0;break;case"KeyD":s.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":s.forward=!1;break;case"KeyS":s.backward=!1;break;case"KeyA":s.left=!1;break;case"KeyD":s.right=!1;break}});const ve=.01,y=0,D=10,k=2,de=30,me=1.8,ue=(me-w)/(D-y),he=(de-k)/(D-y);var h=0,x=w,v=k;window.addEventListener("wheel",e=>{h=l.clamp(h-e.deltaY*ve,y,D),x=w+ue*h,v=k+he*h,console.log(`wheel: ${h}, stand: ${x}, speed: ${v}`)});const u=new T(f),fe=new Z(m,r);u.addPass(fe);const we=new F(re);u.addPass(we);const ge=new F(ie);u.addPass(ge);const xe=new se(2,!1);u.addPass(xe);const pe=new B,be=.18,ye=.035;var S=0;function _(){requestAnimationFrame(_);const e=pe.getDelta();if(d.isLocked){i.x-=i.x*10*e,i.z-=i.z*10*e,s.forward&&(i.z-=v*e),s.backward&&(i.z+=v*e),s.left&&(i.x-=v*e),s.right&&(i.x+=v*e),d.moveRight(i.x*e),d.moveForward(-i.z*e),S+=be*i.length();const t=Math.sin(S)*ye;r.position.y=x+t}u.render(e)}_();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),f.setSize(window.innerWidth,window.innerHeight),u.setSize(window.innerWidth,window.innerHeight)});

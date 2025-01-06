import{V as E,C as z,E as j,U as V,g as A,c as H,d as R,W,i as K,p as P,h as S,m as Q,b as m,A as q,q as I,o as X}from"./three.module-DKLVStQ4.js";import{P as Y,F as B,E as G,R as T,S as M}from"./RenderPass-CJHg-nUb.js";const c=new j(0,0,0,"YXZ"),l=new E,Z={type:"change"},O={type:"lock"},J={type:"unlock"},y=Math.PI/2;class N extends z{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=$.bind(this),this._onPointerlockChange=ee.bind(this),this._onPointerlockError=te.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),l.crossVectors(o.up,l),o.position.addScaledVector(l,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(l,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function $(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;c.setFromQuaternion(n.quaternion),c.y-=t*.002*this.pointerSpeed,c.x-=o*.002*this.pointerSpeed,c.x=Math.max(y-this.maxPolarAngle,Math.min(y-this.minPolarAngle,c.x)),n.quaternion.setFromEuler(c),this.dispatchEvent(Z)}function ee(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(O),this.isLocked=!0):(this.dispatchEvent(J),this.isLocked=!1)}function te(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const oe={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class ne extends Y{constructor(t=.5,o=!1){super();const n=oe;this.uniforms=V.clone(n.uniforms),this.material=new A({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new B(this.material)}render(t,o,n,C){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=C,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const se={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},ie={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const a=new H,x=5,r=new R(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,x,0);const h=new W({antialias:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const re=new K(500,500),ae=new P({color:8947848}),w=new S(re,ae);w.rotation.x=-Math.PI/2;w.receiveShadow=!0;a.add(w);const p=w.clone();p.rotation.x=Math.PI/2;p.position.y=20;a.add(p);const D=200,b=400;for(let e=0;e<100;e++){const t=new Q(m.randFloat(30,60),m.randFloat(30,60),m.randFloat(30,60)),o=new P({color:13421772}),n=new S(t,o);n.position.set(m.randFloat(-D,D),t.parameters.height/2,m.randFloat(-b,b)),n.castShadow=!0,n.receiveShadow=!0,a.add(n)}const ce=new q(71582788);a.add(ce);const g=new I(8947848);g.intensity=10.5;g.decay=.7;a.add(g);r.add(g);a.add(r);const i=new E,v=new N(r,h.domElement);document.addEventListener("click",()=>{v.lock()});v.addEventListener("lock",()=>{console.log("Pointer locked")});v.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const s={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":s.forward=!0;break;case"KeyS":s.backward=!0;break;case"KeyA":s.left=!0;break;case"KeyD":s.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":s.forward=!1;break;case"KeyS":s.backward=!1;break;case"KeyA":s.left=!1;break;case"KeyD":s.right=!1;break}});const le=.01,k=3,L=10,ve=.1,de=5;var f=0,F=x,u=L;window.addEventListener("wheel",e=>{f=Math.max(f-e.deltaY*le,0),F=x+ve*f*k,u=Math.max(de*f*k,L)});const d=new G(h),me=new T(a,r);d.addPass(me);const ue=new M(ie);d.addPass(ue);const he=new M(se);d.addPass(he);const fe=new ne(2,!1);d.addPass(fe);const we=new X;var U=0;function _(){requestAnimationFrame(_);const e=we.getDelta();if(v.isLocked){i.x-=i.x*10*e,i.z-=i.z*10*e,s.forward&&(i.z-=u*e),s.backward&&(i.z+=u*e),s.left&&(i.x-=u*e),s.right&&(i.x+=u*e),v.moveRight(i.x*e),v.moveForward(-i.z*e),U+=.03*i.length();const t=Math.sin(U)*.2;r.position.y=F+t}d.render(e)}_();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),d.setSize(window.innerWidth,window.innerHeight)});

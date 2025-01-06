import{V as E,C,E as z,U as j,g as V,c as A,d as H,W as R,i as W,p as P,h as g,m as K,b as m,A as Q,q,o as X}from"./three.module-DKLVStQ4.js";import{P as Y,F as B,E as G,R as I,S}from"./RenderPass-CJHg-nUb.js";const a=new z(0,0,0,"YXZ"),c=new E,T={type:"change"},Z={type:"lock"},O={type:"unlock"},y=Math.PI/2;class J extends C{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=N.bind(this),this._onPointerlockChange=$.bind(this),this._onPointerlockError=ee.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),c.crossVectors(o.up,c),o.position.addScaledVector(c,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;c.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(c,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function N(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;a.setFromQuaternion(n.quaternion),a.y-=t*.002*this.pointerSpeed,a.x-=o*.002*this.pointerSpeed,a.x=Math.max(y-this.maxPolarAngle,Math.min(y-this.minPolarAngle,a.x)),n.quaternion.setFromEuler(a),this.dispatchEvent(T)}function $(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Z),this.isLocked=!0):(this.dispatchEvent(O),this.isLocked=!1)}function ee(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const te={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class oe extends Y{constructor(t=.5,o=!1){super();const n=te;this.uniforms=j.clone(n.uniforms),this.material=new V({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new B(this.material)}render(t,o,n,_){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=_,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ne={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},se={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const v=new A,x=5,r=new H(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,x,0);const h=new R({antialias:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const ie=new W(500,500),re=new P({color:8947848}),p=new g(ie,re);p.rotation.x=-Math.PI/2;p.receiveShadow=!0;v.add(p);new g;const D=200,b=400;for(let e=0;e<100;e++){const t=new K(m.randFloat(30,60),m.randFloat(30,60),m.randFloat(30,60)),o=new P({color:13421772}),n=new g(t,o);n.position.set(m.randFloat(-D,D),t.parameters.height/2,m.randFloat(-b,b)),n.castShadow=!0,n.receiveShadow=!0,v.add(n)}const ae=new Q(71582788);v.add(ae);const w=new q(8947848);w.intensity=10.5;w.decay=.7;v.add(w);r.add(w);v.add(r);const i=new E,l=new J(r,h.domElement);document.addEventListener("click",()=>{l.lock()});l.addEventListener("lock",()=>{console.log("Pointer locked")});l.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const s={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":s.forward=!0;break;case"KeyS":s.backward=!0;break;case"KeyA":s.left=!0;break;case"KeyD":s.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":s.forward=!1;break;case"KeyS":s.backward=!1;break;case"KeyA":s.left=!1;break;case"KeyD":s.right=!1;break}});const ce=.01,k=3,M=10,le=.1,ve=5;var f=0,L=x,u=M;window.addEventListener("wheel",e=>{f=Math.max(f-e.deltaY*ce,0),L=x+le*f*k,u=Math.max(ve*f*k,M)});const d=new G(h),de=new I(v,r);d.addPass(de);const me=new S(se);d.addPass(me);const ue=new S(ne);d.addPass(ue);const he=new oe(2,!1);d.addPass(he);const fe=new X;var U=0;function F(){requestAnimationFrame(F);const e=fe.getDelta();if(l.isLocked){i.x-=i.x*10*e,i.z-=i.z*10*e,s.forward&&(i.z-=u*e),s.backward&&(i.z+=u*e),s.left&&(i.x-=u*e),s.right&&(i.x+=u*e),l.moveRight(i.x*e),l.moveForward(-i.z*e),U+=.03*i.length();const t=Math.sin(U)*.2;r.position.y=L+t}d.render(e)}F();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),d.setSize(window.innerWidth,window.innerHeight)});

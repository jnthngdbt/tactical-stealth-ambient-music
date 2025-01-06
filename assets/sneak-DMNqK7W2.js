import{V as b,C,E as z,U as j,g as V,c as A,d as H,W as R,i as W,p as E,h as P,m as K,b as u,A as Q,q,o as I}from"./three.module-DKLVStQ4.js";import{P as X,F as Y,E as B,R as G,S}from"./RenderPass-CJHg-nUb.js";const c=new z(0,0,0,"YXZ"),l=new b,T={type:"change"},Z={type:"lock"},O={type:"unlock"},y=Math.PI/2;class J extends C{constructor(t,o=null){super(t,o),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=N.bind(this),this._onPointerlockChange=$.bind(this),this._onPointerlockError=ee.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),l.crossVectors(o.up,l),o.position.addScaledVector(l,t)}moveRight(t){if(this.enabled===!1)return;const o=this.object;l.setFromMatrixColumn(o.matrix,0),o.position.addScaledVector(l,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function N(e){if(this.enabled===!1||this.isLocked===!1)return;const t=e.movementX||e.mozMovementX||e.webkitMovementX||0,o=e.movementY||e.mozMovementY||e.webkitMovementY||0,n=this.object;c.setFromQuaternion(n.quaternion),c.y-=t*.002*this.pointerSpeed,c.x-=o*.002*this.pointerSpeed,c.x=Math.max(y-this.maxPolarAngle,Math.min(y-this.minPolarAngle,c.x)),n.quaternion.setFromEuler(c),this.dispatchEvent(T)}function $(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Z),this.isLocked=!0):(this.dispatchEvent(O),this.isLocked=!1)}function ee(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const te={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class oe extends X{constructor(t=.5,o=!1){super();const n=te;this.uniforms=j.clone(n.uniforms),this.material=new V({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=o,this.fsQuad=new Y(this.material)}render(t,o,n,_){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=_,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(o),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ne={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const a=new A,x=5,r=new H(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,x,0);const h=new R({antialias:!0});h.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(h.domElement);const ie=new W(500,500),re=new E({color:8947848}),w=new P(ie,re);w.rotation.x=-Math.PI/2;w.receiveShadow=!0;a.add(w);const p=w.clone();p.rotation.x=Math.PI/2;p.position.y=20;a.add(p);const D=200,k=400;for(let e=0;e<100;e++){const t=new K(u.randFloat(30,60),u.randFloat(30,60),u.randFloat(30,60)),o=new E({color:13421772}),n=new P(t,o);n.position.set(u.randFloat(-D,D),t.parameters.height/2,u.randFloat(-k,k)),n.castShadow=!0,n.receiveShadow=!0,a.add(n)}const ae=new Q(71582788);a.add(ae);const g=new q(8947848);g.intensity=10.5;g.decay=.7;a.add(g);r.add(g);a.add(r);const i=new b,d=new J(r,h.domElement);document.addEventListener("click",()=>{d.lock()});d.addEventListener("lock",()=>{console.log("Pointer locked")});d.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const s={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",e=>{switch(e.code){case"KeyW":s.forward=!0;break;case"KeyS":s.backward=!0;break;case"KeyA":s.left=!0;break;case"KeyD":s.right=!0;break}});document.addEventListener("keyup",e=>{switch(e.code){case"KeyW":s.forward=!1;break;case"KeyS":s.backward=!1;break;case"KeyA":s.left=!1;break;case"KeyD":s.right=!1;break}});const ce=.01,U=5,M=10,le=.1,ve=5;var f=0,L=x,v=M;window.addEventListener("wheel",e=>{f=Math.max(f-e.deltaY*ce,0),L=x+le*f*U,v=Math.max(ve*f*U,M),console.log(v)});const m=new B(h),de=new G(a,r);m.addPass(de);const me=new S(se);m.addPass(me);const ue=new S(ne);m.addPass(ue);const he=new oe(2,!1);m.addPass(he);const fe=new I;function F(){requestAnimationFrame(F);const e=fe.getDelta();d.isLocked&&(i.x-=i.x*10*e,i.z-=i.z*10*e,s.forward&&(i.z-=v*e),s.backward&&(i.z+=v*e),s.left&&(i.x-=v*e),s.right&&(i.x+=v*e),d.moveRight(i.x*e),d.moveForward(-i.z*e),r.position.y=L),m.render(e)}F();window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),m.setSize(window.innerWidth,window.innerHeight)});

import{c as A,e as L,d as j,W as I,n as P,y as v,i as _,z as C,h as z,A as K,H as R,x as V,B,j as G,g as N,w as U,V as O,o as X}from"./three.module-B8BHS4ps.js";import{P as Y}from"./PointerLockControls-CJpi_4Po.js";import{E as J,R as T}from"./RenderPass-DY6MlMTT.js";const q="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",i=ee(1972017),p=te(),y=ne(),d=oe(),E=800;re(13421772);ae();ie(4469589);se(6710937);const{fireLights:ke,animateFireLights:Z}=ce(16733440),f=100,w=-50,H=50,k=-100,W=100,M=20,Q=100,{smokeSystem:ye,smokeParticles:b,smokeVelocities:x}=de(.1),u=20,{controls:g,movement:h}=me(),D=le(),$=new X;function F(){requestAnimationFrame(F);const e=$.getDelta();Z(),ue(e),he(),D.render(e)}F();function ee(e){const t=new A;return t.background=new L(e),t}function te(){const e=new j(100,window.innerWidth/window.innerHeight,.1,1e4);return e.position.set(0,2,-1),e.rotateY(-Math.PI/60),e.rotateX(Math.PI/15),i.add(e),e}function ne(){const e=new I({antialias:!0});return e.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(e.domElement),e}function oe(){return new P().load(q+"textures/noise-perlin-0.png")}function re(e){d.wrapS=v,d.wrapT=v,d.repeat.set(40,40);const t=new _(20,5,100,100),n=new C({color:e,bumpMap:d,bumpScale:.7}),o=t.attributes.position;for(let s=0;s<o.count;s++){const c=Math.random()*.05;o.setZ(s,c)}o.needsUpdate=!0,t.computeVertexNormals();const a=new z(t,n);return a.rotation.x=-Math.PI/2,a.position.z=-2,a.receiveShadow=!0,i.add(a),a}function ae(){d.repeat.set(.5,.3);const e=new _(6e3,2e3,500,500),t=new C({color:13421772,displacementMap:d,displacementScale:500,bumpMap:d,bumpScale:500}),n=new z(e,t);return n.rotation.x=-Math.PI/4,n.position.z=-800,n.position.y=-200,n.receiveShadow=!0,i.add(n),n}function ie(e){const t=new K(e);return i.add(t),t}function se(e){const t=new R(e,.5);return t.position.set(-50,10,-10),i.add(t),t}function ce(e){const a=[];for(let m=0;m<10;m++){const l=new V(e,5,1500,.5);l.position.set((Math.random()-.5)*100,Math.random()*-10-E,Math.random()*-30-10),i.add(l),a.push(l)}const s=.9;return{fireLights:a,animateFireLights:()=>{a.forEach(m=>{const l=Math.random()*5;m.intensity=s*m.intensity+(1-s)*l})}}}function de(e){let t=new B;const n=new Float32Array(f*3);let o=new Float32Array(f);for(let c=0;c<f;c++)n[c*3+0]=Math.random()*(H-w)-w,n[c*3+1]=Math.random()*(W-k)-k,n[c*3+2]=Math.random()*-(Q-M)-M,o[c]=.001+Math.random()*e;t.setAttribute("position",new G(n,3));const a=new N({uniforms:{u_color:{value:new L(13421772)},u_minHeight:{value:-E},u_maxHeight:{value:10},u_texture:{value:new P().load("smoke1.png")}},vertexShader:`
      varying float v_height;
      void main() {
        gl_PointSize = 1000.0;
				v_height = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D u_texture;
      uniform vec3 u_color;
			uniform float u_minHeight;
			uniform float u_maxHeight;
      varying float v_height;
      void main() {
        vec4 textureColor = texture2D(u_texture, gl_PointCoord);

				float opacity = max(0.0, 0.4 * (1.0 - (v_height - u_minHeight) / (u_maxHeight - u_minHeight)));

        gl_FragColor = vec4(u_color, textureColor.a * opacity) * textureColor;
      }
    `,transparent:!0,depthWrite:!1});let s=new U(t,a);return i.add(s),{smokeSystem:s,smokeParticles:t,smokeVelocities:o}}function me(){const e=new Y(p,y.domElement);document.addEventListener("click",()=>{e.lock()}),e.addEventListener("lock",()=>{console.log("Pointer locked")}),e.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const t={forward:!1,backward:!1,left:!1,right:!1};return document.addEventListener("keydown",n=>{switch(n.code){case"KeyW":t.forward=!0;break;case"KeyS":t.backward=!0;break;case"KeyA":t.left=!0;break;case"KeyD":t.right=!0;break}}),document.addEventListener("keyup",n=>{switch(n.code){case"KeyW":t.forward=!1;break;case"KeyS":t.backward=!1;break;case"KeyA":t.left=!1;break;case"KeyD":t.right=!1;break}}),{controls:e,movement:t}}function le(){const e=new J(y),t=new T(i,p);return e.addPass(t),e}const r=new O;function ue(e){if(g.isLocked){r.x-=r.x*15*e,r.z-=r.z*10*e,h.forward&&(r.z-=u*e),h.backward&&(r.z+=u*e),h.left&&(r.x-=u*e),h.right&&(r.x+=u*e);const t=.1,o=Math.abs(r.x)>t&&Math.abs(r.z)>t?.707:1;g.moveRight(r.x*o*e),g.moveForward(-r.z*o*e)}}function he(e){const t=b.attributes.position.array;for(let n=0;n<f;n++)t[n*3+1]+=x[n],t[n*3+0]-=x[n],t[n*3+1]>W&&(t[n*3+1]=k,t[n*3+0]=Math.random()*(H-w)-w);b.attributes.position.needsUpdate=!0}window.addEventListener("resize",()=>{p.aspect=window.innerWidth/window.innerHeight,p.updateProjectionMatrix(),y.setSize(window.innerWidth,window.innerHeight),D.setSize(window.innerWidth,window.innerHeight)});var S;(S=document.getElementById("downloadBtn"))==null||S.addEventListener("click",fe);function fe(){i.updateMatrixWorld();var e=i.toJSON(),t=JSON.stringify(e);const n=new Blob([t],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(n),o.download="tsam.three.js.scene.json",document.body.appendChild(o),o.click(),document.body.removeChild(o)}

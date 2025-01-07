import{V as S,C as je,E as Le,U as Pe,g as Me,e as Se,L as ke,F as Ee,p as _e,G as Fe,B as oe,q as E,r as K,s as ie,t as I,u as H,v as re,w as N,h as M,c as Ve,b as U,d as Ce,W as ze,n as Ae,x as ve,i as Ie,y as pe,m as Q,z as Re,A as He,H as Ge,o as Be}from"./three.module-DxtIBhoB.js";import{P as Te,F as Oe,E as We,R as Xe,S as ge}from"./RenderPass-rh3fRLVd.js";const _=new Le(0,0,0,"YXZ"),F=new S,qe={type:"change"},Ke={type:"lock"},Ne={type:"unlock"},ae=Math.PI/2;class Qe extends je{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=Ye.bind(this),this._onPointerlockChange=Ze.bind(this),this._onPointerlockError=Je.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),F.crossVectors(e.up,F),e.position.addScaledVector(F,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(F,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function Ye(r){if(this.enabled===!1||this.isLocked===!1)return;const t=r.movementX||r.mozMovementX||r.webkitMovementX||0,e=r.movementY||r.mozMovementY||r.webkitMovementY||0,n=this.object;_.setFromQuaternion(n.quaternion),_.y-=t*.002*this.pointerSpeed,_.x-=e*.002*this.pointerSpeed,_.x=Math.max(ae-this.maxPolarAngle,Math.min(ae-this.minPolarAngle,_.x)),n.quaternion.setFromEuler(_),this.dispatchEvent(qe)}function Ze(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Ke),this.isLocked=!0):(this.dispatchEvent(Ne),this.isLocked=!1)}function Je(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const $e={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class et extends Te{constructor(t=.5,e=!1){super();const n=$e;this.uniforms=Pe.clone(n.uniforms),this.material=new Me({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new Oe(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const tt=/^[og]\s*(.+)?/,st=/^mtllib /,nt=/^usemtl /,ot=/^usemap /,ce=/\s+/,le=new S,Y=new S,de=new S,ue=new S,x=new S,R=new Se;function it(){const r={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const d={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(d),d},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;le.fromArray(s,t),Y.fromArray(s,e),de.fromArray(s,n),x.subVectors(de,Y),ue.subVectors(le,Y),x.cross(ue),x.normalize(),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,c,d,p,a){const u=this.vertices.length;let i=this.parseVertexIndex(t,u),l=this.parseVertexIndex(e,u),m=this.parseVertexIndex(n,u);if(this.addVertex(i,l,m),this.addColor(i,l,m),d!==void 0&&d!==""){const v=this.normals.length;i=this.parseNormalIndex(d,v),l=this.parseNormalIndex(p,v),m=this.parseNormalIndex(a,v),this.addNormal(i,l,m)}else this.addFaceNormal(i,l,m);if(s!==void 0&&s!==""){const v=this.uvs.length;i=this.parseUVIndex(s,v),l=this.parseUVIndex(o,v),m=this.parseUVIndex(c,v),this.addUV(i,l,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return r.startObject("",!1),r}class rt extends ke{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,c=new Ee(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(d){try{e(o.parse(d))}catch(p){s?s(p):console.error(p),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new it;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let d=0,p=n.length;d<p;d++){const a=n[d].trimStart();if(a.length===0)continue;const u=a.charAt(0);if(u!=="#")if(u==="v"){const i=a.split(ce);switch(i[0]){case"v":e.vertices.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3])),i.length>=7?(R.setRGB(parseFloat(i[4]),parseFloat(i[5]),parseFloat(i[6]),_e),e.colors.push(R.r,R.g,R.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));break;case"vt":e.uvs.push(parseFloat(i[1]),parseFloat(i[2]));break}}else if(u==="f"){const l=a.slice(1).trim().split(ce),m=[];for(let h=0,g=l.length;h<g;h++){const b=l[h];if(b.length>0){const w=b.split("/");m.push(w)}}const v=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(v[0],b[0],w[0],v[1],b[1],w[1],v[2],b[2],w[2])}}else if(u==="l"){const i=a.substring(1).trim().split(" ");let l=[];const m=[];if(a.indexOf("/")===-1)l=i;else for(let v=0,h=i.length;v<h;v++){const g=i[v].split("/");g[0]!==""&&l.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(l,m)}else if(u==="p"){const l=a.slice(1).trim().split(" ");e.addPointGeometry(l)}else if((s=tt.exec(a))!==null){const i=(" "+s[0].slice(1).trim()).slice(1);e.startObject(i)}else if(nt.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(st.test(a))e.materialLibraries.push(a.substring(7).trim());else if(ot.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(u==="s"){if(s=a.split(" "),s.length>1){const l=s[1].trim().toLowerCase();e.object.smooth=l!=="0"&&l!=="off"}else e.object.smooth=!0;const i=e.object.currentMaterial();i&&(i.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new Fe;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let d=0,p=e.objects.length;d<p;d++){const a=e.objects[d],u=a.geometry,i=a.materials,l=u.type==="Line",m=u.type==="Points";let v=!1;if(u.vertices.length===0)continue;const h=new oe;h.setAttribute("position",new E(u.vertices,3)),u.normals.length>0&&h.setAttribute("normal",new E(u.normals,3)),u.colors.length>0&&(v=!0,h.setAttribute("color",new E(u.colors,3))),u.hasUVIndices===!0&&h.setAttribute("uv",new E(u.uvs,2));const g=[];for(let w=0,q=i.length;w<q;w++){const L=i[w],ne=L.name+"_"+L.smooth+"_"+v;let f=e.materials[ne];if(this.materials!==null){if(f=this.materials.create(L.name),l&&f&&!(f instanceof K)){const P=new K;ie.prototype.copy.call(P,f),P.color.copy(f.color),f=P}else if(m&&f&&!(f instanceof I)){const P=new I({size:10,sizeAttenuation:!1});ie.prototype.copy.call(P,f),P.color.copy(f.color),P.map=f.map,f=P}}f===void 0&&(l?f=new K:m?f=new I({size:1,sizeAttenuation:!1}):f=new H,f.name=L.name,f.flatShading=!L.smooth,f.vertexColors=v,e.materials[ne]=f),g.push(f)}let b;if(g.length>1){for(let w=0,q=i.length;w<q;w++){const L=i[w];h.addGroup(L.groupStart,L.groupCount,w)}l?b=new re(h,g):m?b=new N(h,g):b=new M(h,g)}else l?b=new re(h,g[0]):m?b=new N(h,g[0]):b=new M(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const d=new I({size:1,sizeAttenuation:!1}),p=new oe;p.setAttribute("position",new E(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new E(e.colors,3)),d.vertexColors=!0);const a=new N(p,d);o.add(a)}return o}}const at={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},ct={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const O=200,G=250,B=250,Z=O+G,J=O+B,lt=O+Z,dt=O+J,he=10,me=30,ut=4,ht=20,mt=G/2+25,ft=B/2+25,k=new Ve,vt=.01,$=0,ee=10,be=2,pt=30,we=1,gt=1,bt=(gt-we)/(ee-$),wt=(pt-be)/(ee-$);var T=7,te=ye(),z=xe();window.addEventListener("wheel",r=>{T=U.clamp(T-r.deltaY*vt,$,ee),te=ye(),z=xe()});function xe(){return be+wt*T}function ye(){return we+bt*T}const j=new Ce(75,window.innerWidth/window.innerHeight,.1,1e3);j.position.set(mt,te,ft);j.lookAt(0,0,0);const A=new ze({antialias:!0});A.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(A.domElement);const xt=8947848,yt=13421772,Dt=11184810,Ut=8947848,jt=13421772,Lt=4473924,Pt=5592405,De="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Mt=new Ae,W=Mt.load(De+"textures/noise-perlin-0.png");W.wrapS=ve;W.wrapT=ve;W.repeat.set(40,40);const St=new Ie(lt,dt),kt=new pe({color:xt,bumpMap:W,bumpScale:.7}),se=new M(St,kt);se.rotation.x=-Math.PI/2;se.receiveShadow=!0;k.add(se);new M;for(let r=0;r<100;r++){const t=new Q(U.randFloat(he,me),U.randFloat(ut,ht),U.randFloat(he,me)),e=new H({color:yt,side:Re}),n=new M(t,e);n.position.set(U.randFloat(-G/2,G/2),t.parameters.height/2,U.randFloat(-B/2,B/2)),n.castShadow=!0,n.receiveShadow=!0;for(let s=0;s<4;s++){const o=new Q(1,2,.1),c=new H({color:Dt}),d=new M(o,c),p=s<2?1:-1;d.position.set(U.randFloat(-t.parameters.width/2,t.parameters.width/2),o.parameters.height/2-t.parameters.height/2,p*t.parameters.depth/2-p*.9*.5*o.parameters.depth);const a=new Q(.03,.25,.2),u=new H({color:Ut}),i=new M(a,u);i.position.set(-.3*o.parameters.width,-.05*o.parameters.height,0),d.add(i),n.add(d)}k.add(n)}const Et=new rt;Et.load(De+"models/palmtree-0.obj",r=>{for(let t=0;t<800;t++){const e=r.clone(),n=U.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(U.randFloat(-Z/2,Z/2),0,U.randFloat(-J/2,J/2)),e.rotation.y=U.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof M&&(s.material=new pe({color:Pt}))}),k.add(e)}});const _t=new He(Lt);k.add(_t);const X=new Ge(jt);X.intensity=10.5;X.decay=.7;k.add(X);j.add(X);k.add(j);const D=new S,V=new Qe(j,A.domElement);document.addEventListener("click",()=>{V.lock()});V.addEventListener("lock",()=>{console.log("Pointer locked")});V.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const y={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",r=>{switch(r.code){case"KeyW":y.forward=!0;break;case"KeyS":y.backward=!0;break;case"KeyA":y.left=!0;break;case"KeyD":y.right=!0;break}});document.addEventListener("keyup",r=>{switch(r.code){case"KeyW":y.forward=!1;break;case"KeyS":y.backward=!1;break;case"KeyA":y.left=!1;break;case"KeyD":y.right=!1;break}});const C=new We(A),Ft=new Xe(k,j);C.addPass(Ft);const Vt=new ge(ct);C.addPass(Vt);const Ct=new ge(at);C.addPass(Ct);const zt=new et(2,!1);C.addPass(zt);const At=new Be,It=.18,Rt=.035;var fe=0;function Ue(){requestAnimationFrame(Ue);const r=At.getDelta();if(V.isLocked){D.x-=D.x*10*r,D.z-=D.z*10*r,y.forward&&(D.z-=z*r),y.backward&&(D.z+=z*r),y.left&&(D.x-=z*r),y.right&&(D.x+=z*r),V.moveRight(D.x*r),V.moveForward(-D.z*r),fe+=It*D.length();const t=Math.sin(fe)*Rt;j.position.y=te+t}C.render(r)}Ue();window.addEventListener("resize",()=>{j.aspect=window.innerWidth/window.innerHeight,j.updateProjectionMatrix(),A.setSize(window.innerWidth,window.innerHeight),C.setSize(window.innerWidth,window.innerHeight)});

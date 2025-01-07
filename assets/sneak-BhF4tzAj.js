import{V as M,C as Pe,E as Se,U as Me,g as ke,e as Ee,L as _e,F as Fe,p as Ve,G as ze,B as re,q as E,r as N,s as ae,t as R,u as I,v as ce,w as Q,h as S,c as Ce,b as U,d as Ie,W as Ae,n as Re,x as H,i as Ge,y as ge,m as Y,A as He,z as Be,o as Te}from"./three.module-BHKQH0IX.js";import{P as Oe,F as We,E as Xe,R as qe,S as be}from"./RenderPass-C-85Xdv9.js";const _=new Se(0,0,0,"YXZ"),F=new M,Ke={type:"change"},Ne={type:"lock"},Qe={type:"unlock"},le=Math.PI/2;class Ye extends Pe{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=Ze.bind(this),this._onPointerlockChange=Je.bind(this),this._onPointerlockError=$e.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),F.crossVectors(e.up,F),e.position.addScaledVector(F,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(F,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function Ze(r){if(this.enabled===!1||this.isLocked===!1)return;const t=r.movementX||r.mozMovementX||r.webkitMovementX||0,e=r.movementY||r.mozMovementY||r.webkitMovementY||0,n=this.object;_.setFromQuaternion(n.quaternion),_.y-=t*.002*this.pointerSpeed,_.x-=e*.002*this.pointerSpeed,_.x=Math.max(le-this.maxPolarAngle,Math.min(le-this.minPolarAngle,_.x)),n.quaternion.setFromEuler(_),this.dispatchEvent(Ke)}function Je(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Ne),this.isLocked=!0):(this.dispatchEvent(Qe),this.isLocked=!1)}function $e(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const et={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class tt extends Oe{constructor(t=.5,e=!1){super();const n=et;this.uniforms=Me.clone(n.uniforms),this.material=new ke({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new We(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const st=/^[og]\s*(.+)?/,nt=/^mtllib /,ot=/^usemtl /,it=/^usemap /,de=/\s+/,ue=new M,Z=new M,he=new M,me=new M,x=new M,G=new Ee;function rt(){const r={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const l={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(l),l},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;ue.fromArray(s,t),Z.fromArray(s,e),he.fromArray(s,n),x.subVectors(he,Z),me.subVectors(ue,Z),x.cross(me),x.normalize(),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,c,l,p,a){const d=this.vertices.length;let i=this.parseVertexIndex(t,d),u=this.parseVertexIndex(e,d),m=this.parseVertexIndex(n,d);if(this.addVertex(i,u,m),this.addColor(i,u,m),l!==void 0&&l!==""){const f=this.normals.length;i=this.parseNormalIndex(l,f),u=this.parseNormalIndex(p,f),m=this.parseNormalIndex(a,f),this.addNormal(i,u,m)}else this.addFaceNormal(i,u,m);if(s!==void 0&&s!==""){const f=this.uvs.length;i=this.parseUVIndex(s,f),u=this.parseUVIndex(o,f),m=this.parseUVIndex(c,f),this.addUV(i,u,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return r.startObject("",!1),r}class at extends _e{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,c=new Fe(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{e(o.parse(l))}catch(p){s?s(p):console.error(p),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new rt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let l=0,p=n.length;l<p;l++){const a=n[l].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const i=a.split(de);switch(i[0]){case"v":e.vertices.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3])),i.length>=7?(G.setRGB(parseFloat(i[4]),parseFloat(i[5]),parseFloat(i[6]),Ve),e.colors.push(G.r,G.g,G.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));break;case"vt":e.uvs.push(parseFloat(i[1]),parseFloat(i[2]));break}}else if(d==="f"){const u=a.slice(1).trim().split(de),m=[];for(let h=0,g=u.length;h<g;h++){const b=u[h];if(b.length>0){const w=b.split("/");m.push(w)}}const f=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(d==="l"){const i=a.substring(1).trim().split(" ");let u=[];const m=[];if(a.indexOf("/")===-1)u=i;else for(let f=0,h=i.length;f<h;f++){const g=i[f].split("/");g[0]!==""&&u.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(u,m)}else if(d==="p"){const u=a.slice(1).trim().split(" ");e.addPointGeometry(u)}else if((s=st.exec(a))!==null){const i=(" "+s[0].slice(1).trim()).slice(1);e.startObject(i)}else if(ot.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(nt.test(a))e.materialLibraries.push(a.substring(7).trim());else if(it.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(s=a.split(" "),s.length>1){const u=s[1].trim().toLowerCase();e.object.smooth=u!=="0"&&u!=="off"}else e.object.smooth=!0;const i=e.object.currentMaterial();i&&(i.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new ze;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let l=0,p=e.objects.length;l<p;l++){const a=e.objects[l],d=a.geometry,i=a.materials,u=d.type==="Line",m=d.type==="Points";let f=!1;if(d.vertices.length===0)continue;const h=new re;h.setAttribute("position",new E(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new E(d.normals,3)),d.colors.length>0&&(f=!0,h.setAttribute("color",new E(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new E(d.uvs,2));const g=[];for(let w=0,K=i.length;w<K;w++){const j=i[w],ie=j.name+"_"+j.smooth+"_"+f;let v=e.materials[ie];if(this.materials!==null){if(v=this.materials.create(j.name),u&&v&&!(v instanceof N)){const P=new N;ae.prototype.copy.call(P,v),P.color.copy(v.color),v=P}else if(m&&v&&!(v instanceof R)){const P=new R({size:10,sizeAttenuation:!1});ae.prototype.copy.call(P,v),P.color.copy(v.color),P.map=v.map,v=P}}v===void 0&&(u?v=new N:m?v=new R({size:1,sizeAttenuation:!1}):v=new I,v.name=j.name,v.flatShading=!j.smooth,v.vertexColors=f,e.materials[ie]=v),g.push(v)}let b;if(g.length>1){for(let w=0,K=i.length;w<K;w++){const j=i[w];h.addGroup(j.groupStart,j.groupCount,w)}u?b=new ce(h,g):m?b=new Q(h,g):b=new S(h,g)}else u?b=new ce(h,g[0]):m?b=new Q(h,g[0]):b=new S(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const l=new R({size:1,sizeAttenuation:!1}),p=new re;p.setAttribute("position",new E(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new E(e.colors,3)),l.vertexColors=!0);const a=new Q(p,l);o.add(a)}return o}}const ct={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},lt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const W=200,B=250,T=250,J=W+B,$=W+T,dt=W+J,ut=W+$,fe=10,ve=30,ht=4,mt=20,ft=2,vt=B/2+25,pt=T/2+25,k=new Ce,gt=.01,ee=0,te=10,we=2,bt=30,xe=1,wt=1,xt=(wt-xe)/(te-ee),yt=(bt-we)/(te-ee);var O=7,se=De(),C=ye();window.addEventListener("wheel",r=>{O=U.clamp(O-r.deltaY*gt,ee,te),se=De(),C=ye()});function ye(){return we+yt*O}function De(){return xe+xt*O}const L=new Ie(75,window.innerWidth/window.innerHeight,.1,1e3);L.position.set(vt,se,pt);L.lookAt(0,0,0);const A=new Ae({antialias:!0});A.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(A.domElement);const Dt=8947848,Ue=13421772,Ut=11184810,Lt=8947848,jt=13421772,Pt=4473924,St=5592405,ne="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Le=new Re,X=Le.load(ne+"textures/noise-perlin-0.png");X.wrapS=H;X.wrapT=H;X.repeat.set(40,40);const Mt=new Ge(dt,ut),kt=new ge({color:Dt,bumpMap:X,bumpScale:.7}),oe=new S(Mt,kt);oe.rotation.x=-Math.PI/2;oe.receiveShadow=!0;k.add(oe);new S;const Et=new I({color:Ut});Le.load(ne+"textures/spotlight-0.png",r=>{for(let t=0;t<100;t++){const e=U.randFloat(fe,ve),n=U.randFloat(ht,mt),s=U.randFloat(fe,ve),o=new Y(e,n,s),c=n>12?_t(s,e,r):new I({color:Ue}),l=new S(o,c),p={x:U.randFloat(-B/2,B/2),y:o.parameters.height/2,z:U.randFloat(-T/2,T/2)};l.position.set(p.x,p.y,p.z),l.castShadow=!0,l.receiveShadow=!0;for(let a=0;a<4;a++){const d=new Y(1,2,.1),i=new S(d,Et),u=a<2?1:-1;i.position.set(U.randFloat(-o.parameters.width/2,o.parameters.width/2),d.parameters.height/2-o.parameters.height/2,u*o.parameters.depth/2-u*.9*.5*d.parameters.depth);const m=new Y(.03,.25,.2),f=new I({color:Lt}),h=new S(m,f);h.position.set(-.3*d.parameters.width,-.05*d.parameters.height,0),i.add(h),l.add(i)}k.add(l)}});function _t(r,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((o,c)=>{if(o===null)return;o.wrapS=H,o.wrapT=H;const l=Math.floor(c===0||c===1?r/10:t/10);o.repeat.set(l,1)}),n.map(o=>new I({color:Ue,lightMap:o,lightMapIntensity:ft}))}const Ft=new at;Ft.load(ne+"models/palmtree-0.obj",r=>{for(let t=0;t<800;t++){const e=r.clone(),n=U.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(U.randFloat(-J/2,J/2),0,U.randFloat(-$/2,$/2)),e.rotation.y=U.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof S&&(s.material=new ge({color:St}))}),k.add(e)}});const Vt=new He(Pt);k.add(Vt);const q=new Be(jt);q.intensity=10.5;q.decay=.7;k.add(q);L.add(q);k.add(L);const D=new M,V=new Ye(L,A.domElement);document.addEventListener("click",()=>{V.lock()});V.addEventListener("lock",()=>{console.log("Pointer locked")});V.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const y={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",r=>{switch(r.code){case"KeyW":y.forward=!0;break;case"KeyS":y.backward=!0;break;case"KeyA":y.left=!0;break;case"KeyD":y.right=!0;break}});document.addEventListener("keyup",r=>{switch(r.code){case"KeyW":y.forward=!1;break;case"KeyS":y.backward=!1;break;case"KeyA":y.left=!1;break;case"KeyD":y.right=!1;break}});const z=new Xe(A),zt=new qe(k,L);z.addPass(zt);const Ct=new be(lt);z.addPass(Ct);const It=new be(ct);z.addPass(It);const At=new tt(2,!1);z.addPass(At);const Rt=new Te,Gt=.18,Ht=.035;var pe=0;function je(){requestAnimationFrame(je);const r=Rt.getDelta();if(V.isLocked){D.x-=D.x*10*r,D.z-=D.z*10*r,y.forward&&(D.z-=C*r),y.backward&&(D.z+=C*r),y.left&&(D.x-=C*r),y.right&&(D.x+=C*r),V.moveRight(D.x*r),V.moveForward(-D.z*r),pe+=Gt*D.length();const t=Math.sin(pe)*Ht;L.position.y=se+t}z.render(r)}je();window.addEventListener("resize",()=>{L.aspect=window.innerWidth/window.innerHeight,L.updateProjectionMatrix(),A.setSize(window.innerWidth,window.innerHeight),z.setSize(window.innerWidth,window.innerHeight)});

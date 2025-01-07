import{V as M,C as Pe,E as ke,U as Me,g as Ee,e as _e,L as Fe,F as Ve,p as Ce,G as ze,B as re,q as E,r as K,s as ae,t as R,u as I,v as ce,w as Q,h as k,c as Ie,b as D,d as Ae,W as Re,n as Ge,x as H,i as He,y as be,m as Y,A as Be,z as Oe,o as Te}from"./three.module-BHKQH0IX.js";import{P as We,F as Ne,E as Xe,R as qe,S as we}from"./RenderPass-C-85Xdv9.js";const _=new ke(0,0,0,"YXZ"),F=new M,Ke={type:"change"},Qe={type:"lock"},Ye={type:"unlock"},le=Math.PI/2;class Ze extends Pe{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=Je.bind(this),this._onPointerlockChange=$e.bind(this),this._onPointerlockError=et.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),F.crossVectors(e.up,F),e.position.addScaledVector(F,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(F,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function Je(r){if(this.enabled===!1||this.isLocked===!1)return;const t=r.movementX||r.mozMovementX||r.webkitMovementX||0,e=r.movementY||r.mozMovementY||r.webkitMovementY||0,s=this.object;_.setFromQuaternion(s.quaternion),_.y-=t*.002*this.pointerSpeed,_.x-=e*.002*this.pointerSpeed,_.x=Math.max(le-this.maxPolarAngle,Math.min(le-this.minPolarAngle,_.x)),s.quaternion.setFromEuler(_),this.dispatchEvent(Ke)}function $e(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(Qe),this.isLocked=!0):(this.dispatchEvent(Ye),this.isLocked=!1)}function et(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const tt={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class nt extends We{constructor(t=.5,e=!1){super();const s=tt;this.uniforms=Me.clone(s.uniforms),this.material=new Ee({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new Ne(this.material)}render(t,e,s,n){this.uniforms.tDiffuse.value=s.texture,this.uniforms.time.value+=n,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const st=/^[og]\s*(.+)?/,ot=/^mtllib /,it=/^usemtl /,rt=/^usemap /,de=/\s+/,ue=new M,Z=new M,he=new M,me=new M,x=new M,G=new _e;function at(){const r={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const s=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(n,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const l={index:this.materials.length,name:n||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(l),l},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(n){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),n&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return n&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},s&&s.name&&typeof s.clone=="function"){const n=s.clone(0);n.inherited=!0,this.object.materials.push(n)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseNormalIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseUVIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/2)*2},addVertex:function(t,e,s){const n=this.vertices,o=this.object.geometry.vertices;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,s){const n=this.normals,o=this.object.geometry.normals;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addFaceNormal:function(t,e,s){const n=this.vertices,o=this.object.geometry.normals;ue.fromArray(n,t),Z.fromArray(n,e),he.fromArray(n,s),x.subVectors(he,Z),me.subVectors(ue,Z),x.cross(me),x.normalize(),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z)},addColor:function(t,e,s){const n=this.colors,o=this.object.geometry.colors;n[t]!==void 0&&o.push(n[t+0],n[t+1],n[t+2]),n[e]!==void 0&&o.push(n[e+0],n[e+1],n[e+2]),n[s]!==void 0&&o.push(n[s+0],n[s+1],n[s+2])},addUV:function(t,e,s){const n=this.uvs,o=this.object.geometry.uvs;o.push(n[t+0],n[t+1]),o.push(n[e+0],n[e+1]),o.push(n[s+0],n[s+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,s,n,o,c,l,p,a){const d=this.vertices.length;let i=this.parseVertexIndex(t,d),u=this.parseVertexIndex(e,d),m=this.parseVertexIndex(s,d);if(this.addVertex(i,u,m),this.addColor(i,u,m),l!==void 0&&l!==""){const f=this.normals.length;i=this.parseNormalIndex(l,f),u=this.parseNormalIndex(p,f),m=this.parseNormalIndex(a,f),this.addNormal(i,u,m)}else this.addFaceNormal(i,u,m);if(n!==void 0&&n!==""){const f=this.uvs.length;i=this.parseUVIndex(n,f),u=this.parseUVIndex(o,f),m=this.parseUVIndex(c,f),this.addUV(i,u,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let s=0,n=t.length;s<n;s++){const o=this.parseVertexIndex(t[s],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const s=this.vertices.length,n=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],s));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],n))}};return r.startObject("",!1),r}class ct extends Fe{constructor(t){super(t),this.materials=null}load(t,e,s,n){const o=this,c=new Ve(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{e(o.parse(l))}catch(p){n?n(p):console.error(p),o.manager.itemError(t)}},s,n)}setMaterials(t){return this.materials=t,this}parse(t){const e=new at;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const s=t.split(`
`);let n=[];for(let l=0,p=s.length;l<p;l++){const a=s[l].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const i=a.split(de);switch(i[0]){case"v":e.vertices.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3])),i.length>=7?(G.setRGB(parseFloat(i[4]),parseFloat(i[5]),parseFloat(i[6]),Ce),e.colors.push(G.r,G.g,G.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));break;case"vt":e.uvs.push(parseFloat(i[1]),parseFloat(i[2]));break}}else if(d==="f"){const u=a.slice(1).trim().split(de),m=[];for(let h=0,g=u.length;h<g;h++){const b=u[h];if(b.length>0){const w=b.split("/");m.push(w)}}const f=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(d==="l"){const i=a.substring(1).trim().split(" ");let u=[];const m=[];if(a.indexOf("/")===-1)u=i;else for(let f=0,h=i.length;f<h;f++){const g=i[f].split("/");g[0]!==""&&u.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(u,m)}else if(d==="p"){const u=a.slice(1).trim().split(" ");e.addPointGeometry(u)}else if((n=st.exec(a))!==null){const i=(" "+n[0].slice(1).trim()).slice(1);e.startObject(i)}else if(it.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(ot.test(a))e.materialLibraries.push(a.substring(7).trim());else if(rt.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(n=a.split(" "),n.length>1){const u=n[1].trim().toLowerCase();e.object.smooth=u!=="0"&&u!=="off"}else e.object.smooth=!0;const i=e.object.currentMaterial();i&&(i.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new ze;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let l=0,p=e.objects.length;l<p;l++){const a=e.objects[l],d=a.geometry,i=a.materials,u=d.type==="Line",m=d.type==="Points";let f=!1;if(d.vertices.length===0)continue;const h=new re;h.setAttribute("position",new E(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new E(d.normals,3)),d.colors.length>0&&(f=!0,h.setAttribute("color",new E(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new E(d.uvs,2));const g=[];for(let w=0,q=i.length;w<q;w++){const S=i[w],ie=S.name+"_"+S.smooth+"_"+f;let v=e.materials[ie];if(this.materials!==null){if(v=this.materials.create(S.name),u&&v&&!(v instanceof K)){const P=new K;ae.prototype.copy.call(P,v),P.color.copy(v.color),v=P}else if(m&&v&&!(v instanceof R)){const P=new R({size:10,sizeAttenuation:!1});ae.prototype.copy.call(P,v),P.color.copy(v.color),P.map=v.map,v=P}}v===void 0&&(u?v=new K:m?v=new R({size:1,sizeAttenuation:!1}):v=new I,v.name=S.name,v.flatShading=!S.smooth,v.vertexColors=f,e.materials[ie]=v),g.push(v)}let b;if(g.length>1){for(let w=0,q=i.length;w<q;w++){const S=i[w];h.addGroup(S.groupStart,S.groupCount,w)}u?b=new ce(h,g):m?b=new Q(h,g):b=new k(h,g)}else u?b=new ce(h,g[0]):m?b=new Q(h,g[0]):b=new k(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const l=new R({size:1,sizeAttenuation:!1}),p=new re;p.setAttribute("position",new E(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new E(e.colors,3)),l.vertexColors=!0);const a=new Q(p,l);o.add(a)}return o}}const lt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},dt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const W=200,B=250,O=250,J=W+B,$=W+O,ut=W+J,ht=W+$,fe=10,ve=30,mt=4,ft=20,vt=2,pt=B/2+25,gt=O/2+25,L=new Ie,bt=.01,ee=0,te=10,xe=2,wt=30,ye=1,xt=1,yt=(xt-ye)/(te-ee),jt=(wt-xe)/(te-ee);var T=7,ne=De(),z=je();window.addEventListener("wheel",r=>{T=D.clamp(T-r.deltaY*bt,ee,te),ne=De(),z=je()});function je(){return xe+jt*T}function De(){return ye+yt*T}const U=new Ae(75,window.innerWidth/window.innerHeight,.1,1e3);U.position.set(pt,ne,gt);U.lookAt(0,0,0);const A=new Re({antialias:!0});A.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(A.domElement);const Dt=8947848,Le=13421772,Lt=11184810,Ut=8947848,St=13421772,Pt=4473924,kt=5592405,se="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Ue=new Ge,N=Ue.load(se+"textures/noise-perlin-0.png");N.wrapS=H;N.wrapT=H;N.repeat.set(40,40);const Mt=new He(ut,ht),Et=new be({color:Dt,bumpMap:N,bumpScale:.7}),oe=new k(Mt,Et);oe.rotation.x=-Math.PI/2;oe.receiveShadow=!0;L.add(oe);new k;const _t=new I({color:Lt});Ue.load(se+"textures/spotlight-0.png",r=>{for(let t=0;t<100;t++){const e=D.randFloat(fe,ve),s=D.randFloat(mt,ft),n=D.randFloat(fe,ve),o=new Y(e,s,n),c=s>12?Ft(n,e,r):new I({color:Le}),l=new k(o,c),p={x:D.randFloat(-B/2,B/2),y:o.parameters.height/2,z:D.randFloat(-O/2,O/2)};l.position.set(p.x,p.y,p.z),l.castShadow=!0,l.receiveShadow=!0;for(let a=0;a<4;a++){const d=new Y(1,2,.1),i=new k(d,_t),u=a<2?1:-1;i.position.set(D.randFloat(-o.parameters.width/2,o.parameters.width/2),d.parameters.height/2-o.parameters.height/2,u*o.parameters.depth/2-u*.9*.5*d.parameters.depth);const m=new Y(.03,.25,.2),f=new I({color:Ut}),h=new k(m,f);h.position.set(-.3*d.parameters.width,-.05*d.parameters.height,0),i.add(h),l.add(i)}L.add(l)}});function Ft(r,t,e){const s=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return s.forEach((o,c)=>{if(o===null)return;o.wrapS=H,o.wrapT=H;const l=Math.floor(c===0||c===1?r/10:t/10);o.repeat.set(l,1)}),s.map(o=>new I({color:Le,lightMap:o,lightMapIntensity:vt}))}const Vt=new ct;Vt.load(se+"models/palmtree-0.obj",r=>{for(let t=0;t<800;t++){const e=r.clone(),s=D.randFloat(.005,.02);e.scale.set(s,s,s),e.position.set(D.randFloat(-J/2,J/2),0,D.randFloat(-$/2,$/2)),e.rotation.y=D.randFloat(0,2*Math.PI),e.traverse(n=>{n instanceof k&&(n.material=new be({color:kt}))}),L.add(e)}});const Ct=new Be(Pt);L.add(Ct);const X=new Oe(St);X.intensity=10.5;X.decay=.7;L.add(X);U.add(X);L.add(U);const j=new M,V=new Ze(U,A.domElement);document.addEventListener("click",()=>{V.lock()});V.addEventListener("lock",()=>{console.log("Pointer locked")});V.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const y={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",r=>{switch(r.code){case"KeyW":y.forward=!0;break;case"KeyS":y.backward=!0;break;case"KeyA":y.left=!0;break;case"KeyD":y.right=!0;break}});document.addEventListener("keyup",r=>{switch(r.code){case"KeyW":y.forward=!1;break;case"KeyS":y.backward=!1;break;case"KeyA":y.left=!1;break;case"KeyD":y.right=!1;break}});const C=new Xe(A),zt=new qe(L,U);C.addPass(zt);const It=new we(dt);C.addPass(It);const At=new we(lt);C.addPass(At);const Rt=new nt(2,!1);C.addPass(Rt);const Gt=new Te,Ht=.18,Bt=.035;var pe=0;function Se(){requestAnimationFrame(Se);const r=Gt.getDelta();if(V.isLocked){j.x-=j.x*10*r,j.z-=j.z*10*r,y.forward&&(j.z-=z*r),y.backward&&(j.z+=z*r),y.left&&(j.x-=z*r),y.right&&(j.x+=z*r),V.moveRight(j.x*r),V.moveForward(-j.z*r),pe+=Ht*j.length();const t=Math.sin(pe)*Bt;U.position.y=ne+t}C.render(r)}Se();window.addEventListener("resize",()=>{U.aspect=window.innerWidth/window.innerHeight,U.updateProjectionMatrix(),A.setSize(window.innerWidth,window.innerHeight),C.setSize(window.innerWidth,window.innerHeight)});var ge;(ge=document.getElementById("downloadBtn"))==null||ge.addEventListener("click",Ot);function Ot(){L.updateMatrixWorld();var r=L.toJSON(),t=JSON.stringify(r);const e=new Blob([t],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(e),s.download="tsam.three.js.scene.json",document.body.appendChild(s),s.click(),document.body.removeChild(s)}

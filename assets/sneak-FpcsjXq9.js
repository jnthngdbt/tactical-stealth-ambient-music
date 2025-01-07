import{V as k,C as Ve,E as Ce,U as ze,g as Ie,e as Ae,L as Re,F as He,p as Ge,G as Be,B as le,q as E,r as Q,s as de,t as G,u as R,v as ue,w as Z,h as U,c as Oe,b as x,d as Te,W as We,n as Ne,x as O,i as Xe,y as ne,m as Y,A as qe,z as Ke,o as Qe}from"./three.module-BHKQH0IX.js";import{P as Ze,F as Ye,E as Je,R as $e,S as je}from"./RenderPass-C-85Xdv9.js";const F=new Ce(0,0,0,"YXZ"),_=new k,et={type:"change"},tt={type:"lock"},nt={type:"unlock"},he=Math.PI/2;class st extends Ve{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=ot.bind(this),this._onPointerlockChange=it.bind(this),this._onPointerlockError=rt.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;_.setFromMatrixColumn(e.matrix,0),_.crossVectors(e.up,_),e.position.addScaledVector(_,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;_.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(_,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function ot(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,s=this.object;F.setFromQuaternion(s.quaternion),F.y-=t*.002*this.pointerSpeed,F.x-=e*.002*this.pointerSpeed,F.x=Math.max(he-this.maxPolarAngle,Math.min(he-this.minPolarAngle,F.x)),s.quaternion.setFromEuler(F),this.dispatchEvent(et)}function it(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(tt),this.isLocked=!0):(this.dispatchEvent(nt),this.isLocked=!1)}function rt(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const at={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class ct extends Ze{constructor(t=.5,e=!1){super();const s=at;this.uniforms=ze.clone(s.uniforms),this.material=new Ie({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new Ye(this.material)}render(t,e,s,n){this.uniforms.tDiffuse.value=s.texture,this.uniforms.time.value+=n,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const lt=/^[og]\s*(.+)?/,dt=/^mtllib /,ut=/^usemtl /,ht=/^usemap /,me=/\s+/,fe=new k,J=new k,ve=new k,pe=new k,y=new k,B=new Ae;function mt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const s=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(n,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const l={index:this.materials.length,name:n||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(l),l},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(n){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),n&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return n&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},s&&s.name&&typeof s.clone=="function"){const n=s.clone(0);n.inherited=!0,this.object.materials.push(n)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseNormalIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseUVIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/2)*2},addVertex:function(t,e,s){const n=this.vertices,o=this.object.geometry.vertices;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,s){const n=this.normals,o=this.object.geometry.normals;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addFaceNormal:function(t,e,s){const n=this.vertices,o=this.object.geometry.normals;fe.fromArray(n,t),J.fromArray(n,e),ve.fromArray(n,s),y.subVectors(ve,J),pe.subVectors(fe,J),y.cross(pe),y.normalize(),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z)},addColor:function(t,e,s){const n=this.colors,o=this.object.geometry.colors;n[t]!==void 0&&o.push(n[t+0],n[t+1],n[t+2]),n[e]!==void 0&&o.push(n[e+0],n[e+1],n[e+2]),n[s]!==void 0&&o.push(n[s+0],n[s+1],n[s+2])},addUV:function(t,e,s){const n=this.uvs,o=this.object.geometry.uvs;o.push(n[t+0],n[t+1]),o.push(n[e+0],n[e+1]),o.push(n[s+0],n[s+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,s,n,o,c,l,p,a){const d=this.vertices.length;let r=this.parseVertexIndex(t,d),u=this.parseVertexIndex(e,d),m=this.parseVertexIndex(s,d);if(this.addVertex(r,u,m),this.addColor(r,u,m),l!==void 0&&l!==""){const f=this.normals.length;r=this.parseNormalIndex(l,f),u=this.parseNormalIndex(p,f),m=this.parseNormalIndex(a,f),this.addNormal(r,u,m)}else this.addFaceNormal(r,u,m);if(n!==void 0&&n!==""){const f=this.uvs.length;r=this.parseUVIndex(n,f),u=this.parseUVIndex(o,f),m=this.parseUVIndex(c,f),this.addUV(r,u,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let s=0,n=t.length;s<n;s++){const o=this.parseVertexIndex(t[s],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const s=this.vertices.length,n=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],s));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],n))}};return i.startObject("",!1),i}class ft extends Re{constructor(t){super(t),this.materials=null}load(t,e,s,n){const o=this,c=new He(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{e(o.parse(l))}catch(p){n?n(p):console.error(p),o.manager.itemError(t)}},s,n)}setMaterials(t){return this.materials=t,this}parse(t){const e=new mt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const s=t.split(`
`);let n=[];for(let l=0,p=s.length;l<p;l++){const a=s[l].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const r=a.split(me);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(B.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Ge),e.colors.push(B.r,B.g,B.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(d==="f"){const u=a.slice(1).trim().split(me),m=[];for(let h=0,g=u.length;h<g;h++){const b=u[h];if(b.length>0){const w=b.split("/");m.push(w)}}const f=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(d==="l"){const r=a.substring(1).trim().split(" ");let u=[];const m=[];if(a.indexOf("/")===-1)u=r;else for(let f=0,h=r.length;f<h;f++){const g=r[f].split("/");g[0]!==""&&u.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(u,m)}else if(d==="p"){const u=a.slice(1).trim().split(" ");e.addPointGeometry(u)}else if((n=lt.exec(a))!==null){const r=(" "+n[0].slice(1).trim()).slice(1);e.startObject(r)}else if(ut.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(dt.test(a))e.materialLibraries.push(a.substring(7).trim());else if(ht.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(n=a.split(" "),n.length>1){const u=n[1].trim().toLowerCase();e.object.smooth=u!=="0"&&u!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new Be;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let l=0,p=e.objects.length;l<p;l++){const a=e.objects[l],d=a.geometry,r=a.materials,u=d.type==="Line",m=d.type==="Points";let f=!1;if(d.vertices.length===0)continue;const h=new le;h.setAttribute("position",new E(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new E(d.normals,3)),d.colors.length>0&&(f=!0,h.setAttribute("color",new E(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new E(d.uvs,2));const g=[];for(let w=0,K=r.length;w<K;w++){const P=r[w],ce=P.name+"_"+P.smooth+"_"+f;let v=e.materials[ce];if(this.materials!==null){if(v=this.materials.create(P.name),u&&v&&!(v instanceof Q)){const M=new Q;de.prototype.copy.call(M,v),M.color.copy(v.color),v=M}else if(m&&v&&!(v instanceof G)){const M=new G({size:10,sizeAttenuation:!1});de.prototype.copy.call(M,v),M.color.copy(v.color),M.map=v.map,v=M}}v===void 0&&(u?v=new Q:m?v=new G({size:1,sizeAttenuation:!1}):v=new R,v.name=P.name,v.flatShading=!P.smooth,v.vertexColors=f,e.materials[ce]=v),g.push(v)}let b;if(g.length>1){for(let w=0,K=r.length;w<K;w++){const P=r[w];h.addGroup(P.groupStart,P.groupCount,w)}u?b=new ue(h,g):m?b=new Z(h,g):b=new U(h,g)}else u?b=new ue(h,g[0]):m?b=new Z(h,g[0]):b=new U(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const l=new G({size:1,sizeAttenuation:!1}),p=new le;p.setAttribute("position",new E(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new E(e.colors,3)),l.vertexColors=!0);const a=new Z(p,l);o.add(a)}return o}}const vt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},pt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const W=200,C=250,z=250,$=W+C,ee=W+z,gt=W+$,bt=W+ee,ge=10,be=30,wt=4,xt=20,yt=5,jt=C/2+25,Dt=z/2+25,L=new Oe,Lt=.01,se=0,oe=10,De=2,Ut=30,Le=1,St=1,Pt=(St-Le)/(oe-se),Mt=(Ut-De)/(oe-se);var T=7,ie=Se(),A=Ue();window.addEventListener("wheel",i=>{T=x.clamp(T-i.deltaY*Lt,se,oe),ie=Se(),A=Ue()});function Ue(){return De+Mt*T}function Se(){return Le+Pt*T}const S=new Te(75,window.innerWidth/window.innerHeight,.1,1e3);S.position.set(jt,ie,Dt);S.lookAt(0,0,0);const H=new We({antialias:!0});H.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(H.domElement);const kt=8947848,Pe=8947848,Et=6710886,Ft=8947848,_t=13421772,Vt=13421772,Ct=5592405,zt=16777215,N="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Me=new Ne,X=Me.load(N+"textures/noise-perlin-0.png");X.wrapS=O;X.wrapT=O;X.repeat.set(40,40);const we=512,re=new Xe(gt,bt,we,we),It=new ne({color:kt,bumpMap:X,bumpScale:.7}),te=re.attributes.position;for(let i=0;i<te.count;i++){const t=Math.random()*.1;te.setZ(i,t)}te.needsUpdate=!0;re.computeVertexNormals();const ae=new U(re,It);ae.rotation.x=-Math.PI/2;ae.receiveShadow=!0;L.add(ae);new U;const At=new R({color:Et});Me.load(N+"textures/spotlight-0.png",i=>{for(let t=0;t<100;t++){const e=x.randFloat(ge,be),s=x.randFloat(wt,xt),n=x.randFloat(ge,be),o=new Y(e,s,n),c=s>12?Rt(n,e,i):new R({color:Pe}),l=new U(o,c),p={x:x.randFloat(-C/2,C/2),y:o.parameters.height/2,z:x.randFloat(-z/2,z/2)};l.position.set(p.x,p.y,p.z),l.castShadow=!0,l.receiveShadow=!0;for(let a=0;a<4;a++){const d=new Y(1,2,.1),r=new U(d,At),u=a<2?1:-1;r.position.set(x.randFloat(-o.parameters.width/2,o.parameters.width/2),d.parameters.height/2-o.parameters.height/2,u*o.parameters.depth/2-u*.9*.5*d.parameters.depth);const m=new Y(.03,.25,.2),f=new R({color:Ft}),h=new U(m,f);h.position.set(-.3*d.parameters.width,-.05*d.parameters.height,0),r.add(h),l.add(r)}L.add(l)}});function Rt(i,t,e){const s=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return s.forEach((o,c)=>{if(o===null)return;o.wrapS=O,o.wrapT=O;const l=Math.floor(c===0||c===1?i/10:t/10);o.repeat.set(l,1)}),s.map(o=>new R({color:Pe,lightMap:o,lightMapIntensity:yt}))}const ke=new ft;ke.load(N+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),s=x.randFloat(.005,.02);e.scale.set(s,s,s),e.position.set(x.randFloat(-$/2,$/2),0,x.randFloat(-ee/2,ee/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(n=>{n instanceof U&&(n.material=new ne({color:Ct}))}),L.add(e)}});ke.load(N+"models/soldier-0.obj",i=>{for(let t=0;t<70;t++){const e=i.clone(),s=.028;e.scale.set(s,s,s),e.position.set(x.randFloat(-C/2,C/2),0,x.randFloat(-z/2,z/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(n=>{n instanceof U&&(n.material=new ne({color:zt}))}),L.add(e)}});const Ht=new qe(Vt);L.add(Ht);const q=new Ke(_t);q.intensity=10.5;q.decay=.7;L.add(q);S.add(q);L.add(S);const D=new k,V=new st(S,H.domElement);document.addEventListener("click",()=>{V.lock()});V.addEventListener("lock",()=>{console.log("Pointer locked")});V.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const I=new Je(H),Gt=new $e(L,S);I.addPass(Gt);const Ee=new je(pt);Ee.uniforms.v.value=1.2/window.innerHeight;I.addPass(Ee);const Fe=new je(vt);Fe.uniforms.h.value=1.2/window.innerWidth;I.addPass(Fe);const Bt=new ct(2,!1);I.addPass(Bt);const Ot=new Qe,Tt=.18,Wt=.035;var xe=0;function _e(){requestAnimationFrame(_e);const i=Ot.getDelta();if(V.isLocked){D.x-=D.x*10*i,D.z-=D.z*10*i,j.forward&&(D.z-=A*i),j.backward&&(D.z+=A*i),j.left&&(D.x-=A*i),j.right&&(D.x+=A*i),V.moveRight(D.x*i),V.moveForward(-D.z*i),xe+=Tt*D.length();const t=Math.sin(xe)*Wt;S.position.y=ie+t}I.render(i)}_e();window.addEventListener("resize",()=>{S.aspect=window.innerWidth/window.innerHeight,S.updateProjectionMatrix(),H.setSize(window.innerWidth,window.innerHeight),I.setSize(window.innerWidth,window.innerHeight)});var ye;(ye=document.getElementById("downloadBtn"))==null||ye.addEventListener("click",Nt);function Nt(){L.updateMatrixWorld();var i=L.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(e),s.download="tsam.three.js.scene.json",document.body.appendChild(s),s.click(),document.body.removeChild(s)}

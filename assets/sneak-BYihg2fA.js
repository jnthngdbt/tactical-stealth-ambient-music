import{V as E,C as ze,E as Ie,U as Ae,g as Re,e as T,L as Ge,F as He,p as Be,G as Oe,B as de,q as _,r as Y,s as ue,t as B,u as G,v as he,w as J,h as U,c as Te,b as x,d as Ne,A as We,x as Xe,W as qe,n as Ke,y as N,i as Qe,z as De,m as $,H as Ze,o as Ye}from"./three.module-C0wgaaDp.js";import{P as Je,F as $e,E as et,R as tt,S as Le}from"./RenderPass-CLUQskjH.js";const F=new Ie(0,0,0,"YXZ"),V=new E,nt={type:"change"},st={type:"lock"},ot={type:"unlock"},me=Math.PI/2;class it extends ze{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=rt.bind(this),this._onPointerlockChange=at.bind(this),this._onPointerlockError=ct.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;V.setFromMatrixColumn(e.matrix,0),V.crossVectors(e.up,V),e.position.addScaledVector(V,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;V.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(V,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function rt(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,s=this.object;F.setFromQuaternion(s.quaternion),F.y-=t*.002*this.pointerSpeed,F.x-=e*.002*this.pointerSpeed,F.x=Math.max(me-this.maxPolarAngle,Math.min(me-this.minPolarAngle,F.x)),s.quaternion.setFromEuler(F),this.dispatchEvent(nt)}function at(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(st),this.isLocked=!0):(this.dispatchEvent(ot),this.isLocked=!1)}function ct(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const lt={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class dt extends Je{constructor(t=.5,e=!1){super();const s=lt;this.uniforms=Ae.clone(s.uniforms),this.material=new Re({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new $e(this.material)}render(t,e,s,n){this.uniforms.tDiffuse.value=s.texture,this.uniforms.time.value+=n,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ut=/^[og]\s*(.+)?/,ht=/^mtllib /,mt=/^usemtl /,ft=/^usemap /,fe=/\s+/,ve=new E,ee=new E,pe=new E,ge=new E,y=new E,O=new T;function vt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const s=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(n,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const l={index:this.materials.length,name:n||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(l),l},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(n){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),n&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return n&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},s&&s.name&&typeof s.clone=="function"){const n=s.clone(0);n.inherited=!0,this.object.materials.push(n)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseNormalIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/3)*3},parseUVIndex:function(t,e){const s=parseInt(t,10);return(s>=0?s-1:s+e/2)*2},addVertex:function(t,e,s){const n=this.vertices,o=this.object.geometry.vertices;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,s){const n=this.normals,o=this.object.geometry.normals;o.push(n[t+0],n[t+1],n[t+2]),o.push(n[e+0],n[e+1],n[e+2]),o.push(n[s+0],n[s+1],n[s+2])},addFaceNormal:function(t,e,s){const n=this.vertices,o=this.object.geometry.normals;ve.fromArray(n,t),ee.fromArray(n,e),pe.fromArray(n,s),y.subVectors(pe,ee),ge.subVectors(ve,ee),y.cross(ge),y.normalize(),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z)},addColor:function(t,e,s){const n=this.colors,o=this.object.geometry.colors;n[t]!==void 0&&o.push(n[t+0],n[t+1],n[t+2]),n[e]!==void 0&&o.push(n[e+0],n[e+1],n[e+2]),n[s]!==void 0&&o.push(n[s+0],n[s+1],n[s+2])},addUV:function(t,e,s){const n=this.uvs,o=this.object.geometry.uvs;o.push(n[t+0],n[t+1]),o.push(n[e+0],n[e+1]),o.push(n[s+0],n[s+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,s,n,o,c,l,p,a){const d=this.vertices.length;let r=this.parseVertexIndex(t,d),u=this.parseVertexIndex(e,d),m=this.parseVertexIndex(s,d);if(this.addVertex(r,u,m),this.addColor(r,u,m),l!==void 0&&l!==""){const f=this.normals.length;r=this.parseNormalIndex(l,f),u=this.parseNormalIndex(p,f),m=this.parseNormalIndex(a,f),this.addNormal(r,u,m)}else this.addFaceNormal(r,u,m);if(n!==void 0&&n!==""){const f=this.uvs.length;r=this.parseUVIndex(n,f),u=this.parseUVIndex(o,f),m=this.parseUVIndex(c,f),this.addUV(r,u,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let s=0,n=t.length;s<n;s++){const o=this.parseVertexIndex(t[s],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const s=this.vertices.length,n=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],s));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],n))}};return i.startObject("",!1),i}class pt extends Ge{constructor(t){super(t),this.materials=null}load(t,e,s,n){const o=this,c=new He(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{e(o.parse(l))}catch(p){n?n(p):console.error(p),o.manager.itemError(t)}},s,n)}setMaterials(t){return this.materials=t,this}parse(t){const e=new vt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const s=t.split(`
`);let n=[];for(let l=0,p=s.length;l<p;l++){const a=s[l].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const r=a.split(fe);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(O.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Be),e.colors.push(O.r,O.g,O.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(d==="f"){const u=a.slice(1).trim().split(fe),m=[];for(let h=0,g=u.length;h<g;h++){const b=u[h];if(b.length>0){const w=b.split("/");m.push(w)}}const f=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(d==="l"){const r=a.substring(1).trim().split(" ");let u=[];const m=[];if(a.indexOf("/")===-1)u=r;else for(let f=0,h=r.length;f<h;f++){const g=r[f].split("/");g[0]!==""&&u.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(u,m)}else if(d==="p"){const u=a.slice(1).trim().split(" ");e.addPointGeometry(u)}else if((n=ut.exec(a))!==null){const r=(" "+n[0].slice(1).trim()).slice(1);e.startObject(r)}else if(mt.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(ht.test(a))e.materialLibraries.push(a.substring(7).trim());else if(ft.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(n=a.split(" "),n.length>1){const u=n[1].trim().toLowerCase();e.object.smooth=u!=="0"&&u!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new Oe;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let l=0,p=e.objects.length;l<p;l++){const a=e.objects[l],d=a.geometry,r=a.materials,u=d.type==="Line",m=d.type==="Points";let f=!1;if(d.vertices.length===0)continue;const h=new de;h.setAttribute("position",new _(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new _(d.normals,3)),d.colors.length>0&&(f=!0,h.setAttribute("color",new _(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new _(d.uvs,2));const g=[];for(let w=0,Z=r.length;w<Z;w++){const M=r[w],le=M.name+"_"+M.smooth+"_"+f;let v=e.materials[le];if(this.materials!==null){if(v=this.materials.create(M.name),u&&v&&!(v instanceof Y)){const P=new Y;ue.prototype.copy.call(P,v),P.color.copy(v.color),v=P}else if(m&&v&&!(v instanceof B)){const P=new B({size:10,sizeAttenuation:!1});ue.prototype.copy.call(P,v),P.color.copy(v.color),P.map=v.map,v=P}}v===void 0&&(u?v=new Y:m?v=new B({size:1,sizeAttenuation:!1}):v=new G,v.name=M.name,v.flatShading=!M.smooth,v.vertexColors=f,e.materials[le]=v),g.push(v)}let b;if(g.length>1){for(let w=0,Z=r.length;w<Z;w++){const M=r[w];h.addGroup(M.groupStart,M.groupCount,w)}u?b=new he(h,g):m?b=new J(h,g):b=new U(h,g)}else u?b=new he(h,g[0]):m?b=new J(h,g[0]):b=new U(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const l=new B({size:1,sizeAttenuation:!1}),p=new de;p.setAttribute("position",new _(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new _(e.colors,3)),l.vertexColors=!0);const a=new J(p,l);o.add(a)}return o}}const gt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},bt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const wt=1;function k(i){const t=new T(i),e=wt*(t.r*.3+t.g*.59+t.b*.11);return new T(e,e,e)}const xt=k(65806),yt=k(8946557),Ue=k(9078658),jt=k(6973282),Dt=k(8947848),Lt=k(13421772),Ut=k(3355443),St=k(5592405),X="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",q=200,z=250,I=250,te=q+z,ne=q+I,Mt=q+te,Pt=q+ne,be=10,we=30,kt=4,Et=20,_t=5,Ft=z/2+25,Vt=I/2+25,L=new Te;L.background=new T(xt);const Ct=.01,oe=0,ie=10,Se=2,zt=30,Me=1,It=1,At=(It-Me)/(ie-oe),Rt=(zt-Se)/(ie-oe);var W=7,re=ke(),R=Pe();window.addEventListener("wheel",i=>{W=x.clamp(W-i.deltaY*Ct,oe,ie),re=ke(),R=Pe()});function Pe(){return Se+Rt*W}function ke(){return Me+At*W}const S=new Ne(75,window.innerWidth/window.innerHeight,.1,1e3);S.position.set(Ft,re,Vt);S.lookAt(0,0,0);const Gt=new We(Ut);L.add(Gt);const K=new Xe(Lt);K.intensity=10.5;K.decay=.5;L.add(K);S.add(K);L.add(S);const H=new qe({antialias:!0});H.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(H.domElement);const Ee=new Ke,Q=Ee.load(X+"textures/noise-perlin-0.png");Q.wrapS=N;Q.wrapT=N;Q.repeat.set(40,40);const xe=512,ae=new Qe(Mt,Pt,xe,xe),Ht=new De({color:yt,bumpMap:Q,bumpScale:.7}),se=ae.attributes.position;for(let i=0;i<se.count;i++){const t=Math.random()*.1;se.setZ(i,t)}se.needsUpdate=!0;ae.computeVertexNormals();const ce=new U(ae,Ht);ce.rotation.x=-Math.PI/2;ce.receiveShadow=!0;L.add(ce);new U;const Bt=new G({color:jt}),Ot="spotlight-0.png";Ee.load(X+"textures/"+Ot,i=>{for(let t=0;t<100;t++){const e=x.randFloat(be,we),s=x.randFloat(kt,Et),n=x.randFloat(be,we),o=new $(e,s,n),c=s>12?Tt(n,e,i):new G({color:Ue}),l=new U(o,c),p={x:x.randFloat(-z/2,z/2),y:o.parameters.height/2,z:x.randFloat(-I/2,I/2)};l.position.set(p.x,p.y,p.z),l.castShadow=!0,l.receiveShadow=!0;for(let a=0;a<4;a++){const d=new $(1,2,.1),r=new U(d,Bt),u=a<2?1:-1;r.position.set(x.randFloat(-o.parameters.width/2,o.parameters.width/2),d.parameters.height/2-o.parameters.height/2,u*o.parameters.depth/2-u*.9*.5*d.parameters.depth);const m=new $(.03,.25,.2),f=new G({color:Dt}),h=new U(m,f);h.position.set(-.3*d.parameters.width,-.05*d.parameters.height,0),r.add(h),l.add(r)}L.add(l)}});function Tt(i,t,e){const s=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return s.forEach((o,c)=>{if(o===null)return;o.wrapS=N,o.wrapT=N;const l=Math.floor(c===0||c===1?i/10:t/10);o.repeat.set(l,1)}),s.map(o=>new G({color:Ue,lightMap:o,lightMapIntensity:_t}))}const _e=new pt;_e.load(X+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),s=x.randFloat(.005,.02);e.scale.set(s,s,s),e.position.set(x.randFloat(-te/2,te/2),0,x.randFloat(-ne/2,ne/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(n=>{n instanceof U&&(n.material=new De({color:St}))}),L.add(e)}});_e.load(X+"models/soldier-0.obj",i=>{for(let t=0;t<70;t++){const e=i.clone(),s=.028;e.scale.set(s,s,s),e.position.set(x.randFloat(-z/2,z/2),0,x.randFloat(-I/2,I/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(n=>{n instanceof U&&(n.material=new Ze)}),L.add(e)}});const D=new E,C=new it(S,H.domElement);document.addEventListener("click",()=>{C.lock()});C.addEventListener("lock",()=>{console.log("Pointer locked")});C.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const A=new et(H),Nt=new tt(L,S);A.addPass(Nt);const Fe=new Le(bt);Fe.uniforms.v.value=1.2/window.innerHeight;A.addPass(Fe);const Ve=new Le(gt);Ve.uniforms.h.value=1.2/window.innerWidth;A.addPass(Ve);const Wt=new dt(2,!1);A.addPass(Wt);const Xt=new Ye,qt=.18,Kt=.035;var ye=0;function Ce(){requestAnimationFrame(Ce);const i=Xt.getDelta();if(C.isLocked){D.x-=D.x*10*i,D.z-=D.z*10*i,j.forward&&(D.z-=R*i),j.backward&&(D.z+=R*i),j.left&&(D.x-=R*i),j.right&&(D.x+=R*i),C.moveRight(D.x*i),C.moveForward(-D.z*i),ye+=qt*D.length();const t=Math.sin(ye)*Kt;S.position.y=re+t}A.render(i)}Ce();window.addEventListener("resize",()=>{S.aspect=window.innerWidth/window.innerHeight,S.updateProjectionMatrix(),H.setSize(window.innerWidth,window.innerHeight),A.setSize(window.innerWidth,window.innerHeight)});var je;(je=document.getElementById("downloadBtn"))==null||je.addEventListener("click",Qt);function Qt(){L.updateMatrixWorld();var i=L.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(e),s.download="tsam.three.js.scene.json",document.body.appendChild(s),s.click(),document.body.removeChild(s)}

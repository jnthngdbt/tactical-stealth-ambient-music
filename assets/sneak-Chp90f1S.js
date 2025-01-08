import{V as E,C as Re,E as Ge,U as He,g as Be,e as G,L as Oe,F as Te,p as Ne,G as We,B as ue,q as _,r as Y,s as he,t as T,u as H,v as me,w as J,h as U,c as Ke,b as x,d as Xe,A as qe,x as Qe,W as Ze,n as Ye,y as W,i as Je,z as Le,m as $,H as $e,o as et}from"./three.module-C0wgaaDp.js";import{P as tt,F as nt,E as st,R as ot,S as Ue}from"./RenderPass-CLUQskjH.js";const F=new Ge(0,0,0,"YXZ"),V=new E,it={type:"change"},rt={type:"lock"},at={type:"unlock"},fe=Math.PI/2;class ct extends Re{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=lt.bind(this),this._onPointerlockChange=dt.bind(this),this._onPointerlockError=ut.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;V.setFromMatrixColumn(e.matrix,0),V.crossVectors(e.up,V),e.position.addScaledVector(V,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;V.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(V,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function lt(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.object;F.setFromQuaternion(n.quaternion),F.y-=t*.002*this.pointerSpeed,F.x-=e*.002*this.pointerSpeed,F.x=Math.max(fe-this.maxPolarAngle,Math.min(fe-this.minPolarAngle,F.x)),n.quaternion.setFromEuler(F),this.dispatchEvent(it)}function dt(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(rt),this.isLocked=!0):(this.dispatchEvent(at),this.isLocked=!1)}function ut(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const ht={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class mt extends tt{constructor(t=.5,e=!1){super();const n=ht;this.uniforms=He.clone(n.uniforms),this.material=new Be({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new nt(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ft=/^[og]\s*(.+)?/,vt=/^mtllib /,pt=/^usemtl /,gt=/^usemap /,ve=/\s+/,pe=new E,ee=new E,ge=new E,be=new E,y=new E,N=new G;function bt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const l={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(p){const a={index:typeof p=="number"?p:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(l),l},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;pe.fromArray(s,t),ee.fromArray(s,e),ge.fromArray(s,n),y.subVectors(ge,ee),be.subVectors(pe,ee),y.cross(be),y.normalize(),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z),o.push(y.x,y.y,y.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,c,l,p,a){const d=this.vertices.length;let r=this.parseVertexIndex(t,d),u=this.parseVertexIndex(e,d),m=this.parseVertexIndex(n,d);if(this.addVertex(r,u,m),this.addColor(r,u,m),l!==void 0&&l!==""){const f=this.normals.length;r=this.parseNormalIndex(l,f),u=this.parseNormalIndex(p,f),m=this.parseNormalIndex(a,f),this.addNormal(r,u,m)}else this.addFaceNormal(r,u,m);if(s!==void 0&&s!==""){const f=this.uvs.length;r=this.parseUVIndex(s,f),u=this.parseUVIndex(o,f),m=this.parseUVIndex(c,f),this.addUV(r,u,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return i.startObject("",!1),i}class wt extends Oe{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,c=new Te(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{e(o.parse(l))}catch(p){s?s(p):console.error(p),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new bt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let l=0,p=n.length;l<p;l++){const a=n[l].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const r=a.split(ve);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(N.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Ne),e.colors.push(N.r,N.g,N.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(d==="f"){const u=a.slice(1).trim().split(ve),m=[];for(let h=0,g=u.length;h<g;h++){const b=u[h];if(b.length>0){const w=b.split("/");m.push(w)}}const f=m[0];for(let h=1,g=m.length-1;h<g;h++){const b=m[h],w=m[h+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(d==="l"){const r=a.substring(1).trim().split(" ");let u=[];const m=[];if(a.indexOf("/")===-1)u=r;else for(let f=0,h=r.length;f<h;f++){const g=r[f].split("/");g[0]!==""&&u.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(u,m)}else if(d==="p"){const u=a.slice(1).trim().split(" ");e.addPointGeometry(u)}else if((s=ft.exec(a))!==null){const r=(" "+s[0].slice(1).trim()).slice(1);e.startObject(r)}else if(pt.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(vt.test(a))e.materialLibraries.push(a.substring(7).trim());else if(gt.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(s=a.split(" "),s.length>1){const u=s[1].trim().toLowerCase();e.object.smooth=u!=="0"&&u!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new We;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let l=0,p=e.objects.length;l<p;l++){const a=e.objects[l],d=a.geometry,r=a.materials,u=d.type==="Line",m=d.type==="Points";let f=!1;if(d.vertices.length===0)continue;const h=new ue;h.setAttribute("position",new _(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new _(d.normals,3)),d.colors.length>0&&(f=!0,h.setAttribute("color",new _(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new _(d.uvs,2));const g=[];for(let w=0,Z=r.length;w<Z;w++){const S=r[w],de=S.name+"_"+S.smooth+"_"+f;let v=e.materials[de];if(this.materials!==null){if(v=this.materials.create(S.name),u&&v&&!(v instanceof Y)){const M=new Y;he.prototype.copy.call(M,v),M.color.copy(v.color),v=M}else if(m&&v&&!(v instanceof T)){const M=new T({size:10,sizeAttenuation:!1});he.prototype.copy.call(M,v),M.color.copy(v.color),M.map=v.map,v=M}}v===void 0&&(u?v=new Y:m?v=new T({size:1,sizeAttenuation:!1}):v=new H,v.name=S.name,v.flatShading=!S.smooth,v.vertexColors=f,e.materials[de]=v),g.push(v)}let b;if(g.length>1){for(let w=0,Z=r.length;w<Z;w++){const S=r[w];h.addGroup(S.groupStart,S.groupCount,w)}u?b=new me(h,g):m?b=new J(h,g):b=new U(h,g)}else u?b=new me(h,g[0]):m?b=new J(h,g[0]):b=new U(h,g[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const l=new T({size:1,sizeAttenuation:!1}),p=new ue;p.setAttribute("position",new _(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(p.setAttribute("color",new _(e.colors,3)),l.vertexColors=!0);const a=new J(p,l);o.add(a)}return o}}const xt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},yt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const jt=1,Dt=16777215;var te=!0;const Pe=1/1e3;function k(i){const t=new G(i),e=jt*(t.r*.3+t.g*.59+t.b*.11),n=new G(Dt);return new G(e*n.r,e*n.g,e*n.b)}const Lt=k(65806),Ut=k(8946557),Se=k(9078658),Pt=k(6973282),St=k(8947848),Mt=k(13421772),kt=k(3355443),Et=k(5592405),X="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",q=200,z=250,I=250,ne=q+z,se=q+I,_t=q+ne,Ft=q+se,we=10,xe=30,Vt=4,Ct=20,zt=20,It=z/2+25,At=I/2+25,L=new Ke;L.background=new G(Lt);const Rt=.01,ie=0,re=10,Me=2,Gt=30,ke=1,Ht=1,Bt=(Ht-ke)/(re-ie),Ot=(Gt-Me)/(re-ie);var K=7,ae=_e(),R=Ee();window.addEventListener("wheel",i=>{K=x.clamp(K-i.deltaY*Rt,ie,re),ae=_e(),R=Ee()});function Ee(){return Me+Ot*K}function _e(){return ke+Bt*K}const P=new Xe(75,window.innerWidth/window.innerHeight,.1,1e3);P.position.set(It,ae,At);P.lookAt(0,0,0);function Fe(){return te?10.5:0}const Tt=new qe(kt);L.add(Tt);const B=new Qe(Mt);B.intensity=Fe();B.decay=.5;L.add(B);P.add(B);L.add(P);const O=new Ze({antialias:!0});O.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(O.domElement);const Ve=new Ye,Q=Ve.load(X+"textures/noise-perlin-0.png");Q.wrapS=W;Q.wrapT=W;Q.repeat.set(40,40);const ye=512,ce=new Je(_t,Ft,ye,ye),Nt=new Le({color:Ut,bumpMap:Q,bumpScale:.7}),oe=ce.attributes.position;for(let i=0;i<oe.count;i++){const t=Math.random()*.1;oe.setZ(i,t)}oe.needsUpdate=!0;ce.computeVertexNormals();const le=new U(ce,Nt);le.rotation.x=-Math.PI/2;le.receiveShadow=!0;L.add(le);new U;const Wt=new H({color:Pt}),Kt="spotlight-0.png";Ve.load(X+"textures/"+Kt,i=>{for(let t=0;t<100;t++){const e=x.randFloat(we,xe),n=x.randFloat(Vt,Ct),s=x.randFloat(we,xe),o=new $(e,n,s),c=n>12?Xt(s,e,i):new H({color:Se}),l=new U(o,c),p={x:x.randFloat(-z/2,z/2),y:o.parameters.height/2,z:x.randFloat(-I/2,I/2)};l.position.set(p.x,p.y,p.z),l.castShadow=!0,l.receiveShadow=!0;for(let a=0;a<4;a++){const d=new $(1,2,.1),r=new U(d,Wt),u=a<2?1:-1;r.position.set(x.randFloat(-o.parameters.width/2,o.parameters.width/2),d.parameters.height/2-o.parameters.height/2,u*o.parameters.depth/2-u*.9*.5*d.parameters.depth);const m=new $(.03,.25,.2),f=new H({color:St}),h=new U(m,f);h.position.set(-.3*d.parameters.width,-.05*d.parameters.height,0),r.add(h),l.add(r)}L.add(l)}});function Xt(i,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((o,c)=>{if(o===null)return;o.wrapS=W,o.wrapT=W;const l=Math.floor(c===0||c===1?i/10:t/10);o.repeat.set(l,1)}),n.map(o=>new H({color:Se,lightMap:o,lightMapIntensity:zt}))}const Ce=new wt;Ce.load(X+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),n=x.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(x.randFloat(-ne/2,ne/2),0,x.randFloat(-se/2,se/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof U&&(s.material=new Le({color:Et}))}),L.add(e)}});Ce.load(X+"models/soldier-0.obj",i=>{for(let t=0;t<70;t++){const e=i.clone(),n=.028;e.scale.set(n,n,n),e.position.set(x.randFloat(-z/2,z/2),0,x.randFloat(-I/2,I/2)),e.rotation.y=x.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof U&&(s.material=new $e)}),L.add(e)}});const D=new E,C=new ct(P,O.domElement);document.addEventListener("click",()=>{C.lock()});C.addEventListener("lock",()=>{console.log("Pointer locked")});C.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break;case"KeyC":B.intensity=Fe(),te=!te;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const A=new st(O),qt=new ot(L,P);A.addPass(qt);const ze=new Ue(yt),Ie=new Ue(xt);ze.uniforms.v.value=Pe;Ie.uniforms.h.value=Pe;A.addPass(ze);A.addPass(Ie);const Qt=new mt(2,!1);A.addPass(Qt);const Zt=new et,Yt=.18,Jt=.035;var je=0;function Ae(){requestAnimationFrame(Ae);const i=Zt.getDelta();if(C.isLocked){D.x-=D.x*10*i,D.z-=D.z*10*i,j.forward&&(D.z-=R*i),j.backward&&(D.z+=R*i),j.left&&(D.x-=R*i),j.right&&(D.x+=R*i),C.moveRight(D.x*i),C.moveForward(-D.z*i),je+=Yt*D.length();const t=Math.sin(je)*Jt;P.position.y=ae+t}A.render(i)}Ae();window.addEventListener("resize",()=>{P.aspect=window.innerWidth/window.innerHeight,P.updateProjectionMatrix(),O.setSize(window.innerWidth,window.innerHeight),A.setSize(window.innerWidth,window.innerHeight)});var De;(De=document.getElementById("downloadBtn"))==null||De.addEventListener("click",$t);function $t(){L.updateMatrixWorld();var i=L.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

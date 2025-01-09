import{V as _,C as Re,E as Ge,U as Be,g as He,e as G,L as Oe,F as Te,p as Ne,G as We,B as ue,q as F,r as J,s as he,t as T,u as B,v as me,w as $,h as M,c as Ke,b as L,d as Xe,A as qe,x as Qe,W as Ze,n as Ye,y as W,i as Je,z as Le,m as ee,H as $e,o as et}from"./three.module-C0wgaaDp.js";import{P as tt,F as nt,E as st,R as ot,S as Ue}from"./RenderPass-CLUQskjH.js";const V=new Ge(0,0,0,"YXZ"),z=new _,it={type:"change"},rt={type:"lock"},at={type:"unlock"},fe=Math.PI/2;class ct extends Re{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=lt.bind(this),this._onPointerlockChange=dt.bind(this),this._onPointerlockError=ut.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),z.crossVectors(e.up,z),e.position.addScaledVector(z,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(z,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function lt(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.object;V.setFromQuaternion(n.quaternion),V.y-=t*.002*this.pointerSpeed,V.x-=e*.002*this.pointerSpeed,V.x=Math.max(fe-this.maxPolarAngle,Math.min(fe-this.minPolarAngle,V.x)),n.quaternion.setFromEuler(V),this.dispatchEvent(it)}function dt(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(rt),this.isLocked=!0):(this.dispatchEvent(at),this.isLocked=!1)}function ut(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const ht={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class mt extends tt{constructor(t=.5,e=!1){super();const n=ht;this.uniforms=Be.clone(n.uniforms),this.material=new He({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new nt(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ft=/^[og]\s*(.+)?/,vt=/^mtllib /,pt=/^usemtl /,gt=/^usemap /,ve=/\s+/,pe=new _,te=new _,ge=new _,be=new _,j=new _,N=new G;function bt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const d={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(g){const a={index:typeof g=="number"?g:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(d),d},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;pe.fromArray(s,t),te.fromArray(s,e),ge.fromArray(s,n),j.subVectors(ge,te),be.subVectors(pe,te),j.cross(be),j.normalize(),o.push(j.x,j.y,j.z),o.push(j.x,j.y,j.z),o.push(j.x,j.y,j.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,c,d,g,a){const h=this.vertices.length;let r=this.parseVertexIndex(t,h),l=this.parseVertexIndex(e,h),u=this.parseVertexIndex(n,h);if(this.addVertex(r,l,u),this.addColor(r,l,u),d!==void 0&&d!==""){const f=this.normals.length;r=this.parseNormalIndex(d,f),l=this.parseNormalIndex(g,f),u=this.parseNormalIndex(a,f),this.addNormal(r,l,u)}else this.addFaceNormal(r,l,u);if(s!==void 0&&s!==""){const f=this.uvs.length;r=this.parseUVIndex(s,f),l=this.parseUVIndex(o,f),u=this.parseUVIndex(c,f),this.addUV(r,l,u),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return i.startObject("",!1),i}class wt extends Oe{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,c=new Te(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(d){try{e(o.parse(d))}catch(g){s?s(g):console.error(g),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new bt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let d=0,g=n.length;d<g;d++){const a=n[d].trimStart();if(a.length===0)continue;const h=a.charAt(0);if(h!=="#")if(h==="v"){const r=a.split(ve);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(N.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Ne),e.colors.push(N.r,N.g,N.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(h==="f"){const l=a.slice(1).trim().split(ve),u=[];for(let m=0,p=l.length;m<p;m++){const b=l[m];if(b.length>0){const w=b.split("/");u.push(w)}}const f=u[0];for(let m=1,p=u.length-1;m<p;m++){const b=u[m],w=u[m+1];e.addFace(f[0],b[0],w[0],f[1],b[1],w[1],f[2],b[2],w[2])}}else if(h==="l"){const r=a.substring(1).trim().split(" ");let l=[];const u=[];if(a.indexOf("/")===-1)l=r;else for(let f=0,m=r.length;f<m;f++){const p=r[f].split("/");p[0]!==""&&l.push(p[0]),p[1]!==""&&u.push(p[1])}e.addLineGeometry(l,u)}else if(h==="p"){const l=a.slice(1).trim().split(" ");e.addPointGeometry(l)}else if((s=ft.exec(a))!==null){const r=(" "+s[0].slice(1).trim()).slice(1);e.startObject(r)}else if(pt.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(vt.test(a))e.materialLibraries.push(a.substring(7).trim());else if(gt.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(h==="s"){if(s=a.split(" "),s.length>1){const l=s[1].trim().toLowerCase();e.object.smooth=l!=="0"&&l!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new We;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let d=0,g=e.objects.length;d<g;d++){const a=e.objects[d],h=a.geometry,r=a.materials,l=h.type==="Line",u=h.type==="Points";let f=!1;if(h.vertices.length===0)continue;const m=new ue;m.setAttribute("position",new F(h.vertices,3)),h.normals.length>0&&m.setAttribute("normal",new F(h.normals,3)),h.colors.length>0&&(f=!0,m.setAttribute("color",new F(h.colors,3))),h.hasUVIndices===!0&&m.setAttribute("uv",new F(h.uvs,2));const p=[];for(let w=0,S=r.length;w<S;w++){const y=r[w],A=y.name+"_"+y.smooth+"_"+f;let v=e.materials[A];if(this.materials!==null){if(v=this.materials.create(y.name),l&&v&&!(v instanceof J)){const k=new J;he.prototype.copy.call(k,v),k.color.copy(v.color),v=k}else if(u&&v&&!(v instanceof T)){const k=new T({size:10,sizeAttenuation:!1});he.prototype.copy.call(k,v),k.color.copy(v.color),k.map=v.map,v=k}}v===void 0&&(l?v=new J:u?v=new T({size:1,sizeAttenuation:!1}):v=new B,v.name=y.name,v.flatShading=!y.smooth,v.vertexColors=f,e.materials[A]=v),p.push(v)}let b;if(p.length>1){for(let w=0,S=r.length;w<S;w++){const y=r[w];m.addGroup(y.groupStart,y.groupCount,w)}l?b=new me(m,p):u?b=new $(m,p):b=new M(m,p)}else l?b=new me(m,p[0]):u?b=new $(m,p[0]):b=new M(m,p[0]);b.name=a.name,o.add(b)}else if(e.vertices.length>0){const d=new T({size:1,sizeAttenuation:!1}),g=new ue;g.setAttribute("position",new F(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(g.setAttribute("color",new F(e.colors,3)),d.vertexColors=!0);const a=new $(g,d);o.add(a)}return o}}const xt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const jt=1,Dt=16777215;var ne=!0;const Me=1/1e3;function E(i){const t=new G(i),e=jt*(t.r*.3+t.g*.59+t.b*.11),n=new G(Dt);return new G(e*n.r,e*n.g,e*n.b)}const Lt=E(65806),Ut=E(8946557),Pe=E(9078658),Mt=E(6973282),Pt=E(8947848),St=E(13421772),kt=E(3355443),Et=E(5592405),K="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Z=200,X=250,q=250,se=Z+X,oe=Z+q,_t=Z+se,Ft=Z+oe,we=10,xe=30,Vt=4,zt=20,Ct=20,It=X/2+25,At=q/2+25,U=new Ke;U.background=new G(Lt);const Rt=.01,re=0,ae=10,Se=2,Gt=30,ke=1,Bt=1,Ht=(Bt-ke)/(ae-re),Ot=(Gt-Se)/(ae-re);var Q=7,ce=_e(),R=Ee();window.addEventListener("wheel",i=>{Q=L.clamp(Q-i.deltaY*Rt,re,ae),ce=_e(),R=Ee()});function Ee(){return Se+Ot*Q}function _e(){return ke+Ht*Q}const P=new Xe(75,window.innerWidth/window.innerHeight,.1,1e3);P.position.set(It,ce,At);P.lookAt(0,0,0);function Fe(){return ne?10.5:0}const Tt=new qe(kt);U.add(Tt);const H=new Qe(St);H.intensity=Fe();H.decay=.5;U.add(H);P.add(H);U.add(P);const O=new Ze({antialias:!0});O.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(O.domElement);const Ve=new Ye,Y=Ve.load(K+"textures/noise-perlin-0.png");Y.wrapS=W;Y.wrapT=W;Y.repeat.set(40,40);const ye=512,le=new Je(_t,Ft,ye,ye),Nt=new Le({color:Ut,bumpMap:Y,bumpScale:.7}),ie=le.attributes.position;for(let i=0;i<ie.count;i++){const t=Math.random()*.1;ie.setZ(i,t)}ie.needsUpdate=!0;le.computeVertexNormals();const de=new M(le,Nt);de.rotation.x=-Math.PI/2;de.receiveShadow=!0;U.add(de);new M;const ze=new wt,Wt=new B({color:Mt}),Kt="spotlight-0.png";Ve.load(K+"textures/"+Kt,i=>{ze.load(K+"models/soldier-0.obj",t=>{for(let e=0;e<100;e++){const n=L.randFloat(we,xe),s=L.randFloat(Vt,zt),o=L.randFloat(we,xe),c=s>12,d=new ee(n,s,o),g=c?Xt(o,n,i):new B({color:Pe}),a=new M(d,g),h={x:L.randFloat(-X/2,X/2),y:d.parameters.height/2,z:L.randFloat(-q/2,q/2)};a.position.set(h.x,h.y,h.z),a.castShadow=!0,a.receiveShadow=!0;for(let r=0;r<2;r++){const l=new ee(1,2,.1),u=new M(l,Wt),f=r<1?1:-1,m=.9*d.parameters.width/2;u.position.set(L.randFloat(-m,m),l.parameters.height/2-d.parameters.height/2,f*d.parameters.depth/2-f*.9*.5*l.parameters.depth);const p=new ee(.03,.25,.2),b=new B({color:Pt}),w=new M(p,b);if(w.position.set(-.3*l.parameters.width,-.05*l.parameters.height,0),c){const S=t.clone(),y=.028;S.scale.set(y,y,f*y),S.position.set(1,-l.parameters.height/2,f*.2),S.traverse(A=>{A instanceof M&&(A.material=new $e)}),u.add(S)}u.add(w),a.add(u)}U.add(a)}})});function Xt(i,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((o,c)=>{if(o===null)return;o.wrapS=W,o.wrapT=W;const d=Math.floor(c===0||c===1?i/10:t/10);o.repeat.set(d,1)}),n.map(o=>new B({color:Pe,lightMap:o,lightMapIntensity:Ct}))}ze.load(K+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),n=L.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(L.randFloat(-se/2,se/2),0,L.randFloat(-oe/2,oe/2)),e.rotation.y=L.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof M&&(s.material=new Le({color:Et}))}),U.add(e)}});const C=new ct(P,O.domElement);document.addEventListener("click",()=>{C.lock()});C.addEventListener("lock",()=>{console.log("Pointer locked")});C.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const D={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":D.forward=!0;break;case"KeyS":D.backward=!0;break;case"KeyA":D.left=!0;break;case"KeyD":D.right=!0;break;case"KeyC":H.intensity=Fe(),ne=!ne;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":D.forward=!1;break;case"KeyS":D.backward=!1;break;case"KeyA":D.left=!1;break;case"KeyD":D.right=!1;break}});const I=new st(O),qt=new ot(U,P);I.addPass(qt);const Ce=new Ue(yt),Ie=new Ue(xt);Ce.uniforms.v.value=Me;Ie.uniforms.h.value=Me;I.addPass(Ce);I.addPass(Ie);const Qt=new mt(2,!1);I.addPass(Qt);const Zt=new et,x=new _,Yt=8,Jt=.035;var je=0;function Ae(){requestAnimationFrame(Ae);const i=Zt.getDelta();if(C.isLocked){x.x-=x.x*10*i,x.z-=x.z*10*i,D.forward&&(x.z-=R*i),D.backward&&(x.z+=R*i),D.left&&(x.x-=R*i),D.right&&(x.x+=R*i);const t=.1,n=Math.abs(x.x)>t&&Math.abs(x.z)>t?.707:1;C.moveRight(x.x*n*i),C.moveForward(-x.z*n*i),je+=i*Yt*x.length()*n;const s=Math.sin(je)*Jt;P.position.y=ce+s}I.render(i)}Ae();window.addEventListener("resize",()=>{P.aspect=window.innerWidth/window.innerHeight,P.updateProjectionMatrix(),O.setSize(window.innerWidth,window.innerHeight),I.setSize(window.innerWidth,window.innerHeight)});var De;(De=document.getElementById("downloadBtn"))==null||De.addEventListener("click",$t);function $t(){U.updateMatrixWorld();var i=U.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

import{V as _,C as Te,E as He,U as Oe,g as Ne,e as B,L as We,F as Xe,p as Ke,G as qe,B as he,q as F,r as J,s as me,t as W,u as G,v as fe,w as $,h as S,c as Ze,b as D,d as Qe,A as Ye,x as Je,W as $e,n as et,y as K,i as tt,z as Ue,m as ee,H as nt,f as st,o as ot}from"./three.module-D_lgyIuw.js";import{P as it,F as rt,E as at,R as ct,S as Pe}from"./RenderPass-o2zfdpRC.js";const V=new He(0,0,0,"YXZ"),z=new _,lt={type:"change"},dt={type:"lock"},ut={type:"unlock"},ve=Math.PI/2;class ht extends Te{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=mt.bind(this),this._onPointerlockChange=ft.bind(this),this._onPointerlockError=vt.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),z.crossVectors(e.up,z),e.position.addScaledVector(z,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(z,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function mt(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.object;V.setFromQuaternion(n.quaternion),V.y-=t*.002*this.pointerSpeed,V.x-=e*.002*this.pointerSpeed,V.x=Math.max(ve-this.maxPolarAngle,Math.min(ve-this.minPolarAngle,V.x)),n.quaternion.setFromEuler(V),this.dispatchEvent(lt)}function ft(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(dt),this.isLocked=!0):(this.dispatchEvent(ut),this.isLocked=!1)}function vt(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const pt={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class gt extends it{constructor(t=.5,e=!1){super();const n=pt;this.uniforms=Oe.clone(n.uniforms),this.material=new Ne({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new rt(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const bt=/^[og]\s*(.+)?/,wt=/^mtllib /,yt=/^usemtl /,xt=/^usemap /,pe=/\s+/,ge=new _,te=new _,be=new _,we=new _,x=new _,X=new B;function Dt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const a=this._finalize(!1);a&&(a.inherited||a.groupCount<=0)&&this.materials.splice(a.index,1);const u={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:a!==void 0?a.smooth:this.smooth,groupStart:a!==void 0?a.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(d){const c={index:typeof d=="number"?d:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return c.clone=this.clone.bind(c),c}};return this.materials.push(u),u},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let a=this.materials.length-1;a>=0;a--)this.materials[a].groupCount<=0&&this.materials.splice(a,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;ge.fromArray(s,t),te.fromArray(s,e),be.fromArray(s,n),x.subVectors(be,te),we.subVectors(ge,te),x.cross(we),x.normalize(),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z),o.push(x.x,x.y,x.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,a,u,d,c){const h=this.vertices.length;let r=this.parseVertexIndex(t,h),l=this.parseVertexIndex(e,h),m=this.parseVertexIndex(n,h);if(this.addVertex(r,l,m),this.addColor(r,l,m),u!==void 0&&u!==""){const v=this.normals.length;r=this.parseNormalIndex(u,v),l=this.parseNormalIndex(d,v),m=this.parseNormalIndex(c,v),this.addNormal(r,l,m)}else this.addFaceNormal(r,l,m);if(s!==void 0&&s!==""){const v=this.uvs.length;r=this.parseUVIndex(s,v),l=this.parseUVIndex(o,v),m=this.parseUVIndex(a,v),this.addUV(r,l,m),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,a=t.length;o<a;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,a=e.length;o<a;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return i.startObject("",!1),i}class jt extends We{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,a=new Xe(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(u){try{e(o.parse(u))}catch(d){s?s(d):console.error(d),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new Dt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let u=0,d=n.length;u<d;u++){const c=n[u].trimStart();if(c.length===0)continue;const h=c.charAt(0);if(h!=="#")if(h==="v"){const r=c.split(pe);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(X.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Ke),e.colors.push(X.r,X.g,X.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(h==="f"){const l=c.slice(1).trim().split(pe),m=[];for(let f=0,g=l.length;f<g;f++){const b=l[f];if(b.length>0){const w=b.split("/");m.push(w)}}const v=m[0];for(let f=1,g=m.length-1;f<g;f++){const b=m[f],w=m[f+1];e.addFace(v[0],b[0],w[0],v[1],b[1],w[1],v[2],b[2],w[2])}}else if(h==="l"){const r=c.substring(1).trim().split(" ");let l=[];const m=[];if(c.indexOf("/")===-1)l=r;else for(let v=0,f=r.length;v<f;v++){const g=r[v].split("/");g[0]!==""&&l.push(g[0]),g[1]!==""&&m.push(g[1])}e.addLineGeometry(l,m)}else if(h==="p"){const l=c.slice(1).trim().split(" ");e.addPointGeometry(l)}else if((s=bt.exec(c))!==null){const r=(" "+s[0].slice(1).trim()).slice(1);e.startObject(r)}else if(yt.test(c))e.object.startMaterial(c.substring(7).trim(),e.materialLibraries);else if(wt.test(c))e.materialLibraries.push(c.substring(7).trim());else if(xt.test(c))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(h==="s"){if(s=c.split(" "),s.length>1){const l=s[1].trim().toLowerCase();e.object.smooth=l!=="0"&&l!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(c==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+c+'"')}}e.finalize();const o=new qe;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let u=0,d=e.objects.length;u<d;u++){const c=e.objects[u],h=c.geometry,r=c.materials,l=h.type==="Line",m=h.type==="Points";let v=!1;if(h.vertices.length===0)continue;const f=new he;f.setAttribute("position",new F(h.vertices,3)),h.normals.length>0&&f.setAttribute("normal",new F(h.normals,3)),h.colors.length>0&&(v=!0,f.setAttribute("color",new F(h.colors,3))),h.hasUVIndices===!0&&f.setAttribute("uv",new F(h.uvs,2));const g=[];for(let w=0,A=r.length;w<A;w++){const L=r[w],P=L.name+"_"+L.smooth+"_"+v;let p=e.materials[P];if(this.materials!==null){if(p=this.materials.create(L.name),l&&p&&!(p instanceof J)){const k=new J;me.prototype.copy.call(k,p),k.color.copy(p.color),p=k}else if(m&&p&&!(p instanceof W)){const k=new W({size:10,sizeAttenuation:!1});me.prototype.copy.call(k,p),k.color.copy(p.color),k.map=p.map,p=k}}p===void 0&&(l?p=new J:m?p=new W({size:1,sizeAttenuation:!1}):p=new G,p.name=L.name,p.flatShading=!L.smooth,p.vertexColors=v,e.materials[P]=p),g.push(p)}let b;if(g.length>1){for(let w=0,A=r.length;w<A;w++){const L=r[w];f.addGroup(L.groupStart,L.groupCount,w)}l?b=new fe(f,g):m?b=new $(f,g):b=new S(f,g)}else l?b=new fe(f,g[0]):m?b=new $(f,g[0]):b=new S(f,g[0]);b.name=c.name,o.add(b)}else if(e.vertices.length>0){const u=new W({size:1,sizeAttenuation:!1}),d=new he;d.setAttribute("position",new F(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(d.setAttribute("color",new F(e.colors,3)),u.vertexColors=!0);const c=new $(d,u);o.add(c)}return o}}const Lt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},Mt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const St=1,Ut=16777215;var ne=!0;const ke=1/1e3;function E(i){const t=new B(i),e=St*(t.r*.3+t.g*.59+t.b*.11),n=new B(Ut);return new B(e*n.r,e*n.g,e*n.b)}const Pt=E(65806),kt=E(8946557),Ee=E(9078658),Et=E(6973282),_t=E(8947848),Ft=E(13421772),Vt=E(3355443),zt=E(5592405),Ct=16777215,ae="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Z=200,T=250,H=250,se=Z+T,oe=Z+H,It=Z+se,At=Z+oe,Rt=1.2*T,Bt=1.2*H,ye=512,xe=10,De=30,Gt=4,Tt=20,Ht=20,Ot=12,je=10,Nt=T/2+25,Wt=H/2+25,Xt=8,Kt=.035,qt=10.5,Zt=.5,Qt=.01,ce=0,Q=10,Yt=Q,_e=2,Jt=30,Fe=1,$t=1,en=($t-Fe)/(Q-ce),tn=(Jt-_e)/(Q-ce),ie=[1,1.8,1.2,.8,1,1.2,1.4,1.2,1,1,1,1,1,1,1],nn=1,sn=ie.length/nn,M=new Ze;M.background=new B(Pt);var q=Yt,le=ze(),R=Ve();window.addEventListener("wheel",i=>{q=D.clamp(q-i.deltaY*Qt,ce,Q),le=ze(),R=Ve()});function Ve(){return _e+tn*q}function ze(){return Fe+en*q}const U=new Qe(75,window.innerWidth/window.innerHeight,.1,1e3);U.position.set(Nt,le,Wt);U.lookAt(0,0,0);function Ce(){return ne?qt:0}const on=new Ye(Vt);M.add(on);const O=new Je(Ft);O.intensity=Ce();O.decay=Zt;M.add(O);U.add(O);M.add(U);const N=new $e({antialias:!0});N.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(N.domElement);const Ie=new et,Y=Ie.load(ae+"textures/noise-perlin-0.png");Y.wrapS=K;Y.wrapT=K;Y.repeat.set(40,40);const de=new tt(It,At,ye,ye),rn=new Ue({color:kt,bumpMap:Y,bumpScale:.7}),re=de.attributes.position;for(let i=0;i<re.count;i++){const t=Math.random()*.1;re.setZ(i,t)}re.needsUpdate=!0;de.computeVertexNormals();const ue=new S(de,rn);ue.rotation.x=-Math.PI/2;ue.receiveShadow=!0;M.add(ue);new S;const an=new jt;var Ae=[];const cn=new G({color:Et}),ln="spotlight-0.png";Ie.load(ae+"textures/"+ln,i=>{for(let t=0;t<100;t++){const e=D.randFloat(xe,De),n=D.randFloat(Gt,Tt),s=D.randFloat(xe,De),o=n>Ot,a=new ee(e,n,s),u=o?dn(s,e,i):new G({color:Ee}),d=new S(a,u),c={x:D.randFloat(-T/2,T/2),y:a.parameters.height/2,z:D.randFloat(-H/2,H/2)};d.position.set(c.x,c.y,c.z),d.castShadow=!0,d.receiveShadow=!0;for(let h=0;h<2;h++){const r=new ee(1,2,.1),l=new S(r,cn),m=h<1?1:-1,v=.9*a.parameters.width/2;l.position.set(D.randFloat(-v,v),r.parameters.height/2-a.parameters.height/2,m*a.parameters.depth/2-m*.9*.5*r.parameters.depth);const f=new ee(.03,.25,.2),g=new G({color:_t}),b=new S(f,g);if(b.position.set(-.3*r.parameters.width,-.05*r.parameters.height,0),Math.abs(d.position.x)<Rt/2&&Math.abs(d.position.z)<Bt/2){const A=new nt(.01,32,32),L=new st({color:Ct,depthTest:!1}),P=new S(A,L);P.renderOrder=1,P.position.set(1,0,-m*1.5),P.userData={heartSpeed:D.randFloat(1,1.4)},l.add(P),Ae.push(P)}l.add(b),d.add(l)}M.add(d)}});function dn(i,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((o,a)=>{if(o===null)return;o.wrapS=K,o.wrapT=K;const u=Math.floor(a===0||a===1?i/je:t/je);o.repeat.set(u,1)}),n.map(o=>new G({color:Ee,lightMap:o,lightMapIntensity:Ht}))}an.load(ae+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),n=D.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(D.randFloat(-se/2,se/2),0,D.randFloat(-oe/2,oe/2)),e.rotation.y=D.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof S&&(s.material=new Ue({color:zt}))}),M.add(e)}});const C=new ht(U,N.domElement);document.addEventListener("click",()=>{C.lock()});C.addEventListener("lock",()=>{console.log("Pointer locked")});C.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break;case"KeyC":O.intensity=Ce(),ne=!ne;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const I=new at(N),un=new ct(M,U);I.addPass(un);const Re=new Pe(Mt),Be=new Pe(Lt);Re.uniforms.v.value=ke;Be.uniforms.h.value=ke;I.addPass(Re);I.addPass(Be);const hn=new gt(2,!1);I.addPass(hn);const Le=new ot,y=new _;var Me=0;function Ge(){requestAnimationFrame(Ge);const i=Le.getDelta();if(C.isLocked){y.x-=y.x*10*i,y.z-=y.z*10*i,j.forward&&(y.z-=R*i),j.backward&&(y.z+=R*i),j.left&&(y.x-=R*i),j.right&&(y.x+=R*i);const t=.1,n=Math.abs(y.x)>t&&Math.abs(y.z)>t?.707:1;C.moveRight(y.x*n*i),C.moveForward(-y.z*n*i),Me+=i*Xt*y.length()*n;const s=Math.sin(Me)*Kt;U.position.y=le+s,Ae.forEach(o=>{const a=Le.elapsedTime*sn*o.userData.heartSpeed,u=Math.floor(a)%ie.length,d=10*(ie[u]-.7);o.scale.set(d,d,d)})}I.render(i)}Ge();window.addEventListener("resize",()=>{U.aspect=window.innerWidth/window.innerHeight,U.updateProjectionMatrix(),N.setSize(window.innerWidth,window.innerHeight),I.setSize(window.innerWidth,window.innerHeight)});var Se;(Se=document.getElementById("downloadBtn"))==null||Se.addEventListener("click",mn);function mn(){M.updateMatrixWorld();var i=M.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

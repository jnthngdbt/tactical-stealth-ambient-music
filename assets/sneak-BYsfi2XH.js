import{U as Be,g as Se,V as I,e as E,L as Ge,F as He,p as Ne,G as Te,B as de,q as z,r as q,s as ue,t as H,u as R,v as he,w as X,h as F,c as Oe,b as y,d as We,A as Ke,x as Ze,W as Je,n as Qe,y as T,i as qe,z as Ue,m as Y,E as Xe,o as Ye}from"./three.module-B8BHS4ps.js";import{P as $e}from"./PointerLockControls-CJpi_4Po.js";import{P as et,F as tt,E as st,R as nt,S as Me}from"./RenderPass-DY6MlMTT.js";const ot={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class it extends et{constructor(t=.5,e=!1){super();const n=ot;this.uniforms=Be.clone(n.uniforms),this.material=new Se({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new tt(this.material)}render(t,e,n,s){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=s,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const rt=/^[og]\s*(.+)?/,at=/^mtllib /,ct=/^usemtl /,lt=/^usemap /,me=/\s+/,fe=new I,$=new I,ve=new I,pe=new I,D=new I,N=new E;function dt(){const r={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,o){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const f={index:this.materials.length,name:s||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(g){const l={index:typeof g=="number"?g:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return l.clone=this.clone.bind(l),l}};return this.materials.push(f),f},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),s&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const s=this.vertices,o=this.object.geometry.vertices;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const s=this.normals,o=this.object.geometry.normals;o.push(s[t+0],s[t+1],s[t+2]),o.push(s[e+0],s[e+1],s[e+2]),o.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){const s=this.vertices,o=this.object.geometry.normals;fe.fromArray(s,t),$.fromArray(s,e),ve.fromArray(s,n),D.subVectors(ve,$),pe.subVectors(fe,$),D.cross(pe),D.normalize(),o.push(D.x,D.y,D.z),o.push(D.x,D.y,D.z),o.push(D.x,D.y,D.z)},addColor:function(t,e,n){const s=this.colors,o=this.object.geometry.colors;s[t]!==void 0&&o.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&o.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&o.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){const s=this.uvs,o=this.object.geometry.uvs;o.push(s[t+0],s[t+1]),o.push(s[e+0],s[e+1]),o.push(s[n+0],s[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,o,c,f,g,l){const d=this.vertices.length;let i=this.parseVertexIndex(t,d),h=this.parseVertexIndex(e,d),v=this.parseVertexIndex(n,d);if(this.addVertex(i,h,v),this.addColor(i,h,v),f!==void 0&&f!==""){const u=this.normals.length;i=this.parseNormalIndex(f,u),h=this.parseNormalIndex(g,u),v=this.parseNormalIndex(l,u),this.addNormal(i,h,v)}else this.addFaceNormal(i,h,v);if(s!==void 0&&s!==""){const u=this.uvs.length;i=this.parseUVIndex(s,u),h=this.parseUVIndex(o,u),v=this.parseUVIndex(c,u),this.addUV(i,h,v),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){const o=this.parseVertexIndex(t[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,s=this.uvs.length;for(let o=0,c=t.length;o<c;o++)this.addVertexLine(this.parseVertexIndex(t[o],n));for(let o=0,c=e.length;o<c;o++)this.addUVLine(this.parseUVIndex(e[o],s))}};return r.startObject("",!1),r}class ut extends Ge{constructor(t){super(t),this.materials=null}load(t,e,n,s){const o=this,c=new He(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(f){try{e(o.parse(f))}catch(g){s?s(g):console.error(g),o.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){const e=new dt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let s=[];for(let f=0,g=n.length;f<g;f++){const l=n[f].trimStart();if(l.length===0)continue;const d=l.charAt(0);if(d!=="#")if(d==="v"){const i=l.split(me);switch(i[0]){case"v":e.vertices.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3])),i.length>=7?(N.setRGB(parseFloat(i[4]),parseFloat(i[5]),parseFloat(i[6]),Ne),e.colors.push(N.r,N.g,N.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));break;case"vt":e.uvs.push(parseFloat(i[1]),parseFloat(i[2]));break}}else if(d==="f"){const h=l.slice(1).trim().split(me),v=[];for(let a=0,m=h.length;a<m;a++){const w=h[a];if(w.length>0){const p=w.split("/");v.push(p)}}const u=v[0];for(let a=1,m=v.length-1;a<m;a++){const w=v[a],p=v[a+1];e.addFace(u[0],w[0],p[0],u[1],w[1],p[1],u[2],w[2],p[2])}}else if(d==="l"){const i=l.substring(1).trim().split(" ");let h=[];const v=[];if(l.indexOf("/")===-1)h=i;else for(let u=0,a=i.length;u<a;u++){const m=i[u].split("/");m[0]!==""&&h.push(m[0]),m[1]!==""&&v.push(m[1])}e.addLineGeometry(h,v)}else if(d==="p"){const h=l.slice(1).trim().split(" ");e.addPointGeometry(h)}else if((s=rt.exec(l))!==null){const i=(" "+s[0].slice(1).trim()).slice(1);e.startObject(i)}else if(ct.test(l))e.object.startMaterial(l.substring(7).trim(),e.materialLibraries);else if(at.test(l))e.materialLibraries.push(l.substring(7).trim());else if(lt.test(l))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(s=l.split(" "),s.length>1){const h=s[1].trim().toLowerCase();e.object.smooth=h!=="0"&&h!=="off"}else e.object.smooth=!0;const i=e.object.currentMaterial();i&&(i.smooth=e.object.smooth)}else{if(l==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+l+'"')}}e.finalize();const o=new Te;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let f=0,g=e.objects.length;f<g;f++){const l=e.objects[f],d=l.geometry,i=l.materials,h=d.type==="Line",v=d.type==="Points";let u=!1;if(d.vertices.length===0)continue;const a=new de;a.setAttribute("position",new z(d.vertices,3)),d.normals.length>0&&a.setAttribute("normal",new z(d.normals,3)),d.colors.length>0&&(u=!0,a.setAttribute("color",new z(d.colors,3))),d.hasUVIndices===!0&&a.setAttribute("uv",new z(d.uvs,2));const m=[];for(let p=0,S=i.length;p<S;p++){const U=i[p],C=U.name+"_"+U.smooth+"_"+u;let b=e.materials[C];if(this.materials!==null){if(b=this.materials.create(U.name),h&&b&&!(b instanceof q)){const P=new q;ue.prototype.copy.call(P,b),P.color.copy(b.color),b=P}else if(v&&b&&!(b instanceof H)){const P=new H({size:10,sizeAttenuation:!1});ue.prototype.copy.call(P,b),P.color.copy(b.color),P.map=b.map,b=P}}b===void 0&&(h?b=new q:v?b=new H({size:1,sizeAttenuation:!1}):b=new R,b.name=U.name,b.flatShading=!U.smooth,b.vertexColors=u,e.materials[C]=b),m.push(b)}let w;if(m.length>1){for(let p=0,S=i.length;p<S;p++){const U=i[p];a.addGroup(U.groupStart,U.groupCount,p)}h?w=new he(a,m):v?w=new X(a,m):w=new F(a,m)}else h?w=new he(a,m[0]):v?w=new X(a,m[0]):w=new F(a,m[0]);w.name=l.name,o.add(w)}else if(e.vertices.length>0){const f=new H({size:1,sizeAttenuation:!1}),g=new de;g.setAttribute("position",new z(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(g.setAttribute("color",new z(e.colors,3)),f.vertexColors=!0);const l=new X(g,f);o.add(l)}return o}}const ht={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},mt={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const ft=1,vt=16777215;var ee=!0;const Le=1/1e3;function V(r){const t=new E(r),e=ft*(t.r*.3+t.g*.59+t.b*.11),n=new E(vt);return new E(e*n.r,e*n.g,e*n.b)}const pt=V(65806),gt=V(8946557),Pe=V(9078658),bt=V(6973282),wt=V(8947848),yt=V(13421772),xt=V(3355443),Dt=V(5592405),ie="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Z=200,O=250,W=250,te=Z+O,se=Z+W,jt=Z+te,St=Z+se,ge=512,be=10,we=30,Ut=4,Mt=20,Lt=20,ye=10,Pt=5,Ft=O/2+25,Vt=W/2+25,zt=8,_t=.035,It=10.5,kt=.5,Ct=.01,re=0,J=10,At=J,Fe=2,Et=30,Ve=1,Rt=1,Bt=(Rt-Ve)/(J-re),Gt=(Et-Fe)/(J-re),Ht=2/100,Nt=.15,Tt=.015,ne=[1,1.8,1.2,.8,1,1.2,1.4,1.2,1,1,1,1,1,1,1],Ot=1,Wt=ne.length/Ot,M=new Oe;M.background=new E(pt);var K=At,ae=_e(),A=ze();window.addEventListener("wheel",r=>{K=y.clamp(K-r.deltaY*Ct,re,J),ae=_e(),A=ze()});function ze(){return Fe+Gt*K}function _e(){return Ve+Bt*K}const L=new We(75,window.innerWidth/window.innerHeight,.1,1e3);L.position.set(Ft,ae,Vt);L.lookAt(0,0,0);function Ie(){return ee?It:0}const Kt=new Ke(xt);M.add(Kt);const B=new Ze(yt);B.intensity=Ie();B.decay=kt;M.add(B);L.add(B);M.add(L);const G=new Je({antialias:!0});G.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(G.domElement);const Zt=new Se({vertexShader:`
		varying vec3 vNormal;
		varying vec3 vViewDir;
		varying float cameraDistance;

		void main() {
			vec4 worldPosition = modelMatrix * vec4(position, 1.0);
			cameraDistance = distance(cameraPosition, worldPosition.xyz);

			vNormal = normalize(normalMatrix * normal);
			vViewDir = normalize(-vec3(modelViewMatrix * vec4(position, 1.0)));

			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
		`,fragmentShader:`
		varying vec3 vNormal;
		varying vec3 vViewDir;
		varying float cameraDistance;

		void main() {
			float dotProduct = abs(dot(vNormal, vViewDir));
			float intensity = pow(dotProduct, 1.0);
			vec3 color = vec3(1.0, 0.0, 0.0);

			float distanceFade = clamp(1.0 - cameraDistance / 20.0, 0.0, 1.0);

			gl_FragColor = vec4(color, intensity * distanceFade);
		}
		`,depthTest:!1,transparent:!0}),ke=new Qe,Q=ke.load(ie+"textures/noise-perlin-0.png");Q.wrapS=T;Q.wrapT=T;Q.repeat.set(40,40);const ce=new qe(jt,St,ge,ge),Jt=new Ue({color:gt,bumpMap:Q,bumpScale:.7}),oe=ce.attributes.position;for(let r=0;r<oe.count;r++){const t=Math.random()*.1;oe.setZ(r,t)}oe.needsUpdate=!0;ce.computeVertexNormals();const le=new F(ce,Jt);le.rotation.x=-Math.PI/2;le.receiveShadow=!0;M.add(le);const Qt=new ut;var Ce=[];const qt=new R({color:bt}),Xt="spotlight-0.png";ke.load(ie+"textures/"+Xt,r=>{for(let t=0;t<100;t++){const e=y.randFloat(be,we),n=y.randFloat(Ut,Mt),s=y.randFloat(be,we),o=Math.max(Math.floor(n/Pt),1),c=n/o,f=o>2,g=new Y(e,n,s),l=f?Yt(s,e,r):new R({color:Pe}),d=new F(g,l),i={x:y.randFloat(-O/2,O/2),y:g.parameters.height/2,z:y.randFloat(-W/2,W/2)};d.position.set(i.x,i.y,i.z),d.castShadow=!0,d.receiveShadow=!0;for(let u=0;u<2;u++){const a=new Y(1,2,.1),m=new F(a,qt),w=u<1?1:-1,p=.9*g.parameters.width/2;m.position.set(y.randFloat(-p,p),a.parameters.height/2-g.parameters.height/2,w*g.parameters.depth/2-w*.9*.5*a.parameters.depth);const S=new Y(.03,.25,.2),U=new R({color:wt}),C=new F(S,U);C.position.set(-.3*a.parameters.width,-.05*a.parameters.height,0),m.add(C),d.add(m)}const h=e*s,v=Math.floor(h*Ht);for(let u=0;u<o;u++){const a=u*c;for(let m=0;m<v;m++){const w=new Xe(Tt),p=new F(w,Zt);p.renderOrder=1,p.userData={heartSpeed:y.randFloat(1,1.4)};const S=1-Nt;p.position.set(y.randFloat(-(S*e)/2,S*e/2),y.randFloat(a+.6-n/2,a+1.4-n/2),y.randFloat(-(S*s)/2,S*s/2)),d.add(p),Ce.push(p)}}M.add(d)}});function Yt(r,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((o,c)=>{if(o===null)return;o.wrapS=T,o.wrapT=T;const f=Math.floor(c===0||c===1?r/ye:t/ye);o.repeat.set(f,1)}),n.map(o=>new R({color:Pe,lightMap:o,lightMapIntensity:Lt}))}Qt.load(ie+"models/palmtree-0.obj",r=>{for(let t=0;t<1e3;t++){const e=r.clone(),n=y.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(y.randFloat(-te/2,te/2),0,y.randFloat(-se/2,se/2)),e.rotation.y=y.randFloat(0,2*Math.PI),e.traverse(s=>{s instanceof F&&(s.material=new Ue({color:Dt}))}),M.add(e)}});const _=new $e(L,G.domElement);document.addEventListener("click",()=>{_.lock()});_.addEventListener("lock",()=>{console.log("Pointer locked")});_.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",r=>{switch(r.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break;case"KeyC":B.intensity=Ie(),ee=!ee;break}});document.addEventListener("keyup",r=>{switch(r.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const k=new st(G),$t=new nt(M,L);k.addPass($t);const Ae=new Me(mt),Ee=new Me(ht);Ae.uniforms.v.value=Le;Ee.uniforms.h.value=Le;k.addPass(Ae);k.addPass(Ee);const es=new it(1.8,!1);k.addPass(es);const xe=new Ye,x=new I;var De=0;function Re(){requestAnimationFrame(Re);const r=xe.getDelta();if(_.isLocked){x.x-=x.x*15*r,x.z-=x.z*10*r,j.forward&&(x.z-=A*r),j.backward&&(x.z+=A*r),j.left&&(x.x-=A*r),j.right&&(x.x+=A*r);const t=.1,n=Math.abs(x.x)>t&&Math.abs(x.z)>t?.707:1;_.moveRight(x.x*n*r),_.moveForward(-x.z*n*r),De+=r*zt*x.length()*n;const s=Math.sin(De)*_t;L.position.y=ae+s}Ce.forEach(t=>{const e=xe.elapsedTime*Wt*t.userData.heartSpeed,n=Math.floor(e)%ne.length,s=10*(ne[n]-.6);t.scale.set(s,s,s)}),k.render(r)}Re();window.addEventListener("resize",()=>{L.aspect=window.innerWidth/window.innerHeight,L.updateProjectionMatrix(),G.setSize(window.innerWidth,window.innerHeight),k.setSize(window.innerWidth,window.innerHeight)});var je;(je=document.getElementById("downloadBtn"))==null||je.addEventListener("click",ts);function ts(){M.updateMatrixWorld();var r=M.toJSON(),t=JSON.stringify(r);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

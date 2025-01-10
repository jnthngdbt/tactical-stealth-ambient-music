import{V as F,C as Te,E as Ne,U as Oe,g as Le,e as B,L as We,F as Ke,p as Xe,G as qe,B as me,q as _,r as J,s as he,t as N,u as G,v as fe,w as $,h as k,c as Qe,b as y,d as Ze,A as Ye,x as Je,W as $e,n as et,y as W,i as tt,z as Ue,m as ee,H as nt,o as ot}from"./three.module-D_lgyIuw.js";import{P as st,F as it,E as rt,R as at,S as ke}from"./RenderPass-o2zfdpRC.js";const V=new Ne(0,0,0,"YXZ"),z=new F,ct={type:"change"},lt={type:"lock"},dt={type:"unlock"},ve=Math.PI/2;class ut extends Te{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=mt.bind(this),this._onPointerlockChange=ht.bind(this),this._onPointerlockError=ft.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),z.crossVectors(e.up,z),e.position.addScaledVector(z,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;z.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(z,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function mt(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.object;V.setFromQuaternion(n.quaternion),V.y-=t*.002*this.pointerSpeed,V.x-=e*.002*this.pointerSpeed,V.x=Math.max(ve-this.maxPolarAngle,Math.min(ve-this.minPolarAngle,V.x)),n.quaternion.setFromEuler(V),this.dispatchEvent(ct)}function ht(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(lt),this.isLocked=!0):(this.dispatchEvent(dt),this.isLocked=!1)}function ft(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const vt={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class pt extends st{constructor(t=.5,e=!1){super();const n=vt;this.uniforms=Oe.clone(n.uniforms),this.material=new Le({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new it(this.material)}render(t,e,n,o){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=o,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const gt=/^[og]\s*(.+)?/,bt=/^mtllib /,wt=/^usemtl /,yt=/^usemap /,pe=/\s+/,ge=new F,te=new F,be=new F,we=new F,D=new F,O=new B;function xt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(o,s){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const f={index:this.materials.length,name:o||"",mtllib:Array.isArray(s)&&s.length>0?s[s.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(g){const l={index:typeof g=="number"?g:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return l.clone=this.clone.bind(l),l}};return this.materials.push(f),f},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(o){const s=this.currentMaterial();if(s&&s.groupEnd===-1&&(s.groupEnd=this.geometry.vertices.length/3,s.groupCount=s.groupEnd-s.groupStart,s.inherited=!1),o&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return o&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),s}},n&&n.name&&typeof n.clone=="function"){const o=n.clone(0);o.inherited=!0,this.object.materials.push(o)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const o=this.vertices,s=this.object.geometry.vertices;s.push(o[t+0],o[t+1],o[t+2]),s.push(o[e+0],o[e+1],o[e+2]),s.push(o[n+0],o[n+1],o[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const o=this.normals,s=this.object.geometry.normals;s.push(o[t+0],o[t+1],o[t+2]),s.push(o[e+0],o[e+1],o[e+2]),s.push(o[n+0],o[n+1],o[n+2])},addFaceNormal:function(t,e,n){const o=this.vertices,s=this.object.geometry.normals;ge.fromArray(o,t),te.fromArray(o,e),be.fromArray(o,n),D.subVectors(be,te),we.subVectors(ge,te),D.cross(we),D.normalize(),s.push(D.x,D.y,D.z),s.push(D.x,D.y,D.z),s.push(D.x,D.y,D.z)},addColor:function(t,e,n){const o=this.colors,s=this.object.geometry.colors;o[t]!==void 0&&s.push(o[t+0],o[t+1],o[t+2]),o[e]!==void 0&&s.push(o[e+0],o[e+1],o[e+2]),o[n]!==void 0&&s.push(o[n+0],o[n+1],o[n+2])},addUV:function(t,e,n){const o=this.uvs,s=this.object.geometry.uvs;s.push(o[t+0],o[t+1]),s.push(o[e+0],o[e+1]),s.push(o[n+0],o[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,o,s,c,f,g,l){const d=this.vertices.length;let r=this.parseVertexIndex(t,d),m=this.parseVertexIndex(e,d),v=this.parseVertexIndex(n,d);if(this.addVertex(r,m,v),this.addColor(r,m,v),f!==void 0&&f!==""){const u=this.normals.length;r=this.parseNormalIndex(f,u),m=this.parseNormalIndex(g,u),v=this.parseNormalIndex(l,u),this.addNormal(r,m,v)}else this.addFaceNormal(r,m,v);if(o!==void 0&&o!==""){const u=this.uvs.length;r=this.parseUVIndex(o,u),m=this.parseUVIndex(s,u),v=this.parseUVIndex(c,u),this.addUV(r,m,v),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,o=t.length;n<o;n++){const s=this.parseVertexIndex(t[n],e);this.addVertexPoint(s),this.addColor(s)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,o=this.uvs.length;for(let s=0,c=t.length;s<c;s++)this.addVertexLine(this.parseVertexIndex(t[s],n));for(let s=0,c=e.length;s<c;s++)this.addUVLine(this.parseUVIndex(e[s],o))}};return i.startObject("",!1),i}class Dt extends We{constructor(t){super(t),this.materials=null}load(t,e,n,o){const s=this,c=new Ke(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(f){try{e(s.parse(f))}catch(g){o?o(g):console.error(g),s.manager.itemError(t)}},n,o)}setMaterials(t){return this.materials=t,this}parse(t){const e=new xt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let o=[];for(let f=0,g=n.length;f<g;f++){const l=n[f].trimStart();if(l.length===0)continue;const d=l.charAt(0);if(d!=="#")if(d==="v"){const r=l.split(pe);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(O.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Xe),e.colors.push(O.r,O.g,O.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(d==="f"){const m=l.slice(1).trim().split(pe),v=[];for(let a=0,h=m.length;a<h;a++){const w=m[a];if(w.length>0){const p=w.split("/");v.push(p)}}const u=v[0];for(let a=1,h=v.length-1;a<h;a++){const w=v[a],p=v[a+1];e.addFace(u[0],w[0],p[0],u[1],w[1],p[1],u[2],w[2],p[2])}}else if(d==="l"){const r=l.substring(1).trim().split(" ");let m=[];const v=[];if(l.indexOf("/")===-1)m=r;else for(let u=0,a=r.length;u<a;u++){const h=r[u].split("/");h[0]!==""&&m.push(h[0]),h[1]!==""&&v.push(h[1])}e.addLineGeometry(m,v)}else if(d==="p"){const m=l.slice(1).trim().split(" ");e.addPointGeometry(m)}else if((o=gt.exec(l))!==null){const r=(" "+o[0].slice(1).trim()).slice(1);e.startObject(r)}else if(wt.test(l))e.object.startMaterial(l.substring(7).trim(),e.materialLibraries);else if(bt.test(l))e.materialLibraries.push(l.substring(7).trim());else if(yt.test(l))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(o=l.split(" "),o.length>1){const m=o[1].trim().toLowerCase();e.object.smooth=m!=="0"&&m!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(l==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+l+'"')}}e.finalize();const s=new qe;if(s.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let f=0,g=e.objects.length;f<g;f++){const l=e.objects[f],d=l.geometry,r=l.materials,m=d.type==="Line",v=d.type==="Points";let u=!1;if(d.vertices.length===0)continue;const a=new me;a.setAttribute("position",new _(d.vertices,3)),d.normals.length>0&&a.setAttribute("normal",new _(d.normals,3)),d.colors.length>0&&(u=!0,a.setAttribute("color",new _(d.colors,3))),d.hasUVIndices===!0&&a.setAttribute("uv",new _(d.uvs,2));const h=[];for(let p=0,M=r.length;p<M;p++){const P=r[p],A=P.name+"_"+P.smooth+"_"+u;let b=e.materials[A];if(this.materials!==null){if(b=this.materials.create(P.name),m&&b&&!(b instanceof J)){const U=new J;he.prototype.copy.call(U,b),U.color.copy(b.color),b=U}else if(v&&b&&!(b instanceof N)){const U=new N({size:10,sizeAttenuation:!1});he.prototype.copy.call(U,b),U.color.copy(b.color),U.map=b.map,b=U}}b===void 0&&(m?b=new J:v?b=new N({size:1,sizeAttenuation:!1}):b=new G,b.name=P.name,b.flatShading=!P.smooth,b.vertexColors=u,e.materials[A]=b),h.push(b)}let w;if(h.length>1){for(let p=0,M=r.length;p<M;p++){const P=r[p];a.addGroup(P.groupStart,P.groupCount,p)}m?w=new fe(a,h):v?w=new $(a,h):w=new k(a,h)}else m?w=new fe(a,h[0]):v?w=new $(a,h[0]):w=new k(a,h[0]);w.name=l.name,s.add(w)}else if(e.vertices.length>0){const f=new N({size:1,sizeAttenuation:!1}),g=new me;g.setAttribute("position",new _(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(g.setAttribute("color",new _(e.colors,3)),f.vertexColors=!0);const l=new $(g,f);s.add(l)}return s}}const jt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const Pt=1,St=16777215;var ne=!0;const Ee=1/1e3;function E(i){const t=new B(i),e=Pt*(t.r*.3+t.g*.59+t.b*.11),n=new B(St);return new B(e*n.r,e*n.g,e*n.b)}const Lt=E(65806),Ut=E(8946557),Fe=E(9078658),kt=E(6973282),Et=E(8947848),Ft=E(13421772),_t=E(3355443),Vt=E(5592405),ae="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",Q=200,K=250,X=250,oe=Q+K,se=Q+X,zt=Q+oe,Ct=Q+se,ye=512,xe=10,De=30,It=4,At=20,Rt=20,je=10,Bt=5,Gt=K/2+25,Ht=X/2+25,Tt=8,Nt=.035,Ot=10.5,Wt=.5,Kt=.01,ce=0,Z=10,Xt=Z,_e=2,qt=30,Ve=1,Qt=1,Zt=(Qt-Ve)/(Z-ce),Yt=(qt-_e)/(Z-ce),Jt=2/100,$t=.15,en=.015,ie=[1,1.8,1.2,.8,1,1.2,1.4,1.2,1,1,1,1,1,1,1],tn=1,nn=ie.length/tn,S=new Qe;S.background=new B(Lt);var q=Xt,le=Ce(),R=ze();window.addEventListener("wheel",i=>{q=y.clamp(q-i.deltaY*Kt,ce,Z),le=Ce(),R=ze()});function ze(){return _e+Yt*q}function Ce(){return Ve+Zt*q}const L=new Ze(75,window.innerWidth/window.innerHeight,.1,1e3);L.position.set(Gt,le,Ht);L.lookAt(0,0,0);function Ie(){return ne?Ot:0}const on=new Ye(_t);S.add(on);const H=new Je(Ft);H.intensity=Ie();H.decay=Wt;S.add(H);L.add(H);S.add(L);const T=new $e({antialias:!0});T.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(T.domElement);const sn=new Le({vertexShader:`
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
		`,depthTest:!1,transparent:!0}),Ae=new et,Y=Ae.load(ae+"textures/noise-perlin-0.png");Y.wrapS=W;Y.wrapT=W;Y.repeat.set(40,40);const de=new tt(zt,Ct,ye,ye),rn=new Ue({color:Ut,bumpMap:Y,bumpScale:.7}),re=de.attributes.position;for(let i=0;i<re.count;i++){const t=Math.random()*.1;re.setZ(i,t)}re.needsUpdate=!0;de.computeVertexNormals();const ue=new k(de,rn);ue.rotation.x=-Math.PI/2;ue.receiveShadow=!0;S.add(ue);const an=new Dt;var Re=[];const cn=new G({color:kt}),ln="spotlight-0.png";Ae.load(ae+"textures/"+ln,i=>{for(let t=0;t<100;t++){const e=y.randFloat(xe,De),n=y.randFloat(It,At),o=y.randFloat(xe,De),s=Math.max(Math.floor(n/Bt),1),c=n/s,f=s>2,g=new ee(e,n,o),l=f?dn(o,e,i):new G({color:Fe}),d=new k(g,l),r={x:y.randFloat(-K/2,K/2),y:g.parameters.height/2,z:y.randFloat(-X/2,X/2)};d.position.set(r.x,r.y,r.z),d.castShadow=!0,d.receiveShadow=!0;for(let u=0;u<2;u++){const a=new ee(1,2,.1),h=new k(a,cn),w=u<1?1:-1,p=.9*g.parameters.width/2;h.position.set(y.randFloat(-p,p),a.parameters.height/2-g.parameters.height/2,w*g.parameters.depth/2-w*.9*.5*a.parameters.depth);const M=new ee(.03,.25,.2),P=new G({color:Et}),A=new k(M,P);A.position.set(-.3*a.parameters.width,-.05*a.parameters.height,0),h.add(A),d.add(h)}const m=e*o,v=Math.floor(m*Jt);for(let u=0;u<s;u++){const a=u*c;for(let h=0;h<v;h++){const w=new nt(en),p=new k(w,sn);p.renderOrder=1,p.userData={heartSpeed:y.randFloat(1,1.4)};const M=1-$t;p.position.set(y.randFloat(-(M*e)/2,M*e/2),y.randFloat(a+.6-n/2,a+1.4-n/2),y.randFloat(-(M*o)/2,M*o/2)),d.add(p),Re.push(p)}}S.add(d)}});function dn(i,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((s,c)=>{if(s===null)return;s.wrapS=W,s.wrapT=W;const f=Math.floor(c===0||c===1?i/je:t/je);s.repeat.set(f,1)}),n.map(s=>new G({color:Fe,lightMap:s,lightMapIntensity:Rt}))}an.load(ae+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),n=y.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(y.randFloat(-oe/2,oe/2),0,y.randFloat(-se/2,se/2)),e.rotation.y=y.randFloat(0,2*Math.PI),e.traverse(o=>{o instanceof k&&(o.material=new Ue({color:Vt}))}),S.add(e)}});const C=new ut(L,T.domElement);document.addEventListener("click",()=>{C.lock()});C.addEventListener("lock",()=>{console.log("Pointer locked")});C.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const j={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":j.forward=!0;break;case"KeyS":j.backward=!0;break;case"KeyA":j.left=!0;break;case"KeyD":j.right=!0;break;case"KeyC":H.intensity=Ie(),ne=!ne;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":j.forward=!1;break;case"KeyS":j.backward=!1;break;case"KeyA":j.left=!1;break;case"KeyD":j.right=!1;break}});const I=new rt(T),un=new at(S,L);I.addPass(un);const Be=new ke(Mt),Ge=new ke(jt);Be.uniforms.v.value=Ee;Ge.uniforms.h.value=Ee;I.addPass(Be);I.addPass(Ge);const mn=new pt(1.8,!1);I.addPass(mn);const Me=new ot,x=new F;var Pe=0;function He(){requestAnimationFrame(He);const i=Me.getDelta();if(C.isLocked){x.x-=x.x*10*i,x.z-=x.z*10*i,j.forward&&(x.z-=R*i),j.backward&&(x.z+=R*i),j.left&&(x.x-=R*i),j.right&&(x.x+=R*i);const t=.1,n=Math.abs(x.x)>t&&Math.abs(x.z)>t?.707:1;C.moveRight(x.x*n*i),C.moveForward(-x.z*n*i),Pe+=i*Tt*x.length()*n;const o=Math.sin(Pe)*Nt;L.position.y=le+o}Re.forEach(t=>{const e=Me.elapsedTime*nn*t.userData.heartSpeed,n=Math.floor(e)%ie.length,o=10*(ie[n]-.3);t.scale.set(o,o,o)}),I.render(i)}He();window.addEventListener("resize",()=>{L.aspect=window.innerWidth/window.innerHeight,L.updateProjectionMatrix(),T.setSize(window.innerWidth,window.innerHeight),I.setSize(window.innerWidth,window.innerHeight)});var Se;(Se=document.getElementById("downloadBtn"))==null||Se.addEventListener("click",hn);function hn(){S.updateMatrixWorld();var i=S.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

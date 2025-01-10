import{V as E,C as Te,E as Ne,U as Oe,g as Pe,e as R,L as We,F as Xe,p as Ke,G as qe,B as he,q as _,r as Y,s as me,t as O,u as B,v as fe,w as J,h as U,c as Ze,b as j,d as Qe,A as Ye,x as Je,W as $e,n as et,y as X,i as tt,z as Ue,m as $,H as nt,o as ot}from"./three.module-D_lgyIuw.js";import{P as st,F as it,E as rt,R as at,S as ke}from"./RenderPass-o2zfdpRC.js";const V=new Ne(0,0,0,"YXZ"),F=new E,ct={type:"change"},lt={type:"lock"},dt={type:"unlock"},ve=Math.PI/2;class ut extends Te{constructor(t,e=null){super(t,e),this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=ht.bind(this),this._onPointerlockChange=mt.bind(this),this._onPointerlockError=ft.bind(this),this.domElement!==null&&this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return console.warn("THREE.PointerLockControls: getObject() has been deprecated. Use controls.object instead."),this.object}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.object.quaternion)}moveForward(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),F.crossVectors(e.up,F),e.position.addScaledVector(F,t)}moveRight(t){if(this.enabled===!1)return;const e=this.object;F.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(F,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function ht(i){if(this.enabled===!1||this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.object;V.setFromQuaternion(n.quaternion),V.y-=t*.002*this.pointerSpeed,V.x-=e*.002*this.pointerSpeed,V.x=Math.max(ve-this.maxPolarAngle,Math.min(ve-this.minPolarAngle,V.x)),n.quaternion.setFromEuler(V),this.dispatchEvent(ct)}function mt(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(lt),this.isLocked=!0):(this.dispatchEvent(dt),this.isLocked=!1)}function ft(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const vt={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class pt extends st{constructor(t=.5,e=!1){super();const n=vt;this.uniforms=Oe.clone(n.uniforms),this.material=new Pe({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=t,this.uniforms.grayscale.value=e,this.fsQuad=new it(this.material)}render(t,e,n,o){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=o,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const gt=/^[og]\s*(.+)?/,bt=/^mtllib /,wt=/^usemtl /,yt=/^usemap /,pe=/\s+/,ge=new E,ee=new E,be=new E,we=new E,D=new E,W=new R;function xt(){const i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(o,s){const a=this._finalize(!1);a&&(a.inherited||a.groupCount<=0)&&this.materials.splice(a.index,1);const m={index:this.materials.length,name:o||"",mtllib:Array.isArray(s)&&s.length>0?s[s.length-1]:"",smooth:a!==void 0?a.smooth:this.smooth,groupStart:a!==void 0?a.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(f){const c={index:typeof f=="number"?f:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return c.clone=this.clone.bind(c),c}};return this.materials.push(m),m},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(o){const s=this.currentMaterial();if(s&&s.groupEnd===-1&&(s.groupEnd=this.geometry.vertices.length/3,s.groupCount=s.groupEnd-s.groupStart,s.inherited=!1),o&&this.materials.length>1)for(let a=this.materials.length-1;a>=0;a--)this.materials[a].groupCount<=0&&this.materials.splice(a,1);return o&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),s}},n&&n.name&&typeof n.clone=="function"){const o=n.clone(0);o.inherited=!0,this.object.materials.push(o)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){const n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){const o=this.vertices,s=this.object.geometry.vertices;s.push(o[t+0],o[t+1],o[t+2]),s.push(o[e+0],o[e+1],o[e+2]),s.push(o[n+0],o[n+1],o[n+2])},addVertexPoint:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){const e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){const o=this.normals,s=this.object.geometry.normals;s.push(o[t+0],o[t+1],o[t+2]),s.push(o[e+0],o[e+1],o[e+2]),s.push(o[n+0],o[n+1],o[n+2])},addFaceNormal:function(t,e,n){const o=this.vertices,s=this.object.geometry.normals;ge.fromArray(o,t),ee.fromArray(o,e),be.fromArray(o,n),D.subVectors(be,ee),we.subVectors(ge,ee),D.cross(we),D.normalize(),s.push(D.x,D.y,D.z),s.push(D.x,D.y,D.z),s.push(D.x,D.y,D.z)},addColor:function(t,e,n){const o=this.colors,s=this.object.geometry.colors;o[t]!==void 0&&s.push(o[t+0],o[t+1],o[t+2]),o[e]!==void 0&&s.push(o[e+0],o[e+1],o[e+2]),o[n]!==void 0&&s.push(o[n+0],o[n+1],o[n+2])},addUV:function(t,e,n){const o=this.uvs,s=this.object.geometry.uvs;s.push(o[t+0],o[t+1]),s.push(o[e+0],o[e+1]),s.push(o[n+0],o[n+1])},addDefaultUV:function(){const t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){const e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,o,s,a,m,f,c){const d=this.vertices.length;let r=this.parseVertexIndex(t,d),l=this.parseVertexIndex(e,d),u=this.parseVertexIndex(n,d);if(this.addVertex(r,l,u),this.addColor(r,l,u),m!==void 0&&m!==""){const v=this.normals.length;r=this.parseNormalIndex(m,v),l=this.parseNormalIndex(f,v),u=this.parseNormalIndex(c,v),this.addNormal(r,l,u)}else this.addFaceNormal(r,l,u);if(o!==void 0&&o!==""){const v=this.uvs.length;r=this.parseUVIndex(o,v),l=this.parseUVIndex(s,v),u=this.parseUVIndex(a,v),this.addUV(r,l,u),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,o=t.length;n<o;n++){const s=this.parseVertexIndex(t[n],e);this.addVertexPoint(s),this.addColor(s)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";const n=this.vertices.length,o=this.uvs.length;for(let s=0,a=t.length;s<a;s++)this.addVertexLine(this.parseVertexIndex(t[s],n));for(let s=0,a=e.length;s<a;s++)this.addUVLine(this.parseUVIndex(e[s],o))}};return i.startObject("",!1),i}class Dt extends We{constructor(t){super(t),this.materials=null}load(t,e,n,o){const s=this,a=new Xe(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(m){try{e(s.parse(m))}catch(f){o?o(f):console.error(f),s.manager.itemError(t)}},n,o)}setMaterials(t){return this.materials=t,this}parse(t){const e=new xt;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));const n=t.split(`
`);let o=[];for(let m=0,f=n.length;m<f;m++){const c=n[m].trimStart();if(c.length===0)continue;const d=c.charAt(0);if(d!=="#")if(d==="v"){const r=c.split(pe);switch(r[0]){case"v":e.vertices.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3])),r.length>=7?(W.setRGB(parseFloat(r[4]),parseFloat(r[5]),parseFloat(r[6]),Ke),e.colors.push(W.r,W.g,W.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(r[1]),parseFloat(r[2]),parseFloat(r[3]));break;case"vt":e.uvs.push(parseFloat(r[1]),parseFloat(r[2]));break}}else if(d==="f"){const l=c.slice(1).trim().split(pe),u=[];for(let h=0,g=l.length;h<g;h++){const b=l[h];if(b.length>0){const w=b.split("/");u.push(w)}}const v=u[0];for(let h=1,g=u.length-1;h<g;h++){const b=u[h],w=u[h+1];e.addFace(v[0],b[0],w[0],v[1],b[1],w[1],v[2],b[2],w[2])}}else if(d==="l"){const r=c.substring(1).trim().split(" ");let l=[];const u=[];if(c.indexOf("/")===-1)l=r;else for(let v=0,h=r.length;v<h;v++){const g=r[v].split("/");g[0]!==""&&l.push(g[0]),g[1]!==""&&u.push(g[1])}e.addLineGeometry(l,u)}else if(d==="p"){const l=c.slice(1).trim().split(" ");e.addPointGeometry(l)}else if((o=gt.exec(c))!==null){const r=(" "+o[0].slice(1).trim()).slice(1);e.startObject(r)}else if(wt.test(c))e.object.startMaterial(c.substring(7).trim(),e.materialLibraries);else if(bt.test(c))e.materialLibraries.push(c.substring(7).trim());else if(yt.test(c))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(o=c.split(" "),o.length>1){const l=o[1].trim().toLowerCase();e.object.smooth=l!=="0"&&l!=="off"}else e.object.smooth=!0;const r=e.object.currentMaterial();r&&(r.smooth=e.object.smooth)}else{if(c==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+c+'"')}}e.finalize();const s=new qe;if(s.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let m=0,f=e.objects.length;m<f;m++){const c=e.objects[m],d=c.geometry,r=c.materials,l=d.type==="Line",u=d.type==="Points";let v=!1;if(d.vertices.length===0)continue;const h=new he;h.setAttribute("position",new _(d.vertices,3)),d.normals.length>0&&h.setAttribute("normal",new _(d.normals,3)),d.colors.length>0&&(v=!0,h.setAttribute("color",new _(d.colors,3))),d.hasUVIndices===!0&&h.setAttribute("uv",new _(d.uvs,2));const g=[];for(let w=0,I=r.length;w<I;w++){const y=r[w],ue=y.name+"_"+y.smooth+"_"+v;let p=e.materials[ue];if(this.materials!==null){if(p=this.materials.create(y.name),l&&p&&!(p instanceof Y)){const P=new Y;me.prototype.copy.call(P,p),P.color.copy(p.color),p=P}else if(u&&p&&!(p instanceof O)){const P=new O({size:10,sizeAttenuation:!1});me.prototype.copy.call(P,p),P.color.copy(p.color),P.map=p.map,p=P}}p===void 0&&(l?p=new Y:u?p=new O({size:1,sizeAttenuation:!1}):p=new B,p.name=y.name,p.flatShading=!y.smooth,p.vertexColors=v,e.materials[ue]=p),g.push(p)}let b;if(g.length>1){for(let w=0,I=r.length;w<I;w++){const y=r[w];h.addGroup(y.groupStart,y.groupCount,w)}l?b=new fe(h,g):u?b=new J(h,g):b=new U(h,g)}else l?b=new fe(h,g[0]):u?b=new J(h,g[0]):b=new U(h,g[0]);b.name=c.name,s.add(b)}else if(e.vertices.length>0){const m=new O({size:1,sizeAttenuation:!1}),f=new he;f.setAttribute("position",new _(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(f.setAttribute("color",new _(e.colors,3)),m.vertexColors=!0);const c=new J(f,m);s.add(c)}return s}}const jt={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`};document.body.style.margin="0";document.body.style.overflow="hidden";const St=1,Lt=16777215;var te=!0;const Ee=1/1e3;function k(i){const t=new R(i),e=St*(t.r*.3+t.g*.59+t.b*.11),n=new R(Lt);return new R(e*n.r,e*n.g,e*n.b)}const Pt=k(65806),Ut=k(8946557),_e=k(9078658),kt=k(6973282),Et=k(8947848),_t=k(13421772),Vt=k(3355443),Ft=k(5592405),re="https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/",q=200,G=250,H=250,ne=q+G,oe=q+H,zt=q+ne,Ct=q+oe,It=1.2*G,At=1.2*H,ye=512,xe=10,De=30,Rt=4,Bt=20,Gt=20,Ht=12,je=10,Tt=G/2+25,Nt=H/2+25,Ot=8,Wt=.035,Xt=10.5,Kt=.5,qt=.01,ae=0,Z=10,Zt=Z,Ve=2,Qt=30,Fe=1,Yt=1,Jt=(Yt-Fe)/(Z-ae),$t=(Qt-Ve)/(Z-ae),se=[1,1.8,1.2,.8,1,1.2,1.4,1.2,1,1,1,1,1,1,1],en=1,tn=se.length/en,S=new Ze;S.background=new R(Pt);var K=Zt,ce=Ce(),A=ze();window.addEventListener("wheel",i=>{K=j.clamp(K-i.deltaY*qt,ae,Z),ce=Ce(),A=ze()});function ze(){return Ve+$t*K}function Ce(){return Fe+Jt*K}const L=new Qe(75,window.innerWidth/window.innerHeight,.1,1e3);L.position.set(Tt,ce,Nt);L.lookAt(0,0,0);function Ie(){return te?Xt:0}const nn=new Ye(Vt);S.add(nn);const T=new Je(_t);T.intensity=Ie();T.decay=Kt;S.add(T);L.add(T);S.add(L);const N=new $e({antialias:!0});N.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(N.domElement);const on=new Pe({vertexShader:`
		varying vec3 vNormal;
		varying vec3 vViewDir;

		void main() {
				vNormal = normalize(normalMatrix * normal);
				vViewDir = normalize(-vec3(modelViewMatrix * vec4(position, 1.0)));

				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
		`,fragmentShader:`
		varying vec3 vNormal;
		varying vec3 vViewDir;

		void main() {
			float dotProduct = abs(dot(vNormal, vViewDir));
			float intensity = pow(dotProduct, 2.0);
			vec3 color = vec3(1.0, 0.0, 0.0);

			gl_FragColor = vec4(color, intensity);
		}
		`,depthTest:!1,transparent:!0}),Ae=new et,Q=Ae.load(re+"textures/noise-perlin-0.png");Q.wrapS=X;Q.wrapT=X;Q.repeat.set(40,40);const le=new tt(zt,Ct,ye,ye),sn=new Ue({color:Ut,bumpMap:Q,bumpScale:.7}),ie=le.attributes.position;for(let i=0;i<ie.count;i++){const t=Math.random()*.1;ie.setZ(i,t)}ie.needsUpdate=!0;le.computeVertexNormals();const de=new U(le,sn);de.rotation.x=-Math.PI/2;de.receiveShadow=!0;S.add(de);const rn=new Dt;var Re=[];const an=new B({color:kt}),cn="spotlight-0.png";Ae.load(re+"textures/"+cn,i=>{for(let t=0;t<100;t++){const e=j.randFloat(xe,De),n=j.randFloat(Rt,Bt),o=j.randFloat(xe,De),s=n>Ht,a=new $(e,n,o),m=s?ln(o,e,i):new B({color:_e}),f=new U(a,m),c={x:j.randFloat(-G/2,G/2),y:a.parameters.height/2,z:j.randFloat(-H/2,H/2)};f.position.set(c.x,c.y,c.z),f.castShadow=!0,f.receiveShadow=!0;for(let d=0;d<2;d++){const r=new $(1,2,.1),l=new U(r,an),u=d<1?1:-1,v=.9*a.parameters.width/2;l.position.set(j.randFloat(-v,v),r.parameters.height/2-a.parameters.height/2,u*a.parameters.depth/2-u*.9*.5*r.parameters.depth);const h=new $(.03,.25,.2),g=new B({color:Et}),b=new U(h,g);if(b.position.set(-.3*r.parameters.width,-.05*r.parameters.height,0),Math.abs(f.position.x)<It/2&&Math.abs(f.position.z)<At/2){const I=new nt(.01,32,32),y=new U(I,on);y.renderOrder=1,y.position.set(1,0,-u*1.5),y.userData={heartSpeed:j.randFloat(1,1.4)},l.add(y),Re.push(y)}l.add(b),f.add(l)}S.add(f)}});function ln(i,t,e){const n=[e.clone(),e.clone(),null,null,e.clone(),e.clone()];return n.forEach((s,a)=>{if(s===null)return;s.wrapS=X,s.wrapT=X;const m=Math.floor(a===0||a===1?i/je:t/je);s.repeat.set(m,1)}),n.map(s=>new B({color:_e,lightMap:s,lightMapIntensity:Gt}))}rn.load(re+"models/palmtree-0.obj",i=>{for(let t=0;t<1e3;t++){const e=i.clone(),n=j.randFloat(.005,.02);e.scale.set(n,n,n),e.position.set(j.randFloat(-ne/2,ne/2),0,j.randFloat(-oe/2,oe/2)),e.rotation.y=j.randFloat(0,2*Math.PI),e.traverse(o=>{o instanceof U&&(o.material=new Ue({color:Ft}))}),S.add(e)}});const z=new ut(L,N.domElement);document.addEventListener("click",()=>{z.lock()});z.addEventListener("lock",()=>{console.log("Pointer locked")});z.addEventListener("unlock",()=>{console.log("Pointer unlocked")});const M={forward:!1,backward:!1,left:!1,right:!1};document.addEventListener("keydown",i=>{switch(i.code){case"KeyW":M.forward=!0;break;case"KeyS":M.backward=!0;break;case"KeyA":M.left=!0;break;case"KeyD":M.right=!0;break;case"KeyC":T.intensity=Ie(),te=!te;break}});document.addEventListener("keyup",i=>{switch(i.code){case"KeyW":M.forward=!1;break;case"KeyS":M.backward=!1;break;case"KeyA":M.left=!1;break;case"KeyD":M.right=!1;break}});const C=new rt(N),dn=new at(S,L);C.addPass(dn);const Be=new ke(Mt),Ge=new ke(jt);Be.uniforms.v.value=Ee;Ge.uniforms.h.value=Ee;C.addPass(Be);C.addPass(Ge);const un=new pt(2,!1);C.addPass(un);const Me=new ot,x=new E;var Se=0;function He(){requestAnimationFrame(He);const i=Me.getDelta();if(z.isLocked){x.x-=x.x*10*i,x.z-=x.z*10*i,M.forward&&(x.z-=A*i),M.backward&&(x.z+=A*i),M.left&&(x.x-=A*i),M.right&&(x.x+=A*i);const t=.1,n=Math.abs(x.x)>t&&Math.abs(x.z)>t?.707:1;z.moveRight(x.x*n*i),z.moveForward(-x.z*n*i),Se+=i*Ot*x.length()*n;const o=Math.sin(Se)*Wt;L.position.y=ce+o}Re.forEach(t=>{const e=Me.elapsedTime*tn*t.userData.heartSpeed,n=Math.floor(e)%se.length,o=10*(se[n]-.3);t.scale.set(o,o,o)}),C.render(i)}He();window.addEventListener("resize",()=>{L.aspect=window.innerWidth/window.innerHeight,L.updateProjectionMatrix(),N.setSize(window.innerWidth,window.innerHeight),C.setSize(window.innerWidth,window.innerHeight)});var Le;(Le=document.getElementById("downloadBtn"))==null||Le.addEventListener("click",hn);function hn(){S.updateMatrixWorld();var i=S.toJSON(),t=JSON.stringify(i);const e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(e),n.download="tsam.three.js.scene.json",document.body.appendChild(n),n.click(),document.body.removeChild(n)}

import * as T from 'three'
import { BP, C, D, G, H, TG, VX, VZ, updDrone } from '../core/world.js'
import { O, S, V, hooks, lvl } from '../core/data.js'

/* ---------- 3D ---------- */
export const mapEl=document.createElement('div');mapEl.id='map';
mapEl.innerHTML=`<canvas id="cv"></canvas><p class="ov ld">Loading 3D simulation…</p><div class="ov gl stt" id="stt"></div><div class="ov ban" id="ban"></div><div class="ov gl ctl"><button data-c="2d">2D</button><button data-c="3d">3D</button><button data-c="in" aria-label="Zoom in">+</button><button data-c="out" aria-label="Zoom out">−</button><button data-c="rs" title="Reset view">⟲</button><button data-c="cl" title="Overview / close-up">◎</button></div><div class="ov gl info" id="info" hidden></div><div class="ov gl agp" id="agp"></div><div class="ov gl tel" id="tel" hidden></div><button class="ov btn pri go" id="go"></button>`;
export const q=s=>mapEl.querySelector(s);export let R,sc,cam3,RT={},smoke=[],stM=[],Z=[],dg,boot=0;
export const STN=[{id:'north',n:'North Station',k:'seis',x:2,z:-24,ty:'Seismic'},{id:'south',n:'South Station',k:'gas',x:6,z:24,ty:'Gas'},{id:'west',n:'West Station',k:'def',x:-24,z:-4,ty:'Ground deformation'},{id:'east',n:'East Station',k:'wx',x:28,z:2,ty:'Weather'},{id:'summit',n:'Summit',k:'therm',x:VX+3.6,z:VZ,ty:'Thermal'}];
export const ZN=[['ZONE A','Inner exclusion zone',14,0xf43f5e,[.03,.08,.16,.26]],['ZONE B','Evacuation planning zone',25,0xf59e0b,[.025,.05,.1,.15]],['ZONE C','Monitoring zone',38,0x38bdf8,[.05,.05,.07,.08]]];
export function route(pts,col,key){if(!sc)return;rmR(key);const v=[];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5);for(let j=i>1?1:0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;v.push(new T.Vector3(x,Math.max(H(x,z),0)+10,z))}}
const l=new T.Line(new T.BufferGeometry().setFromPoints(v),new T.LineDashedMaterial({color:col,dashSize:1.4,gapSize:.9}));l.computeLineDistances();sc.add(l);RT[key]=l}
export const rmR=k=>{if(RT[k]&&sc){sc.remove(RT[k]);RT[k]=0}},clrRoutes=()=>{rmR('main');rmR('alt')};
export async function boot3D(){if(boot)return;boot=1;try{init3D();q('.ld').remove()}catch(e){q('.ld').textContent='3D needs WebGL and network access to load the renderer.'}}
export function tex(f){const c=document.createElement('canvas');c.width=c.height=128;f(c.getContext('2d'));return new T.CanvasTexture(c)}
export function lab(t){const c=document.createElement('canvas');c.width=256;c.height=56;const x=c.getContext('2d');x.fillStyle='rgba(8,16,32,.75)';x.beginPath();x.roundRect?x.roundRect(4,6,248,44,22):x.rect(4,6,248,44);x.fill();x.fillStyle='#e8eefb';x.font='600 24px Inter,sans-serif';x.textAlign='center';x.fillText(t,128,38);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(9,2,1);s.renderOrder=9;s.userData.lab=1;return s}
export function init3D(){R=new T.WebGLRenderer({canvas:q('#cv'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.75));sc=new T.Scene();sc.background=new T.Color(0x070e1d);sc.fog=new T.FogExp2(0x0a1424,.0085);cam3=new T.PerspectiveCamera(45,1,.5,600);
const soft=tex(x=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});
sc.add(new T.HemisphereLight(0x9ec5ff,0x1a2233,.85));const dl=new T.DirectionalLight(0xffe2c0,1.1);dl.position.set(-40,50,30);sc.add(dl);
const geo=new T.PlaneGeometry(130,130,96,96);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,cl=new Float32Array(p.count*3),c=new T.Color(),sand=new T.Color(.62,.56,.42),gr=new T.Color(.12,.3,.15),rk=new T.Color(.3,.26,.23),ash=new T.Color(.13,.12,.14);
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=H(x,z);p.setY(i,y);if(y<.6)c.copy(sand);else if(y<7)c.lerpColors(sand,gr,Math.min(1,(y-.6)/1.5));else if(y<16)c.lerpColors(gr,rk,Math.min(1,(y-7)/4));else c.lerpColors(rk,ash,Math.min(1,(y-16)/4));c.toArray(cl,i*3)}
geo.setAttribute('color',new T.BufferAttribute(cl,3));geo.computeVertexNormals();sc.add(new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:.95})));
const sea=new T.Mesh(new T.PlaneGeometry(500,500).rotateX(-Math.PI/2),new T.MeshStandardMaterial({color:0x0b3a63,transparent:true,opacity:.9,roughness:.2,metalness:.15}));sea.position.y=.2;sc.add(sea);
const cy=H(VX,VZ)+.7;lava=new T.PointLight(0xff5a1f,1,70);lava.position.set(VX,cy+2,VZ);sc.add(lava);
lavaD=new T.Mesh(new T.CircleGeometry(2.6,24).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xff4a14,transparent:true}));lavaD.position.set(VX,cy,VZ);sc.add(lavaD);
glow=new T.Sprite(new T.SpriteMaterial({map:soft,color:0xff6a2a,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.set(14,14,1);glow.position.set(VX,cy+2,VZ);sc.add(glow);
heat=new T.Mesh(new T.CircleGeometry(8,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:soft,color:0xff5a2a,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));heat.position.set(VX,cy+.3,VZ);sc.add(heat);
for(let i=0;i<36;i++){const s=new T.Sprite(new T.SpriteMaterial({map:soft,transparent:true,depthWrite:false,opacity:0}));s.userData={l:Math.random(),r:.7+Math.random()*.6};s.position.set(VX,cy,VZ);sc.add(s);smoke.push(s)}
for(let i=0;i<5;i++){const s=new T.Sprite(new T.SpriteMaterial({map:soft,transparent:true,opacity:.12,depthWrite:false}));s.scale.set(55,22,1);s.position.set(-60+i*32,42+i%2*10,-20+i*12);sc.add(s)}
ZN.forEach((z,i)=>{const m=new T.Mesh(new T.SphereGeometry(z[2],32,12,0,Math.PI*2,0,Math.PI/2),new T.MeshBasicMaterial({color:z[3],transparent:true,opacity:.05,side:T.DoubleSide,depthWrite:false}));m.scale.y=.45;m.position.set(VX,0,VZ);m.userData={zone:i};sc.add(m);const r=new T.Mesh(new T.RingGeometry(z[2]-.3,z[2],64).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:z[3],transparent:true,opacity:.5}));r.position.set(VX,.5,VZ);sc.add(r);Z.push(m)});
const hs=[[-22,20],[-19,22],[-25,22],[-21,17],[-17,19],[-24,18],[-20,24]];hs.forEach(h=>{const b=new T.Mesh(new T.BoxGeometry(1.5,1,1.5),new T.MeshStandardMaterial({color:0xd8dee9}));b.position.set(h[0],Math.max(H(h[0],h[1]),.3)+.5,h[1]);sc.add(b)});
const lbl=(t,x,z,y)=>{const s=lab(t);s.position.set(x,y,z);sc.add(s)};lbl('Village',-22,20,H(-22,20)+4);lbl('Drone Base',BP[0],BP[1],H(BP[0],BP[1])+4);
const bp=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.2,24),new T.MeshStandardMaterial({color:0x38bdf8,emissive:0x0b4a70}));bp.position.set(BP[0],Math.max(H(BP[0],BP[1]),.3)+.1,BP[1]);sc.add(bp);
[[[-22,20],[-10,18],[0,20],[6,24]],[[-10,18],[-12,8],[-18,-2],[-24,-4]],[[0,20],[4,12],[3,4]]].forEach(rd=>{const v=[];for(let i=1;i<rd.length;i++)for(let j=0;j<=8;j++){const x=rd[i-1][0]+(rd[i][0]-rd[i-1][0])*j/8,z=rd[i-1][1]+(rd[i][1]-rd[i-1][1])*j/8;v.push(new T.Vector3(x,Math.max(H(x,z),.3)+.25,z))}sc.add(new T.Line(new T.BufferGeometry().setFromPoints(v),new T.LineBasicMaterial({color:0xcbd5e1,transparent:true,opacity:.6})))});
STN.forEach((o,i)=>{const g=new T.Group(),y=Math.max(H(o.x,o.z),.3);g.position.set(o.x,y,o.z);const pole=new T.Mesh(new T.CylinderGeometry(.12,.12,2.4),new T.MeshStandardMaterial({color:0xb8c4d8}));pole.position.y=1.2;const ball=new T.Mesh(new T.SphereGeometry(.7,16,12),new T.MeshBasicMaterial({color:0x34d399}));ball.position.y=2.7;
const ring=new T.Mesh(new T.RingGeometry(.9,1,40).rotateX(-Math.PI/2),new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,depthWrite:false}));ring.position.y=.35;
const hit=new T.Mesh(new T.SphereGeometry(2.2),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=2.4;hit.userData={st:o.id};const L=lab(o.n);L.position.y=5.4;g.add(pole,ball,ring,hit,L);
if(o.k==='gas'){const gs=new T.Sprite(new T.SpriteMaterial({map:soft,color:0x34d399,transparent:true,opacity:.2,depthWrite:false}));gs.position.y=3;g.add(gs);o.ex=gs}
if(o.k==='def'){const w=new T.Mesh(new T.OctahedronGeometry(1.1),new T.MeshBasicMaterial({color:0x8da2c4,wireframe:true}));w.position.y=4.2;g.add(w);o.ex=w}
if(o.k==='wx'){const w=new T.Mesh(new T.ConeGeometry(.4,1.6,8).rotateX(Math.PI/2),new T.MeshBasicMaterial({color:0xcbd5e1}));w.position.y=4.2;g.add(w);o.ex=w}
sc.add(g);stM.push({o,ball,ring,hit,g})});
const tg=new T.Mesh(new T.RingGeometry(2.2,2.8,48).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0x38e8ff,transparent:true,opacity:.9,side:T.DoubleSide}));tg.position.set(TG[0],H(TG[0],TG[1])+.6,TG[1]);const bm=new T.Mesh(new T.CylinderGeometry(.15,.15,30),new T.MeshBasicMaterial({color:0x38e8ff,transparent:true,opacity:.35,blending:T.AdditiveBlending}));bm.position.y=15;tg.add(bm);tg.visible=false;sc.add(tg);tgt=tg;lbl('Gas Zone A',TG[0],TG[1],H(TG[0],TG[1])+5);
dg=new T.Group();const bd=new T.Mesh(new T.BoxGeometry(1.1,.3,1.1),new T.MeshStandardMaterial({color:0x1a2236,emissive:0x0b3a5a}));dg.add(bd);dg.rotors=[];[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(a=>{const r=new T.Mesh(new T.CylinderGeometry(.55,.55,.05,12),new T.MeshBasicMaterial({color:0x7dd3fc,transparent:true,opacity:.6}));r.position.set(a[0]*.8,.25,a[1]*.8);dg.add(r);dg.rotors.push(r)});
const dh=new T.Mesh(new T.SphereGeometry(2),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));dh.userData={dr:1};const dl2=lab('DRONE-01');dl2.position.y=2.6;dg.add(dh,dl2);dg.hit=dh;dg.scale.setScalar(1.3);sc.add(dg);
colR=new T.Mesh(new T.RingGeometry(2.4,2.6,40).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0x34d399,transparent:true,side:T.DoubleSide}));colR.visible=false;sc.add(colR);
sat=new T.Group();sat.add(new T.Mesh(new T.BoxGeometry(1.4,.8,1.4),new T.MeshStandardMaterial({color:0xcbd5e1})),new T.Mesh(new T.BoxGeometry(4,.1,1),new T.MeshStandardMaterial({color:0x2b6fd6})),(l=>{l.position.y=2.5;return l})(lab('SAT')));sc.add(sat);satL=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:0x38bdf8,transparent:true,opacity:.18}));satL.frustumCulled=false;sc.add(satL);
const cv=q('#cv');let dn=null;cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);dn={x:e.clientX,y:e.clientY,m:0}});
cv.addEventListener('pointermove',e=>{if(!dn)return;const dx=e.clientX-dn.x,dy=e.clientY-dn.y;dn.x=e.clientX;dn.y=e.clientY;dn.m+=Math.abs(dx)+Math.abs(dy);if(e.shiftKey||e.buttons===2){const k=G.d*.0016,s=Math.sin(G.th),co=Math.cos(G.th);G.tx=Math.max(-50,Math.min(50,G.tx-co*dx*k-s*dy*k));G.tz=Math.max(-50,Math.min(50,G.tz+s*dx*k-co*dy*k))}else{G.th-=dx*.006;G.ph=Math.max(.02,Math.min(1.45,G.ph-dy*.005))}});
cv.addEventListener('pointerup',e=>{const mv=dn&&dn.m>5;dn=null;if(!mv)pick(e)});cv.addEventListener('wheel',e=>{e.preventDefault();G.d=Math.max(22,Math.min(220,G.d*(e.deltaY>0?1.1:.9)))},{passive:false});
new ResizeObserver(rs).observe(mapEl);rs()}
export let lava,lavaD,glow,heat,tgt,colR,sat,satL;
export function rs(){if(!R)return;const w=mapEl.clientWidth,h=mapEl.clientHeight;if(w&&h){R.setSize(w,h,false);cam3.aspect=w/h;cam3.updateProjectionMatrix()}}
export function pick(e){const r=q('#cv').getBoundingClientRect(),rc=new T.Raycaster();rc.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1),cam3);
let h=rc.intersectObjects([...stM.map(s=>s.hit),dg.hit])[0];if(h){V.SEL=h.object.userData.dr?{t:'dr'}:{t:'st',id:h.object.userData.st}}else{const zs=rc.intersectObjects(Z).map(x=>x.object.userData.zone);V.SEL=zs.length?{t:'zn',i:Math.min(...zs)}:null}hooks.ui()}
export const TS=Date.now();
export function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-(loop.l||now))/1000);loop.l=now;updDrone(dt,now);
const dd=document.getElementById('dd');if(dd){dd.setAttribute('cx',50+D.x);dd.setAttribute('cy',50+D.z)}
if(!R||!mapEl.isConnected)return;const t=now/1000,k=O.rm?.25:1,L=S.risk,e=O.rm?1:.12;
for(const a of['th','ph','d','tx','ty','tz'])C[a]+=(G[a]-C[a])*e;cam3.position.set(C.tx+C.d*Math.sin(C.ph)*Math.sin(C.th),C.ty+C.d*Math.cos(C.ph),C.tz+C.d*Math.sin(C.ph)*Math.cos(C.th));cam3.lookAt(C.tx,C.ty,C.tz);
const lv=(a,b)=>a+(b-a)*.04;lava.intensity=lv(lava.intensity,[.4,1.4,2.8,4.4][L]*(1+.12*Math.sin(t*3)));lavaD.material.opacity=lv(lavaD.material.opacity,[.5,.7,.9,1][L]);glow.material.opacity=lv(glow.material.opacity,[.2,.4,.7,.95][L]);
const th=lvl('therm');heat.material.opacity=lv(heat.material.opacity,.06+.28*th);sc.fog.density=lv(sc.fog.density,S.wx==='Ash Cloud'?.013:S.wx==='High Wind'?.0105:.0085);sc.background.lerp(new T.Color(L>=3?0x1a0c14:0x070e1d),.02);
const amt=[.35,.55,.9,1.25][L],ng=Math.ceil(smoke.length*amt/1.25),dr=S.cur.wx*.03,cy=H(VX,VZ)+1;
smoke.forEach((s,i)=>{const u=s.userData;u.l+=dt*k*.12*u.r;if(u.l>1){u.l=0;s.position.set(VX+(Math.random()-.5)*3,cy,VZ+(Math.random()-.5)*3)}s.position.y+=dt*k*1.5*u.r;s.position.x+=dt*k*dr;const sz=3+u.l*10;s.scale.set(sz,sz,1);s.material.color.setHex(L>=2?0x45454d:0x9aa5b8);s.material.opacity=O.smoke&&i<ng?Math.sin(u.l*Math.PI)*.38*Math.min(1,amt):0});
stM.forEach((s,i)=>{const o=s.o,l=lvl(o.k),inv=S.inv.includes(o.k),col=inv?0x38bdf8:[0x34d399,0xfbbf24,0xf43f5e][l],ph=(t*.55*k+i*.2)%1;s.ball.material.color.setHex(col);s.ring.material.color.setHex(col);s.ring.scale.setScalar(1+ph*(l||inv?7:3));s.ring.material.opacity=(1-ph)*(l||inv?.7:.18);
s.g.children.forEach(c=>{if(c.userData.lab)c.visible=!!O.lab});if(o.ex){if(o.k==='gas'){const z=4+S.cur.gas*.12;o.ex.scale.set(z,z,1);o.ex.material.opacity=.12+.14*l}else if(o.k==='def')o.ex.rotation.y=t*.6*k;else o.ex.rotation.y=-Math.PI/2+Math.sin(t)*.2}});
Z.forEach((m,i)=>m.material.opacity=lv(m.material.opacity,ZN[i][4][L]));tgt.visible=!!S.tz;tgt.scale.setScalar(1+.15*Math.sin(t*3));
const y=Math.max(H(D.x,D.z),0)+D.agl+(S.mn?.25*Math.sin(t*4):0);dg.position.set(D.x,y,D.z);dg.rotation.y=D.hd;dg.rotors.forEach(r=>r.rotation.y=t*30);
colR.visible=!!D.col;if(D.col){colR.position.set(D.x,y-.5,D.z);colR.scale.setScalar(1+(t*.8%1)*3);colR.material.opacity=1-(t*.8%1)}
const sa=t*.12;sat.position.set(Math.cos(sa)*70,62,Math.sin(sa)*70);const pa=satL.geometry.attributes.position;pa.setXYZ(0,sat.position.x,sat.position.y,sat.position.z);pa.setXYZ(1,VX,10,VZ);pa.needsUpdate=true;
R.render(sc,cam3)}
requestAnimationFrame(loop);

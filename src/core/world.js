import { O, S } from './data.js'

/* ---------- terrain & drone state (no WebGL needed) ---------- */
export const VX=6,VZ=-6,BP=[-14,26],TG=[12,2],P40=[BP[0]+(TG[0]-BP[0])*.4,BP[1]+(TG[1]-BP[1])*.4],ALT=[P40,[6,22],TG];
export function H(x,z){const r=Math.hypot(x,z),d=Math.hypot(x-VX,z-VZ),b=9*Math.pow(Math.max(0,1-r/50),1.2),c=24*Math.exp(-Math.pow(d/12,1.7));let y=b+c-1.5+(b>1.5?1.1*Math.sin(x*.3)*Math.cos(z*.27)+.4*Math.sin(x*.9+z*.7):0);return y-5*Math.max(0,1-d/3.5)}
export const D={x:BP[0],z:BP[1],agl:.4,tAgl:.4,bat:100,f:null,fp:0,col:0,hd:0};
export const sleep=ms=>new Promise(r=>setTimeout(r,ms/O.sp));
export function follow(pts,ms,b0,sp){return new Promise(res=>{const L=[0];for(let i=1;i<pts.length;i++)L[i]=L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);D.f={pts,L,ms:ms/O.sp,t0:performance.now(),res,b0,sp}})}
export function updDrone(dt,now){if(D.f){const f=D.f,p=Math.min(1,(now-f.t0)/f.ms),d=p*f.L[f.L.length-1];let i=1;while(i<f.L.length-1&&f.L[i]<d)i++;const s=(d-f.L[i-1])/((f.L[i]-f.L[i-1])||1),a=f.pts[i-1],b=f.pts[i];D.x=a[0]+(b[0]-a[0])*s;D.z=a[1]+(b[1]-a[1])*s;D.hd=Math.atan2(b[0]-a[0],b[1]-a[1]);D.fp=f.b0+f.sp*p;if(p>=1){D.f=null;f.res()}}
D.agl+=(D.tAgl-D.agl)*Math.min(1,dt*2.2);if(S.mn&&S.ms<4&&(D.f||D.col))D.bat=Math.max(5,D.bat-dt*.6)}
export const tele=()=>({alt:Math.round(D.agl*12),spd:D.f?15:D.col?2:0,bat:Math.round(D.bat),sig:D.f&&S.wx==='High Wind'?'Fair':Math.hypot(D.x-BP[0],D.z-BP[1])>26?'Good':'Strong',dist:Math.round(Math.hypot(D.x-TG[0],D.z-TG[1])*25)});
export const G0={th:.75,ph:1,d:105,tx:0,ty:8,tz:0},G={...G0},C={...G0};
export const cam=o=>Object.assign(G,o);

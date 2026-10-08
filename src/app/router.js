import { DASH, LAND, NAV, REP, VIEWS, authH } from '../pages/views.js'
import { $, KEYS, META, NZ, O, RC, RK, S, U, UI, V, hooks } from '../core/data.js'
import { STN, boot3D, mapEl } from '../scene/volcanoScene.js'
import { fillDash, ui } from '../ui/panels.js'
import { run } from '../core/sim.js'
import { G, G0, VX, VZ, cam } from '../core/world.js'

/* ---------- router & events ---------- */
export let root,started=0;
export function shell(inner){return `<div class="app"><nav class="sb gl"><div class="brand">▲ VOLCANO <b>ZERO</b></div>${NAV.map(n=>`<a class="ni${n[0]===({sensor:'sensors',mission:'drone'}[V.page]||V.page)?' on':''}" href="#/app/${n[0]}"><i>${n[2]}</i>${n[1]}</a>`).join('')}</nav><main><header class="top"><input id="sq" class="sq" placeholder="Search page or station" aria-label="Search"><span class="sp"></span><span class="chip" id="sysc"></span><a class="btn" href="#/app/alerts" aria-label="Alerts">🔔<sup id="bell"></sup></a><div class="tm"><b id="clk"></b><small id="dt"></small></div><a class="av" href="#/app/profile" style="display:grid;place-items:center">${U.name[0]}</a></header><div id="view">${inner}</div></main></div>`}
export function render(){const h=location.hash.slice(2).split('/'),a=h[0];if(a==='app'){V.page=NAV.some(n=>n[0]===h[1])||['profile','sensor','mission'].includes(h[1])?h[1]:'dash';if(V.page==='sensor'&&META[h[2]])UI.sel=h[2];root.innerHTML=shell(V.page==='dash'?DASH:V.page==='map'?'<div class="ms big" id="mapslot"></div>':VIEWS[V.page]());if(V.page==='dash'||V.page==='map'){$('#mapslot').appendChild(mapEl);boot3D();ui()}if(V.page==='dash')fillDash();tick2()}else if(a==='login'||a==='signup')root.innerHTML=authH(a);else root.innerHTML=LAND;scrollTo(0,0)}
export function refresh(){if(V.page==='dash')fillDash();else if(VIEWS[V.page]&&V.page!=='reports'&&V.page!=='settings'&&V.page!=='profile'&&location.hash.startsWith('#/app')){const v=$('#view');if(v)v.innerHTML=VIEWS[V.page]()}ui();tick2()}
export function tick2(){const c=$('#clk');if(!c)return;c.textContent=V.CLK;$('#dt').textContent=new Date().toLocaleDateString([], {day:'2-digit',month:'short',year:'numeric'});$('#bell').textContent=S.al.filter(a=>a.s===2).length||'';$('#sysc').innerHTML=`<span style="color:${RC[S.risk]}">●</span> ${S.run?'Scenario running':'Systems online'} · ${RK[S.risk]}`}
setInterval(()=>{V.CLK=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});for(const k of KEYS){S.cur[k]+=(S.tg[k]-S.cur[k])*.6+(Math.random()-.5)*NZ[k];S.h[k].push(S.cur[k]);S.h[k].shift()}if(location.hash.startsWith('#/app'))refresh()},1500);
V.CLK=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
export function authGo(m){const em=$('#em').value.trim(),pw=$('#pw').value,msg=$('#msg'),bad=t=>{msg.className='msg er';msg.textContent=t};
if(m==='signup'&&!$('#nm').value.trim())return bad('Enter your full name.');if(!/^\S+@\S+\.\S+$/.test(em))return bad('Enter a valid email address.');if(pw.length<6)return bad('Password must be at least 6 characters.');if(m==='signup'&&pw!==$('#pw2').value)return bad('Passwords do not match.');
if(m==='signup')U.name=$('#nm').value.trim();U.email=em;msg.className='msg';msg.innerHTML='<span class="spn"></span> Signing in…';setTimeout(()=>{msg.className='msg ok';msg.textContent='Success. Opening the command center.';setTimeout(()=>location.hash='#/app/dash',500)},900)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-c],[data-k],[data-f],[data-rep],[data-tg],[data-a],[data-st],[data-demo],#go');if(!t)return;const d=t.dataset;
if(t.id==='go')return run();if(d.demo){setTimeout(run,1800);return}
if(d.k){UI.sel=d.k;if(V.page==='dash')location.hash='#/app/sensors';else refresh();return}
if(d.f){UI.f=d.f;return refresh()}if(d.rep){UI.rep=REP[d.rep]();return $('#view').innerHTML=VIEWS.reports()}
if(d.tg){if(d.tg==='sp')O.sp=O.sp===1?2:O.sp===2?.5:1;else O[d.tg]=O[d.tg]?0:1;document.body.classList.toggle('rm',!!O.rm);return $('#view').innerHTML=VIEWS[V.page]()}
if(d.a==='pw'){const i=$('#pw');i.type=i.type==='password'?'text':'password';t.textContent=i.type==='password'?'Show':'Hide';return}
if(d.a==='forgot'){e.preventDefault();const m=$('#msg');m.className='msg';m.textContent='Password reset is handled by your auth backend, which is not connected here.';return}
if(d.st){V.SEL={t:'st',id:d.st};return}if(d.a)return authGo(d.a);
if(d.c==='x'){V.SEL=null;return ui()}if(d.c==='2d')G.ph=.02;if(d.c==='3d')G.ph=1;if(d.c==='in')G.d=Math.max(22,G.d*.8);if(d.c==='out')G.d=Math.min(220,G.d*1.25);if(d.c==='rs')cam(G0);if(d.c==='cl')G.d>60?cam({tx:VX,tz:VZ,ty:16,d:40,ph:.95}):cam(G0)});
document.addEventListener('keydown',e=>{if(e.target.id!=='sq'||e.key!=='Enter')return;const v=e.target.value.toLowerCase().trim(),n=NAV.find(n=>n[1].toLowerCase().includes(v)),s=STN.find(s=>s.n.toLowerCase().includes(v));if(s){V.SEL={t:'st',id:s.id};location.hash='#/app/map'}else if(n)location.hash='#/app/'+n[0]});
hooks.refresh=refresh;
export function start(){if(started)return;started=1;root=$('#root');addEventListener('hashchange',render);document.body.classList.toggle('rm',!!O.rm);render()}

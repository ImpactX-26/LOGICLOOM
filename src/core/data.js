

export const $=s=>document.querySelector(s),KEYS=['seis','gas','therm','def','wx'],RK=['LOW','ELEVATED','HIGH','CRITICAL'],LV=['Normal','Elevated','High'],CC=['#34d399','#fbbf24','#f43f5e'],RC=['#34d399','#fbbf24','#ff7a45','#f43f5e'];
export const O={rm:matchMedia('(prefers-reduced-motion: reduce)').matches,smoke:1,lab:1,sp:1},U={name:'Operator',email:'operator@volcanozero.ai'},UI={f:'All',sel:'seis',rep:''};
export const META={seis:['Seismic Activity','Seismic Sensor · North Station','North Station',v=>v.toFixed(1),[5,7]],gas:['Volcanic Gas (SO₂)','Gas Sensor · South Station','South Station',v=>v.toFixed(0)+' ppm',[30,50]],therm:['Thermal Activity','Thermal Sensor · Summit','Summit Station',v=>v.toFixed(0)+' °C',[38,45]],def:['Ground Deformation','Tilt Sensor · West Station','West Station',v=>v.toFixed(1)+' cm',[.6,1.5]],wx:['Weather (Wind)','Anemometer · East Station','East Station',v=>v.toFixed(0)+' km/h',[20,35]]};
export const BASE={seis:3.1,gas:18,therm:31,def:.1,wx:8},NZ={seis:.25,gas:1.5,therm:.6,def:.03,wx:1.2};
export const HYN=['Magma Movement','Hydrothermal Activity','Sensor Malfunction','Local Geological Activity','Other'],HYC=['#fbbf24','#38bdf8','#8da2c4','#8da2c4','#8da2c4'];
export const HY=[[8,12,10,10,60],[35,22,28,10,5],[45,25,15,10,5],[50,24,12,9,5],[66,20,6,5,3],[82,10,3,3,2]];
export const ACT0=['Continue monitoring all sensors','Re-evaluate when new data arrives'],ACT5=['Alert authorities','Prepare evacuation Zone A','Restrict dangerous routes','Continue drone monitoring','Continue sensor collection'];
export const AGN=[['Orchestrator','Analyzing situation'],['Seismic Agent','Monitoring seismic data'],['Thermal Agent','Analyzing thermal readings'],['Gas Agent','Processing gas measurements'],['Evidence Agent','Combining evidence'],['Hypothesis Agent','Weighing hypotheses'],['Information-Gain Agent','Selecting next measurement'],['Mission Planner','Executing drone mission'],['Weather Agent','Monitoring flight conditions']];
export const MST=['Mission Scheduled','En Route to Zone A','Collecting Gas Data','Returning to Base'];
export const fresh=()=>({cur:{...BASE},tg:{...BASE},h:Object.fromEntries(KEYS.map(k=>[k,Array.from({length:24},()=>BASE[k]+(Math.random()-.5)*NZ[k]*2)])),tl:[],al:[],ag:{},inv:[],risk:0,wx:'Normal',hy:HY[0],act:ACT0,ig:null,tz:0,ban:'SYSTEM NORMAL',st:'ALL SYSTEMS NORMAL',sit:'All sensors report normal values. No investigation is active.',why:'No evidence of unrest. The agents keep watching all feeds.',next:'Continue monitoring all sensors.',run:0,done:0,mn:'',ms:0,dst:'Docked at base'});
export const lvl=k=>{const v=S.cur[k],t=META[k][4];return v>=t[1]?2:v>=t[0]?1:0};

export const S=fresh();
export const V={CLK:'',SEL:null,page:'dash'};
export const hooks={refresh(){},ui(){}};
export function resetS(){for(const k of Object.keys(S))delete S[k];Object.assign(S,fresh())}

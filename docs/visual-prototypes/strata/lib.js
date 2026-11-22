const NS='http://www.w3.org/2000/svg';
const C={bone:'#F2ECE0',paper:'#FBF7EF',coal:'#241F1B',soot:'#171817',verm:'#B4412D',patina:'#526A57',brass:'#D4B058',rust:'#E6B6A4',
  muted:'#675F55',hair:'#BDB3A1',mutedDark:'#A59D8E',
  tones:['#D8CDB7','#C6B9A0','#B4AE95','#CBBAA2','#ABA790'],
  dark:['#2E2A25','#38332C','#2A2823','#3B352D','#2F312B']};
const F={disp:"'Young Serif', serif",inst:"'Sofia Sans Extra Condensed', sans-serif",ui:"'Sofia Sans', sans-serif"};
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in (a||{}))e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function T(p,x,y,s,o){o=o||{};const e=el('text',{x:x,y:y,'font-family':o.f||F.ui,'font-size':o.s||15,'font-weight':o.w||400,fill:o.c||C.coal,'text-anchor':o.a||'start','letter-spacing':o.ls||0},p);e.textContent=s;return e}
function P(p,x,y,lines,o){o=o||{};lines.forEach((l,i)=>T(p,x,y+i*(o.lh||20),l,o))}
function tri(p,x,y,s,dir,fill){ // dir 'up'|'down'|'right'|'left'
  const h=s,w=s*1.1;let d;
  if(dir==='up')d=`M${x},${y-h/2}L${x+w/2},${y+h/2}L${x-w/2},${y+h/2}Z`;
  else if(dir==='down')d=`M${x},${y+h/2}L${x+w/2},${y-h/2}L${x-w/2},${y-h/2}Z`;
  else if(dir==='right')d=`M${x+h/2},${y}L${x-h/2},${y+w/2}L${x-h/2},${y-w/2}Z`;
  else d=`M${x-h/2},${y}L${x+h/2},${y+w/2}L${x+h/2},${y-w/2}Z`;
  return el('path',{d:d,fill:fill},p)}

let _pat=null;const _made={};
function patRoot(){if(_pat)return _pat;const s=el('svg',{width:0,height:0,style:'position:absolute'},document.body);_pat=el('defs',{},s);
  // ruled-out by guess: diagonal hatch on bone
  let p=el('pattern',{id:'exG',width:7,height:7,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},_pat);
  el('rect',{width:7,height:7,fill:C.bone},p);el('line',{x1:0,y1:0,x2:0,y2:7,stroke:C.coal,'stroke-width':1.2,'stroke-opacity':.5},p);
  // ruled-out by evidence: patina stipple on pale ground
  p=el('pattern',{id:'exE',width:8,height:8,patternUnits:'userSpaceOnUse'},_pat);
  el('rect',{width:8,height:8,fill:'#E4E3D2'},p);[[2,2],[6,6]].forEach(a=>el('circle',{cx:a[0],cy:a[1],r:1.25,fill:C.patina},p));el('line',{x1:0,x2:8,y1:7.5,y2:7.5,stroke:C.patina,'stroke-width':.5,'stroke-opacity':.45,'stroke-dasharray':'1 2'},p);
  return _pat}
const MOTIFS=[
 g=>[3,8,13].forEach(y=>el('line',{x1:0,x2:14,y1:y,y2:y,stroke:C.coal,'stroke-width':.8,'stroke-opacity':.38},g)),
 g=>[[3,3],[10,6],[5,11],[12,13]].forEach(a=>el('circle',{cx:a[0],cy:a[1],r:1.05,fill:C.coal,'fill-opacity':.42},g)),
 g=>{el('line',{x1:1,x2:7,y1:4,y2:4,stroke:C.coal,'stroke-width':1,'stroke-opacity':.4},g);el('line',{x1:8,x2:14,y1:10,y2:10,stroke:C.coal,'stroke-width':1,'stroke-opacity':.4},g)},
 g=>{el('path',{d:'M0,5 q3.5,-4 7,0 t7,0',fill:'none',stroke:C.coal,'stroke-width':.9,'stroke-opacity':.4},g);el('path',{d:'M0,12 q3.5,-4 7,0 t7,0',fill:'none',stroke:C.coal,'stroke-width':.9,'stroke-opacity':.4},g)},
 g=>{el('path',{d:'M0,0L14,14M14,0L0,14',stroke:C.coal,'stroke-width':.7,'stroke-opacity':.32},g)},
 g=>{el('path',{d:'M0,0.5H14M0,7.5H14M3.5,0.5V7.5M10.5,7.5V14',fill:'none',stroke:C.coal,'stroke-width':.8,'stroke-opacity':.38},g)}];
function decFill(i,dark){const key=(dark?'k':'l')+i;if(_made[key])return _made[key];const r=patRoot();
  const id='dec'+key;const p=el('pattern',{id:id,width:14,height:14,patternUnits:'userSpaceOnUse'},r);
  el('rect',{width:14,height:14,fill:dark?C.dark[i%5]:C.tones[i%5]},p);
  const g=el('g',{},p);MOTIFS[i%6](g);if(dark)g.setAttribute('style','filter:invert(1) opacity(.5)');
  _made[key]='url(#'+id+')';return _made[key]}

function phone(parent,o){o=o||{};const d=document.createElement('div');d.className='phone';d.style.background=o.bg||C.bone;if(o.shadowRing)d.style.setProperty('--bezel',o.shadowRing);
  parent.appendChild(d);const s=el('svg',{width:390,height:844,viewBox:'0 0 390 844'},d);s.style.display='block';
  el('rect',{width:390,height:844,fill:o.bg||C.bone},s);
  const fg=o.dark?C.bone:C.coal;T(s,36,32,'9:41',{s:16,w:700,c:fg,f:F.ui});
  el('rect',{x:134,y:11,width:122,height:35,rx:17.5,fill:'#000'},s);
  el('rect',{x:329,y:21,width:25,height:12,rx:3.5,fill:'none',stroke:fg,'stroke-width':1.4},s);el('rect',{x:331,y:23,width:17,height:8,rx:1.5,fill:fg},s);
  el('rect',{x:128,y:830,width:134,height:5,rx:2.5,fill:fg},s);
  return s}
function btn(p,x,y,w,h,label,kind,o){o=o||{};let fill,stroke,col;
  if(kind==='primary'){fill=C.verm;col=C.bone}else if(kind==='dark'){fill=C.coal;col=C.bone}else if(kind==='brass'){fill=C.brass;col=C.coal}
  else if(kind==='ghostDark'){fill='none';stroke=C.bone;col=C.bone}else{fill='none';stroke=C.coal;col=C.coal}
  el('rect',{x:x,y:y,width:w,height:h,rx:4,fill:fill||'none',stroke:stroke||'none','stroke-width':1.4},p);
  T(p,x+w/2,y+h/2+(o.s||17)*0.34,label,{s:o.s||17,w:o.w||600,c:col,a:'middle',f:o.f||F.ui});}
function wheel(p,x,y,w,h){const svg=p.ownerSVGElement||p;let defs=svg.querySelector('defs.local');if(!defs)defs=el('defs',{class:'local'},svg);
  const id='wg'+Math.floor(Math.random()*1e6);const g=el('linearGradient',{id:id,x1:0,y1:0,x2:0,y2:1},defs);
  [[0,'#0d0c0b'],[.18,'#2b2723'],[.44,'#5b5349'],[.5,'#6e665b'],[.56,'#4c453d'],[.82,'#27231f'],[1,'#0d0c0b']].forEach(s=>el('stop',{offset:s[0],'stop-color':s[1]},g));
  const cl=el('clipPath',{id:id+'c'},defs);el('rect',{x:x,y:y,width:w,height:h,rx:8},cl);
  el('rect',{x:x,y:y,width:w,height:h,rx:8,fill:'url(#'+id+')'},p);
  const gg=el('g',{'clip-path':'url(#'+id+'c)'},p);const cy=y+h/2,R=(h/2)/Math.sin(1.45);
  for(let a=-82;a<=82;a+=3.6){const yy=cy+R*Math.sin(a*Math.PI/180);const th=Math.max(.5,1.7*Math.cos(a*Math.PI/180));
    el('line',{x1:x,x2:x+w,y1:yy,y2:yy,stroke:'#000',opacity:.55,'stroke-width':th},gg);
    el('line',{x1:x,x2:x+w,y1:yy+th,y2:yy+th,stroke:C.bone,opacity:.13*Math.cos(a*Math.PI/180),'stroke-width':.7},gg);}
  el('line',{x1:x+3,x2:x+w-3,y1:cy,y2:cy,stroke:C.brass,'stroke-width':2.4},p);
  tri(p,x+w/2,y+16,8,'up',C.brass);tri(p,x+w/2,y+h-16,8,'down',C.brass);
  tri(p,x-5,cy,9,'right',C.coal);}
function yOf(t,o){return o.bot-(t-o.t0)*(o.bot-o.top)/(o.t1-o.t0)}
function strata(p,o){ // o:{x,w,top,bot,t0,t1,exG:[[a,b]],exE:[[a,b]],dark,labelEvery,rulerX}
  patRoot();const g=el('g',{},p);const clip=el('clipPath',{id:'cp'+Math.floor(Math.random()*1e6)},g);const cid=clip.getAttribute('id');
  el('rect',{x:o.x,y:o.top,width:o.w,height:o.bot-o.top},clip);const gc=el('g',{'clip-path':'url(#'+cid+')'},g);
  for(let d=Math.floor(o.t0/10)*10;d<=o.t1;d+=10){const a=Math.max(d-.5,o.t0),b=Math.min(d+9.5,o.t1);if(b<=a)continue;
    const yt=yOf(b,o),yb=yOf(a,o);el('rect',{x:o.x,y:yt,width:o.w,height:yb-yt,fill:decFill(d/10,o.dark)},gc);
    el('line',{x1:o.x,x2:o.x+o.w,y1:yb,y2:yb,stroke:o.dark?'#000':C.coal,'stroke-width':1,'stroke-opacity':o.dark?.5:.55},gc);}
  (o.exE||[]).forEach(r=>{const yt=yOf(Math.min(r[1]+.5,o.t1),o),yb=yOf(Math.max(r[0]-.5,o.t0),o);if(yb>yt)el('rect',{x:o.x,y:yt,width:o.w,height:yb-yt,fill:'url(#exE)'},gc)});
  (o.exG||[]).forEach(r=>{const yt=yOf(Math.min(r[1]+.5,o.t1),o),yb=yOf(Math.max(r[0]-.5,o.t0),o);if(yb>yt)el('rect',{x:o.x,y:yt,width:o.w,height:yb-yt,fill:'url(#exG)'},gc)});
  el('rect',{x:o.x,y:o.top,width:o.w,height:o.bot-o.top,fill:'none',stroke:o.dark?C.mutedDark:C.coal,'stroke-width':1.4},g);
  // ruler
  const rx=o.rulerX!==undefined?o.rulerX:o.x;const col=o.dark?C.bone:C.coal;
  if(!o.noRuler)for(let t=Math.ceil(o.t0);t<=o.t1;t++){const y=yOf(t,o);if(o.minor===false&&t%5)continue;const L=t%10===0?11:(t%5===0?7:3.5);
    el('line',{x1:rx-L,x2:rx,y1:y,y2:y,stroke:col,'stroke-width':t%10===0?1.4:.8},g);
    if(t%(o.labelEvery||10)===0)T(g,rx-15,y+5,t,{f:F.inst,s:o.labelSize||16,w:600,c:col,a:'end'});}
  return g}
function chip(p,x,y,w,h,lines,o){o=o||{};el('rect',{x:x+2.5,y:y+2.5,width:w,height:h,fill:C.coal,opacity:.2},p);
  el('rect',{x:x,y:y,width:w,height:h,fill:C.paper,stroke:C.coal,'stroke-width':1},p);
  if(o.bar)el('rect',{x:x,y:y,width:4,height:h,fill:o.bar},p);
  lines.forEach((l,i)=>T(p,x+(o.bar?14:10),y+(o.top||18)+i*(o.lh||17),l.t,l.o||{}));}
function mark(p,cx,cy,s,fg,acc){ // strata with a fault: right half has slipped down
  const n=4,bh=s*0.17,gap=s*0.27,half=s*0.4,slip=s*0.13,y0=cy-(n-1)/2*gap-slip/2;
  for(let i=0;i<n;i++){const y=y0+i*gap;
    el('rect',{x:cx-half-s*0.02,y:y-bh/2,width:half-s*0.045,height:bh,fill:fg},p);
    el('rect',{x:cx+s*0.045,y:y-bh/2+slip,width:half-s*0.02,height:bh,fill:fg},p);}
  el('line',{x1:cx+s*0.2,y1:cy-s*0.46,x2:cx-s*0.2,y2:cy+s*0.46,stroke:acc,'stroke-width':s*0.06,'stroke-linecap':'round'},p);}
function pegs(p,x,y,used,total,fg){for(let i=0;i<total;i++){const xx=x+i*15;el('line',{x1:xx,x2:xx,y1:y,y2:y+16,stroke:fg,'stroke-width':1.6,opacity:i<used?1:.45},p);
  el('path',{d:`M${xx},${y} l9,4 l-9,4z`,fill:i<used?fg:'none',stroke:fg,'stroke-width':1.1,opacity:i<used?1:.55},p)}}
function pips(p,x,y,have,total,fg){for(let i=0;i<total;i++)el('rect',{x:x+i*9,y:y,width:6,height:15,fill:i<have?fg:'none',stroke:fg,'stroke-width':1.1,opacity:i<have?1:.5},p)}

function wrapText(str,n){const w=str.split(' ');const out=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>n){out.push(c.trim());c=x}else c+=' '+x});out.push(c.trim());return out}
function hunt(s){
 T(s,24,78,'Daily Hunt 42',{s:15,w:700});pegs(s,24,86,2,6,C.coal);T(s,24,116,'4 guesses left',{s:13,c:C.muted});
 T(s,366,78,'Insight',{s:15,w:700,a:'end'});pips(s,276,86,8,10,C.coal);T(s,366,116,'8 left',{s:13,c:C.muted,a:'end'});
 T(s,20,192,'1962',{f:F.disp,s:80,c:C.coal});
 T(s,366,160,'27 years open',{s:23,w:700,a:'end'});T(s,366,186,'1958–1984',{f:F.inst,s:26,w:600,a:'end',c:C.patina});
 const o={x:86,w:226,top:208,bot:640,t0:1940,t1:2000,exG:[[1985,2000]],exE:[[1940,1957]],labelEvery:10,rulerX:80,labelSize:17};
 strata(s,o);const y=t=>yOf(t,o);
 // corridor edges
 el('rect',{x:308,y:y(1984.5),width:5,height:y(1957.5)-y(1984.5),fill:C.patina},s);
 el('line',{x1:86,x2:312,y1:y(1984.5),y2:y(1984.5),stroke:C.coal,'stroke-width':2.2},s);
 el('line',{x1:86,x2:312,y1:y(1957.5),y2:y(1957.5),stroke:C.patina,'stroke-width':2.6},s);
 // guess 2 notch + chip
 tri(s,78,y(1985),9,'right',C.coal);
 chip(s,96,y(1985)-48,196,36,[{t:'Guess 2: 1985',o:{s:14,w:700}},{t:'Too late. Years after are ruled out.',o:{s:12.5,c:C.muted}}],{top:15,lh:15});
 // evidence tag
 const pinx=268;el('line',{x1:pinx,x2:pinx,y1:y(1957.5),y2:y(1957.5)+14,stroke:C.patina,'stroke-width':1.4},s);el('circle',{cx:pinx,cy:y(1957.5),r:4,fill:C.patina},s);
 chip(s,94,y(1957.5)+14,216,112,[{t:'Technology, 2 Insight',o:{s:13,w:700,c:C.patina}},{t:'Artificial satellites are',o:{s:16}},{t:'already orbiting Earth.',o:{s:16}},{t:'Cuts 104 years down to 27.',o:{s:12.5,c:C.muted}},{t:'Rules out 1881–1957. Grade A.',o:{s:12.5,c:C.muted}}],{bar:C.patina,top:19,lh:19});
 // wheel + minimap
 wheel(s,324,208,48,432);
 const m={x:22,w:12,top:208,bot:640,t0:1800,t1:2000};
 strata(s,{x:22,w:12,top:208,bot:640,t0:1800,t1:2000,exG:[[1800,1880],[1985,2000]],exE:[[1881,1957]],noRuler:true});
 // overwrite minimap: simple fills for clarity
 const my=t=>yOf(t,m);
 el('rect',{x:22,y:my(1984.5),width:12,height:my(1957.5)-my(1984.5),fill:C.patina},s);
 el('rect',{x:17,y:my(2000),width:22,height:my(1940)-my(2000),fill:'none',stroke:C.coal,'stroke-width':1.6},s);
 el('line',{x1:15,x2:41,y1:my(1962),y2:my(1962),stroke:C.verm,'stroke-width':2.4},s);
 // locator
 const yl=y(1962);el('line',{x1:86,x2:312,y1:yl,y2:yl,stroke:C.verm,'stroke-width':2.6},s);
 el('path',{d:`M86,${yl} L98,${yl-13} H138 V${yl+13} H98 Z`,fill:C.verm},s);T(s,121,yl+6,'1962',{f:F.inst,s:19,w:700,c:C.bone,a:'middle'});
 // summary + controls
 T(s,24,664,'Guess 1: 1880 later ▲   Guess 2: 1985 earlier ▼',{s:14,c:C.muted});
 [['−10',24],['−1',80],['+1',136],['+10',192]].forEach(k=>btn(s,k[1],680,50,46,k[0],'ghost',{s:16.5,f:F.inst,w:700}));
 btn(s,250,680,114,46,'Fit 1958–1984','ghost',{s:14.5});
 btn(s,24,742,112,58,'Evidence','ghost',{s:17});btn(s,148,742,216,58,'Lock in 1962','primary',{s:18});
}

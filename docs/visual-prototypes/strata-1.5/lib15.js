// ---------- STRATA 1.5 components ----------
function pat2(){if(window._p2)return;window._p2=1;const r=patRoot();
  const mk=(id,tone)=>{const p=el('pattern',{id:id,width:14,height:14,patternUnits:'userSpaceOnUse'},r);el('rect',{width:14,height:14,fill:tone},p);
    [3.5,10.5].forEach(y=>el('line',{x1:0,x2:14,y1:y,y2:y,stroke:C.coal,'stroke-width':.7,'stroke-opacity':.16},p))};
  mk('lam0','#D8CDB7');mk('lam1','#D0C5AD');
  let p=el('pattern',{id:'exG2',width:7,height:7,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},r);
  el('rect',{width:7,height:7,fill:C.bone},p);el('line',{x1:0,y1:0,x2:0,y2:7,stroke:C.coal,'stroke-width':1,'stroke-opacity':.34},p);
  p=el('pattern',{id:'exE2',width:8,height:8,patternUnits:'userSpaceOnUse'},r);el('rect',{width:8,height:8,fill:'#EAE6D6'},p);
  [[2,2],[6,6]].forEach(a=>el('circle',{cx:a[0],cy:a[1],r:1.15,fill:C.patina,'fill-opacity':.8},p));}
function field15(p,o){pat2();const g=el('g',{},p);const cid='c'+Math.floor(Math.random()*1e9);const cp=el('clipPath',{id:cid},g);
  el('rect',{x:o.x,y:o.top,width:o.w,height:o.bot-o.top},cp);const gc=el('g',{'clip-path':'url(#'+cid+')'},g);
  for(let d=Math.floor(o.t0/10)*10;d<=o.t1;d+=10){const a=Math.max(d-.5,o.t0),b=Math.min(d+9.5,o.t1);if(b<=a)continue;const yt=yOf(b,o),yb=yOf(a,o);
    el('rect',{x:o.x,y:yt,width:o.w,height:yb-yt,fill:'url(#lam'+(((d/10)%2)+2)%2+')'},gc);el('line',{x1:o.x,x2:o.x+o.w,y1:yb,y2:yb,stroke:C.coal,'stroke-width':.8,'stroke-opacity':.22},gc)}
  const rr=(list,fill)=>(list||[]).forEach(r=>{const yt=yOf(Math.min(r[1]+.5,o.t1),o),yb=yOf(Math.max(r[0]-.5,o.t0),o);if(yb>yt)el('rect',{x:o.x,y:yt,width:o.w,height:yb-yt,fill:fill,opacity:r[2]===undefined?1:r[2]},gc)});
  rr(o.exE,'url(#exE2)');rr(o.exG,'url(#exG2)');
  el('rect',{x:o.x,y:o.top,width:o.w,height:o.bot-o.top,fill:'none',stroke:C.coal,'stroke-width':1.4},g);
  if(!o.noRuler){const rx=o.rulerX!==undefined?o.rulerX:o.x;
    for(let t=Math.ceil(o.t0);t<=o.t1;t++){if(!o.allTicks&&t%5)continue;const y=yOf(t,o);const L=t%10===0?11:(t%5===0?7:4);
      el('line',{x1:rx-L,x2:rx,y1:y,y2:y,stroke:C.coal,'stroke-width':t%10===0?1.4:.8},g);
      if(t%(o.labelEvery||10)===0)T(g,rx-14,y+5.5,t,{f:F.inst,s:o.labelSize||17,w:600,a:'end'});}}
  return g}
function wheel15(p,x,y,w,h,ic){const svg=p.ownerSVGElement||p;let defs=svg.querySelector('defs.local');if(!defs)defs=el('defs',{class:'local'},svg);
  const id='wg'+Math.floor(Math.random()*1e9);const g=el('linearGradient',{id:id,x1:0,y1:0,x2:0,y2:1},defs);
  [[0,'#0d0c0b'],[.18,'#2b2723'],[.44,'#5b5349'],[.5,'#6e665b'],[.56,'#4c453d'],[.82,'#27231f'],[1,'#0d0c0b']].forEach(s=>el('stop',{offset:s[0],'stop-color':s[1]},g));
  const cl=el('clipPath',{id:id+'c'},defs);el('rect',{x:x,y:y,width:w,height:h,rx:8},cl);
  el('rect',{x:x,y:y,width:w,height:h,rx:8,fill:'url(#'+id+')'},p);const gg=el('g',{'clip-path':'url(#'+id+'c)'},p);const cy=y+h/2,R=(h/2)/Math.sin(1.45);
  for(let a=-82;a<=82;a+=3.6){const yy=cy+R*Math.sin(a*Math.PI/180);const th=Math.max(.5,1.7*Math.cos(a*Math.PI/180));
    el('line',{x1:x,x2:x+w,y1:yy,y2:yy,stroke:'#000',opacity:.55,'stroke-width':th},gg);el('line',{x1:x,x2:x+w,y1:yy+th,y2:yy+th,stroke:C.bone,opacity:.13*Math.cos(a*Math.PI/180),'stroke-width':.7},gg)}
  el('line',{x1:x+3,x2:x+w-3,y1:cy,y2:cy,stroke:ic||C.bone,'stroke-width':2,opacity:.9},p);
  tri(p,x+w/2,y+16,8,'up',ic||C.bone);tri(p,x+w/2,y+h-16,8,'down',ic||C.bone)}
function locator15(s,yl,x0,x1,txt){el('line',{x1:x0,x2:x1,y1:yl,y2:yl,stroke:C.verm,'stroke-width':2.6},s);
  el('path',{d:`M${x0},${yl} L${x0+14},${yl-22} H${x0+56} V${yl+22} H${x0+14} Z`,fill:C.verm},s);T(s,x0+36,yl+7,txt,{f:F.inst,s:21,w:700,c:C.bone,a:'middle'})}
function minimap15(s,top,bot,view){const m={x:24,w:10,top:top,bot:bot,t0:1800,t1:2000};
  field15(s,{x:24,w:10,top:top,bot:bot,t0:1800,t1:2000,exG:[[1800,1880],[1985,2000]],exE:[[1881,1957]],noRuler:true});const my=t=>yOf(t,m);
  el('rect',{x:24,y:my(1984.5),width:10,height:my(1957.5)-my(1984.5),fill:C.patina},s);
  if(view)el('rect',{x:19,y:my(view[1]),width:20,height:my(view[0])-my(view[1]),fill:'none',stroke:C.coal,'stroke-width':1.6},s);
  el('line',{x1:17,x2:41,y1:my(1962),y2:my(1962),stroke:C.verm,'stroke-width':2.4},s)}
function btnT(s,x,y,w,h,label,kind,o){btn(s,x,y,w,h,label,kind,o)}

function home15(s){
  T(s,26,86,'Timehunt',{f:F.disp,s:25});T(s,364,84,'Sunday 22 November',{s:14.5,c:C.muted,a:'end'});
  const o={x:86,w:226,top:118,bot:470,t0:1800,t1:2000,labelEvery:50,rulerX:80,labelSize:18};field15(s,o);
  const yl=yOf(1900,o);locator15(s,yl,86,312,'1900');tri(s,112,yl-36,9,'up',C.coal);tri(s,112,yl+36,9,'down',C.coal);
  wheel15(s,324,118,48,352);
  T(s,26,534,'A year is hiding',{f:F.disp,s:30});T(s,26,570,'between 1800 and 2000.',{f:F.disp,s:30});
  T(s,26,606,'Drag the marker or the wheel to try a year.',{s:15.5,c:C.muted});T(s,26,628,'It is a starting point, not the answer.',{s:15.5,c:C.muted});
  btn(s,26,656,338,58,"Start today's hunt",'primary',{s:18});
  T(s,26,764,'Practice',{s:16.5,w:700});T(s,364,764,'Archive: 12 years found',{s:16,c:C.muted,a:'end'});T(s,26,802,'How it works',{s:15,c:C.muted})}

function hunt15(s,o){o=o||{};
  T(s,24,84,'Daily Hunt 42 · 4 guesses left',{s:15,w:600});T(s,366,84,'Insight 8 of 10',{s:15,w:600,a:'end'});
  T(s,24,112,'What year will you try?',{s:15,c:C.muted});
  T(s,18,204,'1962',{f:F.disp,s:94});
  T(s,24,234,'1958–1984 · 27 possible years',{s:17.5,w:700});T(s,24,256,'Last guess 1985: too late ▼',{s:14.5,c:C.muted});
  el('rect',{x:27,y:269,width:342,height:46,fill:C.coal,opacity:.18},s);el('rect',{x:24,y:266,width:342,height:46,fill:C.paper,stroke:C.coal,'stroke-width':1},s);el('rect',{x:24,y:266,width:5,height:46,fill:C.patina},s);
  T(s,40,286,'Clue revealed: 104 → 27 possible years',{s:15,w:700});T(s,40,304,'77 years removed (74%).',{s:13.5,c:C.muted});T(s,350,296,'×',{s:26,c:C.muted,a:'middle'});
  const f={x:86,w:226,top:328,bot:650,t0:1940,t1:2000,exG:[[1985,2000]],exE:[[1940,1957]],labelEvery:10,rulerX:80};field15(s,f);const y=t=>yOf(t,f);
  el('rect',{x:308,y:y(1984.5),width:5,height:y(1957.5)-y(1984.5),fill:C.patina},s);
  el('line',{x1:86,x2:312,y1:y(1984.5),y2:y(1984.5),stroke:C.coal,'stroke-width':2.4},s);el('line',{x1:86,x2:312,y1:y(1957.5),y2:y(1957.5),stroke:C.patina,'stroke-width':2.8},s);
  tri(s,77,y(1985),9,'right',C.coal);
  el('circle',{cx:288,cy:y(1957.5),r:15,fill:C.patina,stroke:C.paper,'stroke-width':2},s);T(s,288,y(1957.5)+6,'i',{f:F.disp,s:19,c:C.bone,a:'middle'});
  minimap15(s,328,650,[1940,2000]);
  locator15(s,y(1962),86,312,'1962');
  wheel15(s,324,328,48,322);
  btn(s,24,662,342,46,'Fine tune and details','ghost',{s:15.5});tri(s,344,685,8,'up',C.coal);
  btn(s,24,722,112,56,'Evidence','ghost',{s:17});btn(s,148,722,218,56,'Lock in 1962','primary',{s:18});
}
function sheet(s,top){el('rect',{width:390,height:844,fill:C.coal,opacity:.62},s);el('rect',{x:0,y:top,width:390,height:844-top,fill:C.paper},s);el('rect',{x:0,y:top,width:390,height:3,fill:C.coal},s);el('rect',{x:165,y:top+12,width:60,height:4,rx:2,fill:C.hair},s)}
function power(s,x,y,n){for(let i=0;i<3;i++)el('rect',{x:x+i*17,y:y,width:14,height:9,fill:i<n?C.coal:'none',stroke:C.coal,'stroke-width':1.1,opacity:i<n?1:.5},s)}
function gradeChip(s,xr,y,t,fill){const w=t.length*6.8+14;el('rect',{x:xr-w,y:y-14,width:w,height:21,fill:fill?C.coal:'none',stroke:C.coal,'stroke-width':1.1},s);T(s,xr-w+7,y+1,t,{s:13,w:600,c:fill?C.bone:C.coal})}
function evidence15(s){hunt15(s);sheet(s,196);
  T(s,24,250,'Evidence',{f:F.disp,s:29});T(s,366,244,'Insight 8 of 10',{s:15,w:600,a:'end'});T(s,24,276,'Reveal a clue to remove years. Prices are in Insight.',{s:14.5,c:C.muted});
  const R=[{y:292,c:'Spaceflight',g:'Grade A',q:'Asks: had it happened by 1 January?',p:3,pw:'Strong on your range',cost:3,kind:'a'},
   {y:414,c:'Queer history',g:'Grade A',q:'Asks: had it happened by 1 January?',p:3,pw:'Strong on your range',cost:3,kind:'dup',note:'Overlaps with Spaceflight: both together remove little more.'},
   {y:536,c:'Daily life',g:'Grade B',q:'Asks: was it in common use?',p:1,pw:'Small on your range',cost:1,kind:'a'},
   {y:658,c:'Demographics',g:'Discovery',q:'Removes no years from your range.',p:0,kind:'free'}];
  R.forEach(r=>{el('line',{x1:24,x2:366,y1:r.y,y2:r.y,stroke:C.hair,'stroke-width':1},s);const free=r.kind==='free';
    T(s,24,r.y+28,r.c,{s:19,w:700,c:free?C.muted:C.coal});gradeChip(s,366,r.y+26,r.g,free);
    T(s,24,r.y+50,r.q,{s:14.5,c:C.muted});
    if(!free){power(s,24,r.y+62,r.p);T(s,24+60,r.y+71,r.pw,{s:14,w:600})}
    if(r.note)P(s,24,r.y+90,wrapText(r.note,34),{s:13.5,c:C.muted,lh:16});
    if(free){T(s,24,r.y+74,'Kept for the World Reveal. Free.',{s:14,c:C.muted});btn(s,252,r.y+66,114,42,'Keep','ghost',{s:15.5})}
    else btn(s,234,r.y+66,132,42,'Reveal · '+r.cost+' Insight',r.kind==='dup'?'ghost':'dark',{s:14.5})})}
function details15(s){hunt15(s);sheet(s,176);
  T(s,24,230,'Details',{f:F.disp,s:29});T(s,366,226,'Done',{s:16,w:700,a:'end'});
  T(s,24,272,'Guesses · 2 of 6',{s:16,w:700,c:C.patina});
  [['1880 · later ▲','Years up to 1880 ruled out'],['1985 · earlier ▼','1985 and after ruled out']].forEach((g,i)=>{const y=292+i*40;el('line',{x1:24,x2:366,y1:y,y2:y,stroke:C.hair,'stroke-width':1},s);T(s,24,y+26,g[0],{s:17,w:700});T(s,366,y+26,g[1],{s:14,c:C.muted,a:'end'})});
  T(s,24,398,'Evidence used',{s:16,w:700,c:C.patina});
  el('rect',{x:24,y:410,width:342,height:150,fill:C.bone,stroke:C.coal,'stroke-width':1},s);el('rect',{x:24,y:410,width:5,height:150,fill:C.patina},s);
  T(s,40,434,'Technology · 2 Insight · Grade A',{s:14.5,w:700,c:C.patina});
  T(s,40,458,'Artificial satellites are already orbiting Earth.',{s:16});
  T(s,40,480,'Counted as true if it holds on 1 January of the year.',{s:14,c:C.muted});
  T(s,40,508,'104 → 27 possible years',{s:17,w:700});T(s,40,528,'77 removed (74%). Rules out 1881–1957.',{s:14,c:C.muted});T(s,40,550,'Sources ▸',{s:14.5,w:700});
  T(s,24,594,'Fine tune',{s:16,w:700,c:C.patina});
  [['−10',24],['−1',82],['+1',140],['+10',198]].forEach(k=>btn(s,k[1],606,52,46,k[0],'ghost',{s:16.5,f:F.inst,w:700}));btn(s,258,606,108,46,'Type a year','ghost',{s:14.5});
  btn(s,24,664,170,46,'Fit 1958–1984','ghost',{s:15});btn(s,204,664,76,46,'Zoom −','ghost',{s:14.5});btn(s,290,664,76,46,'Zoom +','ghost',{s:14.5});
  btn(s,24,742,342,56,'Back to the hunt','dark',{s:17})}

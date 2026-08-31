// ===== STATE =====
const PASTELS=['#c9b8ff','#b8ffd9','#ffd4b8','#b8e8ff','#ffb8d4','#fffdb8','#e8b8ff','#b8fff5'];
let nodes=[],edges=[],mode='node',nextLabel=65,nodeIdCounter=0,edgeIdCounter=0;
let pan={x:0,y:0},zoom=1,dragging=false,dragStart={x:0,y:0},panStart={x:0,y:0};
let edgeSource=null,mousePos={x:0,y:0},hoveredNode=null,selectedNode=null;
let algoSteps=[],stepIndex=-1,mstEdges=[],algoRunning=false,algoInterval=null,algoComplete=false;
let parent={},rank={};
const canvas=document.getElementById('graphCanvas'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);

// ===== THEME =====
const savedTheme=localStorage.getItem('theme')||'dark';
document.documentElement.setAttribute('data-theme',savedTheme);
let themeColors={};
function updateThemeColors(){
  const s=getComputedStyle(document.documentElement);
  themeColors={
    edgeDef:s.getPropertyValue('--edge-default').trim(),
    edgeCan:s.getPropertyValue('--edge-candidate').trim(),
    edgeMst:s.getPropertyValue('--edge-mst').trim(),
    edgeRej:s.getPropertyValue('--edge-rejected').trim(),
    textPri:s.getPropertyValue('--text-primary').trim(),
    bgCard:s.getPropertyValue('--bg-card').trim(),
    glowNode:s.getPropertyValue('--glow-node').trim(),
    glowMst:s.getPropertyValue('--glow-mst').trim(),
    glowRej:s.getPropertyValue('--glow-reject').trim(),
    glowAct:s.getPropertyValue('--glow-active').trim(),
    strokeNode:document.documentElement.dataset.theme==='light'?'rgba(0,0,0,0.15)':'rgba(255,255,255,0.6)'
  };
  $('btnTheme').innerHTML=document.documentElement.dataset.theme==='light'?'🌙 Dark':'☀️ Light';
}
setTimeout(updateThemeColors,0);
$('btnTheme').onclick=()=>{
  const n=document.documentElement.dataset.theme==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',n);
  localStorage.setItem('theme',n);updateThemeColors();
};

// ===== UNDO / REDO =====
let undoStack=[],redoStack=[];
function saveState(){
  undoStack.push({nodes:JSON.parse(JSON.stringify(nodes)),edges:JSON.parse(JSON.stringify(edges)),nodeIdCounter,edgeIdCounter,nextLabel});
  if(undoStack.length>50)undoStack.shift();
  redoStack=[];updateUndoRedoUI();
}
function restoreState(s){
  stopAutoPlay();nodes=JSON.parse(JSON.stringify(s.nodes));edges=JSON.parse(JSON.stringify(s.edges));
  nodeIdCounter=s.nodeIdCounter;edgeIdCounter=s.edgeIdCounter;nextLabel=s.nextLabel;
  $('nodeLabel').value=String.fromCharCode(Math.max(65,nextLabel));
  algoSteps=[];stepIndex=-1;mstEdges=[];algoComplete=false;
  $('stepLog').innerHTML='';updateSelects();updateStats();
  updateUndoRedoUI();edgeSource=null;draw();
}
function undo(){
  if(!undoStack.length)return;
  redoStack.push({nodes:JSON.parse(JSON.stringify(nodes)),edges:JSON.parse(JSON.stringify(edges)),nodeIdCounter,edgeIdCounter,nextLabel});
  restoreState(undoStack.pop());toast('Undo','gray');
}
function redo(){
  if(!redoStack.length)return;
  undoStack.push({nodes:JSON.parse(JSON.stringify(nodes)),edges:JSON.parse(JSON.stringify(edges)),nodeIdCounter,edgeIdCounter,nextLabel});
  restoreState(redoStack.pop());toast('Redo','gray');
}
function updateUndoRedoUI(){
  $('btnUndo').disabled=!undoStack.length;$('btnRedo').disabled=!redoStack.length;
}
$('btnUndo').onclick=undo;$('btnRedo').onclick=redo;

// ===== RESIZE =====
function resize(){if(!canvas.parentElement)return;canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight}
window.addEventListener('resize',resize);
new ResizeObserver(resize).observe(canvas.parentElement);
resize();

// Resizers
let isResizingV=false,isResizingH=false;
if($('resizerV'))$('resizerV').addEventListener('mousedown',e=>{isResizingV=true;document.body.style.cursor='ew-resize';$('resizerV').classList.add('active');e.preventDefault()});
if($('resizerH'))$('resizerH').addEventListener('mousedown',e=>{isResizingH=true;document.body.style.cursor='ns-resize';$('resizerH').classList.add('active');e.preventDefault()});
document.addEventListener('mousemove',e=>{
  if(isResizingV){
    const mx=Math.max(100,Math.min(e.clientX,document.body.clientWidth-200));
    $('app').style.gridTemplateColumns=`${mx}px 5px 1fr`;
  }
  if(isResizingH){
    const mn=Math.max(50,Math.min(document.body.clientHeight-e.clientY,document.body.clientHeight-100));
    $('app').style.gridTemplateRows=`auto 1fr 5px ${mn}px`;
  }
});
document.addEventListener('mouseup',()=>{
  if(isResizingV||isResizingH){
    isResizingV=isResizingH=false;
    document.body.style.cursor='';
    if($('resizerV'))$('resizerV').classList.remove('active');
    if($('resizerH'))$('resizerH').classList.remove('active');
    localStorage.setItem('gridCols',$('app').style.gridTemplateColumns);
    localStorage.setItem('gridRows',$('app').style.gridTemplateRows);
  }
});
if(localStorage.getItem('gridCols'))$('app').style.gridTemplateColumns=localStorage.getItem('gridCols');
if(localStorage.getItem('gridRows'))$('app').style.gridTemplateRows=localStorage.getItem('gridRows');

// ===== TOAST =====
function toast(msg,type='purple'){
  const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;
  $('toastContainer').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3000);
}

// ===== UTILS =====
function screenToWorld(x,y){return{x:(x-pan.x)/zoom,y:(y-pan.y)/zoom}}
function worldToScreen(x,y){return{x:x*zoom+pan.x,y:y*zoom+pan.y}}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function nodeAt(wx,wy){return nodes.find(n=>dist({x:wx,y:wy},n)<30)}
function edgeAt(wx,wy){
  for(let e of edges){
    const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);
    if(!a||!b)continue;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
    if(len<1)continue;
    const t=Math.max(0,Math.min(1,((wx-a.x)*dx+(wy-a.y)*dy)/(len*len)));
    const px=a.x+t*dx,py=a.y+t*dy;
    if(Math.hypot(wx-px,wy-py)<10)return e;
  }return null;
}
function applyGlow(c,color,blur=18){c.shadowColor=color;c.shadowBlur=blur}
function clearGlow(c){c.shadowColor='transparent';c.shadowBlur=0}
function updateStats(){
  $('statNodes').textContent=nodes.length;
  $('statEdges').textContent=edges.length;
  const mc=mstEdges.length;
  $('statMST').textContent=mc;
  $('statWeight').textContent=mstEdges.reduce((s,e)=>s+e.weight,0);
  // count components
  let p={};nodes.forEach(n=>p[n.id]=n.id);
  function f(x){return p[x]===x?x:p[x]=f(p[x])}
  edges.forEach(e=>{if(e.state==='mst'||!algoComplete){const a=f(e.from),b=f(e.to);if(a!==b)p[a]=b}});
  if(!algoComplete)edges.forEach(e=>{const a=f(e.from),b=f(e.to);if(a!==b)p[a]=b});
  const comps=new Set(nodes.map(n=>f(n.id))).size;
  $('statComp').textContent=nodes.length?comps:0;
}
function updateSelects(){
  const makeopts=()=>nodes.map(n=>`<option value="${n.id}">${n.label}</option>`).join('');
  $('edgeFrom').innerHTML=makeopts();$('edgeTo').innerHTML=makeopts();
  checkEdgeForm(false);
}
function checkEdgeForm(updateWeight=false){
  const f=+$('edgeFrom').value,t=+$('edgeTo').value;
  const ex=edges.find(e=>(e.from===f&&e.to===t)||(e.to===f&&e.from===t));
  $('btnAddEdge').innerHTML=ex?'<span>✎ Update Edge</span>':'<span>+ Add Edge</span>';
  if(ex&&updateWeight){$('weightSlider').value=ex.weight;$('weightNum').value=ex.weight;}
}
$('edgeFrom').addEventListener('change', ()=>checkEdgeForm(true));
$('edgeTo').addEventListener('change', ()=>checkEdgeForm(true));

// ===== DRAW =====
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);

  // edges
  edges.forEach(e=>{
    const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);
    if(!a||!b)return;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    let col=themeColors.edgeDef,lw=2,glow=null;
    if(e.state==='candidate'){col=themeColors.edgeCan;lw=2.5;glow=themeColors.glowNode}
    else if(e.state==='mst'){col=themeColors.edgeMst;lw=3.5;glow=themeColors.glowMst}
    else if(e.state==='rejected'){col=themeColors.edgeRej;lw=2.5;glow=themeColors.glowRej}
    if(glow)applyGlow(ctx,glow,16);
    ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();clearGlow(ctx);
    // weight label
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    ctx.fillStyle=themeColors.bgCard||'#16213e';
    const tw=ctx.measureText(e.weight+'').width+14;
    ctx.beginPath();
    const rr=10;const rx=mx-tw/2,ry=my-10;
    ctx.roundRect(rx,ry,tw,20,rr);ctx.fill();
    ctx.strokeStyle=col;ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=themeColors.textPri||'#f0eeff';ctx.font='500 12px "JetBrains Mono"';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(e.weight,mx,my);
  });

  // edge preview
  if(mode==='edge'&&edgeSource){
    const s=edgeSource;
    ctx.beginPath();ctx.moveTo(s.x,s.y);
    const w=screenToWorld(mousePos.x,mousePos.y);
    ctx.lineTo(w.x,w.y);ctx.setLineDash([6,6]);ctx.strokeStyle=themeColors.edgeCan||'#7c6fff';ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
    // orbit on source
    const t=Date.now()/500;
    ctx.beginPath();ctx.arc(s.x,s.y,34+Math.sin(t)*4,0,Math.PI*2);
    ctx.strokeStyle=themeColors.glowNode||'rgba(124,111,255,0.4)';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  }

  // nodes
  nodes.forEach(n=>{
    const isHov=hoveredNode===n,isSel=selectedNode===n;
    const inMST=mstEdges.some(e=>e.from===n.id||e.to===n.id);
    const r=26*(isHov?1.1:1);
    // glow
    if(inMST&&algoComplete)applyGlow(ctx,themeColors.glowMst,22);
    else if(isSel)applyGlow(ctx,themeColors.glowAct,24);
    else applyGlow(ctx,n.color.replace(')',document.documentElement.dataset.theme==='light'?',0.2)':',0.45)').replace('rgb','rgba'),20);
    ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=n.color;ctx.fill();
    clearGlow(ctx);
    ctx.strokeStyle=inMST&&algoComplete?themeColors.edgeMst:themeColors.strokeNode;ctx.lineWidth=inMST?3:2;ctx.stroke();
    // label
    ctx.fillStyle='#1a1a2e';ctx.font='600 16px Outfit';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n.label,n.x,n.y);
  });

  ctx.restore();
  requestAnimationFrame(draw);
}
draw();

// ===== CANVAS EVENTS =====
canvas.addEventListener('mousedown',e=>{
  const rect=canvas.getBoundingClientRect();
  const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
  const w=screenToWorld(sx,sy);
  if(e.button===2)return; // context menu handled separately
  if(e.button===1||(mode==='pan'&&e.button===0)){dragging=true;dragStart={x:sx,y:sy};panStart={...pan};return}
  const hit=nodeAt(w.x,w.y);
  if(mode==='node'){
    if(!hit){
      saveState();
      const label=$('nodeLabel').value.toUpperCase()||String.fromCharCode(nextLabel);
      addNode(label,w.x,w.y);
    }
  }else if(mode==='edge'){
    if(hit){
      if(!edgeSource){edgeSource=hit;toast(`Selected ${hit.label} — click another node`,'purple')}
      else{
        if(edgeSource.id===hit.id){toast('Self-loop not allowed','pink');return}
        const wt=parseInt($('weightNum').value)||5;
        const ex=edges.find(e=>(e.from===edgeSource.id&&e.to===hit.id)||(e.to===edgeSource.id&&e.from===hit.id));
        if(ex){
          if(ex.weight!==wt){saveState();ex.weight=wt;updateStats();toast('Edge weight updated','purple')}
          else{toast('Edge already exists','gray')}
        }else{
          saveState();
          addEdge(edgeSource.id,hit.id,wt);
        }
        edgeSource=null;
      }
    }
  }else if(mode==='pan'){
    if(hit)selectedNode=hit;
  }
});
canvas.addEventListener('mousemove',e=>{
  const rect=canvas.getBoundingClientRect();
  mousePos={x:e.clientX-rect.left,y:e.clientY-rect.top};
  const w=screenToWorld(mousePos.x,mousePos.y);
  hoveredNode=nodeAt(w.x,w.y);
  canvas.style.cursor=hoveredNode?'pointer':(mode==='pan'?'grab':'crosshair');
  if(dragging){pan.x=panStart.x+(mousePos.x-dragStart.x);pan.y=panStart.y+(mousePos.y-dragStart.y);canvas.style.cursor='grabbing'}
});
canvas.addEventListener('mouseup',()=>{dragging=false});
canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left,my=e.clientY-rect.top;
  const oldZ=zoom;
  zoom*=e.deltaY<0?1.1:0.9;zoom=Math.max(0.2,Math.min(5,zoom));
  pan.x=mx-(mx-pan.x)*(zoom/oldZ);pan.y=my-(my-pan.y)*(zoom/oldZ);
},{passive:false});
canvas.addEventListener('dblclick',e=>{
  if(mode!=='node')return;
  const rect=canvas.getBoundingClientRect();
  const w=screenToWorld(e.clientX-rect.left,e.clientY-rect.top);
  if(!nodeAt(w.x,w.y)){saveState();const label=String.fromCharCode(nextLabel);addNode(label,w.x,w.y)}
});

// ===== CONTEXT MENU =====
let ctxTarget=null;
canvas.addEventListener('contextmenu',e=>{
  e.preventDefault();
  const rect=canvas.getBoundingClientRect();
  const w=screenToWorld(e.clientX-rect.left,e.clientY-rect.top);
  const hitN=nodeAt(w.x,w.y),hitE=edgeAt(w.x,w.y);
  if(!hitN&&!hitE){hideCtx();return}
  ctxTarget=hitN?{type:'node',data:hitN}:{type:'edge',data:hitE};
  const cm=$('ctxMenu');
  cm.style.left=e.clientX+'px';cm.style.top=e.clientY+'px';cm.classList.add('show');
  $('ctxRename').style.display=hitN?'block':'none';
  $('ctxDeleteNode').style.display=hitN?'block':'none';
  $('ctxDeleteEdges').style.display=hitN?'block':'none';
  $('ctxEditWeight').style.display=hitE?'block':'none';
  $('ctxDeleteEdge').style.display=hitE?'block':'none';
});
function hideCtx(){$('ctxMenu').classList.remove('show')}
document.addEventListener('click',hideCtx);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideCtx();$('modalOverlay').classList.remove('show');edgeSource=null}});
$('ctxRename').onclick=()=>{if(ctxTarget?.type==='node'){const l=prompt('New label:',ctxTarget.data.label);if(l&&l.toUpperCase().slice(0,2)!==ctxTarget.data.label){saveState();ctxTarget.data.label=l.toUpperCase().slice(0,2);updateSelects();toast('Node renamed','purple')}}hideCtx()};
$('ctxDeleteNode').onclick=()=>{if(ctxTarget?.type==='node'){saveState();const id=ctxTarget.data.id;nodes=nodes.filter(n=>n.id!==id);edges=edges.filter(e=>e.from!==id&&e.to!==id);updateSelects();updateStats();toast('Node deleted','pink')}hideCtx()};
$('ctxDeleteEdges').onclick=()=>{if(ctxTarget?.type==='node'){saveState();edges=edges.filter(e=>e.from!==ctxTarget.data.id&&e.to!==ctxTarget.data.id);updateStats();checkEdgeForm(false);toast('Edges deleted','pink')}hideCtx()};
$('ctxEditWeight').onclick=()=>{if(ctxTarget?.type==='edge'){const w=prompt('New weight:',ctxTarget.data.weight);if(w&&!isNaN(+w)&&+w!==ctxTarget.data.weight){saveState();ctxTarget.data.weight=Math.max(1,Math.min(50,+w));toast('Weight updated','purple')}}hideCtx()};
$('ctxDeleteEdge').onclick=()=>{if(ctxTarget?.type==='edge'){saveState();edges=edges.filter(e=>e.id!==ctxTarget.data.id);updateStats();checkEdgeForm(false);toast('Edge deleted','pink')}hideCtx()};

// ===== ADD NODE/EDGE =====
function addNode(label,x,y){
  const color=PASTELS[nodes.length%PASTELS.length];
  nodes.push({id:nodeIdCounter++,label,x,y,color});
  nextLabel=Math.max(nextLabel,label.charCodeAt(0)+1);
  $('nodeLabel').value=String.fromCharCode(nextLabel);
  updateSelects();updateStats();toast(`Node added: ${label}`,'green');
}
function addEdge(from,to,weight){
  edges.push({id:edgeIdCounter++,from,to,weight,state:'default'});
  const la=nodes.find(n=>n.id===from).label,lb=nodes.find(n=>n.id===to).label;
  updateStats();checkEdgeForm(false);toast(`Edge added: ${la}–${lb} (weight ${weight})`,'purple');
}

// ===== SIDEBAR CONTROLS =====
document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.mode-btn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');mode=b.dataset.mode;edgeSource=null;
  $('canvasHint').textContent=mode==='node'?'Click to add a node':mode==='edge'?'Click two nodes to connect':'Drag to pan, click node to select';
}));
$('btnAddNode').onclick=()=>{
  saveState();
  const label=$('nodeLabel').value.toUpperCase()||String.fromCharCode(nextLabel);
  addNode(label,200+Math.random()*300,200+Math.random()*200);
};
$('btnAddEdge').onclick=()=>{
  const f=+$('edgeFrom').value,t=+$('edgeTo').value,w=+$('weightNum').value||5;
  if(isNaN(f)||isNaN(t)){$('edgeError').textContent='Select nodes';$('edgeError').classList.add('show');return}
  if(f===t){$('edgeError').textContent='Self-loop not allowed';$('edgeError').classList.add('show');return}
  const ex=edges.find(e=>(e.from===f&&e.to===t)||(e.to===f&&e.from===t));
  $('edgeError').classList.remove('show');
  if(ex){
    if(ex.weight!==w){saveState();ex.weight=w;updateStats();toast(`Edge weight updated to ${w}`,'purple')}
    checkEdgeForm(false);return;
  }
  saveState();addEdge(f,t,w);
};
$('weightSlider').oninput=function(){$('weightNum').value=this.value};
$('weightNum').oninput=function(){$('weightSlider').value=this.value};
$('speedSlider').value=900;

// ===== KRUSKAL =====
function makeSet(){parent={};rank={};nodes.forEach(n=>{parent[n.id]=n.id;rank[n.id]=0})}
function find(x){if(parent[x]!==x)parent[x]=find(parent[x]);return parent[x]}
function union(x,y){const rx=find(x),ry=find(y);if(rx===ry)return false;if(rank[rx]<rank[ry])parent[rx]=ry;else if(rank[rx]>rank[ry])parent[ry]=rx;else{parent[ry]=rx;rank[rx]++}return true}

function computeSteps(){
  makeSet();mstEdges=[];
  const sorted=[...edges].sort((a,b)=>a.weight-b.weight);
  const steps=[{type:'sort',edges:sorted,message:'Sorted edges by weight: '+sorted.map(e=>{
    const la=nodes.find(n=>n.id===e.from).label,lb=nodes.find(n=>n.id===e.to).label;
    return`(${la}-${lb},${e.weight})`;}).join(' ')}];
  sorted.forEach(edge=>{
    const accepted=union(edge.from,edge.to);
    const la=nodes.find(n=>n.id===edge.from).label,lb=nodes.find(n=>n.id===edge.to).label;
    steps.push({type:accepted?'accept':'reject',edge,
      message:accepted?`Edge ${la}–${lb} (w=${edge.weight}) → Added to MST`:`Edge ${la}–${lb} (w=${edge.weight}) → REJECTED (cycle)`});
    if(accepted)mstEdges.push(edge);
  });
  steps.push({type:'complete',mst:[...mstEdges],totalWeight:mstEdges.reduce((s,e)=>s+e.weight,0)});
  return steps;
}

function applyStep(i){
  const step=algoSteps[i];if(!step)return;
  // reset all edge candidate/reject visuals first
  edges.forEach(e=>{if(e.state==='candidate')e.state='default'});
  if(step.type==='sort'){
    addLogEntry(step,'sort',0);
  }else if(step.type==='accept'){
    step.edge.state='mst';
    addLogEntry(step,'accept',i);
  }else if(step.type==='reject'){
    step.edge.state='rejected';
    addLogEntry(step,'reject',i);
    setTimeout(()=>{if(step.edge.state==='rejected')step.edge.state='default'},800);
  }else if(step.type==='complete'){
    algoComplete=true;stopAutoPlay();
    addLogEntry({message:`✅ MST Complete! Total weight: ${step.totalWeight}`},'accept',i);
    showCelebration(step);
  }
  // highlight current candidate for next
  if(i+1<algoSteps.length&&algoSteps[i+1].edge)algoSteps[i+1].edge.state='candidate';
  updateStats();
}

function addLogEntry(step,cls,i){
  const log=$('stepLog');
  const d=document.createElement('div');d.className=`step-entry ${cls}`;
  const icons={sort:'✦',accept:'✓',reject:'✗'};
  d.innerHTML=`<span class="step-icon">${icons[cls]||'▶'}</span><span class="step-num">Step ${i+1}</span><span class="step-msg">${step.message}</span>`;
  // highlight current
  log.querySelectorAll('.step-entry.current').forEach(x=>x.classList.remove('current'));
  d.classList.add('current');
  log.appendChild(d);log.scrollTop=log.scrollHeight;
}

function startAutoPlay(){
  if(algoSteps.length===0){if(nodes.length<2||edges.length===0){toast('Add nodes & edges first','pink');return}algoSteps=computeSteps();stepIndex=-1}
  algoRunning=true;
  const speed=1700-parseInt($('speedSlider').value);
  algoInterval=setInterval(()=>{
    stepIndex++;if(stepIndex>=algoSteps.length){stopAutoPlay();return}
    applyStep(stepIndex);
  },speed);
}
function stopAutoPlay(){algoRunning=false;if(algoInterval){clearInterval(algoInterval);algoInterval=null}}
function stepOnce(){
  if(algoSteps.length===0){if(nodes.length<2||edges.length===0){toast('Add nodes & edges first','pink');return}algoSteps=computeSteps();stepIndex=-1}
  stepIndex++;if(stepIndex>=algoSteps.length)return;
  applyStep(stepIndex);
}

$('btnRun').onclick=()=>{if(algoRunning)return;startAutoPlay()};
$('btnStep').onclick=()=>{stopAutoPlay();stepOnce()};
$('btnPause').onclick=stopAutoPlay;
$('btnAlgoReset').onclick=()=>{stopAutoPlay();algoSteps=[];stepIndex=-1;mstEdges=[];algoComplete=false;edges.forEach(e=>e.state='default');$('stepLog').innerHTML='';updateStats();toast('Algorithm reset','gray')};
$('btnClearLog').onclick=()=>{$('stepLog').innerHTML=''};

// ===== CELEBRATION =====
function showCelebration(step){
  $('modalWeight').textContent=step.totalWeight;
  $('modalEdges').textContent=`Edges used: ${step.mst.length} / ${edges.length}`;
  $('modalOverlay').classList.add('show');
  // fade non-MST edges
  edges.forEach(e=>{if(e.state!=='mst')e.state='faded'});
  spawnConfetti();
}
$('btnModalDetails').onclick=()=>$('modalOverlay').classList.remove('show');
$('btnModalAgain').onclick=()=>{$('modalOverlay').classList.remove('show');$('btnAlgoReset').click()};

function spawnConfetti(){
  const colors=['#7c6fff','#4fffb0','#ff6eb4','#c9b8ff','#ffd4b8','#b8e8ff','#fffdb8'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div');c.className='confetti-piece';
    c.style.left=Math.random()*100+'vw';c.style.top=-10+'px';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.setProperty('--dur',(2+Math.random()*2)+'s');
    c.style.width=(4+Math.random()*6)+'px';c.style.height=(4+Math.random()*6)+'px';
    document.body.appendChild(c);setTimeout(()=>c.remove(),4000);
  }
}

// ===== RESET =====
function doClear(resetView=true){
  stopAutoPlay();nodes=[];edges=[];algoSteps=[];stepIndex=-1;mstEdges=[];algoComplete=false;
  nodeIdCounter=0;edgeIdCounter=0;nextLabel=65;$('nodeLabel').value='A';
  $('stepLog').innerHTML='';updateSelects();updateStats();edgeSource=null;
  if(resetView){pan={x:0,y:0};zoom=1;}
}
$('btnReset').onclick=()=>{
  if(!nodes.length&&!edges.length)return; // Already empty
  if(!confirm('Reset everything?'))return;
  saveState();doClear();toast('Graph reset','gray');
};

// ===== PRESETS =====
$('presetSelect').onchange=function(){
  const val=this.value;if(!val)return;
  const cx=canvas.width/2,cy=canvas.height/2;
  const presets={
    '1':{nodes:[{l:'A',x:cx-120,y:cy-80},{l:'B',x:cx+120,y:cy-80},{l:'C',x:cx+120,y:cy+80},{l:'D',x:cx-120,y:cy+80},{l:'E',x:cx,y:cy}],edges:[['A','B',4],['A','D',2],['B','C',6],['B','E',3],['C','D',8],['D','E',5],['C','E',7]]},
    '2':{nodes:[{l:'A',x:cx-180,y:cy-100},{l:'B',x:cx-60,y:cy-130},{l:'C',x:cx+80,y:cy-100},{l:'D',x:cx+180,y:cy-30},{l:'E',x:cx+100,y:cy+100},{l:'F',x:cx-60,y:cy+100},{l:'G',x:cx-180,y:cy+30}],edges:[['A','B',7],['A','G',5],['B','C',8],['B','G',9],['B','F',7],['C','D',5],['C','F',5],['D','E',15],['D','F',6],['E','F',8],['E','G',9],['F','G',11]]},
    '3':{nodes:[{l:'A',x:cx-200,y:cy-80},{l:'B',x:cx-100,y:cy-140},{l:'C',x:cx+20,y:cy-120},{l:'D',x:cx+140,y:cy-80},{l:'E',x:cx+200,y:cy},{l:'F',x:cx+140,y:cy+80},{l:'G',x:cx+20,y:cy+120},{l:'H',x:cx-100,y:cy+100},{l:'I',x:cx-200,y:cy+20},{l:'J',x:cx,y:cy}],edges:[['A','B',3],['A','I',5],['B','C',4],['B','J',6],['C','D',2],['C','J',8],['D','E',7],['E','F',4],['F','G',3],['F','J',5],['G','H',6],['H','I',2],['I','J',9],['A','J',10],['D','F',8],['B','H',12],['C','G',7],['E','J',6]]},
    '4':{nodes:[{l:'A',x:cx-200,y:cy-50},{l:'B',x:cx-100,y:cy-100},{l:'C',x:cx-100,y:cy+20},{l:'D',x:cx+100,y:cy-50},{l:'E',x:cx+200,y:cy-100},{l:'F',x:cx+200,y:cy+20}],edges:[['A','B',3],['A','C',5],['B','C',4],['D','E',6],['D','F',2],['E','F',7]]}
  };
  const p=presets[val];if(!p){return}
  if(nodes.length&&!confirm('Load preset? Current graph will be lost.')){this.value='';return}
  saveState();doClear(true);
  p.nodes.forEach(n=>addNode(n.l,n.x,n.y));
  const byLabel=l=>nodes.find(n=>n.label===l);
  p.edges.forEach(([a,b,w])=>{const na=byLabel(a),nb=byLabel(b);if(na&&nb)addEdge(na.id,nb.id,w)});
  this.value='';
};

// ===== KEYBOARD =====
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
  if(e.key==='n'||e.key==='N'){document.querySelector('[data-mode=node]').click()}
  else if(e.key==='e'||e.key==='E'){document.querySelector('[data-mode=edge]').click()}
  else if(e.key===' '){e.preventDefault();stepOnce()}
  else if(e.key==='r'||e.key==='R'){algoRunning?stopAutoPlay():startAutoPlay()}
  else if(e.key==='z'&&(e.ctrlKey||e.metaKey)&&!e.shiftKey){e.preventDefault();undo()}
  else if((e.key==='y'&&(e.ctrlKey||e.metaKey))||(e.key==='z'&&(e.ctrlKey||e.metaKey)&&e.shiftKey)){e.preventDefault();redo()}
});

// ===== CANVAS HINT =====
$('canvasHint').textContent='Click to add a node';
updateStats();

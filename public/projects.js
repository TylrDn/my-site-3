// projects.js
const state = {
  type: 'all',        // 'all' | 'demo' | 'library'
  pillar: 'all',      // 'all' | 'Infrastructure' | 'MLOps' | 'GPU' | 'IBM Power'
  tags: new Set(),
  search: ''
};

const els = {
  segments: null,
  pillarContainer: null,
  tagContainer: null,
  search: null,
  grid: null,
  meta: null
};

const DATA_URL = '/public/data/projects.json';
const qs = (s,r=document)=>r.querySelector(s);
const qsa = (s,r=document)=>Array.from(r.querySelectorAll(s));
const toTitle = s => s ? s[0].toUpperCase()+s.slice(1) : '';
const uniq = arr => [...new Set(arr)];
const includesCI = (t,n)=>t.toLowerCase().includes(n.toLowerCase());

/* --- URL state --- */
function readUrl(){
  const p=new URLSearchParams(location.search);
  state.type=p.get('type')||'all';
  state.pillar=p.get('pillar')||'all';
  state.search=p.get('search')||'';
  state.tags=new Set((p.get('tag')||'').split(',').filter(Boolean));
}
function writeUrl(replace=false){
  const p=new URLSearchParams();
  if(state.type!=='all') p.set('type',state.type);
  if(state.pillar!=='all') p.set('pillar',state.pillar);
  if(state.search) p.set('search',state.search);
  if(state.tags.size) p.set('tag',[...state.tags].join(','));
  const url=`${location.pathname}?${p.toString()}`;
  (replace?history.replaceState:history.pushState).call(history,null,'',url);
}

/* --- Rendering --- */
function renderSegments(){
  qsa('.segment').forEach(btn=>{
    const active=btn.dataset.type===state.type||(state.type==='all'&&btn.dataset.type==='all');
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-selected',String(active));
  });
}
function renderPillars(pillars){
  const all=['all',...pillars];
  els.pillarContainer.innerHTML=all.map(p=>{
    const active=(p===state.pillar);
    const label=p==='all'?'All Pillars':p;
    return `<button class="chip" role="switch" aria-pressed="${active}" data-pillar="${p}">${label}</button>`;
  }).join('');
}
function buildCard(p){
  const img=p.image?`<img alt="" src="${p.image}" loading="lazy">`:'';
  return `
  <article class="card" data-type="${p.type}">
    <div class="thumb">${img}</div>
    <div class="body">
      <h3>${p.name}</h3>
      <p>${p.summary}</p>
      <div class="meta-row">
        <span class="badge">${toTitle(p.type)}</span>
        <span class="badge">${p.pillar}</span>
        ${p.tags.slice(0,4).map(t=>`<span class="badge">#${t}</span>`).join('')}
      </div>
    </div>
    <div class="actions">
      ${p.links?.live?`<a href="${p.links.live}" target="_blank" rel="noopener">Live</a>`:''}
      ${p.links?.repo?`<a href="${p.links.repo}" target="_blank" rel="noopener">Repo</a>`:''}
    </div>
  </article>`;
}
function renderGrid(projects){
  els.grid.innerHTML=projects.map(buildCard).join('');
  const count=projects.length;
  const seg=state.type==='all'?'All':toTitle(state.type);
  const parts=[`${count} project${count===1?'':'s'}`,seg];
  if(state.pillar!=='all') parts.push(`· ${state.pillar}`);
  if(state.tags.size) parts.push(`· ${[...state.tags].map(t=>'#'+t).join(', ')}`);
  if(state.search) parts.push(`· “${state.search}”`);
  els.meta.textContent=parts.join(' ');
}
function renderTags(tags){
  els.tagContainer.innerHTML=tags.map(tag=>{
    const active=state.tags.has(tag);
    return `<button class="chip" role="switch" aria-pressed="${active}" data-tag="${tag}">#${tag}</button>`;
  }).join('');
}

/* --- Filtering --- */
function filterProjects(rows){
  return rows.filter(p=>{
    if(state.type!=='all'&&p.type!==state.type) return false;
    if(state.pillar!=='all'&&p.pillar!==state.pillar) return false;
    if(state.tags.size&&![...state.tags].every(t=>p.tags.includes(t))) return false;
    if(state.search){
      const hay=[p.name,p.summary,p.tags.join(' '),p.pillar].join(' ');
      if(!includesCI(hay,state.search)) return false;
    }
    return true;
  }).sort((a,b)=>{
    if((b.featured|0)-(a.featured|0)) return (b.featured|0)-(a.featured|0);
    return a.name.localeCompare(b.name);
  });
}

/* --- Events --- */
function bindEvents(all){
  els.segments.addEventListener('click',e=>{
    const btn=e.target.closest('.segment');if(!btn) return;
    state.type=btn.dataset.type;renderSegments();writeUrl();renderGrid(filterProjects(all));
  });
  els.pillarContainer.addEventListener('click',e=>{
    const chip=e.target.closest('.chip');if(!chip) return;
    state.pillar=chip.dataset.pillar;writeUrl();renderGrid(filterProjects(all));
    renderPillars(uniq(all.map(p=>p.pillar)));
  });
  els.tagContainer.addEventListener('click',e=>{
    const chip=e.target.closest('.chip');if(!chip) return;
    const tag=chip.dataset.tag;
    if(state.tags.has(tag)) state.tags.delete(tag); else state.tags.add(tag);
    chip.setAttribute('aria-pressed',String(state.tags.has(tag)));
    writeUrl();renderGrid(filterProjects(all));
  });
  let tId=0;
  els.search.addEventListener('input',e=>{
    clearTimeout(tId);tId=setTimeout(()=>{
      state.search=e.target.value.trim();writeUrl();renderGrid(filterProjects(all));
    },120);
  });
  window.addEventListener('popstate',()=>{
    readUrl();renderSegments();els.search.value=state.search;
    renderGrid(filterProjects(all));
  });
}

/* --- Init --- */
async function init(){
  els.segments=qs('.segments');els.pillarContainer=qs('#pillar-container');
  els.tagContainer=qs('#tag-container');els.search=qs('#search-input');
  els.grid=qs('#projects-grid');els.meta=qs('#results-meta');
  readUrl();
  const res=await fetch(DATA_URL,{cache:'no-store'});const data=await res.json();
  renderPillars(uniq(data.map(p=>p.pillar)).sort());
  renderTags(uniq(data.flatMap(p=>p.tags)).sort());
  renderSegments();els.search.value=state.search;
  renderGrid(filterProjects(data));bindEvents(data);writeUrl(true);
}
init().catch(err=>{console.error(err);qs('#projects-grid').innerHTML='<p>Failed to load projects.</p>';});

const $ = selector => document.querySelector(selector);
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
};
const add = (parent, ...children) => { children.forEach(child => parent.append(child)); return parent; };
const read = async file => {
  const response = await fetch('./' + file);
  if (!response.ok) throw new Error(file + ': HTTP ' + response.status);
  return response.json();
};

const theme = $('#theme');
let initial = 'system';
try { initial = localStorage.getItem('mercata-theme') || 'system'; } catch {}
if (!['system','light','dark'].includes(initial)) initial = 'system';
function applyTheme(mode) {
  document.documentElement.dataset.theme = mode;
  theme.value = mode;
  try { localStorage.setItem('mercata-theme',mode); } catch {}
}
applyTheme(initial);
theme.addEventListener('change', () => applyTheme(theme.value));

function progress(value,label) {
  const outer = make('div','progress-track');
  outer.setAttribute('role','progressbar');
  outer.setAttribute('aria-label',label);
  outer.setAttribute('aria-valuemin','0');
  outer.setAttribute('aria-valuemax','100');
  outer.setAttribute('aria-valuenow',String(value));
  const inner = make('div','progress-fill');
  inner.style.width = value + '%';
  return add(outer,inner);
}
function errorFor(selector,message) {
  $(selector).replaceChildren(add(make('div','empty-state'),make('h3','', 'Unavailable'),make('p','',message)));
}
function showQueues(data,domains) {
  $('#count-queues').textContent=data.queues.length;
  const total = data.queues.reduce((n,q)=>n+q.tasks.length,0);
  $('#count-tasks').textContent=total + '+';
  const container=$('#queue-grid');
  const fragment=document.createDocumentFragment();
  for(const q of data.queues) {
    const card=make('article','queue-card');
    add(card,make('span','queue-emoji',q.emoji),make('h3','',q.title),
      make('p','',q.objective),make('small','',q.tasks.length+' QUESTIONS'));
    fragment.append(card);
  }
  container.replaceChildren(fragment);
  const note=$('.below-note');
  note.textContent=domains.domains.length+' domain-specific categories support admitted marketplaces. Social-community platforms have additional audience research workstreams.';
}
function showOntology(data) {
  const fragment=document.createDocumentFragment();
  for(const entity of data.entities) {
    const article=make('article','entity-card');
    add(article,make('h3','',entity.id.replaceAll('_',' ')),
      make('p','',entity.definition));
    fragment.append(article);
  }
  $('#ontology-grid').replaceChildren(fragment);
}
function showRoadmap(data) {
  const fragment=document.createDocumentFragment();
  for(const stage of data.milestones) {
    const card=make('article','milestone-card');
    const head=make('div','milestone-head');
    add(head,make('h3','',stage.emoji+' '+stage.name),make('strong','',stage.percent+'%'));
    add(card,head,progress(stage.percent,stage.name));
    for(const phase of stage.phases) {
      const block=make('section','phase-block');
      block.append(make('h4','phase-title',phase.emoji+' '+phase.name));
      for(const feature of phase.features) {
        block.append(make('h5','feature-title',feature.emoji+' '+feature.name));
        for(const task of feature.tasks) {
          const row=make('div','task-row');
          add(row,make('span','',task.emoji+' '+task.title),make('strong','',task.percent+'%'));
          block.append(row);
        }
      }
      card.append(block);
    }
    fragment.append(card);
  }
  $('#milestones').replaceChildren(fragment);
}
let specimens=[];
function showCatalog() {
  const query=$('#search').value.toLocaleLowerCase().trim();
  const domain=$('#domain').value;
  const matches=specimens.filter(entry=>
    (!domain || entry.domain===domain) &&
    (!query || (entry.name+' '+entry.domain).toLocaleLowerCase().includes(query)));
  const grid=$('#catalog-grid');
  const frag=document.createDocumentFragment();
  if(!matches.length) {
    const state=make('div','empty-state');
    add(state,make('div','empty-icon','◇'),make('h3','',specimens.length?'No matching marketplaces':'A clean starting point'),
      make('p','',specimens.length?'Change your search or domain filter.':'No marketplaces have been admitted. When research starts, their dossiers will appear here.'));
    frag.append(state);
  }
  for(const entry of matches) {
    const card=make('article','specimen-card');
    card.style.setProperty('--specimen',entry.color.hex);
    const header=make('div','card-top');
    const swatch=make('span','specimen-color');
    swatch.style.background=entry.color.hex;
    swatch.setAttribute('aria-label','Specimen color '+entry.color.hex);
    add(header,swatch,make('span','status',entry.status));
    const title=make('h3','',entry.name),description=make('p','',entry.domain.replaceAll('-',' '));
    const link=make('a','inline-link','View research record ↗');
    link.href='#dossier-view';
    link.addEventListener('click',event=>{event.preventDefault();showDossier(entry);});
    add(card,header,title,description,link,
      make('small','',entry.plan ? '📋 Detailed research inventory · Admitted '+entry.created_at : entry.research_profiles?.includes('social_audience') ? '👥 Audience + subcultures · Admitted '+entry.created_at : 'Admitted '+entry.created_at));
    frag.append(card);
  }
  grid.replaceChildren(frag);
  $('#catalog-count').textContent=specimens.length+' specimens';
  $('#count-specimens').textContent=specimens.length;
}


function showSocialOverview() {
  const host=$('#social-overview');
  const social=specimens.filter(s=>s.research_profiles?.includes('social_audience'));
  if(!social.length){
    host.replaceChildren(make('p','unresearched','No social or community-platform specimens have been admitted.'));
    return;
  }
  const fragment=document.createDocumentFragment();
  for(const entry of social) {
    const card=make('article','social-market-card');
    card.style.setProperty('--specimen',entry.color.hex);
    const tag=make('div','social-market-top');
    const dot=make('span','specimen-color');
    dot.style.background=entry.color.hex;
    add(tag,dot,make('span','social-domain',entry.domain.replaceAll('-',' ')));
    const heading=make('h3','',entry.name);
    const caption=make('p','', 'Population · demographics · subcultures · discovery · revenue');
    const status=make('span','social-pending','Research pending');
    const action=make('a','inline-link','Explore research queues ↗');
    action.href='#dossier-view';
    action.addEventListener('click',event=>{event.preventDefault();showDossier(entry);});
    add(card,tag,heading,caption,status,action);
    fragment.append(card);
  }
  host.replaceChildren(fragment);
}

function blockHeading(label,value) {
  const row=make('div','dossier-stat');
  add(row,make('span','',label),make('strong','',value));
  return row;
}
function detailSection(name,items,renderItem) {
  const section=make('section','dossier-section');
  add(section,make('h4','',name));
  if(!items.length) section.append(make('p','unresearched','Not researched yet.'));
  else for(const item of items) section.append(renderItem(item));
  return section;
}

function audienceSources(ids,record) {
  const container=make('div','audience-source-links');
  const sources=(record.evidence||[]);
  for(const id of ids||[]) {
    const source=sources.find(item=>item.id===id);
    if(source && typeof source.url==='string' && /^https:\/\//i.test(source.url)) {
      const anchor=make('a','','Source: '+(source.publisher||id)+' ↗');
      anchor.href=source.url;
      anchor.target='_blank';anchor.rel='noopener noreferrer';
      container.append(anchor);
    } else container.append(make('span','', 'Source: '+id));
  }
  return container;
}
function audienceEstimate(estimate,record) {
  const card=make('article','audience-measure');
  const number=estimate.value===null||estimate.value===undefined?'Unknown':new Intl.NumberFormat().format(estimate.value);
  add(card,make('span','measure-label',estimate.metric||'Estimate'),
    make('strong','measure-value',number),
    make('span','measure-unit',estimate.unit||'unit unspecified'));
  const context=[estimate.population,estimate.geography,estimate.period].filter(Boolean).join(' · ');
  if(context)card.append(make('p','measure-context',context));
  if(estimate.method)card.append(make('p','measure-method','Method: '+estimate.method));
  if(estimate.limitations)card.append(make('p','measure-limit','Limitations: '+estimate.limitations));
  card.append(audienceSources(estimate.source_ids,record));
  return card;
}
function audiencePanel(label,description) {
  const block=make('section','audience-panel');
  add(block,make('h5','',label),make('p','audience-panel-intro',description));
  return block;
}
function renderAudienceResearch(record) {
  if(!record.research_profiles?.includes('social_audience'))return null;
  const data=record.audience_research;
  const section=make('section','audience-atlas');
  add(section,make('p','eyebrow','AUDIENCE + COMMUNITY RESEARCH'),
    make('h4','audience-atlas-title','Who is here, and what do they watch?'),
    make('p','audience-atlas-description','The figures below distinguish people, accounts, creators, channels, views, advertising reach and overlapping interest groups. No number represents a complete population without the stated method and coverage.'));
  if(!data) {
    section.append(make('p','unresearched','Audience research structure is not available for this specimen.'));
    return section;
  }
  const population=audiencePanel('🌍 Platform size and reach','Counts need a defined period, geography and population.');
  if(!data.populations?.length)population.append(make('p','unresearched','No platform population measurements have been verified.'));
  else {
    const grid=make('div','audience-estimates');
    for(const estimate of data.populations)grid.append(audienceEstimate(estimate,record));
    population.append(grid);
  }
  section.append(population);

  const demographic=audiencePanel('👥 Audience demographics','Age, gender, sex, ethnicity, countries, language and other aggregate survey measures are recorded separately.');
  if(!data.demographics?.length)demographic.append(make('p','unresearched','No demographic distributions have been verified. Political affiliation and ethnicity are unknown unless supported by aggregate data.'));
  else {
    const table=make('div','demographic-table');
    for(const metric of data.demographics) {
      const row=make('div','demographic-row');
      const title=(metric.dimension||'other').replaceAll('_',' ')+' · '+metric.category;
      const value=metric.share_percent===null?'Unknown':metric.share_percent.toLocaleString()+'%';
      add(row,make('strong','',title),make('span','',value),
        make('small','',[metric.population,metric.geography,metric.period].filter(Boolean).join(' · ')));
      if(metric.share_percent!==null)row.append(progress(metric.share_percent,title));
      if(metric.limitations)row.append(make('p','measure-limit','Limitations: '+metric.limitations));
      row.append(audienceSources(metric.source_ids,record));
      table.append(row);
    }
    demographic.append(table);
  }
  section.append(demographic);

  const communities=audiencePanel('🧩 Subcultures and communities','Community figures may overlap: view counts, creators and unique viewers must not be added together.');
  if(!data.communities?.length)communities.append(make('p','unresearched','No communities have been measured yet. Beauty, feminine lifestyle, children’s animation, politics, memes and gaming are among the topics to investigate.'));
  else {
    const control=make('input','subculture-filter');
    control.type='search';control.placeholder='Filter subcultures';
    control.setAttribute('aria-label','Filter community names');
    const results=make('div','community-grid');
    const draw=()=>{
      const query=control.value.toLocaleLowerCase();
      const matches=data.communities.filter(c=>(c.label+' '+(c.aliases||[]).join(' ')).toLocaleLowerCase().includes(query));
      const cards=matches.map(c=>{
        const card=make('article','community-card');
        add(card,make('h6','',c.label),make('p','',c.definition));
        if(!c.estimates?.length)card.append(make('p','unresearched','No reliable size estimate yet.'));
        else for(const estimate of c.estimates)card.append(audienceEstimate(estimate,record));
        return card;
      });
      results.replaceChildren(...cards);
      if(!cards.length)results.append(make('p','unresearched','No communities match this filter.'));
    };
    control.addEventListener('input',draw);
    draw();communities.append(control,results);
  }
  section.append(communities);

  const overlap=audiencePanel('🔗 Community overlap','People can belong to several subcultures, so a sum of their estimated memberships is not a platform-wide total.');
  if(!data.overlaps?.length)overlap.append(make('p','unresearched','No independently supported community-overlap estimates.'));
  else for(const estimate of data.overlaps){
    const label=(estimate.community_ids||[]).join(' ∩ ');
    overlap.append(audienceEstimate({...estimate,metric:label,population:label,geography:'',limitations:estimate.limitations},record));
  }
  section.append(overlap);

  const formats=audiencePanel('🎬 Formats and creator opportunities','Watch time, format preference and commercial suitability need separate evidence.');
  if(!data.formats?.length && !data.insights?.length)formats.append(make('p','unresearched','No verified format or monetization findings yet.'));
  for(const item of data.formats||[])formats.append(audienceEstimate(item,record));
  for(const insight of data.insights||[]){
    const row=make('div','research-item');
    row.append(make('p','',insight.statement));
    if(insight.limitations)row.append(make('small','',insight.limitations));
    row.append(audienceSources(insight.source_ids,record));
    formats.append(row);
  }
  section.append(formats);
  return section;
}

function renderStudyPlan(plan) {
  const shell=make('section','study-inventory');
  shell.id='research-plan';
  add(shell,make('p','eyebrow','SPECIMEN RESEARCH PLAN'),
    make('h4','audience-atlas-title','Planned investigation'),
    make('p','audience-atlas-description',
      'Inventory ready; evidence gathering has not started. Expand a phase and its workstreams to inspect the questions and completion criteria.'));
  const summary=make('div','study-inventory-counts');
  add(summary,blockHeading('Existing tasks',plan.baseline.base_task_count),
    blockHeading('Detailed tasks',plan.detail_task_count),
    blockHeading('Total tasks',plan.total_tracked_tasks),
    blockHeading('Research progress',plan.progress_percent+'%'));
  shell.append(summary);
  shell.append(progress(plan.progress_percent,'Research completed'));
  const links=make('div','dossier-links');
  const json=make('a','inline-link','Complete machine plan ↗');
  json.href='./plans/'+plan.specimen_id+'.json';
  const readable=make('a','inline-link','Readable research inventory ↗');
  readable.href='https://github.com/sguzman/mercata/blob/main/plans/'+encodeURIComponent(plan.specimen_id)+'.md';
  readable.rel='noopener noreferrer';
  readable.target='_blank';
  add(links,json,readable);
  shell.append(links);
  for(const phase of plan.phases){
    const phasePanel=make('details','study-phase');
    const phaseCount=plan.detail_tasks.filter(t=>t.phase===phase.id).length;
    const title=make('summary','',phase.emoji+' Phase '+phase.id+': '+phase.title+' · '+phaseCount+' detailed tasks');
    phasePanel.append(title,make('p','study-phase-description',phase.exit));
    for(const queueId of phase.queue_ids){
      const work=plan.workstreams.find(w=>w.id===queueId);
      if(!work)continue;
      const groupTasks=plan.detail_tasks.filter(t=>t.queue_id===queueId);
      const group=make('details','study-workstream');
      const label=make('summary','',work.emoji+' '+work.name+' · '+groupTasks.length+' planned tasks');
      group.append(label);
      const list=make('ol','queue-task-list');
      for(const task of groupTasks){
        const row=make('li','study-task');
        add(row,make('strong','',task.title+' · '+task.percent+'%'),
          make('p','',task.objective),
          make('small','', 'Acceptance: '+task.acceptance));
        list.append(row);
      }
      group.append(list);
      phasePanel.append(group);
    }
    shell.append(phasePanel);
  }
  return shell;
}

async function showDossier(entry) {
  const host=$('#dossier-view');
  host.hidden=false;
  host.replaceChildren(make('p','unresearched','Loading research record…'));
  host.scrollIntoView({behavior:'smooth',block:'start'});
  try {
    const [record,work,studyPlan]=await Promise.all([read(entry.dossier),read(entry.queue),entry.plan?read(entry.plan):Promise.resolve(null)]);
    if(record.id!==entry.id || work.specimen_id!==entry.id) throw Error('Index and dossier disagree.');
    const outer=make('article','dossier-shell');
    outer.style.setProperty('--specimen',entry.color.hex);
    const top=make('div','dossier-head');
    const heading=make('div','');
    add(heading,make('p','eyebrow',entry.domain.replaceAll('-',' ')+' / '+record.status),
      make('h3','',record.name));
    const close=make('button','dossier-close','Close ×');
    close.type='button';
    close.addEventListener('click',()=>{host.hidden=true;host.replaceChildren();});
    add(top,heading,close);
    outer.append(top);
    const official=make('a','inline-link','Official website ↗');
    official.href=record.official_url;
    official.target='_blank';
    official.rel='noopener noreferrer';
    const dossierJson=make('a','inline-link','Dossier JSON ↗');
    dossierJson.href='./'+entry.dossier;
    const queueJson=make('a','inline-link','Task JSON ↗');
    queueJson.href='./'+entry.queue;
    add(outer,add(make('div','dossier-links'),official,dossierJson,queueJson));
    const tasks=work.queues.flatMap(q=>q.tasks);
    const done=tasks.filter(t=>t.status==='complete'&&t.progress===100).length;
    const stats=make('div','dossier-stats');
    add(stats,blockHeading('Research tasks',studyPlan?studyPlan.total_tracked_tasks:tasks.length),blockHeading('Verified tasks',done),
      blockHeading('Sources',record.evidence.length),blockHeading('Claims',record.claims.length));
    outer.append(stats);
    const intro=make('p','dossier-intro',record.summary||'This marketplace has been admitted for research. No earnings claims, fees or market estimates have been verified yet.');
    outer.append(intro);
    const evidenceArea=make('div','dossier-evidence');
    evidenceArea.append(detailSection('Published observations',record.observations,observation=>{
      const card=make('div','research-item');
      add(card,make('strong','',observation.metric||observation.id),
        make('p','',observation.value===null?'Unknown':String(observation.value)+' '+(observation.unit||'')),
        make('small','',observation.period||'Period not supplied'));
      return card;
    }));
    evidenceArea.append(detailSection('Claims and sources',record.claims,claim=>{
      const card=make('div','research-item');
      add(card,make('strong','',claim.text),make('small','',claim.source_ids.join(', ')));
      return card;
    }));
    evidenceArea.append(detailSection('Revenue opportunities',record.opportunities,opportunity=>{
      return add(make('div','research-item'),make('p','',opportunity.title||opportunity.id||'Opportunity'));
    }));
    evidenceArea.append(detailSection('Risks',record.risks,risk=>{
      return add(make('div','research-item'),make('p','',risk.title||risk.id||'Risk'));
    }));
    outer.append(evidenceArea);
    const audience=renderAudienceResearch(record);
    if(audience)outer.append(audience);
    if(studyPlan)outer.append(renderStudyPlan(studyPlan));
    outer.append(make('h4','dossier-queues-title','Research queues'));
    const queueList=make('div','dossier-queues');
    for(const group of work.queues){
      const panel=make('details','queue-details');
      const completed=group.tasks.filter(t=>t.status==='complete'&&t.progress===100).length;
      const pct=Math.round(group.tasks.reduce((n,t)=>n+t.progress,0)/group.tasks.length);
      const summary=make('summary','',group.emoji+' '+group.title+' — '+pct+'% ('+completed+'/'+group.tasks.length+' verified)');
      panel.append(summary,progress(pct,group.title));
      const list=make('ol','queue-task-list');
      for(const task of group.tasks){
        const item=make('li','');
        add(item,make('strong','',task.emoji+' '+task.title+' · '+task.progress+'%'),
          make('p','',task.acceptance));
        list.append(item);
      }
      panel.append(list);
      queueList.append(panel);
    }
    outer.append(queueList);
    host.replaceChildren(outer);
  } catch(error) {
    host.replaceChildren(add(make('div','empty-state'),make('h3','', 'Research record unavailable'),
      make('p','', 'The dossier or task queue could not be loaded. Check the public files.')));
  }
}

async function start() {
  const outcomes=await Promise.allSettled([
    read('gallery/index.json'),read('pipeline/queues.json'),
    read('pipeline/domains.json'),read('ontology/ontology.json'),
    read('roadmap/progress.json')
  ]);
  if(outcomes[0].status==='fulfilled') {
    specimens=outcomes[0].value.specimens;
    const domains=[...new Set(specimens.map(s=>s.domain))].sort();
    for(const domain of domains) {
      const opt=make('option','',domain.replaceAll('-',' ')); opt.value=domain;
      $('#domain').append(opt);
    }
    showCatalog();
    showSocialOverview();
  } else errorFor('#catalog-grid','The public gallery index could not be read.');
  if(outcomes[1].status==='fulfilled' && outcomes[2].status==='fulfilled') showQueues(outcomes[1].value,outcomes[2].value);
  else errorFor('#queue-grid','The research definitions could not be read.');
  if(outcomes[3].status==='fulfilled') showOntology(outcomes[3].value);
  else errorFor('#ontology-grid','The ontology could not be read.');
  if(outcomes[4].status==='fulfilled') showRoadmap(outcomes[4].value);
  else errorFor('#milestones','The progress ledger could not be read.');
}
$('#search').addEventListener('input',showCatalog);
$('#domain').addEventListener('change',showCatalog);
start();

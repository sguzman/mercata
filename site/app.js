import {evaluateIncomeScenario} from './scenario.mjs';
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
    const status=make('span','social-pending',entry.status==='researching'?'Research underway':'Research pending');
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
      const value=metric.share_percent===null?'Unknown':metric.share_percent.toLocaleString()+'%'+(metric.measurement_kind==='within_group_ever_use_rate'?' of this group use YouTube':metric.measurement_kind==='audience_composition_share'?' of the audience':'');
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
      plan.status==='researching'?'Research underway. These task percentages reflect partial source-backed work; missing population and income statistics remain unresolved.':'Inventory ready; evidence gathering has not started. Expand a phase and its workstreams to inspect the questions and completion criteria.'));
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


function renderPlatformPolicies(policy, record) {
  if(!policy)return null;
  const section=make('section','platform-policy');
  add(section,make('p','eyebrow','VERIFIED PLATFORM TERMS'),
    make('h4','audience-atlas-title','Eligibility and creator payments'),
    make('p','audience-atlas-description','These are published conditions and percentages, not estimated earnings. They have different revenue bases and may vary by country, feature and application review.'));
  const grid=make('div','platform-policy-grid');
  for(const item of policy.items) {
    const card=make('article','policy-card');
    card.append(make('h5','',item.title));
    const pct=item.result?.creator_share_percent;
    if(pct!==undefined)card.append(make('strong','policy-number',pct+'%'));
    if(item.result?.base)card.append(make('p','policy-basis','Base: '+item.result.base.replaceAll('_',' ')));
    if(item.kind==='eligibility') {
      const list=make('ul','policy-conditions');
      for(const condition of item.conditions) {
        const row=make('li','',
          condition.minimum.toLocaleString()+' '+condition.metric.replaceAll('_',' ')+(condition.window?' within '+condition.window:''));
        list.append(row);
      }
      card.append(list);
    }
    if(item.kind==='feature_rule'){
      const enabled=item.result?.enabled;
      card.append(make('p','policy-basis',item.result?.feature.replaceAll('_',' ')+': '+(enabled?'available':'restricted')));
    }
    card.append(make('p','measure-limit',item.limitations));
    card.append(audienceSources(item.source_ids,record));
    grid.append(card);
  }
  section.append(grid);
  return section;
}

function renderTopicCatalogue(data, activity) {
  if(!data)return null;
  const section=make('section','topic-catalogue');
  section.append(make('h4','audience-atlas-title','Content communities to study'));
  section.append(make('p','audience-atlas-description','These are research categories, not measured populations. Audiences overlap, and topic sizes are currently unknown.'));
  const grid=make('div','topic-catalogue-grid');
  for(const topic of data.topics){
    const card=make('article','topic-catalogue-card');
    add(card,make('h5','',topic.label),make('p','',topic.definition),
      make('small','', 'Audience size: unknown · Creators: unknown'));
    const observations=(activity?.observations||[]).filter(x=>x.topic_id===topic.id);
    if(observations.length) {
      const section=make('details','topic-activity');
      section.append(make('summary','',observations.length+' sourced activity measurements'));
      for(const item of observations) {
        const row=make('div','topic-activity-row');
        const amount=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(item.value);
        const value=(item.comparison==='>'?'More than ':'')+amount+' '+item.unit;
        add(row,make('strong','',value),make('p','',item.population),
          make('small','',item.geography+' · '+item.period));
        if(typeof item.source_url==='string' && item.source_url.startsWith('https://')) {
          const link=make('a','inline-link','Original source ↗');
          link.href=item.source_url;link.rel='noopener noreferrer';link.target='_blank';
          row.append(link);
        }
        section.append(row);
      }
      card.append(section);
    }
    if(topic.research_subtopics?.length) {
      const details=make('details','topic-subtopics');
      details.append(make('summary','',topic.research_subtopics.length+' research subtopics'));
      const list=make('ul','');
      for(const name of topic.research_subtopics)list.append(make('li','',name));
      details.append(list);
      card.append(details);
    }
    grid.append(card);
  }
  section.append(grid);
  return section;
}

function renderAdultUseHistory(history) {
  if(!history)return null;
  const section=make('section','usage-history');
  add(section,make('p','eyebrow','DATED SURVEY SERIES'),
    make('h4','audience-atlas-title','U.S. adults who have used YouTube'),
    make('p','audience-atlas-description',
      'The share of U.S. adults reporting that they have ever used YouTube. This is not monthly active use or the demographic makeup of YouTube viewers.'));
  const chart=make('div','usage-history-chart');
  chart.setAttribute('role','list');
  for(const point of history.points){
    const column=make('div','usage-history-point');
    column.setAttribute('role','listitem');
    column.setAttribute('aria-label',point.year+': '+point.percent+' percent. Survey by '+point.mode);
    const area=make('div','usage-history-area');
    const bar=make('div','usage-history-bar');
    bar.style.height=point.percent+'%';
    area.append(bar);
    add(column,make('strong','usage-history-value',point.percent+'%'),area,
      make('small','usage-history-year',point.year),
      make('small','usage-history-mode',point.mode));
    chart.append(column);
  }
  section.append(chart);
  section.append(make('p','measure-limit',
    'Pew changed survey modes in 2023 and again in 2024. Differences across those breaks cannot be attributed entirely to changes in YouTube use.'));
  const link=make('a','inline-link','Read Pew’s source series ↗');
  link.href=history.source;link.rel='noopener noreferrer';link.target='_blank';
  section.append(link);
  return section;
}

function renderSmallChannelStudy(data) {
  if(!data?.cohort || !data?.monthly?.values)return null;
  const section=make('section','small-channel-income');
  add(section,make('p','eyebrow','SELECTED SMALL-CHANNEL STUDY'),
    make('h4','audience-atlas-title','Earnings after monetization'),
    make('p','audience-atlas-description',
      'AIR Media-Tech reviewed Studio reports for 297 already-monetized channels under 10,000 subscribers. These are sample medians, not forecasts for all channels.'));
  const table=(headers,rows)=>{
    const wrap=make('div','income-table-wrap');
    const t=make('table','income-table');
    const head=make('thead',''),hrow=make('tr','');
    for(const label of headers)hrow.append(make('th','',label));
    head.append(hrow);t.append(head);
    const body=make('tbody','');
    for(const values of rows) {
      const row=make('tr','');
      for(const cell of values)row.append(make('td','',cell));
      body.append(row);
    }
    t.append(body);wrap.append(t);
    return wrap;
  };
  section.append(make('h5','income-table-heading','The first six months'));
  const months=data.monthly.values.map(x=>[
    'Month '+x.month+(x.partial?' (partial)':''),
    'USD '+x.median,'USD '+x.q25+'–'+x.q75,
    x.median_views.toLocaleString()+' views',
    'USD '+x.revenue_per_1000_views.toFixed(2)
  ]);
  section.append(table(['Month','Median','Middle half','Views (median)','Reported rate / 1k views'],months));
  const sets=[
    ['By leading viewer country',data.by_top_audience_country.values,'country'],
    ['By content niche',data.by_niche.values,'niche']
  ];
  for(const [label,rows,field] of sets){
    const details=make('details','income-details');
    details.append(make('summary','',label+' · '+rows.length+' groups'));
    const values=rows.map(x=>[
      x[field],String(x.channels),'USD '+x.median_usd,
      'USD '+x.revenue_per_1000_views.toFixed(2)
    ]);
    details.append(table([field==='country'?'Top audience country':'Niche','Channels','Median/month','Rate / 1k views'],values));
    section.append(details);
  }
  section.append(make('p','measure-limit',
    'The cohort excludes channels that did not qualify for monetization. Sample recruitment is not fully disclosed, group sizes are sometimes small, and earnings do not subtract production costs. Viewer country is not the same as channel account location.'));
  const link=make('a','inline-link','Read the provider’s original analysis ↗');
  link.href=data.source.url;link.target='_blank';link.rel='noopener noreferrer';
  section.append(link);
  return section;
}

function renderCreatorIncomeEvidence(report) {
  if(!report?.datasets?.length)return null;
  const section=make('section','income-evidence');
  section.append(make('p','eyebrow','EARNINGS STUDY — LIMITED POPULATION'));
  section.append(make('h4','audience-atlas-title','Patreon income linked to YouTube'));
  section.append(make('p','audience-atlas-description','Selected off-platform Patreon earnings; not typical YouTube creator income or profit.'));
  for(const item of report.datasets) {
    const info=make('article','income-study');
    info.append(make('p','measure-context','March '+item.years.join(', ')+' · '+item.observations.toLocaleString()+' observations'));
    const stats=make('div','dossier-stats');
    add(stats,blockHeading('Monthly median','USD '+item.summary_statistics.median),
      blockHeading('Monthly mean','USD '+item.summary_statistics.mean),
      blockHeading('25th percentile','USD '+item.summary_statistics.q25),
      blockHeading('75th percentile','USD '+item.summary_statistics.q75));
    info.append(stats);
    info.append(make('p','measure-limit','Only Patreon earners above USD 10 with YouTube as their sole social-platform affiliation; excludes native YouTube advertising, sponsors, non-earners and production costs. Some missing values were imputed.'));
    const source=make('a','inline-link','Original academic study ↗');
    source.href=item.url;source.target='_blank';source.rel='noopener noreferrer';
    info.append(source);
    section.append(info);
  }
  return section;
}

function renderRevenuePathways(data, payments, dossier, eligibility) {
  if(!data)return null;
  const section=make('section','revenue-pathways');
  add(section,make('p','eyebrow','WAYS TO EARN'),
    make('h4','audience-atlas-title','How creators can earn'),
    make('p','audience-atlas-description','YouTube has different payment products, shopping tools and routes to outside buyers. The presence of a route is not evidence of average earnings or eligibility for every creator.'));
  const kinds=[
    {id:'native',label:'YouTube advertising, Premium and fan support',filter:p=>p.kind.startsWith('native_')},
    {id:'commerce',label:'Shopping and brand collaborations',filter:p=>p.kind.startsWith('commerce_')||p.kind==='deal_facilitation'},
    {id:'outside',label:'Outside payments and owned work',filter:p=>p.kind.startsWith('external_')}
  ];
  for(const category of kinds){
    const items=data.pathways.filter(category.filter);
    if(!items.length)continue;
    const group=make('details','revenue-pathway-group');
    group.open=category.id==='native';
    group.append(make('summary','',category.label+' ('+items.length+')'));
    const grid=make('div','revenue-pathway-grid');
    for(const item of items){
      const box=make('article','revenue-pathway-card');
      box.append(make('h5','',item.name));
      box.append(make('p','',item.mechanism));
      box.append(make('p','measure-context','Payer: '+item.payer+' · Basis: '+item.revenue_basis));
      box.append(make('p','measure-limit','Eligibility: '+item.eligibility_description));
      const gate=eligibility?.records?.find(x=>x.pathway_id===item.id);
      if(gate){
        const rule=make('details','earning-gate-details');
        rule.append(make('summary','','Feature requirements · '+gate.gates.length+' checks'));
        const list=make('ul','earning-gate-list');
        for(const check of gate.gates)list.append(make('li','',check));
        rule.append(list);
        box.append(rule);
      }
      box.append(audienceSources(item.source_ids,dossier));
      grid.append(box);
    }
    group.append(grid);
    section.append(group);
  }
  if(payments){
    const thresholds=make('div','payout-summary');
    thresholds.append(make('h5','', 'AdSense payout thresholds by account currency'));
    const grid=make('div','payout-currency-grid');
    for(const item of payments.currencies){
      const box=make('article','payout-currency');
      add(box,make('strong','',item.currency+' '+item.minimum_payout.toLocaleString()),
        make('p','', 'Minimum payment balance for '+item.currency+' accounts'),
        make('small','', 'Payment method can be selected at '+item.currency+' '+item.method_selection_threshold));
      grid.append(box);
    }
    thresholds.append(grid);
    if(payments.payment_cycle?.stages?.length) {
      const stages=make('details','payout-cycle-details');
      stages.append(make('summary','','When an eligible balance is paid'));
      const list=make('ol','payout-cycle-steps');
      for(const item of payments.payment_cycle.stages){
        const row=make('li','');
        row.append(make('strong','',item.label));
        row.append(make('p','',item.meaning));
        row.append(make('small','',item.limitation));
        list.append(row);
      }
      stages.append(list);
      thresholds.append(stages);
    }

    thresholds.append(make('p','measure-limit','These amounts depend on the payment account currency, not the country where a video is watched. Mexico-based payout-method and program availability are documented separately.'));
    const link=make('a','inline-link','Read payout and regional eligibility rules ↗');
    link.href='./ontology/youtube/payment-gates.md';link.target='_blank';link.rel='noopener noreferrer';
    thresholds.append(link);
    section.append(thresholds);
  }
  return section;
}

function renderOpportunityFramework(model, taxonomy, activity) {
  if(!model)return null;
  const container=make('section','opportunity-framework');
  const details=make('details','opportunity-method-details');
  details.append(make('summary','','How to compare niches · '+model.criteria.length+' research dimensions'));
  details.append(make('p','measure-limit','The '+model.topic_assessments.length+' topics are not ranked. Views, creator income, production time and audience size cannot be substituted for one another.'));
  if(taxonomy?.topics?.length && model.topic_assessments.length){
    const picker=make('div','niche-explorer');
    const field=make('label','niche-explorer-label');
    field.append(make('span','','Inspect a content community'));
    const select=make('select','niche-explorer-select');
    select.setAttribute('aria-label','Select a YouTube content community to inspect');
    for(const topic of [...taxonomy.topics].sort((a,b)=>a.label.localeCompare(b.label))){
      const option=make('option','',topic.label);
      option.value=topic.id;select.append(option);
    }
    field.append(select);picker.append(field);
    const report=make('article','niche-explorer-report');
    report.setAttribute('aria-live','polite');
    const draw=()=>{
      const topic=taxonomy.topics.find(x=>x.id===select.value);
      const record=model.topic_assessments.find(x=>x.topic_id===select.value);
      if(!topic || !record)return;
      report.replaceChildren(make('h5','',topic.label),make('p','',topic.definition));
      const scoped=(activity?.observations||[]).filter(x=>x.topic_id===topic.id);
      report.append(make('p','measure-limit',
        'Opportunity: '+(record.decision==='insufficient_evidence'?'not yet rankable':record.decision)+
        ' · Unique audience: unknown · Typical creator profit: unknown.'));
      report.append(make('p','',scoped.length+
        ' sourced activity observation'+(scoped.length===1?'':'s')+
        '. These are not unique viewers or comparable earning rates.'));
      const gaps=make('details','niche-gaps');
      gaps.append(make('summary','',record.data_gaps.length+' evidence gaps to resolve'));
      const ul=make('ul','');
      for(const gap of record.data_gaps){
        const criterion=model.criteria.find(x=>x.id===gap);
        ul.append(make('li','',criterion?.label||gap));
      }
      gaps.append(ul);report.append(gaps);
      for(const x of scoped.slice(0,6)){
        const p=make('p','niche-evidence-row',
          x.period+' · '+x.geography+' · '+
          (x.comparison==='>'?'More than ':'')+
          new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(x.value)+' '+x.unit);
        const a=make('a','inline-link','Source ↗');
        a.href=x.source_url;a.target='_blank';a.rel='noopener noreferrer';p.append(a);
        report.append(p);
      }
    };
    select.addEventListener('change',draw);
    const first=taxonomy.topics.some(t=>t.id==='gaming')?'gaming':taxonomy.topics[0].id;
    select.value=first;
    draw();
    picker.append(report);details.append(picker);
  }
  const grid=make('div','opportunity-method-grid');
  for(const criterion of model.criteria){
    const card=make('article','opportunity-method-item');
    card.append(make('h5','',criterion.label));
    card.append(make('p','',criterion.definition));
    card.append(make('small','', 'Research status: '+criterion.confidence));
    grid.append(card);
  }
  details.append(grid);
  const link=make('a','inline-link','Read the full comparison method ↗');
  link.href='./ontology/youtube/opportunity-framework.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  container.append(details);
  return container;
}

function renderScenarioCalculator() {
  const section=make('section','scenario-tool');
  const details=make('details','scenario-details');
  details.append(make('summary','','Estimate cash return from your own assumptions'));
  details.append(make('p','measure-limit','This is not an income forecast. No rates or earnings are prefilled. Enter zero explicitly for any stream that does not apply, and keep all money in one currency.'));
  const form=make('form','scenario-form');
  const specs=[
    ['currency','Currency code (ISO)','text','e.g. USD or MXN'],
    ['watch_views','Watch-page video views','number','Whole number'],
    ['watch_ad_only_rpm','Watch ad-only yield per 1,000 views','number','After revenue sharing'],
    ['shorts_engaged_views','Shorts engaged views','number','Whole number'],
    ['shorts_ad_only_rpm','Shorts ad-only yield per 1,000 engaged views','number','After allocation'],
    ['net_other_receipts','Other net creator receipts','number','After provider deductions'],
    ['cash_costs','Total attributable cash costs','number','Do not double-count fees'],
    ['labor_hours','Total work hours','number','Production, promotion and administration']
  ];
  const inputs={};
  for(const [id,title,type,hint] of specs){
    const field=make('label','scenario-field');
    field.append(make('span','',title));
    const input=make('input','scenario-input');
    input.type=type;input.name=id;input.placeholder=hint;input.autocomplete='off';
    if(type==='number'){input.min='0';input.step=id.includes('views')?'1':'any';}
    if(id==='currency'){input.maxLength=3;input.autocapitalize='characters';}
    field.append(input);form.append(field);inputs[id]=input;
  }
  const result=make('div','scenario-result');
  result.setAttribute('aria-live','polite');
  const message=make('p','measure-limit','Enter all fields before results appear.');
  result.append(message);
  const clear=make('button','scenario-clear','Clear inputs');
  clear.type='reset';
  form.append(clear);
  const update=()=>{
    const values={currency:inputs.currency.value.trim().toUpperCase()};
    for(const id of Object.keys(inputs)){
      if(id==='currency')continue;
      values[id]=inputs[id].value.trim()===''?null:Number(inputs[id].value);
    }
    try{
      const modeled=evaluateIncomeScenario(values);
      const format=new Intl.NumberFormat('en',{style:'currency',currency:modeled.currency,maximumFractionDigits:2});
      result.replaceChildren(make('p','scenario-disclaimer','Hypothetical arithmetic only — not observed revenue or a prediction.'));
      const stats=make('div','scenario-stats');
      add(stats,
        blockHeading('Ad-only receipts',format.format(modeled.watch_ad_receipts+modeled.shorts_ad_receipts)),
        blockHeading('All creator receipts',format.format(modeled.net_receipts)),
        blockHeading('Cash profit before tax',format.format(modeled.cash_profit_before_tax)),
        blockHeading('Cash profit per hour',format.format(modeled.cash_profit_per_hour)));
      result.append(stats);
    }catch{
      result.replaceChildren(make('p','measure-limit','Enter a three-letter currency and all seven nonnegative numbers. Use 0 explicitly when a stream does not apply; work hours must be greater than 0.'));
    }
  };
  form.addEventListener('input',update);
  form.addEventListener('reset',()=>{result.replaceChildren(make('p','measure-limit','Enter all fields before results appear.'));});
  details.append(form,result);
  const method=make('a','inline-link','Read calculation definitions and limits ↗');
  method.href='./ontology/youtube/scenario-method.md';method.target='_blank';method.rel='noopener noreferrer';
  details.append(method);
  section.append(details);
  return section;
}

function renderContentRestrictions(data,dossier) {
  if(!data)return null;
  const section=make('section','content-restrictions');
  const details=make('details','content-restrictions-details');
  details.append(make('summary','','Content and monetization restrictions · '+data.policy_dimensions.length+' policy questions'));
  details.append(make('p','measure-limit','Animation suitable for families is not automatically made for kids. Ad suitability, child-directed rules, authenticity and copyright are separate assessments; these rules do not establish a niche revenue rate.'));
  const classes=make('div','content-classification-grid');
  for(const classification of data.classifications){
    const card=make('article','content-classification');
    card.append(make('h5','',classification.label));
    card.append(make('p','',classification.definition));
    card.append(make('small','',classification.impacts));
    classes.append(card);
  }
  details.append(classes);
  const table=make('div','content-policy-grid');
  for(const item of data.policy_dimensions){
    const card=make('article','content-policy-item');
    card.append(make('h5','',item.id.replaceAll('_',' ')));
    card.append(make('p','',item.economic_relevance));
    card.append(make('small','', 'Scope: '+item.scope.replaceAll('_',' ')));
    card.append(audienceSources(item.source_ids,dossier));
    table.append(card);
  }
  details.append(table);
  const link=make('a','inline-link','Read the content-policy research ↗');
  link.href='./ontology/youtube/content-policy-risk.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderMeasurementGuide(guide) {
  if(!guide)return null;
  const section=make('section','analytics-guide');
  const details=make('details','analytics-guide-details');
  details.append(make('summary','',guide.field_semantics.length+' YouTube Analytics measures explained'));
  details.append(make('p','measure-limit','These are authorized channel-report fields, not a public list of every channel’s earnings. Advertising impressions, views, gross CPM and net creator revenue have different numerators and denominators.'));
  const rows=make('div','analytics-metric-grid');
  const fields=['estimatedRevenue','estimatedAdRevenue','estimatedRedPartnerRevenue','grossRevenue','cpm','playbackBasedCpm','monetizedPlaybacks','adImpressions','views','engagedViews','estimatedMinutesWatched'];
  for(const id of fields){
    const metric=guide.field_semantics.find(m=>m.id===id);
    if(!metric)continue;
    const card=make('article','analytics-metric-item');
    card.append(make('h5','',metric.label));
    card.append(make('p','',metric.definition));
    card.append(make('small','', 'Unit: '+metric.unit));
    card.append(make('p','measure-limit',metric.limitations));
    rows.append(card);
  }
  details.append(rows);
  const link=make('a','inline-link','Read all measures, demographic dimensions, and report restrictions ↗');
  link.href='./ontology/youtube/analytics-query-guide.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderPlatformScale(data) {
  if(!data)return null;
  const section=make('section','scale-section');
  const details=make('details','scale-details');
  details.append(make('summary','','Worldwide reach, video supply and Shorts activity'));
  details.append(make('p','measure-limit','Survey percentages, upload events and Shorts views count different things. None is a verified number of unique YouTube users.'));
  const grid=make('div','scale-observation-grid');
  for(const item of data.observations){
    const card=make('article','scale-observation');
    const number=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(item.value);
    card.append(make('strong','scale-value',(item.comparison==='>'?'Over ':'')+number+(item.unit.includes('percent')?'%':'')));
    card.append(make('h5','',item.metric));
    card.append(make('p','',item.population));
    card.append(make('small','',item.period));
    card.append(make('p','measure-limit',item.limitations));
    grid.append(card);
  }
  details.append(grid);
  const source=make('a','inline-link','Read methods and original sources ↗');
  source.href='./ontology/youtube/platform-scale.md';source.target='_blank';source.rel='noopener noreferrer';
  details.append(source);
  section.append(details);
  return section;
}

function renderApplicationLifecycle(model) {
  if(!model)return null;
  const section=make('section','application-lifecycle');
  const details=make('details','application-details');
  details.append(make('summary','','Getting approved and reaching your first payout'));
  details.append(make('p','measure-limit','Numerical entry thresholds, channel review, product activation and actual payment are separate. These timelines are official guidance, not guarantees.'));
  const list=make('ol','application-stage-list');
  for(const step of model.steps){
    const item=make('li','application-stage');
    item.append(make('strong','',step.action));
    item.append(make('p','measure-limit',step.limits));
    if(step.indicative_duration)item.append(make('small','',step.indicative_duration));
    if(step.window_days)item.append(make('small','', 'Published appeal window: '+step.window_days+' days'));
    if(step.earliest_reapply_after_days)item.append(make('small','', 'Reapplication wait: '+step.earliest_reapply_after_days+' days'));
    list.append(item);
  }
  details.append(list);
  const link=make('a','inline-link','Read the full application and payment lifecycle ↗');
  link.href='./ontology/youtube/application-lifecycle.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderCreatorGrowth(data,dossier) {
  if(!data)return null;
  const section=make('section','creator-growth');
  const details=make('details','creator-growth-details');
  details.append(make('summary','','Audience discovery and returning viewers · '+data.stages.length+' stages'));
  details.append(make('p','measure-limit','Views, eligible impressions, engaged views, unique channel viewers, subscribers and paying customers are different measurements. No conversion rate is assumed.'));
  const list=make('ol','creator-growth-stages');
  for(const stage of data.stages){
    const item=make('li','creator-growth-stage');
    item.append(make('h5','',stage.label),make('p','',stage.description),
      make('small','',stage.caveat));
    item.append(audienceSources(stage.source_ids,dossier));
    list.append(item);
  }
  details.append(list);
  const more=make('details','creator-growth-metrics');
  more.append(make('summary','',data.metrics.length+' metric definitions and measurement limits'));
  const table=make('div','creator-growth-metric-grid');
  for(const metric of data.metrics){
    const card=make('article','creator-growth-metric');
    card.append(make('h5','',metric.id.replaceAll('_',' ')));
    card.append(make('p','',metric.definition));
    card.append(make('small','',metric.unit+' · '+metric.access));
    card.append(make('p','measure-limit',metric.limitations));
    table.append(card);
  }
  more.append(table);
  details.append(more);
  const link=make('a','inline-link','Read the measurement and discovery research ↗');
  link.href='./ontology/youtube/creator-growth.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderContentFormats(data,dossier) {
  if(!data)return null;
  const section=make('section','content-format-section');
  const details=make('details','content-format-details');
  details.append(make('summary','','Compare '+data.formats.length+' ways to publish and distribute'));
  details.append(make('p','measure-limit','Different publication formats have different discovery, link and eligibility rules. None has a verified typical profit or success rate.'));
  const grid=make('div','content-formats-grid');
  for(const format of data.formats){
    const card=make('article','content-format-card');
    card.append(make('h5','',format.label));
    card.append(make('p','',format.format_rule));
    card.append(make('small','', 'Access: '+format.entry_gate));
    const inner=make('details','content-format-inner');
    inner.append(make('summary','','Discovery and earning details'));
    inner.append(make('p','', 'Discovery: '+format.discovery.join(', ')));
    inner.append(make('p','', 'Possible revenue routes: '+format.money.join(', ').replaceAll('_',' ')));
    inner.append(make('p','', 'Links: '+format.links.join('; ')));
    inner.append(make('p','measure-limit',format.cautions.join(' ')));
    inner.append(audienceSources(format.source_ids,dossier));
    card.append(inner);
    grid.append(card);
  }
  details.append(grid);
  const link=make('a','inline-link','Read the format and link comparison ↗');
  link.href='./ontology/youtube/content-formats.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderCommunityAudienceStudy(data,dossier) {
  if(!data)return null;
  const section=make('section','community-survey');
  const details=make('details','community-survey-details');
  details.append(make('summary','','Measured audience: U.S. YouTube news consumption'));
  details.append(make('p','measure-limit','This survey describes U.S. adults who regularly get news on YouTube. It is not a count of political-video viewers, all YouTube users or a prediction of ad revenue.'));
  const latest=data.trends.at(-1);
  const summary=make('div','community-survey-numbers');
  add(summary,
    blockHeading('U.S. adults',latest.all_adults_percent+'%'),
    blockHeading('U.S. YouTube users',latest.youtube_users_percent+'%'));
  details.append(summary);
  details.append(make('p','measure-context','2026 Pew survey · '+data.methodology.survey_2026));
  const trends=make('details','community-survey-trends');
  trends.append(make('summary','','Annual news-use survey rates, 2020–2026'));
  const list=make('div','community-survey-grid');
  for(const point of data.trends){
    const card=make('article','community-survey-year');
    add(card,make('strong','',point.year),
      make('p','',point.all_adults_percent+'% of U.S. adults'),
      make('p','',point.youtube_users_percent+'% of U.S. YouTube users'));
    list.append(card);
  }
  trends.append(list);
  details.append(trends);
  const profile=make('details','community-survey-profile');
  profile.append(make('summary','','Who regularly got YouTube news in 2025'));
  profile.append(make('p','measure-limit','Each share below describes the makeup of regular YouTube news consumers, not the chance that someone in a demographic group uses the platform. Shares do not necessarily sum to 100%.'));
  const cards=make('div','community-survey-grid');
  for(const x of data.demographic_composition){
    const card=make('article','community-profile-card');
    add(card,make('h5','',x.category),make('strong','',x.share_percent+'%'),
      make('small','',x.dimension.replaceAll('_',' ')+' · 2025 survey'));
    cards.append(card);
  }
  profile.append(cards);
  details.append(profile);
  details.append(make('p','measure-limit','Political affiliation here is voluntary, aggregate survey reporting. No individual political beliefs or viewing histories are collected or inferred.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Full survey definitions and caveats ↗');
  link.href='./ontology/youtube/community-audience-studies.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

async function showDossier(entry) {
  const host=$('#dossier-view');
  host.hidden=false;
  host.replaceChildren(make('p','unresearched','Loading research record…'));
  host.scrollIntoView({behavior:'smooth',block:'start'});
  try {
    const [record,work,studyPlan,platformPolicy,topicCatalog,topicActivity,adultUseHistory,incomeEvidence,channelIncome,earningRoutes,payoutGates,opportunityFramework,contentRestrictions,analyticsGuide,platformScale,eligibilityMatrix,applicationLifecycle,creatorGrowth,contentFormats,newsAudienceStudy]=await Promise.all([read(entry.dossier),read(entry.queue),entry.plan?read(entry.plan):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/policies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/taxonomy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/topic-observations.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-adult-usage-history.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-income-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/small-channel-income.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/revenue-pathways.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/payment-gates.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/opportunity-framework.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-policy-risk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/analytics-query-guide.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/platform-scale.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/eligibility-matrix.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/application-lifecycle.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-growth.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-formats.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/community-audience-studies.json'):Promise.resolve(null)]);
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
    const intro=make('p','dossier-intro',record.summary||'This marketplace has not been researched yet.');
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
      add(card,make('strong','',claim.text),make('small','','Checked '+claim.observed_at+' · '+claim.confidence+' confidence'));
      if(claim.limitations)card.append(make('p','measure-limit','Limits: '+claim.limitations));
      card.append(audienceSources(claim.source_ids,record));
      return card;
    }));
    evidenceArea.append(detailSection('Revenue opportunities',record.opportunities,opportunity=>{
      return add(make('div','research-item'),make('p','',opportunity.title||opportunity.id||'Opportunity'));
    }));
    evidenceArea.append(detailSection('Risks',record.risks,risk=>{
      return add(make('div','research-item'),make('p','',risk.title||risk.id||'Risk'));
    }));
    outer.append(evidenceArea);
    const policySection=renderPlatformPolicies(platformPolicy,record);
    if(policySection)outer.append(policySection);
    const routes=renderRevenuePathways(earningRoutes,payoutGates,record,eligibilityMatrix);
    if(routes)outer.append(routes);
    const onboarding=renderApplicationLifecycle(applicationLifecycle);
    if(onboarding)outer.append(onboarding);
    const restricted=renderContentRestrictions(contentRestrictions,record);
    if(restricted)outer.append(restricted);
    const metricsGuide=renderMeasurementGuide(analyticsGuide);
    if(metricsGuide)outer.append(metricsGuide);
    const scale=renderPlatformScale(platformScale);
    if(scale)outer.append(scale);
    const discoveryModel=renderCreatorGrowth(creatorGrowth,record);
    if(discoveryModel)outer.append(discoveryModel);
    const formats=renderContentFormats(contentFormats,record);
    if(formats)outer.append(formats);
    const audience=renderAudienceResearch(record);
    if(audience)outer.append(audience);
    const history=renderAdultUseHistory(adultUseHistory);
    if(history)outer.append(history);
    const newsStudy=renderCommunityAudienceStudy(newsAudienceStudy,record);
    if(newsStudy)outer.append(newsStudy);
    const incomeStudy=renderCreatorIncomeEvidence(incomeEvidence);
    if(incomeStudy)outer.append(incomeStudy);
    const channelStudy=renderSmallChannelStudy(channelIncome);
    if(channelStudy)outer.append(channelStudy);
    const catalogue=renderTopicCatalogue(topicCatalog,topicActivity);
    if(catalogue)outer.append(catalogue);
    const method=renderOpportunityFramework(opportunityFramework,topicCatalog,topicActivity);
    if(method)outer.append(method);
    if(entry.id==='youtube')outer.append(renderScenarioCalculator());
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

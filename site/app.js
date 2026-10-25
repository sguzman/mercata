import {evaluateIncomeScenario,evaluateBreakEvenScenario} from './scenario.mjs';
import {auditRevenueStreamSelection} from './revenue-stack-audit.mjs';
import {assessViewComparison,MEASUREMENT_KINDS} from './metric-compatibility.mjs';
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


function renderYppFutureTransition(data,dossier) {
  if(!data?.policy_windows?.length)return null;
  const section=make('section','ypp-transition');
  const details=make('details','ypp-transition-details');
  details.append(make('summary','','Announced February 2027 YPP changes · future, not yet in effect'));
  details.append(make('p','measure-limit','These rules were announced on August 10, 2026 and take effect February 1, 2027. Current applicants still use the October 2026 thresholds. Being eligible never guarantees approval or payment.'));
  const new2027=data.policy_windows.find(x=>x.id==='future_2027_new_ad_applicant');
  const now=data.policy_windows.find(x=>x.id==='current_2026_new_ad_applicant');
  const rolling=data.policy_windows.find(x=>x.id==='shorts_ongoing_revenue_share_2027');
  const cards=make('div','ypp-transition-grid');
  const entries=[
    {title:'October 2026: applicants now',value:now.watch_hours.qualified_public_hours.toLocaleString()+' hours / '+(now.shorts.qualified_shorts_views/1000000)+'M Shorts',notes:'Either qualified attention route, plus '+now.minimum_subscribers.toLocaleString()+' subscribers and channel review.'},
    {title:'February 2027: new applicants',value:new2027.watch_hours.qualified_public_hours.toLocaleString()+' hours / '+(new2027.shorts.qualified_shorts_views/1000000)+'M Shorts',notes:'Either announced route. The future subscriber floor was not expressly restated; unknown.'},
    {title:'February 2027: continuing Shorts share',value:(rolling.shorts.qualified_shorts_views/1000000)+'M in 90 days',notes:'Rolling qualification for Shorts revenue sharing within YPP; falling below does not end YPP or eligible long-form earnings.'}
  ];
  for(const e of entries){
    const card=make('article','ypp-transition-card');
    card.append(make('h5','',e.title));
    card.append(make('strong','ypp-transition-number',e.value));
    card.append(make('p','measure-limit',e.notes));
    cards.append(card);
  }
  details.append(cards);
  if(data.shorts_revenue_mechanisms?.length){
    const methods=make('section','ypp-shorts-methods');
    methods.append(make('h5','','2027 Shorts revenue: two distinct ad routes'));
    const cutoff=rolling.monthly_qualification_measurement;
    if(cutoff)methods.append(make('p','measure-limit','For each earning month, the qualified Shorts views window ends on the 15th of the preceding month. The 90-day measure is not a daily guarantee of earnings.'));
    const grid=make('div','ypp-shorts-grid');
    for(const item of data.shorts_revenue_mechanisms){
      const card=make('article','ypp-shorts-card');
      card.append(make('h6','',item.display_name));
      card.append(make('strong','',item.creator_share_percent+'%'));
      card.append(make('p','measure-limit','Base: '+item.share_base+'.'));
      if(item.targeted_channel_count_max!==null)
        card.append(make('p','measure-limit','Only ads targeted to 5 or fewer channels; additional to pooled Shorts ad revenue.'));
      card.append(make('p','measure-limit',item.limitations));
      grid.append(card);
    }
    methods.append(grid);
    details.append(methods);
  }
  const pool=make('details','ypp-transition-pools');
  pool.append(make('summary','','Announced Premium subscription allocation'));
  const table=make('div','ypp-transition-pool-grid');
  for(const item of data.premium_allocations){
    const c=make('article','ypp-transition-pool');
    c.append(make('h5','',item.plan));
    c.append(make('strong','',item.share_of_net_subscription_revenue_percent+'% of net subscription revenue into a pool'));
    c.append(make('p','measure-limit',item.long_form_creator_share_of_allocated_pool_percent+'% long-form and '+item.shorts_creator_share_of_allocated_pool_percent+'% Shorts shares from the allocated pool; no fixed per-view payout.'));
    table.append(c);
  }
  pool.append(table);details.append(pool);
  details.append(make('p','measure-limit','Existing YPP members are not newly subject to the higher entrance thresholds. Early fan-funding and Shopping entry thresholds are unchanged. Current partners are told to accept updated terms by January 31, 2027.'));
  details.append(make('p','measure-limit','No representative creator earnings uplift, requalification probability, or first-payment timeline is known from this announcement.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Read the dated policy cohorts and future earnings limits ↗');
  link.href='./ontology/youtube/ypp-transition-2027.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
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

function renderPublicSamplingBudget(data,dossier){
  if(!data?.default_quota_snapshot)return null;
  const section=make('section','sampling-budget');
  const details=make('details','sampling-budget-details');
  details.append(make('summary','','Sampling YouTube channels without inventing community sizes'));
  details.append(make('p','measure-limit','These are dated documentation defaults, not an API credential or an executed sample. Search results and estimated totals cannot identify how many people or creators belong to a community.'));
  const fields=[
    ['Default daily searches',data.default_quota_snapshot.search_list.max_calls_per_day_default+' calls'],
    ['Maximum search page',data.default_quota_snapshot.search_list.max_items_per_page+' slots'],
    ['Other-method quota',data.default_quota_snapshot.other_endpoints.max_units_per_day_default+' units/day'],
    ['Approximate search total ceiling',data.default_quota_snapshot.search_total_results.capped_reported_value.toLocaleString()]
  ];
  const panel=make('div','sampling-budget-grid');
  for(const [name,value] of fields){
    const card=make('article','sampling-budget-card');
    card.append(make('strong','',value));
    card.append(make('p','',name));
    panel.append(card);
  }
  details.append(panel);
  const ex=data.synthetic_budget_example;
  details.append(make('p','measure-limit','Illustrative calculation only: '+ex.topic_count+' topics × '+ex.regions+' regions × '+ex.languages+' languages × '+ex.formats+' formats × '+ex.pages_per_stratum+' page = '+ex.estimated_search_calls+' search calls, at most '+ex.max_search_result_slots.toLocaleString()+' result slots; actual distinct videos, creators and viewers unknown.'));
  details.append(make('p','measure-limit','Quota settings must be checked on the authorized project. No API calls, credentials, payments or individual profiles have been used here.'));
  details.append(audienceSources(data.sources.map(x=>x.source_id),dossier));
  const link=make('a','inline-link','Review quota snapshots, sampling strata and limits ↗');
  link.href='./ontology/youtube/public-api-sampling-budget.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);
  section.append(details);return section;
}

function renderTopicEvidenceCoverage(taxonomy,observations){
 if(!taxonomy?.topics?.length)return null;
 const recorded=observations?.observations||[];
 const known=new Set(taxonomy.topics.map(t=>t.id));
 const populated=new Set(recorded.map(x=>x.topic_id).filter(x=>known.has(x)));
 const section=make('section','topic-evidence-coverage');
 const details=make('details','ownership-details');
 details.append(make('summary','','Topic atlas evidence: public observations versus actual audience size'));
 details.append(make('p','measure-limit','Original published source observations, not measured unique audiences or total creator populations. Topic categories overlap.'));
 const grid=make('div','ownership-grid');
 const entries=[
  ['Named research categories',taxonomy.topics.length,'Not mutually exclusive people or channels'],
  ['Selected source observations',recorded.length,'Several units, periods and sampled populations'],
  ['Categories with observations',populated.size,'Any evidence, not an audience census'],
  ['Categories without observations',taxonomy.topics.length-populated.size,'Missing evidence is not zero popularity']
 ];
 for(const [label,value,limitation] of entries){
  const card=make('article','ownership-card');
  card.append(make('h5','',label));card.append(make('strong','',String(value)));
  card.append(make('p','measure-limit',limitation));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Lifetime video views, watch hours, single-event audiences, uploads and selected fan percentages cannot be added into audience totals. Historical taxonomy splits need explicit versioning.'));
 const link=make('a','inline-link','Read all topic measurements and source boundaries ↗');
 link.href='./ontology/youtube/topic-observation-coverage-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
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

function renderAirStudioBenchmarks(data,dossier){
 if(!data?.studies?.length)return null;
 const section=make('section','air-studio-benchmarks');
 const details=make('details','air-studio-details');
 details.append(make('summary','','Observed YouTube RPM and livestreams · selected monetized AIR channels'));
 details.append(make('p','measure-limit','AIR Media-Tech reports Studio data from its own client channels. These samples exclude zero-earning new creators. Study participants may overlap and cannot be pooled into a larger creator population.'));
 const grid=make('div','air-studio-grid');
 const rpm=data.studies.find(x=>x.id==='monetized_rpm_sample_300');
 const stream=data.studies.find(x=>x.id==='monetized_live_sample_127');
 if(rpm){
   const card=make('article','air-studio-card');
   card.append(make('h5','','300 selected monetized channels · '+rpm.observed_channel_months.toLocaleString()+' channel-months'));
   card.append(make('strong','air-studio-value','USD '+rpm.reported_overall_median_rpm_usd.toFixed(2)));
   card.append(make('p','measure-context','Reported median RPM per 1,000 views after YouTube revenue allocation, May 2025–May 2026'));
   const rows=make('ul','air-studio-examples');
   for(const niche of rpm.niche_examples){
     const item=make('li','air-studio-example');
     add(item,make('span','',niche.name+(niche.small_n_warning?' · small n':'')),make('strong','','USD '+niche.median_rpm_usd.toFixed(2)));
     rows.append(item);
   }
   card.append(rows);
   card.append(make('p','measure-limit','Not a new-creator profit estimate; niche sample counts mostly unknown.'));
   card.append(audienceSources(rpm.source_ids,dossier));
   grid.append(card);
 }
 if(stream){
   const card=make('article','air-studio-card');
   card.append(make('h5','','404 total client channels · '+stream.monetized_live_channels_n+' monetized livestreamers'));
   card.append(make('strong','air-studio-value',stream.median_views_per_live_stream+' views'));
   card.append(make('p','measure-context','Reported median per livestream in '+stream.monetized_live_channel_months.toLocaleString()+' monetized streaming channel-months'));
   card.append(make('p','measure-limit','Stream views are not concurrent viewers, revenue, or individual channels. General performance data cover '+stream.observed_all_channel_months.toLocaleString()+' months across 404 channels.'));
   card.append(audienceSources(stream.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','True all-creator RPM, newcomer zero-earner share, net profit, labor hours and cross-study participant overlap: unknown.'));
 const link=make('a','inline-link','Sampling, niche spreads and streaming denominator caveats ↗');
 link.href='./ontology/youtube/air-studio-benchmarks-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
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

function renderLifecycleHorizons(data,dossier){
 if(!data?.age_windows_days?.length)return null;
 const section=make('section','lifecycle-horizons');
 const details=make('details','lifecycle-horizons-details');
 details.append(make('summary','','Evergreen vs trend-led video earning horizons · 30, 90, 365 days'));
 details.append(make('p','measure-limit','Publication-age cohorts must be classified before outcomes and followed without dropping zero earners or incomplete observations. Public video views do not establish creator income.'));
 const grid=make('div','lifecycle-horizons-grid');
 for(const horizon of data.age_windows_days){
   const card=make('article','lifecycle-horizon-card');
   card.append(make('h5','',horizon+' days after publishing'));
   card.append(make('strong','lifecycle-horizon-unknown','Earnings: unknown'));
   card.append(make('p','measure-limit','Requires complete authorized observations through day '+(horizon-1)+'; no extrapolation from shorter follow-up.'));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Native owner revenue differs from public views, RPM, sponsor receipts, external sales, cash costs and unpaid labor. Mixed 2026 view definitions cannot be pooled.'))
 if(data.single_channel_evergreen_longitudinal_observation){details.append(make('p','measure-limit','A 51-video French-language educational channel study observed 365.3 monthly views in 2019–20 versus 1,669.5 in 2021–22, but no randomized format comparison or creator profit.'));}
;
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Study design, missingness safeguards and tested horizon evaluator ↗');
 link.href='./ontology/youtube/lifecycle-horizons.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCrossPlatformIncomeSurveys(data,dossier) {
  if(!data?.studies?.length)return null;
  const section=make('section','cross-platform-income');
  const details=make('details','cross-platform-income-details');
  details.append(make('summary','','Other creator-income surveys · '+data.independent_dataset_families+' independent samples'));
  details.append(make('p','measure-limit','These are mixed-platform, self-reported creator surveys, not representative YouTube creator earnings. NeoReach and its partner publication report the same underlying respondents; do not count them twice.'));
  const grid=make('div','cross-platform-income-grid');
  for(const study of data.studies){
    const card=make('article','cross-platform-income-card');
    card.append(make('h5','',study.title));
    const number=study.survey_respondents_exact===null?
      'More than '+study.survey_respondents_lower_bound_exclusive.toLocaleString()+' respondents':
      study.survey_respondents_exact.toLocaleString()+' respondents';
    card.append(make('p','measure-context',number+' · mixed-platform · '+study.survey_year));
    const measures=make('ul','cross-platform-income-measures');
    for(const point of study.measurements){
      const item=make('li','cross-platform-income-measure');
      const value=point.value===null?'Not given precisely':
        point.unit==='persons'?point.value.toLocaleString():
        point.value+'%';
      item.append(make('strong','',value));
      let description='';
      if(point.id==='below_15000_year')description='Reported under USD 15,000 annually';
      if(point.id==='full_time_below_44000_year')description='Full-time subgroup below USD 44,000 (approx.)';
      if(point.id==='income_under_500')description='Nearly half reported under USD 500 annually (no exact percentage)';
      if(point.id==='income_100000_plus_count')description='Respondents reporting six figures or more';
      if(point.id==='income_100000_plus_percent')description='Reported six-figure share within this sample';
      if(point.id==='income_1000_5000_count')description='Respondents in the USD 1,000–5,000 annual bracket';
      if(point.id==='creatoriq_under_10000_year')description='CreatorIQ respondents under USD 10,000 annual creator income';
      if(point.id==='creatoriq_income_not_primary')description='CreatorIQ respondents not relying on creator income as primary';
      item.append(make('span','',description||point.metric.replaceAll('_',' ')));
      measures.append(item);
    }
    card.append(measures);
    card.append(make('p','measure-limit',study.limitations[0]));
    card.append(audienceSources(study.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Typical YouTube income: unknown · new-channel zero-earner share: unknown · first-year net profit: unknown. Annual self-reports, already-monetized Studio data, and monthly Patreon observations have different populations and cannot be pooled.'));
  const link=make('a','inline-link','Inspect denominators, source independence and selection limits ↗');
  link.href='./ontology/youtube/cross-platform-income-surveys.md';
  link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);return section;
}

function renderNewcomerIncomeProtocol(data,dossier) {
  if(!data?.acceptance_gates?.length)return null;
  const section=make('section','newcomer-income');
  const details=make('details','newcomer-income-details');
  details.append(make('summary','','New creator earnings: what a representative study still needs'));
  details.append(make('p','measure-limit','A typical YouTube entrant income is not currently established. Selected Patreon earners, already-monetized channels and mixed-platform voluntary surveys do not cover everyone who attempted to publish, including zero earners.'));
  const grid=make('div','newcomer-gates');
  for(const gate of data.acceptance_gates){
    const card=make('article','newcomer-gate');
    card.append(make('h5','',gate.id.replaceAll('_',' ')));
    card.append(make('p','measure-limit',gate.reason));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Median native payout: unknown · Zero-income share: unknown · Median cash profit: unknown · Median labor hours: unknown.'));
  const sources=[...new Set((data.existing_evidence_cases||[]).flatMap(item=>item.source_ids||[]))];
  details.append(audienceSources(sources,dossier));
  const link=make('a','inline-link','View cohort definitions, zero-earner safeguards and missing evidence ↗');
  link.href='./ontology/youtube/newcomer-income-cohort.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
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
  if(data.accounting_matrix?.pathways?.length){
    const stack=make('details','earning-stream-stack');
    stack.append(make('summary','','Compare multiple revenue streams and settlement ledgers'));
    stack.append(make('p','measure-limit','Revenue paths are independently conditional. Selecting a pathway is not enrollment, a sale, a payout or an earnings prediction.'));
    const options=make('div','revenue-pathway-grid'),chosen=new Set();
    const report=make('p','measure-limit','No pathways selected. Actual income and approval are unknown.');
    const refresh=()=>{
      const outcome=auditRevenueStreamSelection(data,[...chosen]);
      const payment=outcome.settlement;
      const ambiguous=outcome.possible_duplicate_deals.length?'; check overlapping underlying orders or contracts: '+outcome.possible_duplicate_deals.map(x=>x.ids.join(' + ')).join(', '):'';
      report.textContent=outcome.selected_count+' selected · AdSense for YouTube '+payment.adsense_for_youtube.length+
        ' · outside providers '+payment.separate_provider_or_merchant.length+
        ' · contract-defined '+payment.contract_defined.length+ambiguous+'. No actual earnings, approval or creator profit inferred.';
    };
    for(const route of data.pathways){
      const mapping=data.accounting_matrix.pathways.find(x=>x.id===route.id);
      const label=make('label','earning-stack-item');
      const input=make('input','earning-stack-checkbox');
      input.type='checkbox';input.value=route.id;input.setAttribute('aria-label','Compare '+route.name);
      input.addEventListener('change',()=>{if(input.checked)chosen.add(route.id);else chosen.delete(route.id);refresh();});
      label.append(input);label.append(make('span','',route.name+' · '+mapping.settlement.replaceAll('_',' ')));
      options.append(label);
    }
    stack.append(options);stack.append(report);
    stack.append(make('p','measure-limit','Accounting conflict: adding estimatedRevenue to component ad or Premium reports, or counting platform-posted commission and its later bank deposit as separate revenues, is invalid.'));
    const link=make('a','inline-link','Read the 16-route accounting and double-counting rules ↗');
    link.href='./ontology/youtube/revenue-stack-accounting.md';link.target='_blank';link.rel='noopener noreferrer';stack.append(link);
    section.append(stack);
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
  if(model.opportunity_risk_matrix?.axes?.length){
    const matrix=make('details','opportunity-risk-matrix');
    matrix.append(make('summary','','Evidence-backed opportunity and risk restrictions · '+model.opportunity_risk_matrix.axes.length+' axes'));
    matrix.append(make('p','measure-limit','No probability of profit or financial loss was inferred. Published rules are not an account-level eligibility decision; measured creator outcomes remain unknown.'));
    const list=make('div','opportunity-method-grid');
    for(const axis of model.opportunity_risk_matrix.axes){
      const card=make('article','opportunity-method-item');
      card.append(make('h5','',axis.label));
      card.append(make('p','',axis.observable_gate));
      card.append(make('p','measure-limit','Class: '+axis.classification.replaceAll('_',' ')+' · '+axis.invalid_shortcut));
      list.append(card);
    }
    matrix.append(list);
    const doc=make('a','inline-link','Read sourced risk-classification boundaries ↗');
    doc.href='./ontology/youtube/opportunity-risk-matrix.md';doc.target='_blank';doc.rel='noopener noreferrer';
    matrix.append(doc);details.append(matrix);
  }
  const link=make('a','inline-link','Read the full comparison method ↗');
  link.href='./ontology/youtube/opportunity-framework.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  container.append(details);
  return container;
}

function renderBreakEvenCalculator(){
 const section=make('section','break-even-tool'),details=make('details','scenario-details');
 details.append(make('summary','','Model required orders from entered fees, refunds and work hours'));
 details.append(make('p','measure-limit','User assumptions only. This models attempted product orders, not YouTube views, customers or real income; no prices or rates are prefilled.'));
 const form=make('form','break-even-form'),inputs={};
 const fields=[
 ['currency','Three-letter currency','text'],
 ['gross_order_price','Gross product price per attempted order','number'],
 ['refund_probability','Refund fraction (0 to 1)','number'],
 ['processor_rate','Processor fraction of gross price (0 to 1)','number'],
 ['processor_fixed_fee','Processor fee per attempted order','number'],
 ['refund_extra_cost','Additional unrecovered cost per refunded order','number'],
 ['variable_nonpayment_cost','Other cost per attempted order','number'],
 ['fixed_cash_cost','Fixed cash costs for modeled period','number'],
 ['creator_hours','Creator hours for modeled period','number'],
 ['target_hourly_compensation','Desired compensation per labor hour','number']];
 for(const [key,label,type] of fields){
  const field=make('label','scenario-field');field.append(make('span','',label));
  const input=make('input','scenario-input');input.type=type;input.name=key;input.autocomplete='off';
  if(type==='number'){input.min='0';input.step='any';}
  else{input.placeholder='e.g. USD or MXN';input.maxLength=3;}
  field.append(input);form.append(field);inputs[key]=input;
 }
 const result=make('div','scenario-result');result.setAttribute('aria-live','polite');
 result.append(make('p','measure-limit','Enter currency and all nine nonnegative numbers to calculate.'));
 const clear=make('button','scenario-clear','Clear inputs');clear.type='reset';form.append(clear);
 const update=()=>{
  const values={currency:inputs.currency.value.trim().toUpperCase()};
  for(const key of Object.keys(inputs))if(key!=='currency')values[key]=inputs[key].value.trim()===''?null:Number(inputs[key].value);
  try{
   const r=evaluateBreakEvenScenario(values),money=new Intl.NumberFormat('en',{style:'currency',currency:r.currency,maximumFractionDigits:2});
   result.replaceChildren(make('p','scenario-disclaimer','Hypothetical merchant order arithmetic; no actual earnings.'));
   const stats=make('div','scenario-stats');
   add(stats,blockHeading('Contribution / attempted order',money.format(r.contribution_per_attempted_order)),
    blockHeading('Cash break-even order attempts',r.cash_break_even_orders===null?'Not attainable':r.cash_break_even_orders),
    blockHeading('With chosen labor compensation',r.labor_compensated_break_even_orders===null?'Not attainable':r.labor_compensated_break_even_orders));
   result.append(stats);
  }catch{result.replaceChildren(make('p','measure-limit','Enter all values. Refund and fee fractions must be from 0 to 1.'));}
 };
 form.addEventListener('input',update);
 form.addEventListener('reset',()=>result.replaceChildren(make('p','measure-limit','Enter currency and all nine nonnegative numbers to calculate.')));
 details.append(form,result);
 const link=make('a','inline-link','Read the mathematical assumptions and limits ↗');link.href='./ontology/youtube/break-even-scenario.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
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

function renderMusicRights(model,dossier) {
  if(!model?.options?.length)return null;
  const section=make('section','music-rights');
  const details=make('details','music-rights-details');
  details.append(make('summary','','Audio licensing, Content ID and creator cash flow'));
  details.append(make('p','measure-limit','New paid Creator Music licenses were phased out in August 2026. Music royalties, cash expenses and disputed earnings are different accounting events; average creator losses and labor costs remain unknown.'));
  const grid=make('div','music-rights-grid');
  for(const route of model.options) {
    const card=make('article','music-rights-card');
    card.append(make('h5','',route.name));
    card.append(make('p','',route.video_scope));
    card.append(make('p','measure-context','Availability: '+route.availability.replaceAll('_',' ')));
    card.append(make('p','measure-limit',route.youtube_creator_income_effect));
    card.append(audienceSources(route.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  const boundaries=make('div','music-enforcement-grid');
  for(const item of model.enforcement_types||[]) {
    const card=make('article','music-enforcement-card');
    card.append(make('h5','',item.id==='copyright_removal_request'?'Copyright removal and strike':'Content ID claim'));
    card.append(make('p','measure-limit',item.immediate_effects.join('. ')));
    card.append(audienceSources(item.source_ids,dossier));
    boundaries.append(card);
  }
  details.append(boundaries);
  for(const item of model.monetization_interactions||[]){
    details.append(make('p','measure-limit',item.constraint));
  }
  const summary=make('p','measure-limit','Content ID outcomes: '+model.claim_outcomes.map(x=>x.id).join(', ')+'. A disputed hold is not proof of a permanent loss.');
  details.append(summary);
  details.append(make('p','measure-limit','Typical audio cost: unknown · typical rights-related revenue loss: unknown · typical clearance hours: unknown.'));
  const link=make('a','inline-link','Read dated licensing terms and accounting protocol ↗');
  link.href='./ontology/youtube/music-rights-economics.md';
  link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);
  return section;
}

function renderAdvertiserPolicyHistory(data,dossier){
  if(!data?.revisions?.length)return null;
  const section=make('section','advertiser-policy-history');
  const details=make('details','advertiser-policy-details');
  details.append(make('summary','','Advertiser suitability policy revisions during 2026'));
  details.append(make('p','measure-limit','These are month-dated YouTube policy updates, not guaranteed ad decisions or evidence that a genre earns more money. Suitability of an individual video remains contextual.'));
  const grid=make('div','advertiser-revision-grid');
  for(const item of data.revisions){
    const card=make('article','advertiser-revision-card');
    card.append(make('p','measure-context',item.announced_month+' · '+item.topic_class.join(', ').replaceAll('_',' ')));
    card.append(make('h5','',item.id.split('-').slice(2).join(' ').replaceAll('-',' ')));
    card.append(make('p','',item.rule));
    card.append(make('p','measure-limit',item.limitations));
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Unknown: effects on average creator revenue, audience distribution, review error rate and appeal success. YPP membership, ad-suitability checks and takedown rules are independent gates.'));
  const link=make('a','inline-link','Read policy chronology and application limits ↗');
  link.href='./ontology/youtube/advertiser-policy-history.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
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

function renderViewDefinitionBreak(data,dossier) {
  if(!data?.measurement_levels?.length)return null;
  const section=make('section','view-definition-break');
  const details=make('details','view-definition-details');
  details.append(make('summary','','August 2026: public views versus engaged and eligible views'));
  details.append(make('p','measure-limit','Since August 24, 2026, a public view can be counted from the first playback frame. Earlier public totals are not automatically comparable. Creator earnings and Partner Program eligibility still require different qualifying metrics.'));
  const cards=make('div','view-definition-grid');
  for(const level of data.measurement_levels){
    const card=make('article','view-definition-card');
    card.append(make('h5','',level.id.replaceAll('_',' ')));
    card.append(make('p','',level.description));
    card.append(make('small','', 'Unit: '+level.unit.replaceAll('_',' ')));
    card.append(audienceSources(level.source_ids,dossier));
    cards.append(card);
  }
  details.append(cards);
  const warning=make('div','view-definition-warning');
  warning.append(make('h5','','Invalid comparisons'));
  const items=make('ul','view-definition-invalid-list');
  for(const note of data.comparison_protocol.invalid_reuse.slice(0,5))items.append(make('li','',note));
  warning.append(items);
  details.append(warning);
  const tool=make('div','view-comparison-tool');
  tool.append(make('h5','','Check whether two measurement snapshots are comparable'));
  tool.append(make('p','measure-limit','This checks metric identity and the August 2026 counting break only; it cannot establish matched samples or genuine growth.'));
  const form=make('form','view-comparison-form');
  const choose=(title)=>{
    const label=make('label','view-comparison-field');
    label.append(make('span','',title));
    const input=make('input','view-comparison-date');
    input.type='date';input.required=true;
    label.append(input);form.append(label);return input;
  };
  const dateA=choose('First observation date');
  const dateB=choose('Second observation date');
  const measureField=make('label','view-comparison-field');
  measureField.append(make('span','','Metric used in both observations'));
  const select=make('select','view-comparison-kind');
  select.setAttribute('aria-label','Metric to compare');
  for(const metric of MEASUREMENT_KINDS){
    const option=make('option','',metric.label);option.value=metric.id;
    select.append(option);
  }
  measureField.append(select);form.append(measureField);
  const result=make('p','view-comparison-result','Choose both dates to check structural comparability.');
  result.setAttribute('role','status');
  result.setAttribute('aria-live','polite');
  const update=()=>{
    const assessed=assessViewComparison(
      {date:dateA.value,metric:select.value},
      {date:dateB.value,metric:select.value}
    );
    result.textContent=assessed.reason;
    result.dataset.status=assessed.status;
  };
  for(const input of [dateA,dateB,select])input.addEventListener('change',update);
  form.addEventListener('submit',event=>{event.preventDefault();update();});
  tool.append(form,result);details.append(tool);
  details.append(make('p','measure-limit','Unknown: pre/post conversion factor, public-to-engaged conversion, artificial growth component and causal earnings effect. The change in counting does not establish more attentive viewers.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Read dated view-count methodology and historical limitations ↗');
  link.href='./ontology/youtube/view-definition-break.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);return section;
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

function renderCountryReachDevices(data,dossier) {
  if(!data?.observations?.length)return null;
  const section=make('section','country-reach');
  const details=make('details','country-reach-details');
  details.append(make('summary','','YouTube reach and viewing devices: measured, separate populations'));
  details.append(make('p','measure-limit','UK online use, home television minutes, home all-device viewing, older adults and a 48-market survey measure different people, time windows and devices. Do not sum percentages or device minutes.'));
  const cards=make('div','country-reach-cards');
  for(const id of ['uk-youtube-adult-use-2025','uk-youtube-online-minutes-2025','dnr48-any-use-2026','dnr48-news-2026']){
    const o=data.observations.find(x=>x.id===id);
    if(!o)continue;
    const card=make('article','country-reach-card');
    const value=o.unit.includes('percent')?o.value+'%':o.value+' min/day';
    card.append(make('strong','country-reach-number',value));
    card.append(make('h5','',o.metric));
    card.append(make('p','measure-context',o.scope+' · '+o.period));
    card.append(make('p','measure-limit',o.limits));
    card.append(audienceSources([o.source_id],dossier));
    cards.append(card);
  }
  details.append(cards);
  const trends=make('div','country-reach-trends');
  for(const series of data.valid_series){
    const first=data.observations.find(x=>x.id===series.members[0]);
    const last=data.observations.find(x=>x.id===series.members[1]);
    if(!first||!last)continue;
    const row=make('article','country-reach-trend');
    const unit=first.unit.includes('percent')?'%':' min/day';
    row.append(make('h5','',first.metric));
    row.append(make('strong','country-reach-trend-values',first.period+': '+first.value+unit+' → '+last.period+': '+last.value+unit));
    row.append(make('p','measure-limit',series.comparison));
    trends.append(row);
  }
  details.append(trends);
  details.append(make('p','measure-limit','UK unique creator counts, market-level niche populations and global monthly distinct viewers: unknown. These studies do not measure typical creator earnings.'));
  const link=make('a','inline-link','Source tables and strict device-denominator notes ↗');
  link.href='./ontology/youtube/country-reach-devices.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
}

function renderSurveyFrameCrosswalk(data,dossier){
 if(!data?.frames?.length)return null;
 const section=make('section','survey-frame-crosswalk');
 const details=make('details','survey-frame-details');
 details.append(make('summary','','Why major YouTube surveys cannot be pooled · '+data.frames.length+' documented source frames'));
 details.append(make('p','measure-limit','The sample unit, geography, recruitment, ages and economic metric differ across Pew, YouTube/NRG, CreatorIQ and AIR. A sample of channels, channel-months or online respondents is not the entire global audience.'));
 const grid=make('div','survey-frame-grid');
 for(const item of data.frames){
   const card=make('article','survey-frame-card');
   card.append(make('h5','',item.owner));
   card.append(make('p','measure-context',item.eligibility));
   const sizeLabel=item.sample_total_n===null?'Sample size: unknown':item.sample_total_n.toLocaleString()+' '+(item.id==='air_2026_monetized_studio'?'channels':'respondents');
   card.append(make('strong','survey-frame-count',sizeLabel));
   card.append(make('p','measure-limit','Measured: '+item.quantity.replaceAll('_',' ')));
   card.append(make('p','measure-limit','Global YouTube user census: not established'));
   card.append(audienceSources(item.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Item-level respondent denominators, joint survey weights, study panel overlap and an income measure including zero-earning YouTube entrants remain unknown. Some NRG aggregate survey frames include minors; Mercata does not profile individuals.'));
 const link=make('a','inline-link','Read study populations, exact units and forbidden pooled comparisons ↗');
 link.href='./ontology/youtube/study-frame-crosswalk.md';link.rel='noopener noreferrer';link.target='_blank';
 details.append(link);section.append(details);return section;
}

function renderIdentityResearch(data,dossier){
 if(!data?.race_ethnicity_groups?.length)return null;
 const section=make('section','identity-research');
 const details=make('details','identity-research-details');
 details.append(make('summary','','2026 U.S. survey race/ethnicity use · religious affiliation unmeasured'));
 details.append(make('p','measure-limit','Pew: share of U.S. ADULTS WITHIN EACH NAMED GROUP reporting that they ever use YouTube. Not each group\'s percentage of YouTube viewers, and never an identity classification of a creator or viewer.'));
 const rows=make('div','identity-research-grid');
 for(const item of data.race_ethnicity_groups){
   const card=make('article','identity-research-card');
   card.append(make('h5','',item.label));
   card.append(make('strong','identity-research-value',item.value_percent+'%'));
   card.append(make('p','measure-limit',item.eligible_population));
   rows.append(card);
 }
 details.append(rows);
 details.append(make('p','measure-limit','Asian-adult estimate: English speakers only. Survey-wide n=5,511 and ±1.8 points do NOT establish cell-specific denominators or margins.'));
 details.append(make('p','measure-limit','Religion-specific YouTube use: unknown. Do not infer religion, race or ethnicity from names, faces, languages, videos or comments.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read respondent definitions, language restriction and publication safeguards ↗');
 link.href='./ontology/youtube/demographic-identity-uncertainty.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderUsDemographicUse(data,dossier){
  if(!data?.strata?.length)return null;
  const section=make('section','us-demographic-use');
  const details=make('details','us-demographic-details');
  details.append(make('summary','','YouTube use across U.S. income, education and urban/rural groups · Pew 2026'));
  details.append(make('p','measure-limit','Each percentage is the share of U.S. adult respondents IN THAT GROUP who report EVER using YouTube. It is not the share of YouTube viewers belonging to the group, monthly use or creator income.'));
  const grid=make('div','us-demographic-grid');
  for(const group of data.strata){
    const card=make('article','us-demographic-card');
    card.append(make('h5','',group.title));
    const rows=make('ul','us-demographic-rows');
    for(const item of group.categories){
      const row=make('li','us-demographic-row');
      add(row,make('span','',item.label),make('strong','',item.percent+'%'));
      rows.append(row);
    }
    card.append(rows);grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Pew survey: 5,511 U.S. adults, January–June 2026. The overall sampling margin of error is ±1.8 percentage points; subgroup sample sizes and uncertainty are not established here.'));
  details.append(audienceSources([data.source_id],dossier));
  const link=make('a','inline-link','Source, subgroup denominators and survey-method limitations ↗');
  link.href='./ontology/youtube/us-demographic-use-2026.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderViewerPersonMetrics(data,dossier){
 if(!data?.measures?.length)return null;
 const section=make('section','viewer-person-metrics');
 const details=make('details','viewer-person-details');
 details.append(make('summary','','Distinct viewers, signed-out audience and public channel statistics'));
 details.append(make('p','measure-limit','Owner-only YouTube Studio unique viewers estimate people, including signed-out traffic. Public Data API channel views and rounded subscriptions do not count distinct users.'));
 const grid=make('div','viewer-person-grid');
 for(const item of data.measures){
   const card=make('article','viewer-person-card');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('p','measure-context','Unit: '+item.unit.replaceAll('_',' ')));
   card.append(make('p','',item.public_channel_api?'Public channel API: yes':'Public channel API: no'));
   card.append(make('p','measure-limit',item.limit));
   card.append(audienceSources(item.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Monthly audience = rolling 28-day channel estimate. Unique viewers = owner-scoped modeled people for selected periods up to 90 days. Neither is a published worldwide person census.'))
 if(data.login_state_observability){details.append(make('p','measure-limit','The API viewerPercentage refers to login status while watching, not a distinct count of signed-out people, unique world users, or customer accounts. No owner report was obtained.'));}
;
 details.append(make('p','measure-limit','Global unique people, nonregistered usage share, independent channel owners and cross-channel unique viewer overlap: unknown.'));
 const link=make('a','inline-link','Read source-backed units, access rules and remaining census gaps ↗');
 link.href='./ontology/youtube/viewer-person-metrics.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderChildrenSeasonality(data,dossier){
 if(!data?.yearly_context?.length)return null;
 const section=make('section','children-seasonality');
 const details=make('details','children-seasonality-details');
 details.append(make('summary','','UK children and YouTube: annual viewing context, seasonal effects unknown'));
 details.append(make('p','measure-limit','Ofcom/Barb estimate in-home UK child YouTube viewing in 2025. These weekly averages and 2024–2025 changes are not measured school-holiday or Halloween audience effects.'));
 const grid=make('div','children-seasonality-grid');
 for(const item of data.yearly_context){
  const card=make('article','children-seasonality-card');
  card.append(make('h5','','UK ages '+item.age));
  card.append(make('strong','children-seasonality-value',Math.floor(item.minutes/60)+'h '+String(item.minutes%60).padStart(2,'0')+'m'));
  card.append(make('p','measure-limit','Per week in 2025 · '+(item.year_on_year_percent>0?'+':'')+item.year_on_year_percent+'% year-on-year'));
  grid.append(card);
 }
 details.append(grid);
 const adjacent=data.adjacent_seasonal_context;
 if(adjacent?.observations?.length===2 && adjacent.youtube_platform_specific===false){
  const all=adjacent.observations.find(item=>item.id==='all_tv');
  const streaming=adjacent.observations.find(item=>item.id==='streaming_tv');
  if(all && streaming){
   details.append(make('p','children-seasonality-comparator measure-limit',
    'U.S. TV context (ages '+adjacent.age_range+', May–June 2025): all-source TV impressions +'+all.relative_change_percent+'%; streaming impressions +'+streaming.relative_change_percent+'%. Nielsen\'s TV-screen changes are not a YouTube-specific seasonal rate or causal school-break effect.'));
   details.append(audienceSources([adjacent.source_id],dossier));
  }
 }
 const school=data.adjacent_school_return_context;
 if(school?.platform_specific_youtube===false && school.comparisons?.length===4){
  const ch=Object.fromEntries(school.comparisons.map(x=>[x.id,x.value]));
  if(Object.values(ch).every(Number.isFinite)){
   details.append(make('p','children-school-return-comparator measure-limit',
    'U.S. TV school-return context (ages '+school.age_range+', July–August 2025): all TV viewing '+ch.aug_vs_july_all_tv+'%; combined streaming TV '+ch.aug_vs_july_streaming+'%. First-to-last week: TV '+ch.aug_first_vs_last_week_all_tv+'%; streaming '+ch.aug_first_vs_last_week_streaming+'%. Not a measured YouTube-specific or causal school-return effect.'));
   details.append(audienceSources([school.source_id],dossier));
  }
 }
 details.append(make('p','measure-limit','Measured seasonal effects: unknown. School-break, winter holiday, summer, Halloween and after-school contrasts require comparable dated data. Age and device boundaries must remain consistent; no child-level histories are collected.'));
 details.append(audienceSources(data.sources,dossier));
 const link=make('a','inline-link','Annual source values and missing seasonal evidence ↗');
 link.href='./ontology/youtube/children-media-seasonality.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderGenderCommunityEvidence(data,dossier){
 if(!data?.measurement_surfaces?.length)return null;
 const section=make('section','gender-community-evidence');
 const details=make('details','gender-community-details');
 details.append(make('summary','','Gender-associated audiences: what limited evidence actually measures'));
 details.append(make('p','measure-limit','YouTube owner Analytics reports gender categories for logged-in viewers and can suppress small demographic cells. These labels cannot identify individual gender or include all signed-out viewers.'));
 const grid=make('div','gender-community-grid');
 for(const row of data.measurement_surfaces){
  const card=make('article','gender-community-card');
  card.append(make('h5','',row.id.replaceAll('_',' ')));
  card.append(make('p','measure-limit',row.id==='privacy_suppression'?'Withheld demographic cells are unknown, never zero. Thresholds are unpublished.':'Reported categories: '+row.categories.join(', ')+'. These are account reporting labels, not verified personal identities.'));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','One 2024–2025 vendor-selected U.S. female 25–34 Gaming panel reported 5% Beauty/Gaming overlap, but the matched-person denominator and population weighting are unavailable. No gender stereotype or national audience union is supported.'));
 details.append(audienceSources(data.sources,dossier));
 const link=make('a','inline-link','Source definitions, missing data and privacy safeguards ↗');
 link.href='./ontology/youtube/gender-community-evidence.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderBeautyGamingOverlap(data,dossier){
  if(!data?.study?.panel_count)return null;
  const section=make('section','beauty-gaming-panel');
  const details=make('details','beauty-gaming-details');
  details.append(make('summary','','Observed Beauty–Gaming affinity: limited U.S. panel, 2024–2025'));
  details.append(make('p','measure-limit','Tubular Labs studied '+data.study.panel_count.toLocaleString()+' U.S. female viewers ages 25–34 who engaged with Gaming videos at least five times in July 2024–June 2025. This is a commercial panel, not the U.S. population.'));
  const metric=data.findings.find(x=>x.id==='reported_category_overlap');
  const grid=make('div','beauty-gaming-grid');
  const reported=make('article','beauty-gaming-card');
  reported.append(make('h5','','Provider-reported category overlap'));
  reported.append(make('strong','beauty-gaming-value',metric.value+'%'));
  reported.append(make('p','measure-limit','Exact intersection count and percentage denominator: unknown. Not an independently verified union of distinct people.'));
  grid.append(reported);
  for(const entry of data.findings.filter(x=>x.measure==='relative_channel_viewing_affinity')){
    const card=make('article','beauty-gaming-card');
    card.append(make('h5','',entry.brand_channel));
    card.append(make('strong','beauty-gaming-value',entry.value+'×'));
    card.append(make('p','measure-limit','Vendor-reported relative affinity; reference-population and absolute share not independently established.'));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Do not multiply 5% by panel size, infer gender or individual preferences, or project these figures to all viewers or creators. No person-level data were collected.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Read panel, date, overlap numerator and generalization limits ↗');
  link.href='./ontology/youtube/beauty-gaming-overlap-2025.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderAudienceOverlapResearch(data,dossier){
  if(!data?.topic_links?.length)return null;
  const section=make('section','audience-overlap');
  const details=make('details','audience-overlap-details');
  details.append(make('summary','','Overlapping YouTube communities: why niche audiences cannot be added'));
  details.append(make('p','measure-limit','Niche viewers can participate in multiple communities. Subscriber, view and ad-reach statistics do not uniquely count people across categories.'));
  const grid=make('div','audience-overlap-grid');
  for(const item of data.topic_links){
    const card=make('article','audience-overlap-card');
    card.append(make('h5','',item.topic_ids.map(x=>x.replaceAll('-',' ')).join(' · ')));
    card.append(make('p','measure-limit','Joint audience size: unknown · Overlap percentage: unknown'));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','A validated matched two-group intersection supports an exact deduplicated union. Otherwise use only justified bounds from one common respondent frame; three or more groups may require higher-order intersections.'));
  details.append(audienceSources(data.source_bounded_examples.map(x=>x.source_id),dossier));
  const link=make('a','inline-link','Read joint-population definitions and tested union rules ↗');
  link.href='./ontology/youtube/audience-overlap.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderGeographicScope(data,dossier) {
  if(!data?.branches?.length)return null;
  const section=make('section','geographic-scope');
  const details=make('details','geographic-details');
  details.append(make('summary','','Country and population scope: evidence boundaries'));
  details.append(make('p','measure-limit','Viewer geography, creator residence, payout jurisdiction, advertising market and content language are different research variables. These are source-specific branches, not a global census.'));
  const grid=make('div','geographic-grid');
  for(const branch of data.branches){
    const card=make('article','geographic-card');
    card.append(make('h5','',branch.title));
    card.append(make('p','measure-context',branch.population));
    card.append(make('p','measure-limit',branch.limitations));
    card.append(audienceSources(branch.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Unique monthly global viewers, country-wide creator counts and newcomer profit including zero earners: unknown.'));
  const link=make('a','inline-link','Source-bounded country study protocol ↗');
  link.href='./ontology/youtube/geographic-scope.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderEuCreatorConsultation(d,register){
 if(!d?.reported_responses?.length)return null;
 const section=make('section','eu-consultation');
 const details=make('details','eu-consultation-details');
 details.append(make('summary','','EU27 creator support gaps and algorithm dependence · October 2026'));
 details.append(make('p','measure-limit','This platform-sponsored consultation heard from over 20,000 EU27 creators. Its selected percentages are not a probability sample of all EU creators, and individual question respondent counts and sampling weights are unknown.'));
 const grid=make('div','eu-consultation-grid');
 for(const o of d.reported_responses){
  const item=make('article','eu-consultation-card');
  item.append(make('strong','eu-consultation-percent',o.reported_percent+'%'));
  item.append(make('h5','',o.scope));
  item.append(make('p','measure-limit',o.question_population));
  grid.append(item);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Studio-space access refers only to professional creators. Separately cited Oxford Economics GDP and full-time-equivalent jobs are modeled impact measures, not creator income.'));
 details.append(make('p','measure-limit','Representative newcomer earnings, costs, grant access rates and actual causal income losses remain unknown.'));
 details.append(audienceSources([d.source_id],register));
 const link=make('a','inline-link','Read survey source, sampling limits and economic impact distinctions ↗');
 link.href='./ontology/youtube/eu-creator-consultation-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderTrafficConcentration(data,dossier){
 if(!data?.source_families?.length)return null;
 const section=make('section','traffic-concentration');
 const details=make('details','traffic-concentration-details');
 details.append(make('summary','','Traffic-source dependence: what is measured and what is missing'));
 details.append(make('p','measure-limit','Browse, suggested, Shorts, search, notifications, playlists, external and direct/unknown are distinct owner-Analytics attribution classes. No channel traffic mix or creator revenue effect is observed here.'));
 const grid=make('div','traffic-concentration-grid');
 for(const item of data.source_families){
  const card=make('article','traffic-concentration-card');
  card.append(make('h5','',item.label));
  card.append(make('p','measure-limit',item.source));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','With a complete authorized same-period source partition, calculate largest source share and HHI. An HHI does not measure ownership, profit, volatility or the probability of algorithmic harm.'))
 if(data.api_attribution_crosswalk?.categories?.length){
  details.append(make('p','measure-limit','API distinctions: Google Search appears under EXT_URL, unlike YT_SEARCH. SHORTS refers to vertical feed swipes, not all Short videos. SUBSCRIBER identifies a referral feature, not a verified subscribing viewer. NO_LINK_OTHER is not proof of direct relationships.'));
 }
;
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Source taxonomy, measured-unit requirements and synthetic audit tests ↗');
 link.href='./ontology/youtube/traffic-concentration.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCreatorSafety(data,dossier){
 if(!data?.modules?.length)return null;
 const section=make('section','creator-safety');
 const details=make('details','creator-safety-details');
 details.append(make('summary','','Creator safety, account recovery and October 2026 security changes'));
 details.append(make('p','measure-limit','On October 21, 2026, TeamYouTube announced temporary limits when account compromise is suspected. Existing video viewing and monetization status are described as continuing; review is typically within 24 hours, not guaranteed.'));
 const grid=make('div','creator-safety-grid');
 for(const module of data.modules){
   const card=make('article','creator-safety-card');
   card.append(make('h5','',module.title));
   card.append(make('p','',module.controls.map(x=>x.replaceAll('_',' ')).join(' · ')));
   card.append(make('p','measure-limit',module.constraints));
   card.append(audienceSources(module.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Harassment incidence, moderation effectiveness, security false-positive rates, loss of earnings and recovery success are unmeasured. This is platform procedure research, not an account diagnosis.'));
 const source=make('a','inline-link','Official policies, recovery order and security pause limitations ↗');
 source.href='./ontology/youtube/creator-safety-continuity.md';source.target='_blank';source.rel='noopener noreferrer';
 details.append(source);section.append(details);return section;
}

function renderPublishingCadenceStudy(data,dossier){
 if(!data?.datasets?.length)return null;
 const air=data.datasets.find(x=>x.id==='air-282-2026');
 const broad=data.datasets.find(x=>x.id==='vidiq-2026');
 if(!air||!broad)return null;
 const section=make('section','publishing-cadence');
 const details=make('details','publishing-cadence-details');
 details.append(make('summary','','Observed YouTube upload cadence: niche medians and peer dispersion'));
 details.append(make('p','measure-limit','AIR reports medians and 25th–75th percentile monthly uploads among 282 selected owner-Analytics-access channels. These are not typical newcomer schedules or causal optimal posting targets.'));
 const grid=make('div','publishing-cadence-grid');
 for(const entry of air.niche_size_groups){
   const card=make('article','publishing-cadence-card');
   card.append(make('h5','',entry.id.replaceAll('_',' ')));
   card.append(make('strong','publishing-cadence-median',String(entry.median_uploads_month)+' uploads/month'));
   card.append(make('p','measure-limit','Middle half: '+entry.p25_uploads_month+'–'+entry.p75_uploads_month+' uploads/month'));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Separate vidIQ sample: '+broad.reported_sample_channels.toLocaleString()+' channels with 1,000+ subscribers. Its posting-frequency comparison includes both Shorts and long-form, unlike an independently verified format-matched peer panel.'));
 const tiers=make('div','publishing-cadence-tiers');
 for(const tier of broad.cadence_tiers){
   const row=make('div','publishing-cadence-tier');
   add(row,make('span','',tier.id.replaceAll('_',' ')),make('strong','',tier.median_monthly_views_growth_percent+'% median monthly view growth'));
   tiers.append(row);
 }
 details.append(tiers);
 details.append(make('p','measure-limit','Publishing more correlates with growth in this selected 1,000+ subscriber sample; this does not establish causation, incremental creator profit, or a universal ideal cadence.'));
 if(data.additional_study){
  details.append(make('p','measure-limit','Separate AIR June 2026 study: '+data.additional_study.reported_sample_channels.toLocaleString()+' selected channels and vendor-suggested weekly niche ranges. Its proposed posting targets are not the July 282-channel monthly medians or causal creator-profit evidence.'));
  details.append(audienceSources([data.additional_study.source_id],dossier));
 }
 const caseStudy=data.peer_reviewed_observational_case;
 if(caseStudy?.sample_channels===47){
  const casePanel=make('div','cadence-korean-beauty-evidence');
  casePanel.append(make('h5','','Separate peer-reviewed study: Korean beauty channels'));
  casePanel.append(make('p','measure-limit',caseStudy.sample_channels+
    ' selected South Korean beauty channels: upload frequency correlated with engagement/revenue; consistent uploads with reported loyalty; greater Shorts concentration with less sustained watch time.'));
  casePanel.append(make('p','measure-limit','Abstract-level evidence only; regression coefficients, causal effect, median upload rate, channel profit and global extrapolation are unavailable.'));
  casePanel.append(audienceSources([caseStudy.source_id],dossier));
  details.append(casePanel);
 }
 details.append(audienceSources([...new Set(data.datasets.flatMap(x=>x.source_ids))],dossier));
 const link=make('a','inline-link','Compare source sampling rules, medians and uncertainty ↗');
 link.href='./ontology/youtube/publishing-cadence-evidence.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderSponsorCategoryResearch(data,dossier){
 const study=data?.datasets?.find(x=>x.id==='thoughtleaders-oct-2026');
 if(!study?.categories?.length)return null;
 const section=make('section','sponsor-categories');
 const details=make('details','sponsor-categories-details');
 details.append(make('summary','','Sponsorship detections by YouTube content category'));
 details.append(make('p','measure-limit','Commercial index of promotional reads in sampled LONG-FORM videos, not verified paid contracts, ad spending or creators earning money.'));
 const grid=make('div','sponsor-categories-grid');
 for(const item of study.categories){
   const card=make('article','sponsor-category-card');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('strong','sponsor-category-density',item.density_last_pct.toFixed(1)+'%'));
   card.append(make('p','',item.sponsored_videos.toLocaleString()+' detected videos · Sep 15–Oct 14, 2026'));
   card.append(make('p','measure-limit','Share of scanned long-form uploads in this channel category; not share of paid creators.'));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','ThoughtLeaders reports 176,686 detections (6.1%) among about 2.9 million long-form uploads. Sponsor-style reads may include unpaid creator-code mentions. Shorts are not covered.'));
 const radar=data.datasets.find(x=>x.id==='sponsorradar-feb2025-jan2026');
 if(radar)details.append(make('p','measure-limit','Independent SponsorRadar index: '+radar.detected_placements_all_categories.toLocaleString()+' placements during Feb 2025–Jan 2026. Counts and categories use a different methodology and must not be added.'));
 const other=data.datasets.find(x=>x.id==='upfluence-q1-2026');
 if(other)details.append(make('p','measure-limit','Adjacent Upfluence sample: '+other.reported_applications_total.toLocaleString()+' campaign applications across creator platforms in Q1 2026, not YouTube paid sponsorships.'));
 details.append(make('p','measure-limit','Typical sponsor fees, Shorts sponsorship density, newcomer zero-earner share, and sponsor net profit: unknown.'));
 details.append(audienceSources([...new Set(data.datasets.flatMap(x=>x.source_ids))],dossier));
 const link=make('a','inline-link','See the source periods, categories and selection biases ↗');
 link.href='./ontology/youtube/sponsor-category-evidence.md';link.rel='noopener noreferrer';link.target='_blank';
 details.append(link);section.append(details);return section;
}

function renderBrandDisclosureRisk(data,dossier) {
  if(!data?.policy_layers?.length)return null;
  const section=make('section','brand-disclosure');
  const details=make('details','brand-disclosure-details');
  details.append(make('summary','','Sponsorship disclosures: platform controls versus advertising law'));
  details.append(make('p','measure-limit','YouTube requires a branded-content declaration for covered promotions. U.S. FTC disclosure guidance is an additional context-dependent layer; a platform label is not a universal legal safe harbor.'));
  const grid=make('div','brand-disclosure-grid');
  for(const layer of data.policy_layers){
    const card=make('article','brand-disclosure-card');
    card.append(make('h5','',layer.title));
    card.append(make('p','measure-context',layer.jurisdiction));
    card.append(make('p','',layer.creator_action));
    card.append(audienceSources(layer.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','September 3, 2026: YouTube announced refreshed labels, manual audience age/geography controls and phased automated branded-content detection. Feature rollout completion and enforcement accuracy remain unknown.'));
  const examples=make('div','brand-disclosure-examples');
  for(const item of data.surface_guidance){
    const card=make('article','brand-disclosure-surface');
    card.append(make('strong','',item.surface));
    card.append(make('p','measure-limit',item.us_guidance));
    examples.append(card);
  }
  details.append(examples);
  details.append(make('p','measure-limit','Typical sponsorship revenue, country compliance expense, and individual penalties are unknown. Legal obligations differ by country and context; this is research, not legal advice.'));
  const link=make('a','inline-link','Read dated source scope, relationship cases and unresolved risks ↗');
  link.href='./ontology/youtube/brand-disclosure-risk.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderTaxWithholdingResearch(data,dossier){
  if(!data?.payer_withholding_cases?.length)return null;
  const section=make('section','tax-withholding');
  const details=make('details','tax-withholding-details');
  details.append(make('summary','','YouTube tax-information and withholding: distinct earning bases'));
  details.append(make('p','measure-limit','Google requires U.S. tax information from monetizing YPP creators worldwide. The following cases describe conditional Google payout deductions, not personal tax advice, legal form selection or final tax liability.'));
  const grid=make('div','tax-withholding-grid');
  for(const item of data.payer_withholding_cases){
    const card=make('article','tax-withholding-card');
    card.append(make('h5','',item.payee));
    const rate=item.published_rate_bounds_percent
      ?item.published_rate_bounds_percent.min+'–'+item.published_rate_bounds_percent.max+'% conditional range'
      :item.published_default_rate_percent+'% published platform case';
    card.append(make('strong','tax-withholding-rate',rate));
    card.append(make('p','tax-withholding-base','Base: '+item.base.replaceAll('_',' ')));
    card.append(make('p','measure-limit',item.applicability));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Account type, tax residence, valid form, treaty eligibility, creator income by viewer market and final tax liability: unknown. Missing documents can change the withholding base; do not deduct the same amount twice.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Read the dated official tax documentation and financial limitations ↗');
  link.href='./ontology/youtube/tax-withholding-mechanics.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
}

function renderCountryProgramAccess(data,dossier) {
  if(!data?.country_records?.length)return null;
  const section=make('section','country-programs');
  const details=make('details','country-programs-details');
  details.append(make('summary','','Creator program entry and payment methods by country'));
  details.append(make('p','measure-limit','Official country lists show geographic access, not whether a channel is approved. Payment options depend on the AdSense for YouTube payment address; reporting currency is a separate account-level setting.'));
  const grid=make('div','country-programs-grid');
  for(const item of data.country_records){
    const card=make('article','country-program-card');
    card.append(make('h5','',item.country));
    card.append(make('p','', 'Standard YPP: '+(item.program_access.standard_ypp_listed?'listed':'not listed')+' · Expanded YPP: '+(item.program_access.expanded_ypp_listed?'listed':'not listed')));
    const methods=Object.entries(item.payment_address_methods).filter(([k])=>['cheque','eft','wire','hyperwallet'].includes(k)).map(([name,yes])=>name.toUpperCase()+': '+(yes?'Yes':'No')).join(' · ');
    card.append(make('p','country-program-methods',methods));
    card.append(make('p','measure-limit','Account currency and feature-specific permissions: unknown. Geographic listing does not confirm individual approval.'));
    card.append(audienceSources([...item.program_access.source_ids,...item.payment_address_methods.source_ids],dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('h5','country-currency-heading','Account-currency thresholds (illustrative, not residence assignments)'));
  const currencies=make('div','country-currency-grid');
  for(const item of data.reporting_currency_threshold_examples){
    const card=make('div','country-currency-card');
    card.append(make('strong','country-program-currency',item.currency+' '+item.minimum_payment.toLocaleString()));
    card.append(make('p','', 'Payment threshold · select method at '+item.currency+' '+item.payment_method_selection));
    card.append(make('p','measure-limit',item.condition));
    card.append(audienceSources(item.source_ids,dossier));
    currencies.append(card);
  }
  details.append(currencies);
  details.append(make('p','measure-limit','Income, country-wide creator counts and any individual tax withholding rate: unknown.'));
  const link=make('a','inline-link','Official sources, scope and country-method table ↗');
  link.href='./ontology/youtube/country-eligibility-payments.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
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

function renderProductionEffortComparison(data,dossier){
  if(!data?.workflows?.length)return null;
  const section=make('section','production-effort');
  const details=make('details','production-effort-details');
  details.append(make('summary','','Education vs entertainment · production effort and entry barriers'));
  details.append(make('p','measure-limit','Six documented workflow examples map the stages and policy gates to investigate. They are NOT measured hours, compulsory purchases, or a ranking of difficult formats.'));
  const grid=make('div','production-effort-grid');
  for(const workflow of data.workflows){
    const card=make('article','production-effort-card');
    card.append(make('h5','',workflow.title));
    card.append(make('p','measure-context',workflow.content_kind+' · '+workflow.publishing_surface.replaceAll('-',' ')));
    card.append(make('p','',workflow.required_stage_ids.length+' stage classes to measure; '+workflow.conditional_stage_ids.length+' conditional classes. Counts are NOT difficulty scores.'));
    card.append(make('p','measure-limit',workflow.notes));
    card.append(audienceSources(workflow.official_source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('h5','production-pairs-heading','Three matched comparisons requiring new observations'));
  for(const pair of data.paired_comparisons){
    const p=make('p','measure-limit');
    const a=data.workflows.find(w=>w.id===pair.a),b=data.workflows.find(w=>w.id===pair.b);
    p.textContent=a.title+' vs '+b.title+': typical hour difference unknown; typical profit difference unknown.';
    details.append(p);
  }
  details.append(make('p','measure-limit','External podcast and multi-platform creator-hour surveys cannot supply a YouTube-only educational-versus-entertainment causal effect. Include abandoned projects and zero earners.'));
  const link=make('a','inline-link','Compare source-bounded work stages, cash classes and sampling acceptance gates ↗');
  link.href='./ontology/youtube/production-effort-comparison.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderProductionCosts(model) {
  if(!model?.cash_categories?.length || !model?.labor_categories?.length)return null;
  const section=make('section','production-costs');
  const details=make('details','production-costs-details');
  details.append(make('summary','','What creators spend and how long production takes · research ledger'));
  details.append(make('p','measure-limit','Cost categories are measurement definitions, not observed average budgets. No default dollar value, purchase requirement or hours per video is claimed.'));
  const groups=make('div','production-cost-groups');
  for(const group of [
    {heading:'Cash and equipment classes',items:model.cash_categories},
    {heading:'Work and production hours',items:model.labor_categories}
  ]){
    const card=make('div','production-cost-group');
    card.append(make('h5','',group.heading));
    const list=make('ul','production-cost-list');
    for(const item of group.items){
      const row=make('li','production-cost-item');
      row.append(make('strong','',item.id.replaceAll('_',' ')));
      row.append(make('span','',item.description));
      list.append(row);
    }
    card.append(list);groups.append(card);
  }
  details.append(groups);
  for(const study of model.adjacent_creator_surveys||[]){
    if(study.id==='timf-creators-2026'){
      const labor=make('details','adjacent-labor-survey');
      labor.append(make('summary','','Adjacent context: U.S. social creator weekly hours (not YouTube)'));
      labor.append(make('p','measure-limit','Commercial, cross-platform survey of '+study.respondents_total.toLocaleString()+' U.S. creators aged '+study.respondents_age_min+'–'+study.respondents_age_max+' in January 2026. Question-specific denominator, survey selection probabilities, and YouTube subgroup are unknown.'));
      const metric=study.reported_human_work;
      const rows=make('ul','adjacent-cost-bins');
      for(const bin of metric.selected_bins){
        const item=make('li','adjacent-cost-bin');
        add(item,make('span','',bin.label),make('strong','',bin.percent+'%'));
        rows.append(item);
      }
      labor.append(rows);
      labor.append(make('p','measure-limit','These two highlighted bins are not a complete distribution. No typical YouTube work hours, hourly profit or creator costs are inferred.'));
      const source=make('a','inline-link','Original cross-platform creator survey ↗');
      source.href=study.source_url;source.target='_blank';source.rel='noopener noreferrer';
      labor.append(source);details.append(labor);continue;
    }
    const external=make('details','adjacent-cost-survey');
    external.append(make('summary','','Adjacent context: independent podcast creators (not YouTube)'));
    external.append(make('p','measure-limit','Self-selected industry survey · '+study.respondents_total+' total respondents · cost/time bins measured only among already launched podcasters. Subgroup sample size and YouTube-specific medians are not reported.'));
    for(const metric of [study.reported_human_work,study.reported_operating_cash]){
      const panel=make('div','adjacent-cost-metric');
      panel.append(make('h5','',metric.metric==='self_reported_episodes_work_hours'?'Hours per finished podcast episode':'Monthly podcast cash spending'));
      const rows=make('ul','adjacent-cost-bins');
      for(const bin of metric.bins){
        const item=make('li','adjacent-cost-bin');
        add(item,make('span','',bin.label),make('strong','',bin.percent+'%'));
        rows.append(item);
      }
      panel.append(rows);external.append(panel);
    }
    for(const comparison of study.audio_video_comparisons||[]){
      const label=comparison.id==='monthly_cost_at_least_50_usd'?'Monthly spending of at least USD 50':'More than six hours per episode';
      external.append(make('p','measure-limit',label+': about '+comparison.video_percent_approx+'% of video-podcast respondents versus '+comparison.audio_only_percent_approx+'% of audio-only respondents, in the sampled post-launch group. Not a causal comparison.'));
    }
    external.append(make('p','measure-limit',study.reported_monetization.no_money_percent+'% of surveyed post-launch podcasters said their podcast earned no money. This is not a YouTube zero-earner estimate.'));
    const source=make('a','inline-link','Read the original podcast survey ↗');
    source.href=study.source_url;source.target='_blank';source.rel='noopener noreferrer';
    external.append(source);details.append(external);
  }
  details.append(make('p','measure-limit','Typical project cash costs: unknown · typical production hours: unknown · average creator profit: unknown. Existing hardware can avoid a new purchase without becoming economically free.'));
  const link=make('a','inline-link','Review production accounting and cohort methodology ↗');
  link.href='./ontology/youtube/production-costs.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);
  return section;
}

function renderChannelOwnership(data,dossier){
  if(!data?.operations?.length)return null;
  const section=make('section','ownership-continuity');
  const details=make('details','ownership-details');
  details.append(make('summary','','Channel ownership, safe delegation and business continuity'));
  details.append(make('p','measure-limit','YouTube Studio collaborators, Brand Account primary owners and account-to-account channel moves are different operations. A video export is not a portable channel, subscriber list or creator revenue contract.'));
  const grid=make('div','ownership-grid');
  for(const item of data.operations){
    const card=make('article','ownership-card');
    card.append(make('h5','',item.label));
    card.append(make('p','',item.effect));
    const limitations=make('ul','ownership-limits');
    for(const rule of item.restrictions.slice(0,3))limitations.append(make('li','',rule));
    card.append(limitations);
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Brand Account primary ownership changes require documented seven-day role tenure. A mistaken channel move can permanently delete the target channel. None of these rules proves a channel or revenue contract is freely saleable.'));
  details.append(make('p','measure-limit','Store original content, licenses and recovery factors independently. Do not place private account credentials or ownership records in public research.'));
  const link=make('a','inline-link','Review primary-owner and export limitations ↗');
  link.href='./ontology/youtube/channel-ownership-continuity.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderFraudSecurity(m,dossier){
 if(!m?.risks?.length)return null;
 const section=make('section','creator-fraud-security'),details=make('details','ownership-details');
 details.append(make('summary','','Fake engagement, fraudulent sponsorship and account hijacking'));
 details.append(make('p','measure-limit','Official policy prohibits artificial metrics and deceptive links. Credential theft via fake brand deals and overbroad team access are separate account risks.'));
 const grid=make('div','ownership-grid');
 for(const x of m.risks){const card=make('article','ownership-card');card.append(make('h5','',x.label));card.append(make('p','measure-limit',x.limit));card.append(audienceSources(x.source_ids,dossier));grid.append(card);}
 details.append(grid);details.append(make('p','measure-limit','There are no verified sampled incident rates, financial losses, or percentages of creators affected.'));
 const link=make('a','inline-link','Review fraud controls and policy evidence ↗');link.href='./ontology/youtube/creator-fraud-security.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderExclusiveRights(data,dossier){
 if(!data?.scopes?.length)return null;
 const section=make('section','exclusive-rights-audit'),details=make('details','ownership-details');
 details.append(make('summary','','Non-exclusive creator uploads versus exclusive copyright claims'));
 details.append(make('p','measure-limit','Owning a video and allowing YouTube to host it are distinct from proving exclusive territorial rights to create automated Content ID references.'));
 const grid=make('div','ownership-grid');
 for(const x of data.scopes){const card=make('article','ownership-card');card.append(make('h5','',x.label));card.append(make('p','',x.ordinary_use.replaceAll('_',' ')));card.append(audienceSources(x.source_ids,dossier));grid.append(card);}
 details.append(grid);
 details.append(make('p','measure-limit','No actual creator contract, typical licensing price or payout split has been collected.'));
 const link=make('a','inline-link','Read source-backed exclusivity definitions ↗');link.href='./ontology/youtube/exclusive-rights-evidence.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderVideoProductionCosts(data,dossier){
 if(!data?.format_paths?.length)return null;
 const section=make('section','production-cost-audit'),details=make('details','ownership-details');
 details.append(make('summary','','Shorts, horizontal video and live production labor'));
 details.append(make('p','measure-limit','YouTube allows phone-only Shorts, adaptive horizontal/vertical video and several live-stream methods. Hardware spending, labor and net profit require creator-specific records.'));
 const grid=make('div','ownership-grid');
 for(const x of data.format_paths){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.label));card.append(make('p','',x.limit));card.append(audienceSources(x.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','No representative equipment costs, work-hour samples, FX-adjusted expenses or verified creator net profits were collected.'))
 if(data.matched_format_attempt_cost_protocol){details.append(make('p','measure-limit','The matched-format attempt calculator includes abandoned work in the per-completed-video denominator and keeps paid cash distinct from noncash gear use. No real creator sample is collected.'));}
;
 const link=make('a','inline-link','Review source-backed production and cost methodology ↗');link.href='./ontology/youtube/video-production-cost-register.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderSearchDemandProxy(d,dossier){
 if(!d?.proxies?.length)return null;
 const section=make('section','search-demand-proxies'),details=make('details','ownership-details');
 details.append(make('summary','','Keyword demand: search indexes, suggestions and content gaps'));
 details.append(make('p','measure-limit','Four different units: Studio 28-day interest labels, Google Trends normalized 0–100 interest, autocomplete text and indexed video-search results. No absolute monthly searches or buyers have been measured.'));
 const grid=make('div','ownership-grid');
 for(const x of d.proxies){const card=make('article','ownership-card');card.append(make('h5','',x.label));card.append(make('p','',x.scope));card.append(audienceSources(x.source_ids,dossier));grid.append(card);}
 details.append(grid);
 details.append(make('p','measure-limit','Comparable time, country, language, query and comparison panel must be fixed; index values are not absolute demand.'));
 const link=make('a','inline-link','Read the search-demand source audit ↗');link.href='./ontology/youtube/search-demand-proxy-crosswalk.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderGamingPeriods(data,dossier){
 if(!data?.gaming?.length)return null;
 const section=make('section','gaming-period-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Live gaming watched hours: distinct from people and creators'));
 details.append(make('p','measure-limit','Q4 2025 to Q2 2026. Commercial livestream tracking, not a population census.'));
 const grid=make('div','ownership-grid');
 for(const x of data.gaming){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.period+' · Gaming'));
  card.append(make('strong','',x.watch_hours_billion.toFixed(2)+' billion hours watched'));
  card.append(make('p','',x.channels_million+' million broadcast channel identifiers'));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 const live=data.general_live_q2;
 const c=make('article','ownership-card');
 c.append(make('h5','','Q2 2026 · general YouTube Live'));
 c.append(make('strong','',live.watch_hours_billion.toFixed(2)+' billion hours watched'));
 c.append(make('p','measure-limit','Separate category, not automatically combinable with gaming'));
 c.append(audienceSources([live.source_id],dossier));grid.append(c);
 details.append(grid);
 details.append(make('p','measure-limit','Gaming hours fell 19.3% Q2 versus Q1 as reported; distinct viewers, pay and external migration remain unknown.'));
 const link=make('a','inline-link','Read gaming evidence, scope and source notes ↗');
 link.href='./ontology/youtube/gaming-livestream-quarterly-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCrossplatformPosting(data,dossier){
 if(!data?.vendor_posting_snapshot)return null;
 const section=make('section','crossplatform-posting');
 const details=make('details','ownership-details');
 details.append(make('summary','','Crossposting videos is not moving audiences'));
 details.append(make('p','measure-limit','A selected scheduling-tool sample counts multi-platform publishing, not fans who migrated across websites.'));
 const s=data.vendor_posting_snapshot;
 const grid=make('div','ownership-grid');
 for(const [title,value,explanation] of [
 ['Publishing tool creators',s.creators.toLocaleString('en-US'),'Users of a cross-posting service, not all creators'],
 ['Distinct uploads',s.uploads.toLocaleString('en-US'),'One uploaded video can become multiple posts'],
 ['Successful published posts',s.successful_post_events.toLocaleString('en-US'),'Posting events, not distinct viewers'],
 ['Uploads sent to several platforms',s.share_uploads_multi_platform_percent+'%','Selected tool-user uploads; no viewer migration measured']
 ]){
  const card=make('article','ownership-card');
  card.append(make('h5','',title));card.append(make('strong','',value));card.append(make('p','measure-limit',explanation));
  card.append(audienceSources([s.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Separate 2016 YouTube–Twitch rivalry research found context-specific creator effort changes; neither study estimates modern buyer or follower migration.'));
 details.append(audienceSources([data.historical_competition_paper.source_id],dossier));
 const link=make('a','inline-link','Read both dated studies, denominators and missing evidence ↗');
 link.href='./ontology/youtube/crossplatform-posting-evidence.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderRetentionObservability(data,dossier){
 if(!data?.metrics?.length)return null;
 const section=make('section','retention-observability');
 const details=make('details','ownership-details');
 details.append(make('summary','','Audience retention, completed plays and viewing sessions'));
 details.append(make('p','measure-limit','Public playback-start views, owner-only video retention, initial Shorts engagement and cross-video sessions have different units. None establishes an observed full-video completion fraction.'));
 const grid=make('div','ownership-grid');
 for(const item of data.metrics){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.label));
  card.append(make('p','',item.unit.replaceAll('_',' ')+' · '+item.access.replaceAll('_',' ')));
  card.append(make('p','measure-limit',item.limit));
  card.append(audienceSources(item.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Owner video-level retention reports require processing time and sufficiently viewed clips for highlighted moments; all real completion rates and cross-video session lengths remain unknown.'));
 const link=make('a','inline-link','Read measurement units and privacy boundaries ↗');link.href='./ontology/youtube/retention-observability.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderReactionCompilationRights(data,dossier){
 if(!data?.published_example_cases?.length)return null;
 const section=make('section','reaction-compilation-rights');
 const details=make('details','ownership-details');
 details.append(make('summary','','Reaction videos, compilation originality and independent copyright'));
 details.append(make('p','measure-limit','Transformative review can satisfy a YouTube reused-content example without creating copyright permission; mere licensing can still leave a compilation ineligible for monetization.'));
 const grid=make('div','ownership-grid');
 for(const c of data.published_example_cases){
  const card=make('article','ownership-card');
  card.append(make('h5','',c.title));
  card.append(make('p','',c.platform_reused_content_example.startsWith('permitted')?'Potentially permitted YPP example':'YPP ineligible example'));
  card.append(make('p','measure-limit',c.example_notes));
  card.append(audienceSources(c.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','No case-specific fair-use finding, Copyright claim outcome, YPP admission, creator revenue or net profit has been measured.'));
 const link=make('a','inline-link','Read reuse, originality, and Content ID distinctions ↗');
 link.href='./ontology/youtube/reaction-compilation-rights.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderPatreonRevenueShock(data,dossier){
 if(!data?.shock?.reported_change_percent)return null;
 const section=make('section','patreon-shock-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Subscription loss and creator adaptation · historical 2015 study'));
 details.append(make('p','measure-limit','A 2026 peer-reviewed natural experiment studies YouTubers affected by Patreon disruption in 2015; these are not current YouTube member cancellation rates or typical creator profits.'));
 const grid=make('div','ownership-grid');
 for(const item of [
  {title:'Patreon receipts',value:'−33.59%',limit:'Treated sample before/after decline, not a DiD causal coefficient'},
  {title:'Monthly video production',value:'−7.7%',limit:'Conservative difference-in-differences output estimate, conditional on historical model assumptions'},
  {title:'Affiliate and sponsor placements',value:'Increased',limit:'Observed advertising incidence, not measured commission or contract earnings'},
  {title:'Historical mid-roll proxy',value:'No significant rise',limit:'Video-duration threshold is not actual served ad impressions'}
 ]){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.title));
  card.append(make('strong','',item.value));
  card.append(make('p','measure-limit',item.limit));
  card.append(audienceSources(data.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Paid affiliate commissions, sponsorship amounts, creator labor and profit are unknown; findings cannot predict 2026 earnings.'));
 const link=make('a','inline-link','Read the published design, results and limitations ↗');
 link.href='./ontology/youtube/patreon-revenue-shock-2015.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderExternalLinkFunnel(data,dossier){
 if(!data?.surfaces?.length)return null;
 const section=make('section','external-link-funnel');
 const details=make('details','ownership-details');
 details.append(make('summary','','Clickable links, Shorts limitations and product funnels'));
 details.append(make('p','measure-limit','A URL in a Shorts comment or description is not clickable, even though a related-video link can be. Long-form external links require advanced-feature eligibility.'));
 const grid=make('div','ownership-grid');
 for(const item of data.surfaces){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.label));
  const status=item.external_url_clickable===null?'Internal route':item.external_url_clickable?'External URL may be clickable':'External URL not clickable';
  card.append(make('p','',status));
  card.append(make('p','measure-limit',item.limitation));
  card.append(audienceSources(item.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Actual link clicks, distinct buyers, marketing costs and net revenue are not measured; no test has been launched.'));
 const link=make('a','inline-link','Read platform links policy and funnel measurement gates ↗');link.href='./ontology/youtube/external-link-funnel-evidence.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderFirstUploadVlogStudy(data,dossier){
 if(!data?.earnings_value_model)return null;
 const section=make('section','first-upload-vlog');
 const details=make('details','ownership-details');
 details.append(make('summary','','New daily-life vloggers: observed views versus hypothetical ad value'));
 details.append(make('p','measure-limit','A selected 107-channel preprint finds 51.4% below 1,000 lifetime views. Its dollar amounts model advertising value from views; no YouTube payouts, cash costs or measured creator time were obtained.'));
 const grid=make('div','ownership-grid');
 for(const item of [
  {title:'Sampled first-upload channels',value:data.sampling.first_upload_cohort_channels,reason:'Keyword-discovered, two daily-life vlog genres'},
  {title:'Below 1,000 lifetime views',value:data.cold_start_public_views.below_1000_lifetime_views_percent+'%',reason:'Observed public view counts in sampled channels'},
  {title:'Modeled median long-form ad value',value:'USD '+data.earnings_value_model.median_modeled_longform_value_usd.toFixed(2),reason:'Assumed USD 2.30 RPM; not actual paid income'},
  {title:'Modeled median labor',value:data.earnings_value_model.median_assumed_hours+' hours',reason:'Assumed three labor hours per finished video minute; no time logs'}
 ]){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.title));
  card.append(make('strong','',item.value));
  card.append(make('p','measure-limit',item.reason));
  card.append(audienceSources([data.source_id],dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','All-creator zero-earner fraction, real channel profit and any causal benefit of additional uploads remain unmeasured.'));
 const link=make('a','inline-link','Read the study and its modeled-income limitations ↗');
 link.href='./ontology/youtube/first-upload-vlog-study-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCreatorPayoutScale(model,dossier){
 if(!model?.reported_windows?.length)return null;
 const section=make('section','creator-payout-scale');
 const details=make('details','ownership-details');
 details.append(make('summary','','YouTube creator, media and music industry payouts'));
 details.append(make('p','measure-limit','First-party global payout disclosures across different, overlapping calendar windows. Includes artists and media companies, not individual earnings or verified creator income medians.'));
 const grid=make('div','ownership-grid');
 for(const item of model.reported_windows){
  const card=make('article','ownership-card');
  const name=item.id==='four_years_to_dec2024'?'Global payments, 2021–2024':
    item.id==='four_years_before_jan2026'?'Rolling 4 years in Jan 2026':'Music industry, Jul 2024–Jun 2025';
  card.append(make('h5','',name));
  card.append(make('strong','',(item.operator==='strictly_greater_than'?'More than ':'About ')+'USD '+item.value_usd_billions+' billion'));
  card.append(make('p','measure-limit','Payment recipients may include labels, rights holders and media companies; no creator pay distribution'));
  card.append(audienceSources([item.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Overlapping four-year windows and music subsets cannot be added. These payout statements differ from Alphabet corporate advertising revenues and Oxford modeled U.S. GDP impact.'));
 const link=make('a','inline-link','Read payout period, recipient and rights-holder limits ↗');
 link.href='./ontology/youtube/platform-creator-payout-scale.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderAlphabetAdRevenue(model,dossier){
 if(!model?.observations?.length)return null;
 const section=make('section','alphabet-ad-revenue');
 const details=make('details','ownership-details');
 details.append(make('summary','','Alphabet SEC: YouTube advertising revenue by accounting period'));
 details.append(make('p','measure-limit','Reported corporate YouTube advertising revenue in USD millions: not creator payouts, user counts, net profits or a creator RPM distribution. The interim 10-Q is unaudited.'));
 const grid=make('div','ownership-grid');
 for(const row of model.observations){
  const card=make('article','ownership-card');
  const label=row.period_kind==='calendar_year'?'Full year '+row.year:
    row.period_kind==='quarter_q2'?'Second quarter '+row.year:'First half '+row.year;
  card.append(make('h5','',label));
  card.append(make('strong','','USD '+(row.value_usd_millions/1000).toFixed(3)+' billion'));
  card.append(make('p','measure-limit',row.period_start+' to '+row.period_end+' · Alphabet ads line only'));
  card.append(audienceSources([row.source_id],dossier));
  grid.append(card);
 }
 details.append(grid);
 if(model.disclosed_2025_total){
  const summary=make('article','ownership-card');
  summary.append(make('h5','','2025 YouTube ads + subscriptions'));
  summary.append(make('strong','','More than USD 60 billion'));
  summary.append(make('p','measure-limit','Strict corporate annual revenue lower bound, not the separate US GDP impact estimate or creator payouts.'));
  summary.append(audienceSources([model.disclosed_2025_total.source_id],dossier));
  details.append(summary);
 }
 details.append(make('p','measure-limit','The first half includes the second quarter: do not add those values. Alphabet does not disclose YouTube subscriptions separately in these tables. Global 2026 annual revenue, typical creator cash earnings and zero-earner prevalence remain unknown.'));
 const link=make('a','inline-link','Read SEC revenue reconciliation and limits ↗');
 link.href='./ontology/youtube/alphabet-youtube-ads-sec-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderOxfordCreatorImpact(model,dossier){
 if(!model?.survey?.response_counts?.length)return null;
 const section=make('section','oxford-creator-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Oxford 2026: creator survey samples versus modeled economic impact'));
 details.append(make('p','measure-limit','YouTube-invited creator respondents are a selected sample, not an all-creator census. EU27 includes France and Germany: overlapping sample frames must not be added as distinct creator populations.'));
 const grid=make('div','ownership-grid');
 for(const row of model.survey.response_counts){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.place));
  card.append(make('strong','','Creator responses: '+row.creator.toLocaleString('en-US')));
  card.append(make('p','','Business responses: '+row.business.toLocaleString('en-US')+' · User responses: '+row.user.toLocaleString('en-US')));
  card.append(make('p','measure-limit','Survey responses, not active channels, customers or earned USD'));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','2025 U.S. modeled impact: more than USD 60 billion contributed to GDP and more than 540,000 supported full-time-equivalent jobs. Neither is median creator income, verified creator payout, or headcount. The creator FTE component excludes those reporting fewer than eight YouTube work hours per week.'));
 details.append(make('p','measure-limit','Earlier 2024 U.S. Oxford impact headline: over USD 55 billion GDP and approximately 490,000 supported FTE jobs. Both annual reports use modeled and rounded bounds; no year-on-year growth rate or actual headcount is established.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read Oxford sampling and income-interpretation limits ↗');
 link.href='./ontology/youtube/oxford-creator-impact-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderChannelCohorts(model,dossier){
 if(!model?.datasets?.length)return null;
 const section=make('section','channel-cohort-evidence');
 const details=make('details','ownership-details');
 details.append(make('summary','','Indexed channels and 360-day subscriber milestone outcomes'));
 details.append(make('p','measure-limit','61.2 million sampled public-subscriber channels and a distinct 32.9 million-channel below-1k cohort. Both are selected vendor index populations, not a census or verified first-year creator income.'));
 const grid=make('div','ownership-grid');
 const m=model.datasets[0],s=model.datasets[2];
 for(const band of s.bins){
  const card=make('article','ownership-card');
  const end=band.video_delta_max===null?' or more':'–'+band.video_delta_max;
  card.append(make('h5','','Net public video count +'+band.video_delta_min+end));
  card.append(make('strong','',band.reported_percent.toFixed(2)+'% ending at 1,000+ subscribers'));
  card.append(make('p','',band.reached_1000_at_end.toLocaleString('en-US')+' of '+band.channels.toLocaleString('en-US')+' indexed channels'));
  card.append(make('p','measure-limit','360 days, no random assignment, new-entrant identification, actual uploads or YPP earnings'));
  card.append(audienceSources([s.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const cross=model.niche_maturity_contrasts;
 if(cross?.kind==='new_vs_established_conditional_niche_crosswalk'){
  const group=make('div','niche-maturity-evidence');
  group.append(make('h5','','Newer versus established channels: two distinct vendor samples'));
  const tube=cross.tubeai,band=tube.selected_band;
  group.append(make('p','measure-limit',
    'TubeAI curated active 10k+ subscriber channels: '+tube.new_at_10k.toLocaleString('en-US')+
    ' of '+tube.eligible_indexed_10k_channels.toLocaleString('en-US')+' indexed channels were created in 2024 or later. Not the chance of success for a newcomer.'));
  const selected=tube.niches.filter(n=>['ai_machine_learning','gaming','animation_vfx'].includes(n.id));
  group.append(make('p','measure-limit',selected.map(n=>
    n.label+': '+n.published_newer_share_percent+'% of indexed active 10k+ channels are newer'
   ).join(' · ')+'. These are outcome-conditioned shares, not probabilities of building a successful channel.'));
  group.append(make('p','measure-limit','Within already-successful 10k–99k subscriber accounts, '+band.newer.channels.toLocaleString('en-US')+
   ' newer channels had a median catalog of '+band.newer.median_public_catalog_videos+
   ' videos, versus '+band.older.median_public_catalog_videos+' among '+band.older.channels.toLocaleString('en-US')+
   ' older channels. Channel age and selection are confounded.'));
  const vi=cross.vidiq;
  group.append(make('p','measure-limit','Separate vidIQ 360-day selected newer gaming cohort ('+vi.indexed_channels.toLocaleString('en-US')+
   ' channels): '+vi.niches.map(n=>n.id.replaceAll('_',' ')+': '+n.published_1k_percent+'% ended at 1k+ subscribers').join(' · ')+
   '. Not a matched mature cohort, representative newcomer odds, YouTube Partner Program outcome or creator profit.'));
  group.append(audienceSources([tube.source_id,vi.source_id],dossier));
  details.append(group);
 }
 details.append(make('p','measure-limit','Separate July distribution: '+m.included_channels.toLocaleString('en-US')+' indexed channels with at least one subscriber. The group comparisons do not prove uploading causes growth or that creators earn money.'));
 const link=make('a','inline-link','Read cohort sampling, percentages and non-causal limitations ↗');
 link.href='./ontology/youtube/channel-cohort-observations-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderAgentioEngagedViews(model,dossier){
 if(!model?.studies?.length)return null;
 const section=make('section','agentio-engaged-view-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','August 2026 public vs engaged views: modeled forecast and observed owner data'));
 details.append(make('p','measure-limit','A first-frame public view is not an engaged view. The observed vendor-specific ratio is not a universal engaged-to-public conversion factor or verified new creator income.'));
 const grid=make('div','ownership-grid');
 const obs=model.studies[1];
 for(const [label,value,limit] of [
 ['Prechange retention forecast','35,800 videos','Assumed 30-second proxy; modeled ~30% gap, not measured official long-form engagement'],
 ['Observed postchange videos','75,000+','Permissioned vendor selected channels, not representative YouTube population'],
 ['Observed public view events','549 million','Rounded sample total, not unique people'],
 ['Observed engaged view events','330 million','Rounded total, separate from public playback starts'],
 ['Reported engaged share','About 60%','Sample-specific and time-limited, not global conversion'],
 ['Browse versus watch page','20% vs 85%','Distinct placement contexts; 77% share of gap from browse, not all views']
 ]){
  const c=make('article','ownership-card');
  c.append(make('h5','',label));c.append(make('strong','',value));c.append(make('p','measure-limit',limit));grid.append(c);
 }
 details.append(grid);details.append(audienceSources(model.source_ids.concat([model.official_measurement_change_source_id]),dossier));
 details.append(make('p','measure-limit','Creator eligibility, buyers, net earnings and causal viewing changes remain unmeasured. Published tiers and genres have selected denominators.'));
 const link=make('a','inline-link','Read the modeled and observed samples and denominator controls ↗');
 link.href='./ontology/youtube/agentio-engaged-view-series-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderWatchPageAdAccounting(model,dossier){
 if(!model?.authorized_reporting_metrics?.length)return null;
 const section=make('section','watch-page-accounting');
 const details=make('details','ownership-details');
 details.append(make('summary','','Long-form watch-page ad earnings: gross versus eligible net and creator payout'));
 details.append(make('p','measure-limit','55% of eligible net watch-page ad receipts, not 55% of advertiser grossRevenue or CPM. Ad slots never guarantee served impressions.'));
 const grid=make('div','ownership-grid');
 const items=[
  ['Contract share','55% of eligible net','The eligible net contract base is not publicly disclosed by video; eligibility and accepted module are required'],
  ['grossRevenue','Gross advertiser USD','Not creator net revenue and cannot independently bridge to the 55% base'],
  ['estimatedAdRevenue','Estimated creator ad net','Already after applicable revenue sharing; not to be multiplied by 55% again'],
  ['estimatedRevenue','Estimated creator total net','Potentially includes ad-only and Premium components; do not add reported parts again'],
  ['Ad impressions','Number of verified ads','Several ads may run in one monetized playback; differs from video views'],
  ['Monetized playbacks','Views with at least one ad','Can count a preroll exit before video content begins'],
  ['CPM versus playback CPM','Different gross denominators','Per 1,000 ad impressions versus per 1,000 monetized playbacks'],
  ['Mid-roll opportunities','8+ minute eligible videos','Manual/automatic ad slots are not guaranteed to serve any ads']
 ];
 for(const [label,value,limit] of items){
  const card=make('article','ownership-card');card.append(make('h5','',label));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','No creator API access or payments have been observed. Finalized balance, actual bank receipt, costs and creator profit remain unknown.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read official accounting and payout worksheet restrictions ↗');
 link.href='./ontology/youtube/watch-page-ad-accounting.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderLiveMonetizationUnits(model,dossier){
 if(!model?.gifts || !model?.commerce_products?.length)return null;
 const section=make('section','live-monetization-units');
 const details=make('details','ownership-details');
 details.append(make('summary','','Live money: Supers, memberships and Gifts have different payout denominators'));
 details.append(make('p','measure-limit','Super Chat and memberships apply 70% to eligible net Commerce receipts. Gifts use earned Rubies under Virtual Items; Rubies do not take a further 70% Commerce cut.'));
 const grid=make('div','ownership-grid');
 const cards=[
 ['Supers and Stickers','70% of eligible net','Commerce module; not gross viewer payment or all live chat participants'],
 ['Channel memberships','70% of eligible net','Monthly members paying for perks, not all channel subscribers'],
 ['Earned Gifts','USD 0.01 per Ruby','Virtual Items; two Jewels redeemed per Ruby, not a second 70% deduction'],
 ['Current gift surfaces','Horizontal + vertical','Eligible live streams only; account, region, moderation and content restrictions apply']
 ];
 for(const [label,value,limit] of cards){
  const card=make('article','ownership-card');card.append(make('h5','',label));card.append(make('strong','',value));
  card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','No real paid attendee counts, bank deposits, refund rates, stream profit or unique paying viewer ratios have been observed.'));
 const link=make('a','inline-link','Read current Gifts, Supers, net share and eligibility source rules ↗');
 link.href='./ontology/youtube/live-monetization-units-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderMemeTrendingEvidence(model,dossier){
 if(!model?.archive?.snapshots)return null;
 const section=make('section','meme-trending-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Memes and fandom lore: historical trending archive versus 2026 survey'));
 details.append(make('p','measure-limit','Historic ranked snapshots and selected survey awareness, not individual viewers or measured creator earnings.'));
 const grid=make('div','ownership-grid');
 const entries=[
 ['Old Trending country snapshots',model.archive.snapshots.toLocaleString('en-US'),'2022–2025 country-time captures before removal of old Trending pages'],
 ['Ranked video entries','Approximately 78.4 million','Repeated positions and country-time appearances, not unique videos'],
 ['Distinct archived video IDs',model.archive.unique_video_ids.toLocaleString('en-US'),'Historical curated ranking coverage, not all uploaded videos'],
 ['Survey meme awareness',model.survey.observation[0].percent+'%','Among '+model.survey.online_age_14_29_sample_size+' U.S. online respondents ages 14–29, perceived recognition, not actual watching'],
 ['Survey niche-story viewing',model.survey.observation[3].percent+'%','Self-report that overlaps with other niche/fandom answers']
 ];
 for(const [name,value,limit] of entries){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','Historical trending was discontinued July 2025. No meme-labelled video census, cross-channel migration or creator payments were measured.'));
 const link=make('a','inline-link','Read meme taxonomy and unit restrictions ↗');
 link.href='./ontology/youtube/meme-trending-observability-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderEducationalVideoStudies(model,dossier){
 if(!model?.studies?.length)return null;
 const section=make('section','educational-video-studies');
 const details=make('details','ownership-details');
 details.append(make('summary','','Empirical science, instruction and mathematics video samples'));
 details.append(make('p','measure-limit','Three different selected educational video cohorts, not a universal best video length or typical creator earnings.'));
 const grid=make('div','ownership-grid');
 for(const x of model.studies){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')));
  card.append(make('strong','',x.selected_videos.toLocaleString('en-US')+' selected videos'));
  card.append(make('p','',x.within_study_findings[0]));
  card.append(make('p','measure-limit',x.warning));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','Study outcomes include owner-authorized retention metrics versus public views, likes and comments, which are not interchangeable.'))
 if(model.statistics_search_quality_case){details.append(make('p','measure-limit','A separate 2025 search sample screened 200 statistics-video URLs to 114 English videos; 87 rated high quality by expert rubric. Not a population estimate or measured creator profit.'));}
;
 const link=make('a','inline-link','Read study samples and measurement constraints ↗');
 link.href='./ontology/youtube/educational-video-format-cohorts-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderPublicCommentLanguageResearch(model,dossier){
 if(!model?.video_language_fields?.length)return null;
 const section=make('section','public-comment-language-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Multilingual community participation: public comments are not people'));
 details.append(make('p','measure-limit','Official API fields and public reply pagination: not unique people or viewer language, and no comments or author identities were collected.'));
 const grid=make('div','ownership-grid');
 const rows=[
  ['Title/description language','defaultLanguage','Text metadata language, not spoken audio'],
  ['Default audio language','defaultAudioLanguage','Video track metadata, not audience language or all available dubs'],
  ['Public top-level comments','commentThreads.list','Published thread events, not unique speaking people'],
  ['Public replies','comments.list','Parent-ID pagination required; moderated and deleted replies may be inaccessible']
 ];
 for(const [name,value,limitation] of rows){const card=make('article','ownership-card');
   card.append(make('h5','',name));card.append(make('strong','',value));
   card.append(make('p','measure-limit',limitation));grid.append(card);}
 details.append(grid);
 details.append(make('p','measure-limit','Language labels would be coded only for aggregates with unknown/mixed categories. A comment language cannot establish residence, ethnicity, political or religious identity.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read language-coded public comment research boundaries ↗');
 link.href='./ontology/youtube/public-comment-language-protocol-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderPublicCommunityPosts(model,dossier){
 if(!model?.discoverability?.length)return null;
 const section=make('section','public-community-post-protocol');
 const details=make('details','ownership-details');
 details.append(make('summary','','Public creator communities: Posts versus video comment threads'));
 details.append(make('p','measure-limit','Public Post format and visibility study. A published post is not a counted viewer, a paying member or proof of audience growth.'));
 const grid=make('div','ownership-grid');
 const cards=[
 ['Post formats','Text, image, GIF, poll, quiz and video','Channel and feed visibility depends on eligibility and recommendations'],
 ['Where Posts may appear','Posts tab, Home, Subscriptions and some Shorts surfaces','Distribution and distinct reached people are not publicly enumerated'],
 ['Video comments API','Thread lists, up to 100 per page','Video/channel comments are not a complete enumeration of Creator Posts'],
 ['Privacy and comparison','Public aggregate counters only','No commenter IDs, private communities, protected traits or unique member census']
 ];
 for(const [name,value,limit] of cards){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));
  card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','No real public Post sample, no verified unique member count or earnings, and no exposure denominator have been collected.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read public Post sampling and comment API limitations ↗');
 link.href='./ontology/youtube/public-community-post-protocol.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderLanguageAudienceCrosswalk(model,dossier){
 if(!model?.sources_and_units?.length)return null;
 const section=make('section','language-audience-crosswalk');
 const details=make('details','ownership-details');
 details.append(make('summary','','Language audiences: metadata, dubbing, captions and viewer country are different'));
 details.append(make('p','measure-limit','Official API definitions, not a global language census: country is not language and a translated title is not a viewer identity or speaker count.'));
 const grid=make('div','ownership-grid');
 for(const x of model.sources_and_units){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id));
  card.append(make('p','',x.source));
  card.append(make('p','measure-limit',x.cannot_establish));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','No owner-authenticated country reports or caption tracks were fetched. Missing primary audio labels and unknown viewer languages remain unknown.'));
 const link=make('a','inline-link','Read language sampling and population boundaries ↗');
 link.href='./ontology/youtube/language-audience-api-crosswalk-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderNichePilotBudget(model,dossier){
 if(!model?.required_plan_fields?.length)return null;
 const section=make('section','niche-pilot-budget');
 const details=make('details','ownership-details');
 details.append(make('summary','','Niche pilot: prespecified cash, work hours and stopping rules'));
 details.append(make('p','measure-limit','Explicit budget and observation method, not measured creator earnings or a guaranteed viable niche. No actual creator pilot has been run.'));
 const grid=make('div','ownership-grid');
 for(const [label,value,warning] of [
  ['Cash investment','7 new-spending classes','Owned equipment allocation is separate from new cash spent'],
  ['Labor','9 measured work categories','Includes unsuccessful and abandoned research, editing, publishing and administration'],
  ['Pilot scope','Topic, format and episode count','Prespecify timeframe and compatible primary exposure metric'],
  ['Decision gates','Cash cap / labor cap / date','Missing exposure cannot become a positive audience outcome']
 ]){
  const card=make('article','ownership-card');
  card.append(make('h5','',label));
  card.append(make('strong','',value));
  card.append(make('p','measure-limit',warning));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','An exhausted spending cap is a pause on further commitments, not statistical proof of failed audience demand.'));
 const link=make('a','inline-link','Read pilot method, data-entry schema and exclusion rules ↗');
 link.href='./ontology/youtube/niche-pilot-budget-protocol.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderAIRRevenueConcentration(model,dossier){
 if(!model?.ad_revenue_distribution?.groups?.length)return null;
 const section=make('section','air-revenue-concentration');
 const details=make('details','ownership-details');
 details.append(make('summary','','AIR 300 monetized channels: revenue concentration and month-of-year RPM'));
 details.append(make('p','measure-limit','Same underlying selected 300 monetized channels as original July report: not global creator profit or zero earner prevalence. Ad receipts and RPM are not individual wages.'));
 const vals=[
  ['Top 10% of channels','58% of ad revenue','30 selected AIR channels, not all creators'],
  ['Bottom 50% of channels','4% of ad revenue','150 channels, excludes nonmonetized and missing creators'],
  ['Subscriber size RPM','2.14 vs 2.04 USD','Median RPM for 10K–100K vs 100K–10M subscriber cohorts; not monthly income'],
  ['January selected median RPM','1.56 USD','Selected monetized owner channel-months, not prospective profit'],
  ['November selected median RPM','2.35 USD','Observed calendar-month sample, not a guaranteed future seasonal uplift']
 ];
 const grid=make('div','ownership-grid');
 for(const [name,value,limit] of vals){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read nested concentration, same-sample provenance and seasonal restrictions ↗');
 link.href='./ontology/youtube/air-300-revenue-concentration-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderEvergreenSearchWindows(model,dossier){
 if(!model?.disjoint_video_age_windows_days?.length)return null;
 const section=make('section','evergreen-search-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Search-driven tutorial demand: repeat windows versus recent trends'));
 details.append(make('p','measure-limit','Owner Reach and traffic-source API definitions, not absolute keyword search volume or creator earnings. No actual long-term tutorial cohort has been observed.'));
 const grid=make('div','ownership-grid');
 const rows=[
  ['Launch: 0–30 days','Search, Browse, Suggested, external views','Track source-labelled events from initial exposure'],
  ['Follow-up: 31–180 days','Same source-labelled owner metrics','Separate retained search attention from initial launch totals'],
  ['Later: 181–365 days','Same metric per age-matched cohort','Longer-lived search traffic is not verified passive income'],
  ['Studio Trends','Recent 28-day ordinal interest','Not actual absolute searches, unique visitors or a future forecast'],
  ['API constraint','At most 50,000 video-days for relevant queries','Safe query batching, not a size of the creator market']
 ];
 for(const [name,value,limit] of rows){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read cohort design and attribution constraints ↗');
 link.href='./ontology/youtube/evergreen-search-window-protocol.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderAIRCountryAdvertiserCPM(model,dossier){
 if(!model?.observations?.length)return null;
 const section=make('section','air-country-cpm');
 const details=make('details','ownership-details');
 details.append(make('summary','','2025 AIR channel sample: advertiser CPM by viewer country'));
 details.append(make('p','measure-limit','2025 vendor-selected advertiser prices per thousand impressions: not creator RPM or resident income, bank payouts or a current global market census.'));
 const grid=make('div','ownership-grid');
 for(const x of model.observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.country_name));
  card.append(make('strong','',x.value_usd_per_thousand_ad_impressions.toFixed(2)+' USD CPM'));
  card.append(make('p','measure-limit','Advertiser impression price, not creator income; country sample n and auction dates unreported'));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Mexico: not listed among published high/low markets; unknown is not zero. The sample may overlap later AIR client studies.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read vendor sample and missing-market limitations ↗');
 link.href='./ontology/youtube/air-2025-viewer-cpm-countries.md';
 link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderFashionLifestyleSignals(model,dossier){
 if(!model?.content_categories?.length)return null;
 const section=make('section','fashion-lifestyle-signals');
 const details=make('details','ownership-details');
 details.append(make('summary','','Fashion and lifestyle videos: GRWM, prom, sewing and other formats'));
 details.append(make('p','measure-limit','Official historical video events by different title/date filters, not audience sex or gender or typical creator earnings.'));
 const grid=make('div','ownership-grid');
 for(const [name,value,limitation] of [
  ['GRWM title videos, Jan–Jun 2023','More than 6B views','Global GRWM title variants through June 5, not a full-year statistic'],
  ['Prom and GRWM title videos, 2024','More than 25M views','Global prom AND GRWM title filter, not a GRWM trend'],
  ['Beginner sewing videos, 2025','More than 100M views','Global sewing-machine-related videos with beginner in title'],
  ['Defined content families','6 overlapping categories','Genres describe the video, not demographics, buyers or income']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limitation));grid.append(card);
 }
 details.append(grid);
 if(model.beauty_subtopic_frames?.length){
  const sample=make('div','ownership-grid');
  for(const item of model.beauty_subtopic_frames){
   const card=make('article','ownership-card');
   card.append(make('h5','',item.content_family.replaceAll('_',' ')));
   card.append(make('strong','',item.lower_bound.toLocaleString()+'+ historical video view events'));
   card.append(make('p','measure-limit',item.window_start+' – '+item.window_end+' · '+item.population));
   card.append(audienceSources([item.source_id],dossier));sample.append(card);
  }
  details.append(sample);
 }
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read genre boundaries and incompatible dates ↗');
 link.href='./ontology/youtube/fashion-lifestyle-content-signals-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderSmallChannelDiscovery(model,dossier){
 if(!model?.external_channel_observations?.length)return null;
 const section=make('section','small-channel-discovery');
 const details=make('details','ownership-details');
 details.append(make('summary','','Small channel discovery: public subscribers versus owner-only Reach'));
 details.append(make('p','measure-limit','Large selected vendor cohorts are not owner-only thumbnail impressions, CTR or a representative first-time creator success sample.'));
 const grid=make('div','ownership-grid');
 for(const [name,value,limit] of [
  ['July indexed channels','61.19 million','At least one public subscriber, excludes indexed zero/unknown counts'],
  ['September under-1k cohort','32.93 million','Started below 1,000, not necessarily a new creator'],
  ['Subscriber milestone','500,409','Selected cohort ending at 1,000+, not verified YPP earnings'],
  ['Owner Reach impressions','Unavailable','Needs actual authorized video/surface/date reporting'],
  ['Matched newcomer study','Not yet collected','Requires first-upload age, exposure, zero impressions and format-matched windows']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read sampling and impression-denominator requirements ↗');
 link.href='./ontology/youtube/small-channel-discoverability-protocol.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderVideoEssayCohort(model,dossier){
 if(!model?.frame_2?.distinct_selected_video_essays)return null;
 const section=make('section','video-essay-cohort');
 const details=make('details','ownership-details');
 details.append(make('summary','','Video essays: BFI curated runtimes versus YouTube view events'));
 details.append(make('p','measure-limit','2024 platform views and expert-nominated work samples are different denominators, not a representative creator income or attention study.'));
 const grid=make('div','ownership-grid');
 for(const [name,value,limit] of [
  ['YouTube-related video essay views','More than 200 million','Global 2024 playback events, not unique people or income'],
  ['BFI selected works',model.frame_2.distinct_selected_video_essays.toLocaleString('en-US'),'Expert-curated 2024 choices, not all uploaded essays'],
  ['BFI YouTube works',model.frame_2.youtube_published_essays_selected.toLocaleString('en-US'),'Selected publications only; mean '+model.frame_2.selected_youtube_mean_minutes+'-minute runtime'],
  ['BFI Vimeo works',model.frame_2.vimeo_published_essays_selected.toLocaleString('en-US'),'Selected publications only; mean '+model.frame_2.selected_vimeo_mean_minutes+'-minute runtime'],
  ['External supporter links','Over 70%','Among selected YouTube-published essays, not verified paid conversions']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read format, sample and attention measurement restrictions ↗');
 link.href='./ontology/youtube/video-essay-sample-observations-2024.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCountryPolicyCrosswalk(model,dossier){
 if(!model?.observations?.length)return null;
 const section=make('section','country-policy-crosswalk');
 const details=make('details','ownership-details');
 details.append(make('summary','','Country policy: listed YPP access versus account payment and content rights'));
 details.append(make('p','measure-limit','Mexico, US and UK public country listings, not verified account approval or creator income. Account currency and claimant-specific video rights remain unknown.'));
 const grid=make('div','ownership-grid');
 for(const x of model.observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.country));
  card.append(make('strong','',x.program_access?.standard_ypp_listed?'Listed for YPP':(x.standard_ypp_geography_listed?'Listed for YPP':'YPP listing not established')));
  const methods=Object.entries(x.payment_methods_by_address).filter(([k,v])=>['eft','wire','hyperwallet','cheque'].includes(k)&&v).map(([k])=>k.toUpperCase()).join(', ');
  card.append(make('p','','Payment-address methods: '+methods));
  card.append(make('p','measure-limit','Actual channel feature approval, account currency and rights claims: unknown'));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Currency thresholds must be selected by the real account reporting currency, not the creator residence. Content ID territory restrictions cannot be inferred from country lists.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read geographic access and missing-personal-account limits ↗');
 link.href='./ontology/youtube/country-policy-and-payout-crosswalk-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderContentIDAppealRoutes(model,dossier){
 if(!model?.stages?.length)return null;
 const section=make('section','content-id-appeals');
 const details=make('details','ownership-details');
 details.append(make('summary','','Copyright claim disputes: 30-day response, 7-day appeal and takedown distinction'));
 details.append(make('p','measure-limit','Published procedural response periods, not creator payout or automatic copyright strikes. No individual appeal success or legal entitlement verified.'));
 const grid=make('div','ownership-grid');
 for(const [label,value,limit] of [
  ['Initial dispute','30 days','Claimant may release, reinstate, request removal or let claim expire'],
  ['Appeal reinstated claim','7 days','Claimant must respond; creator appeal eligibility may be conditional'],
  ['Escalate blocked claim','7 days','Only eligible blocking claims skip the initial dispute'],
  ['Scheduled removal request','7 days','Conditional window to cancel an appeal, not an ordinary claim timer'],
  ['Valid removal request','Possible copyright strike','Copyright takedown is distinct from an ordinary Content ID match']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',label));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read claim dispute, appeal and removal sources ↗');
 link.href='./ontology/youtube/content-id-appeal-routes-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderContentIDRevenueAudit(model,dossier){
 if(!model?.actions?.length)return null;
 const section=make('section','content-id-revenue');
 const details=make('details','ownership-details');
 details.append(make('summary','','Content ID claims: rights, held ad revenue and dispute dates'));
 details.append(make('p','measure-limit','Official platform procedure: held revenue is not creator bank cash, guaranteed profit or a proven violation of copyright.'));
 const grid=make('div','ownership-grid');
 for(const [title,value,limit] of [
  ['Block','Territory-specific','Unavailable video is not a measured dollar loss'],
  ['Track','Viewership statistics','A tracking claim does not document a payment'],
  ['Monetize','Rightsholder may earn ads','Uploader sharing requires an applicable agreement; rate is unknown'],
  ['Dispute within 5 days','Hold from claim date','Revenue remains separately withheld pending a decision'],
  ['Dispute after 5 days','Hold from dispute date','Earlier and later money windows must not be merged'],
  ['After decision','Appropriate recipient','Bank payment and final creator allocation require actual records']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',title));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read Content ID money pathways and date rules ↗');
 link.href='./ontology/youtube/content-id-revenue-dispute-audit.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCreatorProcessingSettlement(model,dossier){
 if(!model?.channels?.length)return null;
 const section=make('section','creator-processing-settlement');
 const details=make('details','ownership-details');
 details.append(make('summary','','Creator money processing: native revenue shares versus affiliate locks and refunds'));
 details.append(make('p','measure-limit','Official product-specific allocation and return rules, not verified creator bank cash, actual after-tax income or market-wide transaction fee rates.'));
 const grid=make('div','ownership-grid');
 const points=[
  ['Memberships','70% of eligible net receipts','YouTube pays card-processing costs; granted refunds reverse the creator share'],
  ['Supers','70% of recognized net receipts','Local sales tax and applicable iOS fees precede the share; YouTube pays card transaction costs'],
  ['Shopping affiliate','Merchant-set commission, not 70%','Shopify merchant pending range: 30–50 days; cancellations and returns can reverse commissions'],
  ['Locked / merchant-billed','Not a creator deposit','A locked transaction billed to a merchant is not proof that a creator received bank cash']
 ];
 for(const [title,value,limit] of points){
  const card=make('article','ownership-card');
  card.append(make('h5','',title));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read official settlement, deductions and refund boundaries ↗');
 link.href='./ontology/youtube/creator-processing-settlement-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCreatorCountryIncomeComparability(model,dossier){
 if(!model?.country_codes?.length)return null;
 const section=make('section','creator-country-income');
 const details=make('details','ownership-details');
 details.append(make('summary','','Country revenue: viewer geography versus creator residence and payment account'));
 details.append(make('p','measure-limit','Viewer country is not creator residence. No authorized country-revenue export, representative creator country earnings, or PPP-adjusted personal profit has been observed.'));
 const grid=make('div','ownership-grid');
 const records=[
  ['Viewer country','country / MX, US, GB','The country associated with authorized owner Analytics activity, not creator nationality'],
  ['Creator residence','Unknown in public Analytics','Needs representative creator cohorts, including nonmonetized and zero earners'],
  ['Payment and reporting currency','Account-specific','Actual AdSense for YouTube account currency, approvals and withholding cannot be inferred from viewer region'],
  ['Consumption-adjusted creator profit','Unmeasured','Requires real after-expense receipts and dated private-consumption PPP, not unverified spot FX or GDP PPP']
 ];
 for(const [name,value,limit] of records){
   const card=make('article','ownership-card');
   card.append(make('h5','',name));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read geography, monetary-access and purchasing-power measurement limits ↗');
 link.href='./ontology/youtube/creator-country-income-comparability.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderAdobeAIProductionSurvey(model,dossier){
 if(!model?.survey?.n)return null;
 const section=make('section','adobe-ai-production-survey');
 const details=make('details','ownership-details');
 details.append(make('summary','','Video production tool surveys: 384 U.S. cross-platform creators'));
 details.append(make('p','measure-limit','Commercial vendor self-report; not measured creator profit or causal savings, nor a YouTube-wide producer study.'));
 const observations=[
 ['US surveyed video creators',model.survey.n,'Prolific survey December 2025, 86% solo'],
 ['Ever used AI video tools',model.survey.ai_video_tool_ever_used_percent+'%','All selected survey respondents'],
 ['Used AI tools weekly',model.survey.weekly_use_among_ai_users_percent+'%','Only the subgroup reporting prior AI use'],
 ['Reported over 30 minutes saved',model.survey.self_reported_ai_saves_over_30_min_percent+'%','Self-perception, no time-logged before/after'],
 ['Reported over four hours saved',model.survey.self_reported_ai_saves_over_4h_percent+'%','Subset of previous category; cannot be added'],
 ['Planned more AI tool spending',model.survey.intended_increase_ai_tools_budget_percent+'%','Intention, not a verified expenditure or earnings result']
 ];
 const grid=make('div','ownership-grid');
 for(const [name,value,limit] of observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources([model.source_id],dossier));
 const link=make('a','inline-link','Read selected creator survey methods and denominators ↗');
 link.href='./ontology/youtube/adobe-ai-production-survey-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderPhotographyLaborStudy(model,dossier){
 if(!model?.time_per_completed_video_hours)return null;
 const section=make('section','photography-production-labor');
 const details=make('details','ownership-details');
 details.append(make('summary','','Real YouTube production labor: one 61-video photography diary'));
 details.append(make('p','measure-limit','One self-tracked creator, not representative creator hourly wages or other channel production costs. Completed published videos only.'));
 const rows=[
 ['Completed videos',model.published_video_count,'Only one photography creator, failed attempts unmeasured'],
 ['Mean recorded labor',model.time_per_completed_video_hours.arithmetic_mean+' hours/video','Not an average for all creators'],
 ['Median recorded labor',model.time_per_completed_video_hours.median+' hours/video','Within one selected creator, not a creator-population median'],
 ['Postproduction time share','50%','Creator-specific editing, metadata and thumbnail effort'],
 ['Work minutes per finished minute',model.work_minutes_per_finished_video_minute.arithmetic_mean,'Within-source ratio, not a universal standard'],
 ['Recorded range',model.time_per_completed_video_hours.minimum+'–'+model.time_per_completed_video_hours.maximum+' hours','Selected completed videos; no earnings or profit data']
 ];
 const grid=make('div','ownership-grid');
 for(const [name,value,limitation] of rows){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));card.append(make('p','measure-limit',limitation));grid.append(card);
 }
 details.append(grid);details.append(audienceSources([model.source_id],dossier));
 const link=make('a','inline-link','Read 61-video time diary and sampling limits ↗');
 link.href='./ontology/youtube/photography-production-time-diary-2025.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCreatorHourlyBounds(model,dossier){
 if(!model?.partial_identification)return null;
 const section=make('section','creator-hourly-bounds');
 const details=make('details','ownership-details');
 details.append(make('summary','','Creator hourly earnings: failed attempts and missing-data bounds'));
 details.append(make('p','measure-limit','Tested cohort arithmetic, not an observed income distribution. Separate creator-hours surveys and selected income studies cannot be divided into a typical wage.'));
 const grid=make('div','ownership-grid');
 for(const [name,value,limit] of [
  ['Attempted creator-periods','All attempted','Include zero receipts, failed pilots, unknown outcomes and recorded sunk labor'],
  ['Descriptive hourly numerator','Net current-period cash','Gross less refunds, fees and paid costs; not net-after-tax wages'],
  ['Positive-hour quantiles','Worst-case interval','Missing positive-hour cash can leave quartile endpoints unbounded (null)'],
  ['Zero gross share','Lower and upper bounds','Denominator includes all attempted creators, including unknown gross receipts'],
  ['Zero-hour attempts','Exclude rate only','The person stays in the cohort; hourly ratio is undefined'],
  ['Observed all-creator median','Unknown','No representative matched YouTube receipt and labor panel was accessed']
 ]){
  const card=make('article','ownership-card');card.append(make('h5','',name));
  card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read missing-data bounds and cohort arithmetic ↗');
 link.href='./ontology/youtube/hourly-income-accounting.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderMonthlyVolatilityProtocol(model,dossier){
 if(!model?.expected_metrics?.length)return null;
 const section=make('section','monthly-income-volatility');
 const details=make('details','ownership-details');
 details.append(make('summary','','Monthly income variability: cash cleared versus account credits'));
 details.append(make('p','measure-limit','Official payment timing and a tested descriptive protocol: no payment is not proof of zero earnings. Payment thresholds and bank timing can create apparent spikes.'));
 const entries=[
  ['Finalized credits','Posted to account','May be associated with a previous activity month, not bank cash'],
  ['Cleared receipts','Bank + disjoint external receipts','Only money actually received; issuance alone is not cash'],
  ['Cash movement','Receipts less paid costs','Can be negative without proving negative accrual profit'],
  ['Zero-deposit streaks','Count consecutive months','Not a count of months with no creator earnings'],
  ['Relative volatility','CV when inflow mean is positive','Descriptive within an observed account, not a creator earnings forecast'],
  ['Selected Patreon cross section','23,435 creator observations','USD 1,490 standard deviation across pooled March samples, not personal month-to-month income volatility']
 ];
 const grid=make('div','ownership-grid');
 for(const [label,value,limit] of entries){
  const card=make('article','ownership-card');
  card.append(make('h5','',label));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Three or more consecutive months, the same reporting currency and explicitly recorded transaction dates are required. No actual creator cash or profit observations were obtained.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read monthly volatility data contract and gaps ↗');
 link.href='./ontology/youtube/monthly-income-volatility-protocol.md';
 link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderMonthlyCreatorCashFlowProtocol(model,gates,dossier){
 if(!model?.native_cycle || !gates?.currencies?.length)return null;
 const section=make('section','monthly-creator-cash-flow');
 const details=make('details','ownership-details');
 details.append(make('summary','','Creator cash-flow ledger: posted, issued and deposited'));
 details.append(make('p','measure-limit','Official monthly payout timing, not an observation of creator earnings or guaranteed deposit dates. Account thresholds depend on actual reporting currency.'));
 const grid=make('div','ownership-grid');
 for(const x of [
  ['Finalize previous-month earnings','7th–12th','Finalized net credit may differ from previously estimated activity'],
  ['Check payment eligibility','20th','Threshold and payment holds; lower account balances carry forward'],
  ['Issue eligible payment','21st–26th','A transfer can be issued without being received by the bank'],
  ['Recognize cleared cash','Actual bank arrival','Bank arrival is not the same as issuance; it may occur in a later month']]){
  const card=make('article','ownership-card');card.append(make('h5','',x[0]));
  card.append(make('strong','',x[1]));card.append(make('p','measure-limit',x[2]));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Documented reporting-account payout thresholds: '+gates.currencies.map(x=>x.currency+' '+x.minimum_payout).join(' · ')+'. All production hours, publication counts, refunds, independent receipts and expenses need explicit records. No actual creator profit or hourly wage is observed.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read the reconciled monthly cashbook and accounting limitations ↗');
 link.href='./ontology/youtube/monthly-creator-cash-flow-protocol.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderAgentioSponsorEvidence(model,dossier){
 if(!model?.selected_aggregates?.length)return null;
 const section=make('section','agentio-sponsor-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Paid YouTube sponsorships: observed long-tail attention and tracked brand actions'));
 details.append(make('p','measure-limit','Vendor-selected paid advertiser cohort, not representative creator pay or verified incremental sales. Late views and clicks have separate denominators.'));
 const grid=make('div','ownership-grid');
 const records=[
 ['Views after day 30','38%','Share of observed sponsored-video views, not deduplicated people'],
 ['Views after day 90','27%','Subset of views after day 30: cannot add shares'],
 ['Sponsor-link clicks after day 30','About 30%','Share of tracked click events, not completed buyer sales'],
 ['Repeat CTR by eighth integration','1.8×','Relative result in selected continuing sponsor relationships; no absolute CTR'],
 ['Repeat CVR by sixth integration','1.9×','Relative result for surviving relationships, not causal creator earnings'],
 ['Advertiser cumulative CPM after a year','54% lower','Selected advertiser spending efficiency, not creator take-home pay']
 ];
 for(const [label,value,limit] of records){
  const card=make('article','ownership-card');
  card.append(make('h5','',label));card.append(make('strong','',value));card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','Historical paid placement sample October 2023–December 2025, predominantly U.S. creators. Selection and renewal biases prevent universal estimates or causal predictions.'));
 const link=make('a','inline-link','Read sample, event units and attribution limitations ↗');
 link.href='./ontology/youtube/agentio-sponsor-delivery-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderShoppingFunnelEvidence(model,dossier){
 if(!model?.frames?.length)return null;
 const section=make('section','shopping-funnel-evidence');
 const details=make('details','ownership-details');
 details.append(make('summary','','YouTube Shopping: ranked purchases, discovery survey and actual merchant metrics'));
 details.append(make('p','measure-limit','Selected transaction-ranked goods are not all orders; survey brand discovery is not purchase; no verified public conversion rate or creator net earnings.'));
 const grid=make('div','ownership-grid');
 for(const x of [
  {name:'Top purchased products',value:model.frames[0].records_selected.toLocaleString('en-US'),limit:'Selected ranked SKUs in H1 2025, not transactions'},
  {name:'Transaction-ranked videos',value:model.frames[1].records_selected.toLocaleString('en-US'),limit:'Selected videos in a 60-day 2025 period'},
  {name:'US Gen Z brand discovery',value:model.frames[2].percent_agree_youtube_helped_discover_unfamiliar_brands_or_products+'%',limit:'Self-reported discovery among '+model.frames[2].surveyed_respondents+' people, not sales'},
  {name:'Merchant analytics measures',value:model.merchant_center.metrics.length,limit:'Private gross/net sales, clicks, orders, commissions and exposure with pending states'}
 ]){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.name));card.append(make('strong','',x.value));
  card.append(make('p','measure-limit',x.limit));grid.append(card);
 }
 details.append(grid);
 if(model.intent_reference_frames?.length===2){
  const [k,m]=model.intent_reference_frames;
  const panel=make('div','shopping-intent-surveys');
  panel.append(make('h5','','Buyer intent: research preference is not completed shopping'));
  panel.append(make('p','measure-limit','Google/Kantar 2025: '+k.overall_sample_n.toLocaleString('en-US')+
   ' selected US weekly video viewers ages 18–64. '+k.observations[0].percent+
   '% preferred video to learn a skill; '+k.observations[4].percent+
   '% agreed YouTube has the best product reviews. Survey opinions, not orders; question-level sample sizes unknown.'));
  panel.append(make('p','measure-limit','Google/Material 2023: '+m.survey_sample_n.toLocaleString('en-US')+
   ' US adult online-video shoppers; seven descriptive shopping journeys from impulse discovery to deliberation and urgent replacement. The 2025 marketing summary rounds the respondent count to 2,000.'));
  panel.append(make('p','measure-limit','Different study populations and fieldwork years cannot be pooled. No matched YouTube purchase conversions, creator profits, or causal shopping lift are observed.'));
  panel.append(audienceSources([k.source_id,m.source_id],dossier));details.append(panel);
 }
 details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','Merchant Center data can suppress low-volume metrics and prohibits re-identifying people or linking sensitive profiles.'));
 const link=make('a','inline-link','Read shopping research units and attribution restrictions ↗');
 link.href='./ontology/youtube/shopping-funnel-evidence-2025.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderYTLiveAttendance(model,dossier){
 if(!model?.sample?.number_of_streams)return null;
 const section=make('section','ytlive-attendance-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','YTLive: 2024 five-minute livestream attendance observations'));
 details.append(make('p','measure-limit','Empirical samples of stream concurrency, not unique viewers or earnings, and not a comparison with recorded videos.'));
 const obs=model.sample;
 const entries=[
 ['Selected livestreams',obs.number_of_streams.toLocaleString('en-US'),'May–June 2024, not all livestreams'],
 ['Concurrent observations','More than '+obs.measurement_records_strictly_greater_than.toLocaleString('en-US'),'Each timestamp counts concurrent presence, not distinct people'],
 ['Sampling interval',obs.sampling_interval_minutes+' minutes','Stream-level interval samples, not individual watch history'],
 ['Duration classes','<120 / 120–240 / >240 minutes','Broadcast length is not viewer session duration']
 ];
 const grid=make('div','ownership-grid');
 for(const [name,value,limitation] of entries){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));
  card.append(make('p','measure-limit',limitation));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Selected weekend, daypart and duration associations do not establish a causal best posting time, buyer conversion or future creator profit.'));
 details.append(audienceSources([model.source_id],dossier));
 const link=make('a','inline-link','Read concurrency dataset and comparability limits ↗');
 link.href='./ontology/youtube/ytlive-attendance-observations-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderLiveChatCultureStudy(model,dossier){
 if(!model?.paper?.final_model_videos)return null;
 const section=make('section','live-chat-culture-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Empirical live chat emotion study: selected messages, not all viewers'));
 details.append(make('p','measure-limit','Peer-reviewed observational model. Selected English-related live chats, not verified creator earnings, experiments on people or a platform population census.'));
 const p=model.paper;
 const entries=[
 ['Initial selected messages',p.initial_filtered_chat_messages.toLocaleString('en-US'),'Across '+p.initial_filtered_videos.toLocaleString('en-US')+' screened videos'],
 ['Modeled final messages',p.final_model_chat_messages.toLocaleString('en-US'),'A further filtered subset across '+p.final_model_videos+' videos'],
 ['Video hours in final sample',p.final_model_total_video_hours.toLocaleString('en-US'),'Selected event time, not unique viewers'],
 ['Peer versus video effect','Up to '+p.endogenous_peer_to_video_influence_ratio_reported_up_to+'×','Modeled chat emotion intensity, not verified causal uplift or income']
 ];
 const grid=make('div','ownership-grid');
 for(const [name,value,limitation] of entries){
  const card=make('article','ownership-card');
  card.append(make('h5','',name));card.append(make('strong','',value));
  card.append(make('p','measure-limit',limitation));grid.append(card);
 }
 details.append(grid);
 const live=model.interaction_paper;
 if(live?.observations?.length===10 && live.excluded_paid_superchats){
  const panel=make('div','live-chat-language-study');
  panel.append(make('h5','','Japanese VTuber chat replies: selected conversational evidence'));
  panel.append(make('p','measure-limit',live.selected_chat_messages.toLocaleString('en-US')+
   ' messages across '+live.streams+' chosen livestreams (first '+live.minutes_per_stream_examined+
   ' minutes each). Public paid Super Chats excluded.'));
  const min=Math.min(...live.observations.map(x=>x.published_referenced_percent));
  const max=Math.max(...live.observations.map(x=>x.published_referenced_percent));
  const delays=live.observations.map(x=>x.mean_reference_lag_seconds);
  panel.append(make('p','measure-limit','Explicitly referenced messages by stream: '+min+'%–'+max+
   '%; mean lag among identifiable references: '+Math.min(...delays)+'–'+Math.max(...delays)+
   ' seconds by stream. Neither figure describes all messages being noticed or a platform-wide audience.'));
  panel.append(make('p','measure-limit','Purposefully selected Japanese-language just-chatting content with researcher-agreed manual coding. No individual chat identities, paid-message responsiveness, causal effect or creator earnings measured.'));
  panel.append(audienceSources([live.source_id],dossier));
  details.append(panel);
 }
 details.append(audienceSources(model.source_ids,dossier));
 details.append(make('p','measure-limit','Top Chat filtering, user moderation, archival edit changes and English-only sampling prevent equating visible chat with the complete livestream audience.'));
 const link=make('a','inline-link','Read sampling, display-mode and model limitations ↗');
 link.href='./ontology/youtube/live-chat-culture-observations-2025.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderVTuberSuperchatStudy(model,dossier){
 if(!model?.creator_superchats)return null;
 const section=make('section','vtuber-superchat-cohort');
 const details=make('details','ownership-details');
 details.append(make('summary','','Selected 1,923 VTubers: real Super Chat distribution and paid-chatting cohorts'));
 details.append(make('p','measure-limit','Peer-reviewed historical study (2017–July 2023). Visible Super Chat transaction amounts, not zero total earnings, verified creator profit or representative all-YouTube payouts.'));
 const c=model.creator_superchats,b=model.commenter_conversion;
 const entries=[
 ['Selected VTuber channels',model.frame.studied_channels.toLocaleString('en-US'),'Not a probability sample of all creators'],
 ['Public Super Chat monthly mean','USD '+c.reported_monthly_mean_usd_equivalent.toLocaleString('en-US'),'Not verified take-home creator income'],
 ['Public Super Chat monthly median','USD '+c.reported_monthly_median_usd_equivalent,'Includes selected channel sample only'],
 ['Channels with no observed Super Chat',(100*c.channels_without_superchat_reported_fraction)+'%','Not zero total creator earnings or full-year payout'],
 ['Chat-posting accounts',b.public_chat_posting_accounts_approx.toLocaleString('en-US'),'Excludes passive viewers and distinct offline people'],
 ['Chatters who sent a Super Chat',b.posted_at_least_one_superchat_percent+'%','Conditional on sending public chat, not all viewers'],
 ['Chatters who bought a membership',b.purchased_at_least_one_membership_percent+'%','Overlaps Super Chat senders: rates are not additive']
 ];
 const grid=make('div','ownership-grid');
 for(const [title,value,limit] of entries){
   const card=make('article','ownership-card');
   card.append(make('h5','',title));card.append(make('strong','',value));
   card.append(make('p','measure-limit',limit));grid.append(card);
 }
 details.append(grid);
 details.append(audienceSources([model.source_id],dossier));
 const link=make('a','inline-link','Read empirical cohort and measurement restrictions ↗');
 link.href='./ontology/youtube/vtuber-superchat-cohort-2025.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderPlaylistSeriesStudy(model,dossier){
 if(!model?.metric_definitions?.length)return null;
 const section=make('section','playlist-series-observability');
 const details=make('details','ownership-details');
 details.append(make('summary','','Playlists and series: owner views versus playlist session depth'));
 details.append(make('p','measure-limit','Official channel-authorized measures, not unique returning viewers, episode completers, buyers or payouts.'));
 const grid=make('div','ownership-grid');
 for(const m of model.metric_definitions){
  const card=make('article','ownership-card');
  card.append(make('h5','',m.id));
  card.append(make('p','',m.report_family.replaceAll('_',' ')+' · '+(m.web_only?'Web starts only':'Other playback contexts may apply')));
  card.append(make('p','measure-limit',m.limitation));grid.append(card);
 }
 details.append(grid);
 const show=model.shows_and_shorts_series;
 if(show?.modes?.length===2){
  const panel=make('div','show-serial-product-evidence');
  panel.append(make('h5','','YouTube Shows: serial versus non-serial episode packaging'));
  panel.append(make('p','measure-limit','Non-serial shows list newest episodes first; serial shows list oldest first and intend sequential viewing. Playlist-to-show conversion begins with Season 1. Episode order is product metadata, not measured viewing behavior.'));
  panel.append(make('p','measure-limit','Shorts series require Shorts-only playlists of portrait or square episodes, maximum '+show.shorts_series.maximum_duration_seconds+' seconds each. Watch Series supports moving between episodes.'));
  panel.append(make('p','measure-limit','No verified show completion, distinct returning viewers, causal retention uplift or series earnings have been measured.'));
  panel.append(audienceSources(show.source_ids,dossier));details.append(panel);
 }
 details.append(make('p','measure-limit','No playlist analytics have been accessed. Web-only playlist starts and video depth are not unique audience, full-series completion or commercial conversion rates.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read definitions and source scope ↗');
 link.href='./ontology/youtube/playlist-series-observability.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderNativePackagingAB(model,dossier) {
 if(!model?.outcomes?.length)return null;
 const section=make('section','native-packaging-ab');
 const details=make('details','ownership-details');
 details.append(make('summary','','Native title and thumbnail tests: concurrent watch-time experiments'));
 details.append(make('p','measure-limit','Eligible owners may test up to three variants on desktop. YouTube chooses by watch-time share, not click-through rate. A winner does not prove more purchases or revenue.'));
 const grid=make('div','ownership-grid');
 for(const outcome of model.outcomes){
  const card=make('article','ownership-card');
  card.append(make('h5','',outcome.id.replaceAll('_',' ')));
  card.append(make('p','',outcome.meaning));
  card.append(audienceSources(model.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Shorts, scheduled live streams, active Premieres, made-for-kids, mature and private videos cannot run these tests; no actual creator test or buyer conversion is measured.'));
 const link=make('a','inline-link','Read eligibility, concurrent allocation and inference boundaries ↗');
 link.href='./ontology/youtube/native-packaging-ab-tests.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderRecommendationEvidence(data,dossier){
 if(!data?.surfaces?.length)return null;
 const section=make('section','recommendation-evidence');
 const details=make('details','ownership-details');
 details.append(make('summary','','Home, Suggested, Shorts and Search: distinct discovery rules'));
 details.append(make('p','measure-limit','Official guidance describes different ranking contexts, not public fixed weights or guaranteed creator reach.'));
 const grid=make('div','ownership-grid');
 for(const x of data.surfaces){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.label));card.append(make('p','',x.claim));
  card.append(audienceSources(x.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','No minimum Shorts posting cadence is required. Exact signal weights, newcomer impressions and net creator income effects are unknown.'));
 const link=make('a','inline-link','Read official recommendation sources ↗');
 link.href='./ontology/youtube/recommendation-surface-evidence.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderSyntheticMediaPolicy(data,dossier){
 if(!data?.policy_axes?.length)return null;
 const section=make('section','synthetic-media-rights');
 const details=make('details','ownership-details');
 details.append(make('summary','','AI-altered video: disclosure, originality, likeness and rights'));
 details.append(make('p','measure-limit','A realistic AI-use disclosure can be required without automatic demonetization. YPP originality, privacy complaints and copyright protection have separate rules.'));
 const grid=make('div','ownership-grid');
 for(const x of data.policy_axes){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.title));
  card.append(make('p','',x.rule));
  card.append(audienceSources(x.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Five policy examples are hypothetical; no AI creator earnings, enforcement prevalence or individual legality was measured.'));
 const link=make('a','inline-link','Read official AI-content and rights rules ↗');
 link.href='./ontology/youtube/synthetic-media-rights-policy.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderVirtualWorshipBoundary(model,dossier){
 if(!model?.survey?.respondents)return null;
 const section=make('section','virtual-worship-boundary');
 const details=make('details','ownership-details');
 details.append(make('summary','','Religious-service video survey: online/TV versus YouTube'));
 details.append(make('p','measure-limit','Pew measured religious services watched online or on television, not specifically YouTube religious audiences or any viewer identity.'));
 const grid=make('div','ownership-grid');
 for(const [heading,value,note] of [
 ['Survey sample',model.survey.respondents.toLocaleString('en-US'),'U.S. adults in 2023–24'],
 ['Monthly online or TV worship',model.survey.monthly_or_more_pct+'%','All digital providers and television combined'],
 ['Weekly online or TV worship',model.survey.weekly_or_more_pct+'%','Subset of monthly online/TV participants'],
 ['Verified YouTube worship users','Unknown','Not identified in Pew survey question']
 ]){const card=make('article','ownership-card');
 card.append(make('h5','',heading));card.append(make('strong','',value));
 card.append(make('p','measure-limit',note));grid.append(card);}
 details.append(grid);details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read survey distinctions and population limits ↗');
 link.href='./ontology/youtube/virtual-worship-not-youtube-audience-2025.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderNeutralNewsAttention(model,dossier){
 if(!model?.polls?.yearly_series?.length)return null;
 const section=make('section','neutral-news-attention');
 const details=make('details','ownership-details');
 details.append(make('summary','','U.S. YouTube news use, neutral content taxonomy and event-window safeguards'));
 details.append(make('p','measure-limit','Pew surveys U.S. adults, not any channel audience political affiliation or actual event-linked creator earnings.'));
 const grid=make('div','ownership-grid');
 const entries=[
 ['Regular YouTube news use in 2026',model.polls.overall_2026_pct_us_adults+'%','All surveyed U.S. adults, not unique verified YouTube viewers'],
 ['Republican/lean-Republican adults',model.polls.party_subgroups[0].value_pct+'%','Within-party regular news prevalence, not viewers who identify as Republican'],
 ['Democratic/lean-Democratic adults',model.polls.party_subgroups[1].value_pct+'%','Within-party regular news prevalence, not viewers who identify as Democratic'],
 ['Event window protocol',model.event_window_design.default_pre_days+' + '+model.event_window_design.default_post_days+' days','Prospective same-geography publication windows; no observed causal effect'],
 ['Google Trends relative index','0–100','Sampled Google Search interest, not YouTube searches or vote share']
 ];
 for(const [label,value,note] of entries){const card=make('article','ownership-card');
  card.append(make('h5','',label));card.append(make('strong','',value));card.append(make('p','measure-limit',note));grid.append(card);}
 details.append(grid);
 details.append(make('p','measure-limit','Content categories classify public videos, not the sensitive beliefs or identities of their viewers. No audience political profiles are collected.'));
 details.append(audienceSources(model.source_ids,dossier));
 const link=make('a','inline-link','Read survey, event-study and political neutrality measurement limits ↗');
 link.href='./ontology/youtube/neutral-news-attention-protocol-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderUSNewsDemographics(data,dossier){
 if(!data?.strata?.length)return null;
 const section=make('section','us-news-demographic-crosswalk');
 const details=make('details','ownership-details');
 details.append(make('summary','','U.S. YouTube use versus regular news use by surveyed groups'));
 details.append(make('p','measure-limit','Two separate Pew surveys: overall YouTube ever-use is not regular news use, a verified biological-sex category or a sample of YouTube creators. Percentages are within the published adult subgroups.'));
 const grid=make('div','ownership-grid');
 for(const item of data.strata){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.subgroup.replaceAll('_',' ')));
  card.append(make('p','',item.ever_use_pct+'% ever use YouTube · '+item.regular_news_pct+'% regularly get YouTube news'));
  card.append(make('p','measure-limit','Different survey respondents and date windows; subgroup uncertainty not published in this comparison.'));
  card.append(audienceSources([item.ever_use_source_id,item.regular_news_source_id],dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','2020–2026 U.S. adult regular YouTube news series: '+data.regular_news_us_adult_series.map(x=>x.regular_news_youtube_pct_of_us_adults+'%').join(', ')+'. Descriptive survey estimates, not causal changes or viewer counts.'));
 details.append(make('p','measure-limit','Biological sex, overlapping age-by-party or age-by-gender audience counts, and subgroup margins of error are unknown.'));
 const link=make('a','inline-link','Read the dated survey comparison and missing evidence ↗');
 link.href='./ontology/youtube/us-news-demographic-crosswalk.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCountryAdReach(d,dossier){
 if(!d?.observations?.length)return null;
 const section=make('section','country-ad-reach'),details=make('details','ownership-details');
 details.append(make('summary','','Country reach: four dated YouTube advertiser estimates'));
 details.append(make('p','measure-limit','Google ad-planner reach, reported in DataReportal Digital 2026 and measured in October 2025, is not monthly active YouTube viewers or verified country growth.'));
 const grid=make('div','ownership-grid');
 for(const x of d.observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.country));card.append(make('strong','',x.ad_reach_million+' million ad-reachable'));
  const change=x.reported_end_2024_to_2025_change_percent;
  card.append(make('p','',('End-2024 to late-2025 planner change: ')+(change>0?'+':'')+change+'%'));
  card.append(make('p','measure-limit','Potential ad reach, not unique viewers, subscribers or creator income'));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Advertiser planning can be revised; published changes do not prove actual people entered or left YouTube.'));
 const link=make('a','inline-link','Read sources and comparability limits ↗');link.href='./ontology/youtube/country-ad-reach-comparisons.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderAudiencePopulationCrosswalk(data,dossier){
 if(!data?.observations?.length)return null;
 const section=make('section','audience-population-crosswalk');
 const details=make('details','ownership-details');
 details.append(make('summary','','Audience scale: past-month surveys, daily visits and ad reach'));
 details.append(make('p','measure-limit','Distinct survey prevalences and country ad-planner reach estimates cannot be combined into an invented platform MAU/DAU count.'));
 const grid=make('div','ownership-grid');
 for(const x of data.observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')));
  card.append(make('strong','',String(x.value)+(x.unit==='percent'?'%':' million')));
  card.append(make('p','',x.scope+' · '+x.time));
  card.append(make('p','measure-limit',x.notes));
  card.append(audienceSources(x.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','The deduplicated worldwide MAU and DAU remain unknown, as does cross-account deduplication.'))
 if(data.us_adult_ever_use_history?.year_values?.length){details.append(make('p','measure-limit','Pew U.S.-adult ever-use series 2018–2026: seven survey observations, with 2020/2022 missing and collection modes changing. Both 2025 and 2026 report 84%; these are not global MAU/DAU.'));}
;
 const link=make('a','inline-link','Read each observation and its denominator ↗');
 link.href='./ontology/youtube/audience-population-crosswalk.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderShortsReferralStudy(data,dossier){
 if(!data?.surfaces?.length)return null;
 const section=make('section','shorts-referral-study');
 const details=make('details','ownership-details');
 details.append(make('summary','','Shorts-to-video links and the missing referral measurements'));
 details.append(make('p','measure-limit','Advanced feature access can allow a clickable related video below a Short. A view of that Short, a destination view and an overlapping viewer are not verified click-through events.'));
 const grid=make('div','ownership-grid');
 for(const x of data.surfaces){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.label));
  card.append(make('p','',x.measurement));
  card.append(make('p','measure-limit','Not equivalent to: '+x.not_equivalent_to.replaceAll('_',' ')));
  card.append(audienceSources(x.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Short-specific link impressions, click-through, deduplicated linked viewers, incremental video value and profit remain unmeasured.'));
 const link=make('a','inline-link','Read the related-video feature and event-attribution gates ↗');
 link.href='./ontology/youtube/shorts-related-video-funnel.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderMemberCohortResearch(data,dossier){
 if(!data?.definition_rules?.length)return null;
 const section=make('section','member-cohort-protocol');
 const details=make('details','ownership-details');
 details.append(make('summary','','Paying member renewals and repeat-offer test design'));
 details.append(make('p','measure-limit','Studio active members, canceled members, access-expired members and recurring transactions have different denominators. No paid cohort or experiment was observed.'));
 const grid=make('div','ownership-grid');
 for(const item of data.definition_rules){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.id.replaceAll('_',' ')));
  card.append(make('p','',item.rule));
  card.append(audienceSources(item.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','A rate needs real paid renewals due by actual billing date, separated from trials and gifts; unresolved events get bounds, not point estimates.'));
 const link=make('a','inline-link','Review cohort arithmetic, missing-data gates and offer-test protocol ↗');
 link.href='./ontology/youtube/member-cohort-protocol.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCheckoutRefundEvidence(data,dossier){
 if(!data?.products?.length)return null;
 const section=make('section','checkout-refund-evidence');
 const details=make('details','ownership-details');
 details.append(make('summary','','Buyer payments, published membership prices and refunds'));
 details.append(make('p','measure-limit','Membership cancellation, non-refundable Supers and external retailer refunds follow distinct processes. Country price schedules are options, not a sample of channel prices or creator profit.'));
 const grid=make('div','ownership-grid');
 for(const item of data.products){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.label));
  card.append(make('p','',item.buyer_action));
  card.append(make('p','measure-limit',item.refund_rule));
  card.append(audienceSources(item.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Official examples: US $0.99/$4.99/$9.99 and Mexico MXN $19/$69/$219. These are published country-tier options, not a real-channel price sample, currency conversion, or guaranteed buyer charge.'));
 details.append(make('p','measure-limit','Creator-specific median prices, refund rates, external merchant margins and net earnings remain unmeasured.'));
 const link=make('a','inline-link','Read checkout and refund source audit ↗');
 link.href='./ontology/youtube/checkout-refund-evidence.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderMonetizationHistory(data,dossier){
 if(!data?.events?.length)return null;
 const section=make('section','monetization-history'), details=make('details','ownership-details');
 details.append(make('summary','','YouTube history: ownership, earning programs and entry rules'));
 details.append(make('p','measure-limit','Historic thresholds are not current rules. The February 2027 YPP changes are announced but not effective as of this October 2026 study.'));
 const grid=make('div','ownership-grid');
 for(const event of data.events){
  const card=make('article','ownership-card');
  card.append(make('h5','',event.event_date+' · '+event.title));
  card.append(make('p','',event.description));
  if(event.stage==='announced_future')card.append(make('p','measure-limit','Announced effective date: '+event.effective_from));
  card.append(audienceSources(event.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read chronology and source limitations ↗');
 link.href='./ontology/youtube/monetization-history-2006-2027.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderMemeFormats(data,dossier){
 if(!data?.formats?.length)return null;
 const section=make('section','meme-format-typology'),details=make('details','ownership-details');
 details.append(make('summary','','Short humor formats, remix rules and non-overlapping measurement'));
 details.append(make('p','measure-limit','Six overlapping forms are not separate audience populations. Shorts Remix attribution and opt-out are distinct from Studio Collaborations; no format-specific earnings or user migration were observed.'));
 const grid=make('div','ownership-grid');
 for(const x of data.formats){const card=make('article','ownership-card');card.append(make('h5','',x.id.replaceAll('_',' ')));card.append(make('p','',x.definition));card.append(audienceSources(x.source_ids,dossier));grid.append(card);}
 details.append(grid);const link=make('a','inline-link','Read format taxonomy and licensing boundaries ↗');link.href='./ontology/youtube/meme-format-typology-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderNicheUploads(data,dossier){
 if(!data?.observations?.length)return null;
 const section=make('section','niche-uploads'),details=make('details','ownership-details');
 details.append(make('summary','','Selected video uploads by topic and period (lower bounds)'));
 details.append(make('p','measure-limit','Official YouTube topic/title upload reports are video-object lower bounds. Different time windows and predicates cannot establish all active uploading channels or creator profit.'));
 const grid=make('div','ownership-grid');
 for(const x of data.observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')));
  card.append(make('p','', 'More than '+x.lower_bound_exclusive.toLocaleString()+' uploaded video objects · '+x.period_start+' to '+x.period_end));
  card.append(make('p','measure-limit',x.scope_notes));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read topic definitions, dates and non-additivity limits ↗');link.href='./ontology/youtube/niche-upload-volume-2024-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderPublicMemeGraph(data,dossier){
 if(!data?.edge_types?.length)return null;
 const section=make('section','public-reference-graph'),details=make('details','ownership-details');
 details.append(make('summary','','Meme propagation: observable video links, not audience migration'));
 details.append(make('p','measure-limit','Only explicitly documented public references and accepted collaborations can form a content graph. No viewer movements, meme origin, causal reach gain or creator income were measured.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read public reference and privacy protocol ↗');link.href='./ontology/youtube/public-meme-reference-graph-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderLanguageMarkets(data,dossier){
 if(!data?.observations?.length)return null;
 const section=make('section','language-market-compatibility'),details=make('details','ownership-details');
 details.append(make('summary','','Language market changes need a matched country and language denominator'));
 details.append(make('p','measure-limit','Multi-audio watched-minute share, auto-dubbing language support and four advertiser planner populations cannot establish comparable language-specific user growth.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read language-market comparability gates ↗');
 link.href='./ontology/youtube/language-market-comparability-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderNicheConcentration(data,dossier){
 if(!data?.global_study)return null;
 const section=make('section','niche-concentration'),details=make('details','ownership-details');
 details.append(make('summary','','Video concentration versus creator income'));
 details.append(make('p','measure-limit','Omdia globally reports 91% of studied video watch time from the top 1% of videos. Niche samples and creator earnings remain unknown.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read matched niche denominator and concentration method ↗');
 link.href='./ontology/youtube/niche-attention-concentration-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderOfferListingControls(data,dossier){
 if(!data?.surfaces?.length)return null;
 const section=make('section','offer-listing'),details=make('details','ownership-details');
 details.append(make('summary','','Video metadata, paid membership tiers and merchant product listings'));
 details.append(make('p','measure-limit','A video title/thumbnail is not a priced sale. Membership billing and merchant purchase flows are different from ad views, subscriber counts and creator profit.'));
 const grid=make('div','ownership-grid');
 for(const x of data.surfaces){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')));
  card.append(make('p','',x.notes));
  card.append(make('p','measure-limit','Price: '+x.price_control.replaceAll('_',' ')));
  card.append(audienceSources(x.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read publication, membership and merchant controls ↗');
 link.href='./ontology/youtube/offer-listing-controls-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderTopicTaxonomyDrift(data,dossier){
 if(!data?.candidate_overlap_examples?.length)return null;
 const section=make('section','topic-taxonomy-drift'),details=make('details','ownership-details');
 details.append(make('summary','','Versioned subculture topics and safe historical comparisons'));
 details.append(make('p','measure-limit','Four hypothetical overlap cases, no reallocation. The original 33 topics, 36 observed source records and taxonomy v1.6 remain unchanged.'));
 const grid=make('div','ownership-grid');
 for(const row of data.candidate_overlap_examples){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.original_topic_id+' → possible '+row.candidate_related_topic_ids.join(', ')));
  card.append(make('p','',row.reason));
  card.append(make('p','measure-limit','Historic '+row.original_metric+' remain in their original source category; new amount unknown.'));
  const a=make('a','inline-link','Original dated observation ↗');a.href=row.original_source_url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);
  grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read taxonomy migration and anti-double-counting rules ↗');
 link.href='./ontology/youtube/taxonomy-drift-protocol-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderAccountPopulationGraph(data,dossier){
 if(!data?.nodes?.length)return null;
 const section=make('section','account-population-graph'),details=make('details','ownership-details');
 details.append(make('summary','','YouTube and Google account, reporting and payment boundaries'));
 details.append(make('p','measure-limit','Sixteen distinct source-backed concepts. No one-to-one account/person matching, unique creator count, payout or profit measured.'));
 const grid=make('div','ownership-grid');
 for(const node of data.nodes){
  const card=make('article','ownership-card');
  card.append(make('h5','',node.label));
  card.append(make('p','',node.description));
  card.append(make('p','measure-limit',node.not_equivalent_to));
  card.append(audienceSources(node.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read 16 product/population boundaries ↗');
 link.href='./ontology/youtube/product-account-population-graph-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderPlannerWindowPanel(data,dossier){
 if(!data?.countries?.length)return null;
 const section=make('section','regional-planner-changes'),details=make('details','ownership-details');
 details.append(make('summary','','Four country YouTube ad-planner changes: two incomparable windows'));
 details.append(make('p','measure-limit','DataReportal / Google ad reach: advertiser estimates, not changes in distinct viewers, real creators or their earnings. Windows end in 2025.'));
 const grid=make('div','ownership-grid');
 for(const country of data.countries){
  const card=make('article','ownership-card');
  card.append(make('h5','',country.country+' · '+country.advertiser_planner_reach_million+'m possible ad reach'));
  const annual=country.reported_end_2024_to_late_2025.change_percent,quarter=country.reported_july_to_oct_2025.change_percent;
  card.append(make('p','',String(annual>0?'+':'')+annual+'% end-2024 to late-2025; '+String(quarter>0?'+':'')+quarter+'% July to October 2025'));
  card.append(make('p','measure-limit','Neither is measured growth in unique people.'));
  card.append(audienceSources([country.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read two-period country comparability study ↗');
 link.href='./ontology/youtube/country-planner-change-windows-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderEvidenceQuality(data,dossier){
 if(!data?.source_records?.length)return null;
 const section=make('section','evidence-quality'),details=make('details','ownership-details');
 details.append(make('summary','','Eight selected source types: what each can and cannot establish'));
 details.append(make('p','measure-limit','Evidence roles are claim-specific. This selected register is not a complete source audit, a general authority score or proof of representative creator income.'));
 const grid=make('div','ownership-grid');
 for(const item of data.source_records){
  const card=make('article','ownership-card');
  card.append(make('h5','',item.role.replaceAll('_',' ')));
  card.append(make('p','',item.valid_for));
  card.append(make('p','measure-limit',item.not_for));
  card.append(audienceSources([item.id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read evidence-quality and inference limits ↗');
 link.href='./ontology/youtube/evidence-quality-scope-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderMembershipPriceOptions(data,dossier){
 if(!data?.tiers?.length)return null;
 const section=make('section','membership-price-options'),details=make('details','ownership-details');
 details.append(make('summary','','YouTube memberships: official Mexico price menus'));
 details.append(make('p','measure-limit',data.possible_menu_options+' published US/Mexico options, '+data.changed_option_count+' changed nominal Mexican prices. Menu options do not measure creator price choices, member payments or earnings.'));
 const grid=make('div','ownership-grid');
 for(const i of [0,3,4,5,24]){
  const t=data.tiers[i],card=make('article','ownership-card');
  card.append(make('h5','', 'USD '+(t.us_allowed_usd_cents/100).toFixed(2)+' menu level'));
  card.append(make('p','', 'Mexico MXN '+t.mx_previous_mxn_cents/100+' previous; MXN '+t.mx_new_mxn_cents/100+' newer'));
  grid.append(card);
 }
 details.append(grid);
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read all 25 prices and legacy-member conditions ↗');
 link.href='./ontology/youtube/membership-price-options-mx-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderSurveyNewsChange(data,dossier){
 if(!data?.series?.length)return null;
 const section=make('section','news-survey-trend'),details=make('details','ownership-details');
 details.append(make('summary','','US YouTube news survey: reported changes are not proven viewer decline'));
 details.append(make('p','',data.series[0].regular_youtube_news_percent_of_all_us_adults+'% (2020) to '+data.series.at(-1).regular_youtube_news_percent_of_all_us_adults+'% (2026), with a '+data.comparison_summaries.from_2025_to_2026_pp+'-point rounded difference from 2025.'));
 details.append(make('p','measure-limit','US adult self-reports, not platform viewer or channel-income data. Statistical significance and causes have not been established.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read survey trend and inference limits ↗');
 link.href='./ontology/youtube/us-news-reported-change-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderVideoConcentration(data,dossier){
 if(!data?.published_video_level_observation)return null;
 const section=make('section','video-concentration'),details=make('details','ownership-details');
 details.append(make('summary','','Video attention concentration is not channel income or niche opportunity'));
 const r=data.published_video_level_observation;
 details.append(make('p','',r.upper_share_of_watch_time_percent+'% of estimated watch time to the top '+r.upper_share_of_ranked_video_objects_percent+'% of videos within Omdia’s study; sample methodology not independently reproduced.'));
 details.append(make('p','measure-limit','No niche-level video panel, channel profit concentration or representative creator success rate can be inferred.'));
 details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read scoped sample concentration methods ↗');
 link.href='./ontology/youtube/video-concentration-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCountryLanguageMatrix(data,dossier){
 if(!data?.countries?.length)return null;
 const section=make('section','country-language-matrix'),details=make('details','ownership-details');
 details.append(make('summary','','Country advertiser reach is not a language-speaker population'));
 details.append(make('p','measure-limit','Seven late-2025 country advertiser-planner estimates, with separate unmeasured language and creator-population fields.'));
 const grid=make('div','ownership-grid');
 for(const x of data.countries){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.country+' · '+x.ad_reach_millions+'m estimated advertiser reach'));
  card.append(make('p','',x.proposed_metadata_language_tag_for_future_label_only+' is only a future language-label example; no language-specific audience was sampled.'));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read source units and missing language denominators ↗');
 link.href='./ontology/youtube/country-language-matrix-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderViewerNeedHypotheses(data,dossier){
 if(!data?.hypotheses?.length)return null;
 const section=make('section','viewer-need-hypotheses'),details=make('details','ownership-details');
 details.append(make('summary','','Three falsifiable viewer needs, without assumed lucrative niches'));
 details.append(make('p','measure-limit','Public topic activity only motivates possible research. The experiments are unrun: no spend, account access, recruitment, format success or creator income measured.'));
 const grid=make('div','ownership-grid');
 for(const x of data.hypotheses){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')));
  card.append(make('p','',x.viewer_need));
  card.append(make('p','measure-limit',x.negative_result_rule));
  card.append(audienceSources([x.public_reference_source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read prespecified need, comparator and consent gates ↗');
 link.href='./ontology/youtube/viewer-need-hypotheses-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderCreatorPopulation(data,dossier){
 if(!data?.frames?.length)return null;
 const section=make('section','creator-population'),details=make('details','ownership-details');
 details.append(make('summary','','Creators versus channel indexes and publishing activity'));
 details.append(make('p','measure-limit','Different vendor snapshots and net video-count measures are not all active human uploaders or paying creators.'));
 const grid=make('div','ownership-grid');
 for(const f of data.frames){
  const card=make('article','ownership-card');
  card.append(make('h5','',f.channel_count.toLocaleString()+' · '+f.id.replaceAll('_',' ')));
  card.append(make('p','',f.sampling_frame));
  card.append(make('p','measure-limit',f.limitations));
  card.append(audienceSources([f.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read active-creator population evidence limits ↗');
 link.href='./ontology/youtube/creator-activity-population-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderNicheUncertainty(data,dossier){
 if(!data?.input_intervals?.length)return null;
 const section=make('section','niche-uncertainty'),details=make('details','ownership-details');
 details.append(make('summary','','Creator opportunity: explicit input ranges, not probabilistic forecasts'));
 details.append(make('p','measure-limit','Existing cash-flow scenario math now accepts user-specified low and high inputs with no invented earnings default, success probability, or confidence interval.'));
 const grid=make('div','ownership-grid');
 for(const field of data.input_intervals){
  const card=make('article','ownership-card');
  card.append(make('h5','',field.id.replaceAll('_',' ')));
  card.append(make('p','',field.unit.replaceAll('_',' ')));
  card.append(make('p','measure-limit','Both endpoints unknown; user supplied assumptions required.'));
  grid.append(card);
 }
 details.append(grid);details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read assumption envelope and sensitivity limits ↗');
 link.href='./ontology/youtube/niche-uncertainty-ranges-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderSubscriptionStatus(data,dossier){
 if(!data?.separations?.length)return null;
 const section=make('section','subscriber-status-study'),details=make('details','ownership-details');
 details.append(make('summary','','Subscribed versus non-subscribed views: event-level owner Analytics'));
 details.append(make('p','measure-limit','A viewer can appear in both status bins during a window, while subscriber count and subscriber-feed traffic are different quantities. No real creator report or earnings is measured.'));
 const grid=make('div','ownership-grid');
 for(const row of data.separations){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.id.replaceAll('_',' ')));
  card.append(make('p','',row.reason));
  grid.append(card);
 }
 details.append(grid);details.append(audienceSources(data.source_ids,dossier));
 const link=make('a','inline-link','Read authorized subscriber-status report protocol ↗');
 link.href='./ontology/youtube/subscriber-status-reach-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderDemographicCrossTabs(data,dossier){
 if(!data?.unavailable_joint_tables?.length)return null;
 const section=make('section','demographic-cross-tabs'),details=make('details','ownership-details');
 details.append(make('summary','','Demographic intersections and missing survey cells'));
 details.append(make('p','measure-limit','2026 Pew U.S. adult ever-use and news tables are different surveys. Published age, income, residence and party rates do not contain joint subgroup estimates.'));
 const grid=make('div','ownership-grid');
 for(const x of data.unavailable_joint_tables){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.dimensions.join(' × ').replaceAll('_',' ')));
  card.append(make('p','',x.reason));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read cross-tab and nonresponse acceptance gates ↗');
 link.href='./ontology/youtube/demographic-cross-tab-availability-2026.md';
 link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderChildEconomics(data,dossier){
 if(!data?.pathways?.length)return null;
 const section=make('section','child-directed-economics'),details=make('details','ownership-details');
 details.append(make('summary','','Child-directed video: advertising, fan support and commerce restrictions'));
 details.append(make('p','measure-limit','Audience designation is intent-based. Family-friendly animation is not automatically child-directed; contextual ads can remain but no child-directed RPM or profit has been measured.'));
 const grid=make('div','ownership-grid');
 for(const row of data.pathways){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.label));
  card.append(make('p','',row.consequence));
  card.append(make('p','measure-limit','Scope: '+row.official_scope.replaceAll('_',' ')+'. Approval and earnings unknown.'));
  card.append(audienceSources(row.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read child-directed creator economic restrictions ↗');
 link.href='./ontology/youtube/child-directed-economics-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
}

function renderCreatorInactivity(data,dossier){
 if(!data?.frames?.length)return null;
 const section=make('section','creator-inactivity'),details=make('details','ownership-details');
 details.append(make('summary','','Publishing inactivity is not creator exit: three incompatible samples'));
 details.append(make('p','measure-limit','Vendor account activity, website-linked company upload silence, and net public-video-count changes have different observation windows and cannot determine creator closure or earnings.'));
 const grid=make('div','ownership-grid');
 for(const x of data.frames){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.id.replaceAll('_',' ')+' · '+x.window_days+' days'));
  const summary=x.dormant_pct!==null?x.dormant_pct+'% vendor-defined dormant':x.no_upload_pct!==null?x.no_upload_pct+'% without recent published upload':x.no_net_video_growth_count.toLocaleString()+' zero-net-count channels (not proven inactive)';
  card.append(make('p','',summary));
  card.append(make('p','measure-limit',x.limitations[0]));
  card.append(audienceSources([x.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read cohort and censoring limitations ↗');
 link.href='./ontology/youtube/creator-inactivity-frames-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderChannelTopicJoin(data,dossier){
 if(!data?.cases?.length)return null;
 const section=make('section','channel-topic-join'),details=make('details','ownership-details');
 details.append(make('summary','','Why niche channel counts cannot be divided into unrelated views or surveys'));
 details.append(make('p','measure-limit','Selected source-frame mismatches. No valid unique audience-per-creator ratios, scarcity ranks or creator income estimates are measured.'));
 const grid=make('div','ownership-grid');
 for(const row of data.cases){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.supply_category+' · '+row.indexed_channels.toLocaleString()+' tracked channels'));
  card.append(make('p','',row.attention_value.toLocaleString()+' '+row.attention_unit.replaceAll('_',' ')+' in a separate topic observation'));
  card.append(make('p','measure-limit',row.reason));
  card.append(audienceSources([row.supply_index_source_id,row.attention_source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read matched-denominator requirements ↗');
 link.href='./ontology/youtube/channel-supply-topic-attention-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderVideoQualityResearch(data,dossier){
 if(!data?.bounded_observations?.length)return null;
 const section=make('section','video-quality-research'),details=make('details','ownership-details');
 details.append(make('summary','','Observable video differentiation versus actual production labor'));
 details.append(make('p','measure-limit','A single creator labor diary and three distinct educational-video study cohorts. Views, retention, self-logged hours, rights and teaching effectiveness are not interchangeable quality or income scores.'));
 const grid=make('div','ownership-grid');
 for(const row of data.bounded_observations){
  const card=make('article','ownership-card');
  card.append(make('h5','',row.sampled_video_count+' videos · '+row.id.replaceAll('_',' ')));
  card.append(make('p','',row.within_study_signal||('Self-logged published photography videos: mean '+row.reported_hour_mean+'h, median '+row.reported_hour_median+'h. Abandoned effort and receipts not recorded.')));
  card.append(audienceSources([row.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read quality measurement boundaries and sample limitations ↗');
 link.href='./ontology/youtube/video-quality-production-crosswalk-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCreatorPortability(data,dossier){
 if(!data?.routes?.length)return null;
 const section=make('section','cross-platform-portability'),details=make('details','ownership-details');
 details.append(make('summary','','Video files versus followers and paying customers: cross-platform portability'));
 details.append(make('p','measure-limit','Official feature descriptions, not actual creator migration, customer consent records or measured switching profitability.'));
 const grid=make('div','ownership-grid');
 for(const route of data.routes){
  const card=make('article','ownership-card');
  card.append(make('h5','',route.platform==='vimeo_ott'?'Vimeo OTT':route.platform[0].toUpperCase()+route.platform.slice(1)));
  card.append(make('p','',route.route));
  card.append(make('p','measure-limit',route.restrictions[0]));
  card.append(audienceSources(route.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 const link=make('a','inline-link','Read retention, consent and switching constraints ↗');
 link.href='./ontology/youtube/cross-platform-portability-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderReputationPortability(data,dossier){
 if(!data?.surfaces?.length)return null;
 const section=make('section','reputation-portability');
 const details=make('details','ownership-details');
 details.append(make('summary','','Channel feedback, reputation and portability'));
 details.append(make('p','measure-limit','Moderated comments are not verified buyer ratings, and a subscriber count is not a portable customer list. Media exports, roles and internal channel moves have different limits.'));
 const grid=make('div','ownership-grid');
 for(const x of data.surfaces){
  const card=make('article','ownership-card');
  card.append(make('h5','',x.title));
  card.append(make('p','',x.mechanism));
  card.append(make('p','measure-limit',x.limit));
  card.append(audienceSources(x.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Off-platform migration rate, verified buyer scores and net earnings effects remain unmeasured.'));
 const link=make('a','inline-link','Read the feedback and portability audit ↗');
 link.href='./ontology/youtube/reputation-portability.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderPodcastPublicationRoutes(model,dossier){
 if(!model?.routes?.length)return null;
 const section=make('section','podcast-publication-routes');
 const details=make('details','ownership-details');
 details.append(make('summary','','Podcast publishing: Studio video episodes, RSS static-image import and music playback'));
 details.append(make('p','measure-limit','Official publishing permissions and rights restrictions, not automatic creator payouts or outside podcast syndication.'));
 const grid=make('div','ownership-grid');
 for(const r of model.routes){
  const card=make('article','ownership-card');
  card.append(make('h5','',r.label));
  card.append(make('p','',r.limitations));
  card.append(audienceSources(r.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','RSS importer makes videos from feed audio in selected regions. Direct MP3 upload does not. Podcast audio playback and YPP approval are separate. Claims and paid promotion require compliance.'));
 const link=make('a','inline-link','Read direct video versus RSS podcast publication rules ↗');
 link.href='./ontology/youtube/podcast-publication-routes-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderPodcastViewingFrames(model,dossier){
 if(!model?.observations?.length)return null;
 const section=make('section','podcast-viewing-frames');
 const details=make('details','ownership-details');
 details.append(make('summary','','Podcasts: global viewers, TV watch hours, Premium hours and US survey formats'));
 details.append(make('p','measure-limit','Different populations and time frames: not a unique-person or creator-income comparison. Podcast video and audio behaviors may overlap.'));
 const grid=make('div','ownership-grid');
 const labels={
 jan2025_global_podcast_viewers:['Global podcast viewers, Jan 2025','More than 1 billion','Monthly active platform viewers, not watch hours'],
 oct2024_living_room_hours:['Living-room podcast hours, Oct 2024','About 400 million','Device viewing hours, not persons'],
 oct2025_living_room_hours:['Living-room podcast hours, Oct 2025','More than 700 million','Device viewing hours, not persons'],
 apr2026_premium_podcast_hours:['Premium podcast watch hours, Apr 2026','More than 800 million','Premium accounts across devices, not October TV'],
 q3_2025_weekly_video_audio_format:['Edison US weekly podcast format, Q3 2025','82% watched / 78% audio-only','Overlapping behavior in US weekly podcast consumers across services']
 };
 for(const item of model.observations){
  const [title,value,limit]=labels[item.id];
  const card=make('article','ownership-card');card.append(make('h5','',title));card.append(make('strong','',value));
  card.append(make('p','measure-limit',limit));card.append(audienceSources([item.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Different devices, dates and survey frames cannot be summed or converted to average watch minutes, background attention or earnings.'));
 const link=make('a','inline-link','Read podcast viewing and listening frame differences ↗');
 link.href='./ontology/youtube/podcast-viewing-frames-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderNielsenTelevisionShare(model,dossier){
 if(!model?.observations?.length)return null;
 const section=make('section','nielsen-tv-device-share');
 const details=make('details','ownership-details');
 details.append(make('summary','','US TV-device watch-time: Nielsen May, July and August 2026'));
 details.append(make('p','measure-limit','Nielsen US television viewing time, persons 2+: not a mobile viewing share or total unique viewers. Shares are TV watch-time, not creator payouts.'));
 const grid=make('div','ownership-grid');
 for(const rec of model.observations) {
   const card=make('article','ownership-card');
   card.append(make('h5','',rec.period));
   card.append(make('strong','',rec.youtube_share_total_tv_percent+'% YouTube of US TV time'));
   card.append(make('p','measure-limit','Streaming '+rec.streaming_share_total_tv_percent+'% of the same TV-time denominator; do not sum the two'));
   card.append(audienceSources([rec.source_id],dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','July–August: +1.6 TV-share percentage points. No valid mobile comparison, unique-person count or observed viewer-level watching hours.'));
 const link=make('a','inline-link','Read Nielsen device and population comparison rules ↗');
 link.href='./ontology/youtube/nielsen-us-tv-youtube-share-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);
 section.append(details);return section;
}

function renderCreatorLocalizationAccess(model,dossier){
 if(!model?.routes?.length)return null;
 const section=make('section','creator-localization-access');
 const details=make('details','ownership-details');
 details.append(make('summary','','Localization and access: captions, translated metadata and dubbed audio'));
 details.append(make('p','measure-limit','Six separate official features, not measured multilingual audience or creator income. Availability, language support and translation quality vary.'));
 const grid=make('div','ownership-grid');
 for(const r of model.routes) {
  const card=make('article','ownership-card');
  card.append(make('h5','',r.label));
  card.append(make('p','',r.restrictions));
  card.append(audienceSources(r.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Automatic captions may contain dialect or noise errors; auto-dubbing can be unavailable, restricted by rights or video length. Translated titles are not verified search volume.'));
 const link=make('a','inline-link','Read creator language workflows and uncertainty limits ↗');
 link.href='./ontology/youtube/creator-localization-access-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCreatorEntryGates(model,dossier){
 if(!model?.activity_gates?.length)return null;
 const section=make('section','creator-entry-gates');
 const details=make('details','ownership-details');
 details.append(make('summary','','Creator entry: standard upload, verification, livestreaming and earning are separate permissions'));
 details.append(make('p','measure-limit','Official minimum features with existing hardware are not actual account approval or creator income. Any operating costs, hours and payouts remain unmeasured.'));
 const grid=make('div','ownership-grid');
 for(const gate of model.activity_gates){
  const card=make('article','ownership-card');
  card.append(make('h5','',gate.label));
  card.append(make('p','',gate.outcome));
  card.append(make('p','measure-limit',gate.minimum_subscribers===null?'Subscriber floor is determined by current YPP route and review':'Minimum subscribers for this feature: '+gate.minimum_subscribers));
  card.append(audienceSources(gate.source_ids,dossier));grid.append(card);
 }
 details.append(grid);
 if(model.age_and_guardian_routes?.length){
  const ageGroup=make('div','age-entry-routes');
  ageGroup.append(make('h4','','Separate age, supervision and payment-recipient restrictions'));
  const ageGrid=make('div','ownership-grid');
  for(const rule of model.age_and_guardian_routes) {
   const card=make('article','ownership-card');
   card.append(make('h5','',rule.label));
   card.append(make('p','',rule.condition));
   card.append(audienceSources(rule.source_ids,dossier));ageGrid.append(card);
  }
  ageGroup.append(ageGrid);
  details.append(ageGroup);
 }
 if(model.ypp_review_lifecycle?.stages?.length){
  const reviewGroup=make('div','ypp-review-gates');
  reviewGroup.append(make('h4','','Review and appeal timing is not settlement timing'));
  const reviewGrid=make('div','ownership-grid');
  for(const rule of model.ypp_review_lifecycle.stages){
   const card=make('article','ownership-card');
   card.append(make('h5','',rule.label));
   card.append(make('p','',rule.timing_description||('Clock starts: '+rule.reference_point)));
   card.append(make('p','measure-limit','No automatic YPP acceptance or bank payment'));
   card.append(audienceSources(rule.source_ids,dossier));reviewGrid.append(card);
  }
  reviewGroup.append(reviewGrid);details.append(reviewGroup);
 }
 details.append(make('p','measure-limit','Mobile live requires 50 subscribers and may have audience caps under 1,000. Phone-verified long uploads are a different gate. No new paid equipment mandated does not mean zero operating cost.'));
 const link=make('a','inline-link','Read minimum-purchase entry and 2026 feature gate protocol ↗');
 link.href='./ontology/youtube/creator-entry-gates-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderChannelOnboarding(data,dossier) {
  if(!data?.stages?.length)return null;
  const section=make('section','channel-onboarding');
  const details=make('details','channel-onboarding-details');
  details.append(make('summary','','From a Google Account to a publishing channel · '+data.stages.length+' stages'));
  details.append(make('p','measure-limit','Creating a channel, publishing, unlocking advanced features and earning money require different permissions. These steps are general policy, not proof of eligibility for a particular person.'));
  const stages=make('ol','channel-onboarding-stage-list');
  for(const step of data.stages){
    const item=make('li','channel-onboarding-stage');
    item.append(make('h5','',step.label));
    item.append(make('p','',step.outcome));
    item.append(make('p','measure-limit',step.limits));
    item.append(audienceSources(step.source_ids,dossier));
    stages.append(item);
  }
  details.append(stages);
  const gates=make('div','channel-feature-gates');
  for(const gate of data.feature_gates){
    const card=make('article','channel-feature-gate');
    card.append(make('h5','',gate.label));
    card.append(make('p','measure-limit','Requirements: '+gate.requires.join(' · ').replaceAll('_',' ')));
    card.append(make('p','',gate.limits));
    card.append(audienceSources(gate.source_ids,dossier));
    gates.append(card);
  }
  details.append(gates);
  details.append(make('p','measure-limit','Typical setup hours: unknown · typical cash costs: unknown · time to first creator payment: unknown. A no-new-purchase path does not mean creator labor or access costs disappear.'));
  const link=make('a','inline-link','Read source-backed onboarding gates and cost limits ↗');
  link.href='./ontology/youtube/channel-onboarding.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);
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

function renderPromoteResearch(data,dossier){
 if(!data?.ad_format_billing?.length)return null;
 const section=make('section','promote-economics');
 const details=make('details','promote-economics-details');
 details.append(make('summary','','YouTube Promote: paid costs versus organic YPP-eligible follow-on views'));
 details.append(make('p','measure-limit','A promotion is purchased advertising, not creator earnings. Subscribers and watch hours generated directly by ad campaigns do not meet YPP eligibility thresholds. Organic follow-on views are tracked separately.'));
 const grid=make('div','promote-format-grid');
 for(const item of data.ad_format_billing){
   const card=make('article','promote-format-card');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('p','',item.billable_trueview_condition));
   card.append(audienceSources(item.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 const ad=make('div','promote-metrics-grid');
 for(const item of data.metric_register){
   const card=make('article','promote-metric-card');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('p','measure-limit',item.unit.replaceAll('_',' ')));
   ad.append(card);
 }
 details.append(make('h5','promote-heading','Distinct attribution and accounting units'));
 details.append(ad);
 details.append(make('p','measure-limit','Typical budget, realized cost per acquired viewer, organic conversion, and net creator profit remain unknown. Attribution without a valid comparison cohort does not establish incremental results.'));
 const link=make('a','inline-link','Read ad billing formats, YPP qualification and missing ROI evidence ↗');
 link.href='./ontology/youtube/promote-economics.md';link.rel='noopener noreferrer';link.target='_blank';
 details.append(link);section.append(details);return section;
}

function renderPostAndMembershipRetention(data,dossier) {
 if(!data?.channel_surfaces?.length)return null;
 const section=make('section','post-membership-retention');
 const details=make('details','post-membership-retention-details');
 details.append(make('summary','','Creator Posts, regular viewers and paid membership renewals'));
 details.append(make('p','measure-limit','Official analytics measure different populations: post impressions, channel return viewers, subscribers with member perks and recurring payment events. They cannot be joined into an attributed retention rate without actual owner-authorized cohorts.'));
 const grid=make('div','post-membership-surfaces');
 for(const surface of data.channel_surfaces){
   const card=make('article','post-membership-surface');
   card.append(make('h5','',surface.id.replaceAll('_',' ')));
   card.append(make('p','',surface.description));
   card.append(make('p','measure-limit',surface.eligibility_note));
   card.append(audienceSources(surface.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 const members=make('div','post-membership-metrics');
 for(const item of data.membership_register){
   const card=make('article','post-membership-metric');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('p','',item.definition));
   card.append(make('p','measure-limit','Unit: '+item.unit.replaceAll('_',' ')));
   members.append(card);
 }
 details.append(make('h5','post-membership-heading','Membership measurement units'));
 details.append(members);
 const postsScale=data.platform_scale_claims?.find(x=>x.id==='daily_posts_engaging_users');
 if(postsScale){
   details.append(make('p','measure-limit','YouTube reported more than '+(postsScale.reported_value/1000000)+' million users engaging with Posts on an average day in September 2026. Independent user deduplication and channel-specific return effects are unknown.'));
   details.append(audienceSources([postsScale.source_id],dossier));
 }
 details.append(make('p','measure-limit','Regular viewers watched at least monthly for more than six months of the past year. A membership transaction may be a new sign-up or a renewal, not a distinct buyer.'));
 details.append(make('p','measure-limit','Average posting effect, unique membership buyers, renewal rate and net member profit: unknown.'));
 const link=make('a','inline-link','Read official measurement definitions, study design and caveats ↗');
 link.href='./ontology/youtube/retention-posts-memberships.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
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

function renderTeenVideoFormatEvidence(data,dossier){
  if(!data?.video_genre_observations?.length)return null;
  const section=make('section','teen-format-evidence');
  const details=make('details','teen-format-details');
  details.append(make('summary','','Child video genres: Australia YouTube, UK cross-app, US teen surveys'));
  details.append(make('p','measure-limit','A 2025 Australian youth survey directly measured YouTube genres among children aged 6–13. UK genre percentages concern all video apps, NOT YouTube alone; U.S. teen platform use has no genre breakdown. These studies do not establish global genre audiences or individual identities.'));
  const grid=make('div','teen-format-grid');
  for(const block of data.video_genre_observations){
    const card=make('article','teen-format-card');
    card.append(make('h5','', 'UK children aged '+block.age_range+' · any video app'));
    const list=make('ul','teen-format-list');
    for(const measure of block.values){
      const item=make('li','teen-format-row');
      add(item,make('span','',measure.genre.replaceAll('_',' ')),make('strong','',measure.percent+'%'));
      list.append(item);
    }
    card.append(list);grid.append(card);
  }
  details.append(grid);
  const au=data.australia_youtube_genres;
  if(au?.gender_conditioned_genres?.length){
    details.append(make('h5','teen-au-heading','Australian children aged 6–13 who watch YouTube · 2025'));
    details.append(make('p','measure-limit','The Roy Morgan survey covered 1,129 Australian children aged 6–13 in 2025. Values below are each genre watched within survey boy and girl YouTube-watcher groups, NOT the gender mix within genres. Exact gender subgroup sample sizes are unknown.'));
    const auGrid=make('div','teen-au-grid');
    for(const category of au.gender_conditioned_genres){
      const row=make('article','teen-au-category');
      row.append(make('strong','',category.id.replaceAll('_',' ')));
      row.append(make('p','','Boys '+category.boys_percent+'% · Girls '+category.girls_percent+'%'));
      auGrid.append(row);
    }
    details.append(auGrid);
  }
  const times=make('p','measure-limit','Separate Barb YouTube 2025 in-home weekly averages: '+data.youtube_inhome_age_minutes_per_week.map(x=>x.age_range+' years '+Math.floor(x.minutes/60)+'h '+String(x.minutes%60).padStart(2,'0')+'m').join(' · ')+'. These include neither out-of-home nor all mobile viewing.');
  details.append(times);
  const pew=make('p','measure-limit','Pew US teens aged 13–17, 2025: YouTube ever use boys 94%, girls 89%; almost constant use boys 20%, girls 13%. These are platform-use rates, not genre-use estimates.');
  details.append(pew);
  details.append(make('p','measure-limit','UK cross-app gender patterns remain directional, but the Australia study reports YouTube-specific genre differences only among children aged 6–13 in its local 2025 sample. Never infer a minor’s identity or viewing history.'));
  details.append(audienceSources(data.source_ids,dossier));
  const link=make('a','inline-link','Read age-specific denominators, collection methods and limits ↗');
  link.href='./ontology/youtube/teen-video-format-evidence.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderChildAgeFormatStudy(data,dossier){
 if(!data?.classification_cases?.length)return null;
 const section=make('section','child-format-study');
 const details=make('details','child-format-details');
 details.append(make('summary','','Child-directed versus family animation and 18+ video rules'));
 details.append(make('p','measure-limit','Being a cartoon or safe for a whole family does not by itself make a video child-directed. Age-gated 18+ content is a different policy. Adult-only surveys cannot establish that younger viewers are absent.'));
 const grid=make('div','child-format-grid');
 for(const item of data.classification_cases){
   const card=make('article','child-format-card');
   card.append(make('h5','',item.label));
   card.append(make('p','measure-limit',item.limitations));
   card.append(audienceSources(item.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 const measures=make('div','child-format-observed');
 for(const item of data.population_observations){
   const card=make('article','child-format-observation');
   card.append(make('strong','',item.value+'%'));
   card.append(make('p','',item.ages+' · '+item.measure.replaceAll('_',' ')));
   card.append(make('p','measure-limit',item.limitations));
   grid.append(card);
 }
 details.append(make('p','measure-limit','Ofcom ages 8–14 platform use and Barb ages 4–15 television viewing share have different denominators. No individual minors are profiled; global child audiences and income changes remain unknown.'));
 const link=make('a','inline-link','Read content classification, privacy restrictions and aggregate UK survey frames ↗');
 link.href='./ontology/youtube/child-age-and-format-gates.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderScreenViewingStudy(data,dossier){
 if(!data?.service_level?.adult_16_plus)return null;
 const section=make('section','screen-viewing-study');
 const details=make('details','screen-viewing-details');
 details.append(make('summary','','UK TV sets versus smartphone YouTube viewing — Barb 2025'));
 details.append(make('p','measure-limit','Q2 2025, UK viewing at home over Wi-Fi. Percentages describe share of measured viewing, NOT share of distinct people or worldwide screen use.'));
 const grid=make('div','screen-viewing-grid');
 const adults=data.service_level.adult_16_plus;
 const kids=data.service_level.children_4_to_15;
 for(const row of [
   {label:'Adults aged 16+',tv:adults.tv_set_percent,phone:adults.smartphone_percent},
   {label:'Children aged 4–15',tv:kids.tv_set_percent,phone:kids.smartphone_percent}
 ]){
   const card=make('article','screen-viewing-card');
   card.append(make('h5','',row.label));
   card.append(make('p','', 'TV-set viewing share: '+row.tv+'%'));
   card.append(make('p','measure-limit', 'Smartphone viewing share: '+(row.phone===null?'unknown in cited source':row.phone+'%')));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','The separate 200 selected-channel TV-only ACR program excludes Shorts, live and certain music channels. Its exclusions do not redefine the device shares for YouTube service-wide viewing.'));
 details.append(make('p','measure-limit','UK smartphone viewing over cellular networks, device-specific creator payout, format mix and global screen share: unknown.'));
 details.append(audienceSources([data.source_id,data.related_ofcom_2026.source_id],dossier));
 const link=make('a','inline-link','Read Barb methodology, Ofcom viewing series and source restrictions ↗');
 link.href='./ontology/youtube/screen-viewing-uk-2025.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderVideoSurfaceEconomics(data,dossier) {
  if(!data?.surfaces?.length)return null;
  const section=make('section','video-surface-study');
  const details=make('details','video-surface-details');
  details.append(make('summary','','Video formats, 8-minute mid-roll threshold and live replay evidence'));
  details.append(make('p','measure-limit','Seven distinct YouTube publishing surfaces have different money and measurement units. An eligible mid-roll slot is not a served ad, and a replay is not guaranteed additional earnings.'));
  const grid=make('div','video-surface-grid');
  for(const item of data.surfaces){
    const card=make('article','video-surface-card');
    card.append(make('h5','',item.name));
    card.append(make('p','measure-context','Unit: '+item.primary_unit.replaceAll('_',' ')));
    card.append(make('p','',item.entry));
    card.append(make('p','measure-limit',item.ad_mechanism));
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Watch-page mid-roll eligibility begins at 8 minutes (480 seconds); actual delivery depends on ad demand, video experience and policy. Shorts revenue is not an 8-minute watch-page ad scheme.'));
  details.append(make('p','measure-limit','Live and archived replay audience, ad revenue and labor must be tracked separately, without adding cumulative views or people twice.'));
  const drama=data.microdrama_observations||[];
  if(drama.length){
    const views=drama.find(x=>x.id==='h1_2026_microdrama_views');
    details.append(make('p','measure-limit','YouTube reported more than '+(views.value/1000000000)+' billion microdrama views in January–June 2026, plus more than 50% year-over-year watch-time growth and more than 90% TV-device view growth. These are historical event and relative metrics, not unique people or creator payouts.'));
    details.append(audienceSources([views.source_id],dossier));
  }

  details.append(make('p','measure-limit','Official localized Help pages conflict on whether new claimed Shorts over one minute are automatically blocked after September 24, 2026; account-specific rights status remains unresolved.'));
  const anchor=make('a','inline-link','Read source-specific rules, rights inconsistency and replay research fields ↗');
  anchor.href='./ontology/youtube/video-surfaces-economics.md';anchor.target='_blank';anchor.rel='noopener noreferrer';
  details.append(anchor);
  section.append(details);
  return section;
}

function renderEvidenceSynthesis(data,dossier){
  if(!data?.findings?.length)return null;
  const section=make('section','evidence-synthesis');
  const details=make('details','evidence-synthesis-details');
  details.append(make('summary','','Interim research synthesis: supported findings and unresolved economics'));
  details.append(make('p','measure-limit','Evidence-backed account of what is documented, without turning platform events, selected creator surveys or annual culture totals into typical newcomer income.'));
  const grid=make('div','evidence-synthesis-grid');
  for(const finding of data.findings){
    const card=make('article','evidence-synthesis-card');
    card.append(make('h5','',finding.title));
    card.append(make('p','',finding.supported));
    card.append(make('p','measure-limit','Not measured: '+finding.unknown));
    card.append(audienceSources(finding.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Representative zero-earner share, first-year creator net profit and deduplicated global monthly audience: unknown.'));
  const link=make('a','inline-link','Read the source-by-source interim marketplace dossier ↗');
  link.href='./ontology/youtube/research-synthesis-2026.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderDecliningTopicAudit(data,dossier){
 if(!data?.registered_example_checks?.length)return null;
 const section=make('section','declining-topic-audit');
 const details=make('details','declining-topic-details');
 details.append(make('summary','','Declining content claims: measured change or incompatible samples?'));
 details.append(make('p','measure-limit','No verified YouTube niche decline is established here. One annual or partial-year aggregate cannot prove recurring falling demand, and the August 2026 public-view definition changed.'));
 const grid=make('div','declining-topic-grid');
 for(const item of data.registered_example_checks){
   const card=make('article','declining-topic-card');
   card.append(make('h5','',item.id.replaceAll('_',' ')));
   card.append(make('p','',item.finding));
   card.append(make('p','measure-limit',item.reason));
   card.append(audienceSources(item.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Topic declines, active people changes, creator income effects and forecasts: unknown. A descriptive two-period change is not a proven persistent trend.'));
 const link=make('a','inline-link','Read comparison requirements and sample audit tests ↗');
 link.href='./ontology/youtube/declining-content-evidence.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderSeasonalDiscovery(data,dossier){
  if(!data?.cases?.length)return null;
  const section=make('section','seasonal-discovery');
  const details=make('details','seasonal-discovery-details');
  details.append(make('summary','','Calendar-driven video discovery: what observed seasonal evidence can show'));
  details.append(make('p','measure-limit','The NFL report measures a within-year offseason share. Prom and Halloween reports cover different annual or partial-year title queries. None supports a universal seasonal lift or best upload month.'));
  const grid=make('div','seasonal-discovery-grid');
  for(const item of data.cases){
    const card=make('article','seasonal-discovery-card');
    card.append(make('h5','',item.topic.replaceAll('_',' ')));
    card.append(make('p','seasonal-observation',item.valid_statement));
    card.append(make('p','measure-limit',item.limitations));
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Seasonal causal effect, creator profit seasonality and reliable optimal upload month: unknown. A repeatable trend needs matched bins, stable measures and multiple annual cycles.'));
  const link=make('a','inline-link','Review temporal units, source windows and remaining evidence gaps ↗');
  link.href='./ontology/youtube/seasonal-discovery-comparison.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderPublishingTimeResearch(data,dossier){
  if(!data?.official_findings?.length)return null;
  const section=make('section','publish-time-study');
  const details=make('details','publish-time-details');
  details.append(make('summary','','Publishing times by format, geography and owner audience activity'));
  details.append(make('p','measure-limit','YouTube Studio reports when a channel\'s viewers were online over the past 28 days. Publishing while they are active may help early views but is not known to improve a video\'s long-term performance.'));
  const grid=make('div','publish-time-grid');
  for(const item of data.format_comparison){
    const card=make('article','publish-time-card');
    card.append(make('h5','',item.format.replaceAll('_',' ')));
    card.append(make('p','',item.release_time_matters_for.replaceAll('_',' ')));
    card.append(make('p','measure-limit','Verified long-term advantage: '+(item.longterm_advantage_verified===null?'unknown':'no evidence of a verified advantage')));
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Scheduling uses a selected time zone while watch-page dates may follow PST. Missing country rows in Analytics can be suppressed for privacy and must not be recorded as zero viewers.'));
  details.append(make('p','measure-limit','Universal optimal publication hour, geography-specific lift and causal long-term effect: unknown.'));
  const link=make('a','inline-link','Read official timing guidance, DST and experimental evidence gates ↗');
  link.href='./ontology/youtube/geographic-publishing-time.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
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
  const layerDetails=make('details','content-surface-layers');
  layerDetails.append(make('summary','','Playback, TV, music, podcast, Posts and payment layers'));
  layerDetails.append(make('p','measure-limit','Overlapping units; these are not separate audiences or creator profits.'));
  const layerGrid=make('div','content-formats-grid');
  for(const item of data.surface_layers||[]){
    const card=make('article','content-surface-layer-card');
    card.append(make('h5','',item.label));
    card.append(make('p','',item.boundary));
    card.append(audienceSources(item.source_ids,dossier));
    layerGrid.append(card);
  }
  layerDetails.append(layerGrid);details.append(layerDetails);
  const link=make('a','inline-link','Read the format and link comparison ↗');
  link.href='./ontology/youtube/content-formats.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);
  return section;
}

function renderMultilingualDistribution(data,dossier) {
  if(!data?.product_surfaces?.length)return null;
  const section=make('section','multilingual-distribution');
  const details=make('details','multilingual-distribution-details');
  details.append(make('summary','','Languages, audio dubbing, captions and translated discovery'));
  details.append(make('p','measure-limit','Spoken language, dub language, subtitles, viewer preference and country are independent attributes. Product access varies; language shares do not give a creator earnings forecast.'));
  const observations=make('div','multilingual-observations');
  for(const entry of data.official_selected_observations){
    const card=make('article','multilingual-observation');
    card.append(make('strong','',entry.comparator==='greater_than'?'Over '+entry.value+'%':entry.value));
    card.append(make('p','',entry.metric.replaceAll('_',' ')));
    card.append(make('small','',entry.source_period.replaceAll('_',' ')+' · '+entry.population));
    card.append(make('p','measure-limit',entry.limits));
    card.append(audienceSources(entry.source_ids,dossier));
    observations.append(card);
  }
  details.append(observations);
  const products=make('div','multilingual-product-grid');
  for(const feature of data.product_surfaces){
    const card=make('article','multilingual-product-card');
    card.append(make('h5','',feature.label));
    card.append(make('p','',feature.limits));
    card.append(make('small','', 'Eligible formats: '+feature.content_formats.join(', ').replaceAll('_',' ')));
    card.append(audienceSources(feature.source_ids,dossier));
    products.append(card);
  }
  details.append(products);
  const publishing=make('details','multilingual-publication-choices');
  publishing.append(make('summary','','Choosing localization assets and publication structure'));
  const choices=make('div','multilingual-product-grid');
  for(const choice of data.localization_choices||[]){
    const card=make('article','multilingual-choice-card');
    card.append(make('h5','',choice.goal));
    card.append(make('p','',choice.creator_control));
    card.append(make('small','',choice.delivery_unit.replaceAll('_',' ')));
    card.append(audienceSources(choice.source_ids,dossier));choices.append(card);
  }
  publishing.append(choices);
  publishing.append(make('p','measure-limit','One video with alternate language assets does not create extra videos or guarantee a larger audience; separate channel publishing has no verified comparative uplift.'));
  details.append(publishing);
  const examples=make('details','multilingual-language-examples');
  examples.append(make('summary','','Selected automatic-dubbing language pairs · current help snapshot'));
  const list=make('ul','multilingual-language-list');
  for(const pair of data.automatic_dubbing_example_pairs){
    const li=make('li','');
    add(li,make('strong','',pair.original+' → '),make('span','',pair.targets.join(', ')));
    list.append(li);
  }
  examples.append(list);details.append(examples);
  details.append(make('p','measure-limit','The over-25% finding is a share of watch time for selected multilingual-audio creators, not additional traffic or causal income lift. Typical dubbing hours, prices and newcomer outcomes remain unknown.'));
  const link=make('a','inline-link','Review language-pair definitions and study limitations ↗');
  link.href='./ontology/youtube/multilingual-distribution.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);
  section.append(details);return section;
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

function renderPlatformComparisonSet(data,dossier){
  if(!data?.candidates?.length)return null;
  const section=make('section','video-comparators');
  const details=make('details','video-comparators-details');
  details.append(make('summary','','Comparable video creator products · not comparable earnings'));
  details.append(make('p','measure-limit','These adjacent services are candidates for YouTube research comparisons only; they have not been added as Mercata specimens. Audience counts, qualified views, subscribers and paid customer transactions are different units.'));
  const grid=make('div','video-comparators-grid');
  for(const item of data.candidates){
    const card=make('article','video-comparator');
    card.append(make('h5','',item.name));
    card.append(make('p','measure-context','Compared with: '+item.comparable_youtube_surface));
    card.append(make('p','',item.earnings_mechanism));
    card.append(make('p','measure-limit',item.limitations));
    card.append(audienceSources(item.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Creator income, zero-earner share, typical work hours and general profitability: unknown for these comparison cohorts.'));
  const link=make('a','inline-link','Source-specific comparison criteria and exclusions ↗');
  link.href='./ontology/youtube/comparison-set.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
}

function renderHealthFitnessResearch(data,dossier){
 if(!data?.content_categories?.length)return null;
 const section=make('section','health-fitness-research');
 const details=make('details','health-fitness-details');
 details.append(make('summary','','Fitness, wellness and health information: source-checked policy boundaries'));
 details.append(make('p','measure-limit','Nine proposed research categories, not measured audience populations. Ordinary exercise, treatment claims, body-image content and professional health-source status require different evidence.'));
 const grid=make('div','health-fitness-grid');
 for(const item of data.content_categories){
   const card=make('article','health-fitness-card');
   card.append(make('h5','',item.label));
   card.append(make('p','',item.examples.join(' · ')));
   card.append(make('p','measure-limit',item.claim_review_required));
   card.append(make('p','measure-limit','Unique audience, creator count and creator earnings: unknown'));
   card.append(audienceSources(item.sources,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Four independent layers: medical misinformation, eating-disorder content safety, advertiser suitability and optional professional health-source discovery. A public video does not automatically qualify for health-source panels.'));
 details.append(make('p','measure-limit','Health-feature eligibility differs from general YPP advertising entry and varies by country and language. The observed policies do not measure earnings, medical quality, audience size or enforcement frequency.'));
 const link=make('a','inline-link','Read official policy scope, professional source rules and unknown measurements ↗');
 link.href='./ontology/youtube/health-fitness-content.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderFinanceContentTaxonomy(data,dossier){
 if(!data?.content_families?.length)return null;
 const section=make('section','finance-content');
 const details=make('details','finance-content-details');
 details.append(make('summary','','Finance and business videos · education, marketing and promotion'));
 details.append(make('p','measure-limit','These eight overlapping content classes distinguish general education, affiliate/owned-product marketing, and risk-sensitive financial promotions. The taxonomy is NOT a financial-advice service or an estimate of niche profitability.'));
 const grid=make('div','finance-content-grid');
 for(const item of data.content_families){
   const card=make('article','finance-content-card');
   card.append(make('h5','',item.label));
   card.append(make('p','measure-context',item.parent.replaceAll('_',' ')));
   card.append(make('p','',item.illustrative_topics.join(' · ')));
   card.append(make('p','measure-limit',item.additional_risk_review));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','Commercial affiliate links and paid sponsorships require separate policy and material-connection review. An SEC investor warning does not determine the conduct of an individual creator.'));
 details.append(audienceSources([...data.platform_source_ids,...data.jurisdictional_source_ids],dossier));
 details.append(make('p','measure-limit','Unique viewers, finance creators, niche RPM, audience overlap and creator profits are unknown. U.S. consumer and investor guidance is not worldwide law.'));
 const link=make('a','inline-link','Read category definitions, policy references and measurement gaps ↗');
 link.href='./ontology/youtube/finance-content-taxonomy.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderTechnologySubcultures(data,dossier){
 if(!data?.segments?.length)return null;
 const section=make('section','technology-subcultures');
 const details=make('details','technology-subcultures-details');
 details.append(make('summary','','Software tutorials, hardware reviews and workspace videos · separate categories'));
 details.append(make('p','measure-limit','Programming, application troubleshooting, product reviews, repair and workspace aesthetics overlap. No tech-only unique audience, channel population or creator earnings has been measured.'));
 const grid=make('div','technology-subculture-grid');
 for(const item of data.segments){
  const card=make('article','technology-subculture-card');
  card.append(make('h5','',item.label));
  card.append(make('p','measure-context',item.formats.map(x=>x.replaceAll('_',' ')).join(' · ')));
  card.append(make('p','measure-limit',item.provenance));
  card.append(audienceSources(item.source_ids,dossier));
  grid.append(card);
 }
 details.append(grid);
 const figures=make('div','technology-metric-grid');
 for(const value of data.observed_public_metrics){
  const card=make('article','technology-metric-card');
  card.append(make('strong','',value.comparison==='greater_than'?'More than '+value.value.toLocaleString():value.value.toLocaleString()));
  card.append(make('p','',value.population));
  card.append(make('p','measure-limit',value.geography+' · '+value.start+' to '+value.end+' · view events, not unique people'));
  card.append(audienceSources([value.source_id],dossier));
  figures.append(card);
 }
 details.append(figures);
 details.append(make('p','measure-limit','The two metrics have different countries, dates and inclusion rules. Neither is a software tutorial market-size estimate, and they cannot be divided into a niche audience share.'));
 const link=make('a','inline-link','Read segmented subcultures and original observation limitations ↗');
 link.href='./ontology/youtube/technology-subcultures-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderCommentNormsEvidence(data,dossier){
  if(!data?.studies?.length)return null;
  const section=make('section','comment-norms-evidence');
  const details=make('details','comment-norms-details');
  details.append(make('summary','','Comment behavior in selected YouTube communities · bounded studies'));
  details.append(make('p','measure-limit','Comment counts are not unique viewers or representative public opinion. Two peer-reviewed studies examine different English-language samples, populations and coding methods.'));
  const grid=make('div','comment-norms-grid');
  for(const study of data.studies){
    const card=make('article','comment-norms-card');
    if(study.id==='political_anglophone_2025'){
      card.append(make('h5','','English-language political channels · 2025 paper'));
      card.append(make('strong','','About half of comments from just over 2% of commenters'));
      card.append(make('p','measure-limit','Higher coded toxicity among prolific commenters in the journal manuscript; Cardiff bibliographic abstract reverses this comparison. Selected sample only, not a political-belief or whole-platform rate.'));
    }else{
      card.append(make('h5','','Selected climate-change videos · 2026 paper'));
      card.append(make('strong','',study.n_videos+' selected videos'));
      card.append(make('p','measure-limit','Reply threads had a greater share of positively coded comments than independent comments within the selected sample. Association is not causation.'));
    }
    card.append(make('p','measure-limit',study.selection));
    card.append(audienceSources([study.source_id],dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Commenter identities, political affiliations, population toxicity rates, causal reply effects and moderation labor hours: unknown. No individual comments or profiles are collected.'));
  const corrected=make('a','inline-link','Read manuscript versus abstract discrepancy ↗');
  corrected.href='./ontology/youtube/comment-source-reconciliation-2026.md';corrected.target='_blank';corrected.rel='noopener noreferrer';details.append(corrected);
  const link=make('a','inline-link','Read original study frames, methods and limitations ↗');
  link.href='./ontology/youtube/comment-norms-evidence.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
}

function renderCreatorCollaborationEvidence(data,dossier){
 if(!data?.survey_groups?.length)return null;
 const section=make('section','creator-collaboration-evidence');
 const details=make('details','creator-collaboration-details');
 details.append(make('summary','','Creator collaborations and fandom participation · dated evidence'));
 details.append(make('p','measure-limit','Current Studio documentation permits up to '+data.collaboration_policy.max_invited_creators_current+' collaborators, versus '+data.collaboration_policy.max_invited_creators_initial_rollout+' at initial rollout. The uploading channel receives native video revenue; YouTube does not split collaboration payouts automatically.'));
 const grid=make('div','creator-collaboration-groups');
 for(const cohort of data.survey_groups){
  const card=make('article','creator-fandom-cohort');
  card.append(make('h5','',cohort.population+' · study N='+cohort.n_total));
  const list=make('ul','creator-fandom-metrics');
  for(const item of cohort.questions){
   const row=make('li','creator-fandom-metric');
   row.append(make('span','',item.meaning));row.append(make('strong','',item.percent+'%'));
   list.append(row);
  }
  card.append(list);
  card.append(make('p','measure-limit','Commissioned online survey: question-specific n and probability weights unverified.'));
  grid.append(card);
 }
 details.append(grid);
 const study=data.study_with_me_observation;
 if(study?.source_id&&study.selected_videos===393&&study.analyzed_comments===164611){
  const extra=make('div','study-with-me-comment-evidence');
  extra.append(make('h5','','Study With Me: empirical comments, not all viewers'));
  extra.append(make('p','measure-limit',
   study.selected_videos+' title-selected prerecorded videos, '+study.analyzed_comments.toLocaleString('en-US')+
   ' analyzed public comments, collected in '+study.data_collection+'. Selection includes commenters, not distinct viewers or all participants.'));
  extra.append(make('p','measure-limit','About half the selected comments were coded positive, but the exact rate and verified psychological states are unknown. Design themes include lighting, timers, ambient music and social companionship; causal learning and creator-profit effects were not measured.'));
  extra.append(audienceSources([study.source_id],dossier));
  details.append(extra);
 }
 details.append(make('p','measure-limit','Shared recommendations are an intended feature, not guaranteed. No collaboration earnings, unique shared audience, or causal growth lift has been measured.'));
 details.append(audienceSources([...new Set(data.evidence_families.flatMap(x=>x.source_ids))],dossier));
 const link=make('a','inline-link','Read the payout rules and fandom-sample limitations ↗');
 link.href='./ontology/youtube/creator-collaboration-fandom-2026.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderGamingReleaseEvents(data,dossier){
 if(!data?.events?.length)return null;
 const section=make('section','gaming-release-events');
 const details=make('details','gaming-release-details');
 details.append(make('summary','','Game-release spikes: dated view events, not platform-wide growth'));
 details.append(make('p','measure-limit','Two different historic events: Splatoon 2 at its 2017 game launch in Japan and a GTA VI trailer premiere in 2023 worldwide. Video views are events, not distinct people or attributable creator earnings.'));
 const grid=make('div','gaming-release-grid');
 for(const event of data.events){
   const card=make('article','gaming-release-card');
   card.append(make('h5','',event.game+' · '+event.event_type.replaceAll('_',' ')));
   card.append(make('p','measure-context',event.country_scope+' · '+event.window_start+' to '+event.window_end));
   for(const x of event.measures){
     const row=make('p','gaming-release-measure',(x.comparison==='>'?'Over ':'')+x.value.toLocaleString()+' '+x.unit.replaceAll('_',' '));
     card.append(row);
     card.append(make('p','measure-limit',x.scope));
   }
   card.append(make('p','measure-limit',event.limitations));
   card.append(audienceSources(event.source_ids,dossier));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','A single trailer belongs to the wider related-video count. Counts for different events, geographies or windows cannot be summed or treated as comparable release-day growth.'));
 details.append(make('p','measure-limit','Matched pre-release and post-release baselines, causal lift, viewer populations, new channel incomes and effects of the 2026 view-definition change: unknown.'));
 const link=make('a','inline-link','Read source dates and reproducible release-window comparison rules ↗');
 link.href='./ontology/youtube/gaming-release-events.md';link.target='_blank';link.rel='noopener noreferrer';
 details.append(link);section.append(details);return section;
}

function renderNflSeasonality(data,dossier){
 if(!data?.observations?.length)return null;
 const section=make('section','nfl-seasonality');
 const details=make('details','nfl-seasonality-details');
 details.append(make('summary','','NFL videos · measured 2020–2025 growth and 2025 offseason share'));
 details.append(make('p','measure-limit','YouTube reports bounded NFL-related global video activity, not unique fans or creator earnings. View events and uploaded videos have different denominators.'));
 const grid=make('div','nfl-seasonality-grid');
 const labels={
   nfl_views_2025:'2025 NFL-related view events',
   nfl_views_growth_2020_to_2025:'2020–2025 annual views increase',
   nfl_uploads_growth_2020_to_2025:'2020–2025 annual uploads increase',
   nfl_2025_offseason_share:'Share of 2025 NFL-related views in offseason'
 };
 for(const item of data.observations){
   const card=make('article','nfl-seasonality-card');
   const display=item.unit==='view_events'?'More than '+(item.value/1000000000)+' billion':'More than '+item.value+'%';
   card.append(make('strong','',display));
   card.append(make('h5','',labels[item.id]||item.measure.replaceAll('_',' ')));
   card.append(make('p','measure-limit',item.period.replaceAll('_',' ')));
   grid.append(card);
 }
 details.append(grid);
 details.append(make('p','measure-limit','More than 30% offseason views is a share within 2025, not 30% seasonal growth. Intermediate 2021–24 annual points and monthly views are unmeasured and must not be interpolated.'));
 details.append(audienceSources([data.source_id],dossier));
 const link=make('a','inline-link','Read dates, units, source methods and missing series ↗');
 link.href='./ontology/youtube/nfl-view-seasonality-2026.md';link.rel='noopener noreferrer';link.target='_blank';
 details.append(link);section.append(details);return section;
}

function renderBeautyFashionQuerySeries(data,dossier){
  if(!data?.source_observations?.length)return null;
  const section=make('section','beauty-fashion-query-series');
  const details=make('details','beauty-fashion-query-details');
  details.append(make('summary','','Beauty, fashion and routine title-query evidence · units and seasons'));
  details.append(make('p','measure-limit','Five global platform-reported title searches use different date ranges, predicates and units. Their values cannot be combined into a popularity ranking or year-over-year growth line.'));
  const grid=make('div','beauty-fashion-query-grid');
  for(const item of data.source_observations){
    const card=make('article','beauty-fashion-query-card');
    card.append(make('h5','',item.theme.replaceAll('_',' ')));
    const figure=(item.value/1000000).toLocaleString()+'M '+item.unit.replaceAll('_',' ');
    card.append(make('strong','', 'More than '+figure));
    card.append(make('p','',item.period_start+' to '+item.period_end));
    card.append(make('p','measure-limit','Selection: '+item.title_rule));
    card.append(make('p','measure-limit',item.period_end_qualification));
    card.append(audienceSources([item.source_id],dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','Prom and Halloween may be calendar-linked, but seasonal effects were not measured. The 2026 morning-routine value counts uploads, not views. The August 24, 2026 public viewing-definition break also prevents naive cross-year comparisons.'));
  details.append(make('p','measure-limit','Year-over-year trend, unique people, creator population, seasonality magnitude and creator income: unknown.'));
  const link=make('a','inline-link','Read exact source predicates, observation windows and query-series protocol ↗');
  link.href='./ontology/youtube/beauty-fashion-query-series.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderAnimationFormatCycles(data,dossier){
  if(!data?.timeline?.length)return null;
  const section=make('section','animation-format-cycles');
  const details=make('details','animation-format-details');
  details.append(make('summary','','Independent animation and meme formats · 2024–2026 evidence'));
  details.append(make('p','measure-limit','Publication dates are not necessarily measurement dates. The U.S. and Mexico survey findings released in 2026 both used April 2025 samples of online animation fans, not all YouTube users.'));
  if(data.anime_view_geography_2023){
    const evidence=data.anime_view_geography_2023;
    details.append(make('p','measure-limit','Anime geography: >'+evidence.percent_lower_bound_exclusive+'% of 2023 global anime-related video views occurred outside Japan. View events are not unique viewers or an adult-audience percentage.'));
    details.append(audienceSources([evidence.source_id],dossier));
  }
  const timeline=make('div','animation-format-timeline');
  for(const item of data.timeline){
    const card=make('article','animation-format-event');
    card.append(make('h5','',item.published_at+' · '+item.format.replaceAll('_',' ')));
    card.append(make('p','',item.description));
    card.append(make('p','measure-limit','Evidence type: '+item.event_type.replaceAll('_',' ')+' · Fieldwork: '+item.observation_period));
    card.append(audienceSources([item.source_id],dossier));
    timeline.append(card);
  }
  details.append(timeline);
  const observations=make('div','animation-format-surveys');
  for(const item of data.survey_observations){
    const card=make('article','animation-format-survey');
    card.append(make('strong','',item.reported_percent+'%'));
    card.append(make('p','',item.country+' · '+item.ages+' · '+item.question.replaceAll('_',' ')));
    card.append(make('p','measure-limit','Online sample N='+item.sample_total_n+'; per-question respondent count unknown.'));
    observations.append(card);
  }
  details.append(observations);
  details.append(make('p','measure-limit','These are different questions and populations; no 2024–2026 audience growth rate, seasonality, format profit or representative animation-creator count is measured.'));
  const link=make('a','inline-link','Source frames, event dates and limits on trend claims ↗');
  link.href='./ontology/youtube/animation-format-cycles.md';link.rel='noopener noreferrer';link.target='_blank';
  details.append(link);section.append(details);return section;
}

function renderVideoAttentionCulture(data,dossier){
  if(!data?.source_families?.length)return null;
  const section=make('section','video-attention-culture');
  const details=make('details','video-attention-details');
  details.append(make('summary','','YouTube video attention and niche culture · distinct 2025–2026 evidence'));
  details.append(make('p','measure-limit','Omdia studied the supply and viewing time of videos; YouTube/NRG surveyed U.S. online respondents about niches and personal interests. Their categories, units, periods and audiences cannot be merged into one user or creator estimate.'));
  const grid=make('div','video-attention-grid');
  for(const family of data.source_families){
    const card=make('article','video-attention-card');
    card.append(make('h5','',family.id==='omdia-2026'?'Omdia · video supply and watch time':'YouTube/NRG · U.S. niche and fandom survey'));
    card.append(make('p','measure-context',family.population));
    const list=make('ul','video-attention-observations');
    const matches=data.observations.filter(x=>family.source_ids.includes(x.source_id));
    for(const obs of matches){
      const item=make('li','video-attention-observation');
      const number=obs.id==='omdia-video-stock-dec2025'?'~29 billion':obs.comparison==='greater_than'?'More than '+obs.value+'%':obs.value+'%';
      const label=obs.id==='omdia-video-stock-dec2025'?'Estimated hosted videos, December 2025':obs.measurement.replaceAll('_',' ');
      item.append(make('strong','',number));
      item.append(make('span','',label));
      list.append(item);
    }
    card.append(list);
    card.append(make('p','measure-limit',family.method));
    card.append(audienceSources(family.source_ids,dossier));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','The Omdia video genres and production categories may overlap; they must not be added to 100%. The 496-person and 939-person NRG respondent frames are age-dependent, not global YouTube audience populations.'));
  details.append(make('p','measure-limit','Distinct niche viewers, creator income, per-niche profit, active creators and cross-category audience intersections remain unknown.'));
  const link=make('a','inline-link','Read the dated studies, denominators and methodological exclusions ↗');
  link.href='./ontology/youtube/video-attention-culture-2026.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderHistoricalLinkingStudy(data,dossier){
  if(!data?.population?.channels)return null;
  const section=make('section','historical-linking');
  const details=make('details','historical-linking-details');
  details.append(make('summary','','Historical 2019 channel linking · not creator earnings'));
  details.append(make('p','measure-limit',data.population.channels.toLocaleString()+' channels with at least 100,000 subscribers, observed at the end of 2019. This selected sample is not representative of new creators or all channels in 2026.'));
  const grid=make('div','historical-linking-grid');
  for(const [label,key] of [['Marketplace links','marketplace'],['Crowdfunding links','crowdfunding']]){
    const item=data.channel_linking[key].find(x=>x.id==='less_than_20pct');
    const zero=data.channel_linking[key].find(x=>x.id==='none');
    const card=make('article','historical-link-card');
    card.append(make('h5','',label));
    card.append(make('strong','historical-link-share',item.percent_reported+'%'));
    card.append(make('p','measure-limit','Of sampled channels had links in fewer than 20% of videos; includes '+zero.percent_reported+'% with no such links.'));
    grid.append(card);
  }
  details.append(grid);
  details.append(make('p','measure-limit','A URL in a video description is not evidence of sales, sponsorship revenue, creator profit or a causal strategy. The paper also models advertising revenue; that model is not observed channel payout data.'));
  details.append(audienceSources([data.source.source_id],dossier));
  const link=make('a','inline-link','Read the historical sample and its denominator limits ↗');
  link.href='./ontology/youtube/historical-linking-study.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);return section;
}

function renderCompetitionSample(data,dossier) {
  if(!data)return null;
  const section=make('section','competition-sample');
  const details=make('details','competition-sample-details');
  details.append(make('summary','','Creator competition: one commercial analytics sample'));
  details.append(make('p','measure-limit','Metricool analyzed '+data.source.sampled_videos.toLocaleString()+' videos from '+data.source.sampled_accounts.toLocaleString()+' accounts. The recruitment frame and exact date windows are not fully disclosed; these figures are not universal creator success rates.'));
  const groups=make('div','competition-grid');
  for(const item of data.cohort_tier_transitions){
    const cell=make('article','competition-tier');
    cell.append(make('h5','',item.tier+' channels'));
    cell.append(make('strong','',item.share_moved_up_percent+'%'));
    cell.append(make('small','', 'Moved to a higher subscriber tier in the observed cohort'));
    groups.append(cell);
  }
  details.append(groups);
  const sources=make('details','competition-traffic');
  sources.append(make('summary','','Traffic attribution in this sampled dataset'));
  const list=make('div','competition-traffic-grid');
  for(const item of data.traffic_source_share_of_sampled_organic_views){
    const row=make('article','competition-traffic-item');
    row.append(make('strong','',item.percent+'%'));
    row.append(make('span','',item.id.replaceAll('_',' ')));
    list.append(row);
  }
  sources.append(list);details.append(sources);
  details.append(make('p','measure-limit','These movements and traffic shares are descriptive, not the probability of monetizing a new channel. Short-form and long-form revenue changes can also reflect selection, seasonality and viewing-metric revisions.'));
  details.append(audienceSources([data.source.id],dossier));
  const link=make('a','inline-link','Read study limitations and exact cohorts ↗');
  link.href='./ontology/youtube/competition-observations.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);
  section.append(details);return section;
}

function renderAcademicResearch(data,dossier) {
  if(!data?.studies?.length)return null;
  const section=make('section','academic-research');
  const details=make('details','academic-research-details');
  details.append(make('summary','','Academic studies of creator income and viewing · '+data.studies.length+' studies'));
  details.append(make('p','measure-limit','The studies measure different regions, creators and types of income. Their abstracts were checked, but complete methods and source datasets have not yet been audited. They cannot be pooled into a typical YouTube salary.'));
  const grid=make('div','academic-studies-grid');
  for(const paper of data.studies){
    const card=make('article','academic-study');
    card.append(make('h5','',paper.title));
    card.append(make('p','',paper.year+' · '+paper.scope));
    if(paper.numeric?.gini_coefficient!==undefined){
      card.append(make('p','', 'Reported sample earnings Gini: '+paper.numeric.gini_coefficient));
    } else if(paper.sample_n!==null){
      card.append(make('p','', 'Studied channels/creators: '+paper.sample_n.toLocaleString()));
    }
    const findings=make('ul','academic-findings');
    for(const sentence of paper.findings)findings.append(make('li','',sentence));
    card.append(findings);
    card.append(make('p','measure-limit',paper.limitations[0]));
    card.append(audienceSources([paper.id],dossier));
    grid.append(card);
  }
  details.append(grid);
  const link=make('a','inline-link','Read the research boundaries and bibliography ↗');
  link.href='./ontology/youtube/academic-studies.md';link.target='_blank';link.rel='noopener noreferrer';
  details.append(link);section.append(details);
  return section;
}

async function showDossier(entry) {
  const host=$('#dossier-view');
  host.hidden=false;
  host.replaceChildren(make('p','unresearched','Loading research record…'));
  host.scrollIntoView({behavior:'smooth',block:'start'});
  try {
    const [record,work,studyPlan,platformPolicy,yppFuture,topicCatalog,topicActivity,samplingBudget,adultUseHistory,incomeEvidence,channelIncome,crossPlatformIncome,airStudioBenchmarks,lifecycleHorizons,newcomerIncomeProtocol,earningRoutes,payoutGates,opportunityFramework,contentRestrictions,advertiserHistory,musicRights,productionCosts,productionEffort,viewDefinition,analyticsGuide,platformScale,countryReach,geographicScope,audienceOverlap,beautyGamingPanel,genderCommunityEvidence,childrenSeasonality,viewerPersonMetrics,usDemographicUse,identityResearch,surveyFrameCrosswalk,countryProgramAccess,taxWithholding,brandDisclosure,sponsorCategoryEvidence,publishingCadence,creatorSafety,trafficConcentration,euCreatorConsultation,eligibilityMatrix,channelOnboarding,creatorEntryGates,creatorLocalization,nielsenTvShare,podcastViewing,podcastPublication,channelOwnership,applicationLifecycle,creatorGrowth,retentionPostsMemberships,promoteEconomics,contentFormats,publishTimeStudy,seasonalDiscovery,decliningTopicAudit,researchSynthesis,videoSurfaceEconomics,screenViewingStudy,childAgeFormat,teenFormatEvidence,multilingualDistribution,newsAudienceStudy,competitionSample,historicalLinking,videoAttentionCulture,animationFormatCycles,beautyFashionQueries,nflSeasonality,gamingReleaseEvents,creatorCollaboration,commentNormsEvidence,technologySubcultures,financeContent,healthFitness,comparisonSet,academicResearch,reputationPortability,monetizationHistory,creatorPortability,videoQualityResearch,channelTopicJoin,creatorInactivity,childEconomics,demographicCrossTabs,subscriptionStatusStudy,nicheUncertaintyStudy,creatorPopulationStudy,viewerNeedsStudy,countryLanguageStudy,videoConcentrationStudy,newsSurveyChanges,priceOptionsStudy,evidenceQualityStudy,countryPlannerWindows,accountPopulationGraph,taxonomyDriftStudy,offerListingStudy,nicheConcentration,languageMarketResearch,publicMemeGraph,nicheUploadEvidence,memeFormatStudy,checkoutRefundEvidence,memberCohortProtocol,shortsReferralStudy,audiencePopulationCrosswalk,countryAdReach,usNewsDemographics,neutralNewsResearch,virtualWorshipStudy,syntheticMediaPolicy,recommendationEvidence,channelCohortEvidence,firstUploadVlogStudy,externalLinkFunnel,retentionObservability,patreonShock,reactionRights,crossplatformPosting,gamingPeriods,searchDemandProxy,videoProductionCosts,exclusiveRightsEvidence,fraudSecurity,oxfordCreatorStudy,alphabetAdsStudy,payoutScale,nativePackagingAB,playlistStudy,vtuberSuperchatStudy,liveChatCulture,ytLiveAttendance,shoppingFunnel,agentioSponsorStudy,engagedViewStudy,monthlyCreatorCash,monthlyVolatilityStudy,photographyLabor,adobeProductionSurvey,liveMonetizationUnits,watchPageAdModel,nichePilotBudget,languageAudienceCrosswalk,publicCommunityPosts,commentLanguageResearch,educationalVideoStudies,memeTrendingEvidence,creatorCountryIncome,creatorProcessing,airCountryCPM,evergreenSearchStudy,airRevenueConcentration,creatorHourlyBounds,contentIDRevenue,contentIDAppeals,countryPolicyStudy,videoEssayCohort,smallChannelDiscovery,fashionLifestyleSignals]=await Promise.all([read(entry.dossier),read(entry.queue),entry.plan?read(entry.plan):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/policies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/ypp-transition-2027.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/taxonomy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/topic-observations.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/public-api-sampling-budget.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-adult-usage-history.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-income-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/small-channel-income.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/cross-platform-income-surveys.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/air-studio-benchmarks-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/lifecycle-horizons.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/newcomer-income-cohort.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/revenue-pathways.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/payment-gates.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/opportunity-framework.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-policy-risk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/advertiser-policy-history.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/music-rights-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/production-costs.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/production-effort-comparison.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/view-definition-break.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/analytics-query-guide.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/platform-scale.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-reach-devices.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/geographic-scope.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/audience-overlap.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/beauty-gaming-overlap-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/gender-community-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/children-media-seasonality.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/viewer-person-metrics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-demographic-use-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/demographic-identity-uncertainty.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/study-frame-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-eligibility-payments.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/tax-withholding-mechanics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/brand-disclosure-risk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/sponsor-category-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/publishing-cadence-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-safety-continuity.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/traffic-concentration.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/eu-creator-consultation-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/eligibility-matrix.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-onboarding.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-entry-gates-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-localization-access-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/nielsen-us-tv-youtube-share-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/podcast-viewing-frames-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/podcast-publication-routes-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-ownership-continuity.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/application-lifecycle.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-growth.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/retention-posts-memberships.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/promote-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-formats.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/geographic-publishing-time.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/seasonal-discovery-comparison.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/declining-content-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/research-synthesis-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-surfaces-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/screen-viewing-uk-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/child-age-and-format-gates.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/teen-video-format-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/multilingual-distribution.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/community-audience-studies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/competition-observations.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/historical-linking-study.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-attention-culture-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/animation-format-cycles.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/beauty-fashion-query-series.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/nfl-view-seasonality-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/gaming-release-events.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-collaboration-fandom-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/comment-norms-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/technology-subcultures-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/finance-content-taxonomy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/health-fitness-content.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/comparison-set.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/academic-studies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/reputation-portability.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/monetization-history-2006-2027.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/cross-platform-portability-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-quality-production-crosswalk-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-supply-topic-attention-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-inactivity-frames-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/child-directed-economics-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/demographic-cross-tab-availability-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/subscriber-status-reach-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/niche-uncertainty-ranges-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-activity-population-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/viewer-need-hypotheses-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-language-matrix-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-concentration-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-news-reported-change-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/membership-price-options-mx-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/evidence-quality-scope-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-planner-change-windows-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/product-account-population-graph-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/taxonomy-drift-protocol-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/offer-listing-controls-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/niche-attention-concentration-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/language-market-comparability-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/public-meme-reference-graph-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/niche-upload-volume-2024-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/meme-format-typology-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/checkout-refund-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/member-cohort-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/shorts-related-video-funnel.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/audience-population-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-ad-reach-comparisons.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-news-demographic-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/neutral-news-attention-protocol-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/virtual-worship-not-youtube-audience-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/synthetic-media-rights-policy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/recommendation-surface-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-cohort-observations-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/first-upload-vlog-study-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/external-link-funnel-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/retention-observability.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/patreon-revenue-shock-2015.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/reaction-compilation-rights.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/crossplatform-posting-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/gaming-livestream-quarterly-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/search-demand-proxy-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-production-cost-register.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/exclusive-rights-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-fraud-security.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/oxford-creator-impact-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/alphabet-youtube-ads-sec-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/platform-creator-payout-scale.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/native-packaging-ab-tests.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/playlist-series-observability.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/vtuber-superchat-cohort-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/live-chat-culture-observations-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/ytlive-attendance-observations-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/shopping-funnel-evidence-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/agentio-sponsor-delivery-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/agentio-engaged-view-series-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/monthly-creator-cash-flow-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/monthly-income-volatility-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/photography-production-time-diary-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/adobe-ai-production-survey-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/live-monetization-units-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/watch-page-ad-accounting.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/niche-pilot-budget-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/language-audience-api-crosswalk-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/public-community-post-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/public-comment-language-protocol-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/educational-video-format-cohorts-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/meme-trending-observability-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-country-income-comparability.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-processing-settlement-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/air-2025-viewer-cpm-countries.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/evergreen-search-window-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/air-300-revenue-concentration-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/hourly-income-accounting.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-id-revenue-dispute-audit.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-id-appeal-routes-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-essay-sample-observations-2024.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/small-channel-discoverability-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/fashion-lifestyle-content-signals-2026.json'):Promise.resolve(null)]);
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
    const transition=renderYppFutureTransition(yppFuture,record);
    if(transition)outer.append(transition);
    const routes=renderRevenuePathways(earningRoutes,payoutGates,record,eligibilityMatrix);
    if(routes)outer.append(routes);
    const podPublishing=renderPodcastPublicationRoutes(podcastPublication,record);
    if(podPublishing)outer.append(podPublishing);
    const podcastPanel=renderPodcastViewingFrames(podcastViewing,record);
    if(podcastPanel)outer.append(podcastPanel);
    const tvShare=renderNielsenTelevisionShare(nielsenTvShare,record);
    if(tvShare)outer.append(tvShare);
    const localization=renderCreatorLocalizationAccess(creatorLocalization,record);
    if(localization)outer.append(localization);
    const entryRules=renderCreatorEntryGates(creatorEntryGates,record);
    if(entryRules)outer.append(entryRules);
    const entryStages=renderChannelOnboarding(channelOnboarding,record);
    if(entryStages)outer.append(entryStages);
    const ownership=renderChannelOwnership(channelOwnership,record);
    if(ownership)outer.append(ownership);
    const reputation=renderReputationPortability(reputationPortability,record);
    if(reputation)outer.append(reputation);
    const historicalRules=renderMonetizationHistory(monetizationHistory,record);
    if(historicalRules)outer.append(historicalRules);
    const portability=renderCreatorPortability(creatorPortability,record);
    if(portability)outer.append(portability);
    const qualityResearch=renderVideoQualityResearch(videoQualityResearch,record);
    if(qualityResearch)outer.append(qualityResearch);
    const supplyJoin=renderChannelTopicJoin(channelTopicJoin,record);
    if(supplyJoin)outer.append(supplyJoin);
    const inactivity=renderCreatorInactivity(creatorInactivity,record);
    if(inactivity)outer.append(inactivity);
    const childEconomicSection=renderChildEconomics(childEconomics,record);
    if(childEconomicSection)outer.append(childEconomicSection);
    const demographicCells=renderDemographicCrossTabs(demographicCrossTabs,record);
    if(demographicCells)outer.append(demographicCells);
    const subscriberStudy=renderSubscriptionStatus(subscriptionStatusStudy,record);
    if(subscriberStudy)outer.append(subscriberStudy);
    const uncertaintyStudy=renderNicheUncertainty(nicheUncertaintyStudy,record);
    if(uncertaintyStudy)outer.append(uncertaintyStudy);
    const populationStudy=renderCreatorPopulation(creatorPopulationStudy,record);
    if(populationStudy)outer.append(populationStudy);
    const viewerHypotheses=renderViewerNeedHypotheses(viewerNeedsStudy,record);
    if(viewerHypotheses)outer.append(viewerHypotheses);
    const languageCountries=renderCountryLanguageMatrix(countryLanguageStudy,record);
    if(languageCountries)outer.append(languageCountries);
    const videoConcentrationCard=renderVideoConcentration(videoConcentrationStudy,record);
    if(videoConcentrationCard)outer.append(videoConcentrationCard);
    const annualNewsTrendPanel=renderSurveyNewsChange(newsSurveyChanges,record);
    if(annualNewsTrendPanel)outer.append(annualNewsTrendPanel);
    const officialPrices=renderMembershipPriceOptions(priceOptionsStudy,record);
    if(officialPrices)outer.append(officialPrices);
    const qualitySection=renderEvidenceQuality(evidenceQualityStudy,record);
    if(qualitySection)outer.append(qualitySection);
    const countryWindows=renderPlannerWindowPanel(countryPlannerWindows,record);
    if(countryWindows)outer.append(countryWindows);
    const accounts=renderAccountPopulationGraph(accountPopulationGraph,record);
    if(accounts)outer.append(accounts);
    const drift=renderTopicTaxonomyDrift(taxonomyDriftStudy,record);
    if(drift)outer.append(drift);
    const listing=renderOfferListingControls(offerListingStudy,record);
    if(listing)outer.append(listing);
    const nicheVideoAttentionSection=renderNicheConcentration(nicheConcentration,record);
    if(nicheVideoAttentionSection)outer.append(nicheVideoAttentionSection);
    const languageStudy=renderLanguageMarkets(languageMarketResearch,record);
    if(languageStudy)outer.append(languageStudy);
    const memeLinkStudy=renderPublicMemeGraph(publicMemeGraph,record);
    if(memeLinkStudy)outer.append(memeLinkStudy);
    const uploadVolumeSection=renderNicheUploads(nicheUploadEvidence,record);
    if(uploadVolumeSection)outer.append(uploadVolumeSection);
    const memeFormatSection=renderMemeFormats(memeFormatStudy,record);
    if(memeFormatSection)outer.append(memeFormatSection);
    const checkoutAudit=renderCheckoutRefundEvidence(checkoutRefundEvidence,record);
    if(checkoutAudit)outer.append(checkoutAudit);
    const cohortStudy=renderMemberCohortResearch(memberCohortProtocol,record);
    if(cohortStudy)outer.append(cohortStudy);
    const shortsFlow=renderShortsReferralStudy(shortsReferralStudy,record);
    if(shortsFlow)outer.append(shortsFlow);
    const audienceBase=renderAudiencePopulationCrosswalk(audiencePopulationCrosswalk,record);
    if(audienceBase)outer.append(audienceBase);
    const adCountries=renderCountryAdReach(countryAdReach,record);
    if(adCountries)outer.append(adCountries);
    const worship=renderVirtualWorshipBoundary(virtualWorshipStudy,record);
    if(worship)outer.append(worship);
    const neutralNews=renderNeutralNewsAttention(neutralNewsResearch,record);
    if(neutralNews)outer.append(neutralNews);
    const usNews=renderUSNewsDemographics(usNewsDemographics,record);
    if(usNews)outer.append(usNews);
    const syntheticPolicy=renderSyntheticMediaPolicy(syntheticMediaPolicy,record);
    if(syntheticPolicy)outer.append(syntheticPolicy);
    const engaged=renderAgentioEngagedViews(engagedViewStudy,record);
    if(engaged)outer.append(engaged);
    const watchAdAccounting=renderWatchPageAdAccounting(watchPageAdModel,record);
    if(watchAdAccounting)outer.append(watchAdAccounting);
    const liveMoney=renderLiveMonetizationUnits(liveMonetizationUnits,record);
    if(liveMoney)outer.append(liveMoney);
    const memes=renderMemeTrendingEvidence(memeTrendingEvidence,record);
    if(memes)outer.append(memes);
    const education=renderEducationalVideoStudies(educationalVideoStudies,record);
    if(education)outer.append(education);
    const commentLang=renderPublicCommentLanguageResearch(commentLanguageResearch,record);
    if(commentLang)outer.append(commentLang);
    const publicPosts=renderPublicCommunityPosts(publicCommunityPosts,record);
    if(publicPosts)outer.append(publicPosts);
    const langPanel=renderLanguageAudienceCrosswalk(languageAudienceCrosswalk,record);
    if(langPanel)outer.append(langPanel);
    const nichePilot=renderNichePilotBudget(nichePilotBudget,record);
    if(nichePilot)outer.append(nichePilot);
    const countryCPM=renderAIRCountryAdvertiserCPM(airCountryCPM,record);
    if(countryCPM)outer.append(countryCPM);
    const revenueConcentration=renderAIRRevenueConcentration(airRevenueConcentration,record);
    if(revenueConcentration)outer.append(revenueConcentration);
    const evergreen=renderEvergreenSearchWindows(evergreenSearchStudy,record);
    if(evergreen)outer.append(evergreen);
    const fashion=renderFashionLifestyleSignals(fashionLifestyleSignals,record);
    if(fashion)outer.append(fashion);
    const reachStudy=renderSmallChannelDiscovery(smallChannelDiscovery,record);
    if(reachStudy)outer.append(reachStudy);
    const essayStudy=renderVideoEssayCohort(videoEssayCohort,record);
    if(essayStudy)outer.append(essayStudy);
    const countryStudy=renderCountryPolicyCrosswalk(countryPolicyStudy,record);
    if(countryStudy)outer.append(countryStudy);
    const appealRoutes=renderContentIDAppealRoutes(contentIDAppeals,record);
    if(appealRoutes)outer.append(appealRoutes);
    const rightsCash=renderContentIDRevenueAudit(contentIDRevenue,record);
    if(rightsCash)outer.append(rightsCash);
    const processing=renderCreatorProcessingSettlement(creatorProcessing,record);
    if(processing)outer.append(processing);
    const geoIncome=renderCreatorCountryIncomeComparability(creatorCountryIncome,record);
    if(geoIncome)outer.append(geoIncome);
    const vendorTime=renderAdobeAIProductionSurvey(adobeProductionSurvey,record);
    if(vendorTime)outer.append(vendorTime);
    const laborCase=renderPhotographyLaborStudy(photographyLabor,record);
    if(laborCase)outer.append(laborCase);
    const hourly=renderCreatorHourlyBounds(creatorHourlyBounds,record);
    if(hourly)outer.append(hourly);
    const volatility=renderMonthlyVolatilityProtocol(monthlyVolatilityStudy,record);
    if(volatility)outer.append(volatility);
    const cashCycle=renderMonthlyCreatorCashFlowProtocol(monthlyCreatorCash,payoutGates,record);
    if(cashCycle)outer.append(cashCycle);
    const sponsorPanel=renderAgentioSponsorEvidence(agentioSponsorStudy,record);
    if(sponsorPanel)outer.append(sponsorPanel);
    const buyerPath=renderShoppingFunnelEvidence(shoppingFunnel,record);
    if(buyerPath)outer.append(buyerPath);
    const ytLive=renderYTLiveAttendance(ytLiveAttendance,record);
    if(ytLive)outer.append(ytLive);
    const liveCulture=renderLiveChatCultureStudy(liveChatCulture,record);
    if(liveCulture)outer.append(liveCulture);
    const superchats=renderVTuberSuperchatStudy(vtuberSuperchatStudy,record);
    if(superchats)outer.append(superchats);
    const playlistPanel=renderPlaylistSeriesStudy(playlistStudy,record);
    if(playlistPanel)outer.append(playlistPanel);
    const packaging=renderNativePackagingAB(nativePackagingAB,record);
    if(packaging)outer.append(packaging);
    const recs=renderRecommendationEvidence(recommendationEvidence,record);
    if(recs)outer.append(recs);
    const payouts=renderCreatorPayoutScale(payoutScale,record);
    if(payouts)outer.append(payouts);
    const ads=renderAlphabetAdRevenue(alphabetAdsStudy,record);
    if(ads)outer.append(ads);
    const oxford=renderOxfordCreatorImpact(oxfordCreatorStudy,record);
    if(oxford)outer.append(oxford);
    const cohorts=renderChannelCohorts(channelCohortEvidence,record);
    if(cohorts)outer.append(cohorts);
    const vlog=renderFirstUploadVlogStudy(firstUploadVlogStudy,record);
    if(vlog)outer.append(vlog);
    const linkFunnel=renderExternalLinkFunnel(externalLinkFunnel,record);
    if(linkFunnel)outer.append(linkFunnel);
    const retention=renderRetentionObservability(retentionObservability,record);
    if(retention)outer.append(retention);
    const shock=renderPatreonRevenueShock(patreonShock,record);
    if(shock)outer.append(shock);
    const reuse=renderReactionCompilationRights(reactionRights,record);
    if(reuse)outer.append(reuse);
    const crossposting=renderCrossplatformPosting(crossplatformPosting,record);
    if(crossposting)outer.append(crossposting);
    const gamingStudy=renderGamingPeriods(gamingPeriods,record);
    if(gamingStudy)outer.append(gamingStudy);
    const demand=renderSearchDemandProxy(searchDemandProxy,record);
    if(demand)outer.append(demand);
    const production=renderVideoProductionCosts(videoProductionCosts,record);
    if(production)outer.append(production);
    const exRights=renderExclusiveRights(exclusiveRightsEvidence,record);
    if(exRights)outer.append(exRights);
    const fraud=renderFraudSecurity(fraudSecurity,record);
    if(fraud)outer.append(fraud);
    const onboarding=renderApplicationLifecycle(applicationLifecycle);
    if(onboarding)outer.append(onboarding);
    const restricted=renderContentRestrictions(contentRestrictions,record);
    if(restricted)outer.append(restricted);
    const adsChanges=renderAdvertiserPolicyHistory(advertiserHistory,record);
    if(adsChanges)outer.append(adsChanges);
    const music=renderMusicRights(musicRights,record);
    if(music)outer.append(music);
    const costStudy=renderProductionCosts(productionCosts);
    if(costStudy)outer.append(costStudy);
    const effort=renderProductionEffortComparison(productionEffort,record);
    if(effort)outer.append(effort);
    const metricsGuide=renderMeasurementGuide(analyticsGuide);
    if(metricsGuide)outer.append(metricsGuide);
    const counted=renderViewDefinitionBreak(viewDefinition,record);
    if(counted)outer.append(counted);
    const scale=renderPlatformScale(platformScale);
    if(scale)outer.append(scale);
    const country=renderCountryReachDevices(countryReach,record);
    if(country)outer.append(country);
    const geography=renderGeographicScope(geographicScope,record);
    if(geography)outer.append(geography);
    const overlap=renderAudienceOverlapResearch(audienceOverlap,record);
    if(overlap)outer.append(overlap);
    const overlapPanel=renderBeautyGamingOverlap(beautyGamingPanel,record);
    if(overlapPanel)outer.append(overlapPanel);
    const genderGroups=renderGenderCommunityEvidence(genderCommunityEvidence,record);
    if(genderGroups)outer.append(genderGroups);
    const childSeasonality=renderChildrenSeasonality(childrenSeasonality,record);
    if(childSeasonality)outer.append(childSeasonality);
    const personMetrics=renderViewerPersonMetrics(viewerPersonMetrics,record);
    if(personMetrics)outer.append(personMetrics);
    const demo=renderUsDemographicUse(usDemographicUse,record);
    if(demo)outer.append(demo);
    const identity=renderIdentityResearch(identityResearch,record);
    if(identity)outer.append(identity);
    const frame=renderSurveyFrameCrosswalk(surveyFrameCrosswalk,record);
    if(frame)outer.append(frame);
    const countryPrograms=renderCountryProgramAccess(countryProgramAccess,record);
    if(countryPrograms)outer.append(countryPrograms);
    const taxes=renderTaxWithholdingResearch(taxWithholding,record);
    if(taxes)outer.append(taxes);
    const brand=renderBrandDisclosureRisk(brandDisclosure,record);
    if(brand)outer.append(brand);
    const sponsors=renderSponsorCategoryResearch(sponsorCategoryEvidence,record);
    if(sponsors)outer.append(sponsors);
    const cadence=renderPublishingCadenceStudy(publishingCadence,record);
    if(cadence)outer.append(cadence);
    const safety=renderCreatorSafety(creatorSafety,record);
    if(safety)outer.append(safety);
    const concentration=renderTrafficConcentration(trafficConcentration,record);
    if(concentration)outer.append(concentration);
    const eu=renderEuCreatorConsultation(euCreatorConsultation,record);
    if(eu)outer.append(eu);
    const discoveryModel=renderCreatorGrowth(creatorGrowth,record);
    if(discoveryModel)outer.append(discoveryModel);
    const returnStudy=renderPostAndMembershipRetention(retentionPostsMemberships,record);
    if(returnStudy)outer.append(returnStudy);
    const promotion=renderPromoteResearch(promoteEconomics,record);
    if(promotion)outer.append(promotion);
    const formats=renderContentFormats(contentFormats,record);
    if(formats)outer.append(formats);
    const publishTimes=renderPublishingTimeResearch(publishTimeStudy,record);
    if(publishTimes)outer.append(publishTimes);
    const seasonal=renderSeasonalDiscovery(seasonalDiscovery,record);
    if(seasonal)outer.append(seasonal);
    const declineAudit=renderDecliningTopicAudit(decliningTopicAudit,record);
    if(declineAudit)outer.append(declineAudit);
    const synthesis=renderEvidenceSynthesis(researchSynthesis,record);
    if(synthesis)outer.append(synthesis);
    const surfaces=renderVideoSurfaceEconomics(videoSurfaceEconomics,record);
    if(surfaces)outer.append(surfaces);
    const screen=renderScreenViewingStudy(screenViewingStudy,record);
    if(screen)outer.append(screen);
    const kids=renderChildAgeFormatStudy(childAgeFormat,record);
    if(kids)outer.append(kids);
    const youthFormats=renderTeenVideoFormatEvidence(teenFormatEvidence,record);
    if(youthFormats)outer.append(youthFormats);
    const multilingual=renderMultilingualDistribution(multilingualDistribution,record);
    if(multilingual)outer.append(multilingual);
    const audience=renderAudienceResearch(record);
    if(audience)outer.append(audience);
    const history=renderAdultUseHistory(adultUseHistory);
    if(history)outer.append(history);
    const newsStudy=renderCommunityAudienceStudy(newsAudienceStudy,record);
    if(newsStudy)outer.append(newsStudy);
    const competitors=renderCompetitionSample(competitionSample,record);
    if(competitors)outer.append(competitors);
    const historicalLinks=renderHistoricalLinkingStudy(historicalLinking,record);
    if(historicalLinks)outer.append(historicalLinks);
    const attention=renderVideoAttentionCulture(videoAttentionCulture,record);
    if(attention)outer.append(attention);
    const animation=renderAnimationFormatCycles(animationFormatCycles,record);
    if(animation)outer.append(animation);
    const beauty=renderBeautyFashionQuerySeries(beautyFashionQueries,record);
    if(beauty)outer.append(beauty);
    const nfl=renderNflSeasonality(nflSeasonality,record);
    if(nfl)outer.append(nfl);
    const gamingEvent=renderGamingReleaseEvents(gamingReleaseEvents,record);
    if(gamingEvent)outer.append(gamingEvent);
    const collab=renderCreatorCollaborationEvidence(creatorCollaboration,record);
    if(collab)outer.append(collab);
    const commentNorms=renderCommentNormsEvidence(commentNormsEvidence,record);
    if(commentNorms)outer.append(commentNorms);
    const finance=renderFinanceContentTaxonomy(financeContent,record);
    if(finance)outer.append(finance);
    const fitness=renderHealthFitnessResearch(healthFitness,record);
    if(fitness)outer.append(fitness);
    const technologies=renderTechnologySubcultures(technologySubcultures,record);
    if(technologies)outer.append(technologies);
    const comparators=renderPlatformComparisonSet(comparisonSet,record);
    if(comparators)outer.append(comparators);
    const literature=renderAcademicResearch(academicResearch,record);
    if(literature)outer.append(literature);
    const crossIncome=renderCrossPlatformIncomeSurveys(crossPlatformIncome,record);
    if(crossIncome)outer.append(crossIncome);
    const horizons=renderLifecycleHorizons(lifecycleHorizons,record);
    if(horizons)outer.append(horizons);
    const air=renderAirStudioBenchmarks(airStudioBenchmarks,record);
    if(air)outer.append(air);
    const newcomer=renderNewcomerIncomeProtocol(newcomerIncomeProtocol,record);
    if(newcomer)outer.append(newcomer);
    const incomeStudy=renderCreatorIncomeEvidence(incomeEvidence);
    if(incomeStudy)outer.append(incomeStudy);
    const channelStudy=renderSmallChannelStudy(channelIncome);
    if(channelStudy)outer.append(channelStudy);
    const coverage=renderTopicEvidenceCoverage(topicCatalog,topicActivity);
    if(coverage)outer.append(coverage);
    const catalogue=renderTopicCatalogue(topicCatalog,topicActivity);
    if(catalogue)outer.append(catalogue);
    const sampling=renderPublicSamplingBudget(samplingBudget,record);
    if(sampling)outer.append(sampling);
    const method=renderOpportunityFramework(opportunityFramework,topicCatalog,topicActivity);
    if(method)outer.append(method);
    if(entry.id==='youtube')outer.append(renderScenarioCalculator());
    if(entry.id==='youtube')outer.append(renderBreakEvenCalculator());
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
    console.error('Mercata dossier failed to render: '+String(error?.stack || error));
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

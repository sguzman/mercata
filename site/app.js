import {evaluateIncomeScenario} from './scenario.mjs';
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
 details.append(make('p','measure-limit','Native owner revenue differs from public views, RPM, sponsor receipts, external sales, cash costs and unpaid labor. Mixed 2026 view definitions cannot be pooled.'));
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
 details.append(make('p','measure-limit','Monthly audience = rolling 28-day channel estimate. Unique viewers = owner-scoped modeled people for selected periods up to 90 days. Neither is a published worldwide person census.'));
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
 details.append(make('p','measure-limit','With a complete authorized same-period source partition, calculate largest source share and HHI. An HHI does not measure ownership, profit, volatility or the probability of algorithmic harm.'));
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
 details.append(make('p','measure-limit','Separate July distribution: '+m.included_channels.toLocaleString('en-US')+' indexed channels with at least one subscriber. The group comparisons do not prove uploading causes growth or that creators earn money.'));
 const link=make('a','inline-link','Read cohort sampling, percentages and non-causal limitations ↗');
 link.href='./ontology/youtube/channel-cohort-observations-2026.md';link.target='_blank';link.rel='noopener noreferrer';details.append(link);section.append(details);return section;
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
 details.append(make('p','measure-limit','The deduplicated worldwide MAU and DAU remain unknown, as does cross-account deduplication.'));
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
      card.append(make('p','measure-limit','This is a selected sample of political channels, not a platform-wide commenter census or a measure of political belief.'));
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
    const [record,work,studyPlan,platformPolicy,yppFuture,topicCatalog,topicActivity,samplingBudget,adultUseHistory,incomeEvidence,channelIncome,crossPlatformIncome,airStudioBenchmarks,lifecycleHorizons,newcomerIncomeProtocol,earningRoutes,payoutGates,opportunityFramework,contentRestrictions,advertiserHistory,musicRights,productionCosts,productionEffort,viewDefinition,analyticsGuide,platformScale,countryReach,geographicScope,audienceOverlap,beautyGamingPanel,genderCommunityEvidence,childrenSeasonality,viewerPersonMetrics,usDemographicUse,identityResearch,surveyFrameCrosswalk,countryProgramAccess,taxWithholding,brandDisclosure,sponsorCategoryEvidence,publishingCadence,creatorSafety,trafficConcentration,euCreatorConsultation,eligibilityMatrix,channelOnboarding,channelOwnership,applicationLifecycle,creatorGrowth,retentionPostsMemberships,promoteEconomics,contentFormats,publishTimeStudy,seasonalDiscovery,decliningTopicAudit,researchSynthesis,videoSurfaceEconomics,screenViewingStudy,childAgeFormat,teenFormatEvidence,multilingualDistribution,newsAudienceStudy,competitionSample,historicalLinking,videoAttentionCulture,animationFormatCycles,beautyFashionQueries,nflSeasonality,gamingReleaseEvents,creatorCollaboration,commentNormsEvidence,technologySubcultures,financeContent,healthFitness,comparisonSet,academicResearch,reputationPortability,checkoutRefundEvidence,memberCohortProtocol,shortsReferralStudy,audiencePopulationCrosswalk,usNewsDemographics,syntheticMediaPolicy,recommendationEvidence,channelCohortEvidence,firstUploadVlogStudy]=await Promise.all([read(entry.dossier),read(entry.queue),entry.plan?read(entry.plan):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/policies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/ypp-transition-2027.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/taxonomy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/topic-observations.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/public-api-sampling-budget.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-adult-usage-history.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-income-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/small-channel-income.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/cross-platform-income-surveys.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/air-studio-benchmarks-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/lifecycle-horizons.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/newcomer-income-cohort.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/revenue-pathways.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/payment-gates.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/opportunity-framework.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-policy-risk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/advertiser-policy-history.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/music-rights-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/production-costs.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/production-effort-comparison.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/view-definition-break.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/analytics-query-guide.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/platform-scale.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-reach-devices.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/geographic-scope.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/audience-overlap.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/beauty-gaming-overlap-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/gender-community-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/children-media-seasonality.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/viewer-person-metrics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-demographic-use-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/demographic-identity-uncertainty.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/study-frame-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/country-eligibility-payments.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/tax-withholding-mechanics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/brand-disclosure-risk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/sponsor-category-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/publishing-cadence-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-safety-continuity.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/traffic-concentration.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/eu-creator-consultation-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/eligibility-matrix.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-onboarding.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-ownership-continuity.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/application-lifecycle.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-growth.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/retention-posts-memberships.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/promote-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/content-formats.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/geographic-publishing-time.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/seasonal-discovery-comparison.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/declining-content-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/research-synthesis-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-surfaces-economics.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/screen-viewing-uk-2025.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/child-age-and-format-gates.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/teen-video-format-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/multilingual-distribution.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/community-audience-studies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/competition-observations.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/historical-linking-study.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/video-attention-culture-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/animation-format-cycles.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/beauty-fashion-query-series.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/nfl-view-seasonality-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/gaming-release-events.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/creator-collaboration-fandom-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/comment-norms-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/technology-subcultures-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/finance-content-taxonomy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/health-fitness-content.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/comparison-set.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/academic-studies.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/reputation-portability.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/checkout-refund-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/member-cohort-protocol.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/shorts-related-video-funnel.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/audience-population-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/us-news-demographic-crosswalk.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/synthetic-media-rights-policy.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/recommendation-surface-evidence.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/channel-cohort-observations-2026.json'):Promise.resolve(null),entry.id==='youtube'?read('ontology/youtube/first-upload-vlog-study-2026.json'):Promise.resolve(null)]);
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
    const entryStages=renderChannelOnboarding(channelOnboarding,record);
    if(entryStages)outer.append(entryStages);
    const ownership=renderChannelOwnership(channelOwnership,record);
    if(ownership)outer.append(ownership);
    const reputation=renderReputationPortability(reputationPortability,record);
    if(reputation)outer.append(reputation);
    const checkoutAudit=renderCheckoutRefundEvidence(checkoutRefundEvidence,record);
    if(checkoutAudit)outer.append(checkoutAudit);
    const cohortStudy=renderMemberCohortResearch(memberCohortProtocol,record);
    if(cohortStudy)outer.append(cohortStudy);
    const shortsFlow=renderShortsReferralStudy(shortsReferralStudy,record);
    if(shortsFlow)outer.append(shortsFlow);
    const audienceBase=renderAudiencePopulationCrosswalk(audiencePopulationCrosswalk,record);
    if(audienceBase)outer.append(audienceBase);
    const usNews=renderUSNewsDemographics(usNewsDemographics,record);
    if(usNews)outer.append(usNews);
    const syntheticPolicy=renderSyntheticMediaPolicy(syntheticMediaPolicy,record);
    if(syntheticPolicy)outer.append(syntheticPolicy);
    const recs=renderRecommendationEvidence(recommendationEvidence,record);
    if(recs)outer.append(recs);
    const cohorts=renderChannelCohorts(channelCohortEvidence,record);
    if(cohorts)outer.append(cohorts);
    const vlog=renderFirstUploadVlogStudy(firstUploadVlogStudy,record);
    if(vlog)outer.append(vlog);
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
    const catalogue=renderTopicCatalogue(topicCatalog,topicActivity);
    if(catalogue)outer.append(catalogue);
    const sampling=renderPublicSamplingBudget(samplingBudget,record);
    if(sampling)outer.append(sampling);
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

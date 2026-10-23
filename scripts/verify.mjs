import fs from 'node:fs';
import path from 'node:path';
import {toHex,verifyPalette} from './palette.mjs';
const root = path.resolve(process.argv[2] || process.cwd());
const load = name => JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const has = name => fs.existsSync(path.join(root,name));
function ensure(ok,message) { if (!ok) throw Error(message); }
const manifest = load('tarium.json');
ensure(manifest.project === 'mercata', 'Invalid manifest identity');
ensure(has(manifest.ontology.index) && has(manifest.ontology.data), 'Missing ontology path');
ensure(has(manifest.gallery.index) && has(manifest.gallery.data), 'Missing gallery path');
const model = load('ontology/ontology.json'), schema = load('ontology/specimen.schema.json');
ensure(model.schema_version === 1 && model.entities.length >= 20, 'Incomplete public ontology');
ensure(schema.properties.color && schema.properties.evidence && schema.properties.audience_research, 'Incomplete specimen schema');
const audienceSchema = load('ontology/audience.schema.json');
ensure(audienceSchema.properties.communities && audienceSchema.properties.demographics, 'Incomplete audience ontology schema');
const core = load('pipeline/queues.json'), domains = load('pipeline/domains.json'), social = load('pipeline/social.json');
ensure(social.queues.length >= 8,'Missing social-audience research queues');
ensure(core.queues.length >= 12, 'Missing core queues');
ensure(domains.domains.length >= 9, 'Missing specialist domains');
const allTasks = core.queues.flatMap(q => q.tasks.map(t => q.id + '/' + t.id));
ensure(allTasks.length >= 70 && new Set(allTasks).size === allTasks.length,'Missing or duplicate core tasks');
for (const q of core.queues) for (const t of q.tasks) {
  ensure(t.title && t.acceptance && t.weight > 0, 'Incomplete core task ' + t.id);
}
const index = load('gallery/index.json');
ensure(Array.isArray(index.specimens),'Invalid gallery');
ensure(new Set(index.specimens.map(x => x.id)).size === index.specimens.length,'Duplicate specimen ID');
verifyPalette(index.specimens);
for (const entry of index.specimens) {
  const dossier = load(entry.dossier), queue = load(entry.queue);
  ensure(dossier.id === entry.id && queue.specimen_id === entry.id,'Dossier/index mismatch');
  ensure(dossier.schema_version === 1 && dossier.color.hex === entry.color.hex,'Dossier schema/color mismatch');
  ensure(toHex(dossier.color.oklch) === dossier.color.hex,'Bad specimen color');
  const sourceIds = new Set();
  for(const source of dossier.evidence) {
    ensure(source.id && !sourceIds.has(source.id),'Missing or duplicate source ID');
    ensure(typeof source.url==='string' && source.url.startsWith('https://'),'Invalid source URL');
    ensure(typeof source.retrieved_at==='string' && source.publisher,'Incomplete source provenance');
    sourceIds.add(source.id);
  }
  const claimIds=new Set();
  for(const claim of dossier.claims) {
    ensure(claim.id && !claimIds.has(claim.id),'Missing or duplicate claim ID');
    claimIds.add(claim.id);
    ensure(typeof claim.text==='string' && claim.text.length>0,'Empty claim');
    ensure(Array.isArray(claim.source_ids) && claim.source_ids.length>0,'Unsourced claim');
    ensure(claim.source_ids.every(id=>sourceIds.has(id)),'Claim references unknown source');
    ensure(claim.observed_at && typeof claim.limitations==='string','Claim missing observation date or limits');
  }
  if(entry.id==='youtube') {
    const model=load('ontology/youtube/model.json');
    const growth=load('ontology/youtube/creator-growth.json');
    const newsAudience=load('ontology/youtube/community-audience-studies.json');
    const competition=load('ontology/youtube/competition-observations.json');
    const literature=load('ontology/youtube/academic-studies.json');
    ensure(literature.studies.length===4,'Incomplete peer-reviewed research catalog');
    ensure(literature.studies.every(x=>x.sample_n===null || Number.isInteger(x.sample_n)),
      'Invalid published sample size');
    ensure(literature.studies.every(x=>x.earnings_mean===null && x.earnings_median===null &&
      x.zero_earner_fraction===null && x.causal_effect_estimate===null),
      'Unverified academic earnings or causal effect inferred');
    ensure(literature.studies.every(x=>sourceIds.has(x.id)),
      'Academic study missing source record');

    ensure(competition.source.sampled_accounts===71177 && competition.source.sampled_videos===799718,
      'Competition sample provenance mismatch');
    ensure(competition.source.representative_of_all_youtube_creators===false,
      'Commercial sample misrepresented as population census');
    ensure(sourceIds.has(competition.source.id),'Commercial sample source missing');
    ensure(competition.cohort_tier_transitions.every(x=>x.share_moved_up_percent>=0 && x.share_moved_up_percent<=100),
      'Invalid observed cohort transition rate');
    ensure(competition.traffic_source_share_of_sampled_organic_views.every(x=>x.denominator==='sampled organic view events'),
      'Unknown traffic-share denominator');

    ensure(newsAudience.study_topic_id==='news-and-journalism','Unexpected news population');
    ensure(newsAudience.trends.length===7 && newsAudience.trends.at(-1).all_adults_percent===34,
      'Incomplete bounded Pew YouTube news trend');
    ensure(newsAudience.demographic_composition.length>=12,'Incomplete news audience profile');
    ensure(newsAudience.demographic_composition.every(x=>x.source_ids.every(id=>sourceIds.has(id)) &&
      x.measurement_kind==='composition_of_news_consumers' && x.share_percent>=0 && x.share_percent<=100),
      'Invalid news demographic population');

    const formatStudy=load('ontology/youtube/content-formats.json');
    ensure(formatStudy.formats.length===8,'Incomplete YouTube format research');
    ensure(new Set(formatStudy.formats.map(x=>x.id)).size===formatStudy.formats.length,'Duplicate format IDs');
    ensure(formatStudy.formats.every(x=>x.source_ids.length && x.source_ids.every(id=>sourceIds.has(id))),
      'Format research without official sources');
    ensure(formatStudy.formats.every(x=>x.format_median_income===null && x.production_hours===null),
      'Invented creator format earnings or labor hours');

    ensure(growth.stages.length===6,'Incomplete YouTube discovery funnel');
    ensure(growth.metrics.length>=17,'Incomplete YouTube audience metrics');
    const stageIds=new Set(growth.stages.map(x=>x.id));
    const growthMetricIds=new Set(growth.metrics.map(x=>x.id));
    ensure(stageIds.size===growth.stages.length && growthMetricIds.size===growth.metrics.length,
      'Duplicate growth concepts');
    ensure(growth.stages.every(x=>x.source_ids.length>0 && x.source_ids.every(s=>sourceIds.has(s))),
      'Discovery funnel missing primary source');
    ensure(growth.metrics.every(x=>x.source_ids.length>0 && x.source_ids.every(s=>sourceIds.has(s)) && x.observed_value===null),
      'Unsupported audience statistic');

    const analytics=load('ontology/youtube/analytics-query-guide.json');
    const platformScale=load('ontology/youtube/platform-scale.json');
    ensure(platformScale.observations.length===4,'Missing globally scoped scale observations');
    ensure(platformScale.observations.every(x=>Number.isFinite(x.value) && x.value>=0 && x.source_id && sourceIds.has(x.source_id)),
      'Unattributed platform-scale statistic');
    ensure(platformScale.observations.filter(x=>x.unit.includes('percent')).every(x=>x.population.includes('aged 16+')),
      'Platform survey lacks its population denominator');

    ensure(analytics.field_semantics.length>=19 && analytics.supported_dimensions.length>=6,
      'Incomplete YouTube analytics field definitions');
    const fields=new Set(analytics.field_semantics.map(x=>x.id));
    ensure(fields.size===analytics.field_semantics.length,'Duplicate Analytics metric ID');
    ensure(analytics.field_semantics.every(x=>x.source_ids.length && x.source_ids.every(id=>sourceIds.has(id))),
      'YouTube analytics metric lacks official evidence');
    ensure(analytics.template_queries.every(x=>x.source_ids.every(id=>sourceIds.has(id)) && x.metrics.every(id=>fields.has(id))),
      'YouTube analytics template references an unknown source or metric');

    const topic=load('ontology/youtube/taxonomy.json');
    const policy=load('ontology/youtube/policies.json');
    const measures=load('ontology/youtube/measurements.json');
    const observed=load('ontology/youtube/topic-observations.json');
    const history=load('ontology/youtube/measurement-history.json');
    const economics=load('ontology/youtube/economic-model.json');
    const routes=load('ontology/youtube/revenue-pathways.json');
    const eligibility=load('ontology/youtube/eligibility-matrix.json');
    const channelOnboarding=load('ontology/youtube/channel-onboarding.json');
    ensure(channelOnboarding.objects.length===6 && channelOnboarding.stages.length===6 &&
      channelOnboarding.feature_gates.length===4 && channelOnboarding.entry_pathway.length===5,
      'Incomplete YouTube onboarding and feature-access model');
    ensure(channelOnboarding.stages.every((x,i)=>x.sequence===i+1 &&
      x.source_ids.length && x.source_ids.every(id=>sourceIds.has(id)) &&
      x.expected_time_days===null && x.cost_if_supported===null),
      'Unattributed account setup stage or fabricated access time/cost');
    ensure(channelOnboarding.objects.every(x=>x.source_ids.length &&
      x.source_ids.every(id=>sourceIds.has(id))),'Onboarding concept missing evidence');
    ensure(channelOnboarding.feature_gates.every(x=>x.source_ids.length &&
      x.source_ids.every(id=>sourceIds.has(id))),'Onboarding feature gate missing sources');
    ensure(channelOnboarding.entry_pathway.every(x=>x.source_ids.length &&
      x.source_ids.every(id=>sourceIds.has(id)) && x.operator_work_hours===null),
      'Unsupported creator setup labor cost');
    ensure(channelOnboarding.feature_gates.some(x=>x.id==='advanced' &&
      x.requires.includes('sufficient_channel_history_OR_optional_id_or_video_verification')),
      'Advanced verification wrongly made a mandatory ID upload');
    ensure(channelOnboarding.accounting.zero_cost_guarantee===false &&
      channelOnboarding.accounting.setup_hours_median===null &&
      channelOnboarding.accounting.time_to_first_payment_distribution===null,
      'Invented zero-cost entry or predictable payment timeline');
    const lifecycle=load('ontology/youtube/application-lifecycle.json');
    ensure(lifecycle.steps.length===9 && lifecycle.estimated_total_time_to_first_payment===null,
      'Invalid YouTube application lifecycle');
    ensure(lifecycle.steps.every(x=>x.source_ids.every(id=>sourceIds.has(id))),
      'Unattributed application milestone');

    const eligibilityIds=new Set(eligibility.records.map(x=>x.pathway_id));
    ensure(eligibility.records.length===routes.pathways.length && eligibilityIds.size===routes.pathways.length,
      'Every earning route must have one eligibility checklist');
    ensure(eligibility.records.every(x=>routes.pathways.some(r=>r.id===x.pathway_id) &&
      x.gates.length>0 && x.source_ids.every(id=>sourceIds.has(id)) &&
      x.eligibility_confirmed_for_any_specific_person===false),
      'Invalid or unsourced earning eligibility');

    const productionCosts=load('ontology/youtube/production-costs.json');
    ensure(productionCosts.cash_categories.length===10 &&
      productionCosts.labor_categories.length===10 &&
      productionCosts.design_experiments.length===3,
      'Incomplete creator cash and labor cost protocol');
    const costCashIds=new Set(productionCosts.cash_categories.map(x=>x.id));
    const costHourIds=new Set(productionCosts.labor_categories.map(x=>x.id));
    ensure(costCashIds.size===10 && costHourIds.size===10,
      'Duplicate cost or work-time category');
    ensure(productionCosts.cash_categories.every(x=>x.amount===null &&
      x.source_ids.every(id=>sourceIds.has(id))) &&
      productionCosts.labor_categories.every(x=>x.value===null),
      'Unattributed production claim or invented costs and hours');
    ensure(productionCosts.design_experiments.every(x=>
      x.status==='not_measured' && x.median_cash_cost===null &&
      x.median_hours===null && x.source_ids.every(id=>sourceIds.has(id))),
      'Unsupported format cost comparison');
    ensure(productionCosts.model.creator_cash_outlays===null &&
      productionCosts.model.creator_labor_hours===null &&
      productionCosts.model.cash_profit_per_hour===null &&
      productionCosts.model.economic_profit_after_labor_valuation===null,
      'Unobserved typical cost or income must stay unknown');

    ensure(productionCosts.adjacent_creator_surveys.length===1,
      'Missing bounded adjacent creator production evidence');
    for(const study of productionCosts.adjacent_creator_surveys){
      ensure(study.respondents_total===558 && study.post_launch_respondents===null &&
        study.sample_frame_representative===false &&
        study.google_or_youtube_channels_only===false &&
        study.inference_to_typical_youtube_creator_cost==='prohibited',
        'Selected podcaster sample incorrectly used as YouTube cost census');
      ensure(sourceIds.has(study.source_id),'Unregistered podcast labor study');
      for(const observation of [study.reported_human_work,study.reported_operating_cash]){
        ensure(observation.bins.length>=5 && observation.denominator_n===null &&
          observation.bins.reduce((n,x)=>n+x.percent,0)===100,
          'Incomplete podcaster survey histogram or invented subgroup size');
      }
      ensure(study.reported_human_work.median_hours===null &&
        study.reported_operating_cash.median_monthly_cost===null,
        'Invented precision for binned podcast time/cost figures');
    }
    const musicRights=load('ontology/youtube/music-rights-economics.json');
    ensure(musicRights.options.length===5 && musicRights.claim_outcomes.length===4,
      'Incomplete music-rights economics model');
    ensure(musicRights.historical_events.some(x=>x.id==='creator_music_paid_licenses_sunset' &&
      x.date==='2026-08-10'),'Missing 2026 paid music-license transition');
    ensure(musicRights.options.some(x=>x.id==='creator_music_paid_license_legacy' &&
      x.availability==='legacy_only_no_new_paid_licenses'),'Obsolete Creator Music purchase availability');
    ensure(musicRights.options.every(x=>x.source_ids.length>0 &&
      x.source_ids.every(id=>sourceIds.has(id)) && x.typical_cost===null && x.typical_net_revenue_effect===null),
      'Music-rights route without provenance or invented average cost');
    ensure(musicRights.claim_outcomes.every(x=>x.source_ids.length &&
      x.source_ids.every(id=>sourceIds.has(id)) && x.measured_loss===null),
      'Unsupported Content ID earnings loss');
    ensure(musicRights.enforcement_types.length===2 &&
      musicRights.enforcement_types.every(x=>x.source_ids.length &&
        x.source_ids.every(id=>sourceIds.has(id)) && x.creator_loss_estimate===null),
      'Unsupported copyright claim or strike economics');
    ensure(musicRights.enforcement_types.some(x=>x.id==='content_id_claim' &&
      x.copyright_strike_automatic===false), 'Content ID claims mislabeled as strikes');
    ensure(musicRights.monetization_interactions.length===2 &&
      musicRights.monetization_interactions.every(x=>x.source_ids.length &&
        x.source_ids.every(id=>sourceIds.has(id)) && x.creator_earnings_impact===null),
      'Unattributed music product restrictions or fabricated losses');
    ensure(musicRights.accounting_fields.length>=6 &&
      musicRights.typical_cash_cost===null && musicRights.typical_work_hours===null &&
      musicRights.typical_profit_effect===null, 'Invented typical creator cost or work hours');

    const opportunity=load('ontology/youtube/opportunity-framework.json');
    const restrictions=load('ontology/youtube/content-policy-risk.json');
    ensure(restrictions.classifications.length>=4 && restrictions.policy_dimensions.length>=8,
      'Incomplete policy restrictions');
    ensure(restrictions.policy_dimensions.every(x=>x.source_ids.length && x.source_ids.every(id=>sourceIds.has(id))),
      'Content restriction missing official source');
    ensure(restrictions.classifications.every(x=>x.source_ids.length && x.source_ids.every(id=>sourceIds.has(id))),
      'Audience classification lacks provenance');

    ensure(opportunity.criteria.length===10,'Incomplete niche-opportunity criteria');
    const topicSet=new Set(topic.topics.map(x=>x.id));
    ensure(opportunity.topic_assessments.length===topic.topics.length,'Incomplete opportunity topics');
    for(const candidate of opportunity.topic_assessments){
      ensure(topicSet.has(candidate.topic_id),'Opportunity references unknown topic');
      ensure(candidate.decision==='insufficient_evidence' && candidate.net_hourly_return===null,
        'Unsupported profitability estimate or niche ranking');
    }

    const payout=load('ontology/youtube/payment-gates.json');
    const routesIds=new Set(routes.pathways.map(x=>x.id));
    ensure(routes.pathways.length===routes.total_pathways && routesIds.size===routes.pathways.length,'Invalid YouTube revenue-pathway inventory');
    for(const pathway of routes.pathways){
      ensure(pathway.name && pathway.payer && pathway.revenue_basis && pathway.eligibility,'Incomplete revenue pathway');
      ensure(pathway.source_ids.length>0 && pathway.source_ids.every(id=>sourceIds.has(id)),'Unattributed earning feature');
      ensure(pathway.estimated_median_earnings===null,'Unverified pathway income must remain unknown');
    }
    ensure(payout.currencies.every(x=>Number.isFinite(x.minimum_payout) && x.minimum_payout>0 && x.source_ids.every(id=>sourceIds.has(id))),
      'Invalid payout thresholds');
    ensure(payout.payment_cycle?.stages?.length===4,'Incomplete YouTube payout calendar');
    ensure(payout.payment_cycle.stages.every(x=>x.source_ids.length&&x.source_ids.every(id=>sourceIds.has(id))),'Missing payout date sources');
    ensure(payout.payment_cycle.bank_arrival.every(x=>x.source_ids.every(id=>sourceIds.has(id))),'Missing bank arrival sources');
    ensure(payout.program_access.every(x=>x.source_ids.every(id=>sourceIds.has(id))),
      'Missing payout region provenance');

    const patronStudy=load('ontology/youtube/creator-income-evidence.json');
    const channelStudy=load('ontology/youtube/small-channel-income.json');
    const usageHistory=load('ontology/youtube/us-adult-usage-history.json');
    ensure(patronStudy.datasets.every(x=>x.inference_to_general_creator_income==='prohibited'),
      'Patreon sample must not represent all YouTube income');
    ensure(channelStudy.cohort.representative_of_all_youtube_creators===false,
      'Small creator sample incorrectly marked representative');
    ensure(channelStudy.cohort.zero_and_nonmonetized_creators_included===false,
      'Monetization sample includes imaginary non-earners');
    ensure(channelStudy.monthly.values.every(x=>x.q25<=x.median&&x.median<=x.q75),
      'Invalid small channel income quartile ordering');
    ensure(usageHistory.points.every((x,i,a)=>i===0 || a[i-1].year<x.year),
      'Historic adult usage timeline is not chronological');
    ensure(dossier.evidence.some(x=>x.url===channelStudy.source.url),
      'Small channel income study lacks dossier citation');

    const topicIds=new Set(topic.topics.map(t=>t.id));
    const observationIds=new Set();
    for(const x of observed.observations){
      ensure(x.id && !observationIds.has(x.id),'Duplicate topical observation');
      observationIds.add(x.id);
      ensure(topicIds.has(x.topic_id),'Topic observation references unknown topic');
      ensure(Number.isFinite(x.value) && x.value>=0 && x.unit && x.period && x.geography,'Invalid topic measurement');
      ensure(typeof x.source_url==='string' && x.source_url.startsWith('https://'),'Missing topic source');
      ensure(typeof x.limitations==='string' && x.limitations.length>0,'Topic observation lacks caveats');
    }
    ensure(history.events.length>=1,'Missing metric definition history');
    const vars=new Set(economics.symbols.map(x=>x.id));
    const derived=new Set(economics.calculations.map(x=>x.id));
    ensure(economics.calculations.every(x=>x.inputs.every(id=>vars.has(id)||derived.has(id))),
      'Economic model has undefined inputs');
    const conceptIds=new Set(model.concepts.map(x=>x.id));
    ensure(conceptIds.size===model.concepts.length && model.concepts.length>=60,'Incomplete YouTube ontology');
    ensure(model.relations.every(x=>conceptIds.has(x.subject)&&conceptIds.has(x.object)),'Ontology relation has unknown concept');
    ensure(new Set(topic.topics.map(t=>t.id)).size===topic.topics.length,'Duplicate topic ID');
    ensure(topic.topics.every(x=>x.measurement_status!=='researched' || x.audience_estimate!==null),'Invented topic estimate');
    ensure(policy.items.every(x=>x.source_ids.length>0&&x.source_ids.every(id=>sourceIds.has(id))),'Unattributed policy');
    ensure(measures.metrics.every(x=>x.source_ids.length>0&&x.source_ids.every(id=>sourceIds.has(id))),'Unattributed metric');
    for(const m of dossier.audience_research?.demographics||[]) {
      ensure(m.measurement_kind==='within_group_ever_use_rate' || m.measurement_kind==='audience_composition_share',
        'Ambiguous demographic percentage denominator');
    }
  }

  const taskIds = new Set();
  const profiles = dossier.research_profiles || [];
  ensure(JSON.stringify(profiles) === JSON.stringify(entry.research_profiles || []),'Research profile/index mismatch');
  const socialEnabled = profiles.includes('social_audience');
  const expectedByQueue = new Map([...core.queues, ...domains.domains.map(d => ({id:'special-'+d.id,tasks:d.tasks})).filter(d => d.id === 'special-'+dossier.domain), ...(socialEnabled ? social.queues : [])].map(q => [q.id,q.tasks.map(t => q.id+'/'+t.id)]));
  ensure(queue.queues.length === core.queues.length + 1 + (socialEnabled ? social.queues.length : 0),'Incomplete specimen queue');
  const expectedQueues = [...core.queues.map(q => q.id),'special-' + dossier.domain,
    ...(socialEnabled ? social.queues.map(q => q.id) : [])];
  ensure(expectedQueues.every(id => queue.queues.some(q => q.id === id)),'Missing named queues');
  if(socialEnabled) {
    const audience = dossier.audience_research;
    ensure(audience?.profile === 'social_audience','Missing social-audience dossier structure');
    for(const key of ['populations','demographics','communities','overlaps','formats','insights'])
      ensure(Array.isArray(audience[key]),'Missing audience research collection '+key);
    const sources = new Set(dossier.evidence.map(source => source.id));
    const sourced = (measure,label,value) => {
      ensure(typeof measure.id === 'string' && measure.id.length > 0,'Missing measurement ID: '+label);
      ensure(Array.isArray(measure.source_ids),'Missing source array: '+label);
      if(value !== null && value !== undefined) {
        ensure(Number.isFinite(value),'Invalid numeric observation: '+label);
        ensure(measure.source_ids.length > 0,'Unsourced measurement: '+label);
        ensure(typeof measure.period === 'string' && measure.period.length > 0,'Missing period: '+label);
        ensure(typeof measure.method === 'string' && measure.method.length > 0,'Missing method: '+label);
        ensure(typeof measure.limitations === 'string','Missing limitations: '+label);
      }
      for(const id of measure.source_ids)
        ensure(sources.has(id),'Unregistered source '+id+' for '+label);
    };
    for(const x of audience.populations)sourced(x,'population',x.value);
    for(const x of audience.formats)sourced(x,'format',x.value);
    for(const x of audience.demographics)sourced(x,'demographic',x.share_percent);
    const communityIds = new Set();
    for(const community of audience.communities) {
      ensure(community.id && community.label && community.definition,'Incomplete community');
      ensure(!communityIds.has(community.id),'Duplicate community');
      communityIds.add(community.id);
      for(const estimate of community.estimates)sourced(estimate,'community '+community.id,estimate.value);
    }
    for(const overlap of audience.overlaps) {
      ensure(overlap.community_ids?.length >= 2 && overlap.community_ids.every(id => communityIds.has(id)),
        'Community overlap references missing community');
      sourced(overlap,'overlap',overlap.value);
    }
    for(const insight of audience.insights) {
      ensure(typeof insight.statement === 'string' && insight.statement.length > 0,'Empty audience insight');
      ensure(insight.source_ids?.length > 0,'Unsourced audience insight');
      for(const id of insight.source_ids)ensure(sources.has(id),'Unregistered insight source '+id);
    }
  }
  if(entry.plan) {
    ensure(queue.plan === entry.plan, 'Study-plan link mismatch');
    const plan=load(entry.plan);
    ensure(plan.schema_version===1 && plan.kind==='research_plan' && plan.specimen_id===entry.id,
      'Invalid study plan');
    const baseCount=queue.queues.reduce((n,g)=>n+g.tasks.length,0);
    ensure(plan.baseline.base_task_count===baseCount,'Wrong baseline task count');
    ensure(plan.baseline.base_queue_count===queue.queues.length,'Wrong baseline queue count');
    ensure(plan.detail_task_count===plan.detail_tasks.length,'Wrong detailed task count');
    ensure(plan.total_tracked_tasks===baseCount+plan.detail_tasks.length,'Wrong total task count');
    const knownQueues=new Set(queue.queues.map(g=>g.id));
    const ids=new Set();
    for(const item of plan.detail_tasks){
      ensure(typeof item.id==='string' && !ids.has(item.id),'Duplicate or missing plan task ID');
      ids.add(item.id);
      ensure(knownQueues.has(item.queue_id),'Unknown plan queue: '+item.queue_id);
      ensure(item.title && item.objective && item.acceptance,'Incomplete plan task: '+item.id);
      ensure(Number.isInteger(item.percent) && item.percent>=0 && item.percent<=100,'Invalid plan progress');
      ensure(item.percent<100 || (item.status==='complete' && item.evidence.length>0),
        'Unverified plan completion: '+item.id);
    }
    ensure(plan.workstreams.length===queue.queues.length,'Missing study workstreams');
    for(const work of plan.workstreams) {
      ensure(knownQueues.has(work.id),'Unknown plan workstream');
      ensure(work.detail_tasks.length===plan.detail_tasks.filter(t=>t.queue_id===work.id).length,
        'Study-plan workstream count mismatch: '+work.id);
    }
    const phaseIds=new Set(plan.phases.map(p=>p.id));
    ensure(plan.detail_tasks.every(t=>phaseIds.has(t.phase)),'Study task lacks a valid phase');
    const avg=plan.detail_tasks.length?
      Math.round((plan.detail_tasks.reduce((n,t)=>n+t.percent,0)+queue.queues.reduce((n,q)=>n+q.tasks.reduce((a,t)=>a+t.progress,0),0))/plan.total_tracked_tasks):0;
    ensure(plan.progress_percent===avg,'Study-plan percentage mismatch');
  }
  for(const group of queue.queues) {
  const expectedTasks = expectedByQueue.get(group.id);
  ensure(expectedTasks && group.tasks.length === expectedTasks.length,'Task coverage mismatch in queue '+group.id);
  ensure(expectedTasks.every(id => group.tasks.some(t => t.id === id)),'Missing task in queue '+group.id);
  for(const task of group.tasks) {
    ensure(!taskIds.has(task.id),'Duplicate task ID');
    taskIds.add(task.id);
    ensure(Number.isInteger(task.progress) && task.progress >= 0 && task.progress <= 100,'Bad progress');
    ensure(task.progress < 100 || (task.status === 'complete' && task.evidence.length > 0),'Unverified completion: ' + task.id);
  }
  }
}
const ledger=load('roadmap/progress.json');
for(const milestone of ledger.milestones) {
  const tasks = milestone.phases.flatMap(phase => phase.features.flatMap(feature => feature.tasks));
  ensure(tasks.length > 0,'Missing milestone tasks: ' + milestone.id);
  const avg = Math.round(tasks.reduce((n,t)=>n+t.percent,0)/tasks.length);
  ensure(avg === milestone.percent,'Milestone percent mismatch: ' + milestone.id);
  for(const task of tasks) {
    ensure(task.percent < 100 || (task.evidence.length > 0 && task.evidence.every(has)), 'Unverified ledger item: ' + task.id);
  }
}
for(const file of ['index.html','site/app.js','site/styles.css','assets/swatch.svg']) ensure(has(file),'Missing website asset '+file);
const web = fs.readFileSync(path.join(root,'index.html'),'utf8');
ensure(web.includes('id="theme"') && web.includes('value="system"'),'No system-first theme control');
console.log('PASS: ontology, schema, queues (' + allTasks.length + ' core), catalog (' +
 index.specimens.length + ' specimens), unique OKLab colors, progress evidence, website assets');

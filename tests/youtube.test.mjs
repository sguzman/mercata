import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YouTube evidence and claim references',async()=>{
  const record=await load('specimens/youtube.json');
  const sources=new Set(record.evidence.map(x=>x.id));
  assert.equal(sources.size,record.evidence.length);
  for(const claim of record.claims)assert(claim.source_ids.length&&claim.source_ids.every(id=>sources.has(id)));
  for(const value of [...record.audience_research.populations,...record.audience_research.demographics]){
    assert(value.source_ids.length&&value.source_ids.every(id=>sources.has(id)));
  }
});
test('YouTube demographics have explicit percentage type',async()=>{
  const record=await load('specimens/youtube.json');
  for(const group of record.audience_research.demographics){
    assert(['within_group_ever_use_rate','audience_composition_share'].includes(group.measurement_kind));
    assert(group.share_percent>=0&&group.share_percent<=100);
  }
});
test('Unmeasured topics are not represented as counted audiences',async()=>{
  const taxonomy=await load('ontology/youtube/taxonomy.json');
  assert(taxonomy.topics.every(x=>x.audience_estimate===null));
});

test('YouTube economic expressions use declared symbols or earlier computed results',async()=>{
  const model=await load('ontology/youtube/economic-model.json');
  const declared=new Set(model.symbols.map(x=>x.id));
  assert.equal(declared.size,model.symbols.length);
  assert(declared.has('watch_ad_only_rpm')&&declared.has('shorts_ad_only_rpm'));
  for(const calculation of model.calculations) {
    assert(calculation.inputs.every(id=>declared.has(id)));
    const referenced=[...calculation.expression.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)].map(x=>x[0]);
    assert(referenced.every(id=>declared.has(id)),calculation.id+' references an unknown symbol');
    declared.add(calculation.id);
  }
});

test('YouTube topical observations use known topics and explicit units',async()=>{
  const [data,taxonomy]=await Promise.all([
    load('ontology/youtube/topic-observations.json'),load('ontology/youtube/taxonomy.json')
  ]);
  const topics=new Set(taxonomy.topics.map(x=>x.id));
  const observed=new Set();
  assert(data.observations.length>0);
  for(const item of data.observations) {
    assert(!observed.has(item.id));
    observed.add(item.id);
    assert(topics.has(item.topic_id),item.topic_id);
    assert(Number.isFinite(item.value)&&item.value>=0);
    assert(item.unit&&item.period&&item.geography&&item.population&&item.limitations);
    assert(item.source_url.startsWith('https://'));
  }
});

test('YouTube aggregate demographics distinguish subgroup prevalence and audience composition',async()=>{
  const record=await load('specimens/youtube.json');
  const all=record.audience_research.demographics;
  assert(all.some(x=>x.measurement_kind==='within_group_ever_use_rate'));
  assert(all.some(x=>x.measurement_kind==='audience_composition_share'));
  for(const entry of all) {
    assert(entry.source_ids.length&&entry.period&&entry.method&&entry.population&&entry.limitations);
  }
});

test('YouTube task percentage matches its original and detailed queues',async()=>{
  const [queue,plan]=await Promise.all([load('queues/youtube.json'),load('plans/youtube.json')]);
  const original=queue.queues.flatMap(x=>x.tasks);
  const count=original.length+plan.detail_tasks.length;
  assert.equal(count,399);
  assert.equal(count,plan.total_tracked_tasks);
  const total=original.reduce((n,t)=>n+t.progress,0)+plan.detail_tasks.reduce((n,t)=>n+t.percent,0);
  assert.equal(plan.progress_percent,Math.round(total/count));
  assert(original.every(t=>t.progress<100 || (t.status==='complete'&&t.evidence.length>0)));
  assert(plan.detail_tasks.every(t=>t.percent<100 || (t.status==='complete'&&t.evidence.length>0)));
});

test('Creator-income sample cannot be mistaken for typical YouTube payments',async()=>{
  const [study,dossier]=await Promise.all([
    load('ontology/youtube/creator-income-evidence.json'),load('specimens/youtube.json')
  ]);
  assert.equal(study.datasets.length,1);
  assert.equal(study.datasets[0].revenue_channel,'patreon_support');
  assert.equal(study.datasets[0].inference_to_general_creator_income,'prohibited');
  const d=study.datasets[0];
  const stats=d.summary_statistics;
  assert(stats.q25<=stats.median&&stats.median<=stats.q75);
  assert(stats.mean>stats.median);
  assert(d.threshold&&d.sampling&&d.limitations.length>=3);
  assert(dossier.evidence.some(x=>x.url===d.url));
});

test('U.S. adult-use series has explicit survey-mode breaks',async()=>{
  const series=await load('ontology/youtube/us-adult-usage-history.json');
  assert.equal(series.points.length,7);
  assert(series.comparability_notes.some(note=>note.includes('survey mode')));
  assert.equal(series.points.at(-1).percent,84);
});

test('Monetized small-channel data keeps sample boundaries and valid quartiles',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/small-channel-income.json'),load('specimens/youtube.json')
  ]);
  assert.equal(data.cohort.channels,297);
  assert.equal(data.cohort.representative_of_all_youtube_creators,false);
  assert.equal(data.cohort.zero_and_nonmonetized_creators_included,false);
  assert.equal(data.monthly.values.length,6);
  for(const row of data.monthly.values){
    assert(row.q25<=row.median&&row.median<=row.q75);
    assert(row.median_views>=0);
    assert(row.revenue_per_1000_views>=0);
  }
  assert.equal(data.monthly.values[1].median,88);
  assert.equal(data.monthly.values[5].median,32);
  assert(data.by_niche.values.some(x=>x.channels<15));
  assert(dossier.evidence.some(s=>s.url===data.source.url));
});

test('Monetization pathways separate platform payments from independent sales',async()=>{
  const [routes,payout,dossier]=await Promise.all([
    load('ontology/youtube/revenue-pathways.json'),
    load('ontology/youtube/payment-gates.json'),
    load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(routes.pathways.length,16);
  assert.equal(new Set(routes.pathways.map(x=>x.id)).size,16);
  assert(routes.pathways.some(x=>x.kind==='native_virtual_items'));
  assert(routes.pathways.some(x=>x.kind==='external_products'));
  for(const p of routes.pathways){
    assert(p.source_ids.length && p.source_ids.every(id=>sources.has(id)));
    assert.equal(p.estimated_median_earnings,null);
    assert.equal(p.upfront_fee,null);
  }
  assert.equal(payout.currencies.find(x=>x.currency==='MXN').minimum_payout,1200);
  assert.equal(payout.currencies.find(x=>x.currency==='USD').minimum_payout,100);
  assert(payout.program_access[0].source_ids.every(id=>sources.has(id)));
});

test('YouTube economic glossary covers payout and commerce distinctions',async()=>{
  const graph=await load('ontology/youtube/model.json');
  const ids=new Set(graph.concepts.map(x=>x.id));
  assert(ids.has('reporting_currency')&&ids.has('payment_address_country')&&ids.has('rubies'));
  assert(ids.has('shopping_affiliate_products')&&ids.has('sponsorship_contract'));
  assert.equal(ids.size,graph.concepts.length);
  assert(graph.relations.every(r=>ids.has(r.subject)&&ids.has(r.object)));
});

test('Topic view evidence records its metric-definition revision',async()=>{
  const data=await load('ontology/youtube/topic-observations.json');
  const taxonomy=await load('ontology/youtube/taxonomy.json');
  assert(data.observations.length>=17);
  assert(taxonomy.topics.some(t=>t.id==='desk-setups'));
  assert(data.observations.every(x=>x.metric_definition_revision && x.source_url.startsWith('https://')));
  const pre=data.observations.filter(x=>x.metric==='video_views');
  assert(pre.every(x=>x.metric_definition_revision==='before_2026_08_24'));
});

test('Every YouTube topic has an unranked and unbiased opportunity record',async()=>{
  const [topics,opportunity]=await Promise.all([
    load('ontology/youtube/taxonomy.json'),load('ontology/youtube/opportunity-framework.json')
  ]);
  assert.equal(opportunity.criteria.length,10);
  assert.equal(opportunity.topic_assessments.length,topics.topics.length);
  const known=new Set(topics.topics.map(x=>x.id));
  assert(opportunity.topic_assessments.every(x=>known.has(x.topic_id)&&x.decision==='insufficient_evidence'));
  assert(opportunity.topic_assessments.every(x=>x.net_hourly_return===null&&x.creator_supply===null));
  assert(opportunity.criteria.every(x=>x.normalized_score===null&&x.weight===null));
});

test('YouTube earnings payment calendar distinguishes finalization from issue',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/payment-gates.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(s=>s.id));
  const stages=data.payment_cycle.stages;
  assert.deepEqual(stages.map(x=>x.id),['accrue','finalize','payout-eligibility','issue']);
  assert.equal(stages[1].day_min,7);
  assert.equal(stages[1].day_max,12);
  assert.equal(stages[3].day_min,21);
  assert.equal(stages[3].day_max,26);
  assert(stages.every(x=>x.source_ids.every(id=>sources.has(id))));
  assert(data.payment_cycle.bank_arrival.every(x=>x.estimated_max_business_days>0));
});

test('Content policy keeps general animation distinct from child-directed content',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/content-policy-risk.json'),load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(data.classifications.find(x=>x.id==='general-audience-animation').is_made_for_kids,false);
  assert.equal(data.classifications.find(x=>x.id==='mixed-audience-child-directed').is_made_for_kids,true);
  assert(data.policy_dimensions.some(x=>x.id==='originality_and_repetition'));
  assert(data.policy_dimensions.every(x=>x.source_ids.length && x.source_ids.every(id=>known.has(id))));
});

test('YouTube metrics distinguish advertiser money from creator receipts',async()=>{
  const [guide,record]=await Promise.all([
    load('ontology/youtube/analytics-query-guide.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(record.evidence.map(x=>x.id));
  const fields=new Map(guide.field_semantics.map(x=>[x.id,x]));
  assert.equal(fields.size,guide.field_semantics.length);
  assert.equal(fields.get('estimatedRevenue').denominator_type,'net_creator');
  assert.equal(fields.get('estimatedAdRevenue').denominator_type,'net_creator_ads');
  assert.equal(fields.get('grossRevenue').denominator_type,'gross_advertiser');
  assert.equal(fields.get('cpm').unit,'currency_per_1000_ad_impressions');
  assert.equal(fields.get('playbackBasedCpm').unit,'currency_per_1000_playbacks');
  assert(fields.size>=19);
  for(const entry of guide.field_semantics)assert(entry.source_ids.every(id=>sources.has(id)));
});

test('Platform scale preserves distinct event and human-survey denominators',async()=>{
  const [scale,record]=await Promise.all([
    load('ontology/youtube/platform-scale.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(record.evidence.map(x=>x.id));
  assert.equal(scale.observations.length,4);
  for(const x of scale.observations)assert(sources.has(x.source_id)&&x.period&&x.population&&x.limitations);
  assert(scale.observations.some(x=>x.unit==='uploaded_videos_per_day'));
  assert(scale.observations.some(x=>x.unit==='shorts_views_per_day'));
  assert(scale.observations.filter(x=>x.unit.includes('percent')).length===2);
  assert(scale.observations.every(x=>!x.id.includes('global_mau')));
});

test('Every YouTube earning route has sourced, nonpersonal eligibility gates',async()=>{
  const [routes,gates,record]=await Promise.all([
    load('ontology/youtube/revenue-pathways.json'),
    load('ontology/youtube/eligibility-matrix.json'),
    load('specimens/youtube.json')
  ]);
  const allowed=new Set(record.evidence.map(x=>x.id));
  const routeIds=new Set(routes.pathways.map(x=>x.id));
  assert.equal(gates.records.length,routeIds.size);
  for(const x of gates.records){
    assert(routeIds.has(x.pathway_id));
    assert(x.source_ids.length&&x.source_ids.every(id=>allowed.has(id)));
    assert(x.gates.length>=2);
    assert.equal(x.eligibility_confirmed_for_any_specific_person,false);
  }
  assert.equal(gates.records.find(x=>x.pathway_id==='live-gifts').minimum_creator_age,18);
  assert(gates.records.find(x=>x.pathway_id==='shopping-affiliate').music_channel_status.includes('ineligible'));
  assert.equal(gates.records.find(x=>x.pathway_id==='direct-sponsorship').tier,'not_ypp_dependent');
});

test('YouTube entry, review and settlement are distinct milestones',async()=>{
  const [lifecycle,record]=await Promise.all([
    load('ontology/youtube/application-lifecycle.json'),load('specimens/youtube.json')
  ]);
  assert.equal(lifecycle.steps.length,9);
  const steps=new Map(lifecycle.steps.map(x=>[x.id,x]));
  assert.equal(steps.get('first-rejection-appeal').window_days,21);
  assert.equal(steps.get('first-rejection-reapply').earliest_reapply_after_days,30);
  assert.equal(steps.get('repeat-rejection-reapply').earliest_reapply_after_days,90);
  assert.equal(lifecycle.estimated_total_time_to_first_payment,null);
  const sources=new Set(record.evidence.map(x=>x.id));
  assert(lifecycle.steps.every(x=>x.source_ids.every(id=>sources.has(id))));
});

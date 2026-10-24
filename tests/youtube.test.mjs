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
test('Country viewing figures keep UK devices and international survey denominators separate',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/country-reach-devices.json'),load('specimens/youtube.json')
  ]);
  const sourceIds=new Set(dossier.evidence.map(x=>x.id));
  const observations=new Map(data.observations.map(x=>[x.id,x]));
  assert.equal(data.observations.length,10);
  assert.equal(data.valid_series.length,3);
  assert(data.sources.every(x=>sourceIds.has(x.source_id)));
  assert(data.observations.every(x=>sourceIds.has(x.source_id) &&
    Number.isFinite(x.value) && x.population && x.device_scope && x.limits));
  for(const series of data.valid_series){
    const items=series.members.map(id=>observations.get(id));
    assert(items.every(Boolean));
    assert.equal(items[0].unit,items[1].unit);
    assert.equal(items[0].scope,items[1].scope);
    assert.equal(items[0].device_scope,items[1].device_scope);
  }
  assert.equal(observations.get('uk-television-youtube-2022').value,9);
  assert.equal(observations.get('uk-television-youtube-2025').value,19);
  assert.equal(observations.get('uk-home-all-device-youtube-2025').value,41);
  assert.equal(observations.get('dnr48-news-2026').value,34);
  assert(Object.values(data.unknowns).every(x=>x===null));
  assert(data.excluded_comparisons.some(x=>x.includes('51 Online Nation minutes')));
});

test('Multilingual YouTube product rules distinguish language, country and selected watch time',async()=>{
  const [model,dossier]=await Promise.all([
    load('ontology/youtube/multilingual-distribution.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(model.facets.length,8);
  assert.equal(model.product_surfaces.length,6);
  assert.equal(model.automatic_dubbing_example_pairs.length,8);
  assert(model.facets.every(x=>x.observed_distribution===null));
  assert(model.product_surfaces.every(x=>x.source_ids.length &&
    x.source_ids.every(id=>sources.has(id)) &&
    x.default_cost===null && x.default_creation_hours===null));
  const manual=model.product_surfaces.find(x=>x.id==='manual_audio');
  const automatic=model.product_surfaces.find(x=>x.id==='automatic_audio');
  assert(manual.content_formats.includes('shorts'));
  assert(automatic.gates.includes('supported_target_pair'));
  const observation=model.official_selected_observations.find(x=>x.id==='mla-watch-time-non-primary-language-2025');
  assert.equal(observation.comparator,'greater_than');
  assert.equal(observation.value,25);
  assert.equal(observation.causal_lift,null);
  assert.equal(observation.denominator_n,null);
  assert.equal(observation.representative_of_all_youtube_creators,false);
  const snapshot=model.official_selected_observations.find(x=>x.id==='auto-dubbing-language-total-may-2026');
  assert.equal(snapshot.value,27);
  assert.equal(snapshot.source_period,'2026-05-15');
  assert(model.automatic_dubbing_example_pairs.every(x=>x.source_ids.every(id=>sources.has(id))));
  assert.equal(model.measurement_design.median_income_lift,null);
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

test('Production cost model keeps 10 cash and 10 labor measures separate',async()=>{
  const [costs,dossier]=await Promise.all([
    load('ontology/youtube/production-costs.json'),load('specimens/youtube.json')
  ]);
  const ids=new Set(dossier.evidence.map(s=>s.id));
  assert.equal(costs.cash_categories.length,10);
  assert.equal(costs.labor_categories.length,10);
  assert.equal(costs.design_experiments.length,3);
  assert.equal(new Set(costs.cash_categories.map(x=>x.id)).size,10);
  assert.equal(new Set(costs.labor_categories.map(x=>x.id)).size,10);
  assert(costs.cash_categories.every(x=>x.amount===null&&x.source_ids.every(id=>ids.has(id))));
  assert(costs.labor_categories.every(x=>x.value===null));
  assert(costs.design_experiments.every(x=>x.status==='not_measured' &&
    x.median_cash_cost===null && x.median_hours===null));
  const adjacent=costs.adjacent_creator_surveys[0];
  assert.equal(costs.adjacent_creator_surveys.length,1);
  assert.equal(adjacent.respondents_total,558);
  assert.equal(adjacent.post_launch_respondents,null);
  assert.equal(adjacent.sample_frame_representative,false);
  assert.equal(adjacent.google_or_youtube_channels_only,false);
  assert.equal(adjacent.inference_to_typical_youtube_creator_cost,'prohibited');
  assert(ids.has(adjacent.source_id));
  for(const hist of [adjacent.reported_human_work,adjacent.reported_operating_cash]){
    assert.equal(hist.bins.reduce((n,x)=>n+x.percent,0),100);
    assert.equal(hist.denominator_n,null);
  }
  assert.equal(adjacent.audio_video_comparisons.length,2);
  assert(adjacent.audio_video_comparisons.every(x=>x.video_subsample_n===null &&
    x.audio_subsample_n===null && x.causal_effect===null));
  assert(adjacent.audio_video_comparisons.some(x=>x.id==='monthly_cost_at_least_50_usd' &&
    x.video_percent_approx===50 && x.audio_only_percent_approx===28));
  assert.equal(adjacent.reported_human_work.median_hours,null);
  assert.equal(adjacent.reported_operating_cash.median_monthly_cost,null);
  assert.equal(costs.model.cash_profit_per_hour,null);
  assert.equal(costs.model.economic_profit_after_labor_valuation,null);
  assert(costs.model.accounting_rules.some(x=>x.includes('already reflected')));
  assert(costs.model.accounting_rules.some(x=>x.includes('again')));
});

test('YouTube onboarding keeps channel creation, feature access and monetization separate',async()=>{
  const [access,dossier]=await Promise.all([
    load('ontology/youtube/channel-onboarding.json'),load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(access.stages.length,6);
  assert.deepEqual(access.stages.map(x=>x.sequence),[1,2,3,4,5,6]);
  assert.equal(access.feature_gates.length,4);
  assert.equal(access.entry_pathway.length,5);
  assert(access.stages.every(x=>x.source_ids.length &&
    x.source_ids.every(id=>known.has(id)) && x.expected_time_days===null));
  assert(access.objects.every(x=>x.source_ids.every(id=>known.has(id))));
  assert(access.feature_gates.every(x=>x.source_ids.every(id=>known.has(id))));
  assert(access.entry_pathway.every(x=>x.operator_work_hours===null &&
    x.source_ids.every(id=>known.has(id))));
  assert(access.stages.some(x=>x.id==='standard' && x.requires_phone_verification===false));
  assert(access.stages.some(x=>x.id==='intermediate' && x.requires_phone_verification===true));
  assert(access.feature_gates.find(x=>x.id==='advanced')
    .requires.includes('sufficient_channel_history_OR_optional_id_or_video_verification'));
  assert.equal(access.accounting.zero_cost_guarantee,false);
  assert.equal(access.accounting.setup_hours_median,null);
  assert.equal(access.accounting.time_to_first_payment_distribution,null);
});

test('YouTube ontology connects audio licensing, Content ID holds and copyright strikes',async()=>{
  const model=await load('ontology/youtube/model.json');
  const known=new Set(model.concepts.map(x=>x.id));
  const pairs=new Set(model.relations.map(x=>x.subject+'|'+x.predicate+'|'+x.object));
  assert.equal(model.concepts.length,146);
  assert.equal(model.relations.length,118);
  assert(model.relations.every(x=>known.has(x.subject)&&known.has(x.object)));
  assert(pairs.has('registered_account|may_manage|channel'));
  assert(pairs.has('syndicated_income_report|reuses|income_survey_source_family'));
  assert(pairs.has('tv_set_youtube_viewing|is_subset_of|in_home_youtube_viewing'));
  assert(pairs.has('secondary_audio_track|can_be|manual_dub'));
  assert(pairs.has('secondary_audio_track|can_be|machine_dub'));
  assert(pairs.has('language_watch_time|is_not|channel_monthly_audience'));
  assert(pairs.has('online_only_youtube_viewing|must_not_be_summed_with|in_home_youtube_viewing'));
  assert(pairs.has('survey_income_threshold_share|does_not_estimate|newcomer_income_estimand'));
  assert(pairs.has('new_channel_zero_earner|is_part_of|newcomer_income_estimand'));
  assert(pairs.has('standard_publishing_access|does_not_grant|monetized_channel'));
  assert(pairs.has('advanced_channel_access|does_not_grant|monetized_channel'));
  assert(pairs.has('copyright_takedown|can_result_in|copyright_strike'));
  assert(pairs.has('copyright_claim|may_cause|content_id_revenue_hold'));
  assert(pairs.has('creator_music_revenue_share|can_generate|music_rights_adjustment'));
  assert(model.concepts.filter(x=>['music_rights_adjustment','audio_rights_search_hours','music_license_upfront_cost'].includes(x.id)).every(x=>x.measured_value===null));
});

test('Creator Music 2026 transition and Content ID risks preserve cost uncertainty',async()=>{
  const [rights,dossier]=await Promise.all([
    load('ontology/youtube/music-rights-economics.json'),load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(rights.options.length,5);
  assert.equal(rights.claim_outcomes.length,4);
  assert(rights.historical_events.some(x=>x.date==='2026-08-10'));
  const legacy=rights.options.find(x=>x.id==='creator_music_paid_license_legacy');
  assert.equal(legacy.availability,'legacy_only_no_new_paid_licenses');
  assert.equal(legacy.new_paid_license_purchase_end,'2026-08-10');
  assert(rights.options.every(x=>x.source_ids.length &&
    x.source_ids.every(id=>known.has(id)) && x.typical_cost===null &&
    x.typical_net_revenue_effect===null));
  assert(rights.claim_outcomes.every(x=>x.source_ids.every(id=>known.has(id)) &&
    x.measured_loss===null));
  assert(rights.accounting_fields.some(x=>x.id==='revenue_held_during_dispute'));
  assert(rights.accounting_fields.some(x=>x.id==='creator_music_rights_adjustment'));
  assert.equal(rights.enforcement_types.length,2);
  assert(rights.enforcement_types.some(x=>x.id==='content_id_claim' &&
    x.copyright_strike_automatic===false));
  assert(rights.enforcement_types.some(x=>x.id==='copyright_removal_request' &&
    x.copyright_strike_automatic===true));
  assert(rights.enforcement_types.every(x=>x.creator_loss_estimate===null &&
    x.source_ids.every(id=>known.has(id))));
  assert(rights.monetization_interactions.some(x=>x.id==='creator_music_revenue_share_shopping'));
  assert(rights.monetization_interactions.every(x=>x.creator_earnings_impact===null &&
    x.source_ids.every(id=>known.has(id))));
  assert.equal(rights.typical_work_hours,null);
  assert.equal(rights.typical_profit_effect,null);
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

test('Mixed-platform creator income surveys remain separate and do not supply YouTube estimates',async()=>{
  const [report,dossier]=await Promise.all([
    load('ontology/youtube/cross-platform-income-surveys.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(s=>s.id));
  assert.equal(report.studies.length,2);
  assert.equal(report.independent_dataset_families,2);
  assert.equal(new Set(report.studies.map(s=>s.source_family_id)).size,2);
  assert(report.studies.every(s=>s.representative_of_youtube===false &&
    s.representative_of_all_creators===false &&
    s.youtube_subgroup_n===null &&
    s.inference_to_youtube_median==='prohibited' &&
    s.source_ids.every(id=>sources.has(id))));
  const neoreach=report.studies.find(s=>s.id==='neoreach-2025');
  assert.equal(neoreach.survey_respondents_exact,null);
  assert.equal(neoreach.survey_respondents_lower_bound_exclusive,3000);
  assert.equal(neoreach.source_ids.length,2);
  assert.equal(neoreach.measurements.find(x=>x.id==='below_15000_year').value,50.71);
  const spotlight=report.studies.find(s=>s.id==='spotlight-2025');
  assert.equal(spotlight.survey_respondents_exact,427);
  assert.equal(spotlight.measurements.find(x=>x.id==='income_under_500').value,null);
  assert.equal(spotlight.measurements.find(x=>x.id==='income_100000_plus_count').value,37);
  assert(Object.values(report.youtube_target_estimates).every(value=>value===null));
  assert(report.comparability.unsupported.includes('pooling_percentages'));
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

test('World Cup event unique viewers are a bounded audience segment, not a fan census',async()=>{
  const [record,activity,topics,opportunity]=await Promise.all([
    load('specimens/youtube.json'),load('ontology/youtube/topic-observations.json'),
    load('ontology/youtube/taxonomy.json'),load('ontology/youtube/opportunity-framework.json')
  ]);
  const event=record.audience_research.communities.find(x=>x.id==='fifa-world-cup-2026-event-audience');
  assert(event);
  assert.equal(event.estimates.length,2);
  assert.equal(event.estimates[0].value,1700000000);
  assert.equal(event.estimates[1].value,550000000);
  assert(event.estimates[1].limitations.includes('must not add'));
  const obs=new Map(activity.observations.map(x=>[x.id,x]));
  assert.equal(obs.get('fifa-world-cup-2026-unique-viewers').unit,'unique_viewers');
  assert.equal(obs.get('fifa-world-cup-2026-tv-unique-viewers').parent_observation_id,'fifa-world-cup-2026-unique-viewers');
  assert.equal(obs.get('nfl-2025-global-views').topic_id,'sports-general');
  assert(topics.topics.some(x=>x.id==='football-soccer'));
  assert.equal(opportunity.topic_assessments.length,topics.topics.length);
  assert(opportunity.topic_assessments.every(x=>x.decision==='insufficient_evidence'));
});

test('YouTube discovery metrics keep viewer identities and event counts separate',async()=>{
  const [dossier,growth]=await Promise.all([
    load('specimens/youtube.json'),load('ontology/youtube/creator-growth.json')
  ]);
  const sourceIds=new Set(dossier.evidence.map(x=>x.id));
  assert.deepEqual(growth.stages.map(x=>x.id),['exposure','selection','engagement','return','community','economic']);
  assert(growth.metrics.some(x=>x.id==='impressions_ctr'));
  assert(growth.metrics.some(x=>x.id==='monthly_unique_audience'));
  assert(growth.invalid_equivalences.includes('public_views_are_ypp_qualifying_views'));
  assert(growth.metrics.every(x=>x.observed_value===null));
  assert(growth.stages.every(x=>x.source_ids.every(id=>sourceIds.has(id))));
});

test('Eight YouTube formats preserve different access and link rules',async()=>{
  const [formats,dossier]=await Promise.all([
    load('ontology/youtube/content-formats.json'),load('specimens/youtube.json')
  ]);
  const sourceIds=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(formats.formats.length,8);
  const shorts=formats.formats.find(x=>x.id==='shorts');
  assert(shorts.links.some(x=>x.includes('not clickable')));
  const mobile=formats.formats.find(x=>x.id==='mobile-live');
  assert(mobile.entry_gate.includes('50-subscriber'));
  const podcast=formats.formats.find(x=>x.id==='podcast');
  assert(podcast.format_rule.includes('playlist'));
  assert(formats.formats.every(x=>x.source_ids.every(id=>sourceIds.has(id))));
  assert(formats.formats.every(x=>x.format_median_income===null && x.production_hours===null));
});

test('YouTube graph distinguishes format and audience event semantics',async()=>{
  const graph=await load('ontology/youtube/model.json');
  const ids=new Set(graph.concepts.map(x=>x.id));
  assert(ids.has('thumbnail_impression') && ids.has('shorts_stay_rate'));
  assert(ids.has('mobile_live_eligibility') && ids.has('shorts_related_video_link'));
  assert(ids.has('regular_viewers') && ids.has('new_viewers'));
  assert.equal(ids.size,graph.concepts.length);
  assert(graph.relations.every(r=>ids.has(r.subject)&&ids.has(r.object)));
});

test('Pew news survey rates use separate populations and survey years',async()=>{
  const [source,dossier]=await Promise.all([
    load('ontology/youtube/community-audience-studies.json'),
    load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(source.trends.length,7);
  assert.equal(source.trends.at(-1).all_adults_percent,34);
  assert.equal(source.trends.at(-1).youtube_users_percent,41);
  assert(source.demographic_composition.every(x=>x.measurement_kind==='composition_of_news_consumers'));
  assert(source.demographic_composition.every(x=>x.population.includes('regularly get news')));
  assert(source.demographic_composition.every(x=>x.source_ids.every(id=>known.has(id))));
});

test('Commercial competition sample does not invent new-channel success probability',async()=>{
  const sample=await load('ontology/youtube/competition-observations.json');
  assert.equal(sample.source.sampled_accounts,71177);
  assert.equal(sample.source.sampled_videos,799718);
  assert.equal(sample.source.representative_of_all_youtube_creators,false);
  assert(sample.cohort_tier_transitions.some(x=>x.tier==='small' && x.share_moved_up_percent===16.01));
  assert(sample.traffic_source_share_of_sampled_organic_views.some(x=>x.id==='shorts_feed' && x.percent===61));
  assert(sample.traffic_source_share_of_sampled_organic_views.every(x=>x.denominator==='sampled organic view events'));
  assert(sample.cross_format_association.type.includes('not_causal'));
});

test('Peer-reviewed study collection preserves narrow populations and unknown earnings',async()=>{
  const papers=await load('ontology/youtube/academic-studies.json');
  assert.equal(papers.studies.length,4);
  assert(papers.studies.some(x=>x.numeric.gini_coefficient===0.89));
  assert(papers.studies.some(x=>x.sample_n===50 && x.topic_ids.includes('beauty')));
  assert(papers.studies.some(x=>x.sample_n===1923 && x.topic_ids.includes('virtual-creators')));
  assert(papers.studies.every(x=>x.earnings_mean===null && x.earnings_median===null));
  assert(papers.studies.every(x=>x.causal_effect_estimate===null));
});

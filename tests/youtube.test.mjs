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
test('Geographic research branches retain source denominators and unknown creator income',async()=>{
  const [scope,dossier]=await Promise.all([
    load('ontology/youtube/geographic-scope.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(scope.kind,'geographic_scope_protocol');
  assert.deepEqual(scope.branches.map(x=>x.id),['global','us','uk','mx','reuters_48']);
  assert.equal(scope.axes.length,5);
  assert(scope.branches.every(x=>x.source_ids.length&&x.source_ids.every(id=>sources.has(id))));
  assert(scope.branches.every(x=>x.unique_people_count===null&&x.newcomer_profit_distribution===null));
  assert(Object.values(scope.unresolved).every(x=>x===null));
  assert(scope.country_feature_fields.includes('payout_currency'));
  assert(scope.country_feature_fields.includes('feature_specific_availability'));
});

test('Country YPP sign-up and payout-method evidence does not assign personal currencies',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/country-eligibility-payments.json'),load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(data.kind,'country_specific_creator_access_and_payment_reference');
  assert.deepEqual(data.country_records.map(x=>x.country_code),['MX','US','GB']);
  for(const record of data.country_records){
    assert.equal(record.program_access.standard_ypp_listed,true);
    assert.equal(record.program_access.expanded_ypp_listed,true);
    assert.equal(record.reporting_currency,null);
    assert.equal(record.account_payment_threshold,null);
    assert.equal(record.individual_channel_approved,null);
    assert(Object.values(record.feature_specific_access).every(v=>v===null));
    assert([...record.program_access.source_ids,...record.payment_address_methods.source_ids].every(id=>known.has(id)));
  }
  const country=code=>data.country_records.find(x=>x.country_code===code);
  assert.deepEqual(
    ['MX','US','GB'].map(code=>country(code).payment_address_methods.wire),
    [true,false,true]);
  assert.deepEqual(
    ['MX','US','GB'].map(code=>country(code).payment_address_methods.hyperwallet),
    [false,true,false]);
  assert.deepEqual(Object.fromEntries(data.reporting_currency_threshold_examples.map(x=>[x.currency,x.minimum_payment])),
    {MXN:1200,USD:100,GBP:60});
  assert(data.reporting_currency_threshold_examples.every(x=>x.source_ids.every(id=>known.has(id))));
  assert(Object.values(data.unmeasured).every(v=>v===null));
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

test('August 2026 public first-frame view definitions never imply engaged or paid views',async()=>{
  const [bridge,history,measurements,dossier]=await Promise.all([
    load('ontology/youtube/view-definition-break.json'),
    load('ontology/youtube/measurement-history.json'),
    load('ontology/youtube/measurements.json'),
    load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(bridge.effective_date,'2026-08-24');
  assert.equal(bridge.measurement_levels.length,8);
  assert.equal(bridge.format_applicability.length,4);
  assert.deepEqual(bridge.measurement_levels.filter(x=>x.public_video_count_equivalent).map(x=>x.id),['public_view']);
  assert(bridge.measurement_levels.every(x=>x.source_ids.length &&
    x.source_ids.every(id=>sources.has(id))));
  assert.equal(bridge.api_revision.public_api_exposes_engaged_equivalent,false);
  assert(bridge.format_applicability.every(x=>x.view_count_first_frame_from==='2026-08-24' &&
    x.conversion_from_public_to_engaged===null));
  assert.equal(bridge.comparison_protocol.conversion_factor_public_to_engaged,null);
  assert.equal(bridge.comparison_protocol.causal_effect_on_creator_earnings,null);
  assert.equal(bridge.comparison_protocol.program_qualification_change_due_to_definition,null);
  assert(history.events.some(x=>x.id==='video-count-playback-start-2026' &&
    x.semantic_bridge==='ontology/youtube/view-definition-break.json'));
  const metricIds=new Set(measurements.metrics.map(x=>x.id));
  assert(['public_video_playback_start','ypp_qualified_short_view',
    'ypp_qualified_watch_hours','thumbnail_impression_event'].every(id=>metricIds.has(id)));
});

test('YouTube demographics have explicit percentage type',async()=>{
  const record=await load('specimens/youtube.json');
  for(const group of record.audience_research.demographics){
    assert(['within_group_ever_use_rate','audience_composition_share'].includes(group.measurement_kind));
    assert(group.share_percent>=0&&group.share_percent<=100);
  }
});
test('2026 API sampling budget keeps search calls separate and rejects population shortcuts',async()=>{
  const [budget,dossier]=await Promise.all([
    load('ontology/youtube/public-api-sampling-budget.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(budget.documentation_updated_at,'2026-10-15');
  assert(budget.sources.every(x=>sources.has(x.source_id)));
  const q=budget.default_quota_snapshot;
  assert.equal(q.search_list.max_calls_per_day_default,100);
  assert.equal(q.search_list.cost_units_per_call,1);
  assert.equal(q.other_endpoints.max_units_per_day_default,10000);
  assert.equal(q.videos_list.max_ids_per_call,50);
  assert.equal(q.search_total_results.capped_reported_value,1000000);
  assert.equal(q.search_total_results.is_approximate,true);
  const x=budget.synthetic_budget_example;
  assert.equal(x.strata,x.topic_count*x.regions*x.languages*x.formats);
  assert.equal(x.estimated_search_calls,x.strata*x.pages_per_stratum);
  assert.equal(x.max_search_result_slots,x.estimated_search_calls*q.search_list.max_items_per_page);
  assert.equal(x.claimed_observed_videos,null);
  assert.equal(x.claimed_unique_viewers,null);
  assert(Object.values(budget.authorization).every(value=>value===false));
  assert(Object.values(budget.target_estimands).every(value=>value===null));
});

test('YouTube legal operator and transaction taxonomy separate suppliers payers and rights',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/operator-market-roles.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'legal_operator_and_market_transaction_roles');
 assert.equal(model.legal_service_provider.entity,'Google LLC');
 assert.equal(model.legal_service_provider.all_country_contract_coverage_verified,false);
 assert(model.legal_service_provider.source_ids.every(id=>ids.has(id)));
 assert.equal(model.participants.length,9);
 assert.equal(model.flows.length,6);
 assert.equal(model.product_classes.length,6);
 assert(model.participants.every(x=>x.source_ids.length&&x.source_ids.every(id=>ids.has(id))));
 assert(model.flows.every(x=>x.source_ids.length&&x.source_ids.every(id=>ids.has(id))));
 assert(model.product_classes.every(x=>x.source_ids.length&&x.source_ids.every(id=>ids.has(id))));
 assert.equal(model.flows.find(x=>x.id==='free_public_view').financial_buyer,null);
 assert.equal(model.flows.find(x=>x.id==='advertising').financial_buyer,'advertiser');
 assert.equal(model.flows.find(x=>x.id==='sponsor_to_creator').financial_buyer,'sponsor_or_brand');
 assert.equal(model.participants.find(x=>x.id==='channel_delegate').is_legal_owner_by_default,false);
 assert(Object.values(model.unmeasured).every(value=>value===null));
});

test('Gaming and beauty report keeps selected vendor overlap separate from a national union',async()=>{
 const [panel,dossier]=await Promise.all([load('ontology/youtube/beauty-gaming-overlap-2025.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(panel.study.panel_count,74276);
 assert.equal(panel.study.representative_of_all_us_youtube_users,false);
 assert.equal(panel.findings.find(x=>x.id==='reported_category_overlap').value,5);
 assert.equal(panel.findings.find(x=>x.id==='reported_category_overlap').denominator_n,null);
 assert.equal(panel.findings.find(x=>x.id==='reported_category_overlap').raw_joint_unique_people,null);
 assert(panel.source_ids.every(id=>ids.has(id)));
 assert.equal(panel.source_independence.independent_research_datasets,1);
 assert(Object.values(panel.unmeasured).every(x=>x===null));
 assert.equal(panel.comparability.exact_union_unique_people,null);
});
test('Child viewing yearly averages never become an inferred seasonal holiday lift',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/children-media-seasonality.json'),load('specimens/youtube.json')]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'children_media_seasonality_method_and_annual_baseline');
 assert(model.sources.every(id=>sources.has(id)));
 assert.deepEqual(model.yearly_context.map(x=>x.minutes),[427,407,447]);
 assert.deepEqual(model.yearly_context.map(x=>x.year_on_year_percent),[8,7,9]);
 assert(model.yearly_context.every(x=>x.seasonal_contrast_measured===false&&sources.has(x.source_id)));
 assert.equal(model.seasonal_questions.length,5);
 assert(model.seasonal_questions.every(x=>x.measured_relative_change===null&&x.source_ids.every(id=>sources.has(id))));
 assert.equal(model.device_context.television_share_percent,53);
 assert.equal(model.device_context.not_seasonality,true);
 const adjacent=model.adjacent_seasonal_context;
 assert.equal(adjacent.source_id,'nielsen-us-children-june-tv-2025');
 assert.deepEqual(adjacent.observations.map(x=>x.relative_change_percent),[27,25]);
 assert.deepEqual(adjacent.observations.map(x=>x.id),['all_tv','streaming_tv']);
 assert.equal(adjacent.unit,'month_on_month_relative_percent_change_in_tv_impressions');
 assert.equal(adjacent.age_range,'6–17');
 assert.equal(adjacent.youtube_platform_specific,false);
 assert.equal(adjacent.measured_child_directed_content_only,false);
 assert.equal(adjacent.unique_viewer_count,null);
 assert.equal(adjacent.child_youtube_monthly_change_percent,null);
 assert.equal(adjacent.causal_school_break_effect_percent,null);
 assert.equal(adjacent.sample_n,null);
 const backToSchool=model.adjacent_school_return_context;
 assert.equal(backToSchool.source_id,'nielsen-us-august-2025-school-return-tv');
 assert.equal(backToSchool.age_range,'6–17');
 assert.equal(backToSchool.august_broadcast_weeks,5);
 assert.deepEqual(backToSchool.comparisons.map(item=>item.value),[-9,-8,-21,-22]);
 assert.deepEqual(backToSchool.comparisons.map(item=>item.unit),Array(4).fill('relative_percent_change'));
 assert(backToSchool.comparisons.every(item=>item.age==='6–17' && item.metric.includes('television')));
 assert.equal(backToSchool.platform_specific_youtube,false);
 assert.equal(backToSchool.annual_seasonal_effect,null);
 assert.equal(backToSchool.causal_school_return_effect,null);
 assert.equal(backToSchool.sample_n,null);
 assert(sources.has(backToSchool.source_id));
 assert(dossier.claims.some(claim=>claim.id==='us-child-tv-august-2025-viewing-reversal-not-youtube' && claim.source_ids.includes(backToSchool.source_id)));
 assert(sources.has(adjacent.source_id));
 assert(dossier.claims.some(claim=>claim.id==='us-child-tv-monthly-context-not-youtube-2025' &&
  claim.source_ids.includes(adjacent.source_id)));
 assert(model.inferential_gates.filter(x=>x.passed).length===1);
 assert(Object.values(model.unknowns).every(v=>v===null));
});

test('Gender-associated research preserves reporting privacy and missing denominators',async()=>{
 const [m,dossier]=await Promise.all([load('ontology/youtube/gender-community-evidence.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(m.kind,'gender_descriptive_community_evidence');
 assert(m.sources.every(id=>ids.has(id)));
 assert.deepEqual(m.measurement_surfaces[0].categories,['female','male','user_specified']);
 assert.equal(m.measurement_surfaces[0].includes_signed_out_gender_breakdown,false);
 assert.equal(m.measurement_surfaces[1].missing_means_zero,false);
 assert.equal(m.bounded_vendor_study.overlap_numerator,null);
 assert.equal(m.bounded_vendor_study.overlap_denominator,null);
 assert(m.comparison_gates.every(g=>g.passed===false));
 assert(Object.values(m.unknowns).every(v=>v===null));
});

test("33 topic categories and 36 bounded observations retain separate children and learning scopes",async()=>{
  const [topic,activity,opportunity]=await Promise.all([
    load('ontology/youtube/taxonomy.json'),
    load('ontology/youtube/topic-observations.json'),
    load('ontology/youtube/opportunity-framework.json')
  ]);
  assert.equal(topic.topics.length,33);
  assert.equal(activity.observations.length,36);
  assert.equal(opportunity.topic_assessments.length,33);
  const childMusic=topic.topics.find(x=>x.id==='children-music');
  assert(childMusic);
  assert.equal(childMusic.audience_estimate,null);
  assert.equal(childMusic.creator_estimate,null);
  const baby=activity.observations.find(x=>x.id==='baby-shark-single-video-jun-2025');
  assert.equal(baby.topic_id,'children-music');
  assert.equal(baby.metric,'single_video_lifetime_views');
  assert.equal(baby.value,16000000000);
  assert.equal(baby.metric_definition_revision,'before_2026_08_24');
  assert(activity.observations.filter(x=>x.topic_id==='crafts').length>=4);
  assert(activity.observations.filter(x=>x.topic_id==='cooking').length>=2);
  const essay=activity.observations.find(x=>x.id==='video-essays-2024');
  const craft=activity.observations.find(x=>x.id==='upcycle-title-uploads-2025');
  const artemis=activity.observations.find(x=>x.id==='artemis-ii-primary-stream-april-2026');
  assert.equal(essay.topic_id,'video-essays');
  assert.equal(essay.value,200000000);
  assert.equal(essay.metric_definition_revision,'before_2026_08_24');
  assert.equal(craft.metric,'video_uploads');
  assert.equal(craft.value,80000);
  assert.equal(craft.metric_definition_revision,'not_applicable_upload_count');
  assert.equal(artemis.topic_id,'science');
  assert.equal(artemis.value,79000000);
  assert(artemis.population.includes('primary Artemis II'));

  assert(opportunity.topic_assessments.every(x=>x.decision==='insufficient_evidence' &&
    x.net_hourly_return===null));
});

test('Unmeasured topics are not represented as counted audiences',async()=>{
  const taxonomy=await load('ontology/youtube/taxonomy.json');
  assert(taxonomy.topics.every(x=>x.audience_estimate===null));
});

test('Finance and business content taxonomy distinguishes promotion from educational subject matter',async()=>{
 const [data,dossier,taxonomy]=await Promise.all([
  load('ontology/youtube/finance-content-taxonomy.json'),
  load('specimens/youtube.json'),
  load('ontology/youtube/taxonomy.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(data.kind,'finance_and_business_content_risk_taxonomy');
 assert.equal(data.topic_id,'finance');
 assert(taxonomy.topics.some(x=>x.id===data.topic_id));
 assert.equal(data.content_families.length,8);
 assert.equal(new Set(data.content_families.map(x=>x.id)).size,8);
 assert(data.platform_source_ids.every(id=>ids.has(id)));
 assert(data.jurisdictional_source_ids.every(id=>ids.has(id)));
 assert(data.content_families.every(x=>x.topic_population===null&&x.creator_count===null&&x.niche_revenue===null));
 assert(Object.values(data.unknowns).every(x=>x===null));
 assert.equal(data.regional_status.mexico,null);
 assert.equal(data.regional_status.united_kingdom,null);
 assert(data.content_families.some(x=>x.id==='budgeting_education'&&x.commercial_posture==='no_sale_assumed'));
 assert(data.content_families.some(x=>x.id==='stock_tip_or_return_promotion'));
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
  assert.equal(costs.adjacent_creator_surveys.length,2);
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
  const timf=costs.adjacent_creator_surveys.find(s=>s.id==='timf-creators-2026');
  assert.equal(timf.respondents_total,1000);
  assert.equal(timf.country,'United States');
  assert.equal(timf.fieldwork_period,'2026-01');
  assert.equal(timf.google_or_youtube_channels_only,false);
  assert.equal(timf.sample_frame_representative,false);
  assert.equal(timf.reported_human_work.denominator_n,null);
  assert.equal(timf.reported_human_work.exhaustive_categories,false);
  assert.deepEqual(timf.reported_human_work.selected_bins.map(b=>b.percent),[37,8.4]);
  assert.equal(timf.reported_human_work.median_hours,null);
  assert.equal(timf.reported_operating_cash,null);
  assert.equal(timf.youtube_subgroup_n,null);
  assert.equal(timf.creator_profit_median,null);
  assert.equal(timf.inference_to_typical_youtube_creator_cost,'prohibited');
  assert(ids.has(timf.source_id));
  assert.equal(costs.model.cash_profit_per_hour,null);
  assert.equal(costs.model.economic_profit_after_labor_valuation,null);
  assert(costs.model.accounting_rules.some(x=>x.includes('already reflected')));
  assert(costs.model.accounting_rules.some(x=>x.includes('again')));
});

test('Advertiser guideline revisions preserve month, contextual scope and unknown income effects',async()=>{
  const [history,dossier]=await Promise.all([
    load('ontology/youtube/advertiser-policy-history.json'),
    load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(s=>s.id));
  assert.equal(history.revisions.length,6);
  assert.equal(history.status_levels.length,5);
  assert(history.revisions.every(x=>x.announced_month.match(/^2026-(0[1-9]|1[0-2])$/) &&
    x.effective_day===null && x.source_ids.every(id=>known.has(id))));
  assert(history.revisions.some(x=>x.id==='2026-october-public-interest'));
  assert(history.revisions.some(x=>x.id==='2026-september-game-violence'));
  assert(history.revisions.some(x=>x.id==='2026-september-drugs-fiction'));
  assert.equal(history.review_mechanism.human_review_available,true);
  assert(Object.values(history.uncertainty).every(v=>v===null));
});

test('Announced 2027 YPP entry changes distinguish existing Shorts members and Premium pools',async()=>{
  const [future,dossier,policy]=await Promise.all([
    load('ontology/youtube/ypp-transition-2027.json'),
    load('specimens/youtube.json'),
    load('ontology/youtube/policies.json')
  ]);
  const src=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(future.terms_effective_date,'2027-02-01');
  assert.equal(future.transition_status,'announced_future_terms_not_effective_as_of_research_date');
  assert.equal(future.policy_windows.length,5);
  assert(future.policy_windows.every(x=>x.source_ids.every(id=>src.has(id))));
  const get=id=>future.policy_windows.find(x=>x.id===id);
  assert.equal(policy.items.find(x=>x.id==='ads-watch').conditions.find(x=>x.metric==='qualifying_watch_hours').minimum,4000);
  assert.equal(get('current_2026_new_ad_applicant').minimum_subscribers,1000);
  assert.equal(get('future_2027_new_ad_applicant').watch_hours.qualified_public_hours,8000);
  assert.equal(get('future_2027_new_ad_applicant').shorts.qualified_shorts_views,20000000);
  assert.equal(get('future_2027_new_ad_applicant').minimum_subscribers,null);
  assert.equal(get('existing_ypp_entry_grandfathered').threshold_type,'new_entry_threshold_not_retroactive');
  assert.equal(get('shorts_ongoing_revenue_share_2027').shorts.qualified_shorts_views,10000000);
  const measured=get('shorts_ongoing_revenue_share_2027').monthly_qualification_measurement;
  assert.equal(measured.window_end_day_of_preceding_calendar_month,15);
  assert.equal(measured.lookback_days,90);
  assert.equal(measured.window_timezone,null);
  assert(measured.source_ids.every(id=>src.has(id)));
  assert.equal(future.shorts_revenue_mechanisms.length,2);
  const pooled=future.shorts_revenue_mechanisms.find(x=>x.id==='shorts_feed_creator_pool');
  const direct=future.shorts_revenue_mechanisms.find(x=>x.id==='direct_channel_targeted_shorts_ads_2027');
  assert.equal(pooled.creator_share_percent,45);
  assert.equal(pooled.targeted_channel_count_max,null);
  assert.equal(direct.effective_from,'2027-02-01');
  assert.equal(direct.creator_share_percent,45);
  assert.equal(direct.targeted_channel_count_max,5);
  assert.equal(direct.additional_to_creator_pool,true);
  assert(future.shorts_revenue_mechanisms.every(x=>x.source_ids.every(id=>src.has(id))));
  assert.equal(get('early_access_unchanged').minimum_subscribers,500);
  assert.deepEqual(future.premium_allocations.map(x=>x.share_of_net_subscription_revenue_percent),[30,60]);
  assert(future.premium_allocations.every(x=>x.source_ids.every(id=>src.has(id))));
  assert.equal(future.required_actions[0].deadline_date,'2027-01-31');
  assert(Object.values(future.comparisons.missing_person_level_estimates).every(x=>x===null));
});


test('YouTube ownership operations distinguish delegation from irreversible channel migration',async()=>{
  const [data,dossier]=await Promise.all([
    load('ontology/youtube/channel-ownership-continuity.json'),
    load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(data.operations.length,5);
  assert(data.operations.every(x=>x.source_ids.every(id=>known.has(id))));
  const byId=id=>data.operations.find(x=>x.id===id);
  assert.equal(byId('transfer_brand_primary_owner').minimum_days_as_owner_source,7);
  assert.equal(byId('transfer_brand_primary_owner').new_owner_or_manager_minimum_days,7);
  assert.equal(byId('move_between_brand_accounts').irreversible_risk,true);
  assert.equal(byId('move_between_brand_accounts').guaranteed_preservation_of_assets,false);
  assert.equal(byId('export_own_content').guaranteed_full_channel_export,false);
  assert.equal(byId('termination_appeal').appeals_within_one_year_max,2);
  assert.equal(byId('termination_appeal').successful_appeal_probability,null);
  assert(Object.values(data.business_value_limits).every(x=>x===null||x===false));
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
  assert.equal(model.concepts.length,184);
  assert.equal(model.relations.length,175);
  assert(model.relations.every(x=>known.has(x.subject)&&known.has(x.object)));
  assert(pairs.has('registered_account|may_manage|channel'));
  assert(pairs.has('syndicated_income_report|reuses|income_survey_source_family'));
  assert(pairs.has('tv_set_youtube_viewing|is_subset_of|in_home_youtube_viewing'));
  assert(pairs.has('secondary_audio_track|can_be|manual_dub'));
  assert(pairs.has('public_playback_start|is_not|qualified_short_view'));
  assert(pairs.has('public_search_stratum|consumes|youtube_search_quota_bucket'));
  assert(pairs.has('sampled_channel_id|is_not|subculture_creators'));
  assert(pairs.has('childrens_music_genre|is_not_equivalent_to|child_directed_animation_genre'));
  assert(pairs.has('rolling_shorts_monetization_gate|distinct_from|future_ypp_ad_threshold'));
  assert(pairs.has('existing_ypp_partner_cohort|is_not_subject_to|future_ypp_ad_threshold'));
  assert(pairs.has('premium_lite_pool|differs_from|premium_net_subscription_pool'));
  assert(pairs.has('advertiser_policy_revision|does_not_establish|genre_level_rpm_assumption'));
  assert(pairs.has('advertiser_suitability_decision|is_not_equivalent_to|monetized_channel'));
  assert(pairs.has('studio_collaborator_role|is_not|brand_account_primary_owner'));
  assert(pairs.has('brand_channel_migration|does_not_verify|unverified_channel_saleability'));
  assert(pairs.has('metric_definition_revision|creates|view_count_comparability_break'));
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

test('Historical gaming launch metrics do not become YouTube platform growth or creator profit',async()=>{
 const [study,dossier]=await Promise.all([
  load('ontology/youtube/gaming-release-events.json'),
  load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(study.kind,'game_release_event_viewing_study');
 assert.equal(study.events.length,2);
 assert(study.events.every(e=>e.source_ids.every(id=>ids.has(id))&&e.unique_people===null&&e.creator_income===null));
 const release=study.events.find(x=>x.event_type==='full_game_release');
 assert.equal(release.country_scope,'JP');
 assert.equal(release.reported_window,'first_7_days');
 assert.equal(release.measures[0].value,50000000);
 assert.equal(release.measures[0].comparison,'>');
 const trailer=study.events.find(x=>x.event_type==='trailer_premiere_not_game_release');
 assert.equal(trailer.reported_window,'first_24_hours');
 assert.deepEqual(trailer.measures.map(x=>x.value),[93000000,250000000]);
 assert(trailer.measures.every(x=>x.comparison==='>'));
 assert(trailer.limitations.includes('overlapping'));
 assert(study.events.every(x=>x.before_window_same_metric===null&&
   x.after_window_same_metric===null&&x.comparable_platform_baseline===null));
 assert(Object.values(study.unmeasured).every(x=>x===null));
 assert(study.research_protocol.prohibited_inferences.some(x=>x.includes('not the date of a game release')));
});

test('Fitness and wellness policy study keeps unmeasured audiences and earnings null',async()=>{
 const [study,dossier,taxonomy]=await Promise.all([
  load('ontology/youtube/health-fitness-content.json'),
  load('specimens/youtube.json'),
  load('ontology/youtube/taxonomy.json')
 ]);
 const src=new Set(dossier.evidence.map(x=>x.id));
 const topics=new Set(taxonomy.topics.map(x=>x.id));
 assert.equal(study.kind,'fitness_wellness_health_content_research_scope');
 assert.equal(study.parent_topic_id,'fitness');
 assert(study.related_topic_ids.every(x=>topics.has(x)));
 assert.equal(study.content_categories.length,9);
 assert.equal(new Set(study.content_categories.map(x=>x.id)).size,9);
 assert(study.content_categories.every(x=>x.sources.every(id=>src.has(id))));
 assert(study.content_categories.every(x=>x.unique_audience===null&&x.creator_count===null&&x.revenue_per_view===null));
 assert.deepEqual(study.policy_layers.map(x=>x.id),
  ['medical_misinformation','self_harm_eating_disorders','advertiser_suitability','health_source_discovery']);
 assert(study.policy_layers.every(x=>x.source_ids.every(id=>src.has(id))));
 assert.equal(study.health_features.available_everywhere,false);
 assert.equal(study.health_features.application_requires_eligible_health_profession,true);
 assert.equal(study.health_features.watch_hour_alternative.valid_public_watch_hours,1500);
 assert.equal(study.health_features.shorts_alternative.valid_public_shorts_views,1500000);
 assert.equal(study.health_features.related_shelf_access_not_a_payout_or_monetization_right,true);
 assert(Object.values(study.unmeasured).every(x=>x===null));
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

test('Independent survey population frames are explicitly nonpoolable',async()=>{
 const [cross,dossier]=await Promise.all([
  load('ontology/youtube/study-frame-crosswalk.json'),load('specimens/youtube.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(cross.kind,'noncomparable_public_study_frames');
 assert.deepEqual(cross.frames.map(x=>x.sample_total_n),[5511,496,939,5095,300,5166,null]);
 assert(cross.frames.every(x=>x.source_ids.every(id=>sources.has(id))));
 assert(cross.frames.every(x=>x.per_item_n===null && x.representative_global_users===false));
 assert.equal(cross.frames.filter(x=>x.may_include_minors===true).length,2);
 assert.equal(cross.frames.find(x=>x.id==='air_2026_monetized_studio').observed_channel_months,3595);
 assert.equal(cross.frames.find(x=>x.id==='air_2026_monetized_studio').includes_zero_earning_creators,false);
 assert.equal(cross.blocked_cross_source_operations.length,6);
 assert.equal(cross.frames.find(x=>x.id==='pew_2026_news_atp').quantity,'regular_youtube_news_consumption_within_us_adults_or_youtube_users');
 assert.equal(cross.frames.find(x=>x.id==='pew_2025_news_composition').sample_total_n,null);
 assert(cross.blocked_cross_source_operations.some(x=>x.id==='pew_npors_vs_atp_2026'));
 assert(cross.blocked_cross_source_operations.some(x=>x.id==='pew_news_2025_composition_vs_2026_prevalence'));
 assert(Object.values(cross.unmeasured).every(x=>x===null));
});

test('Self-reported ethnic-group YouTube use cannot be inferred from identities or generalized to religion',async()=>{
 const [study,dossier]=await Promise.all([
   load('ontology/youtube/demographic-identity-uncertainty.json'),
   load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(study.kind,'aggregate_race_ethnicity_and_religion_uncertainty');
 assert(study.source_ids.every(id=>ids.has(id)));
 assert.equal(study.source_overall_n,5511);
 assert.equal(study.source_overall_moe_pp,1.8);
 assert.deepEqual(study.race_ethnicity_groups.map(x=>x.value_percent),[83,85,84,95]);
 assert.equal(study.race_ethnicity_groups[3].english_only_restriction,true);
 assert(study.race_ethnicity_groups.every(x=>x.sample_n===null&&x.sampling_moe_pp===null));
 assert.equal(study.religious_affiliation.youtube_ever_use_rates,null);
 assert.equal(study.religious_affiliation.subgroup_percentages,null);
 assert(Object.values(study.unknowns).every(v=>v===null));
 assert(study.publication_limits.some(x=>x.includes('never infer an individual attribute')));
 assert(study.publication_limits.some(x=>x.includes('English speakers only')));
});

test('Pew 2026 U.S. demographic ever-use rates never become YouTube audience composition',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/us-demographic-use-2026.json'),load('specimens/youtube.json')
 ]);
 assert.equal(model.kind,'us_2026_education_income_community_usage');
 assert.equal(model.source_id,'pew-us-adults-2026');
 assert(dossier.evidence.some(s=>s.id===model.source_id));
 assert.equal(model.survey.total_respondents_n,5511);
 assert.equal(model.survey.reported_overall_moe_pp,1.8);
 assert.equal(model.survey.subgroup_n,null);
 assert.equal(model.survey.subgroup_moe_pp,null);
 assert.deepEqual(model.strata.map(s=>s.id),['household_income','education','residence']);
 assert.deepEqual(model.strata.map(s=>s.categories.map(x=>x.percent)),[[77,84,86,90],[77,87,90],[87,86,78]]);
 assert(model.strata.every(g=>g.categories.every(x=>x.subgroup_n===null&&x.subgroup_moe_pp===null)));
 assert.equal(model.measurement.is_youtube_audience_composition,false);
 assert.equal(model.measurement.is_monthly_active_use,false);
 assert(Object.values(model.unmeasured).every(v=>v===null));
});

test('EU27 creator consultation preserves sponsor and question-specific denominators',async()=>{
 const [data,register]=await Promise.all([
  load('ontology/youtube/eu-creator-consultation-2026.json'),load('specimens/youtube.json')
 ]);
 assert.equal(data.kind,'eu_creator_consultation_and_impact_scope');
 assert(register.evidence.some(x=>x.id===data.source_id));
 assert.equal(data.survey.respondents_lower_bound_exclusive,20000);
 assert.equal(data.survey.respondents_exact,null);
 assert.equal(data.survey.sampling_frame,null);
 assert.equal(data.survey.margin_of_error,null);
 assert.deepEqual(data.reported_responses.map(x=>x.reported_percent),[63,64,60,65,65,83,71]);
 assert(data.reported_responses.every(x=>x.item_n===null&&x.source_ids.includes(data.source_id)));
 assert(data.reported_responses.find(x=>x.id==='professional_creator_studio_access_gap').question_population.includes('Professional-creator'));
 assert(data.separate_platform_and_impact_claims.every(x=>x.not_people_or_revenue));
 assert(Object.values(data.unmeasured).every(x=>x===null));
});

test('Promotion paid billable views, YPP eligibility and owner attribution remain separate',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/promote-economics.json'),load('specimens/youtube.json')]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'paid_promotion_cost_and_attribution_protocol');
 assert.equal(model.metric_register.length,8);
 assert.equal(model.ad_format_billing.length,3);
 assert.deepEqual(model.ad_format_billing.map(x=>x.id),['in_stream','in_feed','shorts']);
 assert(model.ad_format_billing.every(x=>x.source_ids.every(id=>sources.has(id))));
 assert(model.metric_register.every(x=>x.source_ids.every(id=>sources.has(id))));
 assert.equal(model.ypp_eligibility_rules.find(x=>x.metric==='promoted_subscribers').ad_attributed_counts_to_ypp_threshold,false);
 assert.equal(model.ypp_eligibility_rules.find(x=>x.metric==='promoted_watch_hours').ad_attributed_counts_to_ypp_threshold,false);
 assert.equal(model.ypp_eligibility_rules.find(x=>x.metric==='follow_on_views').organic_qualified_activity_can_count,true);
 assert.equal(model.cost_protocol.ad_budget_is_not_observed_actual_spend,true);
 assert.equal(model.cost_protocol.can_calculate_general_typical_cp_subscriber_without_sample,false);
 assert.equal(model.approval_and_delivery.guaranteed_review_max_days,null);
 assert(Object.values(model.unknowns).every(x=>x===null));
});

test('Reported H1 2026 microdrama viewing distinguishes events, watch time and TV growth',async()=>{
 const [data,dossier]=await Promise.all([
  load('ontology/youtube/video-surfaces-economics.json'),load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(s=>s.id));
 const events=data.microdrama_observations;
 assert.equal(events.length,3);
 assert(events.every(x=>ids.has(x.source_id)&&x.unique_people===null&&x.creator_count===null&&x.revenues===null));
 assert.equal(events.find(x=>x.id==='h1_2026_microdrama_views').value,6500000000);
 assert.equal(events.find(x=>x.id==='h1_2026_microdrama_views').metric_definition_revision,'before_2026_08_24');
 assert.equal(events.find(x=>x.id==='h1_2026_microdrama_watchtime_growth').value,50);
 assert.equal(events.find(x=>x.id==='h1_2026_tv_microdrama_view_growth').value,90);
 assert(events.slice(1).every(x=>x.denominator===null&&x.baseline_value===null));
});

test('Posts and membership retention preserve impressions, people and transaction boundaries',async()=>{
 const [data,dossier]=await Promise.all([
  load('ontology/youtube/retention-posts-memberships.json'),load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(data.kind,'posts_viewer_retention_and_membership_measurement');
 assert.deepEqual(data.channel_surfaces.map(x=>x.id),['creator_posts','community_discussions','members_only_posts']);
 assert.equal(data.post_metric_register.length,6);
 assert.deepEqual(data.viewer_segments.map(x=>x.id),['new','casual','regular']);
 assert.equal(data.viewer_segments.find(x=>x.id==='regular').minimum_months,7);
 assert.equal(data.viewer_segments.find(x=>x.id==='casual').maximum_months,5);
 assert.equal(data.membership_register.length,7);
 assert.equal(data.membership_register.find(x=>x.id==='transactions').unit,'payment_events');
 assert.equal(data.membership_register.find(x=>x.id==='total_members').unit,'people_with_current_perk_access');
 assert.equal(data.membership_register.find(x=>x.id==='active_members').unit,'active_subscriptions');
 assert.deepEqual(data.billing.reported_period_length_days,[28,30,31]);
 assert(data.channel_surfaces.every(x=>x.post_to_video_return_rate===null));
 assert(data.source_ids.every(id=>ids.has(id)));
 assert(data.membership_register.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(data.post_metric_register.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(Object.values(data.unknowns).every(x=>x===null));
 const posts=data.platform_scale_claims?.[0];
 assert.equal(posts.id,'daily_posts_engaging_users');
 assert.equal(posts.reported_value,300000000);
 assert.equal(posts.comparison,'>');
 assert.equal(posts.actual_unique_people_deduplication,null);
 assert.equal(posts.post_to_returning_viewer_effect,null);
 assert(ids.has(posts.source_id));
 assert(data.inference_safeguards.some(x=>x.includes('causal')));
});

test('Public channel counts and owner viewers remain different measurement types',async()=>{
 const [metrics,dossier]=await Promise.all([
  load('ontology/youtube/viewer-person-metrics.json'),load('specimens/youtube.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(metrics.kind,'viewer_person_account_and_activity_measurement');
 assert.equal(metrics.measures.length,8);
 assert(metrics.measures.every(x=>x.source_ids.length&&x.source_ids.every(id=>sources.has(id))));
 assert(metrics.access_gates.every(x=>x.source_ids.every(id=>sources.has(id))&&x.global_person_census===false));
 const get=id=>metrics.measures.find(x=>x.id===id);
 assert.equal(get('unique_viewers').max_period_days,90);
 assert.equal(get('unique_viewers').signed_out_included_in_estimate,true);
 assert.equal(get('unique_viewers').public_channel_api,false);
 assert.equal(get('monthly_audience').window,'rolling_28_days');
 assert.equal(get('monthly_audience').max_period_days,28);
 assert.equal(get('public_channel_views').public_channel_api,true);
 assert.equal(get('public_subscribers').unit,'subscriptions');
 assert.equal(get('public_subscribers').signed_out_included_in_estimate,false);
 assert.equal(get('unique_reach').unit,'estimated_people_exposed');
 assert.equal(get('co_viewed_views').unit,'estimated_shared_screen_view_events');
 assert(Object.values(metrics.unmeasured).every(x=>x===null));
});

test('Creator safety and 2026 temporary hijack pause maintain distinct risk scopes',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/creator-safety-continuity.json'),load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'creator_safety_and_account_continuity');
 assert.deepEqual(model.modules.map(x=>x.id),
  ['comment_and_live_moderation','policy_reports','privacy_and_likeness','account_recovery']);
 assert(model.modules.every(x=>x.source_ids.every(id=>ids.has(id))&&x.population_count===null&&x.harassment_incidents===null));
 const event=model.dated_changes.find(x=>x.id==='temporary_feature_pause_2026');
 assert.equal(event.announced_at,'2026-10-21');
 assert.equal(event.review_timing_typical_hours,24);
 assert.equal(event.guaranteed_max_hours,null);
 assert.equal(event.claimed_monetization_status_unchanged,true);
 assert.equal(event.review_outcome_known,false);
 assert(event.source_ids.every(id=>ids.has(id)));
 assert.equal(model.hacking_support_retention_months_reported,9);
 assert.deepEqual(model.recovery_sequence.map(x=>x.order),[1,2,3]);
 assert(model.recovery_sequence.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Brand disclosure study separates YouTube declaration from US consumer law',async()=>{
  const [model,dossier]=await Promise.all([
    load('ontology/youtube/brand-disclosure-risk.json'),load('specimens/youtube.json')
  ]);
  const ids=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(model.kind,'branded_content_disclosure_risk_research');
  assert.deepEqual(model.policy_layers.map(x=>x.id),['youtube_platform','us_ftc','other_jurisdictions']);
  assert.equal(model.relationship_cases.length,5);
  assert.equal(model.surface_guidance.length,4);
  assert(model.policy_layers.every(x=>x.source_ids.every(id=>ids.has(id))));
  assert(model.relationship_cases.every(x=>x.source_ids.every(id=>ids.has(id))));
  assert(model.surface_guidance.every(x=>x.source_ids.every(id=>ids.has(id))));
  assert(model.dated_changes.every(x=>x.source_ids.every(id=>ids.has(id))&&x.account_rollout_completion===null));
  assert.equal(model.dated_changes.find(x=>x.id==='2026_09_brand_labels').announced_at,'2026-09-03');
  assert.equal(model.platform_business_consequences.youtube_kids_app_removal_for_branded_content,true);
  assert.equal(model.platform_business_consequences.video_may_remain_ypp_ad_eligible,true);
  assert(Object.values(model.unmeasured).every(v=>v===null));
  assert(model.policy_layers.find(x=>x.id==='us_ftc').does_not_replace.includes('independent_platform_declaration'));
  assert(model.policy_layers.find(x=>x.id==='youtube_platform').does_not_replace.includes('applicable_local_law'));
});

test('YPP tax-info and payout-withholding model preserves different revenue bases',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/tax-withholding-mechanics.json'),load('specimens/youtube.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'platform_withholding_scope_not_personal_tax_advice');
 assert(model.source_ids.every(id=>sources.has(id)));
 assert.equal(model.tax_info_requirement.needs_tax_information,true);
 assert.equal(model.tax_info_requirement.deadline_not_a_general_tax_filing_date,true);
 assert.equal(model.payer_withholding_cases.length,4);
 const get=id=>model.payer_withholding_cases.find(x=>x.id===id);
 assert.equal(get('non_us_valid_tax_info').base,'earnings_attributed_to_us_viewers');
 assert.equal(get('non_us_valid_tax_info').published_rate_bounds_percent.max,30);
 assert.equal(get('non_us_business_tax_info_missing').published_default_rate_percent,30);
 assert.equal(get('non_us_business_tax_info_missing').base,'earnings_attributed_to_us_viewers');
 assert.equal(get('individual_tax_info_missing').base,'worldwide_youtube_earnings');
 assert.equal(get('individual_tax_info_missing').published_default_rate_percent,24);
 assert.equal(get('us_creator_valid_tax_info').published_default_rate_percent,0);
 assert(model.payer_withholding_cases.every(x=>x.actual_rate_percent===null&&
    x.source_ids.every(id=>sources.has(id))));
 assert.deepEqual(model.form_categories.map(x=>x.id),['w9','w8ben','w8bene']);
 assert(Object.values(model.unknowns).every(x=>x===null));
 assert(model.disallowed_model_shortcuts.some(x=>x.includes('twice')));
});

test('Selected political and climate comment studies retain distinct populations and privacy limits',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/comment-norms-evidence.json'),load('specimens/youtube.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'bounded_comment_norms_and_participation_studies');
 assert.deepEqual(model.studies.map(x=>x.id),['political_anglophone_2025','selected_climate_2026']);
 assert(model.source_ids.every(id=>sources.has(id)));
 assert(model.studies.every(x=>sources.has(x.source_id)));
 const politics=model.studies[0];
 const pattern=politics.observations[0];
 assert.equal(pattern.observed_comment_share_percent_approx,50);
 assert.equal(pattern.observed_commenter_share_percent_strictly_greater_than,2);
 assert.equal(pattern.commenter_share_exact,null);
 assert.equal(politics.n_unique_commenters,null);
 const climate=model.studies[1];
 assert.equal(climate.n_videos,129);
 assert.equal(climate.dataset_observation_period,'March 2021 query-based candidate retrieval');
 assert(climate.observations.every(x=>x.absolute_rate===null));
 assert.equal(climate.observations[1].causal_effect,null);
 assert(model.prohibit.some(x=>x.includes('targeted political persuasion')));
 assert(model.prohibit.some(x=>x.includes('usernames')||x.includes('comment strings')));
 assert(Object.values(model.unknowns).every(x=>x===null));
});

test('UK child video-app genres remain separate from YouTube-specific U.S. teen and in-home measures',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/teen-video-format-evidence.json'),load('specimens/youtube.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'child_teen_video_content_gender_age_evidence');
 assert.deepEqual(model.source_ids,['ofcom-children-parents-media-2026','pew-us-teens-2025','roymorgan-young-australians-youtube-2025']);
 assert(model.source_ids.every(id=>sources.has(id)));
 assert.equal(model.study_units[0].respondents_parent_total,5008);
 assert.equal(model.study_units[0].respondents_children_total,3426);
 assert.equal(model.study_units[0].individual_category_denominator,null);
 assert.equal(model.study_units[0].individual_gender_denominator,null);
 assert(model.video_genre_observations.every(x=>x.platform_scope==='any_video_app'&&x.gender_breakdown===null));
 assert.deepEqual(model.video_genre_observations.map(x=>x.values.map(v=>v.percent)),[[80,43,38],[62,46,43]]);
 assert.deepEqual(model.youtube_inhome_age_minutes_per_week.map(x=>x.minutes),[427,407,447]);
 assert.deepEqual(model.us_teen_youtube_use.map(x=>[x.boys_percent,x.girls_percent]),[[94,89],[20,13]]);
 assert.equal(model.directional_gender_evidence.youtube_specific_gender_by_format_percentages,null);
 assert.equal(model.validity.study_is_youtube_genre_gender_sample,true);
 assert.equal(model.validity.australia_youtube_specific_child_genre_sample,true);
 assert.equal(model.validity.australia_genre_sample_is_worldwide_or_all_ages,false);
 assert.equal(model.validity.ofcom_uk_genre_survey_is_youtube_specific,false);
 assert.equal(model.validity.pew_us_teen_platform_survey_is_genre_specific,false);
 const au=model.australia_youtube_genres;
 assert.equal(au.total_respondents_n,1129);
 assert.equal(au.youtube_watching_subgroup_n,null);
 assert.equal(au.boys_youtube_watching_subgroup_n,null);
 assert.equal(au.girls_youtube_watching_subgroup_n,null);
 assert.equal(au.estimated_any_youtube_use_percent,89);
 assert.equal(au.gender_conditioned_genres.length,12);
 const get=id=>au.gender_conditioned_genres.find(x=>x.id===id);
 assert.deepEqual([get('gaming').boys_percent,get('gaming').girls_percent],[67,39]);
 assert.deepEqual([get('fashion').boys_percent,get('fashion').girls_percent],[5,31]);
 assert.deepEqual([get('animation').boys_percent,get('animation').girls_percent],[38,36]);
 assert(au.gender_conditioned_genres.every(x=>Number.isInteger(x.boys_percent)&&Number.isInteger(x.girls_percent)));
 assert.equal(au.per_genre_uncertainty,null);
 assert.equal(au.estimate_not_platform_census,true);
 assert.equal(model.validity.identify_or_profile_minors,false);
 assert.equal(model.validity.join_uk_genre_with_us_youtube_platform_use,false);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Child audience/animation gates do not conflate all-ages, mixed, made-for-kids and 18+ policies',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/child-age-and-format-gates.json'),load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'child_audience_eligibility_and_format_distinctions');
 assert(model.sources.every(x=>ids.has(x)));
 assert.deepEqual(model.classification_cases.map(x=>x.id),[
   'made_for_kids','mixed_audience_child_directed','general_family_friendly',
   'teen_or_older_general','age_restricted_18_plus'
 ]);
 assert(model.classification_cases.every(x=>x.source_ids.every(id=>ids.has(id))));
 assert.equal(model.classification_cases[1].studio_category,'made_for_kids');
 assert.equal(model.classification_cases[2].studio_category,'not_automatically_made_for_kids');
 assert.equal(model.classification_cases[4].default_user_age_min,18);
 assert.equal(model.made_for_kids_platform_impacts.personalized_advertising_allowed,false);
 assert.equal(model.made_for_kids_platform_impacts.all_advertising_banned,false);
 assert.equal(model.made_for_kids_platform_impacts.creator_typical_revenue_effect,null);
 assert.equal(model.age_restricted_18_plus_impacts.signed_out_viewing_allowed,false);
 assert.equal(model.age_restricted_18_plus_impacts.ads_always_disabled,false);
 assert.deepEqual(model.population_observations.map(x=>x.value),[96,53]);
 assert.deepEqual(model.population_observations.map(x=>x.ages),['8–14','4–15']);
 assert(model.population_observations.every(x=>x.source_ids.every(id=>ids.has(id))&&x.count_unique_children===null));
 const preschool=model.preschool_youtube_evidence;
 assert(ids.has(preschool.population_frame.source_id));
 assert(ids.has(preschool.product_configuration.source_id));
 assert.equal(preschool.population_frame.parent_respondents_n,3054);
 assert.equal(preschool.population_frame.survey_aapor_rr3_percent,60);
 assert.equal(preschool.population_frame.reported_full_sample_moe_pp,2.2);
 assert.equal(preschool.population_frame.subgroup_n,null);
 assert.equal(preschool.population_frame.subgroup_moe_pp,null);
 assert.equal(preschool.population_frame.youtube_kids_app_vs_main_platform_split,null);
 assert.deepEqual(preschool.parent_reported_child_youtube_use.map(x=>x.age),['under_2','2_to_4']);
 assert.deepEqual(preschool.parent_reported_child_youtube_use.map(x=>x.ever_viewed_percent),[62,84]);
 assert.deepEqual(preschool.parent_reported_child_youtube_use.map(x=>x.daily_viewed_percent),[35,51]);
 assert.deepEqual(preschool.parent_reported_child_youtube_use.map(x=>x.viewing_together_conditional_percent),[95,93]);
 assert(preschool.parent_reported_child_youtube_use.every(x=>x.separate_group_n===null));
 assert.deepEqual(preschool.product_configuration.settings.map(x=>x.id),['preschool','younger','older']);
 assert.deepEqual(preschool.product_configuration.settings.map(x=>x.age_max_inclusive),[4,8,12]);
 assert.equal(preschool.product_configuration.settings_prove_creator_video_is_made_for_kids,false);
 assert.equal(preschool.product_configuration.all_catalog_items_individually_approved,false);
 assert.equal(preschool.content_subcultures.length,4);
 assert(preschool.content_subcultures.every(x=>x.observed_video_population===null&&x.observed_watchtime===null));
 assert(Object.values(preschool.unmeasured).every(x=>x===null));
 assert(dossier.claims.some(c=>c.id==='pew-2025-us-preschool-youtube-parent-reports'&&c.source_ids.includes(preschool.population_frame.source_id)));
 assert(dossier.claims.some(c=>c.id==='youtube-kids-2026-three-age-content-levels'&&c.source_ids.includes(preschool.product_configuration.source_id)));
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Selected video topic upload totals and broad learning views keep different units',async()=>{
  const [observed,dossier]=await Promise.all([
    load('ontology/youtube/topic-observations.json'),load('specimens/youtube.json')
  ]);
  assert.equal(observed.observations.length,36);
  const get=id=>observed.observations.find(x=>x.id===id);
  const a=get('morning-routine-title-uploads-h1-2026');
  const b=get('us-learning-howto-views-jun2025');
  assert.equal(a.value,450000);
  assert.equal(a.comparison,'>');
  assert.equal(a.unit,'uploaded_videos');
  assert.equal(a.period,'2026-01-01 to 2026-06-30');
  assert.equal(a.metric_definition_revision,'not_applicable_upload_count');
  assert.equal(b.value,5500000000);
  assert.equal(b.unit,'views');
  assert.equal(b.geography,'United States');
  assert.equal(b.period,'2025-06-01 to 2025-06-30');
  assert.equal(b.topic_id,'learning-how-to');
  assert.equal(b.metric_definition_revision,'before_2026_08_24');
  assert(dossier.evidence.some(x=>x.id==='yt-morning-routine-upload-2026' && x.url===a.source_url));
  assert(dossier.evidence.some(x=>x.id==='yt-learning-howto-views-2026' && x.url===b.source_url));
});

test('Barb 2025 device shares are bounded UK Wi-Fi viewing, not people or selected-channel stats',async()=>{
  const [model,dossier]=await Promise.all([
    load('ontology/youtube/screen-viewing-uk-2025.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(model.kind,'uk_wifi_at_home_device_screen_comparison');
  assert(sources.has(model.source_id));
  assert(sources.has(model.related_ofcom_2026.source_id));
  assert.equal(model.service_level.period,'2025-Q2');
  assert.equal(model.service_level.adult_16_plus.tv_set_percent,43);
  assert.equal(model.service_level.adult_16_plus.smartphone_percent,32);
  assert.equal(model.service_level.children_4_to_15.tv_set_percent,53);
  assert.equal(model.service_level.children_4_to_15.smartphone_percent,null);
  assert.equal(model.service_level.adult_16_plus.person_count,null);
  assert.equal(model.service_level.population_unit,'viewing_activity_not_unique_people');
  assert.equal(model.separate_channel_measurement.selected_channel_count,200);
  assert.equal(model.separate_channel_measurement.separate_from_service_level_device_shares,true);
  assert(model.separate_channel_measurement.excluded_from_acr_channel_sample.includes('shorts'));
  assert.equal(model.related_ofcom_2026.values.find(x=>x.id==='tv_set_2025').minutes_per_person_per_day,19);
  assert.equal(model.related_ofcom_2026.values.find(x=>x.id==='all_connected_home_devices_2025').minutes_per_person_per_day,41);
  assert(Object.values(model.unknowns).every(x=>x===null));
});

test('Seven video monetization surfaces distinguish inventory, replay and disputed Shorts claims',async()=>{
  const [model,dossier]=await Promise.all([
    load('ontology/youtube/video-surfaces-economics.json'),
    load('specimens/youtube.json')
  ]);
  const known=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(model.kind,'video_format_ad_inventory_and_live_replay_research');
  assert.deepEqual(model.surfaces.map(x=>x.id),[
    'watch_page_upload','shorts','live','premiere','clip','podcast','live_replay'
  ]);
  assert(model.surfaces.every(x=>x.source_ids.length&&x.source_ids.every(id=>known.has(id))));
  assert(model.surfaces.every(x=>x.revenue_per_view===null&&x.creator_cost===null));
  assert.equal(model.inventory.watch_page_midroll.threshold_seconds_inclusive,480);
  assert.equal(model.inventory.watch_page_midroll.chosen_slot_is_ad_guarantee,false);
  assert.equal(model.inventory.live_midroll.slot_guaranteed_to_serve,false);
  assert.equal(model.inventory.shorts_feed_ads.is_watch_page_midroll,false);
  assert.equal(model.surfaces.find(x=>x.id==='shorts').max_seconds,180);
  assert.equal(model.surfaces.find(x=>x.id==='clip').min_seconds,5);
  assert.equal(model.surfaces.find(x=>x.id==='clip').max_seconds,60);
  assert.equal(model.live_replay_comparison.replay_share_of_total_income,null);
  assert.equal(model.live_replay_comparison.production_labor_hours,null);
  assert.deepEqual(model.live_replay_comparison.replay_days_after_end,[7,30,90]);
  assert(model.live_replay_comparison.source_ids.every(id=>known.has(id)));
  assert.equal(model.dated_policy_conflict.claimed_effective_at,'2026-09-24');
  assert.equal(model.dated_policy_conflict.resolved_uniform_rule,null);
  assert.equal(model.dated_policy_conflict.account_specific_application,null);
  assert(model.dated_policy_conflict.source_ids.every(id=>known.has(id)));
  assert(Object.values(model.unknowns).every(x=>x===null));
});

test('2020–25 NFL source distinguishes views, uploads and within-year offseason proportion',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/nfl-view-seasonality-2026.json'),load('specimens/youtube.json')
 ]);
 assert.equal(model.kind,'nfl_viewing_seasonality_and_growth_case');
 assert.equal(model.source_id,'yt-nfl-culture-2026');
 assert(dossier.evidence.some(x=>x.id===model.source_id));
 assert.deepEqual(model.observations.map(x=>x.value),[20000000000,250,400,30]);
 assert.deepEqual(model.observations.map(x=>x.unit),[
  'view_events','relative_percent_increase','relative_percent_increase','percent_of_2025_nfl_related_view_events'
 ]);
 assert(model.observations.every(x=>x.comparator==='greater_than'&&x.is_interpolated===false));
 assert.equal(model.sampling_gaps.annual_view_series_2021_2024,null);
 assert.equal(model.sampling_gaps.month_by_month_view_series,null);
 assert.equal(model.publication_gates.filter(x=>x.fulfilled).length,2);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Beauty/fashion title-query observations never mix uploads, views and seasonal growth',async()=>{
 const [model,dossier,observations]=await Promise.all([
  load('ontology/youtube/beauty-fashion-query-series.json'),load('specimens/youtube.json'),load('ontology/youtube/topic-observations.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'beauty_fashion_title_query_series_review');
 assert.equal(model.source_observations.length,5);
 assert(model.source_observations.every(x=>sources.has(x.source_id)&&x.comparison==='greater_than'&&x.seasonal_effect_measured===false));
 const uploads=model.source_observations.filter(x=>x.unit==='public_video_uploads');
 assert.deepEqual(uploads.map(x=>x.id),['morning_routine_h1_2026']);
 assert.equal(uploads[0].value,450000);
 assert.equal(model.source_observations.filter(x=>x.unit==='video_views').length,4);
 assert.equal(model.source_observations.find(x=>x.id==='halloween_makeup_2025').period_end,'2025-10-05');
 assert(model.source_observations.filter(x=>x.observed_topic_record_id!==null)
   .every(x=>observations.observations.some(o=>o.id===x.observed_topic_record_id)));
 assert.equal(model.series_protocol.query_id_requires_frozen_definition,true);
 assert.equal(model.acceptance_gates.filter(x=>x.fulfilled).length,1);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Animation format timeline keeps publication dates separate from fan-survey measurement years',async()=>{
 const [model,dossier,taxonomy]=await Promise.all([
  load('ontology/youtube/animation-format-cycles.json'),
  load('specimens/youtube.json'),load('ontology/youtube/taxonomy.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'animation_meme_format_cycle_evidence');
 assert.equal(model.anime_view_geography_2023.unit,'share_of_video_view_events');
 assert.equal(model.anime_view_geography_2023.percent_lower_bound_exclusive,80);
 assert.equal(model.anime_view_geography_2023.comparison,'>');
 assert.equal(model.anime_view_geography_2023.unique_viewers,null);
 assert.equal(model.anime_view_geography_2023.creator_population,null);
 assert(ids.has(model.anime_view_geography_2023.source_id));
 assert.equal(model.animation_classification_distinctions.length,5);
 assert(model.animation_classification_distinctions.every(x=>x.age_rating_inferable===false));

 assert.equal(model.timeline.length,4);
 assert.equal(model.survey_observations.length,7);
 assert(model.timeline.every(x=>ids.has(x.source_id)&&x.is_platform_wide_growth_measure===false&&x.viewers_unique===null));
 assert(model.survey_observations.every(x=>ids.has(x.source_id)&&x.item_specific_n===null&&x.global_animation_audience_percent===null));
 assert(model.taxonomy_ids.every(id=>taxonomy.topics.some(t=>t.id===id)));
 assert(model.timeline.filter(x=>x.published_at.startsWith('2026')).every(x=>x.observation_period==='2025-04'));
 assert(model.survey_observations.filter(x=>x.fieldwork==='2025-04').length===6);
 const us=model.survey_observations.find(x=>x.id==='indie_series_us_weekly_2025');
 const mexico=model.survey_observations.find(x=>x.id==='animation_memes_mx_weekly_2025');
 assert.equal(us.reported_percent,63);
 assert.equal(us.sample_total_n,358);
 assert.equal(mexico.reported_percent,84);
 assert.equal(mexico.sample_total_n,379);
 assert.notEqual(us.question,mexico.question);
 assert.equal(model.acceptance_gates.filter(x=>x.fulfilled).length,2);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Adjacent video comparison is scope-only and does not admit marketplace specimens',async()=>{
 const [model,dossier,gallery]=await Promise.all([
  load('ontology/youtube/comparison-set.json'),load('specimens/youtube.json'),load('gallery/index.json')
 ]);
 const sourceIds=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.status,'research_comparison_candidates_not_new_marketplace_specimens');
 assert.deepEqual(model.candidates.map(x=>x.id),['twitch','tiktok','vimeo_ott']);
 assert.equal(model.specimen_admission.authorized_for_any_comparator,false);
 assert.equal(model.specimen_admission.created_comparator_specimen,false);
 assert.equal(model.specimen_admission.changed_intake_queues,false);
 assert.equal(model.acceptance_gates.length,4);
 assert.equal(model.acceptance_gates.filter(x=>x.fulfilled).length,1);
 assert(model.candidates.every(x=>x.source_ids.every(id=>sourceIds.has(id))));
 assert(model.candidates.every(x=>x.current_creator_income_median===null &&
   x.zero_earner_rate===null && x.typical_labor_hours===null));
 assert.equal(gallery.specimens.length,26);
 assert(model.excluded_from_conclusions.includes('sampled_creator_income_rankings'));
});

test('Selected monetized AIR Studio RPM and live analyses keep denominators separate',async()=>{
 const [model,dossier]=await Promise.all([
  load('ontology/youtube/air-studio-benchmarks-2026.json'),load('specimens/youtube.json')
 ]);
 const sourceIds=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'selected_monetized_studio_rpm_and_livestream_benchmarks');
 assert.equal(model.studies.length,2);
 assert(model.studies.every(s=>s.source_ids.every(id=>sourceIds.has(id))));
 const rpm=model.studies.find(s=>s.id==='monetized_rpm_sample_300');
 const live=model.studies.find(s=>s.id==='monetized_live_sample_127');
 assert.equal(rpm.selected_channels_n,300);
 assert.equal(rpm.observed_channel_months,3595);
 assert.equal(rpm.reported_overall_median_rpm_usd,2.3);
 assert.equal(rpm.reported_median_profit,null);
 assert.equal(rpm.includes_zero_earners,false);
 assert.deepEqual(rpm.niche_examples.map(x=>x.median_rpm_usd),[10.22,2.05,0.33,2.01]);
 assert.equal(rpm.niche_examples[3].small_n_warning,true);
 assert(rpm.niche_examples.every(x=>x.niche_channels_n===null));
 assert.equal(live.all_studied_channels_n,404);
 assert.equal(live.observed_all_channel_months,3893);
 assert.equal(live.monetized_live_channels_n,127);
 assert.equal(live.monetized_live_channel_months,1287);
 assert.equal(live.median_views_per_live_stream,45);
 assert.equal(live.includes_zero_earners,false);
 assert.equal(live.reported_live_revenue_median_usd,null);
 assert.equal(model.cross_study_deduplication.overlapping_channels,null);
 assert.equal(model.cross_study_deduplication.combine_into_pooled_channel_dataset,false);
 assert(Object.values(model.unmeasured).every(x=>x===null));
});

test('Technology and software subculture scope cannot turn general how-to or desk views into learners',async()=>{
 const [model,dossier,taxonomy]=await Promise.all([
  load('ontology/youtube/technology-subcultures-2026.json'),
  load('specimens/youtube.json'),
  load('ontology/youtube/taxonomy.json')
 ]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 const categories=new Set(taxonomy.topics.map(x=>x.id).concat(taxonomy.groups));
 assert.equal(model.kind,'software_and_technology_content_subculture_scope');
 assert.equal(model.segments.length,6);
 assert(model.segments.every(x=>x.source_ids.every(s=>sources.has(s))&&x.taxonomy_ids.every(t=>categories.has(t))));
 assert(model.segments.every(x=>x.audience_unique_people===null&&x.creator_population===null&&x.median_creator_profit===null));
 assert.equal(model.observed_public_metrics.length,2);
 assert.deepEqual(model.observed_public_metrics.map(x=>x.value),[250000000,5500000000]);
 assert.notEqual(model.observed_public_metrics[0].geography,model.observed_public_metrics[1].geography);
 assert.notEqual(model.observed_public_metrics[0].end,model.observed_public_metrics[1].end);
 assert(model.observed_public_metrics.every(x=>sources.has(x.source_id)&&x.software_tutorial_share===null&&x.creator_revenue===null));
 assert.equal(model.comparability.can_calculate_software_percent,false);
 assert.equal(model.comparability.can_add_metrics,false);
 assert(Object.values(model.unknowns).every(x=>x===null));
});

test('Collaborations distinguish historical limits, native payout and scoped fan survey respondents',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/creator-collaboration-fandom-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(s=>s.id));
 assert(model.evidence_families.every(f=>f.source_ids.every(id=>ids.has(id))));
 assert.equal(model.collaboration_policy.max_invited_creators_current,10);
 assert.equal(model.collaboration_policy.max_invited_creators_initial_rollout,5);
 assert.equal(model.collaboration_policy.active_livestream_eligible,false);
 assert.equal(model.collaboration_policy.revenue_recipient,'uploading_channel_only');
 assert.equal(model.collaboration_policy.platform_splits_ad_revenue_automatically,false);
 assert.equal(model.collaboration_policy.guaranteed_recommendation_lift,false);
 assert.equal(model.collaboration_policy.separate_contract_revenue_sharing,null);
 assert.deepEqual(model.survey_groups.map(g=>g.n_total),[496,939]);
 assert.deepEqual(model.survey_groups.map(g=>g.questions.map(q=>q.percent)),[[77,78,71,69],[63,60,73,72]]);
 assert.equal(model.survey_shared_limits.question_specific_n,null);
 assert.equal(model.survey_shared_limits.global_population_representative,false);
 assert(model.illustrative_cross_channel_forms.every(f=>f.actual_cross_channel_path_unverified));
 assert(Object.values(model.study_protocol.unobserved).every(v=>v===null));
 assert(model.acceptance_gates.some(g=>g.verified===false));
});

test('2025 Omdia video watch time and 2026 NRG U.S. survey cannot be pooled',async()=>{
 const [model,dossier]=await Promise.all([
   load('ontology/youtube/video-attention-culture-2026.json'),load('specimens/youtube.json')
 ]);
 const sourceIds=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(model.kind,'observed_video_supply_and_niche_culture_survey');
 assert.deepEqual(model.source_families.map(x=>x.id),['omdia-2026','nrg-youtube-2026']);
 assert(model.source_families.every(x=>x.source_ids.every(id=>sourceIds.has(id))));
 assert(model.observations.every(x=>sourceIds.has(x.source_id)));
 assert.equal(model.observations.length,11);
 const get=id=>model.observations.find(x=>x.id===id);
 assert.equal(get('omdia-video-stock-dec2025').value,29000000000);
 assert.equal(get('omdia-video-stock-dec2025').unit,'video_objects');
 assert.equal(get('omdia-top-1pct-watchtime').value,91);
 assert.equal(get('omdia-top-1pct-watchtime').unit,'percent_of_video_watch_time');
 assert.equal(get('omdia-shorts-new-uploads').unit,'percent_new_uploads');
 assert.equal(get('omdia-shorts-new-uploads').comparison,'greater_than');
 assert.deepEqual(['omdia-music-watchtime','omdia-news-watchtime','omdia-video-podcasts-watchtime','omdia-professional-watchtime'].map(id=>get(id).value),[33,10,5,46]);
 assert.deepEqual(['nrg-niche-watched','nrg-fandom-explainer-watched','nrg-personal-interests','nrg-stays-interested'].map(id=>get(id).sample_n),[496,496,939,939]);
 assert(model.observations.filter(x=>x.id.startsWith('nrg-')).every(x=>x.per_question_n===null));
 assert(Object.values(model.unmeasured).every(x=>x===null));
 assert(model.inference_rules.some(x=>x.includes('must not be pooled')));
});

test('2019 high-subscriber linking evidence is not a creator-income distribution',async()=>{
  const [study,dossier]=await Promise.all([
    load('ontology/youtube/historical-linking-study.json'),load('specimens/youtube.json')
  ]);
  assert(dossier.evidence.some(x=>x.id===study.source.source_id));
  assert.equal(study.population.channels,153770);
  assert.equal(study.population.subscribers_min_inclusive,100000);
  assert.equal(study.population.representative_of_all_youtube_channels,false);
  assert.equal(study.population.representative_of_new_entrants,false);
  assert.equal(study.video_observations.video_records,136909228);
  assert.equal(study.video_observations.descriptions_containing_any_url,93186712);
  assert.equal(study.channel_linking.marketplace.find(x=>x.id==='less_than_20pct').percent_reported,75.37);
  assert.equal(study.channel_linking.crowdfunding.find(x=>x.id==='less_than_20pct').percent_reported,94);
  assert.equal(study.channel_linking.crowdfunding.find(x=>x.id==='none').percent_reported,83.1);
  assert.equal(study.historical_view_concentration.top_channel_share_percent_reported,0.4);
  assert.equal(study.historical_view_concentration.views_accounted_for_percent_reported,62);
  assert(study.historical_view_concentration.limitations.includes('2019'));
  assert.equal(study.modeled_advertising_revenue_in_article.is_observed_channel_income,false);
  assert.equal(study.modeled_advertising_revenue_in_article.publish_as_empirical_payout,false);
  assert(Object.values(study.unmeasured).every(x=>x===null));
  assert(study.reporting_rules.some(x=>x.includes('2019')));
});

test('Mixed-platform creator income surveys remain separate and do not supply YouTube estimates',async()=>{
  const [report,dossier]=await Promise.all([
    load('ontology/youtube/cross-platform-income-surveys.json'),load('specimens/youtube.json')
  ]);
  const sources=new Set(dossier.evidence.map(s=>s.id));
  assert.equal(report.studies.length,3);
  assert.equal(report.independent_dataset_families,3);
  assert.equal(new Set(report.studies.map(s=>s.source_family_id)).size,3);
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
  const creatoriq=report.studies.find(s=>s.id==='creatoriq-2026');
  assert.equal(creatoriq.survey_respondents_exact,5095);
  assert.equal(creatoriq.youtube_subgroup_n,null);
  assert.equal(creatoriq.non_earning_entrants_covered,null);
  assert.equal(creatoriq.measurements.find(x=>x.id==='creatoriq_under_10000_year').value,67);
  assert.equal(creatoriq.measurements.find(x=>x.id==='creatoriq_income_not_primary').value,62);
  assert(creatoriq.measurements.every(x=>x.denominator_n===null));
  assert(creatoriq.margin_of_error_verifiability.includes('not established'));

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

test('Reader-facing research synthesis preserves source attribution and unresolved population income',async()=>{
 const [report,dossier]=await Promise.all([load('ontology/youtube/research-synthesis-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(report.kind,'reader_facing_marketplace_dossier_synthesis');
 assert.equal(report.findings.length,7);
 assert(report.findings.every(x=>x.source_ids.length>0&&x.source_ids.every(id=>ids.has(id))));
 assert(report.findings.every(x=>x.supported&&x.unknown&&x.document_refs.length));
 assert(report.evidence_acceptance_gates.every(x=>x.fulfilled===false));
 assert(Object.values(report.nonfindings).every(x=>x===null));
 assert(report.findings.find(x=>x.id==='entry_and_revenue').supported.includes('February 2027'));
 assert(report.scope_rules.some(x=>x.includes('missing values into zeros')));
});

test('Seasonal observations preserve year, country and incompatible population units',async()=>{
 const [study,dossier]=await Promise.all([
  load('ontology/youtube/seasonal-discovery-comparison.json'),load('specimens/youtube.json')
 ]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert.equal(study.kind,'seasonal_discovery_evidence_comparability');
 assert.equal(study.cases.length,5);
 assert(study.cases.every(x=>x.source_ids.every(id=>ids.has(id))&&x.seasonal_causal_effect===null&&!x.seasonal_recurrence_verified));
 assert.equal(study.cases.find(x=>x.id==='nfl_2025_offseason').value,30);
 assert.equal(study.cases.find(x=>x.id==='nfl_2025_offseason').measurement_type,'within_year_share');
 assert.equal(study.cases.find(x=>x.id==='prom_grwm_2024').measurement_type,'annual_topic_total');
 assert.equal(study.cases.find(x=>x.id==='halloween_makeup_2025').period,'2025_01_01_to_2025_10_05');
 assert.equal(study.cases.find(x=>x.id==='uk_children_weekly_2025').unit,'minutes_per_child_per_week_ages_4_to_15_in_home');
 assert(study.cross_case_comparisons.every(x=>x.permitted===false));
 assert(study.acceptance_gates.filter(x=>x.fulfilled).length===1);
 assert(Object.values(study.unmeasured).every(x=>x===null));
});

test('Publish time study distinguishes owner reports, UTC times, live audiences and unknown lift',async()=>{
  const [study,dossier]=await Promise.all([
    load('ontology/youtube/geographic-publishing-time.json'),load('specimens/youtube.json')
  ]);
  const ids=new Set(dossier.evidence.map(x=>x.id));
  assert.equal(study.kind,'video_publishing_time_geography_study');
  assert(study.source_ids.every(id=>ids.has(id)));
  assert.equal(study.official_findings.length,5);
  assert(study.official_findings.every(x=>x.source_ids.every(id=>ids.has(id))));
  const owner=study.official_findings.find(x=>x.id==='owner_online_windows');
  assert.equal(owner.window_days,28);
  assert.equal(owner.owner_authorization_required,true);
  assert(study.official_findings.find(x=>x.id==='longterm_upload_timing').not_proof_of.includes('universal'));
  const live=study.format_comparison.find(x=>x.format==='live_stream');
  const ordinary=study.format_comparison.find(x=>x.format==='ordinary_on_demand_video');
  assert.equal(live.live_attendance_required,true);
  assert.equal(ordinary.longterm_advantage_verified,false);
  assert.equal(study.proposed_controlled_study.randomized_episodes_n,null);
  assert.equal(study.proposed_controlled_study.ninety_day_lift,null);
  assert(study.acceptance_gates.every(x=>x.pass===false));
  assert(Object.values(study.unmeasured).every(x=>x===null));
  assert(study.publication_policy.some(x=>x.includes('suppressed geography')));
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

test('Study With Me participation uses selected public comment events, never unique people or verified learning outcomes',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-collaboration-fandom-2026.json'),load('specimens/youtube.json')]);
 const study=m.study_with_me_observation,known=new Set(d.evidence.map(s=>s.id));
 assert(known.has(study.source_id));
 assert(m.evidence_families.some(f=>f.id==='study_with_me_2026_peer_reviewed'&&f.source_ids.includes(study.source_id)));
 assert.equal(study.selected_videos,393);
 assert.equal(study.analyzed_comments,164611);
 assert.equal(study.data_collection,'2024-09');
 assert.equal(study.videos_published_after_2023,211);
 assert.equal(study.positive_percent_exact,null);
 assert.equal(study.representative_comment_population,false);
 assert.equal(study.experimental_design,false);
 assert.equal(study.silent_viewers_observed,false);
 assert.equal(study.participants_psychological_states_validated,null);
 assert.equal(study.objectively_measured_learning_improvement,null);
 assert.equal(study.causal_effect_on_motivation,null);
 assert.equal(study.unique_engaged_people,null);
 assert.equal(study.viewer_to_creator_payment_rate,null);
 assert.equal(study.creator_net_earnings,null);
 assert.equal(study.youth_profiles_or_comment_bodies_collected,false);
 assert(d.claims.some(c=>c.id==='study-with-me-2026-title-selected-video-comments'&&c.source_ids.includes(study.source_id)));
});

test('Korean 50-channel engagement panel reports associations, not new-to-returning people or causal revenue',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/retention-posts-memberships.json'),load('specimens/youtube.json')]);
 const obs=m.beauty_channel_viewer_watchtime_study,sourceIds=new Set(d.evidence.map(x=>x.id));
 assert(sourceIds.has(obs.source_id));assert(m.source_ids.includes(obs.source_id));
 assert.equal(obs.channel_sample_n,50);
 assert.equal(obs.method,'observational_fixed_effects_panel_regression');
 assert.deepEqual(obs.explanatory_metrics.map(x=>x.id),['new_viewer_watch_time','returning_viewer_watch_time','subscriber_watch_time','likes']);
 assert.equal(obs.explanatory_metrics[1].reported_relationship,'strongest_positive_association_in_examined_metrics');
 assert.equal(obs.explanatory_metrics[3].reported_relationship,'no_statistically_significant_association_reported');
 assert(obs.explanatory_metrics.every(x=>x.numeric_coefficient===null));
 assert.equal(obs.viewer_status_transition_rate,null);
 assert.equal(obs.actual_new_to_returning_cohort_count,null);
 assert.equal(obs.causal_incremental_revenue_effect,null);
 assert.equal(obs.typical_youtube_creator_monthly_revenue,null);
 assert.equal(obs.creator_profit_after_costs,null);
 assert.equal(obs.study_overlap_with_korean_beauty_47_2026,null);
 assert.equal(obs.private_records_obtained,false);
});

test('YouTube monetization appeal windows differ between video review, first rejection and YPP suspension',async()=>{
 const [l,d]=await Promise.all([load('ontology/youtube/application-lifecycle.json'),load('specimens/youtube.json')]);
 const c=l.monetization_enforcement_crosswalk,ids=new Set(d.evidence.map(x=>x.id));
 assert(c.source_ids.every(id=>ids.has(id)));
 assert.deepEqual(c.pathways.map(x=>x.id),[
  'individual_video_ad_suitability','first_ypp_application_rejection','repeated_ypp_application_rejection',
  'scheduled_ypp_suspension','already_suspended_ypp_without_preappeal']);
 assert(c.pathways.every(x=>x.source_ids.every(id=>ids.has(id))&&x.guaranteed_restored_advertising===false));
 const [video,first,repeat,scheduled,suspended]=c.pathways;
 assert.equal(video.scope,'video');assert.equal(video.automatic_ypp_membership_loss,false);
 assert.equal(video.pre_review_initial_processing_max_hours_possible,24);
 assert.equal(video.human_review_deadline_days,null);
 assert.equal(first.scope,'channel');assert.equal(first.appeal_window_days,21);
 assert.equal(first.earliest_standard_reapply_after_rejection_days,30);
 assert.equal(first.failed_appeal_may_require_wait_days_from_rejection,90);
 assert.equal(repeat.earliest_standard_reapply_after_rejection_days,90);
 assert.equal(scheduled.pre_suspension_appeal_window_days,7);
 assert.equal(scheduled.appeal_again_after_failed_pre_suspension_appeal,false);
 assert.equal(suspended.post_suspension_appeal_window_days,21);
 assert.equal(suspended.decision_communication_within_days,14);
 assert.equal(suspended.successful_appeal_reentry_within_days,30);
 assert.equal(suspended.reapply_after_suspension_days,90);
 assert.equal(c.video_appeal_requirements.less_than_minutes,5);
 assert.equal(c.video_appeal_requirements.unlisted,true);
 assert(Object.values(c.unmeasured).every(x=>x===null));
 assert(d.claims.some(x=>x.id==='ypp-2026-distinct-video-vs-channel-appeal-paths'&&
  x.source_ids.includes('yt-monetization-icons-human-review-2026')));
});

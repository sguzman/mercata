export function auditShoppingInference(model,frame,claim){
 const found=model.frames.find(x=>x.id===frame);
 if(!found)return {allowed:false,reason:'unknown_source_frame'};
 if(claim==='us_genz_discovery_agreement'&&frame==='self_reported_us_genz_brand_discovery'){
  return {allowed:true,percentage:found.percent_agree_youtube_helped_discover_unfamiliar_brands_or_products,
    observed_purchases:null,creator_cash_profit:null};
 }
 if(claim==='ranked_product_sample_size'&&frame==='company_selected_transaction_top_items'){
  return {allowed:true,selected_product_skus:found.records_selected,total_orders:null,creator_cash_profit:null};
 }
 if(claim==='ranked_video_sample_size'&&frame==='company_selected_transaction_top_videos'){
  return {allowed:true,selected_videos:found.records_selected,total_orders:null,creator_cash_profit:null};
 }
 return {allowed:false,reason:'cannot_convert_selected_records_or_survey_agreement_to_sales'};
}
export function assessMerchantMetric(model,metric,{authorized=false}={}){
 const entry=model.merchant_center.metrics.find(x=>x.id===metric);
 if(!entry)return {available:false,reason:'unregistered_metric'};
 if(!authorized)return {available:false,reason:'merchant_authorization_required'};
 return {available:true,meaning:entry.meaning,observed_value:null,settled_approved_only:entry.approved_only};
}

export function auditShoppingIntentFrames(model,sourceIds){
 const errors=[],frames=model?.intent_reference_frames||[];
 if(frames.length!==2||frames[0].id!=='kantar_video_learning_and_product_research_2025'||
    frames[1].id!=='material_video_shopping_journeys_2023')errors.push('wrong intent survey frames');
 const [k,m]=frames;
 if(!k||!m)return {valid:false,errors};
 if(!sourceIds.has(k.source_id)||!sourceIds.has(m.source_id)||k.source_id===m.source_id)errors.push('missing or duplicated survey source');
 if(k.overall_sample_n!==2160||k.source_separately_cites_youtube_viewer_subset_n!==1001||
    k.per_question_n!==null||k.geography!=='United States'||k.global_generalization_allowed!==false||
    k.sponsor!=='Google')errors.push('misrepresented Kantar denominator or scope');
 const labels=['rather_video_learn_skill','rather_video_build_something','rather_video_cook_something',
   'youtube_best_instructional_content','youtube_best_product_reviews','youtube_best_unboxing',
   'youtube_creator_product_research_discovery'];
 const pcts=[69,70,63,91,81,76,81];
 if(k.observations?.length!==labels.length||k.observations.some((x,i)=>
    x.id!==labels[i]||x.percent!==pcts[i]||!x.unit))errors.push('survey percentages or predicates unsupported');
 if(k.verified_purchase_events!==null||k.video_to_purchase_conversion!==null||
    k.causal_creator_sales_effect!==null)errors.push('survey attitudinal claims converted to transactions');
 if(m.survey_sample_n!==2420||m.marketing_article_body_rounded_sample!=='2,000'||
    m.study_is_youtube_only!==false||m.journeys?.length!==7||
    new Set(m.journeys.map(x=>x.id)).size!==7)errors.push('shopping typology frame corrupted');
 if(m.category_proportions!==null||m.buyer_counts_by_journey!==null||
    m.raw_purchase_event_data_obtained!==false||
    m.youtube_attributable_orders!==null||m.causal_effect_of_video!==null||
    m.proven_unique_youtube_conversions!==null)errors.push('invented shopper journey outcomes');
 const assistant=model?.product_review_assistant_announcement;
 if(!assistant||!sourceIds.has(assistant.source_id)||assistant.announced_on!=='2026-09-23'||
    assistant.status!=='public_feature_announcement_not_observed_creator_transaction_or_account_rollout'||
    assistant.can_compute_new_video_to_purchase_conversion!==false||
    assistant.same_as_google_merchant_center_order_reporting!==false)
  errors.push('Ask YouTube product review discovery mislabeled');
 if(assistant?.attributable_paid_orders!==null||
    assistant?.actual_creator_affiliate_commissions!==null||
    assistant?.active_user_population!==null||
    assistant?.attributable_merchant_clicks!==null||
    assistant?.launch_completion_date!==null)
  errors.push('Invented Ask YouTube purchases, revenue or rollout');
 if(Object.values(model?.unmeasured||{}).some(x=>x!==null))errors.push('invented missing shopping outcome');
 return {valid:errors.length===0,errors};
}

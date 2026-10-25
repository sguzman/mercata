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

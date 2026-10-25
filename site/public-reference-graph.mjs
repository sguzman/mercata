export function buildPublicReferenceGraph(nodes,edges){
 if(!Array.isArray(nodes)||!Array.isArray(edges)||nodes.length===0)return {valid:false,reason:'empty_census'};
 const map=new Map();
 for(const n of nodes){
  if(typeof n.video_id!=='string'||!n.video_id||map.has(n.video_id)||typeof n.published_at!=='string'||!Number.isFinite(Date.parse(n.published_at)))return {valid:false,reason:'duplicate_or_undated_video'};
  map.set(n.video_id,n);
 }
 const counted=new Set(),incoming=new Map(nodes.map(n=>[n.video_id,0]));
 for(const e of edges){
  if(!map.has(e.from_video_id)||!map.has(e.to_video_id)||e.from_video_id===e.to_video_id||!['description_link','credited_remix','explicit_on_video_reference','accepted_creator_collaboration'].includes(e.type))return {valid:false,reason:'invalid_public_reference'};
  if(typeof e.public_evidence_url!=='string'||!e.public_evidence_url.startsWith('https://')||typeof e.observed_at!=='string'||!Number.isFinite(Date.parse(e.observed_at)))return {valid:false,reason:'missing_public_evidence'};
  const pair=e.from_video_id+'|'+e.to_video_id+'|'+e.type;
  if(counted.has(pair))return {valid:false,reason:'duplicate_reference'};
  counted.add(pair);
  const from=map.get(e.from_video_id),to=map.get(e.to_video_id);
  if(new Date(e.observed_at)<new Date(from.published_at))return {valid:false,reason:'prepublication_observation'};
  if(e.type!=='accepted_creator_collaboration'&&new Date(to.published_at)>new Date(from.published_at))return {valid:false,reason:'later_target_not_predecessor'};
  incoming.set(to.video_id,incoming.get(to.video_id)+1);
 }
 const linked=new Set(edges.map(e=>e.from_video_id));
 return {valid:true,kind:'public_reference_network_not_viewer_migration',video_count:nodes.length,edge_count:edges.length,linking_video_count:linked.size,linking_video_fraction:linked.size/nodes.length,indegree_by_video:Object.fromEntries(incoming),meme_origin:null,unique_audience_overlap:null,causal_reach_lift:null,creator_income:null};
}
export function auditMemeReferences(model,sources){
 const errors=[];
 if(model?.kind!=='public_video_cross_reference_meme_propagation_protocol'||model?.registered_nodes?.length!==0||model?.registered_edges?.length!==0)errors.push('Unobserved study populated');
 if(!model?.source_ids?.length||model.source_ids.some(x=>!sources.has(x)))errors.push('Missing public source');
 if(!model?.known_product_fact?.official_credit_feature_exists||model.known_product_fact.automatic_revenue_split!==false||model.known_product_fact.guaranteed_reach_lift!==false)errors.push('Collab product misstated');
 if(Object.values(model?.observed_network||{}).some(x=>x!==null))errors.push('Invented network outcome');
 return {valid:!errors.length,errors};
}

export function auditAccountPopulationGraph(graph,knownSources) {
 const errors=[],ids=new Set();
 if(graph?.kind!=='youtube_google_product_account_and_person_population_graph'||graph?.nodes?.length!==16||graph?.edges?.length!==15)errors.push('Unexpected graph scope');
 for(const n of graph?.nodes||[]){
  if(!n.id||ids.has(n.id)||!n.description||!n.not_equivalent_to)errors.push('Invalid concept');ids.add(n.id);
  if(!n.source_ids?.length||n.source_ids.some(s=>!knownSources.has(s)))errors.push('Unknown concept source');
  if(n.measured_unique_people!==null||n.measured_net_creator_profit!==null)errors.push('Invented financial/person measurement');
 }
 for(const e of graph?.edges||[]){
  if(!ids.has(e.from)||!ids.has(e.to)||e.one_to_one_guaranteed!==false||e.measured_person_count!==null)errors.push('Invalid implied identity relationship');
  if(!e.source_ids?.length||e.source_ids.some(s=>!knownSources.has(s)))errors.push('Unsourced link');
 }
 for(const id of ['google_account','channel','viewer','studio','analytics_api','data_api','google_ads','adsense','paid_customer'])if(!ids.has(id))errors.push('Missing essential concept '+id);
 if(Object.values(graph?.unmeasured||{}).some(v=>v!==null))errors.push('Invented global population');
 return {valid:errors.length===0,errors};
}

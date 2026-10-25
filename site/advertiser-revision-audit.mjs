export function auditAdvertiserRevisions(data,knownSourceIds){
 const errors=[];
 if(data?.kind!=='advertiser_suitability_policy_history'||data?.revisions?.length!==6)errors.push('Unexpected dated revision frame');
 const months=['2026-10','2026-09','2026-09','2026-08','2026-03','2026-01'];
 const seen=new Set();
 for(let i=0;i<(data?.revisions||[]).length;i++){
  const e=data.revisions[i];
  if(!e.id||seen.has(e.id)||e.announced_month!==months[i]||e.effective_day!==null)errors.push('Fabricated daily effective date or duplicated revision');
  seen.add(e.id);
  if(!e.source_ids?.length||e.source_ids.some(x=>!knownSourceIds.has(x))||!e.rule||!e.limitations||!e.category?.length||!e.topic_class?.length)errors.push('Unsupported scope or source');
 }
 if(!data?.status_levels?.some(x=>x.id==='creator_eligibility_separate')||!data.status_levels.some(x=>x.id==='removal_separate'))errors.push('Advertiser, YPP and removal incorrectly merged');
 if(data?.review_mechanism?.review_guarantees_monetization!==false)errors.push('Review misrepresented as revenue guarantee');
 if(Object.values(data?.uncertainty||{}).some(x=>x!==null))errors.push('Invented earnings or appeal rates');
 return {valid:!errors.length,errors,count:data?.revisions?.length||0};
}

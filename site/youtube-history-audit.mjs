export function auditYouTubeHistory(data, knownSources, asOf=data?.reviewed_at) {
 const errors=[], validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 if(data?.kind!=='market_and_creator_monetization_history'||!validDate(asOf))errors.push('Invalid history header');
 let previous='';const ids=new Set();
 for(const e of data?.events||[]){
  if(!e.id||ids.has(e.id))errors.push('Duplicate event');
  ids.add(e.id);
  if(!validDate(e.event_date)||e.event_date<previous||e.event_date>asOf)errors.push('Invalid event date or order');
  previous=e.event_date||previous;
  if(e.date_kind!=='source_publication_or_filing_date'||!e.description||!e.limitations||!e.category)errors.push('Unspecified source date or population');
  if(!e.source_ids?.length||!e.source_ids.every(id=>knownSources.has(id)))errors.push('Missing source');
  if(e.stage!=='historical_record'&&e.stage!=='announced_future')errors.push('Bad stage');
  if(e.stage==='announced_future'&&(!validDate(e.effective_from)||e.effective_from<=asOf))errors.push('Future policy incorrectly active');
  if(e.median_creator_income!==null||e.creator_profit_change!==null)errors.push('Invented economic observation');
 }
 if(ids.size===0||Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Missing entries or inferred unmeasured earnings');
 return {valid:errors.length===0,errors,count:ids.size};
}

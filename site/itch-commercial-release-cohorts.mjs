// Pure research input classifier. It does not scrape, fetch, or authenticate project history.
const utc = x => typeof x==='string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x) && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString()===x.replace(/Z$/,'.000Z');
const kind=new Set(['first_public','update','price_conversion','feed_resighting']);
export function classifyItchCommercialReleaseCohort(rows,{startUtc,endUtc}={}){
 if(!Array.isArray(rows))throw new TypeError('Rows must be an array');
 if(!utc(startUtc)||!utc(endUtc)||Date.parse(endUtc)<=Date.parse(startUtc))throw new TypeError('Ordered UTC cohort window required');
 const seen=new Set(),issues=[],counts={new_paid:0,new_free:0,updates:0,price_conversions:0,feed_resightings:0,unverified:0,excluded_non_game:0};
 for(let i=0;i<rows.length;i++){
  const x=rows[i];
  if(!x||typeof x.project_id!=='string'||!x.project_id.trim()||typeof x.is_game!=='boolean'||!kind.has(x.observation_kind)||!utc(x.observation_utc)||Date.parse(x.observation_utc)<Date.parse(startUtc)||Date.parse(x.observation_utc)>=Date.parse(endUtc)){
   issues.push('Invalid in-window public-project record at '+i);continue;
  }
  if(seen.has(x.project_id)){issues.push('Duplicate project ID within same observation cohort: '+x.project_id);continue;}
  seen.add(x.project_id);
  if(x.source_evidence_verified!==true){counts.unverified++;continue;}
  if(!x.is_game){counts.excluded_non_game++;continue;}
  if(x.observation_kind==='update'){counts.updates++;continue;}
  if(x.observation_kind==='price_conversion'){counts.price_conversions++;continue;}
  if(x.observation_kind==='feed_resighting'){counts.feed_resightings++;continue;}
  if(!utc(x.first_public_utc)||x.initial_positive_price_verified===null||typeof x.initial_positive_price_verified!=='boolean'||Date.parse(x.first_public_utc)<Date.parse(startUtc)||Date.parse(x.first_public_utc)>=Date.parse(endUtc)||Date.parse(x.first_public_utc)>Date.parse(x.observation_utc)){
   counts.unverified++;continue;
  }
  if(x.initial_positive_price_verified)counts.new_paid++;
  else counts.new_free++;
 }
 const valid=issues.length===0;
 return {valid,issues,declared_project_rows:rows.length,window_start_utc:startUtc,window_end_utc:endUtc,
  classification_counts:valid&&rows.length>0?counts:null,
  observed_verified_first_paid_game_pages:valid&&rows.length>0?counts.new_paid:null,
  global_first_time_paid_game_launch_rate:null,representative_publisher_release_frequency:null,
  settled_game_orders:null,actual_source_history_authenticated:false,
  note:'Counts classify supplied project rows only. RSS, browse filters, impressions and repeat update sightings are not verified paid first launches.'};
}

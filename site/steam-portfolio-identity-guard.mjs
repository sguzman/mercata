// Synthetic-only AppID/branding/payment-period checks; never infer actual Steam legal identities.
const idPattern=/^fixture-[a-z0-9-]+$/;
const isoDate=x=>{
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))throw new TypeError('Invalid synthetic ISO date');
 const m=Date.parse(x+'T00:00:00Z');
 if(!Number.isFinite(m)||new Date(m).toISOString().slice(0,10)!==x)throw new TypeError('Invalid synthetic ISO date');
 return m;
};
const uniq=(values,label,fixture=false)=>{
 if(!Array.isArray(values)||values.length===0)throw new TypeError('Missing '+label);
 const out=new Set();
 for(const s of values){
  if(typeof s!=='string'||!s||s.length>90||(fixture&&!idPattern.test(s)))throw new TypeError('Invalid '+label);
  if(out.has(s))throw new RangeError('Duplicate '+label);
  out.add(s);
 }
 return out;
};
export function auditSyntheticSteamPortfolioIdentity(apps){
 if(!Array.isArray(apps))throw new TypeError('Expected synthetic AppID rows');
 const appIds=new Set(),developers=new Set(),publishers=new Set(),homepages=new Set(),franchises=new Set(),payees=new Set();
 let transferApps=0,multiDeveloperApps=0;
 for(const a of apps){
  if(!a||typeof a!=='object'||typeof a.fixture_app_id!=='string'||!idPattern.test(a.fixture_app_id))throw new TypeError('Only synthetic AppIDs permitted');
  if(appIds.has(a.fixture_app_id))throw new RangeError('Duplicate fixture AppID');
  appIds.add(a.fixture_app_id);
  for(const [key,dst,fixture] of [['developer_labels',developers,false],['publisher_labels',publishers,false],['creator_homepage_ids',homepages,true],['franchise_page_ids',franchises,true]]){
   for(const s of uniq(a[key],key,fixture))dst.add(s);
  }
  if(a.developer_labels.length>1)multiDeveloperApps++;
  if(!Array.isArray(a.payment_periods)||!a.payment_periods.length)throw new TypeError('Missing synthetic payment periods');
  const periods=a.payment_periods.map(period=>{
   if(!period||typeof period.fixture_partner_id!=='string'||!idPattern.test(period.fixture_partner_id))throw new TypeError('Only synthetic payment partner IDs permitted');
   const start=isoDate(period.start_date),end=isoDate(period.end_exclusive);
   if(start>=end)throw new RangeError('Payment period must be positive');
   payees.add(period.fixture_partner_id);
   return {start,end};
  }).sort((a,b)=>a.start-b.start);
  for(let i=1;i<periods.length;i++)if(periods[i].start<periods[i-1].end)throw new RangeError('Overlapping synthetic payee intervals');
  if(periods.length>1)transferApps++;
 }
 return {synthetic_game_appids:appIds.size,distinct_display_developer_labels:developers.size,
  distinct_display_publisher_labels:publishers.size,distinct_creator_homepages:homepages.size,
  distinct_franchise_pages:franchises.size,fixture_payee_identifiers:payees.size,
  multiple_developer_label_apps:multiDeveloperApps,appid_with_multiple_payment_periods:transferApps,
  actual_legal_publishers:null,actual_developer_headcount:null,actual_first_game_studios:null,
  actual_publisher_receipts_usd:null,actual_publisher_profit_usd:null,
  legal_partner_count_inferred_from_names:false,
  note:'Synthetic labels and time-scoped payment IDs only. Public storefront labels and creator pages cannot identify real legal payees or earnings.'};
}

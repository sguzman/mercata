// Deterministic study-design QA with synthetic tests. Inputs have NOT been independently authenticated.
// NEVER send private ledger rows or API credentials to a public repository.
const good=n=>Number.isSafeInteger(n)&&n>=0;
const STATES=new Set(['complete_reconciled','partial','missing']);
const ELIGIBILITY=new Set(['eligible_paid_initially','ineligible_initially_free','unresolved']);
export function auditLedgerCoverage(rows,{frameComplete=false}={}){
 if(!Array.isArray(rows)||typeof frameComplete!=='boolean')throw new TypeError('Invalid frame');
 const seen=new Set(),counts={eligible:0,ineligible:0,unresolved_eligibility:0,complete:0,partial:0,missing:0,observed_gross_zero:0,known_gross_nonzero:0,unknown_zero:0,retired_eligible:0};
 for(const x of rows){
  if(!x||!good(x.appid)||x.appid===0||seen.has(x.appid))throw new TypeError('Missing or duplicate AppID');
  seen.add(x.appid);
  if(!ELIGIBILITY.has(x.eligibility))throw new TypeError('Unrecognized initial paid eligibility');
  if(x.eligibility==='ineligible_initially_free'){counts.ineligible++;continue;}
  if(x.eligibility==='unresolved'){counts.unresolved_eligibility++;continue;}
  counts.eligible++;
  if(x.retired===true)counts.retired_eligible++;
  if(!STATES.has(x.ledger_status))throw new TypeError('Unknown ledger status');
  if(x.ledger_status==='missing'){
   if(x.gross_paid_units!==null&&x.gross_paid_units!==undefined)throw new TypeError('Missing ledger cannot imply paid units');
   counts.missing++;counts.unknown_zero++;continue;
  }
  if(!good(x.gross_paid_units))throw new TypeError('An observed ledger needs valid gross paid units');
  if(x.ledger_status==='complete_reconciled'){
   if(x.transfer_history_reconciled!==true||x.authorized_ledger_attested!==true||
    x.paid_checkout_attribution_attested!==true)
    throw new TypeError('Complete ledgers require transfer, access and checkout attribution attestations');
   counts.complete++;
  }else counts.partial++;
  if(x.gross_paid_units>0){
   if(x.paid_checkout_attribution_attested!==true)
    throw new TypeError('Positive gross paid game units require verified package-to-game attribution');
   counts.known_gross_nonzero++;
  }
  else if(x.ledger_status==='complete_reconciled')counts.observed_gross_zero++;
  else counts.unknown_zero++;
 }
 const frameUsable=frameComplete&&counts.unresolved_eligibility===0&&counts.eligible>0;
 const lower=frameUsable?counts.observed_gross_zero/counts.eligible:null;
 const upper=frameUsable?(counts.observed_gross_zero+counts.unknown_zero)/counts.eligible:null;
 return {candidate_appids:rows.length,counts,frame_complete_attested:frameComplete,
  zero_gross_unit_share_lower_conditional:lower,zero_gross_unit_share_upper_conditional:upper,
  exact_zero_gross_unit_share:null,publisher_net_income_median:null,after_cost_profit_median:null,
  actually_verified_by_mercata:false,real_data_collected_by_mercata:false,
  primary_appid_alone_is_not_paid_game_checkout_attribution:true,
  caveat:'Fractions are hypothetical conditional bounds over a supplied eligible AppID frame, not validated global Steam estimates.'};
}


// Invented day-aligned paid-release cohorts only: never input merchant financial data.
const iso=x=>{if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const d=new Date(x+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===x;};
const plus=(x,n)=>{const d=new Date(x+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const allowed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
const rowKeys=['fixture_game_id','eligibility','first_paid_playable_date','ledger_status','observed_gross_paid_units',
 'covered_from_day','covered_until_day_exclusive','transfer_history_reconciled','authorized_ledger_attested','retired',
 'paid_checkout_attribution_attested'];
export function auditSyntheticFixedHorizonZeroSales(rows,opts={}){
 if(!Array.isArray(rows)||!allowed(opts,['start','endExclusive','asOfDate','horizonDays','frameComplete']))
  throw new TypeError('Invalid fixed-horizon fixture or options');
 const {start,endExclusive,asOfDate,horizonDays,frameComplete=false}=opts;
 if(!iso(start)||!iso(endExclusive)||start>=endExclusive||!iso(asOfDate)||
  ![30,90,365].includes(horizonDays)||typeof frameComplete!=='boolean')
  throw new TypeError('Invalid fixed-horizon dates, period or frame flag');
 const ids=new Set(),entries=[],counts={eligible:0,excluded:0,unresolved_eligibility:0,
  matured_eligible:0,right_censored_eligible:0,confirmed_zero:0,known_nonzero:0,unknown_zero:0};
 for(const r of rows){
  if(!allowed(r,rowKeys)||typeof r.fixture_game_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(r.fixture_game_id)||ids.has(r.fixture_game_id))
   throw new TypeError('Unique synthetic fixture with permitted fields required');
  ids.add(r.fixture_game_id);
  if(!['eligible_paid_initially','ineligible_initially_free','unresolved'].includes(r.eligibility))
   throw new TypeError('Invalid initial paid status');
  const date=r.first_paid_playable_date;
  if(date!==undefined&&date!==null&&!iso(date))throw new TypeError('Invalid original paid release date');
  if(r.retired!==undefined&&typeof r.retired!=='boolean')throw new TypeError('Invalid retirement status');
  const hasReport=r.ledger_status!==undefined||r.observed_gross_paid_units!==undefined||
   r.covered_from_day!==undefined||r.covered_until_day_exclusive!==undefined;
  if(r.eligibility!=='eligible_paid_initially'||!date){
   if(hasReport)throw new RangeError('Unresolved or initially free game cannot supply paid game report');
   const excluded=r.eligibility==='ineligible_initially_free';
   counts[excluded?'excluded':'unresolved_eligibility']++;
   entries.push({fixture_game_id:r.fixture_game_id,zero_status:excluded?'excluded':'unresolved'});continue;
  }
  if(date<start||date>=endExclusive){
   if(hasReport)throw new RangeError('Out-of-cohort game cannot supply sales report');
   counts.excluded++;entries.push({fixture_game_id:r.fixture_game_id,zero_status:'excluded'});continue;
  }
  if(date>asOfDate)throw new RangeError('Future paid release cannot have observed financial history');
  counts.eligible++;
  const end=plus(date,horizonDays),matured=end<=plus(asOfDate,1);
  counts[matured?'matured_eligible':'right_censored_eligible']++;
  let zero_status='unknown';
  if(r.ledger_status==='missing'){
   if((r.observed_gross_paid_units!==undefined&&r.observed_gross_paid_units!==null)||
    r.covered_from_day!==undefined||r.covered_until_day_exclusive!==undefined||
    r.authorized_ledger_attested===true||r.transfer_history_reconciled===true)
    throw new RangeError('Missing ledger cannot imply observed sales or coverage');
  }else if(r.ledger_status==='partial'||r.ledger_status==='complete_reconciled'){
   if(!good(r.observed_gross_paid_units)||!iso(r.covered_from_day)||!iso(r.covered_until_day_exclusive)||
    r.covered_from_day>=r.covered_until_day_exclusive)
    throw new TypeError('Observed report needs safe gross units and bounded dates');
   if(r.ledger_status==='complete_reconciled'){
    if(!matured||r.covered_from_day!==date||r.covered_until_day_exclusive!==end||
     r.authorized_ledger_attested!==true||r.transfer_history_reconciled!==true||
     r.paid_checkout_attribution_attested!==true)
     throw new RangeError('Complete ledger needs matured exact horizon and transfer/access attestations');
    zero_status=r.observed_gross_paid_units===0?'confirmed_zero':'known_nonzero';
   }else{
    if(r.covered_from_day<date||r.covered_until_day_exclusive>end||
     r.covered_until_day_exclusive>plus(asOfDate,1))
     throw new RangeError('Partial report must lie within elapsed paid release horizon');
    if(r.observed_gross_paid_units>0){
     if(r.paid_checkout_attribution_attested!==true)
      throw new RangeError('Positive partial paid game units require verified package-to-game attribution');
     zero_status='known_nonzero';
    }
   }
  }else throw new TypeError('Explicit complete, partial or missing ledger state required');
  counts[zero_status==='unknown'?'unknown_zero':zero_status]++;
  entries.push({fixture_game_id:r.fixture_game_id,zero_status,matured,horizon_end_exclusive:end});
 }
 const qualified=frameComplete&&counts.unresolved_eligibility===0&&counts.eligible>0;
 return {kind:'synthetic_fixed_horizon_zero_paid_order_sensitivity_not_empirical_study',
  day_aligned_not_exact_launch_time:true,cohort_start:start,cohort_end_exclusive:endExclusive,
  as_of_date:asOfDate,horizon_days:horizonDays,counts,entries,
  frame_complete_attested_not_verified:frameComplete,
  conditional_zero_share_lower:qualified?counts.confirmed_zero/counts.eligible:null,
  conditional_zero_share_upper:qualified?(counts.confirmed_zero+counts.unknown_zero)/counts.eligible:null,
  conditional_zero_share_point_identified:qualified&&counts.unknown_zero===0,
  actual_steam_zero_paid_order_share:null,actual_publisher_income_median:null,actual_ledger_records_used:false,
  primary_appid_by_itself_proves_paid_game_units:false,
  limitation:'Fictitious fixtures only. Real original-paid frame, merchant reports, transfer permissions and late corrections remain unavailable.'};
}

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
   if(x.transfer_history_reconciled!==true||x.authorized_ledger_attested!==true)throw new TypeError('Complete ledgers require transfer and access attestations');
   counts.complete++;
  }else counts.partial++;
  if(x.gross_paid_units>0)counts.known_gross_nonzero++;
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
  caveat:'Fractions are hypothetical conditional bounds over a supplied eligible AppID frame, not validated global Steam estimates.'};
}

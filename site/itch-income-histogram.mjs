// Private-data-free aggregation for consented, uniformly scoped FIRST paid-game launch cohorts.
// No personal seller or buyer rows may be supplied or exported.
const nonnegativeInt=x=>Number.isSafeInteger(x)&&x>=0;
const expectedKeys=['owner_authorized','aggregated_only','research_redistribution_allowed',
 'publisher_definition','cohort_days','currency_unit','eligible_publishers','covered_publishers',
 'includes_zero_sale_publishers','includes_delisted_publishers','bins'];
function ensureOwnKeys(obj,keys){
 for(const k of Object.keys(obj))if(!keys.includes(k))
  throw new TypeError('Unsupported or potentially identifying field: '+k);
}
export function describeProceedsHistogram(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Aggregate report required');
 ensureOwnKeys(input,expectedKeys);
 if(input.owner_authorized!==true||input.aggregated_only!==true||
   input.research_redistribution_allowed!==true)throw new Error('Explicit consent and aggregate redistribution required');
 if(input.publisher_definition!=='first_positive_price_game_publisher' ||
   ![30,90,365].includes(input.cohort_days)||input.currency_unit!=='settled_net_proceeds_cents')
   throw new Error('Unsupported seller population, observation horizon or money unit');
 if(!nonnegativeInt(input.eligible_publishers)||!nonnegativeInt(input.covered_publishers)||
   !input.eligible_publishers||!input.covered_publishers||
   input.covered_publishers>input.eligible_publishers)
   throw new RangeError('Invalid eligibility and coverage');
 if(!Array.isArray(input.bins)||input.bins.length<2)throw new TypeError('At least two histogram cells required');
 let cumulative=0,lower=0;
 const normalized=[];
 for(let i=0;i<input.bins.length;i++){
  const b=input.bins[i];if(!b||typeof b!=='object'||Array.isArray(b))
   throw new TypeError('Invalid aggregate bin');
  ensureOwnKeys(b,['lower_cents','upper_exclusive_cents','count']);
  if(!nonnegativeInt(b.lower_cents)||b.lower_cents!==lower||
    !nonnegativeInt(b.count)||b.count>input.covered_publishers)
   throw new RangeError('Bins must be contiguous, ordered and have valid integer counts');
  // Each positive cell must contain >=5 publishers before public redistribution.
  if(b.count>0&&b.count<5)throw new Error('Cell below minimum privacy grouping size 5');
  const upper=b.upper_exclusive_cents;
  if(upper===null){
   if(i!==input.bins.length-1)throw new RangeError('Open-ended income bin must be last');
  } else if(!nonnegativeInt(upper)||upper<=lower)throw new RangeError('Invalid bin upper boundary');
  normalized.push({lower_cents:lower,upper_exclusive_cents:upper,count:b.count,start_rank:cumulative});
  cumulative+=b.count;
  lower=upper;
 }
 if(cumulative!==input.covered_publishers)throw new RangeError('Histogram count does not match covered publishers');
 const complete=input.covered_publishers===input.eligible_publishers &&
   input.includes_zero_sale_publishers===true && input.includes_delisted_publishers===true;
 const findRank=(r)=>{
  const b=normalized.find(b=>r>=b.start_rank&&r<b.start_rank+b.count);
  if(!b)throw new RangeError('Invalid quantile rank');
  return {lower_cents:b.lower_cents,upper_exclusive_cents:b.upper_exclusive_cents};
 };
 const lowerMiddle=findRank(Math.floor((cumulative-1)/2));
 const upperMiddle=findRank(Math.floor(cumulative/2));
 const first=normalized[0];
 const exactZero=(first.lower_cents===0&&first.upper_exclusive_cents===1);
 // Partial identification is valid only within an explicitly enumerated eligible
 // cohort and when missing publishers could independently all be zero or nonzero.
 // The reported inclusion of delisted and zero-sale publishers is a declaration,
 // not independent verification of the owner-provided eligible frame.
 const eligibleFrameClaimed=input.includes_zero_sale_publishers===true&&input.includes_delisted_publishers===true;
 const eligibleZeroBound=exactZero&&eligibleFrameClaimed;
 const unobserved=input.eligible_publishers-input.covered_publishers;
 return {sample_count:cumulative,sample_frame_complete:complete,
  cohort_zero_proceeds_lower_bound:eligibleZeroBound?first.count/input.eligible_publishers:null,
  cohort_zero_proceeds_upper_bound:eligibleZeroBound?(first.count+unobserved)/input.eligible_publishers:null,
  eligible_cohort_complete_from_input_claims:eligibleZeroBound&&unobserved===0,
  sample_exact_zero_proceeds_fraction:complete&&exactZero?first.count/cumulative:null,
  sample_median_lower_bound_cents:complete?lowerMiddle.lower_cents:null,
  sample_median_upper_exclusive_cents:complete?upperMiddle.upper_exclusive_cents:null,
  sample_mean_net_proceeds_cents:null,platform_median_net_proceeds_cents:null,
  platform_zero_earner_fraction:null,platform_mean_net_proceeds_cents:null,
  developer_profit_cents:null,causal_sales_effect:null,
  identified_people:0,buyer_records:0,representative_inference:false,
  note:'Only bounded descriptive statistics for a fully covered, voluntarily authorized and non-identifying grouped cohort; not itch.io-wide results.'};
}

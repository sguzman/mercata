// The sample's values are illustrative/publicly described aggregate-style inputs.
// This is NOT a legal publisher contract, game transaction report or wage model.
const count=n=>Number.isSafeInteger(n)&&n>=0;
const day=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
export function auditSyntheticSteamEarlyAccessDisclosure(x){
 const allowed=['fixture_id','first_paid_date','version_one_date','units_reported',
  'reported_after_some_deductions_cents','wishlists_at_v1','wishlists_after_year',
  'separate_external_publisher_named'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!allowed.includes(k))||
 typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError('Only labeled synthetic public aggregate inputs accepted');
 if(!day(x.first_paid_date)||!day(x.version_one_date)||x.version_one_date<=x.first_paid_date)
  throw new RangeError('Early Access must precede 1.0 with valid exact dates');
 for(const k of ['units_reported','reported_after_some_deductions_cents','wishlists_at_v1','wishlists_after_year'])
  if(!count(x[k]))throw new TypeError('Unverified or invalid count: '+k);
 if(x.separate_external_publisher_named!==true)
  throw new TypeError('Distinct public publisher role must not be erased');
 return {
  first_paid_at:x.first_paid_date,version_one_at:x.version_one_date,
  version_one_is_second_initial_paid_launch:false,
  reported_units:x.units_reported,reported_after_deductions_usd:x.reported_after_some_deductions_cents/100,
  descriptive_amount_per_unit_usd:x.units_reported?x.reported_after_some_deductions_cents/100/x.units_reported:null,
  outstanding_wishlist_balance_change:x.wishlists_after_year-x.wishlists_at_v1,
  wishlist_change_equals_new_buyers:false,
  author_bank_deposit_usd:null,publisher_royalty_share:null,
  actual_hourly_wage:null,first_paid_launch_revenue:null,
  post_v1_paid_orders:null,zero_paid_sale_fraction:null,
  causal_early_access_gain:null};
}

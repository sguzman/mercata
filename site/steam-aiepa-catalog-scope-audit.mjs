// Count-scope only: third-party raw catalogue, strict filtered records and price proxies.
// The input is SYNTHETIC and deliberately cannot contain game IDs or financial records.
const whole=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticSteamCatalogScopes(input){
 const keys=["fixture_id","raw_2024","raw_2025","strict_2024","strict_2025","shared_raw",
   "only_2024_raw","only_2025_raw","free_tier","budget_tier","mid_tier","aaa_tier"];
 if(!input||typeof input!=="object"||Array.isArray(input)||
    Object.keys(input).some(k=>!keys.includes(k))||
    typeof input.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id))
  throw new TypeError("Only named synthetic catalogue aggregates accepted");
 for(const k of keys.filter(x=>x!=="fixture_id"))
  if(!whole(input[k]))throw new TypeError("Invalid nonnegative catalog count: "+k);
 if(input.strict_2024>input.raw_2024||input.strict_2025>input.raw_2025)
  throw new RangeError("Strict subset exceeds raw catalogue");
 if(input.shared_raw+input.only_2024_raw!==input.raw_2024||
    input.shared_raw+input.only_2025_raw!==input.raw_2025)
  throw new RangeError("Raw snapshot intersection/unique counts do not partition");
 if(["free_tier","budget_tier","mid_tier","aaa_tier"].reduce((s,k)=>s+input[k],0)!==input.strict_2025)
  throw new RangeError("Tier partition must match March strict filtered sample");
 return {
   raw_2024:input.raw_2024,raw_2025:input.raw_2025,
   strict_2024:input.strict_2024,strict_2025:input.strict_2025,
   raw_2024_excluded:input.raw_2024-input.strict_2024,
   raw_2025_excluded:input.raw_2025-input.strict_2025,
   shared_raw:input.shared_raw,
   reported_shared_raw_exceeds_smaller_strict_sample:input.shared_raw>Math.min(input.strict_2024,input.strict_2025),
   strict_intersection_not_identified:true,
   true_delistings:null,paid_first_release_population:null,
   zero_actual_paid_sales_fraction:null,actual_publisher_revenue:null,
   actual_developer_profit:null
 };
}

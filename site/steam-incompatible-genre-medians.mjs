// Compare two differently-selected published aggregate estimates. No game rows.
const positive=n=>Number.isSafeInteger(n)&&n>0;
export function compareSyntheticSteamGenreModels(x){
 const fields=["fixture_id","provider_a_total_rows","provider_a_tag_rows","provider_a_median_usd",
  "provider_b_tag_rows","provider_b_median_usd","same_eligible_appids"];
 if(!x||typeof x!=="object"||Array.isArray(x)||Object.keys(x).some(k=>!fields.includes(k))||
  typeof x.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError("Only synthetic aggregate model comparisons permitted");
 for(const k of fields.filter(y=>!["fixture_id","same_eligible_appids"].includes(y)))
  if(!positive(x[k]))throw new TypeError("Positive integer aggregate expected: "+k);
 if(x.provider_a_tag_rows>x.provider_a_total_rows||x.same_eligible_appids!==false)
  throw new RangeError("Cross-source eligibility is explicitly unmatched");
 return {provider_a_tag_rows:x.provider_a_tag_rows,provider_b_tag_rows:x.provider_b_tag_rows,
  nominal_median_ratio:x.provider_a_median_usd/x.provider_b_median_usd,
  matched_game_population:false,game_sample_overlap_count:null,
  actual_paid_game_median:null,causal_genre_effect:null,
  zero_paid_order_fraction:null,developer_after_cost_profit:null};
}

// An audit of disclosed PUBLIC event-month statistics, never actual partner round usage.
const safe=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticSteamMajorUpdateCohort(x){
 const allowed=["fixture_id","total_games","no_major_month","one_major_month","two_major_month",
  "three_or_four_major_month","five_plus_major_month",
  "observed_major_months","reported_unique_games_later","reported_unique_games_earlier",
  "selected_firstyear_review_floor","same_underlying_cohort"];
 if(!x||typeof x!=="object"||Array.isArray(x)||Object.keys(x).some(k=>!allowed.includes(k))||
   typeof x.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError("Only synthetic cohort-event counts accepted");
 for(const k of allowed.filter(y=>!["fixture_id","same_underlying_cohort"].includes(y)))
  if(!safe(x[k]))throw new TypeError("Invalid event count or selection floor: "+k);
 if(x.same_underlying_cohort!==true||x.selected_firstyear_review_floor<1)
  throw new TypeError("Selection and shared dataset must remain explicit");
 const bins=["no_major_month","one_major_month","two_major_month","three_or_four_major_month","five_plus_major_month"];
 const sum=bins.reduce((a,k)=>a+x[k],0);
 if(sum!==x.total_games)throw new RangeError("Event month categories fail to partition cohort");
 if(x.reported_unique_games_earlier>x.total_games||x.reported_unique_games_later>x.total_games||
  x.reported_unique_games_earlier>x.observed_major_months||x.reported_unique_games_later>x.observed_major_months)
  throw new RangeError("Unique contributing games cannot exceed games or event months");
 return {selected_cohort_games:x.total_games,games_with_no_major_month:x.no_major_month,
   games_with_at_most_one_major_month:x.no_major_month+x.one_major_month,
   observed_announcement_months:x.observed_major_months,
   earlier_article_contributing_games:x.reported_unique_games_earlier,
   later_article_contributing_games:x.reported_unique_games_later,
   contributors_identified_under_one_common_eligibility_rule:null,
   independently_sampled_datasets:1,
   actual_round_activations:null,rounds_remaining:null,
   causal_review_lift:null,paid_sale_lift:null,after_cost_income:null};
}

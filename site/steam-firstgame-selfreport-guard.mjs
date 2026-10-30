// A single public author disclosure; never a merchant ledger or earnings estimator.
const safeNonnegative=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticFirstGameDisclosure(x){
 if(!x||typeof x!=="object"||Array.isArray(x)||
   Object.keys(x).some(k=>!["fixture_id","cumulative_gross_usd_cents","cumulative_reported_copies",
      "firstmonth_reviews","cumulative_window","review_window"].includes(k))||
   typeof x.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError("Only labeled synthetic first-game observations and permitted fields accepted");
 for(const k of ["cumulative_gross_usd_cents","cumulative_reported_copies","firstmonth_reviews"])
  if(!safeNonnegative(x[k]))throw new TypeError("Invalid synthetic count or cents: "+k);
 const windows=["first_month","through_publication"];
 if(!windows.includes(x.cumulative_window)||!windows.includes(x.review_window))
  throw new RangeError("Unrecognized observation period");
 const sameWindow=x.cumulative_window===x.review_window;
 return {
  fixture_id:x.fixture_id,synthetic:true,
  reported_gross_usd:x.cumulative_gross_usd_cents/100,
  reported_copies:x.cumulative_reported_copies,
  approximate_gross_per_reported_copy_usd:x.cumulative_reported_copies?
   x.cumulative_gross_usd_cents/100/x.cumulative_reported_copies:null,
  review_and_sale_windows_match:sameWindow,
  reviews_per_reported_copy_if_windows_match:sameWindow&&x.cumulative_reported_copies?
   x.firstmonth_reviews/x.cumulative_reported_copies:null,
  gross_per_unit_is_author_income:false,
  signed_publisher_share:null,reported_bank_deposit:null,
  after_cost_profit:null,verified_work_hours:null,
  hourly_wage:null,population_developer_median:null,
  observed_zero_sale_fraction:null
 };
}

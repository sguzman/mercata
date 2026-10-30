// Pure synthetic recreation of IndieList's public v1.0 heuristic, not a sales predictor.
// No real AppIDs, account identifiers, transaction rows, or merchant ledgers accepted.
const allowed=new Set(['fixture_id','reviews','release_year','price_usd_cents','positive_pct','studio_size','genre']);
const teams={solo:-10,small:0,medium:10,large:15,tripleI:20,unknown:0};
const genres={casual:-15,hyper:-15,rpg:10,adventure:10,other:0};
export function auditSyntheticReviewlessEstimation(row){
 if(!row||Array.isArray(row)||typeof row!=='object'||Object.keys(row).some(k=>!allowed.has(k))||
  typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
  !Number.isSafeInteger(row.reviews)||row.reviews<0||row.reviews>100000||
  !(row.release_year===null||Number.isSafeInteger(row.release_year)&&row.release_year>=1980&&row.release_year<=2100)||
  !(row.price_usd_cents===null||Number.isSafeInteger(row.price_usd_cents)&&row.price_usd_cents>0&&row.price_usd_cents<=100000)||
  !(row.positive_pct===null||Number.isSafeInteger(row.positive_pct)&&row.positive_pct>=0&&row.positive_pct<=100)||
  !Object.hasOwn(teams,row.studio_size)||!Object.hasOwn(genres,row.genre))
  throw new TypeError('Expected a bounded, explicitly synthetic review-based estimator fixture');
 const price=(row.price_usd_cents??1500)/100;
 const positivity=row.positive_pct??80;
 const yearAdj=row.release_year===null?0:row.release_year<2018?30:row.release_year<=2021?15:row.release_year<=2024?0:-10;
 const priceAdj=price<5?-20:price<10?-5:price<20?0:price<30?5:15;
 const scoreAdj=positivity<70?-10:positivity<85?0:10;
 const nb=Math.max(15,Math.min(150,50+yearAdj+priceAdj+scoreAdj+teams[row.studio_size]+genres[row.genre]));
 const hasSignal=row.reviews>0;
 const units=hasSignal?row.reviews*nb:null;
 return Object.freeze({
  estimator_status:hasSignal?'modeled_from_review_signal':'excluded_no_reviews',
  review_signal_present:hasSignal,additive_multiplier_nb:nb,
  synthetic_estimated_units:units,
  synthetic_fixed_lower_units:units===null?null:units*0.6,
  synthetic_fixed_upper_units:units===null?null:units*1.4,
  synthetic_net_revenue_usd_heuristic:units===null?null:units*price*0.5712,
  modeled_range_is_calibrated_interval:false,
  authenticated_paid_orders:null,actual_zero_paid_sale_app_fraction:null,
  publisher_bank_cash_usd:null,after_cost_profit_usd:null,
  measured_prediction_error:null
 });
}

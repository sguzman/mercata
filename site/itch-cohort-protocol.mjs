// Aggregate-only, opt-in cohort research helper. No buyer IDs or seller IDs.
const number=x=>Number.isSafeInteger(x)&&x>=0;
const fraction=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1;
export function analyzeSellerCohort(report){
 if(!report || typeof report!=='object')throw new TypeError('Aggregate cohort report required');
 if(report.owner_authorized!==true || report.aggregated_only!==true ||
   report.research_redistribution_allowed!==true)throw new Error('Owner authorization, aggregation and research permission required');
 if(![30,90,365].includes(report.followup_days) ||
   report.publisher_definition!=='first_commercial_game_seller' ||
   report.proceeds_unit!=='settled_net_seller_proceeds_cents')
   throw new Error('Incompatible cohort frame, followup horizon or revenue unit');
 if(!number(report.eligible_publishers) ||report.eligible_publishers===0||
   !number(report.covered_publishers)||report.covered_publishers>report.eligible_publishers||
   !number(report.zero_proceeds_publishers)||report.zero_proceeds_publishers>report.covered_publishers||
   !number(report.settled_net_proceeds_cents))
   throw new Error('Invalid cohort counts or proceeds');
 const complete=report.covered_publishers===report.eligible_publishers &&
   report.includes_zero_sale_publishers===true &&
   report.includes_delisted_publishers===true;
 // Even a complete selected participant sample is not representative of itch.io.
 return {sample_coverage_complete:complete,observed_sample_size:report.covered_publishers,
   sample_zero_proceeds_fraction:complete?report.zero_proceeds_publishers/report.covered_publishers:null,
   sample_mean_seller_net_proceeds_cents:complete?report.settled_net_proceeds_cents/report.covered_publishers:null,
   sample_median_seller_net_proceeds_cents:null,
   platform_mean_seller_net_proceeds_cents:null,platform_median_seller_net_proceeds_cents:null,
   platform_zero_earner_fraction:null,developer_profit_cents:null,
   confidence_interval:null,real_population_inference:false,
   note:'Only descriptive statistics of a permissioned fully covered cohort. Not a representative platform estimate.'};
}
export function describePurchaseEvents(report){
 if(!report||report.owner_authorized!==true||report.aggregated_only!==true||
   report.same_game_and_period!==true)throw new Error('Authorized aligned game and period aggregates required');
 for(const key of ['page_views','browser_plays','free_demo_downloads','settled_paid_orders','refunded_orders'])
   if(!number(report[key]))throw new TypeError('Invalid event count: '+key);
 if(report.refunded_orders>report.settled_paid_orders)
   throw new RangeError('Refunded orders exceed settled orders for specified convention');
 return {page_view_events:report.page_views,
   settled_paid_orders:report.settled_paid_orders,
   order_events_per_page_view:report.page_views>0?report.settled_paid_orders/report.page_views:null,
   buyer_conversion_probability:null,unique_paying_buyers:null,first_sale_probability:null,
   causal_discovery_effect:null,actual_seller_profit:null,
   note:'An event rate is not a per-person buyer conversion probability.'};
}

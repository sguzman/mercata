// Published Top Sellers components and invented amounts, never a recreation of Valve's hidden ranking score.
const amt=n=>Number.isSafeInteger(n)&&n>=0;
const classes=['base','dlc','microtransactions'],meta=['fixture_id','product_type','chart_scope','prior_21h_spend_cents','latest_3h_spend_cents','partner_sales_attribution_verified','public_rank_observed'];
const allowed=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>keys.includes(k));
function sumSpend(c){
 if(!allowed(c,classes)||Object.keys(c).length!==classes.length)throw new TypeError('Exactly three spending categories required');
 let total=0;
 for(const k of classes){if(!amt(c[k]))throw new TypeError('Synthetic spending must be nonnegative safe integer cents');total+=c[k];if(!Number.isSafeInteger(total))throw new RangeError('Unsafe spending sum');}
 return total;
}
export function auditSyntheticSteamTopSellerComponents(x){
 if(!allowed(x,meta)||typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id)||
  !['premium','free_to_play'].includes(x.product_type)||!['global','territory'].includes(x.chart_scope))
  throw new TypeError('Only synthetic bounded public chart fixtures permitted');
 if(x.partner_sales_attribution_verified!==false||x.public_rank_observed!==false)
  throw new TypeError('Real merchant attribution and rank observations were not provided');
 const before=sumSpend(x.prior_21h_spend_cents),recent=sumSpend(x.latest_3h_spend_cents),total=before+recent;
 if(!Number.isSafeInteger(total))throw new RangeError('Unsafe 24h spending total');
 const totals=Object.fromEntries(classes.map(k=>[k,x.prior_21h_spend_cents[k]+x.latest_3h_spend_cents[k]]));
 if(Object.values(totals).some(n=>!Number.isSafeInteger(n)))throw new RangeError('Unsafe spending category total');
 return {kind:'hypothetical_unweighted_24h_spend_components_not_steam_rank_or_paid_units',
  product_type:x.product_type,chart_scope:x.chart_scope,
  prior_21h_spend_cents:before,recent_3h_spend_cents:recent,
  unweighted_24h_spend_cents:total,spend_components_cents:totals,
  recent_3h_has_extra_steam_chart_weight:true,extra_steam_weight_coefficient:null,
  total_is_publisher_payout:false,chart_compares_paid_base_game_units:false,
  actual_position_on_top_sellers:null,base_game_paid_units:null,
  country_specific_rank:null,refunded_net_partner_revenue:null,unique_paying_customers:null,
  publisher_profit:null,
  caveat:'Unweighted invented cents only. Valve adds unknown recent-spend weight. Chart placement may reflect account filters and territory and is not a count of paid base-game orders or a financial statement.'};
}

// Public aggregated play events, Steam wishlists and paid orders cannot be matched across stores.
const n=v=>Number.isSafeInteger(v)&&v>=0;
export function auditSyntheticSteamExternalDemoConversion(x){
 const keys=['total_steam_copies','steam_gross_usd','first_day_copies_approx','launch_wishlist_stock_approx',
 'later_outstanding_wishlist_stock_approx','author_reported_wishlist_conversion_pct_approx',
 'itch_browser_demo_plays_more_than','itch_demo_plays_are_verified_unique_players','itch_to_steam_user_link_available',
 'authenticated_paid_sale_export','paid_bank_receipt_verified'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
  throw new TypeError('Only public game-level aggregate inputs permitted');
 for(const k of keys.slice(0,5).concat(keys.slice(6,7)))if(!n(x[k]))throw new TypeError('Invalid public count or dollar aggregate');
 if(typeof x.author_reported_wishlist_conversion_pct_approx!=='number'||
  !Number.isFinite(x.author_reported_wishlist_conversion_pct_approx)||
  x.author_reported_wishlist_conversion_pct_approx<0||x.author_reported_wishlist_conversion_pct_approx>100)
  throw new TypeError('Invalid author-reported percentage');
 if(x.first_day_copies_approx>x.total_steam_copies)throw new RangeError('First-day reported copies exceed all reported copies');
 for(const k of keys.slice(7))if(x[k]!==false)
  throw new TypeError('No unique browser players, cross-site identity joins or merchant receipts were independently verified');
 return {kind:'unlinked_external_browser_demo_and_steam_orders_not_causal_conversion',
  steam_copies_reported:x.total_steam_copies,steam_gross_usd_reported:x.steam_gross_usd,
  first_day_copies_approx:x.first_day_copies_approx,
  itch_browser_demo_events_more_than:x.itch_browser_demo_plays_more_than,
  steam_launch_wishlist_stock_approx:x.launch_wishlist_stock_approx,
  steam_later_outstanding_wishlist_stock_approx:x.later_outstanding_wishlist_stock_approx,
  author_described_wishlist_conversion_percent:x.author_reported_wishlist_conversion_pct_approx,
  browser_demo_plays_are_unique_users:false,steam_sales_divided_by_itch_plays_is_verified_upgrade_rate:false,
  steam_sales_divided_by_launch_wishlist_stock_is_verified_wishlist_conversion:false,
  cross_site_paid_conversion:null,incremental_purchases_from_demo:null,
  independently_reconciled_steam_wishlist_purchase_rate:null,
  net_bank_receipt_usd:null,after_cost_profit_usd:null,
  caveat:'Play-event counts and purchase units may overlap neither in users nor time. A self-reported wishlist conversion field is not rederived from current stock or aggregate total orders.'};
}

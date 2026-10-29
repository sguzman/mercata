// Public developer-reported totals, not a Steam settlement or validated merchant financial statement.
const iso=s=>{
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;
 const v=Date.parse(s+'T00:00:00Z');
 return Number.isFinite(v)&&new Date(v).toISOString().slice(0,10)===s?v:null;
};
const nat=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSteamAuthorReportedNetStage(x){
 const fields=['released_date','post_date','copies_sold','copies_returned','gross_usd_cents','net_label_usd_cents',
 'launch_wishlists','after_launch_wishlists','price_usd_cents','source_states_net_after_steam_cut',
 'bank_receipt_attested','full_development_cost_attested'];
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!fields.includes(k)))
  throw new TypeError('Only public aggregate author fields are permitted');
 const a=iso(x.released_date),b=iso(x.post_date);
 if(a===null||b===null||b<a)throw new TypeError('Invalid case chronology');
 for(const field of fields.slice(2,9))if(!nat(x[field]))throw new TypeError('Invalid author-reported aggregate '+field);
 if(x.copies_sold===0||x.copies_returned>x.copies_sold||x.net_label_usd_cents>x.gross_usd_cents)
  throw new RangeError('Contradictory sales or dollar totals');
 if(x.source_states_net_after_steam_cut!==false||x.bank_receipt_attested!==false||x.full_development_cost_attested!==false)
  throw new TypeError('Financial share, actual bank credit and production-cost evidence are absent');
 const afterSimpleThirtyPercent=Math.round(x.gross_usd_cents*0.7);
 return {kind:'voluntary_firstgame_reported_gross_net_not_received_income',
  release_to_report_calendar_days:(b-a)/86400000,
  author_sold_units:x.copies_sold,author_returned_units:x.copies_returned,
  self_reported_returned_over_sold:x.copies_returned/x.copies_sold,
  author_gross_usd_cents:x.gross_usd_cents,author_net_label_usd_cents:x.net_label_usd_cents,
  illustrative_gross_times_seventy_percent_cents:afterSimpleThirtyPercent,
  author_net_label_exceeds_illustrative_seventy_percent:x.net_label_usd_cents>afterSimpleThirtyPercent,
  author_launch_wishlists:x.launch_wishlists,author_later_wishlists:x.after_launch_wishlists,
  author_net_proven_to_be_after_platform_share:false,actual_received_partner_usd_cents:null,
  matched_wishlist_purchase_rate:null,publisher_profit_after_labor:null,
  representative_firstgame_income:null,actual_zero_sale_fraction:null,
  caveat:'Simple 30% arithmetic is an illustration on a hypothetical common base, not an actual Steam contract waterfall; author net label does not prove payout. First-person two-week post is not a market cohort.'};
}

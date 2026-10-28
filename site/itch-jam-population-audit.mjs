// Public aggregate jam counters only. Never maps developer handles to real people or private accounts.
const validCount=(n)=>Number.isSafeInteger(n)&&n>=0;
export function auditItchJamActivityFrames(march,gtmk) {
 if(!march||!gtmk||!['jams','entries','identifiers','repeat_identifiers'].every(k=>validCount(march[k]))||
    !['joined_approx','entries_current','entries_previous'].every(k=>validCount(gtmk[k])))
  throw new TypeError('Nonnegative integer counts are required for each public observation');
 if(march.identifiers>march.entries||march.repeat_identifiers>march.identifiers)
  throw new RangeError('Independent creator and repeat-submitter counts exceed observed entries');
 if(gtmk.joined_approx<0||gtmk.entries_current<0||gtmk.entries_previous<0)
  throw new RangeError('Invalid jam activity counters');
 return Object.freeze({
  observed_march_submissions:march.entries,observed_distinct_submitter_identifiers:march.identifiers,
  observed_repeat_submitter_identifiers:march.repeat_identifiers,
  repeat_identifier_share_percent:march.identifiers?Number((100*march.repeat_identifiers/march.identifiers).toFixed(2)):null,
  current_gmtk_entry_count:gtmk.entries_current,earlier_secondary_gmtk_entry_count:gtmk.entries_previous,
  between_reported_counters_difference:gtmk.entries_previous-gtmk.entries_current,
  joined_accounts_rough_estimate:gtmk.joined_approx,
  verified_deleted_entries:null,unique_natural_persons:null,verified_active_paid_sellers:null,
  positive_price_paid_game_sales:null,platformwide_repeat_paid_creator_fraction:null,
  valid_to_infer_paid_seller_rate:false,
  note:'These are heterogeneous observed creator identifiers, game entries and joined accounts; not comparable seller or transaction denominators.'
 });
}

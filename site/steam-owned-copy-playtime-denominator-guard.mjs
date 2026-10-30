// Purely synthetic ownership/playtime fixtures. No real user IDs, AppIDs, sales or money inputs.
const allowed=new Set(['fixture_id','owned_copies','zero_minute_copies','launched_under_two_hours_copies']);
export function auditSyntheticOwnedCopyPlaytime(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!allowed.has(k))||
 typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
 !Number.isSafeInteger(row.owned_copies)||row.owned_copies<=0||
 !Number.isSafeInteger(row.zero_minute_copies)||row.zero_minute_copies<0||row.zero_minute_copies>row.owned_copies||
 !Number.isSafeInteger(row.launched_under_two_hours_copies)||row.launched_under_two_hours_copies<0||
 row.launched_under_two_hours_copies>row.owned_copies-row.zero_minute_copies)
 throw new TypeError('Expected bounded synthetic library-copy observations');
 const launched=row.owned_copies-row.zero_minute_copies;
 return Object.freeze({
  ownership_copy_denominator:row.owned_copies,launched_copy_denominator:launched,
  zero_playtime_share:row.zero_minute_copies/row.owned_copies,
  under_two_hours_given_launched_share:launched?row.launched_under_two_hours_copies/launched:null,
  actual_paid_order_count:null,first_paid_release_app_population:null,zero_paid_sale_fraction:null,
  verified_merchant_income:null,real_checkout_price:null,repeat_paid_customer_retention:null
 });
}

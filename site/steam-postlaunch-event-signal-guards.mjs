// Synthetic Steam marketing-event attention boundaries, never account analytics.
export const SIGNAL_UNITS=Object.freeze({
 event_impression:"unique_logged_in_user_event_visibility",
 event_read:"unique_logged_in_user_event_open",
 utm_returning_store_visitor:"returning_store_page_visitor",
 verified_return_play:"instrumented_gameplay_user_session_requires_permission",
 verified_paid_checkout:"authenticated_purchase_ledger_requires_permission"
});
export function classifySteamPostlaunchSignal(signal){
 if(typeof signal!=="string"||!Object.hasOwn(SIGNAL_UNITS,signal))
  throw new RangeError("Unknown Steam signal category");
 const attentionOnly=["event_impression","event_read","utm_returning_store_visitor"].includes(signal);
 return {signal,unit:SIGNAL_UNITS[signal],attention_only:attentionOnly,
  actual_retained_players:null,actual_paid_orders:null,developer_profit:null};
}
export function auditSyntheticSteamEventAttention(row){
 if(!row||typeof row!=="object"||Array.isArray(row)||
    Object.keys(row).some(k=>!["fixture_id","logged_in_impressions","logged_in_reads"].includes(k))||
    typeof row.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))
   throw new TypeError("Only labeled synthetic event-attention counts accepted");
 for(const k of ["logged_in_impressions","logged_in_reads"])
  if(!Number.isSafeInteger(row[k])||row[k]<0)throw new TypeError("Invalid synthetic event count: "+k);
 // Direct offsite reads can occur without Steam placement impressions.
 return {synthetic:true,logged_in_impressions:row.logged_in_impressions,
  logged_in_reads:row.logged_in_reads,reads_over_impressions_possible:row.logged_in_reads>row.logged_in_impressions,
  reads_to_impressions_purchase_conversion:null,actual_paid_orders:null,
  actual_retained_players:null,developer_profit:null};
}

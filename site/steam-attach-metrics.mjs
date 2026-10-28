// Deliberately hypothetical descriptive product-event ratios, never actual Steam transactions.
const good=n=>Number.isSafeInteger(n)&&n>=0;
export function classifyAddonRatios({baseOrders,dlcOrders,soundtrackOrders,uniqueBaseOwners=null,uniqueBaseDlcOwners=null}){
 if(![baseOrders,dlcOrders,soundtrackOrders].every(good))throw new TypeError('Invalid order counts');
 if((uniqueBaseOwners===null)!==(uniqueBaseDlcOwners===null))throw new TypeError('Both owner counts are required together');
 if(uniqueBaseOwners!==null&&(!good(uniqueBaseOwners)||!good(uniqueBaseDlcOwners)||uniqueBaseDlcOwners>uniqueBaseOwners))throw new TypeError('Invalid deduplicated owner counts');
 return {baseOrders,dlcOrders,soundtrackOrders,
  dlc_events_per_base_order:baseOrders===0?null:dlcOrders/baseOrders,
  soundtrack_events_per_base_order_NOT_OWNER_ATTACH:baseOrders===0?null:soundtrackOrders/baseOrders,
  deduplicated_base_owner_dlc_attach_fraction:uniqueBaseOwners===null||uniqueBaseOwners===0?null:uniqueBaseDlcOwners/uniqueBaseOwners,
  paid_game_copies_implied_by_music_order:0,verified_real_partner_sales:false,actual_developer_profit:null,
  warning:'Event counts differ from people. Music buyers may never own the game.'};
}

// Verified arithmetic over caller-supplied *synthetic* request/grant states, never real paid orders.
function nat(n,label){if(!Number.isSafeInteger(n)||n<0)throw new TypeError('Invalid '+label);}
export function boundSyntheticPlaytestActivation({requests,granted,activated,notActivated,unknownGranted,keyRecipientsIncluded=false}={}){
 for(const [k,v] of Object.entries({requests,granted,activated,notActivated,unknownGranted}))nat(v,k);
 if(requests===0||granted>requests)throw new RangeError('Invalid request frame');
 if(activated+notActivated+unknownGranted!==granted)throw new RangeError('Incomplete or overlapping grantee partition');
 if(keyRecipientsIncluded!==false)throw new RangeError('Outside-key recipients are not a random limited-signup cohort');
 return {requests,granted,unadmitted:requests-granted,activated_observed:activated,activation_unknown:unknownGranted,
  admitted_activation_min_fraction:granted?activated/granted:null,
  admitted_activation_max_fraction:granted?(activated+unknownGranted)/granted:null,
  request_to_grant_fraction:granted/requests,
  grant_is_paid_sale:false,random_sample_of_steam_users:false,
  real_game_purchase_conversion:null,real_game_sales:null,causal_sales_effect:null,developer_profit:null};
}
const parse=s=>{if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('Invalid ISO date');const ms=Date.parse(s+'T00:00:00.000Z');if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==s)throw new TypeError('Invalid ISO date');return ms;};
export function syntheticDemoNotification({firstPlayableDate,checkDate,previouslyTriggered=false}={}){
 const first=parse(firstPlayableDate),now=parse(checkDate);
 if(typeof previouslyTriggered!=='boolean')throw new TypeError('Invalid trigger status');
 return {eligible:!previouslyTriggered&&now>=first&&now<first+14*86400000,
  latest_eligible_date:new Date(first+13*86400000).toISOString().slice(0,10),
  resetting_demo_restarts_window:false,actual_sent_notifications:null,paid_orders:null};
}

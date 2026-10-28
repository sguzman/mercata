// A contractual/channel structure is not evidence about market demand.
export function comparePublicChannels(a,b){
 if(!a||!b||!['Steam','itch.io'].includes(a.name)||!['Steam','itch.io'].includes(b.name)||a.name===b.name)throw new TypeError('Two distinct supported channels required');
 if(!Number.isFinite(a.entryFee)||!Number.isFinite(b.entryFee)||a.entryFee<0||b.entryFee<0)throw new TypeError('Invalid fees');
 return {upfront_fee_difference_usd:a.entryFee-b.entryFee,known_merchant_profit_comparison:null,
  verified_customer_demand_lift:null,expected_net_receipts_delta:null,
  can_rank_by_earnings:false,requires:["matched buyer demand","refunds and taxes","fees and cross-channel payouts","owner rights and costs"],
  caveat:'Fee comparison is not a comparison of real game earnings.'};
}

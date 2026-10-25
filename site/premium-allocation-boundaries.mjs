// Source-bounded hypothetical accounting: no real subscriber or creator payout data.
const nonneg=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function classifyPremiumField(model,id){
 const x=model.authorized_api_fields.find(v=>v.metric===id);
 return x?{known:true,unit:x.unit,observed:null}:{known:false,unit:null,observed:null};
}
export function calculateFuturePremiumHypothetical(model,inputs){
 if(!inputs||typeof inputs!=='object')throw Error('Explicit hypothetical input required');
 if(!/^\\d{4}-\\d{2}$/.test(inputs.month||'')||inputs.month<'2027-02')
   throw Error('Announced 2027 Premium pool not yet effective for month');
 const pool=model.announced_2027.pools.find(x=>x.id===inputs.subscription_type);
 const format=model.announced_2027.creator_format_rates.find(x=>x.id===inputs.format);
 if(!pool||!format)throw Error('Unsupported subscription product or format');
 if(inputs.module_accepted!==true||inputs.content_eligible!==true)
   throw Error('Channel module and content eligibility not established');
 if(inputs.format==='shorts'&&inputs.rolling_shorts_gate_met!==true)
   throw Error('Announced rolling Shorts qualification missing');
 if(!/^[A-Z]{3}$/.test(inputs.currency||'')||!nonneg(inputs.net_subscription_revenue))
   throw Error('Missing valid currency or net subscription revenue');
 if(typeof inputs.creator_allocated_fraction!=='number'||!Number.isFinite(inputs.creator_allocated_fraction)||
 inputs.creator_allocated_fraction<0||inputs.creator_allocated_fraction>1)
   throw Error('Explicit creator allocation fraction required, never inferred from view counts');
 const poolRevenue=inputs.net_subscription_revenue*pool.share_of_net_subscriptions;
 const creatorAllocated=poolRevenue*inputs.creator_allocated_fraction;
 const sample=creatorAllocated*format.share_of_creator_allocated_pool;
 if(![poolRevenue,creatorAllocated,sample].every(Number.isFinite))throw Error('Overflow');
 return {kind:'hypothetical_only',currency:inputs.currency,month:inputs.month,
   pool_revenue:poolRevenue,creator_allocated_pool:creatorAllocated,
   conditional_contractual_amount:sample,actual_creator_revenue:null,bank_receipt:null,creator_profit:null};
}

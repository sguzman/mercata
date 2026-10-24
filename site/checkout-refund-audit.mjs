// Official price schedules are published options, not channel-level prices or exchange rates.
export function auditCheckoutRefunds(study,sources){
 const errors=[];
 if(study?.kind!=='buyer_checkout_price_refund_boundary'||study?.platform!=='youtube')errors.push('study identity');
 const products=study?.products||[];
 if(products.length!==3||new Set(products.map(x=>x.id)).size!==3)errors.push('product coverage');
 const required={channel_membership:'recurring_membership',supers:'one_time_voluntary_payment',external_shopping:'external_merchandise_or_service_order'};
 for(const [key,type] of Object.entries(required))if(products.find(x=>x.id===key)?.transaction_type!==type)errors.push('incorrect transaction type: '+key);
 for(const p of products){
  if(!p.source_ids?.length||!p.source_ids.every(id=>sources.has(id)))errors.push('missing source for '+p.id);
  if(!p.checkout_owner||!p.refund_rule||!p.money_unit||!p.price_rule)errors.push('incomplete transaction boundary: '+p.id);
  for(const k of ['median_buyer_price','refund_rate','conversion_rate','measured_merchant_seller_offer'])if(p[k]!==null)errors.push('unobserved seller metric: '+p.id+'/'+k);
 }
 if(products.find(x=>x.id==='external_shopping')?.checkout_owner!=='external_retailer_or_marketplace')errors.push('false merchant responsibility');
 const price=study?.published_membership_price_examples;
 if(!price||price.observed_creator_price_count!==0||price.points.length!==6)errors.push('false creator price sample');
 for(const item of price?.points||[]){
  if(!sources.has(item.source_id)||!['USD','MXN'].includes(item.currency)||!Number.isFinite(item.local_price)||item.local_price<=0)errors.push('invalid published price option');
  if(item.currency==='MXN'&&item.country!=='MX'||item.currency==='USD'&&item.country!=='US')errors.push('mixed price currencies');
 }
 if(!study?.unmeasured||Object.values(study.unmeasured).some(v=>v!==null))errors.push('fabricated research outcome');
 if(!Array.isArray(study?.sampled_real_channel_prices)||study.sampled_real_channel_prices.length)errors.push('unsupported real-channel sample');
 return {valid:errors.length===0,errors};
}

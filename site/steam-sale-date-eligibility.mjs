// Synthetic calendar-day eligibility only; not account permission or a sales prediction.
function date(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new TypeError('ISO date required');
 const d=new Date(s+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw new TypeError('Invalid calendar date');
 return d;
}
const add30=d=>new Date(d.getTime()+30*86400000);
export function calendarDiscountEligibility({releaseDate,priceIncreaseDate=null,saleStart,saleEnd}={}){
 const release=date(releaseDate),start=date(saleStart),end=date(saleEnd);
 if(start>end)throw new RangeError('Sale ends before it starts');
 const price=priceIncreaseDate===null?null:date(priceIncreaseDate);
 if(price&&price>end)throw new RangeError('Input price increase occurs after evaluated sale');
 const firstAllowed=Math.max(add30(release).getTime(),price?add30(price).getTime():-Infinity);
 const firstCandidate=Math.max(firstAllowed,start.getTime());
 const possible=firstCandidate<=end.getTime();
 return {kind:'hypothetical_calendar_day_check_not_verified_store_eligibility',
  regular_discount_possible_sometime_during_sale:possible,
  eligible_from_sale_start:release<=start&&firstAllowed<=start.getTime(),
  earliest_possible_discount_date:possible?new Date(firstCandidate).toISOString().slice(0,10):null,
  release_cooldown_ends:add30(release).toISOString().slice(0,10),
  price_increase_cooldown_ends:price?add30(price).toISOString().slice(0,10):null,
  actual_partner_discount_permission_verified:false,
  observed_sales_increment:null,causal_event_uplift:null,
  caveat:'Seasonal exemption for ordinary discount-to-discount cooldowns does not cancel release or price increase cooldowns. Day-level arithmetic ignores hour cutoff and configured package permissions.'};
}

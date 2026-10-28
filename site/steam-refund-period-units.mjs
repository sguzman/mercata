// Demonstration only: period events and paid cohort refunds are not interchangeable.
export function periodRefundRatio(input){
 if(!input||typeof input!=='object')throw new TypeError('Expected aggregate');
 const {period_purchases,period_returned}=input;
 if(!Number.isSafeInteger(period_purchases)||period_purchases<0)throw new TypeError('Invalid period purchases');
 if(!Number.isSafeInteger(period_returned)||period_returned<0)throw new TypeError('Invalid period returns');
 return {period_purchases,period_returned,
  period_refund_events_over_period_purchases:period_purchases===0?null:period_returned/period_purchases,
  matched_original_purchase_cohort_refund_rate:null,
  verified_net_sales:null,actual_developer_profit:null,
  caution:'Period return events can refer to purchases made in earlier periods; ratio may exceed 100 percent or be undefined.'};
}

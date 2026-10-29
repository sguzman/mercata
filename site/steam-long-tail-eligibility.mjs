// Study-selection and follow-up-age screening, not a revenue prediction.
function calendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError('ISO calendar date required');
  const d=new Date(value+'T00:00:00.000Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10)!==value) throw new TypeError('Invalid calendar date');
  return d;
}
function addMonths(d,n) {
  const month=d.getUTCMonth()+n,year=d.getUTCFullYear()+Math.floor(month/12),m=month%12;
  const max=new Date(Date.UTC(year,m+1,0)).getUTCDate();
  return new Date(Date.UTC(year,m,Math.min(d.getUTCDate(),max)));
}
export function auditSelectedLongTailEligibility({releaseDate,asOf='2026-07-21',firstMonthCopies,measurementType='model_estimated_units',horizonMonths=12}={}) {
  const release=calendarDate(releaseDate),asOfDate=calendarDate(asOf);
  if (!Number.isSafeInteger(firstMonthCopies)||firstMonthCopies<0) throw new TypeError('Nonnegative integer model units required');
  if (horizonMonths!==12&&horizonMonths!==24) throw new TypeError('Horizon must be 12 or 24 months');
  const reasons=[];
  if (release<calendarDate('2023-07-01')||release>calendarDate('2025-07-31')) reasons.push('outside_release_frame');
  if (firstMonthCopies<=1000) reasons.push('excluded_by_first_month_success_threshold');
  if (measurementType!=='model_estimated_units') reasons.push('mismatched_sales_measurement');
  if (release>asOfDate) reasons.push('not_yet_released');
  if (addMonths(release,horizonMonths)>asOfDate) reasons.push('followup_not_mature');
  return {passes_necessary_selection_and_age_checks:reasons.length===0,reasons,horizon_months:horizonMonths,
    individual_revenue_forecast:null,publisher_net_cash:null,developer_after_cost_profit:null,
    observed_model_accuracy_verified:false,
    limitation:'Necessary conditions only: cannot verify proprietary cohort membership, source follow-up denominator, revenue realization or individual applicability.'};
}

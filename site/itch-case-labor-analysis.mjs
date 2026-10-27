// Illustrative selected-disclosure sensitivity, not a wage statistic or market income forecast.
const finiteNonnegative = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const amount = n => Math.round(n * 100) / 100;
export function analyzeReportedCashAndLabor({currency,reportedCashSurplus,knownDevelopmentHours,otherUnloggedHours,illustrativeHourlyRates} = {}){
 if(typeof currency !== 'string' || currency.trim().length!==3)throw new TypeError('Use a three-letter currency');
 if(!finiteNonnegative(reportedCashSurplus)&&!(typeof reportedCashSurplus==='number'&&Number.isFinite(reportedCashSurplus)))throw new TypeError('Reported surplus must be finite, negative allowed');
 if(knownDevelopmentHours!==null && !finiteNonnegative(knownDevelopmentHours))throw new TypeError('Unknown labor must be null or nonnegative');
 if(otherUnloggedHours!==null&&!finiteNonnegative(otherUnloggedHours))throw new TypeError('Other hours are unknown or nonnegative');
 if(!Array.isArray(illustrativeHourlyRates)||illustrativeHourlyRates.length===0||!illustrativeHourlyRates.every(finiteNonnegative))throw new TypeError('Explicit nonnegative hypothetical rates required');
 const hoursComplete=knownDevelopmentHours!==null&&otherUnloggedHours!==null;
 const knownHours=knownDevelopmentHours===null?null:knownDevelopmentHours;
 const rows=illustrativeHourlyRates.map(rate=>({
  hypotheticalHourlyRate:rate,
  estimatedValuedKnownDevLabor:knownHours===null?null:amount(knownHours*rate),
  conditionalBalanceAfterKnownDevLabor:knownHours===null?null:amount(reportedCashSurplus-knownHours*rate),
  fullyCostedProfit:hoursComplete?amount(reportedCashSurplus-(knownHours+otherUnloggedHours)*rate):null
 }));
 return {currency,reportedCashSurplus,
  knownDevelopmentHours:knownHours,otherUnloggedHours,
  cashSurplusPerKnownDevHour:knownHours===null||knownHours===0?null:reportedCashSurplus/knownHours,
  illustrativeRows:rows,
  accountingRecordsAudited:false,actualHourlyWage:null,platformSpecificSales:null,
  marketMean:null,marketMedian:null,
  limitation:'Conditional subtraction from reported cash-accounting surplus, not a wage, receipt schedule, audited tax result or genre profit estimate.'};
}

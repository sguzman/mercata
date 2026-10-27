// Refuses to compare paid-game store results when exposure, price, scope, or accounts are missing.
// Synthetic fixtures test comparison logic; this never reads merchant transactions.
const str=x=>typeof x==='string'&&x.trim().length>0;
const validNumber=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function assessCrossStoreComparability(a,b){
 if(!a||!b||typeof a!=='object'||typeof b!=='object')throw new TypeError('Both store observations required');
 const required=['gameId','edition','store','productType','priceCurrency','priceAmount','discountStatus','priceWindowStartUTC','priceWindowEndUTC','releaseAgeDays','marketingCohort','grossReceipts','platformFee','processorFee','refunds','distributionLaborHours','qaLaborHours','supportLaborHours','paidOrders','merchantPayoutBasis'];
 const issues=[];
 for(const [i,rec] of [a,b].entries()){
  for(const field of required)if(rec[field]===null||rec[field]===undefined||rec[field]==='')issues.push('missing '+field+' in store '+(i+1));
  for(const key of ['priceAmount','releaseAgeDays','grossReceipts','platformFee','processorFee','refunds','distributionLaborHours','qaLaborHours','supportLaborHours','paidOrders'])
   if(rec[key]!==null&&rec[key]!==undefined&&!validNumber(rec[key]))issues.push('invalid '+key+' in store '+(i+1));
 }
 if(a.store===b.store)issues.push('different stores required');
 for(const key of ['gameId','edition','productType','priceCurrency','priceAmount','discountStatus','priceWindowStartUTC','priceWindowEndUTC','releaseAgeDays','marketingCohort','merchantPayoutBasis'])
  if(a[key]!==b[key])issues.push('inconsistent '+key);
 if(!str(a.gameId)||!str(b.gameId))issues.push('unknown product identity');
 if(!str(a.priceWindowStartUTC)||!str(a.priceWindowEndUTC))issues.push('unknown observation window');
 if(issues.length>0)return {comparisonReady:false,issues:[...new Set(issues)],observedIncrementalRevenue:null,causalStoreEffect:null,representativePaidGameIncome:null};
 return {comparisonReady:true,issues:[],observedIncrementalRevenue:null,causalStoreEffect:null,representativePaidGameIncome:null,
  caution:'Comparable accounting units do not randomize audience between stores or establish causal lift; real payout figures must come from authorized records.'};
}

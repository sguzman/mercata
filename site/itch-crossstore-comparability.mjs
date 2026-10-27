// Refuses to compare paid-game store results when exposure, price, scope, or accounts are missing.
// Synthetic fixtures test comparison logic; this never reads merchant transactions.
const str=x=>typeof x==='string'&&x.trim().length>0;
const validNumber=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const validCount=x=>Number.isSafeInteger(x)&&x>=0;
// Comparing raw strings is insufficient: Date.parse normalizes impossible dates (e.g. February 30).
const utc=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x)
 &&Number.isFinite(Date.parse(x))
 &&new Date(Date.parse(x)).toISOString()===x.replace('Z','.000Z');

export function assessCrossStoreComparability(a,b){
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b))
  throw new TypeError('Both store observations required');
 const required=['gameId','edition','store','productType','priceCurrency','priceAmount','discountStatus','priceWindowStartUTC','priceWindowEndUTC','releaseAgeDays','marketingCohort','grossReceipts','platformFee','processorFee','refunds','distributionLaborHours','qaLaborHours','supportLaborHours','paidOrders','merchantPayoutBasis'];
 const textFields=['gameId','edition','store','productType','priceCurrency','discountStatus','marketingCohort','merchantPayoutBasis'];
 const issues=[];
 for(const [i,rec] of [a,b].entries()){
  const where=' in store '+(i+1);
  for(const field of required)if(rec[field]===null||rec[field]===undefined||rec[field]==='')issues.push('missing '+field+where);
  for(const key of textFields)if(!str(rec[key]))issues.push('invalid '+key+where);
  for(const key of ['priceAmount','grossReceipts','platformFee','processorFee','refunds','distributionLaborHours','qaLaborHours','supportLaborHours'])
   if(!validNumber(rec[key]))issues.push('invalid '+key+where);
  for(const key of ['paidOrders','releaseAgeDays'])
   if(!validCount(rec[key]))issues.push('invalid '+key+where);
  // Zero-price downloads/donations must never enter the paid-game cohort.
  if(validNumber(rec.priceAmount)&&rec.priceAmount===0)issues.push('positive minimum price required'+where);
  // A completed positive-price order cannot contribute zero gross in its own matched ledger.
  if(validCount(rec.paidOrders)&&rec.paidOrders>0&&validNumber(rec.grossReceipts)&&rec.grossReceipts===0)
   issues.push('positive paid orders require positive gross receipts'+where);
  // Gross receipts for paid-game orders require corresponding counted orders.
  if(validCount(rec.paidOrders)&&rec.paidOrders===0&&validNumber(rec.grossReceipts)&&rec.grossReceipts>0)
   issues.push('gross paid-game receipts require recorded paid orders'+where);
  if(!str(rec.priceCurrency)||!/^[A-Z]{3}$/.test(rec.priceCurrency))issues.push('invalid priceCurrency'+where);
  if(!utc(rec.priceWindowStartUTC)||!utc(rec.priceWindowEndUTC)||
     (utc(rec.priceWindowStartUTC)&&utc(rec.priceWindowEndUTC)&&Date.parse(rec.priceWindowStartUTC)>=Date.parse(rec.priceWindowEndUTC)))
   issues.push('invalid UTC price window'+where);
 }
 if(a.store===b.store)issues.push('different stores required');
 for(const key of ['gameId','edition','productType','priceCurrency','priceAmount','discountStatus','priceWindowStartUTC','priceWindowEndUTC','releaseAgeDays','marketingCohort','merchantPayoutBasis'])
  if(a[key]!==b[key])issues.push('inconsistent '+key);
 if(issues.length>0)return {comparisonReady:false,issues:[...new Set(issues)],observedIncrementalRevenue:null,causalStoreEffect:null,representativePaidGameIncome:null};
 return {comparisonReady:true,issues:[],observedIncrementalRevenue:null,causalStoreEffect:null,representativePaidGameIncome:null,
  caution:'Comparable accounting units do not randomize audience between stores or establish causal lift; real payout figures must come from authorized records.'};
}

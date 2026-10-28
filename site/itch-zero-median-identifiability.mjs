// Exact arithmetic for one disclosed histogram summary, not an income estimator.
// All outputs are aggregate arithmetic, never individual publisher or buyer records.
const isInt=x=>Number.isSafeInteger(x);
const ownKeys=['gameRecordCount','reportedZeroPercentNearestWhole','reportedMedianUsd',
 'assumeNonnegativeReceipts','assumeSameRevenueBasis','assumeMedianExactZero'];
export function auditZeroMedianCompatibility(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!ownKeys.includes(k))||
  !isInt(input.gameRecordCount)||input.gameRecordCount<1||
  !isInt(input.reportedZeroPercentNearestWhole)||input.reportedZeroPercentNearestWhole<0||input.reportedZeroPercentNearestWhole>100||
  typeof input.reportedMedianUsd!=='number'||!Number.isFinite(input.reportedMedianUsd)||input.reportedMedianUsd<0||
  typeof input.assumeNonnegativeReceipts!=='boolean'||typeof input.assumeSameRevenueBasis!=='boolean'||
  typeof input.assumeMedianExactZero!=='boolean')
  throw new TypeError('Non-identifying, exact aggregate sample and explicit interpretive assumptions required');
 const n=input.gameRecordCount,p=input.reportedZeroPercentNearestWhole;
 // A whole-percent report rounded to nearest: p-0.5 <= 100*z/n < p+0.5.
 // 0% and 100% have one-sided truncated ranges.
 const minimum=Math.max(0,Math.ceil(n*(2*p-1)/200));
 const maximum=Math.min(n,Math.ceil(n*(2*p+1)/200)-1);
 const feasible=minimum<=maximum;
 const required=Math.floor(n/2)+1; // even medians average two middle entries
 const comparable=input.assumeNonnegativeReceipts&&input.assumeSameRevenueBasis&&
   input.assumeMedianExactZero&&input.reportedMedianUsd===0;
 return Object.freeze({
  gameRecordCount:n,possibleExactZeroRecordCountMin:feasible?minimum:null,
  possibleExactZeroRecordCountMax:feasible?maximum:null,
  percentageIsFeasibleForSampleSize:feasible,
  minimumExactZeroRecordsForExactZeroMedianOfNonnegativeAmounts:required,
  coexistenceUnderStatedAssumptions:comparable&&feasible?maximum>=required:null,
  arithmeticContradictionConfirmedInUnderlyingData:false,
  medianRoundingOrDefinitionReconciled:false,
  independentPublishersVerified:false,representativePaidGameSamplingFrameVerified:false,
  marketwideZeroEarnerShare:null,representativePaidGameMedianUsd:null,
  note:'Compatibility is conditional on same-measure nonnegative receipts and an unrounded exact median. Rounded median, different scopes, and voluntary selection remain unresolved.'
 });
}

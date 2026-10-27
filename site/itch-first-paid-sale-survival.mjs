// Analysis helper for authorized eligible first-game release cohorts only.
// Never infer population sales from synthetic examples, page views or downloaded files.
// Event and censor records share a single day axis; events on tied days happen before censorship.
const day=n=>Number.isSafeInteger(n)&&n>=0;
export function analyzeFirstPaidSaleCohort({projects,horizonsDays=[30,90,365]}={}){
 if(!Array.isArray(projects)||projects.length===0)throw new TypeError('Nonempty eligible project cohort required');
 if(!Array.isArray(horizonsDays)||!horizonsDays.length||!horizonsDays.every(day)||
    new Set(horizonsDays).size!==horizonsDays.length)
  throw new TypeError('Distinct nonnegative integer horizons required');
 const seen=new Set();
 for(const p of projects){
  if(!p||typeof p.id!=='string'||!p.id.trim()||seen.has(p.id)||
     !day(p.observedDays)||(p.firstRetainedPaidOrderDay!==null&&
     (!day(p.firstRetainedPaidOrderDay)||p.firstRetainedPaidOrderDay>p.observedDays)))
   throw new TypeError('Every unique eligible project must supply observed days and a bounded first paid order day or null');
  seen.add(p.id);
 }
 const grouped=new Map();
 for(const p of projects){
  const event=p.firstRetainedPaidOrderDay!==null,at=event?p.firstRetainedPaidOrderDay:p.observedDays;
  const z=grouped.get(at)??{day:at,events:0,censored:0};
  z[event?'events':'censored']++;grouped.set(at,z);
 }
 let risk=projects.length,survival=1,median=null;
 const riskTable=[...grouped.values()].sort((a,b)=>a.day-b.day).map(row=>{
  const atRisk=risk;
  if(row.events>risk)throw Error('Invalid risk set');
  survival*=1-row.events/risk;
  if(median===null&&survival<=0.5)median=row.day;
  risk-=row.events+row.censored;
  return {day:row.day,atRisk,firstPaidOrders:row.events,rightCensored:row.censored,
   survivalWithoutFirstOrder:survival,riskAfterDay:risk};
 });
 const horizons=[...horizonsDays].sort((a,b)=>a-b).map(h=>{
  const settled=projects.filter(p=>p.firstRetainedPaidOrderDay!==null&&p.firstRetainedPaidOrderDay<=h).length;
  const knownNoSale=projects.filter(p=>p.firstRetainedPaidOrderDay===null&&p.observedDays>=h||
    p.firstRetainedPaidOrderDay!==null&&p.firstRetainedPaidOrderDay>h&&p.observedDays>=h).length;
  const unknown=projects.length-settled-knownNoSale;
  const past=[...riskTable].filter(r=>r.day<=h);
  const survivor=past.length?past.at(-1).survivalWithoutFirstOrder:1;
  return {horizonDays:h,knownFirstPaidOrders:settled,knownNoPaidOrderThroughHorizon:knownNoSale,
    unknownStatusDueToCensoring:unknown,unadjustedZeroOrderFractionIfFullyObserved:unknown===0?knownNoSale/projects.length:null,
    conditionalKaplanMeierSurvival:survivor,
    platformWideProbabilityEstimate:null};
 });
 return {eligibleProjectCount:projects.length,observedFirstPaidOrderCount:projects.filter(p=>p.firstRetainedPaidOrderDay!==null).length,
  riskTable,horizons,conditionalSampleMedianEventDay:median,
  actualMarketWideZeroSaleFraction:null,representativeSellerIncome:null,
  assumptions:['Complete eligible release sample and correct first settled positive-price order date supplied',
   'Project-level right censoring is non-informative for Kaplan-Meier interpretation',
   'Refounded, refunded, free, demo, bundle-key and follower events are not paid game orders',
   'Multiple projects owned by one publisher need separate owner deduplication before seller-level inference']};
}

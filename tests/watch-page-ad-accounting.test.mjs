import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyWatchPageMetric,evaluateWatchPageEligibleNet,assessLongFormAdOpportunity,reportAdMetrics} from '../site/watch-page-ad-accounting.mjs';
const load=async f=>JSON.parse(await readFile(new URL('../'+f,import.meta.url),'utf8'));
test('Registered official metrics retain gross/creator-net/ads/per-playback distinctions',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/watch-page-ad-accounting.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(x=>s.evidence.some(y=>y.id===x)));
 assert.equal(m.platform_share_of_eligible_net_watch_page_ads,0.55);
 assert.equal(m.authorized_reporting_metrics.length,8);
 assert.equal(classifyWatchPageMetric(m,'grossRevenue').economics,'gross_google_sold_or_doubleclick_partner_sold');
 assert.equal(classifyWatchPageMetric(m,'estimatedAdRevenue').economics,'creator_reported_estimated_ads');
 assert.equal(classifyWatchPageMetric(m,'estimatedRevenue').economics,'creator_reported_net_total');
 assert.equal(classifyWatchPageMetric(m,'unregistered').known,false);
 assert(m.authorized_reporting_metrics.every(x=>x.known_value===null));
 assert.equal(m.observed_creator_reports.length,0);
 assert.equal(m.actual_creator_payout,null);
});
test('55 percent applies only to a supplied hypothetical eligible net base',async()=>{
 const m=await load('ontology/youtube/watch-page-ad-accounting.json');
 const input={input_basis:'eligible_net_ad_revenues_watch_page_module',currency:'USD',period:'2026-07',
   watch_page_module_accepted:true,eligible_public_video:true,eligible_net_ad_revenues:200};
 const x=evaluateWatchPageEligibleNet(m,input);
 assert.equal(x.creator_contractual_share,110);assert.equal(x.actual_creator_payout,null);
 assert.equal(x.actual_creator_profit,null);assert.equal(x.bank_cash_received,null);
 assert.throws(()=>evaluateWatchPageEligibleNet(m,{...input,input_basis:'grossRevenue'}),/Cannot use advertiser gross/);
 assert.throws(()=>evaluateWatchPageEligibleNet(m,{...input,eligible_net_ad_revenues:null}),/Missing or invalid/);
 assert.throws(()=>evaluateWatchPageEligibleNet(m,{...input,watch_page_module_accepted:false}),/eligibility/);
 assert.throws(()=>evaluateWatchPageEligibleNet(m,{...input,period:''}),/Require currency/);
});
test('Eight-minute ad slot eligibility is never a promise of an ad or payout',async()=>{
 const m=await load('ontology/youtube/watch-page-ad-accounting.json');
 const x={duration_seconds:480,monetized:true,watch_page_module_accepted:true,eligible_public_video:true,mode:'combined'};
 assert.equal(assessLongFormAdOpportunity(m,x).eligible,true);
 assert.equal(assessLongFormAdOpportunity(m,x).ad_will_serve,null);
 assert.equal(assessLongFormAdOpportunity(m,{...x,duration_seconds:479}).eligible,false);
 assert.equal(assessLongFormAdOpportunity(m,{...x,monetized:false}).eligible,false);
 assert.equal(assessLongFormAdOpportunity(m,{...x,mode:'shorts'}).eligible,false);
});
test('Owner report cannot infer creator payout from advertiser gross CPM, views or double-counted total',async()=>{
 const m=await load('ontology/youtube/watch-page-ad-accounting.json');
 const input={owner_authorized:true,currency:'USD',period:'2026-07',grossRevenue:1000,estimatedAdRevenue:360,
  estimatedRevenue:430,estimatedRedPartnerRevenue:70,adImpressions:10000,monetizedPlaybacks:8000};
 const x=reportAdMetrics(m,input);
 assert.equal(x.gross_cpm_from_impressions,100);
 assert.equal(x.creator_estimated_net_ads,360);
 assert.equal(x.creator_estimated_net_total,430);
 assert.equal(x.creator_estimated_net_premium,70);
 assert.equal(x.gross_to_eligible_net_bridge,null);
 assert.equal(x.creator_contractual_share_inferred_from_gross,null);
 assert.equal(x.cash_settled,null);
 assert.throws(()=>reportAdMetrics(m,{...input,owner_authorized:false}),/authorized/);
 assert.throws(()=>reportAdMetrics(m,{...input,currency:'MXN'}),/grossRevenue metric is reported in USD/);
 assert.throws(()=>reportAdMetrics(m,{...input,monetizedPlaybacks:0.2}),/Integer/);
 assert.throws(()=>reportAdMetrics(m,{owner_authorized:true,currency:'USD',period:'2026-07'}),/No observed/);
});
test('Public dossier renders accounting boundaries in source-linked cards',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderWatchPageAdAccounting'));
 assert(a.includes('watch-page-ad-accounting.json'));
 assert(a.includes('not 55% of advertiser grossRevenue'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessContentIDDispute,assessContentIDPolicy,interpretClaimResolution} from '../site/content-id-revenue-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Content ID source rules separate regional block, tracking and rights monetization',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/content-id-revenue-dispute-audit.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(m.actions.map(x=>x.id),['block','track','monetize']);
 assert.equal(m.same_video_policies_vary_by_geography,true);
 assert.equal(m.claiming_scenarios.length,5);
 assert.equal(m.observed_creator_claims.length,0);
 assert(Object.values(m.unmeasured).every(x=>x===null));
 const r=assessContentIDPolicy(m,'monetize','MX');
 assert.equal(r.valid,true);assert.equal(r.creator_ad_revenue,null);
 assert.equal(assessContentIDPolicy(m,'block','world').valid,false);
});
test('Five-day initial-dispute threshold sets claim-date or later dispute-date hold',async()=>{
 const m=await load('ontology/youtube/content-id-revenue-dispute-audit.json');
 const input={dispute_type:'initial_content_id_dispute',claim_date:'2026-01-01',dispute_date:'2026-01-06'};
 assert.equal(assessContentIDDispute(m,input).held_since,'2026-01-01');
 assert.equal(assessContentIDDispute(m,{...input,dispute_date:'2026-01-05'}).retroactive_to_claim,true);
 assert.equal(assessContentIDDispute(m,{...input,dispute_date:'2026-01-07'}).held_since,'2026-01-07');
 assert.equal(assessContentIDDispute(m,{...input,dispute_date:'2026-01-07'}).held_revenue_creator_cash,null);
 assert.equal(assessContentIDDispute(m,{...input,dispute_date:'2025-12-31'}).valid,false);
 assert.equal(assessContentIDDispute(m,{...input,dispute_date:'2026-02-30'}).valid,false);
 assert.equal(assessContentIDDispute(m,{...input,dispute_type:'appeal'}).valid,false);
});
test('A claim release or upheld dispute cannot imply a bank receipt or fixed revenue split',async()=>{
 const m=await load('ontology/youtube/content-id-revenue-dispute-audit.json');
 for(const status of ['claim_released','claim_upheld','still_pending']){
  const result=interpretClaimResolution(m,status);
  assert.equal(result.valid,true);assert.equal(result.creator_bank_received,null);
  assert.equal(result.settlement_amount,null);
 }
 assert.equal(interpretClaimResolution(m,'creator_paid_100_percent').valid,false);
});
test('Public dossier distinguishes withheld revenue from settled profit',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderContentIDRevenueAudit'));
 assert(a.includes('content-id-revenue-dispute-audit.json'));
 assert(a.includes('held revenue is not creator bank cash'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(p)=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const load=(p)=>JSON.parse(read(p));
const isValidISODate=(value)=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
const dossier=load('specimens/steam.json'),study=load('ontology/steam/entry-review-and-reporting-2026.json');
const plan=load('plans/steam.json'),queue=load('queues/steam.json'),gallery=load('gallery/index.json');
test('The original nine partner documents and 23 claims remain independently attributable',()=>{
 assert.equal(dossier.status,'researching');
 assert(dossier.evidence.length>=9);assert(dossier.claims.length>=23);
 assert.equal(study.source_ids.length,9);assert.equal(study.claim_ids.length,23);
 assert.equal(new Set(dossier.evidence.map(x=>x.url)).size,dossier.evidence.length);
 assert.equal(new Set(dossier.claims.map(x=>x.id)).size,dossier.claims.length);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 for(const s of dossier.evidence){
   assert(s.url.startsWith('https://'));
   assert(isValidISODate(s.retrieved_at)&&s.retrieved_at>='2026-10-28','Expected valid dated post-baseline source evidence');
   assert(s.publisher&&s.license&&s.notes);
 }
 for(const id of study.source_ids){
   const s=dossier.evidence.find(x=>x.id===id);
   assert(s.url.startsWith('https://partner.steamgames.com/'));
   assert.equal(s.published_at,null);
   assert.equal(s.retrieved_at,'2026-10-28');
 }
 for(const c of dossier.claims){
   assert(c.source_ids.length>=1&&c.source_ids.every(x=>ids.has(x)));
   assert(isValidISODate(c.observed_at)&&c.observed_at>='2026-10-28','Expected valid dated post-baseline claim evidence');
   assert(c.limitations.length>45);
 }
 assert(study.source_ids.every(x=>ids.has(x)));
 assert(study.claim_ids.every(x=>dossier.claims.some(y=>y.id===x&&y.observed_at==='2026-10-28')));
});
test('Evidence dates accept valid later research days without accepting impossible calendars',()=>{
 assert(isValidISODate('2026-10-30'));
 assert(isValidISODate('2027-02-28'));
 assert.equal(isValidISODate('2026-02-30'),false);
 assert.equal(isValidISODate('2026-13-01'),false);
 assert.equal(isValidISODate('10/29/2026'),false);
});
test('Earlier 21-day wording is preserved while current public sources agree on 30 days',()=>{
 const a=study.documented.waiting_period_minimum_days_conflict;
 assert.equal(a.steam_direct_public_landing,30);
 assert.equal(a.steamworks_onboarding_doc,21);
 assert.equal(a.resolved_operational_rule,null);
 assert.equal(study.documented.waiting_period_current_public_recheck_days,30);
 assert.equal(study.documented.waiting_period_original_21day_observation_is_historical,true);
 assert.equal(study.documented.coming_soon_days,14);
 assert(study.unresolved.some(x=>x.id==='conflicting-wait-days'&&x.sources.length===2));
 const c=dossier.claims.find(x=>x.id==='wait-rule-requires-reconciliation');
 assert.deepEqual(c.source_ids,['steamdirect-public','steam-onboarding-doc']);
});
test('Steam Direct fee, recoupment and payouts remain different economic concepts',()=>{
 const x=study.documented;
 assert.equal(x.steam_direct_fee_usd,100);
 assert.equal(x.per_product_recoupment_adjusted_gross_usd,1000);
 assert.equal(x.fee_refundable,false);
 assert.equal(x.appfee_can_use_steam_wallet,false);
 assert.equal(x.monthly_payment_threshold_usd,100);
 assert.equal(x.payment_us_banks,'ACH');
 assert.equal(x.payment_non_us_banks,'USD SWIFT');
 assert.equal(x.near_realtime_gross_before_adjustments,true);
 assert.equal(x.monthly_net_after_taxes_returns_chargebacks,true);
 assert.equal(x.known_current_revenue_share_rate,null);
 assert.equal(x.partner_financial_reports_public,false);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Task-scored progress follows the same 293-task denominator with evidence for every nonzero score',()=>{
 assert.equal(plan.total_tracked_tasks,293);assert.equal(plan.detail_tasks.length,209);
 const all=[...plan.detail_tasks.map(x=>({id:x.id,score:x.percent,status:x.status,evidence:x.evidence})),
 ...queue.queues.flatMap(g=>g.tasks.map(x=>({id:x.id,score:x.progress,status:x.status,evidence:x.evidence})))];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 const progress=all.reduce((sum,x)=>sum+x.score,0)/293;
 assert.equal(plan.progress_percent,Math.round(progress));
 assert(plan.progress_percent>=6);
 assert(all.filter(x=>x.score===100).length>=6);
 assert(all.filter(x=>x.score>0&&x.score<100).length>=22);
 for(const t of all){
   assert(Number.isInteger(t.score)&&t.score>=0&&t.score<=100);
   if(t.score>0){
     assert(t.evidence.some(x=>x.startsWith('ontology/steam/')&&x.endsWith('.json')));
     assert(t.evidence.some(x=>x.startsWith('ontology/steam/')&&x.endsWith('.md')));
     assert(t.status==='complete'||t.status==='in_progress');
     for(const file of t.evidence)assert(fs.existsSync(new URL('../'+file,import.meta.url)),file);
   }else assert.equal(t.status,'pending');
   if(t.score===100)assert.equal(t.status,'complete');
 }
 for(const w of plan.workstreams){
   const scores=all.filter(x=>x.id.startsWith('steam/'+w.id+'/')||x.id.startsWith(w.id+'/'));
   assert.equal(w.progress_percent,Math.round(scores.reduce((sum,x)=>sum+x.score,0)/scores.length));
 }
});
test('Published text keeps monetary gaps explicit and reflects the verified Steam plan',()=>{
 const doc=read('ontology/steam/entry-review-and-reporting-2026.md');
 for(const phrase of ['21 days','30 days','USD 1,000','USD 100','monthly','historical'])
   assert(doc.toLowerCase().includes(phrase.toLowerCase()),phrase);
 assert(doc.includes('current public pages now agree on 30 days'));
 const item=gallery.specimens.find(x=>x.id==='steam');
 assert.equal(item.status,'researching');
 assert.equal(item.planning_state,'researching');
 assert.equal(item.color.hex,'#A665CB');
 for(const file of ['README.md','gallery/README.md','plans/steam.md','roadmap/README.md','pipeline/README.md'])
  assert(read(file).includes(plan.progress_percent+'%'),file+' progress not synchronized');
 assert.equal(study.no_merchant_data,true);
 assert.equal(study.no_game_publication,true);
});

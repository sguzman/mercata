import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Curated anthology offer is not counted as realized 2026 seller revenue',()=>{
 const r=get('ontology/itch-io/anthology-game-creator-payment-terms-2026.json'),d=get('specimens/itch-io.json');
 assert(r.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(r.claim_ids.every(id=>d.claims.some(c=>c.id===id)));
 assert.equal(r.observed_offer.visible_entries_at_review,41);
 assert.equal(r.observed_offer.described_contributor_slots,10);
 assert.equal(r.advertised_compensation.upfront_usd_if_selected,20);
 assert.equal(r.advertised_compensation.share_percent_before_break_even,5);
 assert.equal(r.advertised_compensation.share_percent_after_break_even,8);
 assert.equal(r.boundaries.ten_divided_by_41_is_valid_acceptance_probability,false);
 assert.equal(r.boundaries.upfront_offer_is_2026_verified_earnings,false);
 assert.equal(r.boundaries.royalty_percentage_is_realized_royalty,false);
 assert(Object.values(r.unknown).every(v=>v===null));
 assert.equal(d.evidence.find(e=>e.id==='indiepocalypse-2026-issue76-game-anthology-offer').published_at,null);
});
test('Earlier contributor report is not misattributed to issue 76',()=>{
 const r=get('ontology/itch-io/anthology-game-creator-payment-terms-2026.json'),p=get('plans/itch-io.json');
 assert.equal(r.historical_report.issue,'Indiepocalypse #11');
 assert.equal(r.historical_report.additional_royalties_after_report,null);
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.progress_percent,97);
});

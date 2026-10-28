import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditBrowserPaymentEventBoundaries} from '../site/itch-browser-event-boundaries.mjs';
const get=f=>JSON.parse(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'));
test('First-party 30-day Bitiverse report preserves different event kinds and optional payment model',()=>{
 const x=get("ontology/itch-io/bitiverse-2026-free-browser-events-vs-paid-game-conversion.json"),d=get('specimens/itch-io.json'),r=x.sample;
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(d.evidence.find(s=>s.id==='bitiverse-2026-august-30day-free-browser-payment-events').published_at,'2026-08-09');
 assert.equal(r.page_view_events,7033);assert.equal(r.browser_play_events,1364);assert.equal(r.download_events,93);
 assert.equal(r.payment_events,3);assert.equal(r.payment_total_usd,57);assert.equal(r.mandatory_positive_price,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('The observed 19.39 percent event ratio is not unique paid customer conversion',()=>{
 const x=get("ontology/itch-io/bitiverse-2026-free-browser-events-vs-paid-game-conversion.json"),r=x.sample;
 const a=auditBrowserPaymentEventBoundaries({pageViews:r.page_view_events,browserPlays:r.browser_play_events,downloads:r.download_events,paymentEvents:r.payment_events,paymentTotalUsd:r.payment_total_usd,mandatoryPrice:r.mandatory_positive_price});
 assert.equal(a.browserPlayEventsPer100PageViewEvents,19.39);assert.equal(a.paymentEventsReported,3);
 assert.equal(a.gameAccessMode,'free_or_name_your_price');
 assert.equal(a.uniquePaidBuyers,null);assert.equal(a.mandatoryPricePaidOrders,null);
 assert.equal(a.verifiedPurchaseConversion,null);assert.equal(a.eventRatioIsPersonConversion,false);
 assert.equal(x.derived.usable_as_mandatory_paid_game_conversion,false);
});
test('Numeric path rejects invalid input and does not divide by zero',()=>{
 const base={pageViews:7033,browserPlays:1364,downloads:93,paymentEvents:3,paymentTotalUsd:57,mandatoryPrice:false};
 assert.equal(auditBrowserPaymentEventBoundaries({...base,pageViews:0}).browserPlayEventsPer100PageViewEvents,null);
 assert.throws(()=>auditBrowserPaymentEventBoundaries({...base,pageViews:-3}),TypeError);
 assert.throws(()=>auditBrowserPaymentEventBoundaries({...base,paymentEvents:1.5}),TypeError);
 assert.throws(()=>auditBrowserPaymentEventBoundaries({...base,mandatoryPrice:null}),TypeError);
});
test('Fixed task inventory stays 244 with only existing incomplete browser conversion task advanced',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/sales/study-browser-play-conversion');
 assert(t&&t.percent>=73&&t.percent<100&&t.status==='in_progress');
 for(const file of ["ontology/itch-io/bitiverse-2026-free-browser-events-vs-paid-game-conversion.json","ontology/itch-io/bitiverse-2026-free-browser-events-vs-paid-game-conversion.md","site/itch-browser-event-boundaries.mjs","tests/itch-bitiverse-browser-payment-boundaries.test.mjs"])assert(t.evidence.includes(file));
});

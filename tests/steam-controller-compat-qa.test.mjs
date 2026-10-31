import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {checkSyntheticHardwareInputQa as qa} from '../site/steam-controller-compat-qa.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-deck-machine-input-qa-and-compatibility-gates-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const base={fps:30,verticalPixels:800,allControlsUsable:true,matchedGlyphs:true,controllerTextEntry:true,requiresManualConfig:false,noHardwareWarning:true};
test('Deck and Machine have independently declared performance thresholds',()=>{
 const a=qa({device:'deck',evidence:base}),b=qa({device:'machine',evidence:base});
 assert.equal(a.selected_requirements_pass,true);
 assert.equal(b.selected_requirements_pass,false);
 assert(b.failed_selected_requirements.includes('below_documented_vertical_resolution'));
 assert.equal(b.full_official_deck_or_machine_verified_badge,null);
});
test('Missing controller access, text keyboard, glyphs or frame rate fails closed',()=>{
 const r=qa({device:'deck',evidence:{...base,fps:19,allControlsUsable:false,matchedGlyphs:false,controllerTextEntry:false,requiresManualConfig:true,noHardwareWarning:false}});
 assert.equal(r.selected_requirements_pass,false);
 assert.equal(r.failed_selected_requirements.length,6);
 assert.equal(r.observed_incremental_sales,null);
});
test('No unverified status, missing observation or unknown hardware can be promoted',()=>{
 assert.throws(()=>qa({device:'phone',evidence:base}),/Known device/);
 assert.throws(()=>qa({device:'deck',evidence:{...base,matchedGlyphs:null}}),/Boolean QA/);
 assert.throws(()=>qa({device:'deck',evidence:{...base,fps:NaN}}),/Finite/);
 assert.throws(()=>qa({device:'deck',evidence:{...base,verticalPixels:0}}),/Positive/);
 assert.equal(x.input_implementation.auto_verified_if_steaminput_integrated,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Ten policy claims join to public sources, and Steam remains 293 tasks',()=>{
 const sources=new Set(d.evidence.map(z=>z.id)),claims=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>sources.has(z)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

test('Deck Verified entails Machine Verified, but per-device badge inference is one-way',()=>{
 const x=d.hardware.rating_inference;
 assert.equal(x.ratings_issued_per_device,true);
 assert.equal(x.deck_verified_guarantees_machine_verified,true);
 assert.equal(x.machine_verified_guarantees_deck_verified,false);
 assert.equal(x.other_badge_transfers_proven,false);
 assert.equal(x.badge_status_required_for_release,false);
 assert.equal(x.empirical_device_sales_from_rating,null);
});

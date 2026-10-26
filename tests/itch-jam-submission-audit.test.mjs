import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessItchJamSubmission} from '../site/itch-jam-submission-audit.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/jam-submission-commercial-rights-2026.json',import.meta.url),'utf8'));
const jam={starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-10-15T23:59:59Z',pricing_rule:'free_file',ai_rule:'disclosed',platform_rule:'any',required_platforms:['linux','browser'],no_prior_jam:true,require_created_after_start:true,require_first_upload_after_start:true};
const entry={created_at:'2026-10-02T00:00:00Z',first_file_uploaded_at:'2026-10-03T00:00:00Z',submitted_at:'2026-10-09T12:00:00Z',minimum_price_usd:5,files:[{downloadable:true,requires_payment:false},{downloadable:true,requires_payment:true}],platforms:['linux'],playable_html5:false,prior_jam_submitted:false,ai_use_disclosed:true};
test('A paid game with free demo satisfies free-file but not free-project jam requirements',()=>{
 const a=assessItchJamSubmission(jam,entry);
 assert.equal(a.status,'configured_eligible');
 assert.equal(a.rights_to_commercialize_after_jam,null);
 assert.equal(a.real_paid_game_orders,null);
 const b=assessItchJamSubmission({...jam,pricing_rule:'free_project'},entry);
 assert.equal(b.status,'blocked');
 assert(b.failures.some(x=>x.includes('Fully free')));
});
test('Timing, browser builds and non-reentry gates reject prohibited submissions',()=>{
 for(const change of [
  {submitted_at:'2026-10-16T00:00:00Z'},
  {created_at:'2026-09-10T00:00:00Z'},
  {first_file_uploaded_at:'2026-09-29T00:00:00Z'},
  {prior_jam_submitted:true},
  {ai_use_disclosed:false}
 ]){
  const result=assessItchJamSubmission(jam,{...entry,...change});
  assert.equal(result.status,'blocked');
 }
 const browser=assessItchJamSubmission({...jam,required_platforms:['browser']},{...entry,platforms:['browser'],playable_html5:false});
 assert.equal(browser.status,'blocked');
 assert.equal(assessItchJamSubmission(jam,{...entry,prior_jam_submitted:null}).status,'unverified');
});
test('Jam source policy confirms platform gates but not future commercial value',()=>{
 const d=JSON.parse(fs.readFileSync(new URL('../specimens/itch-io.json',import.meta.url),'utf8'));
 const p=JSON.parse(fs.readFileSync(new URL('../plans/itch-io.json',import.meta.url),'utf8'));
 assert(data.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(data.submission_requirements.later_host_changes_retroactively_reject_old_entries,false);
 assert.equal(data.postjam.particular_jam_later_commercialization_permitted,null);
 assert.equal(data.postjam.jam_voting_to_paying_buyer_rate,null);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/special-games/audit-jam-submissions');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-jam-submission-audit.test.mjs'));
});

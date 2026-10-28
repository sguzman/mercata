import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchJamActivityFrames} from '../site/itch-jam-population-audit.mjs';
const get=f=>JSON.parse(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'));
const file="ontology/itch-io/jam-2026-submitter-accounts-vs-paid-sellers-and-snapshot-drift.json";
test('Two distinct sourced jam activity frames do not count active paid sellers',()=>{
 const v=get(file),d=get('specimens/itch-io.json');assert.equal(v.source_ids.length,5);
 assert(v.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(v.march_2026_independent_exploratory_scrape.reported_window,'approximately_March_2026_30_day_period');
 assert.equal(v.march_2026_independent_exploratory_scrape.creator_identifier_dedup_rules_publicly_audited,false);
 assert(Object.values(v.unknown).every(x=>x===null));
 assert(Object.values(v.non_equivalences).every(x=>x===false));
});
test('Published 2026 March repeat-submitters and GMTK count drift are arithmetic, not sales',()=>{
 const v=get(file),m=v.march_2026_independent_exploratory_scrape,g=v.gmtk_2026_public_snapshots;
 const a=auditItchJamActivityFrames({jams:m.covered_jams_reported,entries:m.entries_reported,identifiers:m.distinct_developer_identifiers_reported,repeat_identifiers:m.repeat_submitting_identifiers_reported},{joined_approx:g.approx_joined_accounts_on_2026_10_28,entries_current:g.exact_entries_reported_2026_10_28_primary,entries_previous:g.exact_entries_reported_2026_09_23_secondary});
 assert.equal(a.observed_march_submissions,5120);assert.equal(a.observed_distinct_submitter_identifiers,4175);
 assert.equal(a.observed_repeat_submitter_identifiers,499);assert.equal(a.repeat_identifier_share_percent,11.95);
 assert.equal(a.current_gmtk_entry_count,10527);assert.equal(a.earlier_secondary_gmtk_entry_count,10542);
 assert.equal(a.between_reported_counters_difference,15);assert.equal(a.verified_deleted_entries,null);
 assert.equal(a.verified_active_paid_sellers,null);assert.equal(a.positive_price_paid_game_sales,null);
 assert.equal(a.valid_to_infer_paid_seller_rate,false);assert.equal(g.count_change_cause_verified,null);
});
test('Malformed or unsound frames fail closed',()=>{
 assert.throws(()=>auditItchJamActivityFrames({jams:2,entries:1,identifiers:4,repeat_identifiers:0},{joined_approx:100,entries_current:10,entries_previous:12}),RangeError);
 assert.throws(()=>auditItchJamActivityFrames({jams:2,entries:10,identifiers:9,repeat_identifiers:10},{joined_approx:100,entries_current:10,entries_previous:12}),RangeError);
 assert.throws(()=>auditItchJamActivityFrames({jams:2,entries:10.5,identifiers:9,repeat_identifiers:1},{joined_approx:100,entries_current:10,entries_previous:12}),TypeError);
 assert.throws(()=>auditItchJamActivityFrames(null,null),TypeError);
});
test('Only two existing active seller tasks change; inventory and original uncertainty survive',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 const tasks=[p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-active-sellers'),q.queues.flatMap(w=>w.tasks).find(t=>t.id==='market/sellers')];
 assert(tasks[0].percent>=62&&tasks[0].percent<100);
 assert(tasks[1].progress>=59&&tasks[1].progress<100);
 for(const t of tasks){assert.equal(t.status,'in_progress');for(const f of [file,"ontology/itch-io/jam-2026-submitter-accounts-vs-paid-sellers-and-snapshot-drift.md","site/itch-jam-population-audit.mjs","tests/itch-jam-2026-population-frame.test.mjs"])assert(t.evidence.includes(f));}
});

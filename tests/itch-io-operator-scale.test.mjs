import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical operator all-product lower bound cannot turn into current paid game sellers',()=>{
 const x=load('ontology/itch-io/operator-total-project-pages-2025.json');
 const d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.operator_reported.project_pages_lower_bound_exclusive,2000000);
 assert.equal(x.operator_reported.measured_exact_count,null);
 assert.equal(x.operator_reported.unique_publisher_accounts,null);
 assert.equal(x.ratios_valid_between_2025_all_pages_and_2026_games,false);
 assert.equal(x.year_over_year_growth_estimate,null);
 assert.equal(x.share_of_publishers_making_sales,null);
 assert.equal(x.separate_catalog_frames.length,3);
});

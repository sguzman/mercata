import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Top Sellers browse counts cannot become sold-unit or localization success metrics',()=>{
 const x=get('ontology/itch-io/top-seller-filter-frames-2026.json');
 const dossier=get('specimens/itch-io.json');
 assert.equal(x.filter_counts.length,10);
 assert(x.source_ids.every(id=>dossier.evidence.some(s=>s.id===id)));
 assert.equal(x.filter_counts.find(x=>x.filter==='html5_2d').result_count,539);
 assert.equal(x.filter_counts.find(x=>x.filter==='es_419_2d').result_count,174);
 assert.equal(x.filter_counts.find(x=>x.filter==='last_30_days_2d').result_count,66);
 assert.equal(x.filter_counts.find(x=>x.filter==='windows_2d').result_count,4013);
 assert(x.filter_counts.every(x=>x.verified_paid_unit_sales===null&&x.verified_unique_paying_buyers===null&&x.is_entire_commercial_seller_population===false));
 assert(Object.values(x.unobserved).every(x=>x===null));
 assert.equal(x.separate_prior_filter_frame.not_matched_with_top_sellers_frame,true);
});

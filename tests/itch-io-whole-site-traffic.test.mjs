import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Third-party site traffic spread never creates paid game demand',()=>{
 const m=get('ontology/itch-io/whole-site-traffic-model-comparison-2026.json');
 const d=get('specimens/itch-io.json'),ids=new Set(d.evidence.map(x=>x.id));
 assert(m.source_ids.every(x=>ids.has(x)));
 assert.deepEqual(m.models.map(x=>x.estimated_visits),[162370000,60600000]);
 assert.equal(m.cross_model.visit_estimate_ratio_semrush_to_similarweb,2.68);
 assert(m.models.every(x=>x.modeled_not_metered&&x.paying_customers===null&&x.commercial_conversion_rate===null));
 assert.equal(m.cross_model.buyer_estimate_from_visits_permitted,false);
 assert.equal(m.geography.geographic_visit_shares_are_paying_customer_shares,false);
 assert(Object.values(m.unobserved).every(x=>x===null));
});

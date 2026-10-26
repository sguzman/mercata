import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Third-party itch.io site visits remain modeled sessions, not paid game buyers',()=>{
 const x=get('ontology/itch-io/semrush-domain-traffic-2026.json');
 const d=get('specimens/itch-io.json');
 assert.equal(x.site_traffic_estimates.months[2].estimated_visits,162370000);
 assert.equal(x.september_geography_estimates.country_rows[0].share_percent,26.9);
 assert.equal(x.traffic_acquisition_estimates.separate_from_all_device_country_share,true);
 assert.equal(x.september_geography_estimates.country_payment_eligibility_inferred,false);
 assert(Object.values(x.unsupported).every(v=>v===null));
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
});

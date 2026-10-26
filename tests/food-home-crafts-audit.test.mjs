import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditFoodHomeCrafts} from '../site/food-home-crafts-audit.mjs';
const read=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
const get=()=>Promise.all([
 read('ontology/youtube/food-home-crafts-crosswalk-2026.json'),
 read('specimens/youtube.json'),
 read('ontology/youtube/topic-observations.json'),
 read('ontology/youtube/niche-upload-volume-2024-2026.json')
]);
test('11 first-party observations keep video-view events and uploaded video objects separate',async()=>{
 const [m,d,t,u]=await get();
 const ids=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditFoodHomeCrafts(m,ids,t,u),{valid:true,errors:[]});
 assert.equal(m.category_rules.length,5);
 assert.equal(m.observed_records.length,11);
 assert.equal(m.observed_records.filter(x=>x.unit==='video_view_events').length,7);
 assert.equal(m.observed_records.filter(x=>x.unit==='uploaded_video_objects').length,4);
 const bread=m.observed_records.find(x=>x.id==='sourdough_title_2025');
 assert.equal(bread.strict_lower_bound,500000000);
 assert.equal(bread.period,'2025-01-01 to 2025-10-25');
 assert.equal(m.restaurant_review_channels,null);
 assert.equal(m.kitchen_equipment_review_channels,null);
 assert.equal(m.category_population_sums_permitted,false);
});
test('Crosswalk rejects invented paid creators and altered upload source counts',async()=>{
 const [m,d,t,u]=await get();const ids=new Set(d.evidence.map(x=>x.id));
 const q=structuredClone(m);q.observed_records.find(x=>x.id==='cake_decoration_related').strict_lower_bound=500001;
 assert(auditFoodHomeCrafts(q,ids,t,u).errors.some(x=>x.includes('Upload observation altered')));
 const v=structuredClone(m);v.category_rules[0].creator_income=100;
 assert(auditFoodHomeCrafts(v,ids,t,u).errors.includes('Category population or earnings invented'));
 const w=structuredClone(m);w.views_vs_uploads_comparable=true;
 assert(auditFoodHomeCrafts(w,ids,t,u).errors.includes('Incompatible topic counts falsely combined'));
});

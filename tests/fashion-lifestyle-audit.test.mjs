import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectFashionContentSignal,compareFashionSignals,inferAudienceGender} from '../site/fashion-lifestyle-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Three dated official title-filter samples are separately attributed',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/fashion-lifestyle-content-signals-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(m.content_categories.length,6);
 assert.deepEqual(m.observations.map(x=>x.strict_lower_bound),[6000000000,25000000,100000000]);
 assert.deepEqual(m.observations.map(x=>x.window_start),['2023-01-01','2024-01-01','2025-01-01']);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Selected view events cannot be repurposed as year-on-year trend or income',async()=>{
 const m=await load('ontology/youtube/fashion-lifestyle-content-signals-2026.json');
 const x=selectFashionContentSignal(m,'grwm_2023_jan_jun_title');
 assert.equal(x.valid,true);assert.equal(x.value_lower_bound,6000000000);
 assert.equal(x.creator_earnings,null);
 assert.equal(x.buyer_conversion,null);
 assert.equal(compareFashionSignals(m,'grwm_2023_jan_jun_title','prom_grwm_2024').allowed,false);
 assert.equal(compareFashionSignals(m,'prom_grwm_2024','beginner_sewing_machine_2025').allowed,false);
});
test('Lifestyle subject does not imply a viewer demographic identity',async()=>{
 const m=await load('ontology/youtube/fashion-lifestyle-content-signals-2026.json');
 for(const category of m.content_categories){
  assert.equal(category.audience_gender_requirement,null);
  assert.equal(inferAudienceGender(m,category.id).allowed,false);
 }
});
test('Public site separates topical evidence from gender inference or creator income',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderFashionLifestyleSignals'));
 assert(app.includes('fashion-lifestyle-content-signals-2026.json'));
 assert(app.includes('not audience sex or gender or typical creator earnings'));
});

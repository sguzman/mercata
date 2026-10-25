import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {evaluateConditionalYouTubeWithholding,auditWithholdingScenario} from '../site/youtube-withholding-scenario.mjs';
const load=async f=>JSON.parse(await fs.readFile(new URL('../'+f,import.meta.url),'utf8'));
const tax=await load('ontology/youtube/tax-withholding-mechanics.json');
const input=(case_id,rate=null)=>({case_id,currency:'USD',worldwide_native_earnings:1000,us_viewer_native_earnings:100,approved_us_viewer_withholding_rate_percent:rate});
test('Four rule-specific withholding bases are not interchangeable',()=>{
 const a=evaluateConditionalYouTubeWithholding(input('non_us_valid_tax_info',10),tax);
 assert.equal(a.conditional_withholding,10);
 assert.equal(a.illustrative_tax_base,100);
 assert.equal(a.remaining_native_amount_before_other_adjustments,990);
 assert.equal(a.actual_withholding,null);
 const b=evaluateConditionalYouTubeWithholding(input('non_us_business_tax_info_missing'),tax);
 assert.equal(b.conditional_withholding,30);
 assert.equal(b.illustrative_tax_base,100);
 const c=evaluateConditionalYouTubeWithholding(input('individual_tax_info_missing'),tax);
 assert.equal(c.conditional_withholding,240);
 assert.equal(c.illustrative_tax_base,1000);
 const d=evaluateConditionalYouTubeWithholding(input('us_creator_valid_tax_info'),tax);
 assert.equal(d.conditional_withholding,0);
 assert.equal(d.ultimate_income_tax_liability,null);
});
test('Never assume treaty rates, worldwide rate on US-only base or currency conversion',()=>{
 assert.throws(()=>evaluateConditionalYouTubeWithholding(input('non_us_valid_tax_info'),tax),/Explicit confirmed/);
 assert.throws(()=>evaluateConditionalYouTubeWithholding(input('non_us_valid_tax_info',35),tax),/between 0 and 30/);
 assert.throws(()=>evaluateConditionalYouTubeWithholding(input('non_us_business_tax_info_missing',15),tax),/not an arbitrary/);
 const impossible=input('individual_tax_info_missing');impossible.us_viewer_native_earnings=2000;assert.throws(()=>evaluateConditionalYouTubeWithholding(impossible,tax),/cannot exceed/);
 const fraction=input('non_us_valid_tax_info',10);fraction.worldwide_native_earnings=1.001;assert.throws(()=>evaluateConditionalYouTubeWithholding(fraction,tax),/two decimals/);
});
test('Public tax study has no personal cases, paid withholding or local taxes',async()=>{
 const dossier=await load('specimens/youtube.json'),sources=new Set(dossier.evidence.map(e=>e.id));
 assert.deepEqual(auditWithholdingScenario(tax,sources),{valid:true,errors:[]});
 assert.equal(tax.conditional_arithmetic.observed_cases.length,0);
});

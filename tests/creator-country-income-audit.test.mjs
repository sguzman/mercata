import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateOwnerCountryPanel,compareCreatorResidenceIncome,adjustCreatorConsumptionPPP} from '../site/creator-country-income-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Country income provenance separates viewer country, creator residence and payment geography',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-country-income-comparability.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.deepEqual(m.country_codes,['MX','US','GB']);
 assert.equal(m.source_data.audience_geography_is_creator_residence,false);
 assert.equal(m.source_data.owner_revenue_access,'monetized_channel_owner_oauth_with_yt_analytics_monetary_readonly');
 assert.equal(m.source_data.country_report_dimensions[0],'country');
 assert.equal(m.source_data.monthly_country_filter_report.dimensions[0],'month');
 assert.equal(m.source_data.unknown_country_code,'ZZ');
 assert.equal(m.source_data.unauthorized_queries_executed,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Authorized viewer-country comparison does not produce an owner-residence distribution',async()=>{
 const m=await load('ontology/youtube/creator-country-income-comparability.json');
 const input={researchPurpose:'viewer_country_estimated_revenue',ownerAuthorized:true,yppApproved:true,monetaryScopeGranted:true,channelId:'UCsample',startDate:'2026-01-01',endDate:'2026-03-31',currency:'USD',viewerCountries:['US','MX']};
 const r=validateOwnerCountryPanel(m,input);
 assert.equal(r.ready,true);assert.equal(r.observed_country_revenue,null);assert.equal(r.creator_residence_income,null);
 assert.deepEqual(r.country_codes,['US','MX']);
 assert.equal(validateOwnerCountryPanel(m,{...input,viewerCountries:['US','US']}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,viewerCountries:['US','ZZ']}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,ownerAuthorized:false}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,yppApproved:false}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,monetaryScopeGranted:false}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,researchPurpose:'creator_country_income'}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,startDate:'2026-02-30'}).ready,false);
 assert.equal(validateOwnerCountryPanel(m,{...input,currency:null}).ready,false);
});
test('No fabricated creator residence income, purchasing power or zero-earner shares',async()=>{
 const m=await load('ontology/youtube/creator-country-income-comparability.json');
 const a=compareCreatorResidenceIncome(m,{creatorCountry:'MX'});
 assert.equal(a.allowed,false);assert.equal(a.creator_median_income,null);assert.equal(a.creator_zero_earner_share,null);
 const b=adjustCreatorConsumptionPPP(m,{country:'MX',income:123,currency:'MXN'});
 assert.equal(b.allowed,false);assert.equal(b.adjusted_income,null);
 assert.equal(m.purchasing_power.actual_fx_by_date,null);
});
test('Dossier exposes scope distinctions instead of invented geographic income ranks',async()=>{
 const s=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(s.includes('renderCreatorCountryIncomeComparability'));
 assert(s.includes('creator-country-income-comparability.json'));
 assert(s.includes('Viewer country is not creator residence'));
});

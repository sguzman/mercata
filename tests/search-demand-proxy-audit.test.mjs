import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditSearchDemand,compareDemandIndex} from '../site/search-demand-proxy-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Search demand proxies are sourced but do not assert monthly counts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/search-demand-proxy-crosswalk.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditSearchDemand(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Index difference cannot be compared between services, countries or panels',()=>{
 const a={query:'guitar',query_kind:'topic',search_service:'YouTube Search',country:'MX',language:'es',time_range:'2025',category:'all',comparison_panel:'A',definition_epoch:'2025',index:30};
 for(const b of [{...a,country:'US'},{...a,search_service:'Web Search'},{...a,comparison_panel:'B'}])assert.equal(compareDemandIndex(a,b).status,'incomparable');
 const result=compareDemandIndex(a,{...a,index:70});
 assert.equal(result.index_difference,40);
 assert.equal(result.absolute_searches,null);
 assert.equal(result.creator_income_effect,null);
});
test('Fabricated volume fails audit',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/search-demand-proxy-crosswalk.json'),load('specimens/youtube.json')]);
 m.proxies[0].absolute_searches=50000;
 assert(auditSearchDemand(m,new Set(d.evidence.map(x=>x.id))).errors.includes('invented volume'));
});

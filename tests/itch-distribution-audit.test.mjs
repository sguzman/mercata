import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditDistributionPlan} from '../site/itch-distribution-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Channel manifest checks upload constraints without claiming runtime QA',()=>{
 const okay=auditDistributionPlan({channels:[{channel:'linux-universal',platform:'linux',uncompressed_bytes:2000000000},
   {channel:'windows-release',platform:'windows',uncompressed_bytes:2500000000}]});
 assert.equal(okay.static_manifest_ok,true);
 assert.equal(okay.executables_tested,null);
 assert.equal(okay.potential_sales,null);
 const bad=auditDistributionPlan({channels:[{channel:'linux',platform:'linux',uncompressed_bytes:30000000001},
   {channel:'linux',platform:'windows',uncompressed_bytes:2}]});
 assert.equal(bad.static_manifest_ok,false);
 assert(bad.errors.includes('duplicate_channel:linux'));
 assert(bad.errors.includes('oversize_build:linux'));
 assert.throws(()=>auditDistributionPlan({channels:[{channel:'html5',platform:'html5',uncompressed_bytes:null}]}));
});
test('Unmeasured distribution effort remains unknown',()=>{
 const d=read('ontology/itch-io/distribution-build-2026.json');
 assert.equal(d.butler.incremental_patches,true);
 assert.equal(d.butler.uncompressed_build_size_limit_bytes,30000000000);
 assert(Object.values(d.unmeasured).every(v=>v===null));
});

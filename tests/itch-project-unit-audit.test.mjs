import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditItchProjectUnits} from '../site/itch-project-unit-audit.mjs';
const model=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/project-file-build-identity-2026.json',import.meta.url),'utf8'));
test('one page with demo and two update channels is not multiple sold games',()=>{
 const a=auditItchProjectUnits([{page_id:'sample',uploads:[{file_id:'demo',type:'demo'},{file_id:'full',type:'game_download'},{file_id:'browser',type:'html5_archive'}],channels:[{channel_id:'linux',build_ids:['a','b','c']},{channel_id:'windows',build_ids:['d'] }]}]);
 assert.equal(a.valid,true);assert.equal(a.project_page_count,1);assert.equal(a.file_upload_count,3);
 assert.equal(a.build_revision_count,4);assert.equal(a.channel_count,2);assert.equal(a.demo_upload_count,1);
 for(const k of ['distinct_selling_people','active_paid_publishers','positive_price_game_count','paid_orders','unique_buyers','profit'])assert.equal(a[k],null,k);
});
test('invalid duplicate pages/files/build revisions cannot inflate supply',()=>{
 const example={page_id:'a',uploads:[{file_id:'x',type:'demo'},{file_id:'x',type:'demo'}],channels:[{channel_id:'linux',build_ids:['v1','v1']}]};
 assert.equal(auditItchProjectUnits([example]).valid,false);
 assert.equal(auditItchProjectUnits([example,example]).valid,false);
});
test('ontology grounded in first party platform documentation',()=>{
 const d=JSON.parse(fs.readFileSync(new URL('../specimens/itch-io.json',import.meta.url),'utf8'));
 assert(model.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(model.verified_paid_orders,null);
 assert.equal(model.entities.length,7);
});

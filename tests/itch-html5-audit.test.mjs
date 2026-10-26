import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessHtml5Manifest} from '../site/itch-html5-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('HTML5 static ZIP constraints do not imply a valid runnable product',()=>{
 const ok=assessHtml5Manifest({files:[{path:'index.html',bytes:1024},{path:'assets/sprite.png',bytes:999}]});
 assert.equal(ok.static_manifest_ok,true);
 assert.equal(ok.game_runs,null);assert.equal(ok.works_on_mobile,null);
 const bad=assessHtml5Manifest({files:[{path:'INDEX.HTML',bytes:1},{path:'assets/foo',bytes:200000001}]});
 assert.equal(bad.static_manifest_ok,false);
 assert(bad.issues.some(s=>s.includes('missing_root_index_html')));
 assert(bad.issues.some(s=>s.includes('large_file')));
 assert.throws(()=>assessHtml5Manifest({files:[{path:'index.html',bytes:null}]}));
});
test('Commercial format crosswalk retains unknown outcomes and independently attributed source evidence',()=>{
 const model=get('ontology/itch-io/release-format-access-2026.json');
 const dossier=get('specimens/itch-io.json');
 const sources=new Set(dossier.evidence.map(x=>x.id));
 assert(model.source_ids.every(id=>sources.has(id)));
 assert.equal(model.formats.find(x=>x.id==='html5_embedded').buy_to_play_native,false);
 assert.equal(model.html5_zip_defaults.maximum_file_count,1000);
 assert.deepEqual(model.visibility_modes,['draft','restricted','public']);
 assert(Object.values(model.unmeasured).every(x=>x===null));
 for(const c of dossier.claims.filter(x=>x.id.startsWith('html5-')||x.id.startsWith('access-'))){
  assert(c.source_ids.every(id=>sources.has(id))&&c.limitations);
 }
});

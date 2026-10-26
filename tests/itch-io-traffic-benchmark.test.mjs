import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Volunteer itch.io traffic survey excludes commercial outcome extrapolation',()=>{
 const m=read('ontology/itch-io/traffic-benchmark-2025.json'),d=read('specimens/itch-io.json');
 assert.equal(m.self_selected_developer_respondents,169);
 assert.equal(m.game_level_n,null);assert.equal(m.commercial_paid_games_n,null);
 const views=m.measures.find(x=>x.id==='primary_lifetime_views');
 assert.equal(views.median,1582);assert.equal(views.mean,54483);
 assert(m.conflicting_publication_figures.some(x=>x.field==='lifetime_download_mean'&&x.first===6017&&x.second===58976));
 assert(Object.values(m.cannot_infer).every(v=>v===null));
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
});

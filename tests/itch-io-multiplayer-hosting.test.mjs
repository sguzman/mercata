import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Static itch distribution cannot be misreported as included custom game server hosting',()=>{
 const x=get('ontology/itch-io/multiplayer-hosting-boundary-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.platform_services.project_page_hosted,true);
 assert.equal(x.platform_services.browser_static_assets_hosted,true);
 assert.equal(x.platform_services.custom_dedicated_game_server_execution_supplied_by_itch,false);
 assert.equal(x.platform_services.existing_publisher_account_used,false);
 const offline=x.networking_scenarios.find(s=>s.id==='offline_solo_2d');
 assert.equal(offline.incremental_multiplayer_server_monthly_cost_usd,0);
 const online=x.networking_scenarios.find(s=>s.id==='online_dedicated_backend');
 assert.equal(online.incremental_multiplayer_server_monthly_cost_usd,null);
 assert.equal(online.required_custom_public_multiplayer_server,true);
 assert(Object.values(x.unobserved).every(v=>v===null));
});

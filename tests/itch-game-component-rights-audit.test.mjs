import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchGameComponentRights} from '../site/itch-game-component-rights-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const font={component_id:'ui_font',asset_kind:'font',origin_url:'https://example.invalid/font',creator_or_copyright_holder:'fictional font designer',license_id:'OFL-1.1',version_or_asset_identity:'1.0',distributed_in_release:true,commercial_distribution_grant_verified:true,notice_file_or_embedded_license:'synthetic/OFL.txt',modification_state:'original',reserved_font_name_used:false};
test('Font can be commercially bundled but retained notices and modified reserved names matter',()=>{
 const ok=auditItchGameComponentRights([font]);
 assert.equal(ok.meets_pre_release_inventory_gate,true);assert.equal(ok.legal_clearance_certified,false);
 assert.equal(auditItchGameComponentRights([{...font,notice_file_or_embedded_license:null}]).meets_pre_release_inventory_gate,false);
 assert.equal(auditItchGameComponentRights([{...font,modification_state:'modified',reserved_font_name_used:true,reserved_font_name_permission_verified:false}]).meets_pre_release_inventory_gate,false);
});
test('Unknown, duplicate, NC asset and GPL source delivery cannot be called release-ready',()=>{
 assert.equal(auditItchGameComponentRights([]).inventory_documented,false);
 assert.equal(auditItchGameComponentRights([font,font]).meets_pre_release_inventory_gate,false);
 const art={...font,component_id:'art',asset_kind:'sprite_or_artwork',license_id:'CC-BY-NC-4.0'};
 assert.equal(auditItchGameComponentRights([art]).meets_pre_release_inventory_gate,false);
 const code={...font,component_id:'code',asset_kind:'code_library',license_id:'GPL-3.0'};
 assert.equal(auditItchGameComponentRights([code]).meets_pre_release_inventory_gate,false);
});
test('Third-party game asset tracking task has valid source basis, not real legal clearance',()=>{
 const x=get('ontology/itch-io/game-component-rights-register-2026.json'),p=get('plans/itch-io.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(x.tracked_classes.includes('music_or_sound'));
 assert(x.tracked_classes.includes('font'));
 assert.equal(x.all_components_actual_inventory_complete,false);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/rights/track-third-party-game-licenses');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-game-component-rights-audit.test.mjs'));
});

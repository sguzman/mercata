import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamPartnerRoleFixture as audit} from '../site/steam-partner-role-rights-crosswalk.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-partner-role-rights-crosswalk-2026.json');
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('App sharing enables management but not second partner payment or price control',()=>{
 const r=audit({arrangement:'app_share'});
 assert.equal(r.recipient_has_app_management_access,true);
 assert.equal(r.original_partner_retains_payment_rights,true);
 assert.equal(r.recipient_partner_payment_rights,false);
 assert.equal(r.recipient_partner_can_set_prices_and_discounts,false);
 assert.equal(r.recipient_user_can_view_current_partner_financials,false);
 assert.equal(r.actual_copyright_owner,null);
});
test('Shared financial read needs both partner invite and individual viewer permission',()=>{
 for(const [invite,user,expected] of [[false,false,false],[true,false,false],[false,true,false],[true,true,true]]){
  const r=audit({arrangement:'app_share',finance_invite_granted:invite,user_view_financials:user});
  assert.equal(r.recipient_user_can_view_current_partner_financials,expected);
  assert.equal(r.recipient_partner_payment_rights,false);
 }
});
test('Completed app transfer changes payee, not automatically historical financial visibility',()=>{
 const x=audit({arrangement:'completed_app_transfer',user_view_financials:true});
 assert.equal(x.recipient_partner_payment_rights,true);
 assert.equal(x.original_partner_retains_payment_rights,false);
 assert.equal(x.recipient_partner_can_set_prices_and_discounts,true);
 assert.equal(x.recipient_has_historical_wishlist_reporting,true);
 assert.equal(x.recipient_user_can_view_historical_pretransfer_financials,false);
 const y=audit({arrangement:'completed_app_transfer',user_view_financials:true,historic_financial_access_granted:true});
 assert.equal(y.recipient_user_can_view_historical_pretransfer_financials,true);
 assert.equal(y.actual_signed_SDA_license_grants,null);
});
test('Public storefront credit alone cannot establish payment, access or IP rights',()=>{
 const r=audit({arrangement:'storefront_credit_only'});
 for(const k of ['recipient_has_app_management_access','recipient_partner_payment_rights',
  'recipient_partner_can_set_prices_and_discounts','recipient_user_can_view_current_partner_financials',
  'actual_copyright_owner','actual_developer_publisher_royalty_split','real_partner_bank_receipts'])
   assert.equal(r[k],null,k);
});
test('Unexpected private fields or contradictory permission scenarios fail closed',()=>{
 assert.throws(()=>audit({arrangement:'app_share',partner_email:'private'}),/Only synthetic/);
 assert.throws(()=>audit({arrangement:'app_share',historic_financial_access_granted:true}),/Historic transfer/);
 assert.throws(()=>audit({arrangement:'completed_app_transfer',finance_invite_granted:true}),/Finance invite/);
 assert.throws(()=>audit({arrangement:'storefront_credit_only',user_view_financials:true}),/public credit/);
 assert.throws(()=>audit({arrangement:'app_share',user_view_financials:'yes'}),/booleans/);
});
test('Bounded claims cite public sources without altering original task inventory',()=>{
 assert.equal(study.source_ids.length,6);assert.equal(study.claim_ids.length,8);
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 for(const s of study.source_ids)assert(ss.has(s),s);
 for(const id of study.claim_ids)assert(cc.has(id)&&cc.get(id).source_ids.every(s=>ss.has(s)),id);
 assert(Object.values(study.unknown).every(x=>x===null));
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

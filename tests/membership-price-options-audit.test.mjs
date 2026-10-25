import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditOfficialMembershipOptions} from '../site/membership-price-options-audit.mjs';
const load=async f=>JSON.parse(await fs.readFile(new URL('../'+f,import.meta.url),'utf8'));
test('25 verified official price options; six increases and 19 unchanged',async()=>{
 const [data,d]=await Promise.all([load('ontology/youtube/membership-price-options-mx-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditOfficialMembershipOptions(data,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[],changed:6});
 assert.equal(data.tiers[0].mx_previous_mxn_cents,900);
 assert.equal(data.tiers[0].mx_new_mxn_cents,1900);
 assert.equal(data.tiers.at(-1).mx_new_mxn_cents,999900);
});
test('Never infer paid member distribution or a uniform switchover from price menus',async()=>{
 const [data,d]=await Promise.all([load('ontology/youtube/membership-price-options-mx-2026.json'),load('specimens/youtube.json')]);const known=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(data);
 const a=copy();a.tiers[3].mx_new_mxn_cents=3900;assert(!auditOfficialMembershipOptions(a,known).valid);
 const b=copy();b.channels_sampled=25;assert(!auditOfficialMembershipOptions(b,known).valid);
 const c=copy();c.universal_switch_date='2025-05-01';assert(!auditOfficialMembershipOptions(c,known).valid);
});

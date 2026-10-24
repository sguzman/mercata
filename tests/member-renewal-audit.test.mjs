import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessPaidRenewals,auditMemberCohortProtocol} from '../site/member-renewal-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const synthetic={source:'authorized_creator_aggregate',cohort_id:'synthetic-only',billing_basis:'actual_renewal_due_dates',period_start:'2026-01-01',period_end:'2026-02-10',due:100,paid_renewed:64,not_renewed:26,unresolved:10,trial_only:40,gifted:5};
test('Cohort dossier has sources but no observed members or treatment lift',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/member-cohort-protocol.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditMemberCohortProtocol(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Unresolved dues yield bounded renewal, not invented complete rate',()=>{
 const x=assessPaidRenewals(synthetic);
 assert.equal(x.status,'bounded_missing_outcomes');
 assert.equal(x.rate,null);assert.equal(x.lower,0.64);assert.equal(x.upper,0.74);
 assert.equal(x.causal_effect_verified,false);
});
test('A complete synthetic renewal cohort is descriptive only',()=>{
 const x=assessPaidRenewals({...synthetic,not_renewed:36,unresolved:0});
 assert.equal(x.status,'descriptive_paid_cohort_rate');assert.equal(x.rate,0.64);assert.equal(x.upper,0.64);
});
test('Invalid dates, denominators, trial substitution and missing provenance are rejected',()=>{
 for(const x of [
  {...synthetic,source:'scraped_public_profiles'},
  {...synthetic,billing_basis:'rolling_28_day_viewers'},
  {...synthetic,due:90},
  {...synthetic,paid_renewed:110},
  {...synthetic,trial_only:-1},
  {...synthetic,period_start:'2026-02-30'},
  {...synthetic,period_end:'2025-12-31'},
  {...synthetic,paid_renewed:64.1}
 ])assert.equal(assessPaidRenewals(x).status,'invalid');
 assert.equal(assessPaidRenewals({...synthetic,due:0,paid_renewed:0,not_renewed:0,unresolved:0}).status,'no_due_renewals');
});

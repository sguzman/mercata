import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessCollectedPayout} from '../site/itch-collected-payout-check.mjs';
const d=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/collected-payout-costs-2026.json',import.meta.url),'utf8'));
test('Collected payouts require explicit fee and date uncertainty',()=>{
 assert.equal(d.collected.tax_identity_verification_once_usd,3);
 assert.equal(d.collected.minimum_available_balance_usd,5);
 assert.equal(d.earliest_possible_request_to_completion_days_after_first_eligible_sale,14);
 assert.equal(d.is_promised_delivery_date,false);
 assert(Object.values(d.unknown).every(v=>v===null));
});
test('Eligibility evaluator cannot claim bank payout',()=>{
 const args={balanceUsd:5,saleAgeDays:7,taxInterviewCompleted:true,payoutMethodSelected:true,outstandingRequests:0};
 const good=assessCollectedPayout(args);
 assert.equal(good.could_request_based_on_supplied_conditions,true);
 assert.equal(good.final_bank_amount_usd,null);assert.equal(good.guaranteed_payout_date,null);
 assert.equal(assessCollectedPayout({...args,balanceUsd:4.99}).could_request_based_on_supplied_conditions,false);
 assert.equal(assessCollectedPayout({...args,outstandingRequests:3}).could_request_based_on_supplied_conditions,false);
 assert.throws(()=>assessCollectedPayout({...args,taxInterviewCompleted:null}));
});

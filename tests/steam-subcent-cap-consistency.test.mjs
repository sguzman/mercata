import test from 'node:test';
import assert from 'node:assert/strict';
import {boundSyntheticSteamGrossMean as mean} from '../site/steam-gross-mean-nonresponse-bounds.mjs';
import {boundSyntheticSteamGrossOrderMedian as median} from '../site/steam-gross-median-bounds.mjs';

// Invented non-identifying fixtures only, never real merchant reports.
const fixture=(floorKey,floorValue,capKey,capValue)=>({
 eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
 missing:[{fixture_id:'fixture-subcent',horizon_days:30,
  [floorKey]:floorValue,partial_gross_verified:true,
  partial_horizon_attested:true,paid_checkout_attribution_attested:true,
  financial_access_attested:true,[capKey]:capValue,cap_verified:true}]
});
test('A cap below an authenticated partial floor is rejected before cent rounding',()=>{
 for(const args of [
  fixture('observed_partial_gross_usd_4dp','1.0101','verified_upper_cap_usd_4dp','1.0100'),
  fixture('observed_partial_gross_usd_4dp','1.0001','verified_upper_cap_usd_cents',100),
  fixture('observed_partial_gross_usd_cents',101,'verified_upper_cap_usd_4dp','1.0099')
 ]){
  assert.throws(()=>mean(args),/before cent rounding/);
  assert.throws(()=>median(args),/before cent rounding/);
 }
});
test('Valid distinct fractional bounds do not become false exact cents',()=>{
 const args=fixture('observed_partial_gross_usd_4dp','1.0001',
  'verified_upper_cap_usd_4dp','1.0002');
 const m=mean(args),d=median(args);
 assert.equal(m.lower_mean_gross_usd_cents,100);
 assert.equal(m.upper_mean_gross_usd_cents,101);
 assert.equal(m.point_identified,false);
 assert.equal(d.gross_lower_median_lower_bound_usd_cents,100);
 assert.equal(d.gross_lower_median_upper_bound_usd_cents,101);
 assert.equal(d.median_point_identified,false);
});
test('Identical exact cent values remain identified only in the synthetic frame',()=>{
 const args=fixture('observed_partial_gross_usd_4dp','1.0100',
  'verified_upper_cap_usd_cents',101);
 assert.equal(mean(args).point_identified,true);
 assert.equal(median(args).median_point_identified,true);
 assert.equal(mean(args).actual_platform_mean_gross,null);
 assert.equal(median(args).actual_steam_median_gross,null);
});

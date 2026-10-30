// Pure arithmetic audit of published third-party festival snapshots, not Steam merchant records.
const safe=x=>Number.isSafeInteger(x)&&x>=0;
const object=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const sp=x=>typeof x==='number'&&Number.isFinite(x)&&x>=-1&&x<=1;
export function auditSteamFestSnapshotComparability(input={}){
 if(!object(input,['early','final','frame_match_verified']))throw new TypeError('Unexpected festival audit input');
 const {early:e,final:f,frame_match_verified:matched}=input;
 if(!object(e,['roster','rank_groups','rho_followers','rho_adds','rho_growth'])||
  !object(f,['roster','demos_with_recorded_players','combined_peak_players']))
  throw new TypeError('Malformed public snapshot fields');
 if(!safe(e.roster)||!safe(f.roster)||!e.roster||!f.roster||
  !Array.isArray(e.rank_groups)||e.rank_groups.length!==4||
  e.rank_groups.some(g=>!object(g,['count','median_followers'])||
    !safe(g.count)||!safe(g.median_followers))||
  !safe(f.demos_with_recorded_players)||f.demos_with_recorded_players>f.roster||
  !safe(f.combined_peak_players)||
  !sp(e.rho_followers)||!sp(e.rho_adds)||!sp(e.rho_growth))
  throw new RangeError('Invalid roster, concurrent-player measurement or rank association');
 const groups=e.rank_groups.reduce((a,g)=>a+g.count,0);
 if(!Number.isSafeInteger(groups)||groups>e.roster)throw new RangeError('Early rank groups exceed the published roster');
 if(matched!==false)throw new RangeError('No aligned same-ID festival roster comparison exists');
 return {
  early_roster_count:e.roster,
  early_rank_group_assigned:groups,
  early_rank_group_unclassified:e.roster-groups,
  final_monitored_demo_roster:f.roster,
  final_demos_with_recorded_players:f.demos_with_recorded_players,
  final_no_recorded_player_demo_count:f.roster-f.demos_with_recorded_players,
  nominal_roster_difference:f.roster-e.roster,
  early_spearman_pre_followers_to_peak_ccu:e.rho_followers,
  early_spearman_absolute_adds_to_peak_ccu:e.rho_adds,
  early_spearman_percent_growth_to_peak_ccu:e.rho_growth,
  final_combined_peak_concurrent_players:f.combined_peak_players,
  verified_newly_admitted_demos:null,
  actual_zero_unique_demo_players:null,
  real_demo_to_paid_sale_rate:null,
  causal_marketing_or_algorithm_effect:null,
  source_rosters_directly_comparable:false,
  limitation:'Independent scrapes at different times with different measurement rules; missing CCU and missing rank-bin classifications cannot be promoted to zero players or new entries.'
 };
}

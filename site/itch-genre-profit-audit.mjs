// Validate whether manually source-linked game rows could support genre-profit inference.
export function auditGenreProfitComparison(study){
 if(!study||!Array.isArray(study.rows)||!study.target)throw new TypeError('Study and target required');
 const errors=[],ids=new Set();
 let fullyObserved=0;
 for(const r of study.rows){
  if(typeof r.id!=='string'||!r.id||ids.has(r.id)){errors.push('Duplicate or missing game ID');continue;}
  ids.add(r.id);
  if(!Array.isArray(r.genre_tags)||r.genre_tags.length===0)errors.push('Missing game genre');
  if(!Array.isArray(r.source_ids)||r.source_ids.length===0)errors.push('Missing source attribution');
  if(r.itch_paid_game_orders!==null&&(!Number.isSafeInteger(r.itch_paid_game_orders)||r.itch_paid_game_orders<0))errors.push('Bad paid unit count');
  if(r.developer_final_profit!==null&&(!Number.isFinite(r.developer_final_profit)))errors.push('Invalid monetary outcome');
  if(r.developer_labor_hours!==null&&(!Number.isFinite(r.developer_labor_hours)||r.developer_labor_hours<0))errors.push('Invalid labor hours');
  if(r.developer_final_profit!==null&&r.developer_labor_hours!==null&&r.observation_window==='90_days'&&r.proceeds_basis==='itch_final_profit_after_cash_cost_and_labor'&&r.currency===study.target.common_currency)fullyObserved++;
 }
 const populationFrameVerified=study.study?.developers_independent_verified_across_all_rows===true&&study.study?.cases_selected_from_public_disclosure===false&&study.target.actual_representative_sample_required===true;
 const canCompare=errors.length===0&&populationFrameVerified&&fullyObserved>=2;
 return {valid:errors.length===0,errors,rows:ids.size,complete_matching_profit_rows:fullyObserved,representative_population_frame:populationFrameVerified,
  genre_profit_comparison_supported:canCompare,genre_mean_net_profit: null,genre_median_net_profit:null,
  notes:canCompare?'Eligibility gate only; sampled genre sizes and independent inference still need verification.':'Selected transaction and genre labels do not establish comparable labor-valued store-specific seller profit.'};
}

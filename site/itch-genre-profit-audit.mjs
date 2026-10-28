// Validate whether manually source-linked game rows could support genre-profit inference.
export function auditGenreProfitComparison(study){
 if(!study||!Array.isArray(study.rows)||!study.target)throw new TypeError('Study and target required');
 const errors=[],ids=new Set(),eligibleGenres=new Map();
 let fullyObserved=0;
 for(const r of study.rows){
  if(typeof r.id!=='string'||!r.id||ids.has(r.id)){errors.push('Duplicate or missing game ID');continue;}
  ids.add(r.id);
  const validGenres=Array.isArray(r.genre_tags)&&r.genre_tags.length>0&&
   r.genre_tags.every(g=>typeof g==='string'&&g.trim()===g&&g.length>0)&&
   new Set(r.genre_tags).size===r.genre_tags.length;
  if(!validGenres)errors.push('Missing or malformed game genre');
  if(!Array.isArray(r.source_ids)||r.source_ids.length===0||
   r.source_ids.some(s=>typeof s!=='string'||!s.trim()))
   errors.push('Missing source attribution');
  if(r.itch_paid_game_orders!==null&&(!Number.isSafeInteger(r.itch_paid_game_orders)||r.itch_paid_game_orders<0))errors.push('Bad paid unit count');
  if(r.developer_final_profit!==null&&(!Number.isFinite(r.developer_final_profit)))errors.push('Invalid monetary outcome');
  if(r.developer_labor_hours!==null&&(!Number.isFinite(r.developer_labor_hours)||r.developer_labor_hours<0))errors.push('Invalid labor hours');
  if(validGenres&&r.developer_final_profit!==null&&Number.isFinite(r.developer_final_profit)&&
   r.developer_labor_hours!==null&&Number.isFinite(r.developer_labor_hours)&&r.developer_labor_hours>=0&&
   r.observation_window==='90_days'&&r.proceeds_basis==='itch_final_profit_after_cash_cost_and_labor'&&
   r.currency===study.target.common_currency){
    fullyObserved++;
    for(const genre of r.genre_tags){
     if(!eligibleGenres.has(genre))eligibleGenres.set(genre,new Set());
     eligibleGenres.get(genre).add(r.id);
    }
   }
 }
 const populationFrameVerified=study.study?.developers_independent_verified_across_all_rows===true&&
  study.study?.cases_selected_from_public_disclosure===false&&
  study.target.actual_representative_sample_required===true&&
  study.target.one_independent_publisher_per_row===true;
 // Two qualifying observations within only one genre do not constitute a genre
 // comparison. Nonexclusive tags can produce identical groups: require each
 // compared genre to contain independently tagged games outside the other group.
 const genres=[...eligibleGenres.entries()];
 let qualifyingGenrePairs=0;
 for(let i=0;i<genres.length;i++)for(let j=i+1;j<genres.length;j++){
  const left=genres[i][1],right=genres[j][1];
  if(left.size>=2&&right.size>=2&&
     [...left].some(x=>!right.has(x))&&[...right].some(x=>!left.has(x)))
   qualifyingGenrePairs++;
 }
 const canCompare=errors.length===0&&populationFrameVerified&&qualifyingGenrePairs>0;
 return {valid:errors.length===0,errors,rows:ids.size,complete_matching_profit_rows:fullyObserved,
  distinct_eligible_genres:eligibleGenres.size,qualifying_genre_pairs:qualifyingGenrePairs,
  representative_population_frame:populationFrameVerified,genre_profit_comparison_supported:canCompare,
  genre_mean_net_profit:null,genre_median_net_profit:null,
  notes:canCompare?'Eligibility gate only; sample sizes, design weights, uncertainty and statistical inference still require verification.':'Selected transaction and genre labels do not establish comparable labor-valued store-specific seller profit.'};
}

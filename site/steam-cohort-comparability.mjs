// Synthetic-only comparability checks. Never infers real publisher income.
export const REQUIRED=['platforms','unit','eligibility','horizon_days','measure','model','time_zero','missingness'];
export function comparableCohorts(a,b){
 if(!a||!b)throw new TypeError('Both cohorts required');
 const differences=REQUIRED.filter(k=>a[k]===undefined||b[k]===undefined||a[k]===null||b[k]===null||JSON.stringify(a[k])!==JSON.stringify(b[k]));
 return {comparable:!differences.length,differences,independent_data_validation_required:true};
}
export function summarizeSelectedBreakouts(prior,current){
 const good=x=>x&&Number.isSafeInteger(x.total)&&x.total>0&&Number.isSafeInteger(x.indie)&&x.indie>=0&&x.indie<=x.total;
 if(!good(prior)||!good(current))throw new TypeError('Invalid conditional breakout totals');
 return {change_in_selected_games:current.total-prior.total,change_in_indie_selected_games:current.indie-prior.indie,prior_indie_share:prior.indie/prior.total,current_indie_share:current.indie/current.total,probability_any_steam_launch_breaks_out:null,paid_publisher_profit:null};
}

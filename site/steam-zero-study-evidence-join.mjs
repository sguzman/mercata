// Synthetic cross-system evidence gate: a successful financial sync is not a
// census of games that never generated a sale, or of transfer-era financial data.
// No real identifiers, merchant accounts, API keys or financial records accepted.
import {auditSyntheticSteamGameLevelCountryZeroBounds} from './steam-game-country-zero-identification.mjs';
import {auditSyntheticSteamFinancialRefreshLog} from './steam-financial-requery-guards.mjs';
const shape=(x,fields)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>fields.includes(k));
const gateNames=[
 'historical_original_paid_game_roster_reconciled',
 'retired_and_delisted_games_in_frame',
 'early_access_first_paid_dates_and_free_starts_resolved',
 'independent_nontransaction_game_discovery_included',
 'full_paid_period_days_accounted_for_including_no_activity',
 'financial_coverage_for_all_payment_partner_eras',
 'pretransfer_financial_visibility_reconciled',
 'complete_purchase_country_and_package_attribution',
 'country_ledger_rows_linked_to_reconciled_financial_batches',
 'latest_financial_changes_refreshed_through_study_asof'
];
const allowedRoot=['fixture_id','game_country_rows','country_options','financial_refresh_log','independent_attestations'];
export function auditSyntheticSteamZeroStudyReadiness(input={}){
 if(!shape(input,allowedRoot)||typeof input.fixture_id!=='string'||
    !/^fixture-[a-z0-9-]+$/.test(input.fixture_id)||
    !Array.isArray(input.game_country_rows)||
    !shape(input.country_options,['start','endExclusive','asOfDate','game_frame_complete',
     'country_roster_complete','game_roster','store_countries',
     'all_purchase_country_reporting_reconciled_attested'])||
    !shape(input.independent_attestations,gateNames))
  throw new TypeError('Bounded synthetic zero-sale evidence join required');
 const gates={};
 for(const name of gateNames){
  const x=input.independent_attestations[name];
  if(x!==true&&x!==false&&x!==null)
   throw new TypeError('All independent evidentiary attestations require explicit true/false/null: '+name);
  gates[name]=x;
 }
 const country=auditSyntheticSteamGameLevelCountryZeroBounds(
  input.game_country_rows,input.country_options);
 let refresh=null;
 if(input.financial_refresh_log!==null){
  if(!shape(input.financial_refresh_log,['polls','batches','events']))
   throw new TypeError('Refresh log must be a bounded synthetic poll/refresh/checkpoint fixture');
  refresh=auditSyntheticSteamFinancialRefreshLog(input.financial_refresh_log);
 }
 const errors=[],unknown=[];
 for(const [name,flag] of Object.entries(gates))
  if(flag===false)errors.push(name);
  else if(flag===null)unknown.push(name);
 if(!input.country_options.game_frame_complete)errors.push('game_frame_not_complete');
 if(!input.country_options.country_roster_complete)errors.push('country_roster_not_complete');
 if(!input.country_options.all_purchase_country_reporting_reconciled_attested)
  errors.push('purchase_country_financial_reporting_not_reconciled');
 if(!country.observation_matured)errors.push('sales_observation_period_not_matured');
 if(country.counts.unresolved_original_paid_status_games>0)
  unknown.push('initial_paid_status_unresolved_for_some_games');
 if(country.counts.eligible_paid_games===0)unknown.push('no_eligible_original_paid_games');
 if(country.counts.games_with_unknown_purchase_access>0)
  unknown.push('purchase_access_unresolved_for_some_games');
 if(country.counts.unknown_gross_zero_games>0)
  unknown.push('some_game_gross_zero_outcomes_partially_observed');
 if(refresh===null)unknown.push('financial_change_refresh_log_not_supplied');
 // A valid poll log only proves ordered *synthetic* refreshes. Missing
 // transaction dates or AppIDs remain unobserved unless independently attested.
 const foundationalGatesOK=errors.length===0&&unknown.every(k=>
  ['purchase_access_unresolved_for_some_games','some_game_gross_zero_outcomes_partially_observed'].includes(k));
 const readiness=errors.length?false:foundationalGatesOK?true:null;
 // Even with a fully verified sample frame, these are *conditional bounds*
 // over fabricated inputs and not empirical Steam statistics.
 const lower=readiness===true?country.whole_game_gross_zero_fraction_lower_conditional:null;
 const upper=readiness===true?country.whole_game_gross_zero_fraction_upper_conditional:null;
 const exposedReady=readiness===true&&
  !unknown.includes('purchase_access_unresolved_for_some_games');
 return Object.freeze({
  kind:'synthetic_study_readiness_financial_refresh_join_not_empirical_steam_sales',
  fixture_id:input.fixture_id,
  status:readiness===true?'conditional_evidence_protocol_pass':
   readiness===false?'known_evidence_gate_failure':'unresolved_evidence_gate',
  conditional_study_readiness:readiness,
  known_failed_gates:errors,
  unresolved_gates:unknown,
  independent_attestations:{...gates},
  game_roster_size:input.country_options.game_roster.length,
  eligible_games:country.counts.eligible_paid_games,
  original_paid_status_unresolved_games:country.counts.unresolved_original_paid_status_games,
  game_counts:{...country.counts},
  changed_date_polls_committed:refresh?.polls_committed??null,
  changed_dates_refreshed:refresh?.fully_refreshed_notifications??null,
  changed_date_checkpoint_last_marker:refresh?.final_committed_outer_highwatermark??null,
  complete_synthetic_change_refresh_sequence:refresh!==null,
  final_reconciled_daily_aggregate_is_game_specific:false,
  zero_fraction_lower_conditional:lower,
  zero_fraction_upper_conditional:upper,
  purchase_exposed_zero_fraction_lower_conditional:exposedReady?
   country.purchase_exposed_game_zero_fraction_lower_conditional:null,
  purchase_exposed_zero_fraction_upper_conditional:exposedReady?
   country.purchase_exposed_game_zero_fraction_upper_conditional:null,
  any_actual_merchant_financial_report_accessed:false,
  actual_historical_steam_paid_game_roster_verified:false,
  actual_publisher_partner_era_financial_rights_verified:false,
  actual_zero_paid_sale_fraction:null,
  actual_zero_demand_rate:null,
  actual_publisher_income_distribution:null,
  caveat:'The financial refresh log models complete per-changed-day pagination and atomic checkpoint order, but it does not discover games with no transactions, guarantee coverage of dates with no activity, verify old payment-partner rights, or independently link aggregate financial rows to game/country observations. Every cross-system coverage claim is an unverified synthetic attestation. No real Steam-wide zero-sales estimator follows.'
 });
}

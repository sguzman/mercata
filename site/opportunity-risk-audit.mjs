export function auditOpportunityRiskMatrix(model, ids){
 const rows=model?.opportunity_risk_matrix?.axes;
 if(!Array.isArray(rows)||!Array.isArray(ids)||new Set(ids).size!==ids.length)return {valid:false,reason:'invalid_matrix_or_selection'};
 const selected=ids.map(id=>rows.find(r=>r.id===id));
 if(selected.some(x=>!x))return {valid:false,reason:'unknown_risk_axis'};
 if(selected.some(x=>!x.source_ids?.length||x.probability!==null||x.expected_loss!==null||x.creator_income_impact!==null))
  return {valid:false,reason:'fabricated_or_unsourced_numerical_risk'};
 return {valid:true,documented_restrictions:selected.filter(x=>x.classification==='documented_restriction').length,
  documented_settlements:selected.filter(x=>x.classification==='documented_settlement').length,
  contract_specific:selected.filter(x=>x.classification==='contract_specific').length,
  conditional_entitlements:selected.filter(x=>x.classification==='conditional_entitlement').length,
  measurement_gaps:selected.filter(x=>x.classification==='measurement_gap').length,
  risk_probability:null,expected_creator_profit:null,ranked_niche:null};
}
export function attemptRiskWeightedRanking(model,rows){
 if(!Array.isArray(rows)||rows.some(x=>!Number.isFinite(x?.probability)||!Number.isFinite(x?.financial_loss)))
  return {allowed:false,reason:'no_defensible_risk_distribution'};
 return {allowed:false,reason:'unvalidated_invented_probabilities_are_not_comparable'};
}

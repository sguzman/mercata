// Pure research audit; choosing a route does not activate it or create revenue.
export function auditRevenueStreamSelection(catalog, selectedIds, summedFields=[]) {
 const matrix=catalog?.accounting_matrix;
 if(!matrix?.pathways || !Array.isArray(selectedIds) || !Array.isArray(summedFields))
  return {valid:false,reason:'missing_research_matrix_or_selection'};
 if(new Set(selectedIds).size!==selectedIds.length) return {valid:false,reason:'duplicate_pathway_selection'};
 if(new Set(summedFields).size!==summedFields.length) return {valid:false,reason:'duplicate_accounting_measure'};
 const byId=new Map(matrix.pathways.map(p=>[p.id,p]));
 if(matrix.pathways.length!==catalog.pathways.length || matrix.pathways.some(x=>!catalog.pathways.some(y=>x.id===y.id)))
  return {valid:false,reason:'incomplete_pathway_accounting_matrix'};
 if(selectedIds.some(id=>!byId.has(id)))return {valid:false,reason:'unregistered_pathway'};
 const conflicts=matrix.accounting_nonadditivity.filter(rule=>rule.measure_ids.every(x=>summedFields.includes(x)));
 const ambiguity=matrix.possible_duplicate_underlying_transactions.filter(rule=>rule.ids.every(x=>selectedIds.includes(x)));
 const settlement={adsense_for_youtube:[],separate_provider_or_merchant:[],contract_defined:[]};
 for(const id of selectedIds){
  const row=byId.get(id);
  if(!Object.hasOwn(settlement,row.settlement))return {valid:false,reason:'unregistered_settlement'};
  settlement[row.settlement].push(id);
 }
 return {valid:conflicts.length===0,selected_count:selectedIds.length,settlement,
  conflicts:conflicts.map(x=>x.id),possible_duplicate_deals:ambiguity.map(x=>({ids:x.ids,needs:x.needs})),
  all_pathways_approved:false,actual_cash:null,expected_earnings:null,creator_net_profit:null};
}
export function auditNativeAffiliateCashPlacement(catalog,{nativeShoppingInPlatformPosted,affiliateOutsideCashIncludesNativeShopping}) {
 if(!catalog?.accounting_matrix?.affiliate_settlement)throw Error('Missing documented affiliate settlement');
 if(typeof nativeShoppingInPlatformPosted!=='boolean'||typeof affiliateOutsideCashIncludesNativeShopping!=='boolean')
  throw Error('Explicit settlement flags required');
 return {valid:!(nativeShoppingInPlatformPosted&&affiliateOutsideCashIncludesNativeShopping),
  native_affiliate_account:'adsense_for_youtube',outstanding_settlement_is_cash:false,
  reason:nativeShoppingInPlatformPosted&&affiliateOutsideCashIncludesNativeShopping?'duplicated_shopping_commission':'separate_accounting_paths'};
}

const US=[99,199,299,399,499,599,699,799,899,999,1499,1999,2499,2999,3499,3999,4499,4999,9999,14999,19999,24999,29999,39999,49999],OLD=[9,19,29,39,49,69,99,149,199,219,299,399,499,599,699,799,899,999,1999,2999,3999,4999,6499,7999,9999],NEW=[19,29,39,59,69,79,99,149,199,219,299,399,499,599,699,799,899,999,1999,2999,3999,4999,6499,7999,9999];
export function auditOfficialMembershipOptions(data,sources){
 const errors=[];if(data?.kind!=='official_channel_membership_price_options_mexico_2026'||data?.tiers?.length!==US.length)errors.push('Wrong official pricing menu');
 if(data?.source_ids?.length!==3||data.source_ids.some(x=>!sources.has(x)))errors.push('Missing official source');
 for(let i=0;i<US.length;i++){const x=data?.tiers?.[i];if(x?.option!==i+1||x?.us_allowed_usd_cents!==US[i]||x?.mx_previous_mxn_cents!==OLD[i]*100||x?.mx_new_mxn_cents!==NEW[i]*100||x?.nominal_change_mxn_cents!==(NEW[i]-OLD[i])*100)errors.push('Incorrect official option '+(i+1));if(x?.creator_adoption_count!==null||x?.purchases!==null||x?.creator_net_receipts!==null)errors.push('Invented observed sales');}
 if(data?.changed_option_count!==6||data?.unchanged_option_count!==19||data?.channels_sampled!==0||data?.real_member_transactions_sampled!==0||data?.possible_menu_options!==25||data?.max_levels_per_channel!==6)errors.push('Confused pricing options and actual tiers');
 if(data?.universal_switch_date!==null||Object.values(data?.unmeasured||{}).some(x=>x!==null))errors.push('Inferred changeover or net profit');
 return {valid:errors.length===0,errors,changed:6};
}

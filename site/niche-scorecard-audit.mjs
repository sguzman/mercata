export function auditVisibleNicheScorecard(rpm,opportunity,sourceIds){
 const errors=[],s=rpm?.transparent_scorecard,display=opportunity?.sample_niche_scorecard;
 if(!s||!display||s.row_count!==4||s.rows?.length!==4||
    s.required_axes?.length!==6||s.observed_axes_count!==1||s.required_axes_count!==6)
   errors.push('Six-axis scorecard definition missing');
 if(!sourceIds.has(s?.sample_source_id)||!display?.source_ids?.includes(s?.sample_source_id)||
    display?.original_artifact!=='ontology/youtube/rpm-niche-quartile-crosswalk-2026.json')
   errors.push('Unlinked RPM evidence');
 if(s?.scope_same_as_all_youtube_creators!==false||s?.can_compute_overall_score!==false||
    s?.score_weights!==null||s?.any_niche_rank!==null||s?.expected_newcomer_profitability!==null||
    display?.score!==null||display?.ranked_order!==null||display?.independent_earner_population!==false)
   errors.push('Unsupported overall niche rank or newcomer profit');
 for(const original of rpm?.niches||[]){
   const item=s?.rows?.find(x=>x.niche_id===original.id);
   const other=display?.observations?.find(x=>x.niche_id===original.id);
   const raw=item?.observed?.monetization_native_rpm;
   if(!item||!other||raw?.source_id!==rpm.source_id||raw?.median_usd_per_1000_views!==original.median_rpm_usd||
      raw?.p25_usd_per_1000_views!==original.p25_rpm_usd||
      raw?.p75_usd_per_1000_views!==original.p75_rpm_usd||
      raw?.small_n_warning!==original.small_n_warning||
      other.median_rpm_usd!==original.median_rpm_usd||
      other.p25_rpm_usd!==original.p25_rpm_usd||
      other.p75_rpm_usd!==original.p75_rpm_usd)
     errors.push('RPM provenance or percentiles drift');
   if(item?.rankable!==false||item?.score!==null||other?.rankable!==false||
      other?.score!==null||item?.observed_axes?.join(',')!=='monetization_native_rpm'||
      item?.missing_axes?.length!==5||
      Object.values(item?.unmeasured||{}).some(x=>x!==null))
     errors.push('Missing niche dimensions concealed');
 }
 if(display?.observations?.length!==rpm?.niches?.length||display?.required_axes?.join(',')!==s?.required_axes?.join(','))
   errors.push('Public scorecard not synchronized');
 return {valid:errors.length===0,errors};
}

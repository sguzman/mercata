export function auditCommentSourceCorrection(record,norms,dossier){
 const errors=[],political=norms?.studies?.find(x=>x.id==='political_anglophone_2025');
 const pattern=political?.observations?.find(x=>x.id==='toxicity_frequency_pattern');
 const m=record?.political_sample,c=record?.climate_sample;
 if(record?.kind!=='public_comment_study_source_conflict_and_denominator_reconciliation'||record?.source_ids?.length!==2)errors.push('Wrong source reconciliation scope');
 if(!record.source_ids.every(id=>dossier.evidence.some(e=>e.id===id)))errors.push('Unregistered primary studies');
 if(pattern?.direction!=='more_pronounced_among_prolific_commenters'||m?.coded_toxicity_relative_direction!=='higher_among_prolific_in_sample'||political?.source_variant_conflict?.review_resolution!=='use_full_text_methods_and_figure_direction_with_discrepancy_disclosed')errors.push('Uncorrected manuscript contradiction');
 if(m?.observed_channel_count!==political?.n_channels||m?.observed_comments_lower_bound_exclusive!==political?.n_comments_lower_bound_exclusive||m?.observed_comment_authors_lower_bound_exclusive!==political?.n_unique_commenters_lower_bound_exclusive||m?.comment_share_percent_approx!==50||m?.commenter_share_percent_lower_bound_exclusive!==2)errors.push('Misrepresented study sample');
 if(c?.selected_video_count!==129||c?.manual_attitude_labels_count!==2580||c?.manually_labeled_comments_per_video!==20||c?.source_id!=='aharonson-climate-youtube-comments-2026')errors.push('Wrong climate coding frame');
 if(!dossier.claims.some(x=>x.id==='political-youtube-prolific-commenter-toxicity-2025')||dossier.claims.some(x=>x.id==='political-youtube-infrequent-commenter-toxicity-2025'))errors.push('False public claim retained');
 if(Object.values(record?.unmeasured||{}).some(x=>x!==null)||m?.causal_commenting_frequency_effect!==null||c?.causal_effect_of_replying!==null)errors.push('Invented causal or population result');
 return {valid:!errors.length,errors};
}

// Oxford survey frames are not population denominators or creator earnings.
export function selectSurveyResponses(model, frame, jurisdictions) {
  if (!['creator', 'business', 'user'].includes(frame)) throw Error('Unknown survey respondent frame');
  if (!Array.isArray(jurisdictions) || jurisdictions.length === 0 || new Set(jurisdictions).size !== jurisdictions.length) {
    throw Error('Expected distinct survey jurisdictions');
  }
  for (const overlap of model.survey.nested_jurisdictions) {
    if (jurisdictions.includes(overlap.parent) && overlap.members.some(x => jurisdictions.includes(x))) {
      throw Error('Overlapping country sample frames are not additive');
    }
  }
  let count = 0;
  for (const id of jurisdictions) {
    const row = model.survey.response_counts.find(x => x.id === id);
    if (!row) throw Error('Unregistered survey jurisdiction');
    count += row[frame];
  }
  return {count, unit: 'survey_responses', frame, jurisdictions: [...jurisdictions],
    population_estimate: null, earnings_distribution: null};
}
export function assessCreatorIncomeInference(model, candidate) {
  if (model.survey.creator_sample_is_representative_of_all_creators !== true || model.survey.measured_youtube_creator_median_income === null || model.survey.measured_all_creator_zero_earner_rate === null ||
    candidate?.unit !== 'verified_creator_cash_income' || !candidate?.representative_all_creator_sampling ||
    !candidate?.actual_creator_receipts || !candidate?.known_zero_earner_denominator) {
    return {allowed: false, reason: 'No representative creator receipts with a known including-zero denominator'};
  }
  return {allowed: true};
}

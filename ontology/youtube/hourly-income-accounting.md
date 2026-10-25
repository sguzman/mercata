# Audited creator hourly-income calculation

The [machine-readable computation contract](hourly-income-accounting.json) accompanies this implementation. This source-backed [cohort calculator](../../site/creator-hourly-audit.mjs) and its [tests](../../tests/creator-hourly-audit.test.mjs) compute descriptive net receipts per tracked creator labor hour. Test numbers are **synthetic fixtures**, not measured YouTube earnings.

For every attempted creator in one prespecified period, record gross paid receipts in USD cents, refunds, fees, cash production costs, and actual current-period hours. Include creators whose attempts yielded **zero revenue** and those whose cash profit was negative. Report incomplete records as unknown, never zero. Exclude zero-hour denominators from hourly quantiles but report their count. Keep historical sunk labor separate from current-period effort rather than repeatedly allocating it to each subsequent period.

This is not an all-creator estimate. The existing [cross-platform earnings survey](cross-platform-income-surveys.md), [selected Patreon-affiliated income sample](creator-income-evidence.md) and [first-upload vlog study](first-upload-vlog-study-2026.md) have different, unmatched populations; their earnings and labor medians cannot be divided to invent typical hourly wages. Any actual private records must remain outside the public repository, with aggregate reports only and explicit creator authorization. Tax liability, income stability and probability of paid success remain unknown.

## Accounting edge cases

Refunds may reverse a prior-month transaction, so a recorded refund can exceed new receipts in the current month. The model **allows a negative current-period cash result** rather than incorrectly rejecting the record. Actual refund cash still needs dated support.

Missing or non-estimable creator records make the full-cohort hourly distribution unavailable. Complete-case quartiles remain visible only as explicitly partial evidence, and `complete_cohort_hourly_usd` stays null. Dates are validated as calendar days and cent arithmetic must remain within JavaScript's safe-integer range.

## Partial identification when receipts or expenses are missing

The calculator now provides **worst-case quantile bounds** across *all attempted creators with positive recorded labor hours*, not just complete cases. For a quantile with rank `ceil(p × n)`, where `m` hourly outcomes are missing, the minimum possible rank can be at or below the lowest known outcome, and the maximum can be above the highest known outcome. Unknown unbounded endpoints are **null**, not zero. A bound collapses to a point only when known observations pin down that order statistic despite the missing entries. These are purely arithmetic partial-identification intervals, **not statistical confidence intervals** and not empirical data about YouTube creators.

Likewise, the fraction of attempted creators with zero gross receipts is bounded by `known zeros / all attempts` and `(known zeros + unknown-gross attempts) / all attempts`. Missing expenses with explicitly recorded zero gross leave that zero-gross count known without implying zero net profit or zero alternative income. Zero-hour attempts remain visible in the cohort coverage audit but have no defined per-hour outcome. Any unresolved record still leaves `complete_cohort_hourly_usd` as null. Synthetic regression fixtures never count as actual paid creators.

The YouTube creator-hours respondent survey, selected Patreon earnings sample and public first-upload paper cited in the [model](hourly-income-accounting.json) cannot be joined at a person or period level, so these new bounds **do not** create a representative earnings figure from those separate studies.

# Steam zero-sales: independent model error and missing-game sensitivity

**Reviewed October 29, 2026.** [Structured inputs](steam-two-stage-model-and-frame-zero-sensitivity-2026.json) · [pure conditional calculator](../../site/steam-truezero-selection-sensitivity.mjs) · [tests](../../tests/steam-truezero-selection-sensitivity.test.mjs).

This extends the [January 2026 modeled-zero missingness study](january-2026-modeled-zero-missingness-2026.md) by separating **three uncertainties**, none of which are independently calibrated: false zero-copy predictions, true zero-copy games predicted nonzero, and paid games missing from the tracker entirely.

## The published measurement is a model, not a sales ledger

The [October 15 Egmatic analysis](https://egmatic.com/blog/how-many-copies-does-the-median-indie-game-sell), using [GameDiscoverCo's public January 2026 estimates](https://newsletter.gamediscover.co/p/is-the-game-biz-sustainable-for-the), reports a provider-defined January roster of **1,230 paid-release entries**. Model estimates were available for **1,211**, of which **412** were reported as modeled zero copies; another **19** lack the model figure. These are neither Valve-validated zero orders nor verified exhaustive originally-paid release records. The source's modeled monetary or copy quantiles cannot be silently relabeled as merchant-verified outcomes.

The initial missingness calculation can bound *which of the 1,230 entries would carry a zero model label* by allocating 19 unspecified model outputs. This additional study asks a harder question: what would it take to bound the **actual zero-paid-checkout share** of a historically complete first-paid game population?

## Three independent unknowns

Write `N` for the provider's listed games (1,230), `E` for modeled games (1,211), and `Z` for zero-labeled model results (412). Then define three **externally justified upper caps** that do not presently exist:

- `F`: maximum count of the Z model-zero entries that actually had at least one verified paid order (false zeros).
- `T`: maximum count of the E − Z positive-model entries that actually had zero verified paid orders (missed zeros).
- `M`: maximum number of qualifying originally paid releases omitted from the provider's entire listed frame.

The 19 unestimated listed games may independently be true zeros or not. If and **only if** all three caps are supplied and defensible, the logical extreme over every allowable omitted count is:

\[
\text{lower} = \frac{Z-F}{N+M},\qquad
\text{upper} = \frac{Z+T+(N-E)+M}{N+M}.
\]

These extremes assume missing and misclassified games can be allocated adversarially. They are **not** conventional confidence intervals or estimates of likely model accuracy. Without bounds on all three errors, the true fraction has no useful numeric interval from this source. Even such an interval would be about **games with zero gross paid checkout events**, not publishers with no earnings, no net receipts, or negative profit.

## One deliberately invented stress test

Assume, with **no evidentiary support**, F = 100, T = 100, M = 400. The two endpoints would be **312/1,630 ≈ 19.14%** and **931/1,630 ≈ 57.12%**. The wide range illustrates how errors in the original modeled cohort can dwarf the modest 19 missing estimate values. Assuming F=T=M=0 gives the previously computed model-label interval **412/1,230 to 431/1,230**, but this is not evidence that those assumptions are true.

The calculator validates cap ranges and safe integer arithmetic, rejects contradictory input totals, and returns `null` for conditional bounds when any cap is unknown. It **always** returns `null` for Mercata's actual Steam zero-paid-order fraction, independently verified frame count, and measured model errors.

## Evidence required before a real zero-order statistic

A historically complete original-paid AppID frame including [retired games](https://partner.steamgames.com/doc/store/retire_app?l=english), authenticated app-level [Steam gross purchase/return records](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService), dated model predictions joined to independently verified game orders, justified missing-frame coverage caps, consent and publication rights, and a fixed follow-up period. A success-selected validation subset cannot supply a population-wide model error rate without correcting selection and response.

**Result:** stronger, tested decision boundaries; **no actual Steam zero-copy fraction, revenue median, legally unique publisher count or after-cost profit estimate**.

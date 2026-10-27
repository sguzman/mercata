# Two small games are not automatically two incomes

Reviewed **October 26, 2026**. [Machine assumptions](game-portfolio-unit-cost-scenarios-2026.json) · [Deterministic model](../../site/itch-portfolio-economics.mjs).

A small-game portfolio needs **separate per-title development, QA, marketing, localization, support, asset and reversal costs**, plus work shared across the portfolio. Every release may add maintenance obligations, even after launch. The effective creator hourly surplus cannot be measured without actual documented developer hours and actual retained paid orders.

The model reuses Mercata's [single-game break-even calculator](../../site/itch-break-even.mjs). It accepts a list of titles, prices, explicit hypothetical retained paid orders, platform/processor fee assumptions, per-game time and cash expenses, shared hours and cash, an hourly labor valuation, and a pretax target. It returns total cash cost, valued work cost, hypothetical contribution, and an **additional paid-order threshold for each title if only that title attracted the missing orders**.

It does not invent sales. An illustrative two-title scenario deliberately sets the retained-order count to **zero as an input assumption**, not as an observed market outcome. Both titles still accumulate development, QA, localization and postlaunch labor. The assumptions use a 10% platform share and the operator's illustrative 2.9% plus $0.30 processor charge. These rates may differ for actual sellers. [Official payment explanation](https://itch.io/docs/creators/payments).

The first proposed title has a **$5 minimum price**, the second **$10**. A later localization pilot could compare explicit additional translation hours and QA with retained orders in two legitimate and comparable audience windows. There is no source-based universal words-per-hour rate, and languages cannot substitute for observed buyer country.

**Economic boundary:** refunded purchases are excluded from retained order counts, while independently imposed dispute charges are tracked separately. Tax, settlement FX and unobserved payment adjustments are still unknown; results are *conditional pretax arithmetic*, not actual bank cash, income probabilities or a guarantee of sustainable monthly earnings. Two proposed monthly releases are simply labels, not a proven feasible release cadence.

This satisfies fixed calculation and planning requirements where specified, but no approved commercial release, buyer analytics, merchant records, translation work log, support log or successful earning experiment has occurred.

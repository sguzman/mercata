# Creator income calculator: methods

Mercata includes a locally evaluated earnings calculator, not a revenue prediction. **Every input starts blank.** The operator must supply explicitly assumed long-form/watch-page views, ad-only revenue per thousand applicable views, Shorts engaged views, Shorts ad-only yield per thousand engaged views, other net receipts, cash expenses, total labor hours and a three-letter currency code.

The model sums watch-page and Shorts ad receipts plus independently entered other net receipts; then subtracts cash costs and divides by total labor hours. It does not apply YouTube's 55%, 45% or 70% contractual figures to after-share yield a second time.

The word *other* means amounts after platform/provider deductions but before the separate expenses the operator enters. If an actual Analytics RPM includes Premium or fan support, it **cannot** be used as the ad-only RPM here and then have those receipts added again. All currency fields must have one nominal currency; the calculator does not convert currencies.

A negative result is meaningful: costs may exceed hypothetical receipts. An unknown result is different and is never defaulted to zero. The calculator has no built-in rates, no inferred traffic and no probability-weighted confidence interval. It does not model taxes or noncash opportunity cost unless the operator includes them in their separate cash assumptions; the per-hour figure is cash profit before personal taxes divided by all work hours, not a wage or a measured typical earning.

Calculations run entirely in the reader's browser using [pure arithmetic](../../site/scenario.mjs); no account credentials, external APIs, network submissions or persistent financial inputs are required. [Automated tests](../../tests/scenario.test.mjs) cover exact arithmetic, missing data and negative profit. A calculator does not replace the larger [ten-dimension economic opportunity assessment](opportunity-framework.md).

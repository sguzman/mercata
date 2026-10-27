# Developer labor: why a positive cash balance is not game earnings

Reviewed October 26, 2026. [Machine source crosswalk](developer-labor-and-small-game-cash-2026.json) · [Auditable conditional calculator](../../site/itch-case-labor-analysis.mjs).

One [public developer case](release-cost-labor-cases-2026.json) reports **AraCore Astromining Ventures** earning approximately **£190 over all storefronts in its first five days**, with approximately **£185 of recorded cash expenditures**, for a stated **£5 accounting surplus**. The creator also reported roughly **1,500 development hours**. These are not audited receipts and do not isolate itch.io or account fully for taxes, fees and all continuing work.

Conditional on taking the £5 accounting result as given, its ratio to **known reported development hours** is £5/1,500 = **£0.0033 per hour**. That is *not an hourly wage*. If those 1,500 hours are hypothetically valued at £10/hour, the cash-accounting result minus *only that valued development work* is **−£14,995**. A £20/hour scenario yields **−£29,995**. These do not account for other unlogged effort, so they are not final economic profit.

The other source cases have different missing elements: [Rose Seed Replica](release-cost-labor-cases-2026.json) has multi-store first-week units, grant-sensitive living/cash costs and an itch-specific 13-unit disclosure but no completed labor-hours record; [Basement Raid](first-month-small-game-cashflow-2025-2026.json) self-reports roughly $10 in first-month earnings alongside an incomplete shifting weekly effort narrative; [an optional-payment interactive fiction game](single-game-optional-payment-multistore-2026.json) took more than one calendar year but has no usable work-hour total.

## A real work ledger needs seven categories

A developer must separately log production, music/art and license clearance, OS/gameplay QA, marketing and listings, account/tax administration, localization/accessibility, and postlaunch support. Each should retain actual session hours, game build/version, out-of-pocket currency, labor valuation method and period. Unknown effort stays **unknown**, never zero.

The calculator deliberately returns `fullyCostedProfit: null` when other work hours are missing. It never returns a representative salary, typical game cost, genre economics or hourly compensation inferred from voluntary postmortems.

**Acceptance:** Defines production, marketing, admin, QA and support accounting for existing labor tasks and gives a reproducible case-specific sensitivity. The existing small-game scope measurement task stays open: its 1–2 mechanics and 5–30 minutes are only a planned range, with zero tested games and no measured completion-time distribution. **Unanswered:** population hourly earnings, first-game mean/median profit, actual labor distribution, and the causal effect of choosing any genre.

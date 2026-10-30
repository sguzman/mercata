# ResidualPlay's monthly modeled net and the incomparability of a lifetime gross median

**Reviewed October 30, 2026.** [Source-linked observations](steam-residualplay-selected-current-monthly-net-vs-lifetime-gross-2026.json) · [aggregate integrity guard](../../site/steam-residualplay-bucket-scope-guard.mjs) · [tests](../../tests/steam-residualplay-bucket-scope-guard.test.mjs). This is an audit of public **vendor-model aggregates**, not a Steamworks balance-sheet study.

## What the $590 figure actually refers to

ResidualPlay's live [Indie niche report](https://residualplay.com/niche/indie) publishes a **$590/month selected-sample median modeled 'net to developer'** for **1,289** tracked games labeled Indie and dated 2022–2026. The displayed monthly buckets are **151 under $100**, **447 at $100–500**, **338 at $500–2,000**, **230 at $2,000–10,000**, and **123 above $10,000**. They add to 1,289; the 353 above $2,000 tally is the sum of the last two bins. A $590 median falls in the printed $500–2,000 band, but the grouped table alone cannot independently produce its exact rank-level dollar value.

The operator's [API and model documentation](https://www.residualplay.com/docs/) defines its monthly net as an estimate that removes *notional* VAT, refunds and platform share, approximately **55% of estimated gross**. It cautions that individual games have roughly **30–50% error**, with aggregate figures claimed to be more stable. This is not a verified publisher invoice, bank deposit, legal owner cashflow, personal income after tax or labor-adjusted profit. Substituting it for any of these quantities would mislabel the source.

The report says the sample avoids survivor bias, but does not demonstrate a historical exhaustive paid-first-offer AppID frame, mapping of delisted or never-tracked games, or proven completeness for the 2022–2026 population. Its 1,289 *tracked games* are therefore the correct stated denominator. The self-applied Indie tag is not an identity test for a solo creator or a particular legal publisher.

## Not equivalent to another provider's 'lifetime' $5,997

The earlier [IndiePilot report](https://indiepilot.dev/reports/steam-indie-revenue-analysis/) displays **$5,997 modeled lifetime gross** over **58,650** selected paid, price-and-review-observable game records. ResidualPlay presents **$590 modeled net per month** over **1,289** differently selected tracked Indie-tagged titles. The numerator/denominator combinations do not match: *current month versus estimated accumulated lifetime*, modeled net deductions versus nominal gross, Indie-tag only versus broader paid game rows, and distinct unknown coverage/error mechanisms.

Annualizing $590 or dividing $5,997 by a guessed number of months would not create a comparable actual developer wage without a matched per-game earnings trajectory and legal publisher-level settlements. A per-title 30–50% stated error range does not itself prove a valid confidence interval for the selected-sample median.

## Reproduction and interpretation

The [synthetic count gate](../../site/steam-residualplay-bucket-scope-guard.mjs) verifies public bucket arithmetic and keeps income, actual zero sales and the ratio of incomparable medians **unidentified**. No bulk provider data, partner ledgers, private review records or paid APIs were accessed.

**Still unknown:** representative developer proceeds, total first-paid launch and delisted populations, actual zero-paid-sale fraction and all-in after-cost earnings.

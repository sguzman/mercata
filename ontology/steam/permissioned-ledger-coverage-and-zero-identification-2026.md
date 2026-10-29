# Steam publisher-income data: a hard gate on zero sales, missingness and transfers

**Reviewed October 28, 2026.** [Structured gate specification](permissioned-ledger-coverage-and-zero-identification-2026.json) and [synthetic coverage analyzer](../../site/steam-ledger-coverage.mjs). This is **not** a collected income dataset or merchant report.

## The key distinction: a confirmed zero must be a real observation

Steam provides [partner-only detailed sales records](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) by category and reporting period. A game missing from a public sales tracker is not necessarily a zero-sale game. And [app transfers](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?l=english) can leave past-year reports inaccessible to a new manager unless historical permissions have been separately granted.

The protocol accepts a game-level attestation in one of three states:

| State | What can be inferred about **gross paid store units** |
| --- | --- |
| **Complete, reconciled** | Zero or positive units may be used as attested whole-period observations after coverage, permission and transfer-history checks |
| **Partial** | Positive gross paid units imply *at least one sale* in the full period; partial **zero** leaves full-period zero status unknown |
| **Missing** | No conclusion about full-period units or revenue |

The unit is **gross paid Steam checkout game units**, not key activations, demo licenses, Steam account owners, or net units after returns. A game can sell paid units, refund them all and have **zero net units** despite **positive historical gross sales**. Steam's report explicitly distinguishes these units. Nor does this imply a developer's profit.

The [pure analyzer](../../site/steam-ledger-coverage.mjs) tracks a user-supplied AppID frame, eligibility, distinct reporting states, unknown original-paid status, retirement flags and transfer coverage. For a **verified full eligible frame**, it can compute conditional lower/upper fractions of possibly zero-gross-unit games. If the frame itself is incomplete or any first-paid status is unresolved, even those conditional fractions are marked **unreportable for the population**. It never infers a business-income median or a causal result.

## An intentionally invented fixture

For five synthetic eligible paid AppIDs, assume:

- one complete ledger reports zero gross paid units;
- one complete ledger reports ten paid units;
- one partial ledger reports zero observed units;
- one ledger is missing;
- one partial ledger shows three paid units.

Assuming the five AppIDs form a genuinely complete eligible frame **and** the reported units are authenticated, the zero-gross-unit share would be bounded between **1/5 and 3/5**. These are **not Steam market estimates**—they are a fixture testing how uncertainty propagates. With incomplete frame coverage, no whole-population percentage is reportable.

## Legal partner identities and after-cost earnings need a different layer

Even a fully observed game-level distribution isn't a publisher-level distribution. Different legal companies can be responsible for the same AppID during different periods; a single publisher may have many games; [retired titles](https://partner.steamgames.com/doc/store/retire_app?l=english) must remain in historic paid-release cohorts. Calculating developer take-home also needs contractual shares, remittances, tax, marketing costs and development labor.

Future research requires: a rights-cleared eligible AppID frame across delistings; authenticated, consented aggregated reports; explicit nonresponse and recruitment records including unsuccessful publishers; verified legal entity and transfers; versioned event periods and refunds; and suitable aggregation/privacy controls. A voluntary success-selected sample can validate individual estimates **within that sample**, but must not be called a marketwide random sample.

**No private financial data, partner keys, legal contracts, or actual game records were accessed. The only operational inputs committed are synthetic test fixtures.**


## Fixed release-age horizons and right censoring — October 29, 2026

The added [synthetic fixed-horizon analyzer](../../site/steam-ledger-coverage.mjs) separates a zero observed so far from **zero gross paid Steam checkouts over 30, 90, or 365 calendar days** after the first paid playable release. Cohorts retain retired games. Day-aligned timestamps are an analytical approximation and do not establish exact release-hour transactions. A complete zero requires an elapsed full observation window, authorized access and reconciled transfer history. Positive partial observations strictly within the target horizon rule out zero; partial zero, missing records and still-immature games are **unknown**, not zero. Unknown paid-release eligibility or an incomplete game roster blocks population inference.

One intentionally invented five-game scenario includes a complete zero, a partial positive, a mature partial zero, one missing report and an immature partial zero. Under a hypothetical complete-frame assumption the **30-day zero-sales fraction lies between 1/5 and 4/5**. These values are mathematical sensitivity results, not empirical Steam estimates. Tests reject incomplete financial permissions, reports from outside the fixed horizon, future observations, nonfixture identifiers and purported zero-sales rows without any data. This operationalizes the existing [Valve financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService) and [historical transfer visibility](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer) evidence boundaries without accessing private merchant information. The real marketwide zero-sales fraction remains unidentified.


### Package, bundle, and game-attribution evidence boundary

[Valve's Detailed Sales schema](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService) uses package and bundle identifiers for checkout rows, while its \`primary_appid\` describes an association for **additional revenue-share accrual**, not an independent census of base-game licenses. Consequently, summing rows by a revenue-share AppID may misclassify a package/bundle purchase as a specific game's paid checkout. The fixed-horizon synthetic audit now requires separate \`paid_checkout_attribution_attested\` evidence before accepting either a complete game-level zero or an observed game-level positive. Missing attribution cannot be replaced by a present \`primary_appid\` or the absence of a package row. This safeguard still proves no real market outcome.


### Consistent attribution gating in the original whole-period analyzer

The original [whole-period synthetic coverage analyzer](../../site/steam-ledger-coverage.mjs) now applies the same package-to-base-game gate as the fixed-horizon extension. Complete zero observations require checkout attribution as well as historical financial access and transfer reconciliation; partial positive observations require attribution before ruling out zero. Its original 1/5–3/5 hypothetical example remains mathematically unchanged because the fixture explicitly attests the needed mapping. The additional tests reject a missing mapping for both zero and positive cases. A raw \`primary_appid\` field is still insufficient for game-license attribution.


### Authentication of partial positives

A **positive** partial report proves that a paid game had at least one sale within the relevant observed period only if the report is both authorized and attributable to the game. The legacy and fixed-horizon analyzers now require explicit financial-report access attestation for that inference, in addition to package-to-game mapping. An unverified self-report or unattributed package row cannot be promoted into a verified nonzero outcome; zero-only partial observations remain unknown regardless.


### Excluded games and missing-ledger evidence validation

The synthetic auditors reject incompatible evidence instead of silently dropping it. Initially free games, unresolved original-paid status, and games outside the fixed launch cohort cannot carry financial-report or access attestations into the paid-game numerator or denominator. A **missing** ledger cannot claim confirmed financial access, transfer reconciliation, or checkout attribution. An unrecognized field is rejected by the whole-period audit rather than discarded. These are input-integrity constraints, not new Steam-wide observations; they do not improve population coverage or change the hypothetical zero-sales bounds.

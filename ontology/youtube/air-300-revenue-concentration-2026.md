# Selected AIR monetized channels: ad revenue concentration and calendar-month RPM

**Checked:** 2026-10-25. [AIR's October 1, 2026 monetization synthesis](https://air.io/en/air-data-findings/youtube-monetization-statistics-2026) reuses the **same 300 AIR-affiliated monetized channels** and **3,595 selected channel-months**, May 2025–May 2026, described in [AIR's July 2026 underlying RPM study](https://air.io/en/air-data-findings/how-much-does-youtube-really-pay-in-2026-real-rpm-data-from-300-channels). These are **one underlying monetized-channel sampling family**, not two independently replicated results.

## Concentration of selected ad receipts

| Nested channel-rank group | Channel count | Share of selected cohort's YouTube ad revenue |
|---|---:|---:|
| Top 10% | 30 | 58% |
| Top 25% | 75 | 82% |
| Top 50% | 150 | 96% |
| Bottom 50% | 150 | 4% |

The first three groups are **nested**, so they must never be summed; the bottom half complements the top half within these 300 channels. The table does not count non-monetized uploaders, channel-member proceeds, off-platform sponsorships, taxes, production expenses or creative labor. It is not a global YouTube creator-income distribution, a measure of all zero earners, or a causal explanation for winner-take-most outcomes.

## Subscriber-size median RPM is not an earnings distribution

AIR reports **USD 2.14** median RPM for its *10,000–100,000 subscriber* cohort versus **USD 2.04** for *100,000–10,000,000 subscribers*. RPM measures creator-side money per thousand recorded views, not monthly receipts, and group-specific channel counts are not provided. A creator with more subscribers can still have fewer paid views or a different format mix; neither figure reveals typical monthly income of owners at any subscriber size.

## Source-reported calendar-month median RPM

| Month | USD median RPM | Month | USD median RPM |
|---|---:|---|---:|
| January | $1.56 | July | $1.91 |
| February | $1.82 | August | $1.98 |
| March | $1.84 | September | $2.15 |
| April | $1.93 | October | $2.19 |
| May | $1.90 | November | $2.35 |
| June | $2.05 | December | $2.12 |

The selected November **$2.35** versus January **$1.56** difference is an observational **about 50.6% higher RPM**, not evidence that a particular creator's income rose 50% or that any future November will perform identically. Calendar-month sample counts and within-channel comparability are not available from this summary. It is legitimate to describe this sample's observed monthly medians, but not to convert them into a guaranteed quarterly creator growth rate.

## Selection and accounting gaps

The 300 channels were already monetized AIR clients. Inactive creators, entrants who never reached revenue-sharing eligibility, zero earners, production time and after-expense cash profit are excluded or not observed. Some niche tables have small subgroups. This study cannot establish median all-creator cash income, the share earning zero, effective hourly wages or causal publishing-calendar effects.

[Machine observations](air-300-revenue-concentration-2026.json) · [Cohort audit](../../site/air-300-concentration-audit.mjs) · [Regression tests](../../tests/air-300-concentration-audit.test.mjs).

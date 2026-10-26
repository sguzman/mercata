# YouTube RPM category comparison: real sample quartiles, unknown creator profit

**Dated source reviewed October 24, 2026.** [Machine RPM crosswalk](rpm-niche-quartile-crosswalk-2026.json); [reconciliation tests](../../tests/rpm-niche-quartile-crosswalk.test.mjs).

AIR Media-Tech [published July 1, 2026](https://air.io/en/air-data-findings/how-much-does-youtube-really-pay-in-2026-real-rpm-data-from-300-channels) results from **300 monetized AIR-affiliated YouTube channels**, 3,595 qualifying channel-months from May 2025 through May 2026. The same original source is already registered in Mercata. Only channels with monetized observations are represented, with 10,000 to 50 million subscribers, not non-earners or new-entrant cohorts.

| Source niche | Median reported RPM | 25th percentile | 75th percentile |
| --- | ---: | ---: | ---: |
| Education & Science | $10.22 | $2.31 | $19.50 |
| Gaming | $2.05 | $0.70 | $3.62 |
| Kids & Teens | $0.33 | $0.16 | $0.88 |
| Business & Finance | $2.01 | $0.73 | $5.17 |

Figures are US-dollar **reported native revenue per 1,000 relevant YouTube views after YouTube's share**, not advertiser CPM, cash profit, income per channel, or hourly wages. AIR marked Business & Finance as a **small-n category**. The $2.30 overall median across its monetized study cannot be reconstructed by averaging these selected four niche medians.

Within this selected sample, the Education & Science median is approximately **4.9854 times** the Gaming median. But their reported 25th–75th percentile intervals **overlap from $2.31 to $3.62**. Choosing a niche does not cause its median revenue to appear in any channel, and any channel's profit also depends on actual eligible views, reach, rights, production costs, effective payouts, labor and refunds.

The [production-effort framework](production-effort-comparison.md) records the necessary expenses and hours, but **no representative effort or income distribution** has been observed for these niche categories. All-creator zero-earnings shares, genre-specific profits, and newcomer audience sizes remain unknown.

## Transparent six-axis scorecard: four selected RPM categories

This is a **visible-input comparison**, not a ranked set of opportunities. In addition to the bounded native-RPM quartiles above, an economically meaningful scorecard requires **audience reach** (distinct eligible viewers), **creator supply** (active creators and uploads), **labor/production effort** (per published and abandoned attempt), **cash expenses**, **format-specific monetization**, and **policy/rights eligibility**. Earnings after time and costs require independently measured zero-earner frequency and creator net profit, which are **not** supplied by the AIR study.

The [machine scorecard](rpm-niche-quartile-crosswalk-2026.json) explicitly records **only monetization-native-RPM observations** for Education & Science, Gaming, Kids & Teens and Business & Finance. In all four cases:

| Input axis | Observed in a compatible niche sample? |
| --- | --- |
| Audience reach: unique people | No — `null` |
| Active creator supply | No — `null` |
| Median labor hours per attempt | No — `null` |
| Median creator production cash expense | No — `null` |
| Native monetized-channel RPM distribution | **Yes**, selected AIR sample only |
| Actual content policy and rights eligibility | No — `null` |
| Median net creator profit and failed creator share | No — `null` |

The numeric RPMs remain exactly those published in the first table. **No weight, score, winner or universal ranking** is assigned; those fields are `null`. The existing [opportunity framework](opportunity-framework.json) exposes the same four bounded cases for inspection, with regression checks against the source crosswalk.

The Kids & Teens RPM category is an AIR label and **not proof** that every video or channel is legally child-directed. Business & Finance's small-sample warning also stays visible. A high selected RPM does not overcome zero audience reach, a large production bill, non-advertiser-suitable content or creator opportunity cost. The next empirical study would need comparable, independently supported measures for the five missing axes and the same country/time/creator cohorts. That study is not yet available.

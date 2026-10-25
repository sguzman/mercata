# Country-attributed advertiser CPM: original AIR 2025 selected channel data

**Original vendor report:** [AIR Media-Tech, 27 June 2025](https://air.io/en/monetization/how-much-can-creators-make-with-adsense-in-2025). **Research checked:** 2026-10-25.

AIR says it drew advertiser-side CPM observations from **more than 3,000 channels under its management**. CPM here is USD paid per **1,000 advertising impressions**, not creator-side RPM per 1,000 eligible video views, creator salary, individual channel income or local purchasing-power-adjusted wages. The exact auctions covered, country-specific sample sizes and aggregation statistic (mean versus median) were not disclosed in the country table.

## Selected observations from the original country table

| Viewer/ad audience country | Vendor-reported advertiser CPM (USD / 1,000 ad impressions) |
|---|---:|
| United States | $14.67 |
| Australia | $13.30 |
| Switzerland | $12.98 |
| United Kingdom | $8.91 |
| Japan | $5.68 |
| India | $0.74 |
| Indonesia | $0.84 |
| Pakistan | $0.53 |
| Bangladesh | $0.53 |
| Yemen | $0.48 |
| Mexico | **Unknown** — not reported in the examined published high/low market list |

These are selected rows among the **20 highest and 20 lowest rates** on AIR's report, not a random set of ten countries. The intermediate countries are missing and must not be guessed. For example, dividing the published U.S. CPM by the published India CPM yields only a **ratio of selected advertiser impression prices**, not how much more American creators earn, nor any claim about income of creators living in these places.

## Compatibility boundary

- **Viewer country ≠ creator residence.** The rates describe ad audiences, not whether a channel is operated by someone in Mexico, Britain or India.
- **CPM ≠ RPM.** Gross advertising impression cost, eligible monetized playbacks and creator revenue per video view are different metrics. Multiplying CPM by a nominal 55% creator share cannot fix non-monetized views, ad placements, eligible revenue or streaming/product differences. Do not compute creator pay from this data.
- **Selection limits.** AIR works with participating creators. The article does not provide a random channel sample, geographical case counts, confidence intervals or platform-wide universe. Regional CPMs may move with season and advertiser demand.
- **Overlap risk.** The separate [AIR 2026 study of 300 monetized channels](air-studio-benchmarks-2026.json) uses a later time window and a different stated selection; potential same-provider client overlap prevents treating these as independent random estimates.
- **FX and living standards.** USD ad prices do not reveal the earning person's settlement currency, tax liability, expenses or consumption PPP. See the [owner income country protocol](creator-country-income-comparability.md).

[Machine values and scope](air-2025-viewer-cpm-countries.json) · [measurement auditor](../../site/air-country-cpm-audit.mjs) · [regression tests](../../tests/air-country-cpm-audit.test.mjs).

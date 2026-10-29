# Steam paid-game launch prices: a rounded "$0" bucket is not zero-priced games

**Reviewed October 29, 2026.** [Machine-readable observations](steam-public-launch-price-bucket-and-cohort-integrity-2026.json) · [guarded aggregate calculator](../../site/steam-public-price-bin-integrity.mjs) · [tests](../../tests/steam-public-price-bin-integrity.test.mjs). Data are from [steamlense's public Steam market page](https://steamlense.com/stats/market); these are **third-party catalog price summaries**, not game revenue or personal merchant statements.

## A hidden measurement trap in the price histogram

Steamlense labels its **111,356-game price frame** as **paid games** and groups launch prices by **whole-dollar buckets**, but its first bucket is visibly labeled **"$0"** with **11,504 games**. The same page reports **11,480 games priced at exactly $0.99** as a high-frequency exact price point.

If both charts use the same game population, one-dollar bins group prices by their whole-dollar floor, and the exact $0.99 point falls in the $0 bucket, then:

- At least **11,480 / 11,504 = 99.79%** of that supposedly "$0" histogram bucket consists of $0.99 games.
- At most **24** of the bin's game records have another sub-$1 price under that framing.
- **None of this provides a count of free-to-play launches**; the price bin is a display convention, not a separate premium/F2P census.

The [synthetic arithmetic guard](../../site/steam-public-price-bin-integrity.mjs) reproduces the ratio only under stated shared-frame assumptions. It does **not** treat the unknown 24 entries as actual free games or construct individual game prices.

## Public price points and age-specific summaries

The same source reports **15,846** games at the exact US-dollar launch-price point **$4.99**, compared with **12,257 at $9.99** and **11,480 at $0.99**. These are unweighted *catalog counts*, not how many units buyers bought at each price. The apparent dominance of a price anchor is therefore not a validated recommendation for a new game or an estimate of gross sales.

| Release year | Provider-reported median launch price | Provider-reported mean launch price | Time completeness |
| --- | ---: | ---: | --- |
| 2024 | $5.00 | $9.80 | Calendar year ended |
| 2025 | $5.30 | $9.10 | Calendar year ended |
| 2026 | $6.00 | $8.60 | **Incomplete as of this review** |

The 2026 median cannot be treated as a final trend, and changing game composition, historic coverage, price metadata and region choices can affect these comparisons. [Steamlense's methodology](https://steamlense.com/methodology) describes rolling collection and uneven historical availability. No raw AppID-level prices or historical delisted-game records were accessed, so this report **does not certify the complete originally-paid launch cohort**.

## What this does and does not measure

Valve's [official pricing guide](https://partner.steamgames.com/doc/store/pricing?l=english) permits regional packages, currency-specific price rules, sale discounts and publisher-controlled price changes. A US-dollar list or launch price does **not** describe the paid checkout amount for purchasers across all regions, let alone taxes, refunds, platform share, development costs and actual bank receipts.

The project can now correctly report that $4.99 is a common **observed price point in the provider catalog** and avoid conflating the rounded $0 price bucket with free titles. It **cannot** conclude that $4.99 maximizes earnings, estimate price elasticity, compare game profitability, measure zero paid orders or validate a typical publisher's take-home.

**Next evidence needed:** a fixed launch-cohort AppID list with historical first-paid eligibility, independently verified game price points and source timestamps, and authorized purchase-level receipts plus complete costs before any revenue- or profit-based price recommendation.

# Shorts advertising economics: country pools, engaged views and targeted placements

**Verified:** 2026-10-25. Primary sources: [YouTube Shorts monetization policies](https://support.google.com/youtube/answer/12504220?hl=en), [partner earnings overview](https://support.google.com/youtube/answer/72902?hl=en) and [the 2027 YPP announcement](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/).

## The current Shorts Feed Creator Pool has four stages

(1) YouTube pools relevant advertising revenue from ads displayed *between Shorts* in the Shorts Feed, rather than advertising inventory on an individual Watch Page.

(2) Music arrangements allocate some eligible advertising receipts toward licensing: the published examples give 100% to the Creator Pool with zero tracks, half with one qualifying music track and one third with two. This acts on **pool funding**; creators subsequently receive allocation based on their eligible engaged-view share even when their Short used music. Do not extrapolate these published example fractions to arbitrary music arrangements without supported rules.

(3) Within each country, an eligible creator's share of **total eligible monetizing creator engaged views** determines their allocated portion of the Creator Pool. For a known hypothetical country pool P, eligible creator count E and matching total T, the allocation is P × E/T, requiring T greater than zero and E no greater than T.

(4) The creator's contractual portion is 45% **of that allocated pool portion**, not of raw advertiser gross revenue, Shorts public views, or individual Shorts ad impressions. Ineligible/reused/invalid/ad-unsuitable Shorts views and views before Shorts Monetization Module acceptance do not qualify.

The exact country-specific P, T and E for a typical channel are all **unknown** without appropriate creator and platform access. Even with a computed contractual share, creator after-cost profit, taxes and payment arrival remain unknown.

## February 2027 changes must not be applied to October 2026

For month-specific Shorts and Premium allocation beginning February 1, 2027, YouTube announces a requirement of **10 million qualified Shorts views in the rolling 90-day window**, evaluated over a period ending on the 15th day of the *previous calendar month*. This is distinct from new creator YPP enrollment thresholds and does not itself remove long-form earnings.

Also beginning February 2027, certain ads targeted to **five or fewer channels** can generate a separate **45% share of eligible net revenue from that specific ad**, independently of the pooled Shorts Feed route. This is **not** equivalent to multiplying entire gross ad spend by 45%, and the same ad placement must not be included in both hypothetical routes. The [future terms file](ypp-transition-2027.json) already records the larger YPP transition; this study tests the money denominators.

## Pure bounded arithmetic

The [country-pool validator](../../site/shorts-pool-economics.mjs) accepts an explicitly supplied hypothetical 2026 country pool, matching eligible engaged views and accepted module. It rejects raw public-view proxies, incomplete eligibility and zero denominators. A separate method validates the future targeted ad route; neither produces observed revenue.

[Machine account and temporal rules](shorts-pool-economics.json) · [Regression tests](../../tests/shorts-pool-economics.test.mjs). No creator account, advertising auction, payout or bank records were accessed.

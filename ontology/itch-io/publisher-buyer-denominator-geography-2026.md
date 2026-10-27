# Paid-game publishers, buyer populations and country/language scope

Reviewed October 26, 2026. [Machine cohort/role specification](publisher-buyer-denominator-geography-2026.json). This completes **measurement-definition work**, not a census of commercial game buyers or active paid publishers.

## Who supplies games, and who gets paid?

An itch.io **account** can own several **project pages**. A page can be free-only or feature a mandatory minimum price. The person developing a game need not be identical to the account owner, merchant-of-record or payout recipient. A team can have several contributors. A page offered for money is not proof that a purchase occurred. An **actual paid-game seller** must be observed as having received at least one retained payment for a positive-minimum-price game in the chosen time window.

The [official payments documentation](https://itch.io/docs/creators/payments) distinguishes **Direct to you** (publisher is merchant of record and receives provider transfers) from **Collected by itch.io** (platform is merchant of record and later settles eligible seller payouts). These are payment configurations, not two independent publisher populations. A single account may publish several titles; count a seller only once when estimating the eligible publisher cohort.

## Who encounters games, and who pays?

| Unit | Necessary observation | Is it a paying person? |
|---|---|---|
| Page visitor | Page-view event | No |
| Browser-game player | Browser play event | No |
| Demo downloader | Free download event | No |
| Download-key owner | Access entitlement, possibly gifted or bundled | Not necessarily |
| Checkout attempt | Started transaction | Not necessarily |
| Paid-game order | Completed, retained positive-minimum-price purchase | A paid **order**, not automatically a unique human |
| Returning buyer | A second retained paid order linked with appropriate authorized deduplication | Only with private consented cohort linkage |
| Follower, rater or reviewer | Attention/feedback event | No |

The [buying documentation](https://itch.io/docs/creators/how-buying-works) confirms that **a buyer need not have an itch.io account**. Purchase receipts may be associated with an email, but a public research page has no permission to infer distinct human identities from email, keys, purchases, or followers. Unauthorized private buyer records must not be used to estimate market demand.

## Geographic and temporal measurement rules

Define the **seller's payment/onboarding jurisdiction**, the **buyer's purchasing country**, and the **game's available language** as *three independent variables*. A Spanish-language game is not automatically sold in Mexico; a Mexico-based seller can have buyers in other countries if payment rules permit. The [2025 operator notice for the UK](https://itch.io/t/5133739/our-update-on-the-uk-online-safety-act) is a specific historical content-availability exception, not proof of other current countries' purchasing limits.

A real future sample would use fixed publication cohorts measured at **30, 90, and 365 days** after the first qualifying positive-price commercial release, including listings with no paid orders and eligible delisted games if recoverable. Payout and merchant records must have matching dates, refund exclusions, currency, geography and consent to publish safe aggregates. The current platform-wide buyer count, paid-seller count, zero-earner share, actual repeat-buyer fraction and country/language-specific demand remain **unknown**.

This is the boundary between defining an auditable population and measuring it. Source-linked examples cannot substitute for an actual complete or probability-sampled game-purchase cohort.

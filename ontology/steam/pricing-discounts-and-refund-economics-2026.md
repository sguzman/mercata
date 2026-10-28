# Steam paid-game price, discount and refund economics

**Reviewed October 28, 2026.** [Structured study](pricing-discounts-and-refund-economics-2026.json). This is a **current public-policy review**, not a historical game transaction sample or a finding about developer profits.

## Refund risk is real, but no actual refund rate is known

[Valve's buyer policy](https://store.steampowered.com/steam_refunds?l=english) ordinarily offers a refund for game/software purchases made within **14 days** where playtime is **under 2 hours**. Valve will consider requests outside those conditions and recognizes that some jurisdictions provide additional consumer rights. These are **eligibility rules, not seller refund frequencies**.

- Downloadable content generally has a **14-day** window and an underlying-title playtime restriction after purchase, with transfer/consumption and third-party exceptions.
- For qualifying in-game items, Valve-developed titles have a **48-hour** policy; non-Valve developers can opt into relevant refund treatment.
- Steam specifically includes Early Access/Advance Access playtime when applying the two-hour rule for titles bought before release; the exact pre-release purchase window has separate conditions.

Actual refund-adjusted net sales require transaction data. Do not replace `gross_units_returned` with a guess based on customer eligibility.

## Price and promotional mechanics

[Valve's discount guide](https://partner.steamgames.com/doc/marketing/discounts?l=english) documents an optional **10–40% launch-discount band**, for **7–14 days** (the guide recommends approximately 10–15% as a policy suggestion, not a measured optimum). Ordinary postlaunch discounts can generally be **10–95%** for **1–14 days**, subject to local checkout-price floors.

Normal discounts are blocked by a **30-day cooldown** after Early Access launch, full release, or price increases, with specific launch-discount exceptions. Custom discounts are ordinarily separated by **30 days from the previous discount's end**. Steam-wide seasonal discounts are exempt from the *discount-to-discount* rule, but **not** the *new-release or price-increase* rules. A base-price increase shortly before a 1.0 launch can therefore preclude a 1.0 launch discount. The [pricing guide](https://partner.steamgames.com/doc/store/pricing?l=english) explains the timing.

Further sources of non-comparability: discounts of **20% or more** may trigger wishlist notices, but notices are not purchases; **bundle discounts stack** atop individual package discounts; and fixed US prices miss region-specific prices, taxes and refund treatment.

## Regional price floors and the observed-value problem

[Valve's current pricing document](https://partner.steamgames.com/doc/store/pricing?l=english) describes a minimum base-price tier comparable to **USD $0.99** and a minimum checkout price of about **USD $0.49**, with currency equivalents. Missing a price in a required regional currency can make a product unavailable to those buyers. These are policy floor equivalents, **not** a statement that all regions pay USD or that all published games meet every region's thresholds.

A model based on *(current US base price) × (estimated total owners)* is not verified gross Steam checkout: ownership may include key activations, promotions, free weekends, bundles and gifts, while price realization varies by region and campaign. [Steam Spy warns ownership is not a sale](https://steamspy.com/about). Historical price attribution must pair sales/return periods with discount, package, region and exchange-rate treatments.

## A deliberately hypothetical cash bridge

The following arithmetic is *not a report about a real game or Steam's average rate*:

| Synthetic event | Value |
| --- | ---: |
| 100 hypothetical paid units × USD $10 | **$1,000 gross** |
| 5 returned units × the same USD $10 | −$50 |
| Arbitrarily assumed aggregate net taxes | −$80 |
| **Illustrative sales after returns and taxes** | **$870** |
| Valve's contractual share | **Unknown** |
| Publisher/developer split | **Unknown** |
| Actual bank receipts | **Unknown** |
| Production/marketing costs | **Unknown** |
| **Developer profit** | **Unknown** |

The synthetic figures are only a check of the mathematical bridge. [Valve's financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) names actual fields for gross sold, returned, net sales and taxes; [monthly payout reports](https://partner.steamgames.com/doc/finance/payments_salesreporting) address further payment adjustments. Neither was accessed for this study.

## Implication for a defensible earnings cohort

Revenue estimates need dated launch and discount histories, original and promotional regional prices, package mapping, returns and authorized partner settlement. Even an accurate total **gross units sold** figure cannot directly supply a developer net payout or profit. Discount rules read in **October 2026** are not automatically evidence of the policy governing a **2025** launch. This research advanced definitions and protocol readiness, **not** any observed mean, median, merchant return rate or break-even distribution.

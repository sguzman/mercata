# Source-quality check: the repeated “80% below $50 monthly” assertion

**Reviewed October 26, 2026.** [Machine source-chain audit](unverified-income-statistics-chain-2026.json). This file evaluates source credibility and does **not** add an itch.io income survey.

A [March 2026 editorial guide](https://generalistprogrammer.com/tutorials/how-to-make-money-on-itchio-indie-game-guide) asserts that roughly **80% of paid itch.io games earn between $0 and $50 monthly**, followed by several higher-income bands. However, it does **not** give an inspectable sampled game list, eligible seller population, release period, statistical method, source transaction records, gross-versus-net definition, or a way to include delisted and unsold titles.

A [July–September 2026 Cinevva guide](https://app.cinevva.com/guides/web-game-monetization) cites that editorial guide, and an [August 2026 PlayFox article](https://playfox.org/news/indie-dev-revenue/) in turn cites Cinevva. These are **a chain of quotations, not three independent income surveys**. No source in the chain provides the missing population and payment methodology.

### Check against documented platform policy

The original editorial guide additionally says there is **no collected-payout minimum** for itch.io sellers, whereas itch.io's [official payments guide](https://itch.io/docs/creators/payments) describes **$5 available balance** as a prerequisite for requesting a collected payout. Its comparison table also presents Epic Games Store publishing as having no submission fee, whereas [Epic's developer documentation](https://dev.epicgames.com/docs/epic-games-store/publishing-tools/organization-management/manage-org) documents a **$100 per-product submission fee**. These are independent policy contradictions, not evidence that a particular published revenue distribution is mathematically false.

The 80/15/4/0.8/less-than-0.2 tier figures should therefore **not be adopted** as Mercata's seller-income evidence. Whether the true distribution resembles the article's conjecture remains unknown. The numbers cannot justify an itch.io median, paid game failure probability, regional demand forecast, or expected first-release earnings.

An accepted estimate would require an explicit paid-publisher denominator, zero earners, consistent first-commercial-title release ages, settled transactions, refunds, and a disclosed aggregation/sampling method. Until such data exist, the respective machine fields stay `null`. This is a provenance audit only, with no private account or buyer data accessed.

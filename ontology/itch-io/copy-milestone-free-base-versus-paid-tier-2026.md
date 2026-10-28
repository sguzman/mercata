# Creator copy milestones and paid-game order identity

**Reviewed October 28, 2026.** This [machine case](copy-milestone-free-base-versus-paid-tier-2026.json) compares **one existing** positive-price game example against a newly documented mixed-access visual novel. It does not add a new sampled paid seller cohort.

## Pre-existing contrast: Dead Trust
Mercata's [existing Dead Trust study](dead-trust-paid-release-milestones-2025-2026.md) already established 150+ first-week creator-reported copies and 300+ cumulative copies from later reporting. Its current storefront advertises a positive minimum price. The unknown upper bounds prevent subtracting the two threshold figures to infer exactly 150 later sales. Its historical channel, refund, currency and net-income definitions also remain unverified.

## New observation: ERROR143
On [August 11, 2026](https://jennyvipham.itch.io/error143/devlog/1624789/error143-recently-hit-100000-copies-sold), the creator announced **100,000 copies sold**. However, the [October 2026 storefront](https://jennyvipham.itch.io/error143?click_to_load=true) offers a **free/name-your-price base game** and separate **USD 25 full-game files**. There is no breakdown into base downloads, paid full unlocks, bundles or other distribution channels.

Therefore, the phrase “copies sold” is **not an independently verified count of 100,000 paid full-game orders**. Multiplying 100,000 by the USD 25 full-unlock price would create a fictitious **USD 2.5 million** sales figure. The dated offer is a current listing, not a proved history of all checkout rules.

## Method
The [copy-milestone audit](../../site/itch-creator-copy-milestone-audit.mjs) preserves author-reported lower bounds but returns `null` for independently verified paid orders, matched retained earnings and exact increments. It rejects absent provenance or personal buyer fields. The two cases have incompatible offer types and cannot yield paid-game market means, medians, or zero-sale incidence.

**Research status remains unchanged:** No representative publisher frame, verified payout, unique paid buyers or complete after-cost profit observed. No account logins, commercial experiments or transaction records were used.

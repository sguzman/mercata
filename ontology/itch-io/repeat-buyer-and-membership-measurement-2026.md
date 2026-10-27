# Repeat game purchases versus outside membership — measurement protocol

Reviewed **October 26, 2026**. [Structured research specification](repeat-buyer-and-membership-measurement-2026.json). This completes a **previously registered measurement-definition task**, not a live sales or marketing experiment.

## What is a repeat paying customer?

For a seller-authorized, deduplicated cohort of people or buyer entities that made a **first retained positive-price game order**, define a repeat purchaser as someone with another **later retained paid game order** from the designated publisher portfolio within **30, 90 or 365 days**. The denominator is all eligible initial paying customers who have the full follow-up period; disclose how much of the cohort is right-censored. Report separate outcomes for repeat people, repeat orders, refunds and cash proceeds, retaining a consistent currency and fee basis. A single person making two game purchases produces two transactions but only **one** repeat-paying customer. Without an authorized identity-linkage method, **repeat buyer counts must remain unknown**, even if order counts are available.

A game may be bought once and continue providing updates, so no automatic *per-game monthly churn* exists merely because a native sale occurred. Sales over time can be studied as reorders across a portfolio only if games and timestamps are explicitly matched, the buyer identity is consensually deduplicated, and no paid products or historic purchase events are silently omitted.

## Do not confuse these five economic events

| Event | What it proves | Does it count as another paid game order? |
|---|---|---|
| Retained positive-price checkout | A documented buyer payment | **Yes**, if later than the buyer's first qualifying order |
| Free browser play or download | Access/interest event | No |
| Game ownership or download key | Entitlement may come from purchase, gift or bundle | No, unless linked to a verified paid order |
| Seller followers, feed, sale emails | Notification opportunity, not realized purchase | No |
| Patreon-tier access via itch.io | External membership entitlement | No native itch.io order |

The operator [documents follower notifications](https://itch.io/docs/accounts/followers), [purchase and download key semantics](https://itch.io/docs/creators/download-keys), and the [July 2026 Patreon integration](https://itch.io/blog/1572473/itchio-changelog-sale-explorer-bundle-hosting-revamp-jam-theme-editor-patreon-integration-more). Patreon members can receive an itch.io access key; the key is not a receipt for a newly purchased game. Patreon billing is **external**, so itch.io key grants cannot measure renewals or membership churn.

## Definitions for external subscriptions

For a separately authorized Patreon membership cohort, a **renewal rate** is paid memberships successfully renewing divided by memberships **due** to renew in the aligned period. A **churn rate** is memberships whose paid access ended without renewal by the end of a declared grace period divided by eligible members at risk at the period's start. A member's cancellation request does not necessarily terminate already-paid entitlement immediately. Define calendar billing periods and treatment of gifted, free, declined-payment and grace-period memberships independently; report unknown eligibility rather than guessing.

Do not add Patreon membership revenue to native itch.io paid-game receipts without explicit channel separation. Do not assume a person with a Patreon entitlement has purchased a game.

## Safe future measurement gate

This protocol authorizes **no** account login, buyer record download, external platform connection, campaign, or spending. A participating publisher would need to conduct any buyer deduplication privately, with appropriate authorization, and supply **disclosure-safe aggregates only**. The public research excludes emails, transaction IDs, keys, OAuth tokens and person-level platform joins. It should disclose first-order cohort sizes, eligible follow-up, censored observations, retained paid orders, refunds, time window, sales channel and the missing populations before calculating rates.

**Unobserved outcomes:** real repeat-buyer fraction, repeat game purchases, native paid-customer churn, membership renewal/churn and any causal benefit of follower outreach. The [existing seller cohort protocol](transaction-cohort-protocol-2026.md) and [game purchase privacy boundary](api-purchase-privacy-2026.md) govern this work.

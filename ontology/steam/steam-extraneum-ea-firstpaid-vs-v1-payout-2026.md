# Extraneum: first paid Early Access, later 1.0 and an ambiguous after-deductions report

**Reviewed October 30, 2026.** [Source-linked audit](steam-extraneum-ea-firstpaid-vs-v1-payout-2026.json) · [synthetic milestone/accounting guard](../../site/steam-ea-firstpaid-payout-guard.mjs) · [tests](../../tests/steam-ea-firstpaid-payout-guard.test.mjs). This is one **developer-authored voluntary postmortem**, not a complete financial ledger or representative Steam sample.

## Three dates describe different commercial events

The [creator's October 21, 2025 retrospective](https://davidjalbert.itch.io/extraneum/devlog/1090186/extraneum-post-mortem-one-year-later) describes a free itch.io demo in **July 2021**, a first paid Steam Early Access period in **June 2022**, and completion of the game in **September 2024**. The [public Steam store listing](https://store.steampowered.com/app/1999140?l=english) dates Early Access **June 14, 2022** and the full release **September 25, 2024**. Both milestones occurred on the same game AppID. The 2024 version 1.0 event is **not a second first-paid launch**; a study of launch-month performance must choose and report the right starting event.

## Approximate after-deductions game proceeds are not verified personal pay

One year after the full launch, the author reports **roughly 2,400 units** and **about USD $12,000 after the Steam cut, taxes, refunds and unspecified other deductions**, after approximately **three years** of development. The source does not publish the raw order history, normalized accounting base, taxes by jurisdiction, actual deposits, license contract, outsourced costs, paid labor-hours or a reconciled net/profit ledger. A descriptive $12,000 / 2,400 = **$5 per reported game unit after unspecified deductions** is neither a direct checkout price nor the creator's personal hourly compensation.

The creator says **most revenue arrived during paid Early Access**, with few additional purchases after full release, but does not provide a period-by-period verified sales split. The Steam listing separately identifies **David Jalbert (developer)** and **Hellforge Studios (publisher)**; the author discusses an outside publishing deal. A net amount calculated after some Steam deductions is therefore not necessarily an amount personally received by the developer. No publisher share or recoupment assumption has been inserted.

## An unchanged wishlist stock can conceal transactions

The author describes approximately **10,000 outstanding wishlists near 1.0** and **10,600 one year later**. This is an *increase in account-stock balance*, not 600 verified new customers nor a negative purchase conversion rate. Adds, removals and purchase-triggered deletions all influence the stock. The title's Early Access sales and demo players are distinct populations from launch-day wishlist owners.

The [audit guard](../../site/steam-ea-firstpaid-payout-guard.mjs) accepts synthetic aggregate reports only, rejects contradictory chronology and unsupported real-transaction columns, and returns null for any verified bank receipt, contract share, labor wage, first-game population median, zero-sale share or causal Early Access uplift.

**Research status:** This single firsthand disclosure adds context to first-paid-release timing and developer versus publisher accounting, not a market-wide income distribution. No private Steam partner records or individual customer data were accessed.

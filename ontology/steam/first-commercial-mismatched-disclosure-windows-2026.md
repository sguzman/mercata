# Three self-reported first Steam games: incompatible launch windows and money definitions

**Reviewed October 29, 2026.** [Machine record](first-commercial-mismatched-disclosure-windows-2026.json) · [comparability tests](../../tests/steam-firstgame-three-window-comparability.test.mjs). Three independent first-person releases are documented here as *selected case studies*, not a representative or standardized game cohort.

## Comparable identity does not mean comparable observation windows

| Game | Official first paid release | Author's reporting period | Reported units | Financial statement |
| --- | --- | --- | ---: | --- |
| [Vocator](https://store.steampowered.com/app/3682060/Vocator/) | 2026-01-27 | A little over two weeks | 40 | None |
| [Lone Survivors](https://store.steampowered.com/app/3629280/) | 2026-02-27 | First week | 279 | About $1,300 **author-labelled total revenue**, excluding returns/chargebacks/VAT |
| [Off the Beaten Track](https://store.steampowered.com/app/3752960/) | 2026-04-29 | About one month | 49 | $321 **author-labelled net**, with unspecified settlement stage |

The [Vocator developer's February 12 report](https://www.reddit.com/r/IndieDev/comments/1r33rv3/lessons_from_my_first_commercial_game/) supplies an initial sales count and roughly 150 launch wishlists, but no published monetary receipts. The developer recommends demos and language support based on personal experience; this is not a controlled visibility experiment.

The [Lone Survivors March 9 retrospective](https://www.reddit.com/r/gamedev/comments/1rp216y/one_week_after_releasing_my_first_steam_game/) reports 279 first-week sales, nine refunds, nine user-purchased reviews and 903 launch wishlists after about 18 months of solo development. The storefront dates its release **February 27**, ten calendar days before the post's publication. The reporter's term *first week* remains a self-defined period, not all days between the storefront date and the post. About $500 in Reddit ads paid for by a partner, 80 promotional keys and 270+ demo players are marketing inputs or exposure observations, not verified incremental sales.

The [Off the Beaten Track May 31 retrospective](https://www.reddit.com/r/IndieDev/comments/1tt87br/one_month_after_releasing_our_first_steam_game_49/) reports 49 units, four refunds (4/49 ≈ 8.2%), $321 called net, 38 unique players, and launch wishlist stock around 800 growing to 1,193. Its [Steam page](https://store.steampowered.com/app/3752960/) gives an April 29 first paid release, approximately 32 days earlier. A changing wishlist inventory cannot supply matched launch-wishlister conversion.

## What may and may not be calculated

All three author posts are opt-in disclosures from games that report **some sales**. This is neither a zero-sales sampling frame nor a probability sample of all debut publishers. Their time windows, money categories, launch conditions, and cost ledgers do not match. An average, median, or ratio built by pooling these three counts would be arithmetic on noncomparable observations, not the first-paid-release market distribution.

[Valve's financial reporting FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) explains reporting stages and the separation of gross sales, deductions, revenue share and eventual payment. Neither the $321 net label nor the roughly $1,300 total-revenue label is an audited bank deposit or developer after-cost return. Vocator has no reported revenue figure to impute.

**Still unknown:** matched first-7-day and first-30-day gross for the same complete population; exact paid transactions and refund cohorts; owner-payee receipts, production costs, developer compensation, and the true zero-paid-sale fraction. Steam store metadata verifies names and initial release dates only, not the author-reported transactions. No private Steamworks records were accessed.

## Period returns and safely bounded aggregate arithmetic — October 30, 2026

The [synthetic window guard](../../site/steam-mismatched-disclosure-window-guard.mjs) no longer assumes that a count of **refund events during a reporting period** is necessarily a subset of purchases recorded *during that period*. A refund for a purchase in an earlier window can create more period refund events than period purchases, as the separate [refund-period analysis](refund-reporting-period-versus-purchase-cohort-2026.md) explains. The helper still cannot infer a matched purchase-cohort return rate. Its hypothetical aligned title sums also reject JavaScript safe-integer overflow instead of silently returning rounded counts or cents. These are protocol-integrity corrections, not newly verified Steam orders, payout observations or progress points.

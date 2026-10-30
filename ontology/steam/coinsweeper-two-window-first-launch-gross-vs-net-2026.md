# Coinsweeper: 48-hour versus four-week self-reported gross and undefined net

**Reviewed October 29, 2026.** [Machine record](coinsweeper-two-window-first-launch-gross-vs-net-2026.json) · [two-window audit guard](../../site/steam-two-window-selfreport-cash-guard.mjs) · [regression tests](../../tests/steam-two-window-selfreport-cash-guard.test.mjs). This is a **voluntary first-person postmortem**, not a verified monthly Steam payment report or an independently sampled publisher income cohort.

## Two cumulative checkpoints after the first commercial launch

In a [June 2, 2026 first-person post](https://www.reddit.com/r/IndieDev/comments/1tusj3u/i_released_my_first_commercial_game_on_steam_here/), the developer describes an approximately eight-month development cycle and first commercial launch of *Coinsweeper*. The [Steam storefront](https://store.steampowered.com/app/4321130/Coinsweeper/) independently confirms an **April 28, 2026** release and publicly names Duo Forge Games as both developer and publisher. This confirms a game and a release date; it does **not** authenticate any income reporting.

The author reports approximately **280 units**, **$1,118 gross** and **$951 author-labelled net** within the first **48 hours**, rising to approximately **800 units**, **$3,295 gross** and **$2,593 author-labelled net** at around **four weeks**. The difference between cumulative reports is **$2,177 gross** and **$1,642 in the same undefined net category**, not necessarily a bank deposit or a value after Valve’s revenue share. Approximately **520 more copies** follow only from subtracting two rounded estimates.

## List price, discounts, wishlists and returns are distinct populations

The author gives a **$4.99** list price and **25% release discount**. Multiplying the store’s later list price by all reported units would ignore discount periods, regional checkout prices, refunds, and taxes. Reported wishlist stock moves from about **1,900 at launch**, to **1,949** at 48 hours and **2,258** at four weeks. It is not a fixed launch-wishlister cohort; no specific sales are joined to original wishlisters. The source reports **12.5% refund rate** and **34 reviews**, but these cannot establish verified refund counts or a universal review-to-sale multiplier.

## Undefined net is not net cash received

[Valve’s partner finance FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) distinguishes in-period gross reporting, adjusted Steam net, partner revenue shares and withholding or bank payments. The developer post does not identify exactly which deduction level the $951 and $2,593 “net” values cover. Do **not** automatically deduct a second 30%, assume it was already deducted, or equate the value with personal take-home. Contracts, labor costs, bank reconciliation and tax records were not supplied.

The pure [synthetic comparison guard](../../site/steam-two-window-selfreport-cash-guard.mjs) validates monotone cumulative observation windows and computes bounded descriptive differences. It returns **null** for verified paid orders, realized bank cash, game lifetime sales, meaningful wishlist conversion, developer profit and population earnings. The cases are public aggregate descriptions; no private Steamworks access, player records or credentials were used.

**Limits:** one self-selected, right-censored release; approximate units and windows; unmatched wishlists, refunds and reviews; no independent signed publisher ledger. Actual after-cost returns, typical first-paid launch outcomes and exact zero-sales fraction are unknown.

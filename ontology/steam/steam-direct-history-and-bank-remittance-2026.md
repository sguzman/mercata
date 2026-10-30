# Steam platform history and payment-processing boundaries

**Reviewed October 28, 2026.** [Structured chronology and cash-flow dictionary](steam-direct-history-and-bank-remittance-2026.json). Only public, dated Valve documents and **synthetic** cash arithmetic. No partner payout or bank statement was obtained.

## Distinguish platform eras before comparing seller income

In [Valve's June 2017 transition announcement](https://store.steampowered.com/news/posts/?enddate=1497372843&feed=steam_blog), it dates Steam Greenlight's start to **August 30, 2012**, its submission/voting closure to **June 6, 2017**, and Steam Direct's launch to **June 13, 2017**. Greenlight was a public-voting admission process; Direct created a more direct submission path with game/build/store-page reviews. Their applicant denominators, time-to-publish processes and later catalog sizes are not equivalent. Earlier manually selected games are a further, distinct era.

Valve's [2018 revenue-share announcement](https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838) defined marginal publisher share tiers effective for eligible adjusted revenues from **October 1, 2018** onward. It is not evidence of the exact effective share for all partners or earlier years. Other discovery system changes and evolving consumer behavior compound cross-era comparisons.

## Payment platform share is not the same thing as bank processing costs

Valve's [Reporting and Payments FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) describes payouts by the following month-end, generally by its **30th day**, using **ACH** for US accounts and **USD SWIFT** wires elsewhere. It pays **USD only**, and a partner normally registers one receiving bank account. Valve says it does **not** pass on its own wire-transfer fee, but intermediary and receiving banks may impose deductions. Low payment balances can be held at **USD 100** or at an appropriately chosen higher holding threshold; returned payments join the next monthly cycle and do not trigger off-cycle remittances.

The [Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq) defines a useful order of operations: gross receipts, applicable consumption taxes, returns and chargebacks, then eligible net revenue and the contractual partner share, with applicable withholding taxes deducted before remittance. Receiving bank fees and FX conversion can change the final local deposit beyond what the Steam statement displays.

The reviewed public materials do **not** provide a universal separate *per-checkout credit-card processing charge* that should be automatically added to the Steam revenue-share deduction. That is not the same thing as claiming zero payment-processing cost; actual fees, tax withholding and foreign exchange need partner- and bank-specific documentation.

## Explicit hypothetical cash bridge (never a typical indie earnings estimate)

Assume, purely for testing: **$1,000** gross customer receipts, **$100** tax, **$100** returns, **$50** chargebacks; **70%** hypothetical contractual partner share, **10%** hypothetical withholding on the partner share, and **$10** hypothetical receiving bank fees. The result is $750 eligible adjusted net, $525 partner share, $472.50 after withholding, and **$462.50** USD-equivalent before any separately specified exchange-rate spread or developer/publisher agreement. These inputs are fabricated for calculator tests, not observations.

The [companion pure function](../../site/steam-remittance-bridge.mjs) refuses invalid amounts or rates and leaves *actual* bank deposits and developer profits null. It does not invent a card-processing deduction.

**Unresolved:** actual processor cost allocations, partner contracts, bank fees, effective FX rates, signed royalties, and net developer income. No individual merchant data or bank account was accessed.

### Synthetic input strictness

The hypothetical USD remittance calculator accepts only its seven named amount and assumed-rate fields. It rejects extraneous financial or account metadata rather than silently accepting real-looking bank or transaction identifiers. These checks do not turn the example into a real payout forecast or verify any partner's taxes or bank FX conversion. No additional research completion is credited for this code validation.

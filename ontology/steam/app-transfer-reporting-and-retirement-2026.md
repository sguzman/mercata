# Steam application transfers: payment boundaries and product retirement

**Reviewed October 28, 2026.** [Machine-readable findings](app-transfer-reporting-and-retirement-2026.json). Public Steamworks guidance, not legal title verification or a merchant earnings survey.

## What changes when a Steam game changes its managing partner?

[Valve's Transferring Applications guide](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?l=english) requires actual-authority permissions on the sending and receiving accounts, confirmation from both sides, and Valve approval (usually **2–7 business days**). The sending partner selects a transfer effective date for routing payments.

The game keeps its AppID, existing customers, public reviews and store presence. Historical wishlist information becomes available to the receiving partner. **Financial history is different:** new managers by default see only sales periods for which they receive payments. Historical sales can be made visible through explicitly shared financial permissions, but should otherwise be treated as *unobserved*, never as zero revenue. Marketing UTM records likewise have limited default lookback (about **two weeks** before the transfer effective date).

Existing bundles do not automatically move with the app, publisher API keys require new credentials, and discount cooldowns are not reset. A Steamworks management transfer does not reveal separate copyright assignments, royalty rights or the profit allocated to a game developer.

## What changes when a game leaves the store?

Valve's [retirement guidance](https://partner.steamgames.com/doc/store/retire_app?l=english) says a retired game is hidden from normal store shopping and cannot be newly bought, but existing owners generally retain library access and can still download and launch it. Online servers are a separate continuity concern. Publishers are instructed to stop selling keys at other retailers and reconcile unsold stock.

For **Free to Play** games Valve requests at least **90 days' notice** and stopping in-game purchases before retirement. In cancellation or unmet-promise scenarios, refunds may be extended beyond standard windows. These are policy conditions, not measured refund rates.

## Implication for the Mercata income sample

A multi-year sample of developer revenue requires tracking AppID transfers, payee periods, historical sales access and delisted titles. Today's visible publisher label cannot supply historical contract ownership. **No financial report, royalty contract, actual retirement loss or customer record was accessed.** All actual payout and profit statistics remain unknown.

# itch.io purchase API and the limits of public market evidence

**Source:** [itch.io official server-side API reference](https://itch.io/docs/api/serverside), reviewed October 26, 2026. Machine crosswalk: [api-purchase-privacy-2026.json](api-purchase-privacy-2026.json).

## Which documented records actually indicate payment?

The API documentation requires **bearer credentials** and defined scopes, not public access. Its game-specific `purchases` operation uses the `game:view:purchases` scope and looks up **completed purchases for an identified email or user ID**. That is a buyer-authorization function, **not a public all-seller transaction stream**. The response can distinguish game, bundle and sub-product purchase types and carries a donation flag, but fields in real responses may include buyer email and other sensitive identifiers.

A separate `download_keys` lookup validates entitlements; a download key can be **manually issued, gifted or claimed** without a corresponding paid purchase. Bundle purchases may include a set of game identifiers in one transaction, so multiple game entitlements are not multiple standalone sale receipts. The OAuth-only game `ownership` endpoint can report entitlement to a game in a purchased bundle even before a game-specific key is claimed. None of these lookups establishes a creator's **net receipts**, much less development profit.

The claimed reward API can contain a **buyer shipping address** or other fulfillment details; that kind of data must never be used as a source for public market research. Mercata must avoid fetching, recording, storing or publishing raw buyer API responses, including email addresses, token values, purchase IDs and tiny identifiable cohorts. A legitimate future survey could request only **aggregated, cleared game-level statistics** from publishers with explicit publication permission.

## Research implication

This source confirms that counting completed transactions, paid bundles, keys, donations and project views requires different measures. It also explains why a random market researcher cannot retrieve **representative positive-price game sales** from these credentialed lookups. That limitation is **not** proof there is no authorized publisher dashboard export, official financial aggregate, or defensible study design elsewhere. Median game profit, active commercial publishers and a zero-earner rate remain **unknown**.

No seller account, buyer record, live endpoint, credential or payment information was accessed.

## Authenticated creator portfolio overview (not a market census)

The current official reference also documents [`profile:games`](https://itch.io/docs/api/serverside) at `https://api.itch.io/profile/games`, a **separate, owner-authorized operation** requiring the `profile:games` scope. Its example contains game `classification`, `published_at`, `min_price`, `purchases_count`, and `earnings` with a currency and minor-unit amount. It covers games the credential holder **uploaded or can edit**, which need not correspond one-for-one to independently owned payout entities. It is not public access to other sellers' records.

This is a legitimate **potential path to an opt-in publisher portfolio snapshot**, not the missing seller-income study. Current minimum price is not proven first-sale price, an undated lifetime purchase counter is not a dated 30/90/365-day retained positive-price order series, and the example's earnings amount is not proven deposited proceeds or developer profit. Free donations, bundles, refunded orders, multiple collaborators and unseen or delisted projects still need independent eligibility and accounting. Never concatenate owner snapshots and divide by public catalog counts to manufacture a representative mean.

**No endpoint was called and no credentials, seller rows or buyer IDs were requested or retained.** A future permitted study would require separate owner consent, source-period reconciliation, coverage and deduplication, secure in-place aggregation, and reviewed publication of nonidentifying summary outputs.

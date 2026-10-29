# Steam in-game fraud, chargebacks and account restrictions: careful denominators

**Reviewed October 28, 2026.** [Machine-readable study](in-game-transaction-fraud-and-account-boundaries-2026.json) and [synthetic-only status test helper](../../site/steam-mtx-status-guards.mjs). No buyer records, authenticated reports, game services or partner accounts accessed.

## Different accounts, different risks

Valve's [Microtransactions guidance](https://partner.steamgames.com/doc/features/microtransactions?l=english) describes its Steam Wallet-based in-game purchase mechanism and anti-fraud tools. In its `GetUserInfo` response, the consumer status can be **Active**, **Trusted**, or **Locked**. Trusted means an older-than-90-days transaction with no associated chargeback, but is not proof a person or account is immune to compromise. A Locked buyer account may be unable to buy because of fraud, a chargeback, a hijack or a policy problem, and that status may be temporary.

**A customer's billing/account status is not the publisher's payout account.** In particular, [Steam's transaction error 14](https://partner.steamgames.com/doc/features/microtransactions/implementation?l=english) means a **consumer billing agreement** was put on hold due to dispute/chargeback. It does **not** establish a freeze on the publisher's bank remittance, and error 104 is a *transaction denied by fraud detection*, not an established studio ban. This study leaves partner-specific money holds and appeals unresolved.

## Why item economies need daily reconciliation

Valve says it detects most fraudulent transactions within about **48 hours** and advises developers to:
- call `ISteamMicroTxn/GetReport` at least daily to reconcile updated settlement statuses;
- delay transfer/trading of newly purchased virtual goods for **at least 72 hours** where appropriate;
- attempt a clawback of in-game goods when the underlying order is refunded or charged back; and
- avoid putting tradable goods or currency into DLC packages.

Those are preventive practices, **not** measured fraud-rate percentages, unconditional guarantees or mandated holds on publisher proceeds. See [Valve's DLC guidance](https://partner.steamgames.com/doc/store/application/dlc), which distinguishes DLC licenses from virtual currency/items.

## API states and invalid inference

[Valve's implementation guide](https://partner.steamgames.com/doc/features/microtransactions/implementation?l=english) lists `Init` (created), `Approved` (authorized), `Succeeded` (processed), and `Failed`, alongside **Refunded**, **PartialRefund**, **Chargedback**, **RefundedSuspectedFraud**, and **RefundedFriendlyFraud**. An approved order has not yet necessarily finalized. A previously successful order can be reversed later, and a **partial refund needs item-level inspection** before it is treated as fully retained or cancelled.

The GetReport `SETTLEMENT`, `GAMESALES`, `STEAMSTORESALES`, and `CHARGEBACK` filters represent different transaction populations; they are not disjoint buckets that should simply be summed. These in-game events also must not be combined uncritically with **base-game checkout package units** from the partner finance service.

The [synthetic fixture guard](../../site/steam-mtx-status-guards.mjs) counts *latest states only*, rejects invalid/duplicate fixture IDs, and returns unknown (`null`) for actual merchant sales, refund-adjusted revenue, fraud prevalence and partner payout status. It collects no real Steam IDs or account information.

## Still missing

A public document describing a consumer chargeback cannot give the chance that an independent developer's **publisher payment** is withheld, the duration of a hold, the appeal path, or the exact fraud/chargeback distribution. That requires the relevant public/publisher terms or authorized partner reporting, scoped to the right payee and period. This research advances **transaction-risk definitions and mitigation**, not verified income statistics or an invented developer suspension rate.

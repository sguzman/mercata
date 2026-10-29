# Steam publisher rights: public credits, management, financial access, and legal contracts

**Reviewed October 29, 2026.** [Structured research](steam-partner-role-rights-crosswalk-2026.json) · [pure hypothetical access crosswalk](../../site/steam-partner-role-rights-crosswalk.mjs) · [tests](../../tests/steam-partner-role-rights-crosswalk.test.mjs).

This official-document audit is **not a review of a signed Steam Distribution Agreement (SDA), private game publishing contract or title-specific copyright grant**. It extends the [public Steam partner license perimeter](steam-public-contract-perimeter-and-oss-licenses-2026.md) with operational roles that are easy to mistake for legal rights or revenue.

## Six distinct units of analysis

| Observable or contractual unit | What a source can establish | What it does not prove |
| --- | --- | --- |
| **Displayed Steam developer / publisher** | A public store-page credit | Legal contracting party, revenue recipient, or ownership of game IP |
| **Rights holder / authorized licensor** | Valve's [onboarding instructions](https://partner.steamgames.com/doc/gettingstarted/onboarding) require a party that owns *or holds publishing rights* to enter its legal name and sign the SDA | The exact private grant or assignment between an IP creator and publisher |
| **Steamworks partner paid for the game** | A partner holding payment rights can set prices/discounts; [sharing an AppID](https://partner.steamgames.com/doc/gettingstarted/managing_apps/sharing?l=english) does not move payments | Distribution of revenue among developers, staff, subcontractors or investors |
| **Partner or user with app-edit access** | A separately managed partner can get shared access to edit and upload a game; individual [permissions](https://partner.steamgames.com/doc/gettingstarted/managing_users?l=english) separately govern store assets, publishing, marketing and financial viewing | Permission to receive royalties, alter the legal owner or set prices without payment rights |
| **Financial-report viewer** | Shared partner access requires an optional grant **and** a receiving user's `View Financials` permission; this is not equivalent to receiving cash | Receipt of partner remittance, a complete historical ledger, or permission to publish private financial data |
| **Underlying game IP and signed license** | A private signed SDA and the rights chain can determine the enforceable grant | Automatic transfer of copyrights to Valve, automatic retention of all copyrights by the original creator, license term or exclusivity from these public help pages |

Valve's [publisher-collaboration guidance](https://partner.steamgames.com/doc/resources/publishers?l=english) expressly describes separate developer and publisher partners arranging access to the same game. That operational arrangement does not show the private developer-publisher contract.

## Share and transfer are different workflows

- **Application sharing:** A primary payee can grant another partner full application-management access; the sharing process does not change Valve's payment entitlement. The payee partner retains the right to enter package prices and discounts. Financial viewing, when granted, still needs the individual user permission.
- **Completed AppID transfer:** Valve's [transfer documentation](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?language=english) makes the effective date the new payee's financial-entitlement boundary, with management moving under the documented approval schedule. Game identity and existing public reviews are preserved. The recipient gets historical wishlist reports, but by default sees financial reports only from its payment-rights periods; historical financial view must be separately shared.
- **Only a public credit:** A store-page studio or publisher label alone does not determine who has management, payment or financial-report rights. The reported value must remain **unknown**, rather than defaulting either to yes or no.

## Contract and research limits

Steamworks lists `Actual Authority` as a partner-level permission for bank/tax changes, signing agreements and transfers; other app or group permissions include editing metadata, publishing changes, financial viewing and discount management. Operational permissions and Actual Authority are not interchangeable. Nor do they establish whether an underlying creator assigned IP to a separate publisher.

The [synthetic crosswalk](../../site/steam-partner-role-rights-crosswalk.mjs) accepts only an arrangement type and narrowly defined boolean visibility flags. It deliberately returns `null` for underlying copyrights, signed-SDA license scope, partner-to-developer royalty split and actual income, and rejects identifiers or any other fields that could accidentally export confidential partner data.

**Not identified:** title-specific ownership, SDA exclusivity or duration, IP assignment, real partner financial reports, contractual royalties, representative publisher earnings or profit. No publisher account, signed agreement, legal identity, payment or unpublished communication was accessed.

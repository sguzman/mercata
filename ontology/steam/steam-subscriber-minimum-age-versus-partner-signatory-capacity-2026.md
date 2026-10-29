# Steam subscriber age does not establish Steamworks publishing capacity

**Reviewed October 29, 2026.** [Machine-readable evidence](./steam-subscriber-minimum-age-versus-partner-signatory-capacity-2026.json) · [synthetic age-boundary classifier](../../site/steam-account-age-and-partner-capacity-guards.mjs) · [tests](../../tests/steam-account-age-and-partner-capacity-guards.test.mjs). This is a public policy audit, **not legal advice** or a verification of any individual.

## Two different agreements, not one age gate

The [Steam Subscriber Agreement](https://store.steampowered.com/agreement/?l=english) says a user **younger than 13** may not register as a Steam subscriber, and that additional age restrictions may apply by country. This addresses eligibility to hold a Steam user account. **It does not publish a universal minimum age for signing a commercial Steam Distribution Agreement.**

Steamworks' [Onboarding document](https://partner.steamgames.com/doc/gettingstarted/onboarding) separately describes its distribution agreement, NDA, real rights-holding contracting party, identity verification, bank and tax information, and paid app onboarding. The [Steamworks FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?l=english) explicitly allows sole proprietors and requires legal rather than trading names, with matching banking/tax identity. A Steam account holder, permitted community member, storefront studio credit, actual-authority user and legal game publisher are different roles.

| Hypothetical age | General Steam subscriber age rule | Steamworks commercial publishing signatory eligibility |
| --- | --- | --- |
| 12 | Below minimum; subscriber registration barred | **Unknown** under the separate commercial contract (no personal registration through this age gate) |
| 13 | General minimum passed; local restrictions may remain | **Unknown** |
| 17 | General minimum passed; local restrictions may remain | **Unknown** |
| 18 | General minimum passed; local restrictions may remain | **Unknown**, without verification of contract authority, identity, bank/tax and game rights |

Passing the consumer age gate **does not guarantee** partner approval at 13, 17, 18 or any other age. The public documents reviewed do not establish an across-jurisdiction universal minor publisher rule. Conversely, absence of a visible rule is not permission for a minor to enter a binding commercial publishing agreement.

## Operational research use

The tested [synthetic boundary classifier](../../site/steam-account-age-and-partner-capacity-guards.mjs) returns an age-floor result only. It intentionally always leaves actual signatory capacity, Steamworks approval, country-specific requirements, sales and publisher profit **unknown**. No names, government IDs, birthdays, signed agreements or account records were used.

A valid eligibility assessment needs applicable law for the contracting party's jurisdiction, actual commercial agreement terms, documented authority to sign, the payment-entitled legal entity and any partner acceptance decision. It should not reuse a subscriber policy as a creator-income filter.

**Research outcome:** the separate general Steam account age floor is now verified; global Steamworks commercial signatory rules, representative accepted minor-developer populations and economic outcomes remain unresolved.

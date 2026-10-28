# Steam key distribution, external stores and content survey disclosure

**Reviewed October 28, 2026.** [Structured policy record](keys-cross-store-and-ai-disclosure-2026.json). This document distinguishes **keys granting Steam licenses**, paid purchases on the Steam store, and legal rights to ship game assets. It does not reproduce a signed developer agreement or claim that public terms define every publisher-specific contract.

## Steam Keys are not store checkout

Valve's [Steam Keys guide](https://partner.steamgames.com/doc/features/keys?language=english) describes **single-use activation licenses**, often distributed through outside stores or to testers/press. Valve says a developer launching a first game must wait **three weeks after creating an AppID** before requesting keys. This timing is specific to **keys** and must not be confused with the separate conflicting 21/30-day *general release* instructions recorded in Mercata's onboarding report.

| Key class | Current public Steamworks guidance | Economic meaning |
| --- | --- | --- |
| Default Release | May receive up to **5,000** for initial third-party retail distribution; subsequent requests reviewed case by case | Key can represent outside-store sale, not a Steam checkout |
| Release State Override / beta | Generally **2,500**, review-dependent; **may not be sold** | Early testing access, not licensed paid launch units |
| Developer Comp | Developer use only; not for sale/distribution to customers | Internal access, not consumer sales |
| Playtest keys | Free Playtest participation, separately documented | Never base-game checkout |

Steam asks publishers not to give Steam customers a **worse deal** than key purchasers and permits different-store discounts when a comparable offer follows on Steam within a reasonable period. Large free key giveaways are generally restricted; very small promotions under **100 keys** are an exception described in Valve's guidance. Valve may deny key requests that do not correspond to reasonable customer interest or Steam-store offers. **These are not an unlimited Steam key issuance entitlement.**

The guide also warns about retailer impersonation, stolen keys and fraudulent resales. Key batches should be controlled carefully; Valve allows revocation for fraud, theft or expired beta access but warns against revoking legitimately sold consumer keys. Off-platform pre-purchase keys should become playable at the same time as the Steam store release.

Economically, **activated Steam keys cannot be counted as paid Steam checkout orders**. The [protected financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) distinguishes `Package / Steam` from `Package / Retail` key activations. Actual third-party receipts and contractual rights must be measured from authorized retailer and publisher records.

## Disclosure of AI content, not ownership of game assets

Valve's [Steamworks Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey?language=english) must be completed before store/build review; it covers **general**, **mature** and **generative-AI** content. Valve focuses the AI section on AI-assisted content **consumed by players**, not generic developer productivity enhancements. Examples include shipped art, sound, narrative and localization.

- **Pre-generated:** qualifying assets or other content made with AI help during development and shipped with the game.
- **Live-generated:** AI-created content while the game is running, requiring additional explanation of guardrails against illegal output.

Completing a disclosure is **not a guarantee of Steam acceptance**, nor proof that content respects copyright or trademark law. Valve currently states it will not ship Adult Only Sexual Content generated live with AI during play. These are platform review rules, not a conclusion about legality in every jurisdiction.

## What remains unknown

The record does not establish the legal extent of a developer's or publisher's copyright in particular assets, the licensing status of any generated images or code, rights under individual Steam Distribution Agreements, or actual key sales and receipts. Those need independent agreement/asset review and authorized finance data. No Steam keys, credentials, protected records, game files or personal user data were collected.

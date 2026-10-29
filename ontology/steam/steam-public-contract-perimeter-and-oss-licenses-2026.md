# Steam publisher contracts: public licensing boundaries and open-source compatibility

**Reviewed October 29, 2026.** [Structured findings](steam-public-contract-perimeter-and-oss-licenses-2026.json) and [verification tests](../../tests/steam-public-contract-perimeter.test.mjs). This is a public Steamworks documentation audit, **not a review of a signed Steam Distribution Agreement** or legal advice.

## A signed agreement exists; its complete grants are not established here

[Valve's onboarding guide](https://partner.steamgames.com/doc/gettingstarted/onboarding) requires the legal publishing party to sign both a Steam Distribution Agreement (SDA) and a nondisclosure agreement. The [financial FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) points an enrolled partner to its **own signed SDA** to explain incoming payments and obtain detailed revenue-share terms. These public excerpts establish a contract and process, **not** a complete public license text.

Consequently, this dossier cannot determine Valve's specific distribution grant, sublicensing rights, exact term, geographic scope, exclusivity, termination remedies or an individual developer's IP ownership. No conclusion that Valve automatically owns or never owns the underlying game IP follows from these pages. Subscriber-facing license conditions must also not be substituted for the publisher's contract.

## Open-source rights are a concrete pre-publication gate

Valve's [open-source distribution guide](https://partner.steamgames.com/doc/sdk/uploading/distributing_opensource) says a Steam publisher warrants sufficient rights to distribute the game and warns of possible incompatibilities between third-party source licenses and the Steamworks SDK. It lists permissive licenses such as MIT, BSD and Apache 2.0 as generally workable. It calls copyleft licenses, particularly GPL, potentially problematic **when combined with the SDK**, but explains that specific author permission and the way components interact can change that analysis.

This is **not a blanket ban on all GPL games**, nor a complete legal determination of any specific dependency graph. A publisher using third-party code must check licenses and permissions for the actual distribution architecture before warranting rights. Valve declines to perform that diligence for the developer. A purely open-source game, a combined Steamworks SDK build and a differently licensed binary should not be conflated without reviewing their actual components.

## Commercial PC-café licenses are a separate contractual product

Valve's [PC Café publisher guidance](https://partner.steamgames.com/doc/sitelicense/publisher) says the ordinary SDA covers consumer copies for personal, noncommercial use. Offering a **commercial license package** requires a separate Café Distribution Addendum signed by the Steamworks account with Actual Authority; the ordinary consumer product must already be on sale. Valve must approve pricing before publishing the commercial option.

The café program can allocate **concurrent pooled licenses** across machines, so a single license is not the same as an individual visitor purchasing a copy. The partner's financial reports list commercial-license sales separately. Thus commercial seat access, personal retail copies, café visitors and independent paid-game buyers have different denominators. The existence of the commercial program does **not** establish meaningful café demand, incremental sales or publisher profit for any game.

## Verification and remaining boundary

This audit establishes three public obligations relevant to a small studio: a signed partner agreement is mandatory, third-party code rights must be supportable, and café distribution has additional licensing requirements. It deliberately leaves the full contract and all partner-specific financial amounts unresolved.

A contract-level finding would require an appropriately authorized current agreement, the legal rightsholder and relevant jurisdictions; such private materials must not be copied into this public repository. No Steam account was accessed, contract accepted, game published, source-code dependency audited or café order observed.

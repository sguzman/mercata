# Steam publisher portfolios: why storefront studio names do not count legal payees

**Reviewed October 29, 2026.** [Source-linked structured audit](steam-portfolio-labels-creator-homepages-and-payee-transfer-2026.json) · [synthetic identity guard](../../site/steam-portfolio-identity-guard.mjs) · [tests](../../tests/steam-portfolio-identity-guard.test.mjs).

This is a research instrument for classifying **AppIDs, displayed development credits, creator-brand pages, franchises, and time-bounded Steamworks payment rights** as different units. It is not a representative publisher census or a private payee-identity dataset.

## Display labels, creator pages, and legal publishers are not 1:1

Valve's [Developer and Publisher Homepages guide](https://partner.steamgames.com/doc/store/creator_homepage?language=english) explicitly allows several developer/publisher labels on one game and several distinct labels on the same Creator Homepage. A homepage is organized through a Steam Community group and marketing permissions, not directly from a public company-registry match or bank-payee identity. Following a page is a discovery/notification preference, not a paid store checkout.

Likewise [Franchise Pages](https://partner.steamgames.com/doc/store/franchise_pages?language=english) can group games under a common fictional universe **across different Steamworks organizations**. A franchise is neither one legal publisher nor a measure of the revenue of each linked game. Developer fields may describe outside contractors and multiple studios, while publishers can be external business partners.

| Observable unit | What it may measure | What it cannot prove |
| --- | --- | --- |
| AppID | A product identity retained through app transfer | One independent studio, one legal publisher or one paid original release |
| Developer/publisher name | A public store-credit string | Corporate registration, actual team size, royalty recipient |
| Creator Homepage | A manually linked brand/publication collection | Independent legal company count, publisher income |
| Franchise Page | Shared creative universe across titles and companies | Single legal owner or one payee for all titles |
| Steamworks partner with payment rights | Current/period-specific recipient under Valve's system, if authorized records are available | Ultimate employee, worker income, net profit after publishing agreements |

## A single AppID can change paying partners without losing its history

Valve's [Transferring Applications guide](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?l=english) explains that store listings, game-library entitlements, reviews, wishlists and followers remain associated with the AppID after an approved transfer. The AppID is removed from prior creator homepages when the transfer begins, and may later be linked to the receiving partner's creator pages.

The transfer's effective date determines when the receiving partner begins earning Steam payments. The standard form defaults to seven days after initiation, subject to approval and circumstances. **By default, financial-report visibility is split by the periods during which each partner was paid**, although prior reporting access may be separately granted. A new payee's report therefore need not cover the AppID's full historical financial performance. Similarly, the old bundle's management rights are not automatically transferred.

This breaks naive rules such as *one AppID = one publisher for all time* or *everything on a public brand homepage belongs to one paying entity*. It also means publisher identity needs **effective-dated, rights-cleared records**, not just the current store page.

## Strictly invented identity example

The [pure synthetic audit](../../site/steam-portfolio-identity-guard.mjs) checks three fabricated AppIDs with overlapping studio credits, two public brand pages, one shared franchise, and one AppID with two consecutive paying-partner periods:

| Synthetic entity count | Value |
| --- | ---: |
| Distinct game AppIDs | 3 |
| Unique displayed developer names | 3 |
| Unique publisher-name credits | 2 |
| Creator homepages | 2 |
| Franchise pages | 1 |
| Distinct fabricated payment-partner IDs across periods | 3 |
| Games with a modeled payment-partner change | 1 |

All names and IDs are invented test fixtures. The last line is **not** a count of real ownership changes. The helper validates that the same AppID cannot have overlapping exclusive fixture payment periods and rejects real-looking IDs. It refuses to infer actual legal partners, real unique studios, incomes or profit.

## What would complete the real portfolio study?

A representative historical originally-paid AppID cohort, source-provenanced developer and publisher credit histories, explicit multi-label affiliation and studio-vs-company classification, transfer-effective dates, consented partner-level remittances, contract splits, business costs, and measured labor. A storefront brand can split a real enterprise into several names or merge independently paid entities into one brand; both are possible ascertainment errors.

Public PlayRecon studio-label cohort results remain **name-group analyses**, not a legally deduplicated first-game publisher survival cohort. The number of distinct earning legal publishers and the median first-time developer's take-home remain **unknown**.

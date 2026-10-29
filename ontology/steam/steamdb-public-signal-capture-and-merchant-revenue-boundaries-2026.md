# SteamDB evidence audit: catalog metadata, sampled concurrency and missing merchant sales

**Reviewed October 29, 2026.** [Structured evidence](steamdb-public-signal-capture-and-merchant-revenue-boundaries-2026.json) · [synthetic five/ten-minute concurrency guard](../../site/steamdb-sampled-ccu-guards.mjs) · [tests](../../tests/steamdb-sampled-ccu-guards.test.mjs).

[SteamDB's own FAQ](https://steamdb.info/faq/) is the primary source for its collection and licensing boundaries. This project has **not** crawled or scraped SteamDB or its users, and has not asked for or assumed bulk-data access. SteamDB is independent of Valve and publicly warns that its data are provided without guarantees of accuracy or completeness.

## What can legitimately be inferred from each visible signal?

| SteamDB signal | What it can document | What it cannot establish |
| --- | --- | --- |
| Application and package changes | Public Steam app/package metadata and update notification history through SteamKit, plus some store-page parsing | That an executable build changed or that game development labor occurred |
| Regional price history | Observed catalog/list and discount prices under the provider's rules | Customer checkout dollars after region, discounts, bundle allocation, gifts, taxes or refunds |
| Steam API concurrent players | A count of currently playing users **at sampled observation points** | Units sold, net revenue, unique owners, after-cost developer profit |
| Review and catalog metadata | Public visible store/review information under snapshot filtering | Complete original paid-release AppID universe, including all retired titles |
| Hidden pre-release / Advance Access | Only what the crawler is entitled to observe | That a product had zero active players or zero paying owners when no CCU is visible |

SteamDB says concurrent player counts are retrieved directly from the Steam API: it polls the current top **800** titles approximately every **five minutes**, and other games approximately every **ten minutes**. Valve also caches the underlying API readings. Thus a SteamDB chart is more authoritative about particular measured concurrent API values than a model extrapolating from owners, but a sampled peak is **not guaranteed to be the continuous-time maximum**. An unsampled spike can occur between recorded points.

SteamDB says its bot may need to **own a game to observe player counts during Advance Access**. Therefore a missing early chart cannot be interpreted as no players. It also explains that Steam client/library counts and Web API owned-game counts may differ due to DLC and free-game behaviors; a catalog count is not automatically an audited first-paid-release denominator.

## Reproducible data-unit check

The [pure helper](../../site/steamdb-sampled-ccu-guards.mjs) accepts only made-up chronological Steam API CCU snapshots. It checks timestamp validity, five/ten-minute expected polling, missing observation gaps and nonnegative counts. It reports the highest **sampled** player count but returns **null** for true between-sample peak, unique owners, actual Steam paid units, publisher revenue and profit. Tests deliberately reject impossible timestamps, disordered samples and non-synthetic identifiers.

## Access terms and merchant-data separation

SteamDB says no general public API or bulk dumps are available, and warns against unauthorized scraping, academic or otherwise. A research project should seek appropriate authorization where required or work with original Steam public resources, without assuming access to SteamDB proprietary records. Its metadata and price charts have independent provenance, but they are **not** an authenticated seller sales ledger.

[Valve's Financial API documentation](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService) instead describes *permissioned* gross paid store units, returns, net taxes, keys and revenue. It distinguishes package Steam sales from Retail key activations and microtransactions, and mandates secure partner financial keys. The project neither requested nor accessed those credentials or private results.

**Conclusion:** SteamDB can support transparent catalog, historical price, and sampled concurrency observations. It cannot identify representative Steam gross game mean, zero-paid-order rate, median publisher take-home, first-game profitable fraction, or a population of complete originally-paid AppIDs by itself. Those empirical targets remain unknown.

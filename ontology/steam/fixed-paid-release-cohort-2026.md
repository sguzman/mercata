# Fixed paid-release cohorts: a defensible Steam denominator

**Reviewed October 28, 2026.** [Structured protocol](fixed-paid-release-cohort-2026.json). This is a research design with synthetic eligibility tests, **not an observed Steam census**.

## The cohort we actually want to measure

Primary question: *How do games that were first offered for payment on Steam during a particular period perform, including games that were never reviewed or later retired?*

- **Unit:** one base-game AppID. Valve [defines an app and its unique AppID](https://partner.steamgames.com/doc/store/application?language=english); demos, playtests, DLC, software and soundtracks are not interchangeable base-game releases.
- **Time zero:** the first public **paid** Steam launch, including paid Early Access. Valve gives [Early Access and full-release announcements separate visibility](https://partner.steamgames.com/doc/marketing/visibility); a transition to 1.0 is **not** a second paid-game launch.
- **Primary inclusion:** the product was paid at its initial public launch. Games that initially released free and added a price later belong to a *different* stratum; this is a Mercata comparison rule, not a Valve definition.
- **Window:** illustrative January 1 through December 31, 2025, measured in one consistent store-release calendar. Do not confuse planned, player-facing, full-1.0 or last-modified dates; [Valve's release-date instructions](https://partner.steamgames.com/doc/store/release_dates?language=english) show they differ.
- **Carry forward:** games with **zero reviews**, no owner estimate, no current buy button, and later-retired listings. The [Valve retirement guide](https://partner.steamgames.com/doc/store/retire_app?l=english) says retired titles are removed from active store listings but retained for prior owners.

The operational classifier in [site/steam-cohort-frame.mjs](../../site/steam-cohort-frame.mjs) treats missing launch prices or dates as **unresolved**. It rejects duplicate AppIDs and does not use the number of reviews or current storefront visibility as an exclusion rule. Fixtures demonstrate the difference between **zero reviews** and **zero sales**; fixtures are not real games.

## Why a current catalog is not a historical census

[Valve's IStoreService GetAppList](https://partner.steamgames.com/doc/webapi/IStoreService?l=english) returns paginated store entries and requires an ordinary Web API key. Its `last_modified` field captures metadata or price changes, **not** first sales. Even if paged perfectly, today's storefront listing cannot guarantee coverage of retired or hidden former sellers.

Independent [SteamDB annual releases](https://steamdb.info/stats/releases/) and [steamlense release counts](https://steamlense.com/stats) differ by snapshot and methodology. Previous Steam studies found them useful for *supply trends*, not as a mutually reconciled list of original paid releases.

[Steam Spy's methodology](https://steamspy.com/about) expressly distinguishes ownership from purchase, and warns that profile-based owner estimates are unreliable for very recent and small games. Discarding games with no modeled owners or visible reviews would build success bias into the population.

## Retained distinctions

| Question | Evidence needed | Is it currently known? |
| --- | --- | --- |
| How many games initially launched paid in 2025? | Reconciled historical AppIDs, initial price, first paid date and retirement coverage | **No** |
| How many were never reviewed? | Same complete frame plus fixed-date review snapshots | **No for that exact frame** |
| How many sold zero paid copies? | Above frame plus complete legitimate merchant sale data for the same horizon | **No** |
| How many publishers launched a first title? | Stable legal/publisher identity, game membership and prior history | **No** |
| What did the median publisher earn? | Representative participants including nonrespondents/zeros, period-aligned reports, royalty splits and costs | **No** |

An AppID is not a publisher. Valve [defines a package as a set of apps or depots](https://partner.steamgames.com/doc/store/application/packages?language=english), so one package purchase may grant multiple games, and one game may be in several packages. Any app-level allocation must be audited separately. A storefront publisher display name does not prove the contracting legal entity.

## Next operational gates

1. Secure a rights-compliant archive or licensed dataset with AppIDs, dates, launch-time paid status and retired entries; report missingness and coverage. Do **not** replace it with a current-only catalog or assume a historical price from a present price.
2. Stratify by release month, genre and initial distribution mode, and track apps missing eligible price/date metadata rather than discarding them. Preserve an independent full-1.0 date for Early Access titles.
3. Independently test the sampling frame for omitted low-review, retired, and unlisted games, before even attempting an income statistic.
4. Link the frame to partner-verified, consented aggregate outcomes only after permission and lawful publication review. Report response rates and missingness; do not present volunteers as a representative random sample.

**Results this checkpoint:** no public catalog rows ingested; no marketwide paid-game total, earnings distribution, exact-zero-sale rate or buyer counts estimated. The cohort and tests are a **methodological readiness step**, not completion of those empirical tasks.

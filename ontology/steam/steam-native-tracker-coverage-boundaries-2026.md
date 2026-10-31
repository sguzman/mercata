# Steam data collector coverage and native-versus-imported history — October 2026

**Reviewed October 31, 2026.** [SteamRaw operational status](https://steamraw.com/status) · [Open-SteamDB public archive methodology](https://github.com/LOVAHE/Open-SteamDB) · [structured observation](steam-native-tracker-coverage-boundaries-2026.json) · [aggregate checker](../../site/steam-native-tracker-coverage-audit.mjs) · [tests](../../tests/steam-native-tracker-coverage-audit.test.mjs).

## What the provider actually reports

SteamRaw's public operational page displayed a collector state dated **October 30, 2026**, around 13:54 UTC. This is a time-specific *reported status*, not a frozen official Steam catalog or a count obtained by importing the site's AppIDs.

| Reported field | Displayed value | Measurement unit |
| --- | ---: | --- |
| Apps in the collector database | 420,362 | All provider-indexed app entries, not base games only |
| Apps with raw appinfo | 419,636 | App metadata stage; difference **726** relative to all indexed apps |
| Apps with player tracking in coverage summary | 146,094 | A separately labeled historical/player subset |
| Apps tracked in the player-collection operational section | 325,429 | Separate operational tracking scope; **do not** subtract from 146,094 |
| Currently unavailable in player tracking | 117,111 | Unavailable observations, not confirmed zero players or purchases |
| Failed on most recent player attempt | 198 | Operational failures, not failed launches |

The site reports PICS changelist history from **September 11, 2026**, and native price history from **September 11, 2026**. Its player series has different historical source and coverage semantics; its catalog import references SteamSpy, and the displayed upstream health varied substantially across services. These operational coverage differences matter: **a large appinfo inventory is not the complete original paid-release population**, and no retrospective 2025 first-paid event becomes directly observed simply because a 2026 tracker indexes today's AppID.

The 726 count is only the difference between the provider's two displayed internal app counts; it cannot be relabeled as delisted games, failed commercial launches or missing originally paid games. The player-tracking figures refer to distinct status sections without a verified identical frame, so subtracting or adding them would manufacture a game-population estimate. Public concurrent players, unavailable player polls, catalog presence and SteamSpy owner estimates are not legal publisher orders or net earnings.

## Historical import provenance is another independent boundary

The independent [Open-SteamDB](https://github.com/LOVAHE/Open-SteamDB) project documents direct game-status, price and change monitoring, but says earlier price points may be **imported from IsThereAnyDeal**, and older player histories from **Steam Charts**. Its README says imported price points are marked separately from native measurements, that a missing observation is not a known zero, and that the archive is intended for non-commercial use.

Thus an old date inside a newer archive is not evidence the archive itself observed the event on that old date. An imported *price point* also does not authenticate a first playable positive-price release; a historical price does not indicate a buyer order. No complete coverage counts or native inception date for Open-SteamDB are inferred from its README. This study does not download, scrape, transform or redistribute either provider's app-level records, imported datasets, review authors, or financial information.

## Consequence for the paid release census

The **reconciled originally paid, first-playable base-game** universe still requires versioned historical presence, reliable launch-price histories, product-type eligibility, delisted items and independent financial authorization for zero-order outcomes. Collector telemetry adds candidate-discovery infrastructure; it cannot fill missing native history or financial data. Exact historical paid population, missing originally paid games, genuine zero-order share and publisher profits remain **unknown**.

The aggregate checker verifies only the single source's internal appinfo subtraction and its explicitly distinct reporting scopes. It declines to infer missing-market or purchase quantities and does not assume one collector's reports corroborate another independent sample.

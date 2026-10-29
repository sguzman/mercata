# Steam 2025 game-release catalogue: incompatible public provider frames

**Reviewed October 29, 2026.** [Machine-readable crosswalk](steam-2025-three-catalog-release-frame-divergence-2026.json) · [reproducible comparison](../../site/steam-release-provider-frame-crosswalk.mjs) · [tests](../../tests/steam-release-provider-frame-crosswalk.test.mjs). Only public provider-reported counts were used, never downloaded AppID rosters or private financial records.

## Three different public release-year game counts

| Provider and dated evidence | 2025 game releases | What the figure observes |
| --- | ---: | --- |
| [GameCharts](https://charts.game/charts/releases), October 29 at about 14:38 UTC | **20,565** | Steam-classified games with recorded 2025 release dates; excludes DLC, demos, software, soundtracks, and upcoming games |
| [SteamDB](https://steamdb.info/stats/releases/), October 29 Mercata snapshot | **21,222** | Provider's own release-year game classification as previously recorded; live site figures are mutable |
| [GaugeDB](https://gaugedb.com/insights/steam-releases-per-year), catalogue marked October 26 UTC | **24,614** | Games in the provider's collected catalogue with reported 2025 release dates, separate from its reviewed subset |

The maximum exceeds the minimum by **4,049 catalogued titles**, but **the source capture times and AppID populations are not matched**. This is an arithmetic disagreement, not an estimated platform undercount of 4,049 games, an error bar, or evidence that one particular provider is more accurate. Do not conflate the GameCharts year-to-date comparison with its full-year 2025 total.

## Methodological implications

GameCharts explicitly excludes demos, DLC, software, soundtracks and coming-soon apps, and counts Steam-classified game apps by release date. GaugeDB describes its figures as a collected, incomplete catalogue and distinguishes review-checked games from all game records. SteamDB's prior 2025 count changed between October 28 and October 29; its historical snapshot in Mercata is retained rather than silently overwritten. No three providers have supplied a reconciled AppID join or validated earlier paid availability.

The [tested crosswalk](../../site/steam-release-provider-frame-crosswalk.mjs) compares source-labelled counts and their capture dates, exposes the numerical span and **refuses** to produce a purported historical total, paid-title denominator or confidence interval. Its inputs are aggregate counters only.

## Remaining evidence gates

A genuinely comparable release-catalog study would require rights-cleared, versioned AppID rosters; independent original playable paid dates and prices; documented region, app-type and delisting treatment; and known errors and corrections. Even a complete game-AppID census would not identify **unique legal publishers, zero paid orders or after-cost profits** without account- and transaction-level evidence. These remain null in the [machine record](steam-2025-three-catalog-release-frame-divergence-2026.json).

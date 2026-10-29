# Steam 2025 release tags: overlap cannot be counted as new games

**Reviewed October 29, 2026.** [Structured source counts](steam-2025-overlapping-release-tags-and-genre-denominators-2026.json) · [bounded overlap helper](../../site/steam-tag-overlap-bounds.mjs) · [tests](../../tests/steam-tag-overlap-bounds.test.mjs).

## Same year, three nonexclusive tags

On October 29, SteamDB's release-year tag pages reported **7,859 [Action](https://steamdb.info/stats/releases/?tagid=19)**, **8,338 [Adventure](https://steamdb.info/stats/releases/?tagid=21)**, and **10,731 [Indie](https://steamdb.info/stats/releases/?tagid=492)** games released in 2025. Its [all-games count](https://steamdb.info/stats/releases/) was roughly **21,222** for the same release year. Tag classifications are nonexclusive and can change; these are secondary live catalog snapshots, not a fixed audited, originally paid game frame.

Summing the three categories gives **26,928 tag memberships**. That exceeds the whole release-year count by **5,706**. Conditional on all four counts describing the same game universe at the same snapshot, the pigeonhole principle requires **at least 5,706 duplicated tag memberships**. Since a game can carry at most three of these particular tags, each multiply tagged game can contribute at most **two** excess memberships: **at least 2,853 distinct games** must then belong to two or more of the three categories.

This is a **lower bound**, not an exact overlap measurement. Games might share all three tags or only one pair, others might have none, and exact pairwise overlaps or the union of tags are not determined by their marginal totals. A small amount of source refresh timing drift means even the numeric bound is a conditional illustration rather than independently verified per-AppID cross-tabulation.

## Why this changes economic comparisons

Neither `Indie` nor `Action` reliably identifies a publishing contract or legal studio type. A game with all three tags must not be counted as three unique competitors, and an `Indie` label is not proof that the game is self-published or a first commercial title. Comparisons of "game supply by genre" need one stable release-year base, a consistent original paid/free distinction, and a multi-label handling plan; a mutually exclusive primary-genre chart requires a stated assignment rule rather than adding tag counts.

The [validated synthetic helper](../../site/steam-tag-overlap-bounds.mjs) rejects duplicate tag labels, invalid counts, excessive counts and missing denominators, returns only a necessary overlap lower bound, and leaves real unique publisher and paid-sale measures **unknown**.

**Still unmeasured:** first-paid releases by tag, studio and publisher identities, complete game-level sales, actual simultaneous-tag cross-tabs, unique paying customers, and genre-specific after-cost publisher profits.

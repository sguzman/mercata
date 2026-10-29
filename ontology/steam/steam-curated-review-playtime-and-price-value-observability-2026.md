# Reviewer playtime, regular prices and sentiment: a selected 6,954-game Steam study

**Reviewed October 29, 2026.** [Structured aggregates](steam-curated-review-playtime-and-price-value-observability-2026.json) · [auditable calculation guard](../../site/steam-reviewer-playtime-cohort-guards.mjs) · [test fixtures](../../tests/steam-reviewer-playtime-cohort-guards.test.mjs). Source: [MarketYourIndie, by Juan Pablo Russo](https://marketyourindie.com/research/playtime-and-price), **measured August 15, 2026**; public figures and data are provided under **CC BY 4.0** and credited here.

## Not a typical Steam launch cohort

The independent researcher studies **6,954 selected paid games**, each with **at least 50 reviews** and **at least 10 recent-review playtime records**, using at most **100 recent reviews per game**. The median included game has **2,026 reviews**. That is a *highly selected visible-game sample*, not a random sample of all new paid releases, game buyers, studios or legal publishers. Reviews and attached hours were sampled August 7–8, 2026. No order records were collected.

Playtime means the hours the **reviewer had logged when writing the review**, not the duration of an entire game, total hours eventually played, average buyer time or completed campaign length. Price means **regular US-dollar list price** at measurement, not discounted or regional historical checkout paid by the reviewer.

| Regular list-price band | Sampled games | Median reviewer hours at review time | Median regular-price dollars per reviewer hour |
| --- | ---: | ---: | ---: |
| Under $5 | 1,012 | 3.3 | $1.12 |
| $5–$9.99 | 1,423 | 5.7 | $1.52 |
| $10–$14.99 | 1,230 | 7.2 | $1.96 |
| $15–$19.99 | 1,508 | 10.3 | $1.90 |
| $20–$29.99 | 1,054 | 13.2 | $2.03 |
| $30–$39.99 | 393 | 19.6 | $1.94 |
| $40+ | 334 | 26 | $2.06 |

These band counts reconcile to **6,954** games. The median dollars-per-reviewer-hour statistic remains between **$1.90 and $2.06** for the five regular-price bands at $10 or more. This is a *ratio of selected game-level price and reviewer playtime*, not a verified market exchange rate or rule to charge for a game's length.

## Review sentiment and the reversed-causality problem

Grouping by the source's regular-list-price dollars per reviewer-hour, median positive Steam-review share falls from **89.5%** for under $0.50/hour to **67.1%** for $10/hour and above. The share of games below **70% positive** rises from **5% to 55%** across those extremes.

Within listed-price bands, the long-reviewer-playtime quartile scores **2.9 to 8.8 percentage points higher** in median positive-review share than the shortest-playtime quartile. The researcher also reports the general pattern in three broad release-era groups, whose counts sum to the full sample (2,555 pre-2020; 2,322 during 2020–2023; and 2,077 from 2024 onward).

**None of this means adding filler hours will increase ratings.** Players quitting a frustrating title early can simultaneously cause short logged playtime and a critical review. Genre, audience, product quality, pricing selection, visibility, discounts and reviewer self-selection all confound comparisons.

## Genre matters more than a single hours target

The study's mutually assigned genres produce median price/hour observations ranging from **RPG ($1.20)** to **Horror ($2.16)**, with **Adventure at $1.86**. Such differences make a universal “price per hour” benchmark unreliable. These category values are source-specific aggregates; a game can straddle genres on Steam and has no guaranteed lifetime playtime or revenue.

## Hard inference limits

This study establishes public *reviewer* and *listed-price* descriptive patterns in a reviewable subset. It does **not** establish price elasticity, conversion, future campaign length, lifetime value, uniquely paid buyers, refund-adjusted gross sales, typical developer net income or profit. A publisher's direct financial data and a defined population including low-review and zero-review games would be required.

The [machine guard](../../site/steam-reviewer-playtime-cohort-guards.mjs) checks counts, published gradients and selection; rejects inconsistent inputs; and returns **null** for real purchasing, buyer playtime, causal claims and income. It does not scrape Steam, acquire review-level rows or infer a product's ideal price.

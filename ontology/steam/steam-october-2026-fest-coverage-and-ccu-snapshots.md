# October 2026 Steam Next Fest: incomparable early and final public rosters

**Reviewed October 29, 2026.** Two independently generated public snapshots report different things: Chris Zukowski's [October 21 first-days Steam Next Fest analysis](https://howtomarketagame.com/2026/10/21/how-sloppy-is-the-october-2026-steam-next-fest/) and [Output Lag's October 26 final hourly demo-player tracker](https://outputlag.com/next-fest/). These third-party records are not a source of authenticated game receipts.

[Structured values](steam-october-2026-fest-coverage-and-ccu-snapshots.json) · [reconciliation helper](../../site/steam-fest-snapshot-comparability.mjs) · [synthetic tests](../../tests/steam-fest-snapshot-comparability.test.mjs)

## Source-specific frames

| Source and observation | Number | Interpretation |
| --- | ---: | --- |
| Zukowski, Oct. 21 live-page scrape | 7,240 | Early festival games listed after press-preview changes |
| Early article's four peak-CCU-ranked group sizes | 25 + 25 + 50 + 6,942 = **7,042** | **198 fewer** games than the reported live roster, unexplained by the article |
| Output Lag, Oct. 26 final tracker | 7,310 | Demos in that publisher's final monitored festival roster |
| Output Lag, demos with recorded players | 6,542 | Positive observed player activity in hourly polling |
| Output Lag, without recorded players | **768** | Remainder in its tracker; not verified zero unique players |
| Nominal final-versus-early roster difference | **70** | A discrepancy, **not** verified new entrants or changes in eligibility |

Zukowski expressly distinguishes the live page from a larger earlier press preview. The article's labeled 101+ group and first three rank groups account for 7,042, not 7,240, so the 198 omitted from those rows are **unclassified rather than zero performers**. A downstream analysis that silently uses 7,240 as the denominator for a claimed complete ranked partition is not reproducible from the article.

Output Lag reports **297,906 combined peak concurrent players**. That metric is not unique attendees, total demo launches, wishlists, Steam purchases or paid-game revenue. Hourly player sampling can miss short activity, so a game lacking positive observed CCU cannot automatically be called “played by nobody.” The 7,310-versus-7,240 roster difference also has unequal dates and counting rules; neither source supplies a verified same-AppID transition table.

## Early correlation is not a sales mechanism

Zukowski reports Spearman associations between early demo **peak concurrent players** and pre-fest follower stock (**0.55**), the absolute follower gain in the preceding week (**0.52**) and follower percentage growth (**−0.13**). The study's top 25 early peak-CCU demos had a **5,519** median follower count one day before the event, versus **15** in its labeled low-rank stratum. These are **rank-conditional, early-correlation** descriptions; followers are not actual paid wishlist owners, and CCU is not gross sales.

The source samples different age and roster subsets, has an internally incomplete ranked partition, and does not randomize marketing or platform visibility. Neither the correlation signs nor the concentration gap establishes a causal Steam algorithm, optimal advertising strategy, purchase probability, or developer earnings.

## Reproducible guard

The pure [audit function](../../site/steam-fest-snapshot-comparability.mjs) validates nonnegative safe counts, disallows sample bins exceeding the stated frame, preserves the unexplained 198 records, distinguishes 768 unmeasured player observations from proven zero demo players, and prohibits a verified cross-provider cohort match. It cannot join individual participants or provide true outcomes. **No partner accounts, private player histories, merchant statements, or financial evidence were consulted.**

# Eight selected first-paid game reports: one identity crosswalk, incompatible windows

**Reviewed October 29, 2026.** [Machine crosswalk](selected-eight-first-paid-sales-window-finance-crosswalk-2026.json) · [identity/window guard](../../site/steam-selected-case-identity-window-audit.mjs) · [regression tests](../../tests/steam-selected-case-identity-window-audit.test.mjs).

## A useful inventory, not a new income survey

Eight recent existing Mercata source studies describe **eight distinct paid Steam AppIDs**, with initial paid release dates spanning **July 2025 to October 2026**. Their selected disclosures all report **positive copy counts**, but the observations range from **about one day to over a year**. Seven are publicly self-described first-person postmortems and one (*Crazy City Golf*) is an unauthenticated report about a friend's game. They are not a random sample, a complete store release population, or a new source of authenticated paid orders.

| Game | Initial paid launch | Reported cumulative copies | Reporting window | Monetary label from report |
| --- | --- | ---: | --- | --- |
| Go Up | 2025-07-11 Early Access | 135 Steam | At Aug. 2026 general release | $675 gross; $517 undefined net |
| Luckyest | 2025-09-23 | 10,525 | About 89 days | ~$20,000 gross; ~$16,500 **before Valve share** |
| Vocator | 2026-01-27 | 40 | A little over two weeks | Not disclosed |
| Lone Survivors | 2026-02-27 | 279 | Author's first week | ~$1,300 labelled total revenue, not harmonized |
| Immunica | 2026-03-29 | 895 | October retrospective (over six months) | $2,123 gross; ~$1,100 net after described deductions |
| Off the Beaten Track | 2026-04-29 | 49 | About one month | $321 undefined net |
| HUG＆BETRAY | 2026-09-03 US calendar | 4 Steam | Roughly five weeks | ~$18 total; ~$12 undefined net |
| Crazy City Golf | 2026-10-26 | 4, secondhand | More than one day | Not disclosed |

**Source links:** [Go Up](go-up-earliest-paid-ea-and-contributor-proceeds-2026.md), [Luckyest](luckyest-two-checkpoint-net-stage-correction-2026.md), [three smaller first-game reports](first-commercial-mismatched-disclosure-windows-2026.md), [Immunica](immunica-firstgame-niche-event-wishlist-and-sales-windows-2026.md), [HUG＆BETRAY](hugbetray-fiveweek-zero-period-keys-bots-and-cash-2026.md), and [Crazy City Golf](crazy-city-golf-dayone-four-sales-wishlist-conversion-denominators-2026.md). Each underlying case retains its original public source, release-date and money-accounting limitations.

## Five noninterchangeable kinds of output

A *gross* label is not the same as the author's *total revenue* or *net* label. Here, Luckyest's initially presented net is **before** Valve's share, Go Up and Off the Beaten Track lack verified deduction-stage reconciliation, and Immunica's after-deductions net is still **not proven bank cash**. Several games publish no dollar amount. Keys, returns, regional prices and contractual third-party shares also differ. Therefore **do not calculate a pooled median** of their displayed money values.

Early Access time zero also matters: Go Up's 2026 full release is **not** a second 2026 first-paid launch. HUG＆BETRAY reports one **zero-sale interval** amid positive cumulative sales; it is **not** a game with zero lifetime paid orders. Crazy City Golf's four-copy report is secondhand and very recently right-censored. All eight reported positive game-unit counts, so **none is a verified zero-selling game in an enumerated first-paid-release population**.

The crosswalk's [validation guard](../../site/steam-selected-case-identity-window-audit.mjs) rejects duplicate AppIDs, malformed release dates, impossible zero-sales classification and claims of verified bank cash. Regression tests join each row back to its existing machine source study, so the table fails if its cited source record changes silently.

This is a **documentation and comparability deliverable**. It adds no new independent public source, changes no measured market outcome, and does not fill the missing representative earnings distribution or actual zero-paid-sale fraction.

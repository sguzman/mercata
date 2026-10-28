# itch.io 2026 community analytics exchange — actual receipts, nonrepresentative

Two public posts by the same itch.io developer and informal benchmark collector: [September 16 initial snapshot, 145 games](https://www.reddit.com/r/itchio/comments/1whs8h1/i_built_a_free_tool_to_see_how_your_itchio_stats/) and [September 26 updated sample, 690 games](https://www.reddit.com/r/itchio/comments/1wqtpql/690_itchio_games_the_median_game_gets_750_views/). This is one **expanding, overlapping convenience sample**, not 835 independent games. The collector requested voluntarily public itch.io creator analytics and optional screenshot number entry. The author acknowledges skew toward projects developers were inclined to share.

## What is actually reported

| Observed summary | September 16 (145 games) | September 26 (690 games) |
|---|---:|---:|
| Median lifetime page views | 2,100 | 750 |
| Median download events | 136 | 88 |
| Reported median revenue | $4 | $0 |
| Reported games with zero revenue | Not disclosed | 45% |
| Games with more than $1,000 reported revenue | Not disclosed | 7 |

For the 690-entry disclosure, the author described **roughly 1 in 7** above $100 in reported receipts and the **top 10% receiving about 93% of the sample's view events**. They also compared **47 browser play events per 100 page views** with **16 download events per 100 page views**, which are **not paid buyer conversion probabilities**. A later comment updated the sample to 702 with 11 above $1,000, and acknowledged some submissions were effectively bundles rather than games. Those later counts are not independent or corroborating samples.

## Necessary arithmetic/source caveat

The public post says **45% had zero revenue** and **median revenue was $0**. If the reported zero fraction means *exactly* zero and there are no negative outcomes, the ordinary median of all 690 positive/zero amounts would generally be greater than zero if 55% were strictly positive. The author does not clarify whether the median was rounded, category definitions differ, or an underlying count changed. We **record both contradictory-seeming statements**, without guessing a corrected median or zero share.

A stricter [arithmetic audit](../../site/itch-zero-median-identifiability.mjs) now checks the stated 690 and 45% values as a conditional model. If **45% was rounded to the nearest whole percentage point**, then between **308 and 313** of the 690 entries were exactly zero. If all values were nonnegative and the ordinary unrounded median on **that same revenue measure** were exactly $0, at least **346** entries would have to be zero. Thus the two figures **cannot both be exact same-measure summaries under those assumptions**. The source has not established those assumptions: its $0 median might be rounded, its revenue definitions might differ, and the submitted data are unavailable for auditing. We do not diagnose an error or replace either value; the machine result explicitly marks this as a conditional incompatibility.\n\n## Why this is not yet the answer to the earning question

The contributor population includes free games, paid titles, donation-enabled games and possibly bundles, with release ages and self-selection unknown. We cannot infer first-commercial-release median receipts, zero **sales** for eligible positive-price publishers, net profit after expenses, or a global market earnings distribution. The earlier independent [169-volunteer traffic study](traffic-benchmark-2025.md) likewise measures selected visibility rather than representative sales. No raw dashboard records, names, emails, images or private statistics were retained.

This evidence is **more directly related to actual itch.io revenue than generic web-developer surveys**, but only within a bounded submitted-game population. Machine safeguards and original rounded totals: [community-analytics-sample-2026.json](community-analytics-sample-2026.json).

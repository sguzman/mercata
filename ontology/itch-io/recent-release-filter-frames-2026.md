# itch.io recent-release and paid browse frames

**Research date: 2026-10-26.** Public filter counters were read from search-visible cached pages. Counts do not share an exact crawl time. [Machine data](recent-release-filter-frames-2026.json).

| Browse filter | Displayed results | Approximate crawl age |
|---|---:|---|
| [Paid, last 7 days, Popular](https://itch.io/games/last-7-days/store) | 1,057 | 2 days |
| [Paid, last 30 days, Popular](https://itch.io/games/last-30-days/store) | 3,752 | 2 days |
| [Paid, last 30 days, New & Popular](https://itch.io/games/new-and-popular/last-30-days/store) | 3,799 | 2 days |
| [Paid, Released, last 30 days, Top sellers](https://itch.io/games/top-sellers/last-30-days/released/store) | 447 | 2 days |
| [Paid, Released, last 30 days, Top rated](https://itch.io/games/top-rated/last-30-days/released/store) | 202 | 7 days |
| [All price types, Released, last 30 days, Popular](https://itch.io/games/last-30-days/released) | 16,776 | 3 weeks |

The **3,752 versus 3,799 difference under different sort modes** means these result sets cannot safely be assumed to be permutations of one completely shared cohort. The source does not explain the difference, so the cause is left unknown.

The Top sellers count **is not the count of newly published games that actually sold a copy**. Neither 447/3,752 nor 202/3,752 is a validated commercial success or review rate. Ranking, eligibility, price, release-status flags and crawl periods differ. A Paid-filter page can contain titles currently 100% discounted or demos, while a Released tag does not establish that the publisher has never released a commercial game before.

These views help define **competition/discovery inventory and a future repeatable release-frame protocol**. They do not provide unique active sellers, confirmed paid buyer orders, first-time publisher launches, developer profit, or a denominator including all zero earners. Those measures remain unknown. No merchant account, personal buyer data or project-wide crawl was accessed.

### Existing releases can reappear in a recency sort

The [itch.io administrator's public sort explanation](https://itch.io/t/719515/how-does-itchio-sort-games-by-these-criteria-popular-newpopular-top-rated-top-sellers-most-recent), in a 2020 thread reviewed on October 27, 2026, says that **Most Recent may surface a previously published project when an update refreshes it**, and New & Popular puts emphasis on newer or updated projects. Thus a result in a rolling recent-game filter **cannot automatically be counted as a first commercial publication**. The inclusion needs a separately checked first-publication timestamp, first positive-minimum offer date, and publisher deduplication. The operator reply was edited multiple times, with no independently known exact revision clock, so present algorithm weights and 2026 update-trigger completeness remain unverified.

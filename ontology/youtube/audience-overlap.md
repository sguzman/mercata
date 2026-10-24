# Preventing false audience totals from overlapping YouTube communities

**Snapshot: October 23, 2026.** [Machine protocol](audience-overlap.json) and [unit-tested accounting rules](../../site/audience-overlap.mjs). This is a methodological protection, **not a new audience-size survey**.

## What is and is not counted

The 32 [YouTube content-topic definitions](taxonomy.json) include partially overlapping concepts: beauty/fashion/lifestyle, gaming/esports/technology, and child-directed versus general animation are examples. Their audience sizes, joint intersection sizes, and percentages overlapping are **unmeasured**.

Some publicly cited sources measure other phenomena entirely: [Pew's U.S. platform-use survey](https://www.pewresearch.org/internet/fact-sheet/social-media/) measures U.S. adult platform use; [Pew's news-on-social-media fact sheet](https://www.pewresearch.org/journalism/fact-sheet/social-media-and-news-fact-sheet/) measures news behavior under its defined survey population; [DataReportal's Mexico advertising-reach report](https://datareportal.com/reports/digital-2026-mexico) reports advertiser-reachable accounts/audiences under its own method. **None measures how many distinct people are simultaneously in Mercata's beauty and gaming research categories.**

## Exact measurement and safe bounds

For exactly two communities measured as **unique people in the same respondent frame and observation period**:

`unique(A or B) = unique(A) + unique(B) - unique(A and B)`

The last term requires a **measured and verified overlap**, not an assumption that people only follow one category. With only separate counts for compatible groups, a cautious reported bound is:

`largest single community <= union <= min(common eligible population, sum of community counts)`.

An unknown common eligible population allows only the looser summed-count upper bound. These bounds are **not actual measured union totals**; they are consequences of elementary set arithmetic. Three or more groups generally need triple and higher-order intersections for an exact result, even if several pairwise overlaps are known.

The [audit module](../../site/audience-overlap.mjs) refuses mismatched frames, survey periods, geography, sampling methods, or metrics such as views. It also rejects impossible overlaps and refuses an exact union without a source-backed, verified common-frame intersection. Its numeric tests use exclusively **synthetic examples**, never observed YouTube audiences.

## Study-level gates

A future audience union requires a common survey or otherwise legally obtained deduplicated joint sample, a specified inclusion question per community, geography, age range, weighted/unweighted methodology, response exclusions, time window and matching consent/data rights. Do not infer community membership, political ideology, ethnicity or religion from any individual's name, photograph, language or comments.

A topic may appear in many video categories. A video count is not a count of people, and a sum of subscribers across channels can include the same individual repeatedly. Ad reach may include multiple accounts or differ in definition from monthly survey usage. These are **incompatible measurement units** until validated otherwise.

All five illustrative joint community groups and the whole-platform unique union remain `null` in the machine record. See [geographic scope](geographic-scope.md) for independent country axes and [creator income sampling](newcomer-income-cohort.md) for comparable missingness and selection safeguards.

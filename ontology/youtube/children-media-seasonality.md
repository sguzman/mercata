# Seasonal children's video viewing: evidence available and missing

**Reviewed October 24, 2026.** [Structured model](children-media-seasonality.json). This is a child-privacy-safe examination of **UK aggregate YouTube viewing**, not a measurement of seasonal variation or a prediction of children's interests.

## Annual benchmark, not a holiday measurement

Ofcom's [Children and Parents Media Use and Attitudes Report 2025–6](https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf?v=418231), page 21, draws on Barb's 2025 in-home broadband-connected viewing measurement. It reports these **average minutes per week**:

| UK children in 2025 | Weekly YouTube minutes | Reported change from 2024 |
| --- | ---: | ---: |
| Ages 4–15 | 427 (7h 07m) | +8% |
| Ages 4–9 | 407 (6h 47m) | +7% |
| Ages 10–15 | 447 (7h 27m) | +9% |

These are **yearly averages and year-on-year changes**. None measures a change between a term week and a school-holiday week. In the regulator's annual data, children may watch any type of YouTube content, not solely animation, songs or content marked Made for Kids.

In a distinct Q2 2025 report, [Barb](https://www.barb.co.uk/news/barb-starts-reporting-tv-set-viewing-to-youtube-channels-in-world-first-initiative/) estimated that **TV sets accounted for 53% of the in-home Wi-Fi YouTube viewing of children aged 4–15**. That share is a **device distribution**, not a seasonal percentage, and does not describe cellular or out-of-home viewing.

## Adjacent seasonal evidence: U.S. children's television (not YouTube)

[Nielsen's July 2025 account of its June TV measurement](https://www.nielsen.com/insights/2025/what-us-kids-watched-tv-streaming-summer-june/) reports a comparison for **U.S. children aged 6–17**, June 2025 against May 2025:

| Nielsen TV-screen measure | June relative to May 2025 |
| --- | ---: |
| Television impressions, all sources | +27% |
| Television impressions, streaming sources combined | +25% |

This is a **measured month-on-month change in television impressions**, not unique viewers, YouTube watch minutes, YouTube creator earnings, or specifically children's programming. The measured streaming bucket includes services other than YouTube; no YouTube-specific change is given. The period coincides with the beginning of U.S. summer breaks, but does not isolate a causal school-calendar effect from releases, device use, household composition or other changes. Neither percentage can be transferred to the UK's Barb age 4–15 annual YouTube baseline or treated as a projected seasonal lift for a child-directed channel.

The machine record stores this as an **adjacent comparator**, with YouTube-specific summer lift, sample size and causal effect remaining `null`.

## Adjacent school-return evidence: U.S. children's television

Nielsen's [September 16, 2025 August Gauge report](https://www.nielsen.com/news-center/2025/football-and-back-to-school-dynamics-spark-first-gains-since-april-for-traditional-tv/) measured U.S. **ages 6–17** on television screens:

| Comparison | All TV sources | All streaming TV |
| --- | ---: | ---: |
| August relative to July 2025 | -9% TV viewing time | -8% streaming usage |
| Last week relative to first week of the five-week August interval | -21% TV viewing time | -22% streaming usage |

The August broadcast measurement interval was July 28–August 31, 2025; the within-interval comparison uses July 28–August 3 and August 25–31. The report provides a **dated child TV viewing contrast**, not a YouTube-only viewing series, a unique-person census, or a causal estimate of school return. The full streaming category spans platforms other than YouTube, and other calendar and programming factors are not held constant.

The June increases above are measured in **television impressions**, whereas the August changes are measured using TV viewing and streaming usage. They cannot be chained into a cumulative seasonal change, even though they cover the same broad U.S. age group. Both reports come from Nielsen's measurement system, not independent sample replications. Neither measures Made for Kids genres, child-specific YouTube revenue or YouTube seasonal growth. The [structured record](children-media-seasonality.json) leaves YouTube-specific effect, child sample size and causal school-calendar lift as `null`.

## What still needs measurement

Seasonality requires comparable **dated age-specific viewing series**, using a consistent territory, device coverage, child age range, content category and sampling method. Plausible hypotheses include school-term versus holiday weeks, Christmas and New Year, summer breaks, Halloween-related categories, and after-school clock hours. The appropriate school calendar must match the country; the same holiday names do not have universal dates or usage effects.

The inspected sources still do not provide a validated cross-month school-break contrast for UK YouTube viewing or a trend series specific to children's music/animation. An annual +8% change **must not** be relabeled a summer lift. An after-school daily pattern (if independently measured) is not the same as seasonality across the year. A single viral nursery-rhyme video is not an age-specific child audience sample.

## Integrity and child privacy

Any empirical follow-up should use legitimately obtained **aggregate statistics**, never child accounts, profile identifiers, watch histories, location traces or individual demographic inference. Data must be comparable across age groups, devices, format rules and geography; missing age-by-week data remain unknown, not zero. Avoid inferring a child-focused earnings forecast, advertising reach or personal viewing preferences from these annual averages.

All five YouTube-specific seasonal questions in the [machine record](children-media-seasonality.json) retain `null` effects and open measurement gates. The observed annual viewing figures are bounded regulator results, not a completed child-viewing seasonal study. See [child format gates](child-age-and-format-gates.md) and [UK screen data](screen-viewing-uk-2025.md) for related restrictions.

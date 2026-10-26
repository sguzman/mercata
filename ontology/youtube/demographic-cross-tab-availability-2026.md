# 2026 YouTube demographic cross-tabulation and nonresponse audit

**Reviewed October 25, 2026.** [Machine table and acceptance gates](demographic-cross-tab-availability-2026.json). The study compares two *different* Pew survey frames already recorded in Mercata, not unpublished microdata.

[Pew's October 19, 2026 U.S. social media fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) reports self-reported **ever use of YouTube**, using the National Public Opinion Reference Survey of **5,511 adults** interviewed January 30–June 18, 2026 online, by mail and by telephone; its **±1.8 percentage-point error** is for the full sample, **not each demographic cell**. In contrast [Pew's 2026 YouTube news analysis](https://www.pewresearch.org/journalism/fact-sheet/social-media-and-news-fact-sheet/) uses **5,166 respondents** in the separately fielded August 24–30 American Trends Panel and measures *regular news use*. Even matching labels do not permit record-level linkage.

## What Pew actually publishes

| NPORS single-axis group | Observed YouTube ever-use rates | Joint or cell error available? |
| --- | --- | --- |
| household income | under 30000 77%; 30000 69999 84%; 70000 99999 86%; 100000 plus 90% | No cross-axis counts or per-cell n/error reported in this record |
| education | high school or less 77%; some college 87%; college graduate 90% | No cross-axis counts or per-cell n/error reported in this record |
| residence | urban 87%; suburban 86%; rural 78% | No cross-axis counts or per-cell n/error reported in this record |

## Missing intersections

| Requested cross-tab | Measurement failure |
| --- | --- |
| household income × residence | Same 2026 survey published separate household-income and community subgroup tables, not the income × residence joint frequencies. |
| age × published gender | Pew provides age and men/women rows independently; products of percentages are not the rate of use for age-by-reported-gender cells. |
| race ethnicity × religious affiliation | Race/ethnicity rates include a narrowly English-speaking Asian cohort; cited YouTube use table has no religion-by-race or religion-specific use. |
| age × country | The source studies U.S. adults, not a country-level panel; country × age YouTube use cannot be recovered from this U.S. survey. |
| household income × regular youtube news | The general use measure is Pew NPORS January–June, news use is a distinct ATP August sample and question. No linkable joint panel is documented. |
| age × political affiliation | Age and political-party news use are separate within-group published rates; no joint age-by-party table or subgroup n is available. |
| under 18 × niche interest | The adult national survey explicitly excludes minors; no child records or inferred viewer identities may be added. |

## Privacy, nonresponse, and statistical conditions

Pew notes that respondents who did not answer are omitted from the published rates. Mercata has **no per-cell nonresponse counts**, no sub-group design-based margins of error, and no joint sample counts. For the published Asian group, the survey's estimate is restricted to **English-speaking Asian adults**. The U.S.-adult samples contain no children. Studio owner analytics provide some aggregated demographics under access controls but do not create a universal cross-channel person-level table.

A legitimate age × country or income × residence estimate needs published compatible **joint survey tabulation**, appropriate cell denominators and weights, selection/mode documentation, confidence intervals or uncertainty, and a legal/ethical release basis. It cannot be constructed by multiplying the visible one-dimensional percentages. These missing values remain `null`; none is a claim of zero YouTube use by excluded groups.

## Age by country: genuine observations in incompatible 2025 frames

One country's child YouTube rate cannot fill another's missing survey cross-tab. Three independently published sources report **some actual within-country child age groups**, but their populations and use definitions differ:

| Source and country | Reported age group | Reported use | What was measured |
| --- | --- | ---: | --- |
| [Roy Morgan, Australia](https://www.roymorgan.com/findings/10131-yas-youtube-for-young-australians-survey-december-2025) | 6–13 | 89% | YouTube watched by age-group members in the 2025 Young Australian Survey |
| Same Australian survey | 6–7 | 84% | Within this younger age group; not an independent sample |
| Same Australian survey | 8–13 | 91% | Within older survey children; no group-specific error published here |
| [Ofcom Online Nation, U.K.](https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025) | 8–14 | 96% | U.K. service-use estimate; not a parent-survey response |
| [Pew, U.S.](https://www.pewresearch.org/2025/10/08/how-parents-describe-their-kids-tech-use/) | 2–4 | 84% | Parents reporting one selected young child had **ever watched** YouTube |

The Roy Morgan estimate derives from **1,129 Australian children ages 6–13** surveyed **April–December 2025** and published February 17, 2026. Its 6–7 and 8–13 rows form **subsets of the same Australian study**. Pew's **3,054 sampled U.S. parents** were interviewed May 13–26, 2025. Neither overall sample count represents the unreported **age-specific subgroup n**, and Ofcom's figure uses a different measurement design and age range.

Consequently the differences among 84%, 89%, 91% and 96% **must not** be interpreted as statistically significant country differences, a global international rank, or a test that a particular child has a YouTube account. They also do not measure animation-specific viewing, net creator income, YouTube Kids-only usage, or commercial conversion. Age-matched cross-country samples with identical instruments, uncertainties, and inclusion rules remain missing, and no individual minor records have been retrieved.

The U.S. 2026 **adult** NPORS age marginals above remain a fourth, incompatible frame. This bounded cross-country child comparison does **not** repair the missing adult age × country table or permit multiplying independent published age and country percentages. The machine record keeps common international rankings and all causal/geographic adjustments `null`.


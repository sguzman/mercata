# Survey and analytics-frame crosswalk — no pooled YouTube population estimate

**Audited October 24, 2026.** [Machine-readable frame audit](study-frame-crosswalk.json). Eight source frames used in Mercata's research have different people, time windows, measurement units and recruitment.

| Study | Declared selection frame and period | Sample size / unit | Outcome actually observed |
| --- | --- | --- | --- |
| [Pew 2025 U.S. adults](https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/) | U.S. adults 18+, NPORS web/mail/phone, February–June 2025 | **5,022** adult respondents | **Self-reported ever use of YouTube**; not the separate 5,123-person ATP daily-use sample |
| [Pew 2026 U.S. adults](https://www.pewresearch.org/internet/fact-sheet/social-media/) | U.S. adults 18+, NPORS web/mail/phone, January–June 2026 | 5,511 survey respondents | **Self-reported ever use of YouTube** |
| [YouTube/NRG U.S. online respondents 14–29](https://blog.youtube/culture-and-trends/youtube-culture-trends-modern-mainstream-research/) | April 2026, ages 14–29 including minors | 496 survey respondents | Self-reported niche/fandom viewing and recognition |
| YouTube/NRG U.S. online respondents 14–44 | April 2026, different age window and question set | 939 survey respondents | Attitudes about interest exploration |
| [CreatorIQ 2026 creators](https://www.creatoriq.com/whitepaper/state-of-creators) | Commercial creator survey, May 29–June 29 2026, 100 reported regions | 5,095 mixed-platform respondents | Self-reported annual creator income and primary-income status |
| [AIR 2026 monetized channels](https://air.io/en/air-data-findings/how-much-does-youtube-really-pay-in-2026-real-rpm-data-from-300-channels) | Vendor client channels with 10k–50m subscribers, monetized months May 2025–May 2026 | **300 channels**, **3,595 channel-months** | Selected YouTube Studio RPM (USD per 1,000 views) |

## News-consumer composition is not news-use prevalence

Pew's [October 19, 2026 News Platform Fact Sheet](https://www.pewresearch.org/journalism/fact-sheet/news-platform-fact-sheet/) reports an **August 24–30, 2026 American Trends Panel survey of 5,166 U.S. adults**. It describes news behavior and regular news use, a different outcome from the *January–June 2026 NPORS* question on **ever using YouTube** among 5,511 U.S. adults. Both are Pew studies, but sharing a publisher does not create a shared panel, identical question or common calendar denominator.

Pew's [September 2025 demographic profile of regular social-media news consumers](https://www.pewresearch.org/journalism/2025/09/25/appendix-demographic-profiles-of-regular-social-media-news-consumers-in-the-united-states/) instead describes **the characteristics of people who already regularly consume YouTube news**. A 2025 figure for the share of YouTube news consumers who are men, for example, must not be mistaken for the share of all U.S. men who regularly consume YouTube news. This is a different conditional population and period from the 2026 survey. The exact sample size of that conditioned subgroup remains unknown.

## The frame determines what each answer means

The three survey groups and AIR clients are not random subsamples of a single YouTube-user population. Pew's general-adult *ever use* question differs from online cultural attitudes, mixed-platform creator revenues and a client cohort's verified channel RPM. Their percentages cannot be averaged or weighted together into an estimated worldwide population without a justified, independently verified common selection model.

Even within YouTube/NRG's report, **the 496-person age-14–29 group and the 939-person age-14–44 group are not interchangeable**. The report assigns different footnotes to different question sets. Overlapping age eligibility does not give a measured overlap between sampled individuals.

YouTube and NRG's publisher-funded survey may provide descriptive evidence of an interviewed online population, but the public summary does not establish a probability-based sample design for all U.S. YouTube users. Under-18 respondents are represented only as published aggregate percentages; no individual child profiling or user-level data is included.

## Earnings and zero-earner exclusions

CreatorIQ's 5,095-person cross-platform sample measures **survey-reported annual creator income**, not native YouTube RPM. AIR directly examines Studio revenue information but **only for monetized client channels**, excluding failed and zero-earning entrants. Neither reveals the share of people who attempt YouTube creation but never earn anything. Nor is a channel-month a distinct new channel or independently sampled creator.

Where each published survey's **question-specific respondent count is missing**, the machine model stores `null`; it does not silently reuse the study's overall sample size. The same applies to unspecified study weights, joint sampling frames and creator overlap.

## Use when comparing future figures

Before combining surveys or building trends, demand the same unit (person, channel, view or dollar), the same question, jurisdiction, time window and eligibility, compatible sampling/weighting and a documented uncertainty/attrition model. When an overlap is not measured, maintain separate estimates or defensible bounds as described in the [audience overlap protocol](audience-overlap.md).

The [creator income study protocol](newcomer-income-cohort.md) still requires a first-entry cohort including zero earners. This audit is a validity safeguard, not a measured creator population or revenue distribution.

## The two NPORS waves versus daily-use panels

Pew's 2025 and 2026 NPORS studies both collected general U.S.-adult **ever-used-YouTube** responses using web, mail and telephone and report labeled income, education and residence categories. They were **independent respondent samples** of 5,022 and 5,511 adults, not repeated observations of the same people. The [paired descriptive comparison](us-demographic-use-2026.md) records source dates and small rounded point-estimate differences; it does not establish survey-adjusted significance, causal shifts, or unique active users. In contrast, the November 2025 published report's **5,123-person ATP daily-visit survey** is a **different questionnaire, timeframe and panel**. It cannot replace the 2025 NPORS denominator for education/income/residence YouTube ever-use tables.

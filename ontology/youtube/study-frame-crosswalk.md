# Survey and analytics-frame crosswalk — no pooled YouTube population estimate

**Audited October 23, 2026.** [Machine-readable frame audit](study-frame-crosswalk.json). Five source frames used in Mercata's research have different people, time windows, measurement units and recruitment.

| Study | Declared selection frame and period | Sample size / unit | Outcome actually observed |
| --- | --- | --- | --- |
| [Pew 2026 U.S. adults](https://www.pewresearch.org/internet/fact-sheet/social-media/) | U.S. adults 18+, NPORS web/mail/phone, January–June 2026 | 5,511 survey respondents | **Self-reported ever use of YouTube** |
| [YouTube/NRG U.S. online respondents 14–29](https://blog.youtube/culture-and-trends/youtube-culture-trends-modern-mainstream-research/) | April 2026, ages 14–29 including minors | 496 survey respondents | Self-reported niche/fandom viewing and recognition |
| YouTube/NRG U.S. online respondents 14–44 | April 2026, different age window and question set | 939 survey respondents | Attitudes about interest exploration |
| [CreatorIQ 2026 creators](https://www.creatoriq.com/whitepaper/state-of-creators) | Commercial creator survey, May 29–June 29 2026, 100 reported regions | 5,095 mixed-platform respondents | Self-reported annual creator income and primary-income status |
| [AIR 2026 monetized channels](https://air.io/en/air-data-findings/how-much-does-youtube-really-pay-in-2026-real-rpm-data-from-300-channels) | Vendor client channels with 10k–50m subscribers, monetized months May 2025–May 2026 | **300 channels**, **3,595 channel-months** | Selected YouTube Studio RPM (USD per 1,000 views) |

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

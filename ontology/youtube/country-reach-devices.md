# YouTube country reach, screen time and multi-market survey measures

**Evidence reviewed: 2026-10-23.** The [machine-readable observation register](country-reach-devices.json) retains scope, date, period, device, population and source identity. Country-specific use, minutes watched and news survey participation are not interchangeable.

## United Kingdom: Ofcom Online Nation (2025)

Ofcom's [December 10, 2025 Online Nation briefing](https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025) says YouTube was used by **94% of UK adults** in its tracked online-audience context. It separately reports an average **51 minutes per day spent on YouTube excluding TV sets**. Its short public briefing does not provide all conditional denominator/weighting details for time spent. We therefore do not convert this into a count of global YouTube users or combine the 51 minutes with another study's device total.

## UK: Ofcom Media Nations (2026 report, 2022–2025 series)

Ofcom's [July 29, 2026 Media Nations briefing](https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-adults/nations-media-habits-revealed-in-annual-ofcom-report) reports a distinct **Barb-based in-home video viewing** series:

| Observation, UK | 2022 | 2025 | Basis |
| --- | ---: | ---: | --- |
| YouTube watching on a **TV set** | 9 minutes | 19 minutes | Daily average per person, TV set only |
| YouTube watching on **all in-home connected devices** | 33 minutes | 41 minutes | Daily average per person, includes TV |
| **Weekly reach among people 75+** | 28% | 33% | Within-age-group prevalence |

This analysis covers in-home viewing, not use outside the home or on cellular networks. **TV minutes are a subset of in-home connected-device viewing**; they must not be added to the all-devices figures. Nor can either be mechanically added to the 51-minute Online Nation statistic, which uses a separate online device coverage and methodology. The age-75+ figures measure likelihood of use **within** that age cohort, not the composition of YouTube's whole audience.

## Reuters Institute: Digital News Report 2026

The [Reuters Institute's June 2026 summary](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary) says **69% of respondents** across its surveyed markets use YouTube for any purpose and **34%** use it for news. The news question concerns use in the preceding week; the [methodology](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/methodology) describes the online survey and its market-based design.

The denominator is **online survey respondents across the covered 48 markets**. This is not the share of humanity using YouTube, not the country-level number of unique YouTube news viewers, and not the share of YouTube impressions that concern news. Both percentages differ from Pew's specifically sampled U.S.-adult news-use series because their populations and question designs differ.

## Which comparisons are defensible?

Comparisons of 2022 with 2025 are defensible **inside the same Ofcom in-home/TV viewing family and fixed units**. Comparisons between different devices can describe screen distribution but require acknowledging that all-device home use includes TV.

Country, market, age-group and content-category quantities cannot be added as if disjoint people. Cross-national estimates must preserve internet coverage, age eligibility, survey question wording, response basis, market weighting and observation period. Advertising reach and channel subscribers cannot stand in for measured unique viewers.

## What remains unknown

These studies do **not** supply a country-by-country population of unique YouTube creators, representative UK YouTuber salaries, the number of UK people watching a selected niche, or a 2026 worldwide monthly active-user census. Those values remain `null` in the machine model. Video viewing on television can increase without guaranteeing that new channels can acquire the same attention or earn a given revenue.


## How much does a person watch? Keep account and person units separate

[Digital i's June 3, 2026 release](https://digital-i.com/news-articles/press-release-youtube-overtakes-netflix-for-average-daily-viewing-time-while-netflix-channel-achieves-widest-reach-of-2025) reports an average **87.2 minutes per day per measured YouTube account in 2024** and **99.1 minutes in 2025**, from its commercial measurement across **20 international markets**. It also reports **111 minutes per day for Gen Z accounts** and **161.5 minutes per day in South Korea** in its 2025 market/age breakdowns. Its release does not provide the underlying count of sampled accounts, cross-country weights, person/account deduplication factors or a full distribution of viewing time.

These are **account-level means** in a selected multi-country vendor frame, not unique individuals around the world. Accounts are not people: multiple people can share an account and one person can use several accounts or view while signed out. The 99.1-minute mean cannot establish the *median typical viewer*, top-decile heavy viewer, exact share of people watching daily, or a global average per person. No verified video-per-person watch-time census was available.

**Do not average or sum with the UK figures above.** Ofcom's 2025 Online Nation **51-minute** measure covers tracked UK online adult activity **excluding television-set viewing**. Ofcom's distinct Barb **41-minute** 2025 figure measures **in-home connected-device viewing including TV**, with out-of-home and cellular viewing outside that frame. Digital i's international account sample, Ofcom's tracked online adults and Barb's in-home person estimates are **three incompatible measurement populations** with different devices and denominators. Differences in their reported means do not imply growth, contradictory results, or country-wise viewer rankings.

[Machine record](country-reach-devices.json) stores both annual Digital i account means and unknown heavy-viewer distribution, global median, and unique-human average explicitly as `null`. The task remains partially complete because the required representative *per-person* distribution is unavailable.


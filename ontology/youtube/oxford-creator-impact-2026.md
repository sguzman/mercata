# Oxford Economics 2026: creator survey frames versus economic impact

**Observation:** 2026-10-24. **Source:** [Oxford Economics methodology](https://www.oxfordeconomics.com/youtubes-creator-economy-impact/) and [YouTube's July 16, 2026 U.S. impact announcement](https://blog.youtube/news-and-events/2025-us-youtube-impact-report/). This study was commissioned in the YouTube ecosystem. Its creator sample was recruited through YouTube, so it is not an independently drawn sample of all creators.

## Actual country survey response counts

Oxford Economics fielded separate online surveys in January–March 2026. The **creator** responses were invited through YouTube and checked for subscriber-size diversity. The **user** survey used age/gender population sampling and weights intended to reflect the YouTube user base. The **business** survey included different firm roles, which can overlap. Every number in the table is a count of survey responses, **not** a census, platform MAU, unique creator, monetized channel, or total national business count.

| Jurisdiction | Creator responses | Business responses | User responses |
|---|---:|---:|---:|
| Brazil | 5,200 | 600 | 3,000 |
| United States | 6,100 | 600 | 5,700 |
| Canada | 2,200 | 600 | 3,000 |
| European Union (27) | 12,100 | 2,400 | 13,700 |
| France | 1,100 | 600 | 3,000 |
| Germany | 1,400 | 600 | 3,000 |
| United Kingdom | 3,200 | 600 | 3,000 |
| Australia | 1,100 | 600 | 3,000 |
| India | 43,300 | 600 | 3,000 |
| Indonesia | 5,500 | 600 | 3,000 |
| Japan | 3,400 | 600 | 3,000 |
| South Korea | 1,200 | 600 | 3,000 |

**Non-additivity:** The EU27 jurisdiction encompasses France and Germany; the published rows are not separate disjoint country populations. No global total is estimated or reverse-engineered from the table.

## Three definitions that matter

- A *creator* has uploaded at least one video, even with no revenue. A creator *paid by YouTube* receives direct platform money, which is narrower than earning elsewhere as a result of YouTube.
- An Oxford *creative entrepreneur* in the modeled economic ecosystem has at least 10,000 subscribers on the largest channel, **or** has fewer and receives YouTube-related earnings or permanently employs others. This is **not** all creators.
- A *user* in the survey is aged 18 or older and watches YouTube at least monthly. It is not a count of all age groups or unique site visitors.

## Economic-impact model is not a creator-income survey

The July 2026 announcement says that in 2025 the YouTube creative ecosystem contributed **more than USD 60 billion to U.S. GDP** and supported **more than 540,000 full-time-equivalent jobs**. These are estimated macroeconomic impact outcomes, not aggregate video advertising receipts, creator net profit, payouts per creator, income medians, or personally employed people. Oxford models direct value added, indirect effects and induced spending, and YouTube supplies aggregate 2025 payouts. The analysis also estimates outside revenue from creator and business surveys.

The entrepreneur FTE component uses self-reported weekly hours **only for creative entrepreneurs reporting at least eight hours per week**; permanent staff and downstream workers use different modeling. That selection prevents converting the FTE result into observed typical creator work hours or income per hour. Income medians, zero-earner fractions, direct payout distribution and post-expense hourly rates all remain **unknown**.

## Earlier U.S. economic-impact release: 2024 versus 2025

YouTube's [June 10, 2025 report about 2024](https://blog.youtube/news-and-events/2024-us-youtube-impact-report/) describes an Oxford Economics estimate of **over USD 55 billion in U.S. GDP contribution** and approximately **490,000 supported FTE jobs**. The [July 16, 2026 release about 2025](https://blog.youtube/news-and-events/2025-us-youtube-impact-report/) gives **more than USD 60 billion** and **more than 540,000 FTE jobs**, respectively.

These are modeled U.S. economic-impact estimates with rounded figures and lower bounds, not the actual number of individual people working on YouTube, earned dollars for any creator, or payouts from YouTube. A larger reported **lower bound** in 2025 does *not* prove that the unknown actual 2025 value exceeded the unknown actual 2024 value: both could be arbitrarily higher than their respective published thresholds. Even with exact figures, a valid trend would require verifying consistency of methods, sample frames and assumptions year to year. Therefore **no numerical growth rate or causal effect is inferred** from this pair.

For a separate accounting comparison, see [Alphabet's corporate advertising and subscription revenue statements](alphabet-youtube-ads-sec-2026.md), which report different entities, geographies, units and reporting rules.

## Study limits

The creator sample is platform-recruited; documented random-draw probabilities and all-creator inclusion rates are unavailable. Jurisdiction counts overlap. Business categories can overlap. Results are commissioned by an interested party. The estimates are gross economic contributions without a counterfactual for displaced uses of labor or investment. Neither creator-selection bias nor unobserved zero earners can be repaired by adding response counts. Do not combine these samples with Pew adult-use surveys, CreatorIQ creators or vendor channel indexes as one population.

Machine record: [oxford-creator-impact-2026.json](oxford-creator-impact-2026.json). Regression gates: [survey audit tests](../../tests/oxford-creator-impact.test.mjs).

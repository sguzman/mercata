# YouTube use, news consumption and demographic denominators in the United States

**Reviewed October 24, 2026.** The [machine measurement crosswalk](us-news-demographic-crosswalk.json), [comparison audit](../../site/us-news-demographic-audit.mjs), and [tests](../../tests/us-news-demographic-audit.test.mjs) compare two independently fielded Pew surveys. They do not combine respondents, impute personal characteristics, or infer income.

## The populations and questions differ

**Ever uses YouTube:** Pew's [October 19, 2026 U.S. social-media fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) draws on the National Public Opinion Reference Survey (NPORS), **5,511 U.S. adults**, January 30 to June 18, 2026, web/mail/phone. The reported **overall** margin of error is ±1.8 percentage points, not the error for any individual subgroup.

**Regularly gets news on YouTube:** Pew's [October 19, 2026 social media and news fact sheet](https://www.pewresearch.org/journalism/fact-sheet/social-media-and-news-fact-sheet/) draws on a separate **5,166-adult** American Trends Panel survey, August 24 to 30, 2026. Pew reports **34% of all U.S. adults** regularly get news from YouTube, compared with **41% of YouTube users**. The two percentages use different denominators, and neither gives distinct global users or the share of paid YouTube customers.

## Published demographic subgroup estimates

All cells are percentages *within the named U.S. adult subgroup*, not percentages of the composition of YouTube's audience.

| Published subgroup | Ever uses YouTube, NPORS 2026 | Regularly gets YouTube news, ATP August 2026 |
| --- | ---: | ---: |
| Men | 85% | 41% |
| Women | 83% | 28% |
| Age 18–29 | 95% | 39% |
| Age 30–49 | 91% | 38% |
| Age 50–64 | 85% | 33% |
| Age 65+ | 65% | 26% |
| Republican or Republican-leaning | 84% | 35% |
| Democratic or Democratic-leaning | 86% | 36% |

Both surveys describe *U.S. adults* but use different respondents, fieldwork dates and questions. In particular, **41% of men** in the news table must not be confused with **41% of YouTube users**, and cannot be turned into the share of YouTube news viewers who are men. These are descriptive aggregate survey outputs, not demographic targeting instructions.

Pew's published categories are labeled **men** and **women**, but the available tables do not establish a biological-sex measure. Biological sex-specific usage and news rates stay **unknown**; no sensitive individual attributes can be inferred from comments, images, voices or profiles. Unpublished subgroup sample sizes, subgroup-specific error margins and age-by-gender or age-by-party intersections also stay unknown. Multiplying separate percentages is not a valid joint-population estimate.

## News-use series, 2020–2026

Pew's U.S.-adult regular YouTube news-use table reports **23%, 22%, 25%, 26%, 32%, 35%, 34%** for 2020 through 2026 respectively. These are successive survey estimates of news use, not a panel that follows the same people, a count of actual views or a verified category-level creator income history. The 2025→2026 change is **-1 percentage point descriptively**, not established statistically significant or caused by platform changes.

The report also publishes a distinct *within-YouTube-user* series. Without matched year-specific denominators and uncertainty, it cannot be used to back-calculate audience size or infer whether the actual number of news viewers fell.

## Unresolved empirical gates

Subgroup n and uncertainty, audited biological-sex-specific measurements, age-by-gender and party-by-gender interactions, country-specific comparable news survey populations, causal mechanisms and YouTube creator-specific earnings remain unmeasured. The crosswalk deliberately rejects spurious joins of separate survey margins.

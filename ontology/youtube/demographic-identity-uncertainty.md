# Published demographic aggregates versus inferred identities

**Research date: October 24, 2026.** This is a documented public aggregate source and a privacy limitation, not person-level profiling. [Structured record](demographic-identity-uncertainty.json).

## U.S. adult race/ethnicity-group YouTube ever-use, Pew 2026

[Pew Research Center's October 19, 2026 fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) reports the following in its Jan. 30–June 18, 2026 National Public Opinion Reference Survey of **5,511 total U.S. adults**, with web, mail and phone participation.

| Respondent grouping | Ever used YouTube |
| --- | ---: |
| White adults, reporting only White race and not Hispanic | 83% |
| Hispanic adults, of any race | 85% |
| Black adults, reporting only Black race and not Hispanic | 84% |
| Asian adults, reporting only Asian race and not Hispanic, **English-speaking coverage only** | 95% |

Every number is **the rate of self-reported ever-use within the named eligible subgroup**, *not* that group's share of YouTube's users, a country-wide active-user count, or the demographics of content creators. The Asian estimate's English-speaker qualification is essential and excludes inference about all Asian-American language groups. Source definitions apply; Mercata does not assign these attributes to an individual.

Pew's **±1.8 percentage-point margin of error** and **5,511 respondents** refer to the **overall survey**, not each subgroup row. The fact sheet does not establish individual row sample sizes and uncertainties for this specific table. The machine record preserves all subgroup `sample_n` and `sampling_moe_pp` values as `null`.

## Religious identity: no verified YouTube-specific denominator

The cited 2026 YouTube platform-use table **does not provide use rates by respondents' religious affiliations or beliefs**. Mercata does not invent Christian, Muslim, Jewish, unaffiliated or other religious audience percentages; neither YouTube creator profiles nor the public channel API supply a validated religious-affiliation census.

Watching a religious service, discussing a faith, a name, a language, clothing, emojis, a comment or a creator's location is **not a reliable or permissible basis** to assign a person's religion. Any legitimate future study needs an appropriate population frame, voluntary self-reported affiliation, clear question wording, explicit consent/data-use basis, denominators, sampling uncertainty and safeguards against identifying participants. Merely counting views of a faith-related video measures **view events**, not religious people.

## Separate platforms, populations and statistical questions

Race/ethnicity and religion are individual attributes **only when directly and appropriately reported**, whereas Mercata's video-topic labels describe content subjects. A video tagged politics, gaming, wellness, finance or faith is not evidence of its viewer's identity. No inference about a specific creator, commenter or minor is made.

A valid population study must state age eligibility, geography, sampling method, languages, ethnicity/affiliation definitions, weighted or unweighted results, nonresponse and privacy rules. U.S.-adult *ever-use* cannot become an estimate of all global YouTube people, education or entertainment viewers, or creator earnings.

The [crosswalk of source populations](study-frame-crosswalk.md), [viewer-person metric study](viewer-person-metrics.md) and [overlapping-audience constraints](audience-overlap.md) describe further reasons these figures cannot be used to reconstruct individual identities or full-platform audience composition.

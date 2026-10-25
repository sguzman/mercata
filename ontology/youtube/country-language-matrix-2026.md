# Countries, content-language metadata and viewer populations are different denominators

**Reviewed 25 October 2026.** [Machine-readable seven-country crosswalk](country-language-matrix-2026.json), linked to the original [country advertiser-reach observations](country-ad-reach-comparisons.md) and [official language API field audit](language-audience-api-crosswalk-2026.md).

The country observations are **late-2025 Google advertising-planner estimates** in *Digital 2026* publications, not 2026 active YouTube viewers or people speaking a specified language.

| Advertiser market | Late-2025 estimated reach (millions) | Example BCP 47 label for a *future sample* | Observed YouTube viewers by language |
| --- | ---: | --- | --- |
| [Mexico](https://datareportal.com/reports/digital-2026-mexico) | 85 | `es-MX` (unobserved placeholder) | Unknown |
| [United States](https://datareportal.com/reports/digital-2026-united-states-of-america) | 254 | `en-US` (unobserved placeholder) | Unknown |
| [Brazil](https://datareportal.com/reports/digital-2026-brazil) | 150 | `pt-BR` (unobserved placeholder) | Unknown |
| [India](https://datareportal.com/reports/digital-2026-india) | 500 | `hi-IN` (unobserved placeholder) | Unknown |
| [Indonesia](https://datareportal.com/reports/digital-2026-indonesia) | 151 | `id-ID` (unobserved placeholder) | Unknown |
| [Japan](https://datareportal.com/reports/digital-2026-japan) | 78.5 | `ja-JP` (unobserved placeholder) | Unknown |
| [Philippines](https://datareportal.com/reports/digital-2026-philippines) | 59.6 | `fil-PH` (unobserved placeholder) | Unknown |

**These labels are not measured national language composition.** Each country can contain multiple primary languages, tourists, immigrant communities, multilingual viewers, creators outside the country, and audience members using dubs or subtitles. The listed label is simply a machine-readable query example; no language row has been measured or used to estimate people.

## What a reproducible country–language study must record

For predeclared public videos, record IDs once and keep [`defaultLanguage` title/description](https://developers.google.com/youtube/data/reference/rest/v3/videos), `defaultAudioLanguage`, additional audio dubs and captions in different columns. Missing values are unknown, never guessed from upload country or creator name. Sampling by search is relevance-biased and cannot represent all active channels. Any report of **viewer country** comes separately from authorized [YouTube Analytics `country` dimensions](https://developers.google.com/youtube/analytics/dimensions). It counts viewed activity, not mother tongue. Language preference of each real viewer requires its own ethically collected denominator, which this project does not have.

## Geographic interpretation

Mexico, the US and Brazil previously appeared in Mercata's general reach crosswalk; India, Indonesia, Japan and the Philippines come from a distinct four-country country-panel artifact. Every value retains its own published scope. No cross-source additions, audience growth claims, language-population multiplication or country-specific creator wage estimates are valid. The measured number of language-labeled public videos remains zero because this is not a live collection exercise.

**Unverified:** first/secondary language of actual YouTube viewers, matched country-by-language audiences, language-specific content communities, unobserved non-advertiser viewers, active creator counts, and income by language. These remain null until supported by properly sampled compatible observations.

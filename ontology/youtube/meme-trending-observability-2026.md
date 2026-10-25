# Memes, short humor and fandom participation: historical trends versus survey awareness

**Review:** 2026-10-25. Sources: [2026 ICWSM peer-reviewed Global YouTube Trending Dataset](https://ojs.aaai.org/index.php/ICWSM/article/view/42784) and [YouTube/NRG Culture & Trends research, September 2026](https://blog.youtube/culture-and-trends/youtube-culture-trends-modern-mainstream-research/).

## Archival videos are not 78 million independent viewers

The ICWSM dataset archived YouTube's **former platform-curated non-personalized Trending pages** across **104 countries**, with a target of four observations per day, from July 1, 2022 through June 30, 2025. It contains **446,971 snapshot captures**, approximately **78.4 million ranked video entries**, and **726,627 distinct video IDs**.

A *snapshot* is a country-time ranking; a *ranked entry* is a video's inclusion within one such capture; a *unique video* is one deduplicated ID. Repeated appearances of the same video are expected. Neither ranked entries nor cross-country appearances are distinct viewers, unique creators, meme categories or populations of speakers. The former public Trending surfaces were **retired July 1, 2025**, so this archive is a historical visibility instrument, not a current discoverability API or representative sample of YouTube.

This distinction matters for mapping the *cross-national spread of a publicly visible joke* without inventing viewer migrations or saying a video reached every resident of a country whose trending list contained it.

## April 2026 meme and niche-awareness survey

YouTube reported [NRG's April 2026 U.S. survey](https://blog.youtube/culture-and-trends/youtube-culture-trends-modern-mainstream-research/) of **496 online respondents aged 14–29**. In response to what many people seem to be into, **78%** identified memes as widely known, **77%** digital YouTube creators and **79%** Hollywood celebrities. This question measures perceived cultural salience, **not** the proportion who watched memes.

The same respondent frame reported **71%** having watched lore/story videos about a fandom or community and **69%** having watched content from a self-defined niche community. These overlapping answers cannot be added into a count of all niche viewers or used as a global rate; the age/geography and sampling frame are explicitly bounded. A separate 939-person sample of 14–44-year-old U.S. online people supports other YouTube trends claims but must not be substituted for the 496-person meme sample.

## Candidate repeatable categories

A reproducible humor atlas should distinguish original sketches, reactions, remixes, brief template-based edits, and fandom-lore explanation. All are **content classes**, not mutually exclusive people or creator populations. Each video may receive multiple class labels, but geographic and temporal comparisons must deduplicate video IDs and preserve age-of-video and category coverage. A meme's subsequent appearance in several channels could reflect shared external trends or independent adaptations rather than a directed person-to-person transmission.

No full-corpus meme-label coding, present-day Shorts prevalence, creator income panel, viewer migration data or payout information has been gathered here.

[Machine reference](meme-trending-observability-2026.json) · [snapshot counter and inference auditor](../../site/meme-trending-audit.mjs) · [tests](../../tests/meme-trending-audit.test.mjs).

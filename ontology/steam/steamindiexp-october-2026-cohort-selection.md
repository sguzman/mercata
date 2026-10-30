# Recent Indie-tagged Steam releases: October 23, 2026 selection audit

**Original source:** [Steam Indie XP, Issue 3](https://steamindiexp.com/), October 23, 2026. This is a public third-party analysis of Steam storefront signals, **not** Valve sales or publisher-finance reporting. This dossier records the issue-specific snapshot, methods, selection effects, and missing denominators; it does not reproduce its images or ranked games.

[Machine-readable observation](steamindiexp-october-2026-cohort-selection.json) · [Executable denominator check](../../site/steamindiexp-selection-audit.mjs)

## The sampling frames are not interchangeable

| Source-reported frame | Inclusion and observation limits |
| --- | --- |
| 5,483 recent Indie-tagged games | Released **or left Early Access** within 120 days of the October 23 snapshot; 31 major publishers excluded |
| Review milestone assessment | A “hit” is **100 or more lifetime reviews**, evaluated at age **21–120 days** |
| Theme classification | All **311** eligible hits plus a random **881** non-hit sample; non-hit observations were weighted approximately fivefold |
| AI disclosure sample | **104 of 220** recent sampled games carried a self-reported Steam AI disclosure section; author rounds to **47%**, with a stated approximate ±7 percentage-point uncertainty |
| October Next Fest roster | **7,236** titles from SlopDodge's October 21 roster, versus a separately cited **7,164** demo count from SteamDB; definitions and observation times are not aligned |

The 5,483 records include games selected by the **Indie tag**, not a census of independently developed, originally paid releases. Games entering version 1.0 after a paid Early Access period can be much older economically than their apparent release event. Explicit publisher exclusions make this frame different from Valve's complete game roster, even before the effects of tags, delistings and unobserved products.

The theme-coded denominator **311 + 881 = 1,192** is a deliberately disproportionate case-control sample, not a random collection of games from which a hit fraction may be calculated by dividing 311 by 1,192. The eligible 21–120-day population denominator is not provided. Likewise, dividing 311 by all 5,483 120-day releases would wrongly include recent games younger than 21 days and may mix methods of identifying newly full-released Early Access games. The study explicitly reweights non-hits when estimating theme hit rates. These are *review milestones*, not purchases.

## Separate AI and festival observations

The observed AI-disclosure rate in the stated sample is **104/220 = 47.27%**, reported as 47%. Disclosing on a Steam store page is not independent verification of AI use; games with undeclared use can exist. The sample is not equivalent to the October Next Fest roster, which uses other sources and time windows, so a difference in disclosure percentages is not a causal increase or decrease.

The reported October festival roster totals differ by **72**, but that cannot be interpreted as 72 newly added games or disputed sales; roster definitions differ, and neither source provides game-level paid purchases or a denominator of actual demo players.

## Observation limits and publication conditions

The source states that Steam Community follower retrieval was blocked during part of its week, that review text was unavailable at publication time, and that a Popular Upcoming page was missed on one day. Some timeline and acquisition explanations are therefore constrained, not controlled causal evaluations. The thematic classification was assisted by automated description/tag coding and reweighted after outcome-stratified sampling. The original sample rows and classification reproducibility are not independently verified here.

This audit supports only narrow **indie-frame selection**, **review-threshold comparability**, and **festival roster coverage** tasks. It supplies no authentic gross sales, net publisher payouts, actual no-sale fraction, representative first paid-release frame, or verified chance of commercial success.

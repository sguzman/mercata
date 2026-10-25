# VTuber Super Chats: observed concentration in a selected cohort

**Publication:** 25 April 2025. **Source:** [Zhao and colleagues, CHI 2025](https://doi.org/10.1145/3706598.3713877), *Who Reaps All the Superchats? A Large-Scale Analysis of Income Inequality in Virtual YouTuber Livestreaming*. Mercata previously registered the abstract. This review adds the publisher's underlying cohort measurements without copying its participant records or media.

## What was actually observed

The authors analyzed **1,923 selected VTubers**, approximately **450,000 publicly archived livestreams** and more than **one million streaming hours** from 2017 through July 2023. Their financial traces derive from public Super Chat messages and transaction face values converted to USD-equivalents using historical currency rates. They also studied memberships and chat participants, but did **not** obtain creator profit-and-loss ledgers.

For this selected VTuber cohort, the study reports a **USD 2,667 mean** and **USD 127 median** monthly Super Chat-derived value. Approximately **75% of sampled channels recorded at least one Super Chat** during the studied window, leaving **25% with no observed Super Chat event**. That final number is emphatically **not** a share of all YouTube creators earning nothing: excluded income streams could still generate revenue. The study's inter-VTuber Gini index rose from about **0.60 (2018)** to about **0.75 (2023)** within the historical sample; no population-level causal attribution follows.

## Paying participants are not equivalent to all viewers

Across approximately **6.75 million distinct accounts that posted public chat messages**, the researchers observed **7.96%** sending at least one Super Chat and **12.65%** purchasing at least one channel membership. These are overlapping behavior categories; membership purchasers and Super Chat senders must **not be summed** to infer all buyers. People who watched without chatting were absent from that denominator, so the percentages cannot be treated as conversion among all views or viewers.

Within the sampled channels, the median share sending Super Chats was **5%**, compared with **14% among repeat loyal chatters** and **22% among members**, as defined by the authors. These selected conditional patterns are not causal evidence that inducing membership produces extra purchases. Raw accounts are not verified distinct offline individuals.

## Lifetime, sampling and accounting boundaries

The study reports a median **24-month** interval between first and last observed stream, with **1,057 channels** ceasing streaming within their first three years by the observation cutoff. This is subject to archival gaps and right-censoring, so it must not be presented as the rate of creator business failures.

Neither the USD amounts nor the behavioral rates establish platform fees actually settled to each creator, contract allocations to agencies, production costs, tax liabilities, a verified hourly wage, or zero total creator earnings. Results do not generalize to all YouTube creators, formats, countries or 2026 markets.

Machine evidence: [vtuber-superchat-cohort-2025.json](vtuber-superchat-cohort-2025.json). Guarded comparisons: [vtuber-superchat-audit.mjs](../../site/vtuber-superchat-audit.mjs); [regression tests](../../tests/vtuber-superchat-audit.test.mjs).

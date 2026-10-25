# Educational video format observations: three incompatible YouTube cohorts

**Reviewed:** 2026-10-25. The study set consists of three published empirical analyses of actual YouTube content, rather than one combined population estimate.

## Source-defined samples

| Study | Selected video population | Observed units | Reported pattern |
|---|---|---|---|
| [Spanish-language STEM research, published February 2026](https://doi.org/10.1080/21548455.2026.2616740) | 124 physics/engineering videos posted 2019–2025 on one channel | Authorized YouTube retention after 30 seconds and average view duration | Science dissemination outperformed problem-solving exercises on retention; videos under eight minutes and those without a fixed introduction had better within-channel retention |
| [Indonesian education research, March 2025](https://doi.org/10.21831/jitp.v12i1.77488) | Proportionate 139-video sample out of 218 videos on one channel | Owner Analytics views, shares, likes, watch minutes and duration | Instructional videos led on views/shares; practice tests on likes and viewing duration |
| [Turkish mathematics research, September 2025](https://ijci.net/index.php/IJCI/article/view/1633) | 126 previously highly viewed Turkish-language math instruction videos | Public views, likes, comments | Video length alone was not statistically associated with the selected video popularity and reaction counters |

The STEM findings are based on the publisher's accessible abstract; the full underlying video-level records, full significance estimates and causal design were not independently verified. In the other two studies the samples were also selected within bounded educational settings. None represents all YouTube creators or all global educational viewing.

## Why the length findings must not be forced together

The Spanish STEM study analyzed **watch retention after 30 seconds** and **average view duration** for one channel and compared two pedagogical formats. The Turkish mathematics study analyzed **public view, like and comment counts** for a preselected set of already highly viewed videos. These are fundamentally different response variables. A short-video retention association in a selected STEM sample does not contradict a null video-length association with public counts in selected mathematics videos.

The Indonesian single-channel study offers a direct **within-channel format comparison**, but it still does not randomize content purpose or viewer motivation. Practice-test content may naturally attract people who need more time to solve tasks, while short explanations can generate more one-off play events. None of the studies measures actual money collected or production labor per view.

A separate study of 3.1 million views of **online biomedical courses** is deliberately *excluded* from the YouTube-only dataset because learning-management or course-platform video telemetry is not proven equivalent to native YouTube analytics. School-course requirements, tests and enrollment can create different repeat-viewing incentives.

## Research and production implications

A valid future experiment should preregister an educational category (demonstration, tutorial, practice test, documentary/explainer), duration band, release period, channel-maturity cohort and compatible owner Analytics metric. If the goal is actual learning, comprehension and practice-test performance require separate outcome measurements. For income, add independent payout, cost and creator-work-hour data; watch time alone cannot supply those figures.

No universal **best video length**, causal growth lift, typical scientific creator earnings, all-channel viewing-session median or direct sales conversion is available in these studies.

[Machine comparison](educational-video-format-cohorts-2026.json) · [Inference auditor](../../site/educational-video-evidence.mjs) · [Tests](../../tests/educational-video-evidence.test.mjs).

## Cross-sectional statistics lesson quality: a fourth, differently sampled case

[An original 2026 journal study](https://pmc.ncbi.nlm.nih.gov/articles/PMC13659105/) reviewed **200 initially returned YouTube URLs** from the top 50 results for four statistics/analysis queries (November 17, 2025). After removing **41 duplicates**, **22 non-English videos**, and **23 off-topic videos**, **114 English statistics videos** remained. Two researchers scored their educational quality, with a third evaluating disagreements using the Global Quality Scale and a modified DISCERN tool.

| Observed attribute of selected 114 videos | Count |
| --- | ---: |
| Rated high quality on the study's rubric | **87 (76.3%)** |
| Slide-based presentation | **45** |
| Narrative-focused | **24** |
| Animation | **29** |
| Screen demonstration of statistics software | **16** |

The authors also reported a **625,438.5 median lifetime view count** in this selection, which was visibly conditioned on search relevance and sampled *surviving* results. Their reported *views per day* was **lifetime views divided by days since upload**, not a time series of actual daily viewers.

**Crucial boundary:** This study does not establish that 76.3% of *all* educational YouTube videos are high quality, nor that animation causes superior learning, that longer videos monetize worse, that these viewers are unique people, or that an independent statistical educator will earn money. The 114 selected videos are **not** added to the older STEM (124), Indonesian (139), or Turkish mathematics (126) cohorts as though they were one randomly sampled population. The [case validator](../../site/statistics-video-quality-audit.mjs) enforces the exact original counts and missing outcomes.

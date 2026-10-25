# YTLive: measured livestream concurrency, not unique people

**Evidence checked:** 2026-10-24. Study: Mozhganfar et al., [YTLive](https://arxiv.org/abs/2510.24769), submitted October 2025 and presented at NOMS 2026. [Dataset provenance](https://github.com/ghalandar/YTLive) includes `durations.csv` and `viewers.csv` with SHA-256-hashed stream IDs. This dossier registers the authors' reported cohort and methods, not newly downloaded person-level records.

## Recorded sample and units

Researchers used YouTube's Researcher Program to capture **more than 507,000 time observations** from **12,156 livestreams** observed in **May–June 2024**. Viewer concurrency was sampled at **five-minute intervals**, alongside actual start/end timestamps and stream duration in minutes (UTC). These measurements are **simultaneously present viewers**, not distinct people across a period, ordinary public video views, chat participation or completed paid transactions.

The study partitions broadcasts into under **120 minutes**, **120–240 minutes**, and above **240 minutes** for duration-related descriptive analysis. A broadcast lasting four hours does not prove that viewers watched four hours each. The public article reports higher and steadier sampled viewership on parts of weekends and afternoons and differences by stream length; those observations do not identify a universally best publishing time or the causal benefit of shorter videos.

## Comparability and practical limits

Only the selected two-month 2024 live window is observed. No ordinary recorded-on-demand comparator, Shorts cohort, country- and language-matched new-creator income panel, deduplicated viewers, per-user sessions or individual creator receipts exists in this dataset. A rise in sampled concurrent people within one stream cannot be turned into ad RPM, paying customer conversion, increased wages, or retention across videos.

The point of this addition is to supply empirical livestream attendance measurements for the existing live-format and timing workstream without inventing financial outcomes. A future comparison requires compatible streams matched for channel maturity, category, audience geography, observation period and program eligibility, and a separate mechanism for revenue.

Machine observation: [ytlive-attendance-observations-2026.json](ytlive-attendance-observations-2026.json). [Invariant audit](../../site/ytlive-attendance-audit.mjs) and [regression checks](../../tests/ytlive-attendance-audit.test.mjs).

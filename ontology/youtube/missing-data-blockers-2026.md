# YouTube research: unresolved empirical dependencies

Reviewed 25 October 2026. [Machine-readable blocker register](missing-data-blockers-2026.json) · [CI validator](../../scripts/missing-data-audit.mjs). These entries point to existing research fields whose actual values remain `null`, not new or invented work items.

| Existing question | Required evidence | Invalid shortcut |
| --- | --- | --- |
| [global_viewers](ontology/youtube/audience-population-crosswalk.json) | Deduplicated active people over a defined global monthly window | Ad reach and surveys are not world MAU |
| [active_creators](ontology/youtube/creator-activity-population-2026.json) | Dated uploader event cohort including vanished and zero-subscriber channels | Indexed channels and net video counts do not identify active human creators |
| [creator_profits](ontology/youtube/monthly-creator-cash-flow-protocol.json) | Consented receipts, expenses, all labor and zero earners | Official monetization rules cannot establish realized profit |
| [niche_concentration](ontology/youtube/video-concentration-2026.json) | Matched niche video census or weighted watch-time panel | Omdia platform-wide watch-time share is not niche competition |
| [multilingual_people](ontology/youtube/country-language-matrix-2026.json) | Representatively sampled consented joint viewer-country/language statistics | Video locale and viewing geography cannot infer personal language ability |
| [kids_contextual_rpm](ontology/youtube/child-directed-economics-2026.json) | Eligible made-for-kids creator statements and matched ad-view denominators | Ads not personalized does not mean ads forbidden or fixed loss |
| [true_completions](ontology/youtube/retention-observability.json) | Authorized retained video-age/format cohorts | Public views and average percentage are not full completion of people |
| [news_significance](ontology/youtube/us-news-reported-change-2026.json) | Compatible published survey-wave uncertainty and design comparisons | A one-point difference of rounded Pew estimates is not a tested decline |
| [rpm_distribution](ontology/youtube/niche-uncertainty-ranges-2026.json) | Matched eligible creator receipts and view measurements | User-entered interval calculations are not observed revenue |
| [subscriber_status](ontology/youtube/subscriber-status-reach-2026.json) | Authorized matched subscribedStatus video-event cohorts | Public subscriber totals cannot show viewing subscription state |
| [follower_migration](ontology/youtube/cross-platform-portability-2026.json) | Opt-in matched migration cohorts and consistent source/destination counts | Media copying or CSV export does not move native followers |
| [creator_exit](ontology/youtube/creator-inactivity-frames-2026.json) | True creator-start cohort with right censoring and repeat observations | Upload pauses and zero net count are not verified permanent exit |

Each linked source record is checked on every CI run. When any referenced field becomes observed, even if the value is **zero**, this register must be reconciled against the new evidence before the project can claim that the blocker is resolved. The 12 rows are **not** the complete count of missing data in the marketplace.

Missing observations often require independently published representative studies or appropriately consented owner records. Without those inputs, valid progress can still include methods, tests and honest measurement limitations. It must never include fabricated creator income, viewer demographics or niche forecasts.

No personal creator revenue, individual viewer records, account credentials or identifying children's data was collected for this document.
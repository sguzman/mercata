# Creator-owned equipment, video format, and production cost accounting

**Review date: October 24, 2026.** [Machine production-path register](video-production-cost-register.json), [pure accounting helper](../../site/video-production-cost-audit.mjs), and [synthetic regression tests](../../tests/video-production-cost-audit.test.mjs). No product purchases, payments or creator-hour observations were collected.

## Official production capability boundaries

[YouTube Shorts upload guidance](https://support.google.com/youtube/answer/12921536?hl=en) permits capture, editing and publishing from **an already owned compatible smartphone**, with no specialized purchased equipment required by this path. It is not labor-free, network-free or a guarantee every person owns a suitable phone.

[The standard player](https://support.google.com/youtube/answer/6375112?hl=en) adapts to vertical, square and horizontal aspect ratios; 16:9 is common for desktop. This changes framing/production decisions without establishing that vertical video always costs less to make. YouTube's [live-stream entry guide](https://support.google.com/youtube/answer/2474026?hl=en) offers mobile, webcam, console or encoder paths subject to channel verification and restrictions. [Encoder instructions](https://support.google.com/youtube/answer/2907883?hl=en) show capture, key management and preview steps. [Network guidance](https://support.google.com/youtube/answer/2853856?hl=en) recommends reserve upload headroom around **20%**, which is a planning recommendation, not a representative outage frequency or equipment requirement.

## Three accounting tiers without invented prices

**No new purchase.** Use compatible equipment already in possession. New camera spend can be **$0**, while electricity, licenses, storage, network/data and actual production hours can still be positive or unmeasured.

**Existing equipment allocation.** Capture asset cost, date and estimated useful life, then allocate depreciation or usage cost to production. Do not mistake an accounting allocation for money spent again on filming day.

**Optional upgrade.** Include only creator-verified actual purchases, licenses, subscriptions and contractor payments. A better camera/mic or hardware encoder is not a platform eligibility condition, and market prices vary by location/date.

Across all formats, capture research, shooting, writing, editing, thumbnails, distribution, rights clearance, community moderation and failed drafts. Store hours in time units, and receipts/net cash in money units and declared currency. Net cash can be calculated **only with actual confirmed receipts and costs**, and payout-per-hour requires nonzero logged hours. The included helper is arithmetic for authorized **input records**, not a prediction of actual YouTube earnings or currency FX.

## Unresolved acceptance gates

No representative source supplies median Shorts/horizontal/live creation costs, complete input invoices, actual labor records, local amortization, full production-failure rates, fair currency conversions or resulting net creator profit. Data remain null rather than substituting an attractive equipment-shopping estimate.

## Matched high-cost-format comparison with unfinished work included (October 25, 2026)

Mercata's [attempt-cost arithmetic](../../site/format-attempt-costs.mjs) now accepts **two explicitly matched format cohorts** in one documented country, currency, topic, creator-experience category and date window. The input consists of every **published or abandoned** production attempt, creator-paid cash, noncash allocation of already owned equipment, and ten non-overlapping personal work-stage hour totals. A separate paid contractor's invoice belongs in cash, not again in personal creator hours.

The output distinguishes cost and hours **per attempted project** from costs and hours **per published output**. If a group contains two attempts and just one completed video, its unfinished project's expenses and time still enter the cost per published video. If it has zero published outputs, the per-published denominator is **undefined** (`null`), never a fabricated zero.

The code rejects missing work-stage observations, duplicated attempt IDs, non-finalized items, unmatched periods and unsupported negative/unsafe counts. Its regression fixtures are **synthetic**. The output does not assert that animation is more expensive than filming, that paid gear is mandatory, that format caused the difference, or that any creator or niche earns a positive hourly wage.

To reach an empirical production-cost comparison, separately collect legitimately authorized matching creator cohorts including abandoned projects, independent price/currency records, complete personal work logs and nonrespondents. No real attempts were obtained in this revision.

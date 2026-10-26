# Matched long-form and Shorts ad economics: conditional model, not an earning forecast

**Research snapshot: 2026-10-25.** This [machine-readable format comparison](format-unit-economics-2026.json) joins already-reviewed primary [Watch Page partner revenue rules](https://support.google.com/youtube/answer/72902?hl=en), [Shorts Feed pool rules](https://support.google.com/youtube/answer/12504220?hl=en), and [mid-roll rules](https://support.google.com/youtube/answer/6175006?hl=en). It is not an observation of any creator's actual advertising revenue, hours or net profit.

| Boundary | Eligible long-form Watch Page | Eligible Shorts Feed |
| --- | --- | --- |
| Where ads are sold | Watch-page ad opportunities, including possible mid-rolls | Ads between Shorts in the feed |
| Contractual creator share | **55% of eligible net watch-page ad revenue** | **45% of the creator's country-allocated Creator Pool portion** |
| The indispensable monetary basis | An explicit **eligible net** contract base, *not advertiser grossRevenue* | A country's pool, and that creator's fraction of eligible creator **engaged views** in that country |
| Why public views do not suffice | A playback need not show an ad; gross CPM, ad impressions and eligible net differ | Shorts public playback starts are **not eligible engaged views** or a published pool size |
| Paid costs | Production, distribution, administrative and other attributed expenses still apply | Same independent cash expenses, potentially different production work |
| Labor | Research, script, production, publishing and iteration hours must be measured | Production, publishing, moderation and iteration hours must be measured |
| Net creator profit | **Unknown** without complete accounting and costs | **Unknown** without complete accounting and costs |

The official [mid-roll guidance](https://support.google.com/youtube/answer/6175006?hl=en) permits enabling mid-roll opportunities in eligible monetized videos **at least eight minutes long**, through manual, automatic, or combined slots. At **479 seconds** that particular ad format does not qualify; at **480 seconds** the duration gate can be met, provided channel, rights and monetization eligibility also hold. Neither 480 seconds nor a manually inserted break guarantees an ad will actually be served. **Videos under eight minutes can have other eligible watch-page ads**; the threshold is specific to mid-rolls.

## Reproducible conditional calculation

The [pure comparison evaluator](../../site/format-unit-economics.mjs) uses the existing [watch-page eligible-net calculator](../../site/watch-page-ad-accounting.mjs) and [country-pool Shorts calculator](../../site/shorts-pool-economics.mjs), which preserve each platform's separate contractual basis. Inputs are explicit hypothetical data for one month, currency, and creator production cohort, with disjoint direct cash costs and labor. It computes *conditional contractual share minus paid direct costs* and a related *per-work-hour diagnostic*. These values are not bank deposits, realized wages, or net accounting profit.

Where possible, owner-accessible reports would need to reconcile estimated video-format revenue against later finalized payments, with country allocation and rights/eligibility checks. A single YouTube report's **estimatedRevenue** may already include its ad and Premium components. Adding estimatedAdRevenue or another subcomponent to the total would double count. The evaluator does not accept estimatedRevenue as the eligible-net contract base and does not compare raw views, RPMs, or advertiser CPMs across formats.

The 2026 study intentionally excludes separately announced February 2027 targeted Shorts placements and monthly qualified-view gates. Comparing two modeled scenarios is **not** a causal test that publishing Shorts improves long-form performance. Actual creator income, shared overhead attribution, failure cases, workload distributions, tax liabilities and zero-earner rates require independent observed data.

[Regression tests](../../tests/format-unit-economics.test.mjs) include the 479/480-second boundary, month/currency mismatch, public-view denominator rejection, and missing work/cost inputs.

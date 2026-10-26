# Mercata

![Mercata accent swatch](assets/swatch.svg)

**A public atlas of online marketplaces and how people earn on them.**

Mercata researches the cost, demand, competition, access, discovery, fees, payouts, rights, earnings distributions and realistic earning strategies of online platforms. Its goal is clear economic understanding, not promotional income claims.

**26 marketplaces are now admitted as research specimens.** Their dossiers include 3,064 baseline research tasks across 437 work queues. **YouTube research is underway**, with 235 additional platform-specific tasks (399 YouTube tasks total). **itch.io research is underway** across its existing 244-task inventory. Other marketplace dossiers remain queued. YouTube's sourced policy and audience findings do not establish a representative total creator-income distribution. Most content-community population sizes remain unknown; a separate U.S. news-consumption survey has a defined, bounded population.

## Contents

- [Interactive website](index.html) — responsive research catalog with System, Light, and Dark themes.
- [Human ontology](ontology/README.md) and [machine ontology](ontology/ontology.json) — independent definitions and validation.
- [Gallery](gallery/README.md) and [machine index](gallery/index.json) — truthful specimen status.
- [Research pipeline](pipeline/README.md) — detailed task queues generated for each admitted marketplace.
- [Social and subculture research](pipeline/social.json) — nine extra workstreams for platforms with substantial public creator communities; [audience schema](ontology/audience.schema.json).
- [Roadmap](roadmap/README.md) — emoji milestones and evidence-backed percentage bars.
- [Constitution](CONSTITUTION.md) and [agent rules](AGENTS.md) — public content and quality policy.

## Research principles

Distinguish markets from individual opportunities, discovery from payment, gross receipts from profit, reported success stories from representative samples, and unknown values from zero. Claims need dated public sources with transparent populations, methods, and limitations. A platform's economic size does not establish what a new participant can expect to earn.

**Eleven specimens** have an additional social-audience profile that will study active populations, age, sex and gender, race or ethnicity where supported, countries, languages, survey-based political affiliation, and the size and overlap of communities such as beauty, feminine lifestyle, children's animation, memes, politics and gaming. It also tracks competing creators, attention, demand and content economics. The first YouTube study includes dated U.S. surveys and advertising-reach estimates for selected countries. Those are not demographic profiles of specific subcultures, and most population questions remain open.

Coverage may include games, literature, software, professional services, video, visual art, digital products and subscriptions. All 26 named initial specimens were admitted by explicit authorization; new admissions still require specific authorization.

## Running the site

The site uses plain HTML, CSS, JavaScript and public JSON with no dependencies. Serve the repository root as static files and visit its index page. Node.js 20+ is required only for the research maintenance scripts.

`node scripts/verify.mjs` checks local repository data.
`node --test tests/*.test.mjs` runs the color, intake, specimen and YouTube evidence tests. [GitHub Actions](.github/workflows/verify.yml) verifies syntax, ontology, catalog and tests on every push to `main`.

After separately authorized specimen intake:
`node scripts/intake.mjs --name "Example Market" --url "https://example.org" --domain "literature"`
This is a synthetic command example, not an admitted specimen.

Mercata is [published through GitHub Pages](https://sguzman.github.io/mercata/) by a dedicated [deployment workflow](.github/workflows/pages.yml). The [initial public endpoint verification](roadmap/pages-verification.md) is recorded; each later deployment has a separate workflow result.

## Visual identity

Project accent: **#D19A42**, a warm amber. Each specimen receives a separate persistent color selected for separation in OKLab perceptual space, with stored OKLCH coordinates and hexadecimal color. Color conveys identity, never a rating.

## Independence

Mercata follows [Tarium](https://github.com/sguzman/tarium) public-project conventions but is not automatically a member of its central registry. Explicit owner approval is required to register it. All essential ontology, gallery, data, site and tooling live here.

Licensed under the repository's [LICENSE](LICENSE).

## Prepared research inventories

- [YouTube study plan](plans/youtube.md) ([machine-readable tasks](plans/youtube.json)): 164 existing tasks and 235 additional YouTube-specific research questions, **399 tasks in all**, across 22 workstreams and four phases. Inventory creation is complete; initial source-backed research has begun. No marketplace account actions, paid experiments or commercial publishing have been performed.
- [itch.io study plan](plans/itch-io.md) ([machine-readable tasks](plans/itch-io.json)): 84 existing tasks and 160 additional itch.io-specific questions, **244 tasks total** across 13 workstreams and four phases. Official-source and bounded market research is underway; evidence-scored progress is now 82%.

The [YouTube ontology](ontology/youtube/README.md) contains an independent glossary, category taxonomy, official policy snapshots and measurement dictionary. Its public dossier now includes dated, linked primary-source claims; typical total creator earnings and most community populations are still unknown.

## YouTube: evidence-backed investigation

The [12 machine-checked evidence gaps](ontology/youtube/missing-data-blockers-2026.md) explain what remains empirically unknown about people, creators, profits, and niches while linking to exact unresolved source fields. Verification requires reviewing a blocker if its source changes.


The [public research metadata privacy guard](ontology/youtube/publication-privacy-gate-2026.md) now runs in repository verification, rejecting recognizeable secret signatures, email addresses, and disallowed individual-record keys in YouTube sources/claims without claiming complete privacy or legal clearance.


The [U.S. adult YouTube-news self-report series](ontology/youtube/us-news-reported-change-2026.md) computes published annual point differences from 2020–2026 without claiming statistically verified audience decline, channel revenue trends or causal political effects.


The [video attention concentration study](ontology/youtube/video-concentration-2026.md) distinguishes Omdia's published top-video watch-time estimate from unsupported creator-income, individual-viewer, or per-niche competition claims, and adds a tested sample-scoped top-share/HHI/Gini calculator.


The [seven-market country/language denominator audit](ontology/youtube/country-language-matrix-2026.md) preserves official late-2025 advertiser-reach source figures without assuming those counts reveal a creator's residence, video audio language, or the viewer population's primary or secondary languages.


The [conditional YouTube withholding calculation audit](ontology/youtube/tax-withholding-mechanics.md) applies source-defined U.S.-viewer versus worldwide income bases correctly and excludes personal tax outcomes, FX assumptions and double deductions from settled cash.


The [US/Mexico channel membership price-option audit](ontology/youtube/membership-price-options-mx-2026.md) records 25 allowed menus and compares older/newer local nominal prices without inventing paid channel tiers, transaction volume or creator earnings.


The [public comments literature correction](ontology/youtube/comment-source-reconciliation-2026.md) records a contradiction between a Cardiff abstract and the journal-formatted author's manuscript about prolific commenter toxicity, and preserves distinct 2025 political-channel and 2026 climate-video study denominators.


The [versioned YouTube topic taxonomy change protocol](ontology/youtube/taxonomy-drift-protocol-2026.md) describes split/merge/overlap conditions without assigning old source view events to unmeasured new topic or audience populations.


The [account/product identity study](ontology/youtube/product-account-population-graph-2026.md) distinguishes YouTube channels, Google accounts, managing delegates, Analytics, Google Ads and AdSense payouts from viewers and unique creator businesses.


The [four-country YouTube ad-planner reach comparison](ontology/youtube/country-planner-change-windows-2026.md) preserves the source-reported two 2025 change windows and explicitly disallows interpreting revisions in advertiser reach as changes in verified unique viewer populations.


The [purpose-specific evidence quality register](ontology/youtube/evidence-quality-scope-2026.md) distinguishes first-party rules, independent population surveys, commercial channel indexes, platform-commissioned consultation, peer-reviewed abstracts and individual self-logs; no universal numerical authority score is assigned.


[Video meme and short humor format taxonomy](ontology/youtube/meme-format-typology-2026.md) preserves source attribution and overlapping audience limits.


[2024–2026 niche upload-volume observations](ontology/youtube/niche-upload-volume-2024-2026.md) now record five first-party video count lower bounds without confusing uploads, creators and audiences.


The [public meme-reference graph protocol](ontology/youtube/public-meme-reference-graph-2026.md) accepts documented content edges without mistaking linked videos for unique-person movement or creator earnings.


[Language market longitudinal comparability](ontology/youtube/language-market-comparability-2026.md) now separates localized video feature support from country-based advertising reach and measured viewer demand.


[Video attention concentration: niche denominator and validated HHI/Gini](ontology/youtube/niche-attention-concentration-2026.md).


The [video, membership and product offer control study](ontology/youtube/offer-listing-controls-2026.md) separates ordinary video metadata from paid membership levels and external merchant Shopping catalogs, with no fabricated sales, creator prices or conversions.


The [falsifiable audience-needs study](ontology/youtube/viewer-need-hypotheses-2026.md) uses three dated public video/podcast observations solely to frame testable comparisons and stop rules; no audience demand, ranking, business return or actual experiment is presumed.


The [active-creator population index study](ontology/youtube/creator-activity-population-2026.md) separates vidIQ and CreatorDB channel stocks and positive net video-count cohorts from actual publishers, distinct people and earning creators, preserving their unmatched sampling frames.


The [creator income sensitivity-envelope study](ontology/youtube/niche-uncertainty-ranges-2026.md) extends the original scenario math with strictly bounded, explicitly provided assumptions, and never labels a hypothetical interval a calibrated earnings prediction, niche rank or empirical confidence interval.


The [subscriber versus non-subscriber attention measurement study](ontology/youtube/subscriber-status-reach-2026.md) distinguishes owner-only YouTube `subscribedStatus` events from public subscriber counts and referral sources, with executable validated-split arithmetic and no fabricated actual channel analytics.


The [2026 demographic intersection and nonresponse audit](ontology/youtube/demographic-cross-tab-availability-2026.md) preserves Pew subgroup rates, distinct survey frames and missing joint sample counts without multiplying marginal usage percentages or misusing the whole-sample confidence margin.


The [made-for-kids creator economics crosswalk](ontology/youtube/child-directed-economics-2026.md) classifies all sixteen recorded earning pathways by video, channel and external contracting restrictions, without treating child-directed animation as automatically ad-free or assigning fabricated profit rates.


The [2025–26 creator publishing-inactivity frame audit](ontology/youtube/creator-inactivity-frames-2026.md) separates large established-account activity, company channel upload silence, and below-1k-channel net video-count changes, with no invented creator-closure or profit statistics.


The [audience-versus-creator supply frame audit](ontology/youtube/channel-supply-topic-attention-2026.md) tests three published cross-source pairs and demonstrates why channel categories cannot be divided into mismatched title-filtered views, upload events or sample survey percentages to infer niche scarcity or profit.


The [video quality and workload evidence crosswalk](ontology/youtube/video-quality-production-crosswalk-2026.md) separates a 61-video work diary from three selected educational-video observation samples, without treating views, video duration, retention or logged labor as a universal quality or profit measure.


The [cross-platform creator-portability evidence](ontology/youtube/cross-platform-portability-2026.md) distinguishes YouTube and Twitch media exports, TikTok data requests and Vimeo OTT consent-aware customer CSVs, without claiming transferable follower relationships or measured switching profits.


The [2006–2027 platform and monetization chronology](ontology/youtube/monetization-history-2006-2027.md) tracks thirteen dated ownership, earning-product and program-eligibility events with source links, separated effective dates and unknown creator profit.


The [Pew virtual-worship survey crosswalk](ontology/youtube/virtual-worship-not-youtube-audience-2025.md) distinguishes U.S. adults reporting online-or-TV religious services from unmeasured YouTube-specific religious audiences and personal beliefs.


The [cross-language public community protocol](ontology/youtube/public-comment-language-protocol-2026.md) separates public comment/reply events, creator video metadata language and actual viewer language, requiring complete accessible pagination and aggregate-only privacy protections.


The [topic evidence coverage audit](ontology/youtube/topic-observation-coverage-2026.md) crosschecks 33 conceptual subcultures and 36 dated observations, distinguishing event counts, uploads, watch hours, selected survey samples and missing audience estimates.


The [neutral political/news content and event-window study](ontology/youtube/neutral-news-attention-protocol-2026.md) records Pew's 2026 U.S. regular YouTube news estimate and correct within-party denominators, plus source-backed YouTube/Google Trends measurement limits. It explicitly forbids inferring individual viewers' political beliefs or pretending a content taxonomy is an audience census.


The [watch-page ads gross-to-net accounting worksheet](ontology/youtube/watch-page-ad-accounting.md) verifies the contractual 55% share of **eligible net**, rather than gross advertiser revenue, and guards against double-counting owner analytics, CPM and non-guaranteed mid-roll slots.


The [podcast publication and rights routes](ontology/youtube/podcast-publication-routes-2026.md) separate direct video episode upload from country-eligible RSS static-image conversion, YouTube Music podcast background playback, promotional Shorts and rights/brand disclosures.


The [podcast viewing versus listening study](ontology/youtube/podcast-viewing-frames-2026.md) separates YouTube global active podcast viewers, living-room watch hours, Premium-only hours and Edison's US weekly video/audio behavior survey; none becomes a synthetic person count or creator payout.


The [Nielsen May/July/August 2026 TV-device viewing study](ontology/youtube/nielsen-us-tv-youtube-share-2026.md) records official U.S. television watch-time shares in source-defined age 2+ denominators, without mistaking television viewing for global unique people, phone use or creator income.


The [creator localization and accessibility feature comparison](ontology/youtube/creator-localization-access-2026.md) separates owner captions, fallible automatic speech recognition, translated metadata, manually dubbed audio, conditional automatic dubbing and viewer language preferences without inventing foreign-language audience demand or new payouts.


The [creator entry and feature-gate audit](ontology/youtube/creator-entry-gates-2026.md) now also separates typical YPP application review, 21-day rejection appeals, 30/90-day reapplication waits and appeal resolution from cash settlement, while distinguishing ordinary video publishing, intermediate phone verification, mobile livestream restrictions, Brazil's under-16 supervision rule, adult AdSense payees, conditional guardian payout routing and YPP earning approval, without inventing a total zero-cost creator business or a first-payment date.


The [opportunity and risk matrix](ontology/youtube/opportunity-risk-matrix.md) separates ten grounded eligibility, rights, payment and evidence-gap axes without manufacturing personal probabilities, financial losses or niche rankings.


The [16-pathway editable revenue-stack matrix](ontology/youtube/revenue-stack-accounting.md) now distinguishes AdSense-funded monetization, off-platform cash and contract-specific deals, with duplicate-payment tests and a corrected native Shopping-affiliate payment boundary.


The [fashion/beauty content taxonomy](ontology/youtube/fashion-lifestyle-content-signals-2026.md) groups GRWM, prom, sewing and other style formats with source-defined reporting dates while avoiding demographic or creator-income inferences from content interest.


The [small-channel discoverability evidence design](ontology/youtube/small-channel-discoverability-protocol.md) keeps public subscriber-index milestones apart from the owner-only impressions/CTR data required for genuine newcomer discovery comparisons.


The [video essay and documentary format study](ontology/youtube/video-essay-sample-observations-2024.md) distinguishes YouTube's 2024 video-essay view events from BFI's expert-selected works and their published runtimes, without turning these into average viewers, labor or income.


The [country-specific policy and creator earnings access study](ontology/youtube/country-policy-and-payout-crosswalk-2026.md) separates three official geographic program listings from account reporting currencies, actual feature approvals, payment-address options and video-specific rightsholder restrictions.


The [Content ID appeal procedure comparison](ontology/youtube/content-id-appeal-routes-2026.md) preserves distinct initial disputes, appeals, block escalations and copyright removal requests with official 30-day and seven-day response windows, without interpreting them as creator payments or proven violations.


The [Content ID revenue diversion protocol](ontology/youtube/content-id-revenue-dispute-audit.md) distinguishes geographic blocks, rightsholder claims, approved sharing and disputed advertising revenue held from the documented claim/dispute dates, without manufacturing creator profit or legal costs.


The [creator hourly-outcome partial-identification audit](ontology/youtube/hourly-income-accounting.md) adds worst-case quantile and zero-gross-share bounds for incomplete creator cohorts. It never imputes missing receipts, claims a typical creator wage or mistakes isolated income surveys for matched labor accounts.


The [public dossier source-link acceptance gate](ontology/youtube/gallery-evidence-acceptance.md) checks visible per-claim date/limits, registered clickable HTTPS source links, JSON navigation, browser source indicators, and explicit unknowns across desktop and mobile.


The [384-creator Adobe cross-platform AI video workflow survey](ontology/youtube/adobe-ai-production-survey-2026.md) records self-reported time-saving thresholds, weekly usage and spending intentions without treating them as independently measured labor, YouTube-only payouts, or causal productivity improvements.


The [61-video self-recorded production case](ontology/youtube/photography-production-time-diary-2025.md) records work hours per published photography video and workflow phase, while keeping uncompleted effort, creator receipts and representative hourly wages unknown.


The [monthly income volatility protocol](ontology/youtube/monthly-income-volatility-protocol.md) extends the verified YouTube cashbook to separate finalized credits, issued transfers, cleared cash, paid costs, and zero-payment months from creator zero earnings. Its arithmetic is tested without user financial records.


The [AIR 300-channel revenue concentration and monthly RPM synthesis](ontology/youtube/air-300-revenue-concentration-2026.md) adds observed nested top-decile ad revenue shares and calendar-month medians while recording that it reuses the same monetized channel cohort as AIR's July study.


The [evergreen tutorials and repeat-search protocol](ontology/youtube/evergreen-search-window-protocol.md) separates initial, middle and later age-matched owner video Search traffic from recent Studio Trends interest, without asserting observed passive income or absolute search volume.


The [original AIR 2025 viewer-country advertiser CPM sample](ontology/youtube/air-2025-viewer-cpm-countries.md) adds prices from more than 3,000 selected channels, correctly separated from creator revenue per view, residence income and purchasing power.


The [creator processing, refunds and affiliate settlement audit](ontology/youtube/creator-processing-settlement-2026.md) separates YouTube-paid card processing in fan funding from merchant Shopify commission reversals, and never counts pending/locked transactions as creator bank cash.


The [cross-country creator income comparison protocol](ontology/youtube/creator-country-income-comparability.md) distinguishes viewer-country attributed revenue, creator residence, payment currency and dated consumption purchasing power, with no fabricated country earnings or PPP rates.


The [YouTube meme visibility and trend-archive crosswalk](ontology/youtube/meme-trending-observability-2026.md) records a published 104-country historical curated Trending archive plus a distinct U.S. niche/fandom awareness survey without double-counting repeated videos or inventing audiences.


The [educational-video format evidence comparison](ontology/youtube/educational-video-format-cohorts-2026.md) adds three actual selected YouTube research cohorts and explicitly separates owner watch-time retention from public likes/views and unmeasured creator profit.


The [public community-Post sampling method](ontology/youtube/public-community-post-protocol.md) distinguishes eligible creator Posts, published video comments, and aggregate engagement counts without collecting commenter identities or inventing community membership sizes.


The [language and audience API crosswalk](ontology/youtube/language-audience-api-crosswalk-2026.md) distinguishes video metadata language, original audio, subtitles, localizations and owner-only viewer geography, with a reproducible sample counter and no false global language population.


The [bounded niche-pilot measurement protocol](ontology/youtube/niche-pilot-budget-protocol.md) includes cash and labor stop rules, abandoned attempts and an explicit owner-analytics evidence gate; no creator-success probabilities or costs are fabricated.


The [current live monetization product comparison](ontology/youtube/live-monetization-units-2026.md) distinguishes Commerce net receipts from Jewels/Rubies, updates horizontal livestream Gifts access and adds audited conditional revenue/eligibility calculations without inventing purchases or creator cash profits.


The [source-backed monthly creator cash-flow protocol](ontology/youtube/monthly-creator-cash-flow-protocol.md) includes an executable, fully explicit liquidity ledger that separates finalized YouTube account credits, issued payouts, delayed bank receipts, sponsorship/merchant receipts, refunds, expenses and production labor. No real creator financial records or earnings rates are presumed.


The [observed post-August 2026 engaged-view comparison](ontology/youtube/agentio-engaged-view-series-2026.md) registers 549M public and 330M engaged events from a selected 75k-video vendor cohort, contrasting measured data with an earlier 35.8k-video modeled projection and preserving metric breaks.


The [paid sponsorship integration cohort](ontology/youtube/agentio-sponsor-delivery-2026.md) reports actual selected long-tail views and clicks, repeat-partnership CTR/CVR ratios and advertiser CPM changes, while rejecting causal creator-income extrapolation and double-counted time windows.


The [YouTube Shopping conversion evidence crosswalk](ontology/youtube/shopping-funnel-evidence-2025.md) records transaction-ranked products, a dated Gen Z brand-discovery survey, and authorized merchant analytics metrics without inventing completed sales, creator payouts, or buyer conversion rates.


The [YTLive 2024 empirical attendance sample](ontology/youtube/ytlive-attendance-observations-2026.md) documents five-minute concurrency measurements across 12,156 selected streams and the distinction between simultaneous viewers, unique people and creator income.


The [peer-reviewed live chat culture study](ontology/youtube/live-chat-culture-observations-2025.md) records a 92,412-message selected 2025 observational model and platform display-filter caveats without profiling participants or inventing creator earnings.


The [1,923-channel VTuber Super Chat study](ontology/youtube/vtuber-superchat-cohort-2025.md) adds measured historical mean, median, zero-Super-Chat channels, income concentration and paying-chat-account fractions from a peer-reviewed cohort without mistaking these for average YouTube creator payouts.


The [playlist and series engagement measurement study](ontology/youtube/playlist-series-observability.md) distinguishes owner-video views, playlist-context playback, web-only depth indicators and unknown repeat visitor or buyer conversion rates.


The [native title and thumbnail A/B test study](ontology/youtube/native-packaging-ab-tests.md) documents YouTube's concurrent watch-time experiment, supported variants, restricted surfaces and outcome uncertainty without pretending that a channel experiment or verified buyer conversion was run.


The [global creator, artist and media payout study](ontology/youtube/platform-creator-payout-scale.md) records YouTube's first-party four-year payout headlines and overlapping music-industry payments, separating corporate transfers to media/rights holders from individual creator earnings and profits.


The [Alphabet SEC YouTube ad-revenue time series](ontology/youtube/alphabet-youtube-ads-sec-2026.md) adds publicly filed corporate annual and interim revenue figures with matched-period growth calculations and the separate strict 2025 ads-plus-subscriptions revenue bound above USD 60 billion, without mistaking them for creator earnings, viewership, or the distinct U.S. GDP contribution.


The [Oxford Economics 2026 YouTube creator-survey methodology](ontology/youtube/oxford-creator-impact-2026.md) registers original country response counts, source-defined creator/user populations, non-additive EU27 rows, 2024/2025 U.S. modeled-impact headlines without a fabricated growth rate, and the difference between GDP/FTE impacts and creator cash earnings. It does not infer median creator income or ordinary labor hours.


Mercata also has a [reproducible YouTube source-independence audit](ontology/youtube/source-provenance.md) that flags reused official document URLs and syndicated study data without confusing unknown publication dates with invalid sources.

An [ownership, delegation and continuity study](ontology/youtube/channel-ownership-continuity.md) explains which roles can manage a YouTube channel, the risk of destination deletion during transfers, and the limits of uploaded-video exports. General platform access does not establish legal transferability of a creator's business.

The research also tracks [monthly advertiser-policy revisions during 2026](ontology/youtube/advertiser-policy-history.md), including gaming and public-interest reporting. Eligibility changes are not presented as measured increases in creator income.

A [dated February 2027 YouTube Partner Program transition](ontology/youtube/ypp-transition-2027.md) preserves current 2026 qualifications alongside announced stricter requirements for new applicants and an ongoing Shorts product gate for existing members. Missing subscriber conditions and actual payouts are not inferred.

The [study-frame crosswalk](ontology/youtube/study-frame-crosswalk.md) explicitly prevents pooling Pew adults, YouTube/NRG's differently aged U.S. online participants, CreatorIQ cross-platform creators and AIR's monetized YouTube client channels. Population, sample size, question and time period must be compatible before combined inference.

The [race/ethnicity aggregate-use protocol](ontology/youtube/demographic-identity-uncertainty.md) records Pew's published U.S. adult survey group rates, including the Asian English-speaker restriction, while leaving religious affiliation unmeasured. It prohibits using public profiles to infer individuals' sensitive demographic identities.

The [2026 U.S. adult YouTube usage study](ontology/youtube/us-demographic-use-2026.md) adds Pew Research Center's source-specific income, education and urban/rural **ever-use rates**. It does not infer YouTube's viewer demographic composition or convert the survey-wide sampling error into subgroup errors.

Additional [topic-level activity evidence](ontology/youtube/topic-observations.json) separately records a global 2026 title-filtered upload count and June 2025 U.S. learning/how-to views. They must not be compared as popularity rankings, unique people or earnings.

The [child-audience and family-animation study](ontology/youtube/child-age-and-format-gates.md) distinguishes child-directed and mixed-audience requirements from family-friendly animation, adult age restrictions and separate aggregate child-survey age frames. It records privacy and engagement restrictions without collecting individual minors or inventing population counts or earnings impacts.

Barb's [UK television and smartphone screen study](ontology/youtube/screen-viewing-uk-2025.md) adds source-bounded Q2 2025 device viewing shares while keeping its at-home Wi-Fi observation frame separate from both globally mobile viewing and a restricted 200-channel TV panel. It provides no platform-wide person share or creator revenue by screen.

The [video-format and ad-inventory research](ontology/youtube/video-surfaces-economics.md) now distinguishes seven publication surfaces, the conditional eight-minute watch-page mid-roll gate, live-versus-replay accounting, and contradictory localized 2026 Shorts rights guidance. It does not infer an optimal video length, paid ad fill, or guaranteed replay returns.

The [selected monetized AIR RPM and livestream research](ontology/youtube/air-studio-benchmarks-2026.md) compares real Studio data for client channels but does not promote vendor sample medians to an all-newcomer income forecast. Only channels selected into the studies are measured; missing zero earners, production costs and the unknown overlap between reports remain explicit.

The [video attention and niche culture research](ontology/youtube/video-attention-culture-2026.md) preserves Omdia's 2025 video-stock/watch-time observations separately from YouTube/NRG's April 2026 U.S. online youth and adult-attitude surveys. These data do not establish niche populations, probabilities of income or mutually exclusive genre market shares.

The [2020–2025 NFL viewing research](ontology/youtube/nfl-view-seasonality-2026.md) contributes actual global same-topic view/upload growth endpoints and a 2025 offseason viewing share. Its intermediate annual data, unique fans, causal seasonal lift and creator income are not measured.

The [beauty/fashion title-query study](ontology/youtube/beauty-fashion-query-series.md) separately records GRWM, prom, Halloween, sewing and morning-routine observations. Units and title predicates differ, so it does not invent a cross-year audience growth or seasonal profitability curve.

The [animation and meme format-cycle research](ontology/youtube/animation-format-cycles.md) separates independently produced animation and remix examples from dated U.S. and Mexican fan-survey samples. Report publication dates are not treated as the years that audience questions were measured; an animation-audience growth rate remains unknown.

The [bounded Beauty–Gaming overlap study](ontology/youtube/beauty-gaming-overlap-2025.md) records one 2025 vendor panel, including its sample frame, 5% reported category overlap and missing matched-person denominator. It does not claim a representative national union or infer individual viewer traits.

The [YouTube operator and transaction-role map](ontology/youtube/operator-market-roles.md) identifies the service provider under the current official terms and distinguishes creators, ad buyers, rights holders, paying customers and payment accounts without inventing a single buyer/seller population.

The [viewer/person measurement study](ontology/youtube/viewer-person-metrics.md) distinguishes public channel views and subscribers from owner-only unique viewer estimates, including signed-out watching. Rolling 28-day channel audience and up-to-90-day unique-viewer estimates are not a global census; unrelated channels cannot be summed into an exact user population.

The [traffic-source concentration protocol](ontology/youtube/traffic-concentration.md) distinguishes owner-only Browse, suggested, Shorts, search, notifications and external attribution with explicit unit checks. No measured channel source mix or income exposure is assumed, and its diagnostic rejects partial source partitions.

Mercata's [third-party publication audit](ontology/youtube/publication-rights.md) now tests source metadata and rights-manifest fields separately from legal reuse permission. Automated metadata checks are not a substitute for reviewing copied images, long quotations, licensing and dataset rights; the latter remain explicitly uncleared.

The [gaming release-window study](ontology/youtube/gaming-release-events.md) keeps a 2017 Japanese game-release week and a 2023 global GTA VI pre-release trailer distinct, preserving observed view counts without claiming gaming-platform growth or creator income.

The [health and fitness research](ontology/youtube/health-fitness-content.md) distinguishes workout, wellness, clinical and commercial health content by official safety and discovery rules. All sector audience, creator and profit estimates remain unmeasured.

The [finance and business video subculture study](ontology/youtube/finance-content-taxonomy.md) distinguishes educational literacy from affiliate product comparisons, sponsored promotions, and stock-tip solicitations. Regulatory risks are source- and jurisdiction-bounded; no creator's legal status, niche audience or profit is inferred.

The [software and technology subculture study](ontology/youtube/technology-subcultures-2026.md) separates tutorials, troubleshooting, device reviews, repairs and desk aesthetics. Source-backed public views for broad U.S. learning content and global desk-title queries cannot be combined into a software-learner population or an earnings estimate.

The [creator-collaboration and fandom research](ontology/youtube/creator-collaboration-fandom-2026.md) documents Studio's up-to-ten invited collaborators and uploader-only native revenue, plus two age-scoped U.S. online fandom surveys. It does not claim verified collaboration income or causal cross-channel audience migration.

The [evergreen-versus-event horizon study](ontology/youtube/lifecycle-horizons.md) adds a reproducible 30-, 90- and 365-day publication-age design with strict censoring, source permissions and unit tests. It does not invent income for unmeasured videos or infer causal evergreen profitability.

The same [child video-genre research](ontology/youtube/teen-video-format-evidence.md) now includes original Australian YouTube-specific gender-by-genre survey rates for children aged 6–13, separately from UK video apps and U.S. teen platform use. Group differences never license individual-level profiling.

A [child and teen video-genre comparison](ontology/youtube/teen-video-format-evidence.md) now brings in Ofcom's May 2026 UK child survey and Pew's 2025 U.S. teen YouTube results. Cross-app format preferences, YouTube platform use and in-home watch hours retain separate denominators; the study does not estimate private minors' identities or format-specific viewer populations.

The [peer-reviewed comment participation comparison](ontology/youtube/comment-norms-evidence.md) adds two bounded studies of selected political and climate-change YouTube comments. It preserves commenter-versus-comment denominators, observational rather than causal associations, and a strict prohibition on individual profiling or political targeting.

The [creator safety and continuity study](ontology/youtube/creator-safety-continuity.md) now includes October 2026 security pauses, Google Account-first hacked-channel recovery, live-chat moderation, harassment reporting and privacy complaint pathways. These are dated official procedures, not inferred incident rates or guaranteed recovery outcomes.

A [declining-topic validation study](ontology/youtube/declining-content-evidence.md) prevents incomplete date windows, lower-bound view counts, mismatched content queries, or the August 2026 view-definition break from being advertised as proof that a niche is losing demand. No verified declining-topic population or revenue forecast has been measured.

The [interim YouTube marketplace dossier](ontology/youtube/research-synthesis-2026.md) summarizes seven sourced finding areas, evidence-quality tiers and five major open empirical gates. It states clearly that new-entrant median income, zero-earner share, creator net profit and unique global audience are still unknown.

A [seasonal-discovery evidence comparison](ontology/youtube/seasonal-discovery-comparison.md) separates an actual NFL offseason share from annual prom titles, partial-year Halloween views, game release-week events and annual UK child-viewing minutes. Different populations and windows do not support a universal seasonal lift or optimal posting month.

The [publishing-time and viewer-geography study](ontology/youtube/geographic-publishing-time.md) adds YouTube's 28-day owner-audience activity report, format-specific Live and Premiere scheduling, timezone and privacy limitations, and the platform's explicit warning that upload time is not known to improve long-term video performance. No universal best release hour is inferred.

A [2026 publishing cadence study](ontology/youtube/publishing-cadence-evidence.md) adds niche- and size-specific median upload counts with their quartile ranges, alongside a separate 10.2-million-channel analysis of upload-frequency and growth correlation. The studies do not establish causal growth benefits, a creator labor budget, or a universal uploading schedule.

The [source-bounded 2026 sponsorship category study](ontology/youtube/sponsor-category-evidence.md) compares long-form branded-read detections by video type without interpreting them as paid contracts, creator revenue or platform-wide sponsor demand. Two other commercial data sources are included with separate denominators and reporting periods.

The [children's viewing seasonality protocol](ontology/youtube/children-media-seasonality.md) distinguishes UK aggregate 2025 viewing-time benchmarks from unknown school-holiday, summer and winter effects. It forbids deriving seasonality from annual growth or collecting any child-level histories.

The [descriptive gender/community evidence study](ontology/youtube/gender-community-evidence.md) distinguishes owner-only logged-in demographic categories and privacy suppression from an age-bounded commercial Gaming/Beauty panel. It makes no inferences about individual identity or complete audience composition.

The [sponsorship and disclosure research](ontology/youtube/brand-disclosure-risk.md) distinguishes YouTube's branded-content declaration from U.S. FTC endorsement guidance, including the September 2026 rollout of refreshed labels and demographic-region controls. Platform disclosure tools are not a blanket legal safe harbor; non-U.S. requirements and typical sponsorship profits remain unmeasured.

A new [officially sourced tax-withholding study](ontology/youtube/tax-withholding-mechanics.md) distinguishes the U.S.-viewer base, missing-form worldwide deductions, and independent local tax liabilities. It does not infer an individual creator's tax status or rate.

The [country eligibility and payment reference](ontology/youtube/country-eligibility-payments.md) records sourced YPP listings, country-specific payment methods and account-currency thresholds for Mexico, the United States and the United Kingdom. It deliberately leaves individual approval and account currency unknown.

The [new-entrant income cohort protocol](ontology/youtube/newcomer-income-cohort.md) defines a population including creators who never monetize or earn anything. Its [aggregate acceptance audit](scripts/newcomer-income-audit.mjs) guards against survivor-only inference, missingness errors and public individual-level data. No representative YouTube newcomer earnings measurement has yet been obtained.

The [YouTube research ontology](ontology/youtube/README.md) currently covers creator and viewer populations, 33 overlapping content categories, global usage and upload statistics, detailed Analytics numerators and denominators, creator earnings samples and their limits, native earning products, country/payment requirements, and content-specific monetization restrictions. The interactive site includes a blank-input economic calculator. [Source-backed task progress](plans/youtube.json) is maintained separately from the completed admission and infrastructure tasks.

A [dated API sampling budget](ontology/youtube/public-api-sampling-budget.md) records distinct search and metadata quota buckets, approximate search totals, and a reproducible sampling workflow without creating credentials or performing a crawl.

A [historical public-view measurement bridge](ontology/youtube/view-definition-break.md) guards against comparing pre- and post-August-24-2026 first-frame view counts as equivalent active viewing or creator income. The website distinguishes public playback starts from engaged and qualifying views.

The dossier also differentiates [multilingual audio, automatic dubbing, captions and translated discovery](ontology/youtube/multilingual-distribution.md). Dated product examples are not assumed to provide a creator earnings increase, and language is kept distinct from a viewer's country or demographic identity.

New [country, device and audience-frequency observations](ontology/youtube/country-reach-devices.md) distinguish official UK screen-time series from Reuters Institute's multi-market survey. These inputs demonstrate geographic and denominator variation; they do not provide global YouTube user counts or niche profitability.

Three [cross-platform creator-income survey samples](ontology/youtube/cross-platform-income-surveys.md) are tracked as separately scoped evidence, including NeoReach, Creator Spotlight and CreatorIQ/Influencers.club. The research protects against double-counting syndicated publications and projecting mixed-platform respondent incomes onto all YouTube channels. None establishes a representative YouTube newcomer earnings distribution.

The [production effort comparison](ontology/youtube/production-effort-comparison.md) now maps six educational and entertainment content workflows to source-backed eligibility and rights constraints, with three matched study designs. It keeps creator hours, cash costs and comparative profits unmeasured, and includes work on abandoned content attempts in the research denominator.

The creator-economics work also includes a [production cost and labor-time taxonomy](ontology/youtube/production-costs.md) with separate cash, capital use, creator time and rights-adjustment accounting. As of October 2026, representative YouTube cost distributions remain unmeasured. Two separately bounded adjacent surveys (2025 podcasters and 2026 U.S. cross-platform creators) provide selected cash/hour response bins without supplying a YouTube creator median. The interactive site does not invent typical equipment budgets or hours.

A [peer-reviewed historical study of external links](ontology/youtube/historical-linking-study.md) now records marketplace and crowdfunding linking among 153,770 highly subscribed YouTube channels sampled in 2019. External links are not observed purchases or creator earnings; the original paper's modeled ad-income table is not used as a measured payout dataset.

A [source-backed comparison of adjacent video services](ontology/youtube/comparison-set.md) establishes research dimensions for Twitch, TikTok Creator Rewards and Vimeo OTT, while preserving their fundamentally different money and engagement units. This is **not** authorization to admit new marketplace specimens, and no cross-platform creator-income ranking is inferred.

The [October 2026 EU27 creator consultation](ontology/youtube/eu-creator-consultation-2026.md) records the reported grant, training, workspace and recommendation-discovery barriers among selected survey respondents, not a probability sample of European creators or a measured income distribution.

The [YouTube Promote cost and attribution analysis](ontology/youtube/promote-economics.md) separates paid advertiser spends and billable ad views from organic distribution and YPP-eligible follow-on viewing. It does not invent typical promotional budgets, causal subscriber lift, or profitability.

The [September 2026 platform-use evidence](ontology/youtube/retention-posts-memberships.md) now records YouTube's reported average daily Posts engagement and [first-half microdrama figures](ontology/youtube/video-surfaces-economics.md), while keeping player events, users, watch-time and TV-view growth separate.

The [creator Posts and membership-retention study](ontology/youtube/retention-posts-memberships.md) separates post impressions, returning-viewer classifications, paid member access, billing renewals and distinct people. The related dashboard does not claim post-attributed loyalty, unique repeat buyers or retention percentages without measured cohorts.

The current YouTube dossier also includes a [survey-based U.S. news audience profile](ontology/youtube/community-audience-studies.md), a carefully bounded [commercial creator competition sample](ontology/youtube/competition-observations.md), a [format-by-format earning and linking guide](ontology/youtube/content-formats.md), and a [viewer discovery and retention model](ontology/youtube/creator-growth.md). These sources have different denominators and are not combined into a fabricated average or ranking.

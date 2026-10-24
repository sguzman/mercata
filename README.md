# Mercata

![Mercata accent swatch](assets/swatch.svg)

**A public atlas of online marketplaces and how people earn on them.**

Mercata researches the cost, demand, competition, access, discovery, fees, payouts, rights, earnings distributions and realistic earning strategies of online platforms. Its goal is clear economic understanding, not promotional income claims.

**26 marketplaces are now admitted as research specimens.** Their dossiers include 3,064 baseline research tasks across 437 work queues. **YouTube research is underway**, with 235 additional platform-specific tasks (399 YouTube tasks total). Other marketplace dossiers remain queued. YouTube's sourced policy and audience findings do not establish a representative total creator-income distribution. Most content-community population sizes remain unknown; a separate U.S. news-consumption survey has a defined, bounded population.

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

The [YouTube ontology](ontology/youtube/README.md) contains an independent glossary, category taxonomy, official policy snapshots and measurement dictionary. Its public dossier now includes dated, linked primary-source claims; typical total creator earnings and most community populations are still unknown.

## YouTube: evidence-backed investigation

Mercata also has a [reproducible YouTube source-independence audit](ontology/youtube/source-provenance.md) that flags reused official document URLs and syndicated study data without confusing unknown publication dates with invalid sources.

An [ownership, delegation and continuity study](ontology/youtube/channel-ownership-continuity.md) explains which roles can manage a YouTube channel, the risk of destination deletion during transfers, and the limits of uploaded-video exports. General platform access does not establish legal transferability of a creator's business.

The research also tracks [monthly advertiser-policy revisions during 2026](ontology/youtube/advertiser-policy-history.md), including gaming and public-interest reporting. Eligibility changes are not presented as measured increases in creator income.

A [dated February 2027 YouTube Partner Program transition](ontology/youtube/ypp-transition-2027.md) preserves current 2026 qualifications alongside announced stricter requirements for new applicants and an ongoing Shorts product gate for existing members. Missing subscriber conditions and actual payouts are not inferred.

The [study-frame crosswalk](ontology/youtube/study-frame-crosswalk.md) explicitly prevents pooling Pew adults, YouTube/NRG's differently aged U.S. online participants, CreatorIQ cross-platform creators and AIR's monetized YouTube client channels. Population, sample size, question and time period must be compatible before combined inference.

The [2026 U.S. adult YouTube usage study](ontology/youtube/us-demographic-use-2026.md) adds Pew Research Center's source-specific income, education and urban/rural **ever-use rates**. It does not infer YouTube's viewer demographic composition or convert the survey-wide sampling error into subgroup errors.

Additional [topic-level activity evidence](ontology/youtube/topic-observations.json) separately records a global 2026 title-filtered upload count and June 2025 U.S. learning/how-to views. They must not be compared as popularity rankings, unique people or earnings.

The [child-audience and family-animation study](ontology/youtube/child-age-and-format-gates.md) distinguishes child-directed and mixed-audience requirements from family-friendly animation, adult age restrictions and separate aggregate child-survey age frames. It records privacy and engagement restrictions without collecting individual minors or inventing population counts or earnings impacts.

Barb's [UK television and smartphone screen study](ontology/youtube/screen-viewing-uk-2025.md) adds source-bounded Q2 2025 device viewing shares while keeping its at-home Wi-Fi observation frame separate from both globally mobile viewing and a restricted 200-channel TV panel. It provides no platform-wide person share or creator revenue by screen.

The [video-format and ad-inventory research](ontology/youtube/video-surfaces-economics.md) now distinguishes seven publication surfaces, the conditional eight-minute watch-page mid-roll gate, live-versus-replay accounting, and contradictory localized 2026 Shorts rights guidance. It does not infer an optimal video length, paid ad fill, or guaranteed replay returns.

The [selected monetized AIR RPM and livestream research](ontology/youtube/air-studio-benchmarks-2026.md) compares real Studio data for client channels but does not promote vendor sample medians to an all-newcomer income forecast. Only channels selected into the studies are measured; missing zero earners, production costs and the unknown overlap between reports remain explicit.

The [video attention and niche culture research](ontology/youtube/video-attention-culture-2026.md) preserves Omdia's 2025 video-stock/watch-time observations separately from YouTube/NRG's April 2026 U.S. online youth and adult-attitude surveys. These data do not establish niche populations, probabilities of income or mutually exclusive genre market shares.

The [viewer/person measurement study](ontology/youtube/viewer-person-metrics.md) distinguishes public channel views and subscribers from owner-only unique viewer estimates, including signed-out watching. Rolling 28-day channel audience and up-to-90-day unique-viewer estimates are not a global census; unrelated channels cannot be summed into an exact user population.

The [traffic-source concentration protocol](ontology/youtube/traffic-concentration.md) distinguishes owner-only Browse, suggested, Shorts, search, notifications and external attribution with explicit unit checks. No measured channel source mix or income exposure is assumed, and its diagnostic rejects partial source partitions.

Mercata's [third-party publication audit](ontology/youtube/publication-rights.md) now tests source metadata and rights-manifest fields separately from legal reuse permission. Automated metadata checks are not a substitute for reviewing copied images, long quotations, licensing and dataset rights; the latter remain explicitly uncleared.

The [software and technology subculture study](ontology/youtube/technology-subcultures-2026.md) separates tutorials, troubleshooting, device reviews, repairs and desk aesthetics. Source-backed public views for broad U.S. learning content and global desk-title queries cannot be combined into a software-learner population or an earnings estimate.

The [creator-collaboration and fandom research](ontology/youtube/creator-collaboration-fandom-2026.md) documents Studio's up-to-ten invited collaborators and uploader-only native revenue, plus two age-scoped U.S. online fandom surveys. It does not claim verified collaboration income or causal cross-channel audience migration.

The [creator safety and continuity study](ontology/youtube/creator-safety-continuity.md) now includes October 2026 security pauses, Google Account-first hacked-channel recovery, live-chat moderation, harassment reporting and privacy complaint pathways. These are dated official procedures, not inferred incident rates or guaranteed recovery outcomes.

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

The creator-economics work also includes a [production cost and labor-time taxonomy](ontology/youtube/production-costs.md) with separate cash, capital use, creator time and rights-adjustment accounting. As of October 2026, representative YouTube cost distributions remain unmeasured. Two separately bounded adjacent surveys (2025 podcasters and 2026 U.S. cross-platform creators) provide selected cash/hour response bins without supplying a YouTube creator median. The interactive site does not invent typical equipment budgets or hours.

A [peer-reviewed historical study of external links](ontology/youtube/historical-linking-study.md) now records marketplace and crowdfunding linking among 153,770 highly subscribed YouTube channels sampled in 2019. External links are not observed purchases or creator earnings; the original paper's modeled ad-income table is not used as a measured payout dataset.

A [source-backed comparison of adjacent video services](ontology/youtube/comparison-set.md) establishes research dimensions for Twitch, TikTok Creator Rewards and Vimeo OTT, while preserving their fundamentally different money and engagement units. This is **not** authorization to admit new marketplace specimens, and no cross-platform creator-income ranking is inferred.

The [October 2026 EU27 creator consultation](ontology/youtube/eu-creator-consultation-2026.md) records the reported grant, training, workspace and recommendation-discovery barriers among selected survey respondents, not a probability sample of European creators or a measured income distribution.

The [YouTube Promote cost and attribution analysis](ontology/youtube/promote-economics.md) separates paid advertiser spends and billable ad views from organic distribution and YPP-eligible follow-on viewing. It does not invent typical promotional budgets, causal subscriber lift, or profitability.

The [September 2026 platform-use evidence](ontology/youtube/retention-posts-memberships.md) now records YouTube's reported average daily Posts engagement and [first-half microdrama figures](ontology/youtube/video-surfaces-economics.md), while keeping player events, users, watch-time and TV-view growth separate.

The [creator Posts and membership-retention study](ontology/youtube/retention-posts-memberships.md) separates post impressions, returning-viewer classifications, paid member access, billing renewals and distinct people. The related dashboard does not claim post-attributed loyalty, unique repeat buyers or retention percentages without measured cohorts.

The current YouTube dossier also includes a [survey-based U.S. news audience profile](ontology/youtube/community-audience-studies.md), a carefully bounded [commercial creator competition sample](ontology/youtube/competition-observations.md), a [format-by-format earning and linking guide](ontology/youtube/content-formats.md), and a [viewer discovery and retention model](ontology/youtube/creator-growth.md). These sources have different denominators and are not combined into a fabricated average or ranking.

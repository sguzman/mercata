# Specimen processing

[Core task catalog](queues.json) · [Specialist tasks](domains.json)

Twenty-six approved marketplaces were admitted on 2026-10-23. Future admissions still require explicit authorization. Only the intake command for explicitly approved platforms may add a named platform. Admission generates a versioned, empty-data dossier, a gallery entry, a unique OKLab-based swatch and all 12 core task queues. It also adds the relevant specialist queue. **It does not collect facts, scrape a website, earn money or finish research.**

Each atomic task has an ID, emoji, acceptance criterion, weight, progress (initially 0), status and evidence references. Core queues include market definition, access, fees, demand, discovery, competition, income distribution, rights, conversion, risk, earning strategies and source verification. Specialist tasks cover games, literature, software, services, video, art, downloadable products and subscriptions.

A task may be impossible to answer with available data; describe the evidence gap. Do not report a missing earnings figure as zero or mark the research task complete merely because no source was found. A 100% completion claim must point to public acceptance evidence and be reviewed.

## Approved intake

After the owner names a platform:

`node scripts/intake.mjs --name "Example Market" --url "https://example.org" --domain "literature"`

The example is synthetic and has not been run. Domain choices: games, literature, software, services, video, art, digital-products, subscriptions and other. Repeated IDs fail rather than overwrite. Investigate public claims in later research, not during intake.

## Social audience and subculture profile

For platforms with substantial public social, entertainment or creator-community functions, add the independent `social_audience` profile. The [social task catalog](social.json) adds detailed queues for platform reach, age/gender/ethnicity/country distributions, voluntary survey-based political identity, subculture size and overlap, discovery, engagement, formats, revenue fit, trends, and safeguards.

Unlike ordinary domain specialists, this is a **cross-domain profile**: a video platform, community fiction publisher, or social portfolio site may qualify. The profile is assigned explicitly to admitted platforms; future video admissions receive it by default, and other domains require `--profile social_audience`.

See [audience ontology](../ontology/README.md). Public sources, surveys and platform analytics have different access and denominator limits. Community size figures must distinguish viewers from content impressions or channel counts; all missing measurements remain unknown.


## Existing Steam specimen: dedicated inventory

Steam was already admitted on October 23, 2026. The [Steam inventory](../plans/steam.md) preserves all 84 core and game-specialist baseline tasks and adds **209 Steam-specific questions** (293 total) covering Steamworks onboarding, paid release cohorts including zero earners, wishlists, Next Fest, game sales estimates versus merchant data, pricing, refunds, developer profit, rights, marketing and release labor. Steam research now has **62% task-weighted progress**, supported by official [entry and payout](../ontology/steam/entry-review-and-reporting-2026.md), [store discovery and wishlists](../ontology/steam/discovery-wishlists-and-visibility-2026.md), [historical revenue-share](../ontology/steam/revenue-share-tiers-2018-2026.md), and independent [release-catalog/selected long-tail](../ontology/steam/public-catalog-and-conditional-long-tail-2026.md) research. No new marketplace admission, seller account or commercial experiment occurred.

## Existing itch.io specimen: dedicated plan

The already-admitted itch.io game specimen preserves its 84 original tasks and adds 160 platform-specific research questions. The [itch.io plan](../plans/itch-io.md) is an unresearched inventory at 0%, not evidence of any game sales or income. No new marketplace was admitted.

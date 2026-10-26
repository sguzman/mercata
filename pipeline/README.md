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


## Existing itch.io specimen: dedicated plan

The already-admitted itch.io game specimen preserves its 84 original tasks and adds 160 platform-specific research questions. The [itch.io plan](../plans/itch-io.md) is an unresearched inventory at 0%, not evidence of any game sales or income. No new marketplace was admitted.

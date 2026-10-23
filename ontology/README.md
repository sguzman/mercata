# Mercata ontology

[Machine vocabulary](ontology.json) · [Dossier JSON Schema](specimen.schema.json)

A **marketplace** is a platform that connects supply to buyers or audiences. A platform can also be a publisher, audience channel, payment processor or contract broker; these roles are recorded independently. An **opportunity** is one specific route to earning and may combine several channels. A **specimen** is a named, admitted, versioned study of a platform, not a claim that it has been fully researched.

**Source** means a traceable public document or dataset. **Claim** means an individual assertion linked to one or more sources, publication or retrieval dates and limitations. **Observation** means a measured or reported value with an explicit population, unit, denominator, time period and method. **Market metric** defines what an observation measures. **Income distribution** records mean, median, percentiles and zero earners independently. **Trend** requires comparable observations over time. **Experiment** means a bounded test with inputs, effort and outcomes. **Queue** groups work; **task** is atomic, weighted work with a completion criterion.

## Semantic commitments

1. Missing measurements are unknown, not zero. An absent platform fee finding does not imply a free platform.
2. Mean and median differ. Income statistics must specify whether zero earners are included and which population is covered.
3. Gross sales, seller payout, profit and effective hourly earnings are different quantities.
4. Do not infer newcomers' likely earnings from successful outliers.
5. Fees, availability, payouts, rights and regional eligibility change over time; record observation dates and jurisdictions.
6. Classify evidence as official, independent, survey, anecdotal, estimated or modeled; describe sample bias and limitations.
7. Every published factual statement needs a reference to a public source, not just a copied number.
8. A generated queue is work to be done, not a completed investigation.

## IDs and versions

Use lowercase ASCII slugs joined with hyphens for specimens. Task IDs are made of their queue and task template IDs. Evidence, claims, experiments and measurements need stable identifiers. Preserve IDs and historical claims across updates. Version 1 of the ontology and specimen schema is the starting contract; breaking changes require a migration.

## Colors

Specimen color pairs contain an OKLCH coordinate and the corresponding sRGB hex value. New identities are chosen to maximize minimum Euclidean distance in OKLab space to existing specimen colors, within a bounded sRGB palette. Already assigned colors are stable. The display gamut and growing number of specimens limit how far colors can remain apart; uniqueness is enforced even where a large perceptual margin is impossible.

## Relationships

Marketplaces offer opportunities and impose fees, eligibility rules, rights, payouts and risks. Opportunities are tested by experiments. Sources support claims; claims support observations and interpretations. Observations define income distributions and trends. Each specimen owns research queues and tasks. The [pipeline](../pipeline/README.md) documents task acceptance.


## Social and community-platform analysis

Some marketplaces double as social networks, entertainment communities, or audience-led publishing venues. The `social_audience` research profile activates a separate set of [social research queues](../pipeline/social.json). This profile is independent of the marketplace's commercial domain; a fiction site can be studied as both a publishing marketplace and a social community.

The supporting [audience schema](audience.schema.json) separates:

- **Platform populations:** active users, registered accounts, ad reach, buyers, creators, views, watch time and countries. These are not interchangeable.
- **Demographic measurements:** age, sex, gender, race/ethnicity, countries, languages, income, education, political affiliation and other characteristics, only from legitimate aggregate sources.
- **Subcultures:** named overlapping groups or content verticals with definitions, aliases, parent relationships and multiple independent size estimates.
- **Overlaps:** intersections between communities. Size estimates cannot simply be added.
- **Formats and insights:** consumption patterns and commercial hypotheses, linked to dated, reproducible evidence.

A community's *size* must always identify its unit: distinct participants, viewers, followers, creators, channels, posts, total views or watch hours. A search result count is not a user census. Demographic characteristics cannot be assigned to individuals based on what they watch, how they look, or what they post. Aggregate political identity data, if collected, is descriptive rather than a basis for targeted political persuasion. Children’s content has separate data-access and audience-protection rules.

These entities are part of the version-1 ontology; the audience schema is initially empty for admitted platforms. No inferred community or demographic figures have been entered.

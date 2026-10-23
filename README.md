# Mercata

![Mercata accent swatch](assets/swatch.svg)

**A public atlas of online marketplaces and how people earn on them.**

Mercata researches the cost, demand, competition, access, discovery, fees, payouts, rights, earnings distributions and realistic earning strategies of online platforms. Its goal is clear economic understanding, not promotional income claims.

**26 marketplaces are now admitted as research specimens.** Their dossiers include 3,064 baseline research tasks across 437 work queues. **YouTube research is underway**, with 235 additional platform-specific tasks (399 YouTube tasks total). Other marketplace dossiers remain queued. YouTube's sourced policy and audience findings do not establish typical creator income or reliable community population sizes.

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

To publish through GitHub Pages select `main` and `/(root)` in Pages settings. A live Pages deployment must still be independently checked. Intended URL: https://sguzman.github.io/mercata/.

## Visual identity

Project accent: **#D19A42**, a warm amber. Each specimen receives a separate persistent color selected for separation in OKLab perceptual space, with stored OKLCH coordinates and hexadecimal color. Color conveys identity, never a rating.

## Independence

Mercata follows [Tarium](https://github.com/sguzman/tarium) public-project conventions but is not automatically a member of its central registry. Explicit owner approval is required to register it. All essential ontology, gallery, data, site and tooling live here.

Licensed under the repository's [LICENSE](LICENSE).

## Prepared research inventories

- [YouTube study plan](plans/youtube.md) ([machine-readable tasks](plans/youtube.json)): 164 existing tasks and 235 additional YouTube-specific research questions, **399 tasks in all**, across 22 workstreams and four phases. Inventory creation is complete; initial source-backed research has begun. No marketplace account actions, paid experiments or commercial publishing have been performed.

The [YouTube ontology](ontology/youtube/README.md) contains an independent glossary, category taxonomy, official policy snapshots and measurement dictionary. Its public dossier now includes dated, linked primary-source claims; earnings distributions and community sizes are still unknown.

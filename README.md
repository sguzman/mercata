# Mercata

![Mercata accent swatch](assets/swatch.svg)

**A public atlas of online marketplaces and how people earn on them.**

Mercata researches the cost, demand, competition, access, discovery, fees, payouts, rights, earnings distributions and realistic earning strategies of online platforms. Its goal is clear economic understanding, not promotional income claims.

The catalog starts intentionally empty. Marketplace admission and research begin only after explicit authorization.

## Contents

- [Interactive website](index.html) — responsive research catalog with System, Light, and Dark themes.
- [Human ontology](ontology/README.md) and [machine ontology](ontology/ontology.json) — independent definitions and validation.
- [Gallery](gallery/README.md) and [machine index](gallery/index.json) — truthful specimen status.
- [Research pipeline](pipeline/README.md) — detailed task queues generated for each admitted marketplace.
- [Roadmap](roadmap/README.md) — emoji milestones and evidence-backed percentage bars.
- [Constitution](CONSTITUTION.md) and [agent rules](AGENTS.md) — public content and quality policy.

## Research principles

Distinguish markets from individual opportunities, discovery from payment, gross receipts from profit, reported success stories from representative samples, and unknown values from zero. Claims need dated public sources with transparent populations, methods, and limitations. A platform's economic size does not establish what a new participant can expect to earn.

Coverage may include games, literature, software, professional services, video, visual art, digital products and subscriptions. No marketplace is preselected or automatically queued.

## Running the site

The site uses plain HTML, CSS, JavaScript and public JSON with no dependencies. Serve the repository root as static files and visit its index page. Node.js 20+ is required only for the research maintenance scripts.

`node scripts/verify.mjs` checks local repository data.
`node --test tests/*.test.mjs` runs the color and admission tests.

After separately authorized specimen intake:
`node scripts/intake.mjs --name "Example Market" --url "https://example.org" --domain "literature"`
This is a synthetic command example, not an admitted specimen.

To publish through GitHub Pages select `main` and `/(root)` in Pages settings. Committed files do not establish that Pages has been enabled. Intended URL: https://sguzman.github.io/mercata/.

## Visual identity

Project accent: **#D19A42**, a warm amber. Each specimen receives a separate persistent color selected for separation in OKLab perceptual space, with stored OKLCH coordinates and hexadecimal color. Color conveys identity, never a rating.

## Independence

Mercata follows [Tarium](https://github.com/sguzman/tarium) public-project conventions but is not automatically a member of its central registry. Explicit owner approval is required to register it. All essential ontology, gallery, data, site and tooling live here.

Licensed under the repository's [LICENSE](LICENSE).

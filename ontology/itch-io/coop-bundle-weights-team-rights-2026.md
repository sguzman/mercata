# Co-op bundle allocations are not individual game sales

Reviewed October 26, 2026. [Machine source and role contract](coop-bundle-weights-team-rights-2026.json) · [deterministic allocation helper](../../site/itch-coop-bundle-allocation.mjs).

The current [itch.io co-op bundle guide](https://itch.io/docs/creators/bundles) distinguishes the **host**, each participating project owner, and the buyer of one multi-project bundle. A host proposes a price and relative weighted split; each participant must approve. Once one participant approves, project membership, price, split and dates become locked unless pre-publication approvals are reset. The participants must qualify for **Collected by itch.io** payouts. A Direct to you connection cannot be treated as a multi-merchant split mechanism.

## Tested cents allocation

A hypothetical **$100.01 distributable pool** divided among three equal positive weights results in allocations of **$33.34, $33.34 and $33.33**. The deterministic helper gives remaining cents to tied participants by a stable ID order. All cents sum exactly; this is a rounding convention for research calculations, **not evidence of the operator's own payout rounding algorithm**.

The supplied pool is already assumed to be distributable after externally determined taxes, refunds, platform and payment processing deductions. Never allocate the *entire gross buyer payment* to each member. One bundle purchase may entitle the buyer to multiple projects, and claiming individual keys later is not a new game sale.

## Source-backed staffing categories for a comparable game sample

The **staffing task** uses three distinct units: game project, publisher/payee account and named contributing person. **Solo disclosed** means an attributable project record or author statement verifies one creator. **Team disclosed** means a source establishes a multi-person development team; a title merely naming several credits does not establish employee count or revenue shares. Unspecified roles, occasional collaborators, payment-recipient companies and jam/bundle participants remain **staffing unknown** rather than being assigned fabricated headcounts.

A single publisher may release many games, and one game may have many contributors, so estimates must avoid multiplying teams by their projects or dividing a paid bundle among individual developers. A 2018 team-administration article is historical evidence about account facilities, not proof of currently available permissions or automatic financial rights in 2026. The [structured staffing rules](coop-bundle-weights-team-rights-2026.json) intentionally leave actual solo/team market populations and income differences null. Any outcome comparison needs a bounded release cohort, source-confirmed staffing, matched prices, actual paid orders, refunds and labor.

## Separate team and publishing identities

A solo developer, several credited contributors, a publishing account owner, and a co-op bundle recipient are **different roles**. The [historical team-project discussion from 2018](https://itch.io/t/351041/team-projects) is not verified as the complete 2026 account-admin permission system. Neither a jam submission nor team membership automatically entitles each contributor to a percentage of project profits or transfer of the publishing account.

A valid seller-person census would require source-linked staffing and entity evidence; it cannot treat multi-game bundles or credit-page usernames as verified headcount. Actual payouts, contributing-developer income, transaction volumes, and account-transfer permissions remain unknown.

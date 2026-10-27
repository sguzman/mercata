# Co-op bundle allocations are not individual game sales

Reviewed October 26, 2026. [Machine source and role contract](coop-bundle-weights-team-rights-2026.json) · [deterministic allocation helper](../../site/itch-coop-bundle-allocation.mjs).

The current [itch.io co-op bundle guide](https://itch.io/docs/creators/bundles) distinguishes the **host**, each participating project owner, and the buyer of one multi-project bundle. A host proposes a price and relative weighted split; each participant must approve. Once one participant approves, project membership, price, split and dates become locked unless pre-publication approvals are reset. The participants must qualify for **Collected by itch.io** payouts. A Direct to you connection cannot be treated as a multi-merchant split mechanism.

## Tested cents allocation

A hypothetical **$100.01 distributable pool** divided among three equal positive weights results in allocations of **$33.34, $33.34 and $33.33**. The deterministic helper gives remaining cents to tied participants by a stable ID order. All cents sum exactly; this is a rounding convention for research calculations, **not evidence of the operator's own payout rounding algorithm**.

The supplied pool is already assumed to be distributable after externally determined taxes, refunds, platform and payment processing deductions. Never allocate the *entire gross buyer payment* to each member. One bundle purchase may entitle the buyer to multiple projects, and claiming individual keys later is not a new game sale.

## Separate team and publishing identities

A solo developer, several credited contributors, a publishing account owner, and a co-op bundle recipient are **different roles**. The [historical team-project discussion from 2018](https://itch.io/t/351041/team-projects) is not verified as the complete 2026 account-admin permission system. Neither a jam submission nor team membership automatically entitles each contributor to a percentage of project profits or transfer of the publishing account.

A valid seller-person census would require source-linked staffing and entity evidence; it cannot treat multi-game bundles or credit-page usernames as verified headcount. Actual payouts, contributing-developer income, transaction volumes, and account-transfer permissions remain unknown.

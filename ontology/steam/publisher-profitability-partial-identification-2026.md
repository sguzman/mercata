# Publisher profitability: missing-cost and nonresponse identification limits

**Reviewed October 28, 2026.** [Structured protocol](publisher-profitability-partial-identification-2026.json) · [synthetic profit-sign bound helper](../../site/steam-publisher-profit-bounds.mjs) · [unit tests](../../tests/steam-publisher-profit-bounds.test.mjs). No publisher bank statements or costs were collected.

## A game is not a legal publisher

The target for a **publisher profitability distribution** is an independently identifiable population of **unique legal publishing entities** across a predeclared period. One partner may publish multiple games; an AppID can change partners, and revenue may be split with external publishers or contracted developers. Counting games instead of payees creates artificial "independent publishers." Official [Steam reporting](https://partner.steamgames.com/doc/finance/payments_salesreporting) supplies financial information at a specific authorized legal partner's scope, not the complete expenses, owner labor or intercompany cost allocation required to define that entity's *economic* profit.

An after-cost *profit sign* requires authorized receipts, all relevant legal revenue splits and title transfers, development and support cash costs, overhead and valuation of uncompensated owner labor. A game's refund-adjusted sales, an author-described net revenue value, or a reported bank transfer can each be positive while the developer loses money economically. A publisher with no actual Steam sales may still incur costs and belong in the original eligibility population; excluding it creates survivorship bias.

## Sharp conditional fraction bounds, not invented profit dollars

[Partial-identification methods](https://www.sciencedirect.com/science/article/pii/S0888613X04001124) establish a simple logical bound. If an **independently complete** cohort has **N distinct publishers**, with **P** fully reconciled positive after-cost profits and **U** unresolved publisher outcomes, then:

- Minimum fraction profitable = P / N.
- Maximum fraction profitable = (P + U) / N.
- When the frame is incomplete, neither fraction is safely a population estimate.
- Positive includes strictly profitable publishers; **exact zero profit is not profitable**.

For a **completely synthetic five-publisher frame**, one positive, one negative, and three unknown gives a **20%–80% conditional range**. It is a *finite-population logical range*, not a survey confidence interval or a statement that 20% of real Steam developers profit. Under incomplete cost reporting, even nonnegative cash revenue cannot identify positive economic profit: missing wages, overhead, tax and transfers can change the sign. Unlike gross sales, signed profits are not bounded below at $0, so the earlier gross-sales median helper's nonnegative support cannot be reused.

The synthetic model accepts only redacted, invented publisher IDs and signs; a sign requires explicit attestations for contract rights, all costs, labor, finance and the common period. Partially observed records cannot be marked positive simply because one Steam title earned gross revenue. No dollar mean or median is constructed.

## What is still needed

A defensible study would need a full historical eligible legal publisher frame including unsuccessful and retired publishers, valid authorization and consent, de-duplicated publisher/game assignments, time-aligned publisher remittance ledgers, complete income and business-cost allocations, and published response-rate coverage. Such records are unavailable in this public research stage. **Typical independent Steam publisher economic profits, the probability that a first-time studio profits and their monetary median remain unknown.**

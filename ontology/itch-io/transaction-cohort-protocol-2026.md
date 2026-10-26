# itch.io — sales funnel and representative first-game cohort requirements

**Protocol as of October 26, 2026, not observed game earnings.** Machine contract: [transaction-cohort-protocol-2026.json](transaction-cohort-protocol-2026.json); executable aggregate-only calculator: [cohort-protocol.mjs](../../site/itch-cohort-protocol.mjs).

## Real checkout mechanics and why public data are insufficient

[Official buying guidance](https://itch.io/docs/creators/how-buying-works) identifies several checkout entrances: a game's project page, a purchase widget or a JavaScript purchase popup. Customers can adjust the amount above the minimum, tip, select paid extras or gift a purchase. A successful checkout provides a download-key URL and receipt. Buyers do **not** need an itch.io account, and one customer may access their files again later without buying them again.

Therefore store visitors, browser players, free demo downloaders, checkouts initiated, **settled paid orders**, refunds, unique paying individuals, keys issued, bundle claims and repeat downloads are different units. Public paid-listing counts cannot substitute for any of these purchase measures.

The [official API overview](https://itch.io/docs/api/overview) distinguishes account-key server-side queries, delegated OAuth and public RSS game listings. RSS can measure public releases or surfaced promotions but not confidential seller orders. Any private analytics would require explicit owner authorization; Mercata has **not** accessed seller credentials or account data.

## Define the population before measuring outcomes

The target is **first-time commercial game publishers**, with an eligible positive-price title launched in a defined window and subsequently followed for 30, 90 or 365 days. Include titles that sell zero units, become delisted, or are abandoned. Do not treat multiple games by one developer as independent sellers, or treat a developer team as one individual salary. Compare gross transactions, retained seller proceeds and costs independently.

A public creator success story, a ranked marketplace page or a game jam sample cannot establish the complete sampling frame. Until a representative authorized dataset with zero earners exists, Mercata's true itch.io-wide mean, median, zero-sale fraction and newcomers' success probability remain **unknown**.

## Pure aggregate-only safeguards

The calculator accepts a deliberately constrained summary report, never buyer information. It validates aligned scope and periods, revenue units, inclusion and authorization. It can describe a *fully covered consented sample* but returns **null** for population-wide results unless actual representative evidence exists. It also labels settled-orders-per-page-view as an **event ratio**, not the probability a person becomes a buyer. Synthetic unit-test values are **only test fixtures**, not empirical observations.

To make a representative seller-income estimate, the next research step would need publisher participation, sampling probability, a legitimate data-use basis and redaction; no automated process should impersonate accounts or infer private sales from public rankings.

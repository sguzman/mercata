# Time to first paid game sale: censor incomplete observations

Reviewed October 26, 2026. [Source-linked protocol](first-paid-sale-censoring-2026.json) · [deterministic analysis helper](../../site/itch-first-paid-sale-survival.mjs).

The project must identify the **first retained positive-price game purchase** from a legally authorized seller ledger, not a page view, follower, browser play, demo download or gifted key. [Publisher first-game setup](https://itch.io/docs/creators/getting-started) and [game payment rules](https://itch.io/docs/creators/payments) define those distinct events. Use the earliest qualifying **first commercial release** as time zero. Include eligible titles with no sales and later delisted titles wherever the cohort frame can observe them.

A new game has not necessarily completed a **30, 90 or 365 day** observation window. If its history ends after 10 days with no known payment, that title is *right-censored after day 10*, not counted as confirmed zero sales for a 365-day period. If a game is removed, distinguish no subsequent visibility or seller-account access from a verified no-sale outcome.

The helper computes per-day first-order events, the number of projects still at risk, same-day censoring (events before censors), and a **Kaplan-Meier estimate conditional on the supplied cohort**. It also reports a naive horizon zero-order fraction **only if all included projects have conclusive status at that horizon**; otherwise the fraction remains null.

## Synthetic test example — not empirical itch.io income

Four fabricated game projects have first retained orders on days 5 and 10, while one exits observation without an order on day 10 and another on day 20. The Kaplan-Meier survival curve is **0.75 at day 5** and **0.50 at day 10**. At day 10, two of the four projects have a *fully observed lack of paid order through that horizon*, but by day 30 the two prematurely censored projects' statuses are unknown and no naive 30-day no-sale fraction can be calculated. The conditional synthetic sample median event time is **10 days**.

Those are software test fixtures, **not actual sale rates, representative developer earnings, or reliable first-release waiting periods**. Real interpretation assumes censoring is independent of future sales; delisting or failure-related dropout may violate this assumption.

The real research still has **zero authorized observed game cohorts**. Actual first-sale timelines, median delay, paying-buyer counts, zero-sale shares, and publisher-profit outcomes remain unknown. No account logins, customer records or commercial tests were performed.

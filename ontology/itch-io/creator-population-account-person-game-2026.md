# Who counts as a game creator, publisher or actual paid seller?

Reviewed October 26, 2026. [Structured measurement ontology](creator-population-account-person-game-2026.json). This is an explicit description of **which entity should be counted**, not an estimate of how many commercial developers earn on itch.io.

The [creator FAQ](https://itch.io/docs/creators/faq) describes accounts maintaining game pages and reporting page activity, including downloads and purchases. The [creator onboarding guide](https://itch.io/docs/creators/getting-started) explains creating an individual page; one account can maintain more than one project. The [payment documentation](https://itch.io/docs/creators/payments) distinguishes the publisher's identity, direct-merchant setup and platform-collected payout recipient. A person who develops art or code on a team might not own the publishing account or receive the platform payout.

## Separate populations

| Research unit | Defensible inclusion criterion |
|---|---|
| Registered account | User has a platform account, whether or not anything was published |
| Public game listing | A game project page appears publicly at a defined snapshot |
| Publishing account | An account owns one or more pages, paid or free |
| Commercial offering | A specific project offers a mandatory positive-price game at a recorded date |
| Active publisher | A defined publisher account publishes or updates an eligible project in a stated 30/90/365-day period |
| **Actual paid seller** | A deduplicated seller or payout entity with completed and non-refunded paid-game orders in that same period |
| Human creator | A distinct individual who worked on the title, whether or not they collect its income |
| Team or collaboration | Multiple creators or accounts with some reported contributions or agreed economic rights |
| Bundle payout participant | An eligible money recipient with a documented bundle share, not a separate standalone game order |

The official [co-op bundle guide](https://itch.io/docs/creators/bundles) requires recipient-specific payout approval and recognizes participant accounts. The [server-side API](https://itch.io/docs/api/serverside) documents credentialed purchase verification but no public platform-wide list of actual paid publishers. Public title tags, project counts, follows, ratings, downloads and developer portfolio labels therefore **cannot** establish unique earners or distinct people. A single account can publish multiple games, several humans can build one game, and some projects can remain listed with zero orders. Developer teams and registered accounts are not interchangeable with the target **paid seller** unit.

## Appropriate target definition

For the fixed newcomer-income study, define one account/payout entity with its **first game offered at mandatory positive price**, then match its paid orders over 30, 90 and 365 days. Include accounts earning zero and titles later removed. Keep refunds, expenses, bundle allocations and development labor separately. This avoids the classic false denominator of dividing reported paid games by every game listing or every jam author.

**Result:** the population definitions and exclusions are now fully specified, while the **population sizes, active paid-seller count, representative earnings and paid buyer denominators remain unknown**. Source-linked public metadata alone does not make a seller census available; no restricted account or buyer API was accessed.

# Steam Playtest random grants, missing activations and demo notification boundaries

**Reviewed October 29, 2026.** [Machine-readable source audit](steam-limited-playtest-admission-activation-and-demo-notification-2026.json) · [tested arithmetic](../../site/steam-playtest-admission-bounds.mjs) · [tests](../../tests/steam-playtest-admission-bounds.test.mjs). Official public [Playtest](https://partner.steamgames.com/doc/features/playtest?l=english), [Demo](https://partner.steamgames.com/doc/store/application/demos?l=english), and [Wishlist](https://partner.steamgames.com/doc/marketing/wishlist) documentation; no private accounts or merchant reports.

## Limited Playtest admission is randomized among volunteers, not Steam customers

Valve's limited signup system draws grants randomly from the **self-selected pool of access requesters**, with optional country restrictions. Open signup instead automatically grants access. A separate developer-distributed Playtest-key route has its own nonrandom selection mechanism. Mixing key recipients, open signups and randomly selected limited signups would make a supposed controlled sample meaningless.

The stages **request → granted access → game activated → actual gameplay → eventual full-game purchase** have different denominators. Randomized granting need not mean anyone played, completed a survey, or made a purchase. Grant assignment could assist a carefully designed causal study **within consenting requesters**, if outcomes were actually observed for the admitted and eligible non-admitted groups. It cannot itself identify marketwide sales conversion.

## Missing activation bounds, from invented counts only

| Invented stage | Count |
| --- | ---: |
| Access requests | 1,000 |
| Randomly granted from limited signup | 300 |
| Among grantees, verified activated | 120 |
| Among grantees, verified not activated | 50 |
| Among grantees, status unknown | 130 |
| Not yet admitted | 700 |

Only **40.0% (120/300)** are confirmed activated. If every missing grantee did not activate, the rate is **40.0%**; if all 130 unknown did, the rate is **83.3% (250/300)**. These are deterministic bounds on the **synthetic grantee group**, not observations or confidence intervals for Steam. Requesters are volunteers, and neither fraction is a purchase-conversion rate.

The [pure function](../../site/steam-playtest-admission-bounds.mjs) rejects impossible overlapping counts and outside-key recipients. It produces **null** for actual purchases, revenue and causal sales uplift. Steam Playtest is free, cannot be sold or monetized with in-game transactions, uses a separate AppID, and does not add playtime to refund treatment or reviews for the paid base game.

## Demo pages and one-time notifications

A demo has its own AppID, optional independent store page and review space, and routes players back to the paid game's page. After demo release, Valve instructs publishers to **republish the base store page** for the Download Demo button to appear. Demo reviews, page views, download eligibility and free licenses are not paid checkout units.

A publisher may trigger **one** demo-launch wishlist notification within the **14 calendar days following its first playable release**. Other wishlist notifications have a per-AppID cooldown. Disabling and reenabling the demo does not restart this initial window. The synthetic helper checks calendar eligibility but **never promises message delivery or paid orders**.

## What would identify an actual upgrade rate?

A fixed original-paid-game release cohort, verified demo/Playtest association, clear eligible periods, complete grant and activation observations, legally authorized join across free and paid products, refund-adjusted merchant receipts, and documented nonresponse/selection are required. The actual conversion of demos and Playtests into purchases, the causal uplift of any rollout and after-cost publisher profits remain unknown. These are rules and measurement boundaries, not a launched experiment.

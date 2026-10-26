# itch.io — collected payouts, eligibility and low-value economics (October 2026)

**Source:** [itch.io official payment instructions](https://itch.io/docs/creators/payments), reviewed October 26, 2026. This is a study of rules, not individual seller tax advice.

A listing can be published for **no upfront fee**, but selling via the platform-collected payment route has separate costs. Its published rulebook lists a **one-time $3 USD tax identity verification fee** as an account adjustment, distinct from the standard percentage platform share and per-transaction processor fee. The guide also recommends **prices of roughly $2 or higher** because the typical $0.30 fixed transaction-processing component is disproportionately expensive for a $1 sale. These are policy and example cost assumptions, not proof of the average sale price.

## When a new game sale can be withdrawn

Collected seller receipts become eligible for payout **seven days after transaction**, and a payout request needs an **available balance of at least $5**, completed tax interview, selected payout method and fewer than three in-progress requests. Staff then require **at least seven further days** after requesting payout, typically reviewing within **10–14 days**, with possible longer delays for first-time sellers, fraud or other review. Even in a straightforward scenario, a seven-day hold followed by a seven-day review yields **at least 14 days after a sale** as a *conditional* earliest processing path; this does **not guarantee bank arrival or that an account will be approved**.

The minimum $5 qualifying balance **does not mean a $5 minimum bank transfer after adjustments**. A separate one-time $3 identity fee, bank/transfer charges, FX, refunds and chargeback adjustments may affect retained money. Actual personal withholding or final bank proceeds cannot be calculated from the documentation alone.

The operator advises roughly monthly payouts because more frequent requests may multiply transfer fees. Waiting beyond a year can separately expose unclaimed collected receipts to maintenance provisions. Neither recommendation should be converted into a universal optimal payout schedule without actual account-specific fees and liquidity needs.

The tested [pure eligibility evaluator](../../site/itch-collected-payout-check.mjs) checks only explicit thresholds. It deliberately returns **null** for final payment dates, transfer fees, actual approval and bank proceeds. It does not connect to itch.io or move money.

[Machine policy crosswalk](collected-payout-costs-2026.json). No seller account or tax identity records accessed.

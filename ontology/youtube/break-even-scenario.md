# Break-even planning without invented income

**Arithmetic method reviewed October 24, 2026.** [Machine assumptions](break-even-scenario.json) and the test-backed [calculator](../../site/scenario.mjs).

A viewer is not necessarily a buyer; a Short or regular-video view is not a transaction. YouTube channel memberships, Supers and *external* shopping checkout have different fees, consumer refund rules and payer relationships documented in the [checkout/refund study](checkout-refund-evidence.md).

For a creator's explicit assumptions, define gross order price *P*, refund fraction *r*, processor fee fraction *f*, processor fee per attempted order *a*, additional irrecoverable cost per refund *e*, and non-payment variable cost per attempted order *v*. **Modeled expected contribution per attempted order** is:

\[C=P(1-r)-Pf-a-re-v\]

No rate or price has a default. This formula assumes even refunded orders incur the entered processor fees; it is not an assertion about the actual merchant agreement. With fixed cash costs *F*, logged/assumed work hours *H*, and a chosen creator hourly compensation target *W*, **cash break-even order attempts** are \(\lceil F/C\rceil\), and **labor-compensated break-even attempts** are \(\lceil (F+HW)/C\rceil\), when C is positive. If C is nonpositive and the target is positive, no finite volume can break even under those input conditions. Zero required costs imply zero attempts needed for that zero target.

Do not apply this order-attempt formula to YouTube ad views, followers or unmeasured sponsorship deals; neither a click nor a membership follower count is a completed merchant order. Taxes, FX, shipping reimbursements, inventory spoilage, rebates and processor-specific rules require separate owner-specific input adjustments. The output is **hypothetical arithmetic**, not sampled sales, market demand or a forecast. Actual incomes and population averages remain null.

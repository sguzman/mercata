# Public Steam developer cash disclosures: portfolio and payout-denominator audit

**Reviewed October 28, 2026.** [Structured case register](public-developer-payout-and-portfolio-cases-2026.json). These are **public voluntary self-reports**, not merchant finance verification, a random sample or estimates of a representative Steam developer's profit.

## Two games and an approximately five-year cash waterfall

In an [October 7, 2026 developer post](https://www.reddit.com/r/gamedev/comments/1wzv6kr/how_560000_in_steam_gross_revenue_turns_into_just/), a co-founder described around **$560,000 gross Steam sales from two games** over roughly five years, with reported refunds of $134,000, a platform share near $127,000, U.S. withholding of $9,700, an additional regional publishing share around $115,000, and $26,000 in local taxes. The developer described a **50/50 co-founder split** and roughly **$73,000 personal take-home**.

If the published rounded dollar figures are subtracted literally, the result is **$148,300 before** and **$74,150 after** the founder split, $1,150 above the declared personal amount. The source uses approximate figures and potentially different reporting bases. The difference should be displayed as an **unreconciled rounding/basis gap**, not repaired by changing any source value. The report does not independently expose a complete game-level ledger, full development and support costs, partner contract or tax assessment. $73,000 is **not evidence of five-year after-labor economic profit**, even though the author calls it take-home money. One portfolio is not two independent publisher observations.

### Correction recorded from the author's own public comments

The author [later corrected the local-tax base](https://www.reddit.com/r/gamedev/comments/1wzv6kr/how_560000_in_steam_gross_revenue_turns_into_just/) from an earlier mistaken **$127,000** to approximately **$172,000** before the reported 15% local tax. On that corrected base, 15% yields **$25,800**, consistent with the published approximate **$26,000** deduction. However, subtracting every printed rounded upstream deduction from the declared $560,000 gross independently yields **$174,300** before local tax, which is **$2,300 above** the author's corrected intermediate base. The remaining gap is unresolved; the corrected local-tax step does not authenticate the underlying ledger or convert the claimed $73,000 personal outcome into observed deposited cash. Nothing in the author comments establishes a universal tax rate, refund rate or publisher split.

## Post-platform receipts for two games, but fees for four unreleased games

A [March 9, 2026 part-time developer budget post](https://www.reddit.com/r/gamedev/comments/1rpeymc/sharing_my_small_indie_dev_budget_parttime/) reports **$6,101 after Steam's cut**, **$4,611.90 in listed expenses**, **$477 in taxes**, and stated **$1,012.59 final profit**. Its itemized costs sum to $4,611.90, but subtracting reported costs and taxes from the rounded $6,101 returns **$1,012.10**, differing by $0.49. Exact underlying amounts were not published.

More importantly, in a follow-up the author distinguishes **revenue from two already released games** from **$400 in Steam application fees for four unreleased games**. Those costs may matter for *portfolio cash flow*, but including them in the profit calculation for just the two revenue-generating games would mix project and time populations. Excluding them without a consistent accrual policy would also be arbitrary. No labor-hours ledger or opportunity cost was provided.

## Low first-week revenue with hundreds of development hours

A [December 19, 2025 first-game postmortem](https://www.reddit.com/r/gamedev/comments/1pqxjxt/postmortem_first_solo_game_28_copies_sold_in/) reports **28 copies sold**, **three refunds**, and **$130 gross during the first seven days** after launch. The developer estimates **350–450 hours** over about 11 months, plus around **$90** in purchased art and audio assets. Subtracting only those reported assets from the **first-week gross** leaves **$40 before any Steam share, payment and tax effects, other expenses or labor valuation**. This is a conditional arithmetic remainder, not a payout, profit, hourly wage or forecast.

It also is not a zero-sales example: the source explicitly reports paid copies. One week of results cannot establish later sales or long-tail income. Comparing this single title to the two portfolio posts requires preserving their different dates, product counts, gross/net bases and cost accounting.

## What these accounts actually establish

A publicly disclosed developer waterfall can illustrate **where a gross figure may cease to represent money retained by a person** and can expose the importance of refunds, tax treatment, contractual publishing terms and multi-game allocation. These individual tax and platform figures are **not generally applicable rates**. The three posts have different game counts, dates, cash categories, and denominators; they must not be pooled or averaged into a "typical indie" statistic.

Selection into public postmortems is voluntary and likely related to which experiences developers choose to publicize. Neither the earnings of unsuccessful nonrespondents nor the exact number of no-sale games is observed. Therefore **Steam-wide actual publisher median, zero-sales proportion, after-cost developer profit and hourly return remain unknown**. A complete fixed eligible-game cohort with authorized and comparable financial and cost records is still required.

**Verification scope:** The [case audit tests](../../tests/steam-public-payout-cases.test.mjs) check provenance IDs, cash-flow arithmetic, case-unit mismatches and unknown-field gates. The tests **do not** authenticate any operator's actual financial data.

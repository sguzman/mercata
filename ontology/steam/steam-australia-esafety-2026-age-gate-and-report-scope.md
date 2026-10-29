# Australia: 2026 Steam online-safety review and R18+ store age-verification scope

**Reviewed October 29, 2026.** [Machine-readable source audit](steam-australia-esafety-2026-age-gate-and-report-scope.json) · [time-and-jurisdiction guard](../../site/steam-au-esafety-age-gate-guards.mjs) · [regression tests](../../tests/steam-au-esafety-age-gate.test.mjs).

The Australian [eSafety Commissioner's October 2026 transparency report summary](https://www.esafety.gov.au/industry/basic-online-safety-expectations/online-game-and-gaming-adjacent-services), [October 2 announcement](https://www.esafety.gov.au/newsroom/media-releases/gaming-giants-urged-to-level-up-child-safety-measures) and [age-restricted content-code guidance](https://www.esafety.gov.au/industry/codes/faq-access-to-online-porn-and-other-adult-content) contain important **Australia-specific** findings about Steam and Steam Chat. They do not provide a publisher earnings panel or proof of a specific game ban.

## Observation window versus regulatory effective date

| Timeline | Observation or requirement | Do not infer |
| --- | --- | --- |
| **October 1, 2025–March 31, 2026** | The period reviewed by the non-periodic online-gaming transparency notices later sent on **April 1, 2026** | Current ongoing practices after the report window |
| **October 2, 2026** | eSafety publishes its findings drawn from provider responses | A court ruling that Valve violated a specific law, or a Steam game-rejection rate |
| **September 9, 2026** | Australia’s app-distribution provisions begin requiring prevention of R18+ downloads and purchases by Australian children; eSafety reports that Valve started credit-card verification for R18+ game access in Australia | An identical global rule, a ban on adult R18+ purchases, an observed checkout success rate, or revenue impact |

The code effective date predates publication of the report, yet follows the **2025–March 2026 underlying observation period**. A public publication date is not the date when all described practices occurred.

## Regulatory findings: distinct service surfaces

eSafety reports that, during the reviewed period, Valve reviewed games before publication to detect unlawful material but relied on **user reports to detect such material in already-published games**. The regulator also reported no hash-matching tools on Steam or Steam Chat, and no proactive text or voice chat harm detection on Steam Chat beyond a URL-scanning capability primarily aimed at scams. Its report separately describes shortcomings in cross-industry signal sharing and re-registration checks. These are findings from compulsory provider responses, **not a general count of Steam publisher account bans**.

The regulator also describes self-declared ages in Steam and Steam Chat during that earlier period, and says Valve did not collect other age-related information then. That historical observation must be qualified by the subsequently reported September 2026 Australian R18+ credit-card check. The report addresses platform safety measures including user chats; it does not establish whether a given game developer's contractual publisher account was suspended or financially penalized.

## Economic and legal measurement limits

A child-specific Australian R18+ age gate may change access conditions for a narrow product class. But the source contains **no counterfactual or game-level checkout funnel**, no comparison cohort and no bank remittance histories. Therefore its effect on adult conversions, lost purchases, Steam revenue, or profit is **unknown**. It would be incorrect to use these regulatory observations as a percentage of affected games, rate of publisher bans, or general likelihood that Steam will withhold a developer payout.

The [deterministic audit](../../site/steam-au-esafety-age-gate-guards.mjs) returns the documented Australian R18+ effective-window flag only for a date within the known source period, and preserves `null` for every individual, sales, age-eligibility and enforcement outcome. For other jurisdictions, ratings and unverified dates, it refuses to extrapolate. No private identities, children’s records, Steamworks accounts, transaction data, or confidential enforcement cases were accessed or reproduced.

**Scope:** Australia and the source’s specific 2025–2026 observation and implementation dates. This public research is not legal advice or evidence of Steam-wide commercial suspension frequency.

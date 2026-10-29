# Steam first-release wait conflict, legal identity and overlapping approval clocks

**Rechecked October 29, 2026.** [Structured dated observations](steam-first-release-source-conflict-and-concurrent-approval-gates-2026.json) · [synthetic gate comparison](../../site/steam-firstrelease-conflict-guards.mjs) · [tests](../../tests/steam-firstrelease-conflict-guards.test.mjs). No merchant or Steamworks partner data was accessed.

## A current official-documentation conflict, not a measured 21-day rule change

On October 29, 2026, Valve's [Steam Direct public enrollment landing page](https://partner.steamgames.com/steamdirect) displayed **30 calendar days** from app-fee payment to an initial release, while its [English Steamworks Onboarding guide](https://partner.steamgames.com/doc/gettingstarted/onboarding?l=english) displayed **21 calendar days**. Both were accessible in English on the same date.

The earlier [October 28 recheck](current-first-release-wait-recheck-2026.md) recorded **30 days on both pages** after an earlier observed 21-versus-30 conflict. Preserve that as a dated historic observation; it is not safe to assume the discrepancy has permanently disappeared. No complete revision history, cache provenance or authenticated partner gating was obtained. **The enforceable waiting rule for an individual partner is unknown.** A conservative launch plan can reserve 30 days, but cannot claim an officially resolved universal minimum.

## Independent release gates, some parallel and some sequential

| Gate | Published condition | What it does not establish |
| --- | --- | --- |
| Identity and contracting | Real legal entity with publishing rights, valid name-matched bank details, tax records, NDA and distribution paperwork | That an unspecified minor can sign, or that onboarding is automatically accepted |
| App fee | USD 100 product deposit and first-release wait **21 / 30 days in conflicting public pages** | A guaranteed release date, developer profit or expense reimbursement |
| Coming Soon | Public store page for **at least 14 calendar days** | A compulsory extra 14 days *after* the entire app-fee waiting period |
| Store review | Submit **before build review**, typical **3–5 business days**, recommend **at least 7 business days** lead | A fixed labor-hour workload, firm service deadline or approval probability |
| Build review | Near-final supported-OS game build, typical **3–5 business days**, recommend **at least 7 business days** lead | That submitting both review stages simultaneously is permitted |
| Final release | Store and build approved, Coming Soon elapsed; permissions to publish changes and manage prices; partner manually presses release | Automatic publication once the calendar dates pass |

Sources: [Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding?l=english), [Coming Soon](https://partner.steamgames.com/doc/store/coming_soon?l=english), [Review Process](https://partner.steamgames.com/doc/store/review_process?l=english), and [Release Process](https://partner.steamgames.com/doc/store/releasing?l=english).

The broad [Steam Direct landing](https://partner.steamgames.com/steamdirect) advertises a **1–5 day** review, while the dedicated detailed review guide describes **3–5 business days** for store and build checks plus the seven-business-day submission recommendation. Likewise the [English Onboarding page](https://partner.steamgames.com/doc/gettingstarted/onboarding?l=english) says tax validation may take **up to 30 days**, whereas the [FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?language=english) describes **2–7 business days**. These sources use different units and scopes. Neither provides a guaranteed personal timeline.

## Synthetic calendar test, not Steam eligibility

Suppose an entirely fictitious game:

- app fee paid **November 1, 2026**;
- store review submitted November 12 and approved **November 14**;
- Coming Soon first public on **November 15**;
- build review submitted November 19 and approved **November 27**.

The separate Coming Soon clock finishes **November 29**. Under the Onboarding **21-day** text, the latest available date-based prerequisite is November 29. Under Steam Direct's **30-day** text, it is **December 1**. This conditional two-day difference is precisely why a one-source floor can overstate certainty.

The tested [date-only helper](../../site/steam-firstrelease-conflict-guards.mjs) validates real calendar dates and required review sequence, computes both candidate scenarios, and **always returns null for a guaranteed release date, measured developer hours, paid orders and profit**.

## Legal and economic unknowns

Onboarding as a sole proprietor is publicly documented, but individual signatory capacity still depends on legal authority, applicable law and an agreement not inspected here. The source pages do **not** establish a universal minor-publisher minimum age. All documentation reading was source-only; no legal entity, account, game, personal identification, NDA or actual Steam distribution agreement was submitted or accessed.

There is no measurable first-release employee-hour workload, review approval probability, time to first sale, median developer income or zero-order game rate in these public timing policies. A credible estimate would require permissioned, anonymized multi-publisher stage timestamps and realistic labor logs before commercial outcome modeling.

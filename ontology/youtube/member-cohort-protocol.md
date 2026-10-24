# Paid membership cohorts and repeat-offer tests on YouTube

**Reviewed October 24, 2026.** [Machine-readable research plan](member-cohort-protocol.json) and [audited, hypothetical cohort arithmetic](../../site/member-renewal-audit.mjs). No individual member records or paid renewal outcomes were collected.

## Creator Studio metrics are not the same denominator

YouTube [Memberships Analytics](https://support.google.com/youtube/answer/7491256?hl=en) reports **Total Members**, which includes canceled members with remaining perk access, and **Active Members**, which excludes canceled subscriptions. Members Canceled is not the same as Members Lost when perk access expires; transaction totals include both new signup and recurrence payments. Membership billing can follow actual months of **28, 30 or 31 days**. A rolling 28-day viewer audience is a different measure and cannot be silently substituted for a billing cohort.

[Membership levels and trial guidance](https://support.google.com/youtube/answer/7544492?hl=en) describes trials; free trial and gift activity must be separated from independently paid renewals. [Membership cancellation/refund rules](https://support.google.com/youtube/answer/12016111?hl=en) preserve cancellation and refund differences. A member who cancels today can retain perks until period end; a renewal payment refunded later is a separate cash accounting question.

## Required renewal cohort

1. Obtain permission and aggregate records without publishing personal identities. Fix a channel, original paid cohort and country/tier/billing regime.
2. Observe **actual next billing due dates** and classify each eligible renewal: paid renewal, not renewed, or still unresolved.
3. Record free trials, gifts and first-time signups separately. Do not add them to the denominator for previously paid renewals.
4. Calculate a paid-renewal fraction only if all due renewals are resolved. If missing outcomes exist, report **lower/upper arithmetic bounds**; never silently assume missing outcomes renewed or churned.
5. Reconcile refund and payout adjustments separately before using renewals in net profit or an effective labor-hour rate.

The calculator rejects unlicensed/unknown input origin, impossible count partitions, fractional persons, undated windows and a mismatched billing basis. Examples in tests are explicitly synthetic and never presented as observations.

## Prespecify the paid offer experiment

Compare an unchanged baseline offer with a modest, documented creator-defined perk change. Before launching, specify eligible audience, device/country payment path, displayed price, creator labor and cash cost, privacy safeguards, billing renewal horizon, minimum worthwhile net return and stopping conditions. Select a valid comparison strategy and record confounders such as new videos, promotion and seasonality. The existence of a favorable before/after ratio does **not** identify a causal treatment effect.

Unknown: representative paid-member cohorts, conversion from trials, true renewal/churn rates, average subscriber willingness to pay, refunds, incremental profit and effects on creator work hours. This is a **research protocol**; no real member sample, launch or revenue has been claimed.

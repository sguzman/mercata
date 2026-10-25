# Premium viewer subscription allocations and creator economics

Source snapshot: October 25, 2026. Primary references:
- https://support.google.com/youtube/answer/6306276?hl=en
- https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/
- https://developers.google.com/youtube/analytics/metrics

## Currently applicable Premium rules
YouTube Premium member fees are subscriptions to the YouTube service. They are **not** channel memberships sold by an individual creator. An eligible long-form channel must accept the Watch Page Monetization Module and enable watch-page ads. Eligible Shorts use the Shorts Monetization Module. The current Premium explanation bases creator allocation on eligible **member viewing**, with downloaded playback counted after the member next connects online and background playback counting toward watch time. No guaranteed creator revenue per Premium view is published.

The owner-authorized metrics redViews, estimatedRedMinutesWatched and estimatedRedPartnerRevenue mean Premium member view events, Premium member minutes and estimated creator Premium revenue, respectively. None is a number of distinct people paying for Premium, verified bank income or a universal Premium viewer RPM. Estimated Premium revenue may already be part of the total estimatedRevenue metric.

## Announced February 1, 2027 pools are future policy
YouTube announced two independent pools: 30% of Premium net subscription revenue and 60% of Premium Lite net subscription revenue. After member-watch/view based allocation to eligible creators, the relevant format share is 55% for long-form and 45% for Shorts. Future Shorts allocation has a rolling 10 million qualified Shorts views in 90 days gate; **this is not automatically October 2026 policy**.

A single subscriber fee cannot produce an individual creator payout without the pool's net revenue basis, member distribution, geography, eligibility and the creator's own allocated fraction. A company-wide Premium revenue headline is not the number paid to ordinary creators.

## Reproducible hypothetical accounting
The [pure conditional evaluator](../../site/premium-allocation-boundaries.mjs) accepts only an explicit future period and **hypothetical user-supplied** net subscription amount, creator allocated fraction, source pool, format and eligibility. It never populates actual creator revenue or bank receipts. The [tests](../../tests/premium-allocation-boundaries.test.mjs) reject 2026 application of future terms, absent allocation fractions, invalid formats and mistaken Shorts qualification.

Machine rules: [premium-allocation-boundaries.json](premium-allocation-boundaries.json). No private account, subscriber, audience or payout data was accessed.

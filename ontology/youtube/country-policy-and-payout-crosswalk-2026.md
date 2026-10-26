# Geographic policy and payout crosswalk: Mexico, U.S. and U.K.

**Checked:** 2026-10-25. This study cross-references Mercata's already registered official [YPP country list](https://support.google.com/youtube/answer/7101720?hl=en), [expanded YPP countries](https://support.google.com/youtube/troubleshooter/13536952?hl=en), [AdSense for YouTube payment methods](https://support.google.com/youtube/answer/14728152?hl=en), [account-currency thresholds](https://support.google.com/youtube/answer/14727140?hl=en) and [Content ID geographic policies](https://support.google.com/youtube/answer/2797370?hl=en).

The reference covers only **three jurisdictions** previously documented by Mercata on October 23, 2026. The following are *availability-list observations*, **not** actual accounts or creator approval outcomes.

| Payment-address country | Standard YPP geography listed | Expanded YPP geography listed | EFT | Wire | Hyperwallet | Cheque |
|---|---|---|---|---|---|---|
| Mexico | Yes | Yes | Listed | Listed | Not listed | Not listed |
| United States | Yes | Yes | Listed | Not listed | Listed | Not listed |
| United Kingdom | Yes | Yes | Listed | Listed | Not listed | Not listed |

## Account currency is not country

Google's separate reporting-currency examples document minimum payment thresholds of **MXN 1,200**, **USD 100** and **GBP 60**, only for accounts that actually report in those currencies. The country in which an individual lives does **not** prove that account's reporting currency, actual bank method, tax rate or foreign-exchange fee. A country comparison that maps `Mexico → MXN`, `U.S. → USD`, or `U.K. → GBP` without inspecting the account is invalid.

The checker therefore accepts an explicit ISO account currency as a **separate input**; without one, it returns an unknown threshold. Eligibility on a country sign-up list, a currency threshold, and a deposited payout are three separate claims.

## Content and rights restrictions are yet another dimension

YouTube [Content ID](https://support.google.com/youtube/answer/2797370?hl=en) can **block, track or monetize** a particular matched upload with actions varying by the rightsholder's geographic settings. None of this study's three country-level records contains an actual video and rightsholder claim, so there is **no established per-country blocked-video rate or loss in creator pay**.

[Made-for-kids rules](https://support.google.com/youtube/answer/9527654?hl=en) restrict interactive and some advertising/commerce functionality under a different content classification framework; without a verified video's audience designation and local legal context, one cannot assign a numerical regional penalty or assume all animation is child-directed.

No real person's payments, bank details, taxes, private analytics or rights claims have been accessed or included.

[Machine comparison](country-policy-and-payout-crosswalk-2026.json) · [Invariant validator](../../site/country-policy-crosswalk-audit.mjs) · [Regression tests](../../tests/country-policy-crosswalk-audit.test.mjs).

## Territory-specific video unavailability: three independent mechanisms

Official YouTube documentation distinguishes **video-owner licensing choices**, **platform restrictions under local laws**, and **copyright claimant rules**. In [Video isn't available in my country/region](https://support.google.com/youtube/answer/92571?hl=en), YouTube identifies uploader licensing restrictions and legal compliance blocks as two different reasons a viewer cannot access a video in a particular country. Neither implies that the video's creator or viewer lives in an ineligible YPP country.

[Content ID](https://support.google.com/youtube/answer/2797370?hl=en) can result in claimed material being **blocked, monetized or tracked** differently across regions. The narrower [claimed-music help page](https://support.google.com/youtube/answer/6364458?hl=en) specifies that the copyright holder may monetize claimed music (sometimes allowing a share to the uploader), **block worldwide**, or **block in specified countries/regions**. A video may also be muted; music policies may later change. Monetize is not proof of any particular creator's share or unconditional availability.

These rules apply to **viewer-country/video-specific rights**, whereas YPP country listings refer to **creator enrollment**, and account-currency payment thresholds refer to **account settlement**. The country row for Mexico, the United States or the United Kingdom cannot tell whether any specific music, film excerpt or video is available in that place. For the three documented reference countries the actual blocked-video counts, rights claims, viewer geography, local legal cases and settled royalty amounts are all **unobserved**. No privacy-sensitive data, bank accounts, creator credentials, or uploaded copyrighted media were used.

The [machine record](country-policy-and-payout-crosswalk-2026.json) enumerates mechanisms and explicit missing values. It does not label a copyright claim as a strike or offer methods for bypassing a geographic restriction.

## Dated example: Russia new YPP signup notice (2022, still published 2026)

The official [YouTube Partner Program availability list](https://support.google.com/youtube/answer/7101720?hl=en), reviewed **October 25, 2026**, continues to display a **March 10, 2022** notice. It states that suspension of Google advertising systems and new Russian AdSense account creation means creators **located in Russia cannot complete new YPP sign-ups**. This is a dated published product enrollment restriction, not evidence that every existing Russian creator's monetization ended on that date or that all YouTube content is inaccessible within the country.

Mercata records the policy's **country code RU**, the original notice date, the review date, the affected onboarding action, and the named official source. **Existing channel monetization, actual creator payouts, individual account circumstances, local-law conclusions, and whether a particular video is blocked in Russia remain unknown**. The country-level onboarding notice does not alter the separate MX/US/GB payment-method table, and is not a claimant Content ID restriction.


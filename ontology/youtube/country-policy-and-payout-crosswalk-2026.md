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

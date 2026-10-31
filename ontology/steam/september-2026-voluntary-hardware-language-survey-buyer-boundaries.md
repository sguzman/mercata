# September 2026 Steam Hardware Survey: participant OS and language, not buyer segments

**Recorded October 30, 2026.** [Structured snapshot](september-2026-voluntary-hardware-language-survey-buyer-boundaries.json) · [public-composition guard](../../site/steam-hardware-survey-segmentation-guard.mjs) · [tests](../../tests/steam-hardware-survey-segmentation-guard.test.mjs). This is a dated first-party survey source, not an observed paid-game cohort or a demographic profile.

## Official scope, period and participant composition

Valve's [Steam Hardware & Software Survey](https://store.steampowered.com/hwsurvey/hw/) identifies its currently presented results as **September 2026** and says participation is **optional and anonymous**. The survey is about software/hardware characteristics among responding Steam customers. The public summary does not disclose the number of responding people, their sampling probabilities, an audited unique-payer subset or a matched country-level transaction population.

The **combined-platform** OS totals displayed for that month are **95.03% Windows**, **3.05% Linux** and **1.92% macOS**. These three high-level categories sum to **100.00%** at the displayed precision. They should not be added a second time to Windows 11, SteamOS, Arch, CachyOS or other *nested OS-version and distro* rows. Percentages from a Windows-only or Linux-only survey view have a different within-platform denominator and are not interchangeable with the combined view.

Among the **selected language rows** from the same survey: **English 34.20%**, **Simplified Chinese 31.39%**, **Russian 9.05%**, **Japanese 2.41%**, and **Spanish — Latin America 0.75%**. These are client-language choices observed in the survey, not residence, nationality, purchase currency, tax residency, buyer gender, Steam game orders, or distinct store-country purchase accounts. Other languages appear in the complete original survey; the five entries transcribed here are an explicit *subset*, not a fabricated full-language census.

Valve's [Steamworks localization guide](https://partner.steamgames.com/doc/store/localization?language=english) independently distinguishes storefront translation from in-game localization and cautions against equating **language and geography**. A language's survey share can inform a *hypothesis* about localization priorities; it does not reveal a specific game's accessible buyers, the return on translation or the effect of language support on orders.

## Four denominator boundaries

1. **Voluntary survey percentage versus platform population.** Unknown response probability, respondent count and account sampling mean that a displayed participant share is not automatically an audited share of all monthly active Steam accounts.
2. **Survey participants versus paying customers.** Owning/using Steam is not proof of buying a paid game in September. Do not multiply Linux's 3.05%, for example, by the separate undated **over-132-million monthly active users** claim and publish a count of Linux purchasers.
3. **Client language versus store-country checkout.** Users may speak multiple languages, travel or hold accounts in another region; neither location nor regional payment eligibility follows from a survey interface-language label.
4. **Platform hardware versus game's sales and creator receipts.** Even a correctly measured OS mix does not establish what share of purchases a game earned on each OS, whether it passed Steam Deck compatibility review, publisher bank income or developer profit.

The [aggregate-only validator](../../site/steam-hardware-survey-segmentation-guard.mjs) checks month, combined-platform membership, the sum of the OS platform percentages, and that selected language shares do not exceed the all-response denominator. It rejects unexpected user/account/geographic fields, incompatible per-OS selection scopes and erroneous subtotal aggregation; all paid-buyer and economic outputs stay **null**.

The accompanying [platform reach audit](steam-public-monthly-reach-versus-buying-customers-2026.md) remains distinct because that first-party marketing page does not identify its underlying user-count month or a verified paid-game buyer population. Neither source is sufficient to infer a regional purchaser population or publisher proceeds.

**Remaining gaps:** verified purchaser and payee denominators by store country and OS, platform participant sampling design, individual developer cash receipts, the first-paid-game cohort frame, and actual causal revenue effects of localization.

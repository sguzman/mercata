# Minimum incremental purchase creator entry: publishing is not earning

**Reviewed:** 2026-10-25. Official sources: [Create a channel](https://support.google.com/youtube/answer/1646861?hl=en), [Upload a video](https://support.google.com/youtube/answer/57407?hl=en), [Features and verification](https://support.google.com/youtube/answer/9890437?hl=en), [Phone verification](https://support.google.com/youtube/answer/171664?hl=en), [Intermediate/advanced access](https://support.google.com/youtube/answer/9891124?hl=en), [General live requirements](https://support.google.com/youtube/answer/2474026?hl=en), [Mobile live requirements](https://support.google.com/youtube/answer/9228390?hl=en), and [YPP](https://support.google.com/youtube/answer/72851?hl=en).

## Separate the seven permission gates

| Action | Official prerequisite | What it does not mean |
|---|---|---|
| Create channel | Google Account; creation permitted, including supervision constraints | Being eligible for YPP |
| Publish standard video | Channel with standard publishing features, suitable original content and upload capability | Verified views, earnings or a bank transfer |
| Upload over 15 minutes / set custom thumbnail | Phone verification for intermediate features | Advanced tools automatically granted |
| Stream by webcam/encoder | Verified channel, at least 16 years of age, no live restriction within 90 days; live enabled | Mobile live enabled without other conditions |
| Stream on mobile | Same baseline live conditions, plus at least **50 subscribers** and compatible OS | Under 1,000 subscribers, unrestricted mobile audience; mobile archives may default private |
| Use advanced creator tools | Phone verification plus sufficient channel history or eligible ID/video verification | Guaranteed instant verification or approval for payment |
| Monetize under YPP | Feature-specific current thresholds, channel review and acceptance, monetization module terms, account and payout setup | A guaranteed earning amount or date |

Live activation can take **up to 24 hours**. A mobile livestream between **50 and 999 subscribers** can face audience limits, and those limits may take weeks to clear after reaching 1,000. Ordinary uploads do **not** require 50 subscribers merely because mobile live streaming does. YouTube may restrict supervised accounts. The official channel setup instructions do not require purchasing a paid YouTube license, new camera, advertising campaign or editing subscription for ordinary publishing.

## How to model a genuine no-new-purchase pilot

A possible first pilot uses an already-owned suitable device, an authorized Google Account, content the creator has the right to publish and an available network connection. This only avoids **incremental equipment purchases**. It does not eliminate internet access charges, electricity, labor, content-rights obligations, existing-device depreciation, uploading failures, moderation, or opportunity cost.

For reproducibility, record the exact month, jurisdiction, owned versus newly purchased gear, actual cash paid, internet/network usage, hours spent (including abandoned attempts), and the distinction between a created channel, an uploaded file and a *publicly published* video. Never assign unknown costs a fabricated zero. Nothing in the public Help Center describes a representative real-world creator startup price or income.

## Minor creators, livestream age, adult payees and country-specific supervision

Three separate and **non-interchangeable** official restrictions require a country- and role-aware audit:

- **Channel access in Brazil:** [YouTube's supervised teen policy](https://support.google.com/youtube/answer/15253498?hl=en) says Brazilian users **under 16** must have parental supervision to create or maintain a channel. It does not supply a global age-of-channel-creation table, so local ages outside Brazil remain unknown here.
- **Livestreaming:** [YouTube's livestream entry page](https://support.google.com/youtube/answer/2474026?hl=en) sets a minimum livestreaming age of **16**, independently of channel supervision, mobile subscriber floors and content moderation.
- **Receiving AdSense for YouTube cash:** [YouTube](https://support.google.com/youtube/answer/2533300?hl=en) and [Google AdSense](https://support.google.com/adsense/answer/14230?hl=en) require the **direct AdSense payee to be at least 18**. An under-18 creator can monetize only through a separately approved adult parent/guardian's AdSense for YouTube account, assuming all other YPP conditions are met. That adult, **not the minor**, receives the payment.

The [age-route validator](../../site/creator-entry-gates.mjs) checks these three distinct ages and roles, returns an *unknown* outcome when a local age or account authorization is unspecified, and never treats a guardian account as automatic channel approval. It does not collect private documents.

## Eligibility, timelines, and privacy

Standard publication, long videos, mobile livestreaming, advanced features and paid YPP each require their own evaluation. Livestream conditions differ from monetization conditions. YPP subscriber/watch-hour/Shorts thresholds and regional features can change; treat the platform's contemporaneous approval record as authoritative, not a planned creator scenario.

The [explicit-state gate evaluator](../../site/creator-entry-gates.mjs) intentionally treats unknown account status as **unknown** rather than an implicit refusal or approval. It never asks for a password, identity document, phone number, bank details or private channel records. The official guidance does not provide an externally verifiable personal approval time or guaranteed creator profit.

[Machine rules](creator-entry-gates-2026.json) · [Regression tests](../../tests/creator-entry-gates.test.mjs).

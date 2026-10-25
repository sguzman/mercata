# Shopping behavior: transactions, discovery and merchant funnel units

**Reviewed:** 2026-10-24. Primary sources: [YouTube's 2025 Shopping Trends disclosure](https://blog.youtube/culture-and-trends/tr25-youtube-shopping-report/) and [Google Merchant Center's YouTube affiliate analytics definitions](https://support.google.com/merchants/answer/14947975?hl=en).

## Real observations that must not be pooled

YouTube's October 2025 shopping study examined the **5,000 most-purchased tagged products in January–June 2025** and **1,000 videos ranked by tagged-product transactions** within a separate 60-day 2025 window. These are **ranked selections**, *not* totals of five thousand purchase events or one thousand distinct converted buyers. The underlying volumes for the complete product universe and any creator cash margin are not disclosed.

Separately, a **Google/SmithGeiger April 2025 survey of 500 U.S. online Gen Z respondents aged 14–24** found **61% agreed that YouTube helped them discover brands or products previously unfamiliar to them**. Agreement with brand *discovery* is not a completed sale, a product purchase rate, or a survey of all U.S. adults. These samples cannot be divided into one another to calculate conversion.

## What real merchants are allowed to measure

Google Merchant Center's private YouTube affiliate dashboard offers:

| Metric | What it actually measures |
|---|---|
| Gross Sales | Sales attributed to the program, pending **and** approved |
| Net Sales | Sales after returns, which may still include pending transactions |
| Commissions | Creator-affiliate commission and possible flat-fee/guarantee hybrid payment entries, pending and approved |
| Tagged-video Views | Views on content with eligible tags, not individual buyers |
| Product-tag Impressions | Displays of product tags, not clicks |
| Merchant Clicks | Clicks to a merchant's store, not distinct paid customers |
| Orders | Order events, including pending and approved, not verified final settled orders or distinct customers |

Traffic can be classified as organic affiliate or paid advertising. Low-volume views/clicks may be hidden or aggregated for privacy. These are **merchant-authorized**, not public whole-platform statistics. Google prohibits attempts to re-identify viewers, combining these data with outside person-level data, and reverse-inference of sensitive health, political or religious traits.

## Buyer intent versus casual viewing

The research framework separates (1) survey-reported discovery, (2) product-tag exposure, (3) store clicks, (4) provisional orders, (5) verified settled sales and (6) creator profit after fees, returns, taxes and labor. Only compatible window-, product-, channel- and approval-status-aligned values can support the relevant comparisons. No merchant account was connected, no creator profit was observed, and there is **no verified public conversion rate** for the shopping ecosystem.

[Machine frames](shopping-funnel-evidence-2025.json) · [Validator](../../site/shopping-funnel-audit.mjs) · [Regression suite](../../tests/shopping-funnel-audit.test.mjs).

## Research, shopping advice and intent: distinct surveyed frames

Google's [August 2025 summary of Kantar's Future of Video study](https://business.google.com/us/think/search-and-video/video-first-content-marketing-strategy/) reports **2,160 U.S. weekly video viewers aged 18–64**, surveyed **January 28–February 10, 2025**. It reports that **69% preferred a video to learn a new skill**, **70%** to learn how to build something and **63%** to learn how to cook. These responses concern video compared with text or audio, **not YouTube sales**. The article also reports respondents' agreement that YouTube offers the best instructional content (**91%**), product reviews (**81%**) and unboxing content (**76%**), and that creator content helps product research or discovery (**81%**). The study is commissioned/presented by Google; a separate Google article specifies a subset of 1,001 YouTube viewers, but the question-by-question denominators and standard errors are not published in these summaries. None measures product orders, paid conversions, incremental sales, or a population share of shoppers on the platform.

Google's [May 2025 shopping article](https://business.google.com/ca-en/think/search-and-video/youtube-video-shopping-journey/) summarizes an **August–September 2023** study with Material of **U.S. adult users of online video platforms who shopped using video**. The footnote gives **N=2,420**; the narrative rounds the survey to 2,000. It identifies seven *descriptive shopping journeys*: trigger-based impulse; sustained passion pursuit; visual idea-to-product search; category newcomers; careful comparison; buying and trying; and urgent replacement. These are neither mutually verified YouTube customer counts nor quantified sales-funnel conversion stages. The study predates the 2025 Kantar survey, has a different source frame and cannot be pooled with Kantar's survey percentages or the April 2025 500-person SmithGeiger survey.

**Inference gate:** learning-video preferences, declared shopping helpfulness, product-tag impressions, actual store clicks and approved settled orders are different evidence units. Without same-period permissioned transaction outcomes, there is no observed YouTube-wide **buyer-intent-to-purchase** or **entertainment-to-purchase** difference; self-reported confidence does not prove incremental creator income. All corresponding outcome fields remain `null`.

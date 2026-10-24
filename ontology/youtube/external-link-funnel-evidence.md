# Video-to-product links: what YouTube actually makes clickable

**Reviewed October 24, 2026.** [Machine link-surface register](external-link-funnel-evidence.json), [auditor](../../site/external-link-funnel-audit.mjs) and [tests](../../tests/external-link-funnel-audit.test.mjs).

YouTube's [official link-sharing matrix](https://support.google.com/youtube/answer/13748639?hl=en) distinguishes external URLs in ordinary long-form video descriptions and comments (**clickable if the channel has advanced features**), from plain URLs in **Shorts comments and descriptions (not clickable)**. The fact that a video was watched does not prove the link was seen, clicked or followed. The documented **clickable related-video link in Shorts** points to a video in the same channel, not an arbitrary external product checkout.

| Placement | General external URL clickability | Important qualifier |
| --- | --- | --- |
| Long-form video description | Yes, with advanced features | Viewers may need to expand description |
| Long-form pinned comment | Yes, with advanced features | Mobile viewer must expand comments; pin access is separately controlled |
| Shorts description URL | **No** | Writing a URL does not create a clickable link |
| Shorts comment URL | **No** | Applies even if channel has advanced-feature access |
| Shorts related-video link | **Internal related-video route** | Not an external merchant hyperlink |
| Channel profile | Yes | Placement does not imply Shorts viewers visited profile |
| Shopping affiliate links | Separate eligible feature | Approval, products and country-specific terms apply |

[YouTube's external links policy](https://support.google.com/youtube/answer/9054257?hl=en) applies to spoken, displayed, shortened and clickable references. It prohibits destinations that violate platform rules; normal affiliate links are not universally banned, while excessive affiliate spam is a policy risk. A technically clickable link may still be disallowed based on the destination.

## A proper funnel experiment

Fix the creator channel, eligibility, format, destination, country, time and placement *before* collecting performance numbers. Separate video **view events**, actual link **impressions** (if available), **click events**, on-site **visits**, distinct **paying orders** and creator **net cash**. None is a substitute for another. The owner or merchant must authorize any source-specific data access; no scraped identity trails or privately disclosed customer information are suitable for public Mercata records. Only compare a preregistered feasible variant against a supported control with disclosed missingness and confounders.

**Still unknown:** per-format outbound click rate, fraction of mobile viewers opening pinned comments, audience migration via profile links, net affiliate conversion, creator refund-adjusted profit and causal uplift. No live marketing campaign or payment has been executed.

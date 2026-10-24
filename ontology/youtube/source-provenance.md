# YouTube source provenance and independence audit

**Snapshot: October 23, 2026.** Mercata's evidence register contained **122 source-reference records**, **129 claims**, and **six normalized URL pairs** that pointed to the same document. **91** records have an unknown exact publication date; these are not automatically defective sources, because public help pages may be continuously updated. Every record must retain a retrieval date.

The [machine-readable family declarations](source-families.json) provide a formal list of shared source records, including a separately categorized underlying **NeoReach survey** that also appears in a partner publication. Two different URLs are not always two independently sampled studies.

## Important distinctions

- **Source reference**: An internal, stable ID linking claims to a public document or original study.
- **Distinct document**: A different normalized URL. Query parameters such as locale should not multiply the number of independent documents.
- **Independent dataset**: A separately recruited or measured research dataset; this can appear in more than one document.
- **Claim**: A dated statement about what the source actually supports, with limitations.
- **Publication date**: May be unknown for living help pages; do not convert a retrieval date to a falsely precise publication date.

The six identical-document pairs concern the YPP help page, audience analytics, two child-directed policy resources, current advertiser suitability and advertiser-policy updates. The NeoReach and partner publications are a separate **same-underlying-survey** family. The original population and sample conditions remain identical even though the two publications have different URLs.

## Reproducibility rules

The [source audit script](../../scripts/audit-youtube-sources.mjs) should report reference count, claim count, distinct normalized URLs, missing publication dates, source-family membership and any **unregistered same-document duplicates**. It should not delete individual provenance IDs, treat living help pages as inherently poor-quality research, or silently presume commercial earnings sources are independently sampled.

The [cross-platform income survey comparison](cross-platform-income-surveys.md) records why syndicated earnings figures cannot be pooled as independent creator-income observations.

The audit covers registered source metadata and documented source families only. It **cannot** prove that every source's figures are true, the page remains unchanged, the sampling design is sound, or every source document has been read in full. Those remain additional acceptance requirements for a completed research review.

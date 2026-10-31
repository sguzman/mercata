# 2025 archived Steam API catalog: a real historical observation with unresolved paid-game coverage

**Reviewed October 31, 2026.** [Dataset and author's README](https://github.com/vintagedon/steam-dataset-2025) · [August–September collection methodology and limitations](https://github.com/vintagedon/steam-dataset-2025/blob/main/steam-dataset-2025-v1/DATASET_CARD.md) · [structured observation](steam-fountain-2025-api-archive-coverage-2026.json) · [aggregate-only checker](../../site/steam-fountain-2025-api-archive-coverage.mjs) · [tests](../../tests/steam-fountain-2025-api-archive-coverage.test.mjs)

Unlike today's changing catalog numbers, Donald Fountain's published **Steam Dataset 2025** describes an archive of Steam API observations collected **August 31–September 29, 2025**. Its dataset card reports:

| Published quantity | Count | Scope and caution |
| --- | ---: | --- |
| Master application IDs initially fetched | 263,890 | Steam app IDs, **not games or paid launches** |
| Application rows in published dataset | 239,664 | Mixed games, DLC, software, media and other app types; may include incomplete detail |
| Difference between the two reported counts | 24,226 | Arithmetic roster difference, **not missing paid games** |
| Author-reported successful detail retrieval | 56% | A **separate collection-stage metric**; its denominator is not reconciled to the stored application-row count |
| Public review records included | 1,048,148 | Sampled review content, not purchases; not imported into Mercata |

The first two counts imply **90.8% stored application rows relative to the reported master-ID total**. **Do not replace this with the 56% detail-success metric**, or infer that 44% of published games were deleted: the stages and denominators differ and the documented aggregates do not provide a reason-coded reconciliation. The dataset card attributes unsuccessful details partly to delisted and region-restricted content, but does not provide per-reason counts that would support a removal fraction.

## Historical paid-release usefulness and failure modes

This older source can help define a **candidate historical snapshot** that future researchers might compare with newer catalogs using independently authorized, matched AppID records. It is not a verified historical first-paid game cohort. The archive includes many non-game applications; `is_free`, `release_date` and price are observed API fields at or around capture, not a complete chronology establishing the initial playable positive-price offer. It cannot prove the number of games retired after 2025 or the number that recorded exactly zero paid orders. Comparing its **all-app** master list with a 2025 **released-game** count from a different provider would mix different units and timelines.

The published repository describes the compiled dataset under **CC BY 4.0**, while underlying Steam API terms still apply. Its documented review material includes Steam IDs, playtime and review text. Mercata **does not import** those records or game rows. It stores only a link, author attribution, dated source-level aggregate observations and independently drafted limitations. No new buyer identities, review profiles, historical paid-game estimates or revenue claims are created.

This is empirical documentation of an earlier observation and its attrition limits, not proof that the original paid release population has been recovered. A repeatable zero-sale study still requires first-paid playable release evidence, coverage of removed titles and authorized order-level financial history.

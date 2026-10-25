# Public YouTube dossier gallery: source and unknown acceptance gate

**Acceptance reviewed:** 2026-10-25. The [YouTube dossier](../../specimens/youtube.json) records per-claim observation dates, limitations, confidence and registered source IDs; its [public renderer](../../site/app.js) turns valid source IDs into HTTPS links while presenting unknown measures without a fabricated zero.

## What the gallery must visibly provide

1. Three working internal/external navigation links at the top of the opened dossier: official website, dossier JSON and task queue JSON.
2. Every recorded claim shown in the claims section with its text, date/confidence line and nonempty limitation statement.
3. Every claim's source IDs represented by actual **clickable HTTPS anchors** to the same URL as the registered document; no unresolved plain-text fallback.
4. External source links opened in new tabs with `noopener noreferrer`, preventing a new-window back-reference.
5. Unknown quantities kept as explicit *unknown* in the website research panels rather than being silently rendered as numeric zero or a claim of complete data.

The [live-data audit](../../site/gallery-evidence-audit.mjs) and [tests](../../tests/gallery-evidence-audit.test.mjs) validate the data-side constraints. The [Firefox browser smoke test](../../tests/site-smoke.mjs) checks actual rendered anchors, source IDs, date/limits, links and unknown representation at desktop and mobile widths. The counts are derived from the current dossier; the test does **not** hard-code today's claim/source inventory, so normal research additions are not mistaken for test failures.

## What passing does not prove

An accessible HTTPS source link does not automatically confirm an article remains online or proves its cited statement. Publication rights, independent source families and measurement-denominator correctness continue to require the separate [source provenance audit](source-provenance.md) and topic-specific numerical validators. Unknown creator income data remain unknown after the gallery passes. This is a **display and traceability** gate, not a completeness gate for the underlying YouTube population.

[Machine acceptance contract](gallery-evidence-acceptance.json).

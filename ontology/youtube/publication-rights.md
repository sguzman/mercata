# Publication rights and third-party material audit

**Inventory refreshed: October 25, 2026; manual rights clearance still pending.** [Machine register](publication-rights.json) · [static audit](../../scripts/publication-rights.mjs) · [tests](../../tests/publication-rights.test.mjs). This is a practical **metadata and rights-gating procedure**, not a legal opinion or certification that every repository file is copyright-cleared.

## Two different acts

**Citing** an original public document and independently summarizing a small factual result is different from **copying** its figure, logo, photograph, video, dataset, code or long prose. Mercata's evidence records include a publisher, link, retrieval date and human-readable reuse note. The fact that a record has a value in its `license` field does **not** mean the original third-party content is open source or automatically licensed for republication.

When a CC-licensed work is actually reused, [Creative Commons](https://creativecommons.org/reusing-cc-licensed-content/) recommends the *title, author/licensor, source and license* attribution framework, tailored to supplied information. Public-domain and CC0 materials have different conditions; proprietary press releases and journal images must not silently be treated as CC content.

## Verified file-path inventory

A repository-tree inspection found two checked-in media files: `assets/favicon.svg` and `assets/swatch.svg`. Both contain simple SVG text and rectangle shapes, without an embedded photograph, external image or font file. The inspected site HTML and CSS had no remote media imports.

On the October 25 GitHub `main` tree, Mercata had **723 tree entries (709 files)**; only **two media-extension paths** were found, the same SVG assets. The inspection reopened their actual text: both use local SVG rectangle/text primitives and built-in font-family references, with no image embedding, downloaded font file or remote media URL in the SVG bodies. The entry page links only its local script, stylesheet and icon. Static stylesheet inspection found no remote media import, and the application script's inspected URL references are research/source links rather than embedded third-party media. This is a **static code and path check**, not a copyright-authorship finding or exhaustive dynamic browser network audit.

At the same snapshot, the research dossier held **371 public source records** and **465 attributed public claims**. Every indexed source had an HTTPS URL, publisher, title, retrieval date and non-empty reuse note; each public claim had a non-empty limitation statement and registered source IDs. These are **provenance metadata fields, not proof of permission to copy source text, illustrations, images, datasets, or videos**. The independent quotation-by-quotation and dataset transformation/export reviews remain incomplete.

The [media-path audit](../../scripts/publication-asset-scan.mjs) now runs during repository verification and rejects new unregistered images, audiovisual files, fonts or PDFs, as well as direct remote media embeds in HTML and CSS. [Tests](../../tests/publication-asset-scan.test.mjs) check the current inventory and reject synthetic unregistered assets.

This covers enumerated file paths, **not** proof of legal authorship, every quotation, Markdown embed, dataset transformation or a complete rights determination. The manual review gate stays open.

## Machine-checked versus manually reviewed

The new audit validates unique source IDs, HTTPS URLs, title, publisher, retrieval date and a source reuse note; every public claim must cite known source IDs and state its limitations. It rejects duplicate asset paths or a registered third-party copied asset without a documented source, licensor, actual permission/license reference and individual review.

**The current asset manifest is empty and intentionally not called complete.** A complete repository-wide file-byte and quotation review has *not* been certified by this artifact. The audit reports `metadata_valid` separately from `release_cleared`, which remains false until an authorized manual audit records completion. This prevents a green metadata test from being mistaken for copyright clearance.

## Publishing protocol

For each external image, chart, excerpt or dataset to be copied: record the actual original author/licensor, source, license or permission, whether adaptations are permitted and any required attribution, verify the legal use case, then explicitly enroll the local file in the rights manifest. For links and brief independently written aggregate comparisons, continue maintaining provenance and source-method restrictions without implying all source data can be redistributed.

This project does not import private conversation material, private research files, individual fan/user identities or unlicensed raw datasets. For source independence and duplicated research families, consult the [source provenance audit](source-provenance.md).

**Open findings:** repository-wide asset clearance, every quote's copyright context, and third-party dataset export permissions remain unverified until independently reviewed.

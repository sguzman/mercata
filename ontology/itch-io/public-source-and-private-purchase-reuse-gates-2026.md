# Public evidence versus private purchases: rights and privacy gate

**Reviewed October 27, 2026.** [Machine audit](public-source-and-private-purchase-reuse-gates-2026.json). Mercata has **263 registered sources and 607 bounded claims**. Each registered source records a URL, retrieval date and independently authored reuse/citation *note*. That note is **not** an upstream license grant.

The [itch.io Terms](https://itch.io/docs/legal/terms), [Creator FAQ](https://itch.io/docs/creators/faq), and [privacy policy](https://itch.io/docs/legal/privacy-policy) are public rules that may be *linked and independently summarized*. Their public availability does not by itself clear reproduction of full documents, photographs, game assets, screenshots or datasets.

| Evidence class | Allowed research treatment | Clearance still required |
|---|---|---|
| Public operating rules | Source-linked factual and independently written summaries | Copying images, full source documents, or proprietary datasets |
| Voluntary developer disclosures | Attribute source, report known period, selection and missing costs | Personal customer export and use as representative paid-seller census |
| [Zenodo dataset record](https://zenodo.org/records/15545055) | Bibliographic record and research method metadata | File-by-file terms, license versions and archive redistribution |
| Private creator analytics | Owner-authorized, disclosure-safe aggregate analyses only | Owner consent, narrow scope, privacy and small-cell review |
| [Purchase/ownership API](https://itch.io/docs/api/serverside) | Restricted game-specific lookup for properly authorized owners | OAuth scopes, buyer privacy and explicit purpose restrictions |

The purchase API documents separate scopes for purchases, ownership and rewards, and can expose data such as buyer emails, unique transaction IDs, download keys or addresses. **Mercata has not called these endpoints or collected any buyer records or credentials.** A game ownership key or purchased entitlement is not automatically another full-price paid order.

For any future seller-approved data, first establish authority and scope, privately perform necessary deduplication, suppress identifying or reconstructible small cells, and publish only sufficiently anonymous aggregates. Do not redistribute raw customer IDs or funnel them into third-party marketing without explicit valid permission.

The existing research acceptance here is *source provenance, neutral claim framing, and the public-versus-restricted-data boundary*. It is **not** a conclusion that all linked external works are freely reusable. Broad copyright, API terms and database redistribution clearance remain open until the relevant specific materials are inspected.

## Zenodo deposit rights are file-specific

[Zenodo's reuse policy](https://about.zenodo.org/policies/) applies CC0 to record metadata except email addresses, while [its terms](https://about.zenodo.org/terms/) preserve third-party intellectual property rights in files. The [previous study version](https://zenodo.org/records/14173085) lists restricted attached files and the [subsequent version](https://zenodo.org/records/15545055) lists open downloadable files, including a selected-games archive. This verifies **access**, not a license to mirror the archived game software or images. No dataset files were obtained, reviewed or republished in Mercata.

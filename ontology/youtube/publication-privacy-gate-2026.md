# Mercata public YouTube research: conservative privacy and secret-leak guard

**Implementation review: October 25, 2026.** [Machine privacy policy](publication-privacy-gate-2026.json) · [auditor](../../scripts/public-privacy-audit.mjs) · [tests](../../tests/public-privacy-audit.test.mjs). This implements the existing research-privacy roadmap task, not a data-collection feature.

The automated validator runs on the **public YouTube specimen's source and claim records**, which hold attributed research metadata. It restricts record field names to the approved public schema and fails on sensitive-key fields, clear email-address patterns, common API access-token signatures and PEM private-key headers. The errors report only a record ID and key name so the guard does not print any detected value in logs.

**Important:** the checker does **not** inspect every text file, document, script, image, unlisted URL, screenshot, dataset transformation, archive or personal profile, and it cannot prove whether apparently harmless prose identifies somebody. It also does not verify rights to quote or republish licensed material. The [separate publication-rights audit](publication-rights.md) keeps manual clearance open.

Source links, short independent aggregate paraphrases, dated official policies and survey totals are legitimate research units. Personal viewer/subscriber histories, private contact lists, credentials, inferred sensitive attributes, and identifying minors are not acceptable study inputs. Owner-authorized analytics should be reported only as appropriately aggregated statistics with the creator's permission.

The guard uses **synthetic bad records in tests**, never live private data. A green automated run is simply evidence that the currently checked source and claim fields match the enforced patterns. It must never be called a full privacy certification or clearance to publish confidential research.

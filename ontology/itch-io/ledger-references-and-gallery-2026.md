# Research evidence-link and gallery integrity

Audit dated **October 27, 2026**. [Machine checklist](ledger-references-and-gallery-2026.json) · [permanent Node regression test](../../tests/itch-ledger-references-and-gallery.test.mjs).

An exact live Git-tree audit of the 244 fixed itch.io tasks examined **4,396 task evidence references** across **1,141 tracked blob paths**. All referenced paths existed; no task had duplicate evidence entries; no claim used an unregistered source ID; no source or claim identifier was duplicated. The [gallery index](../../gallery/index.json) has one itch.io entry with an explicit dossier, queue and plan link.

The permanent test repeats the checks from the local repository whenever CI tests run. It requires task evidence paths to be relative and valid, all source-linked claims to cite registered provenance, fixed task counts, honest completion statuses and aggregate score consistency. That will catch missing artifacts introduced by future direct-to-main research commits.

**Meaning:** This is a verified *internal record integrity* check, not proof that external websites remain unchanged, market income estimates exist, every source grants republication rights, or buyer financial information may be redistributed. The public research's missing paid seller counts, net earnings and sale conversion remain unknown. No accounts or private consumer records were inspected.

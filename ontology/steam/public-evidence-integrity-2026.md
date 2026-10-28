# Steam source integrity and task-scoring audit

**Reviewed October 28, 2026.** This is repository quality control, not new evidence of transactions or developer income.

The [Steam evidence integrity guard](../../scripts/steam-evidence-integrity.mjs) checks all **293 fixed tasks** (209 dedicated plus 84 baseline), requiring referenced evidence files and declared artifacts to resolve within this public repository. It rejects unsafe relative paths, duplicate task IDs, repeated evidence references, broken source/claim joins, duplicate source URLs, invalid task scores, and differences between rounded progress and component workstream scores. The [tests](../../tests/steam-evidence-integrity.test.mjs) include both clean and intentionally invalid fixtures. The repository verifier invokes the guard on every normal validation run.

At this checkpoint there were **zero unstarted Steam tasks**, although most tasks remained partially researched: this **does not imply** their empirical requirements have been achieved. The many remaining gaps in authenticated seller orders, zero-sale firms, historical release coverage and developer profit are explicitly documented in the existing [economic synthesis](executive-economic-evidence-and-decision-gates-2026.md). Reported percentages measure documented task progress, **not** a success probability or completeness of the financial population.

**Important limitation:** a valid path to a public source or research file establishes only traceability. This automated guard does not establish that a third-party source is true, that a contract is publicly available, that sensitive data has been responsibly handled, or that a research conclusion is empirically verified. Existing source-rights, privacy and publication-review gates remain necessary.

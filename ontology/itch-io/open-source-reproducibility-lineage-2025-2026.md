# Engineering study samples — avoid double counting

Reviewed October 26, 2026. [Structured ancestry](open-source-reproducibility-lineage-2025-2026.json).

The [2025 IEEE Conference on Games study](https://ieeexplore.ieee.org/document/11114187/) by Di Sipio and coauthors reports collecting **765 itch.io open-source game candidates** and manually retaining **613** while developing **ten reproducibility guidelines**. The [public Zenodo dataset listing](https://zenodo.org/records/15545055) describes supporting metadata, scripts and manual labeling. Mercata has not downloaded the large archived source bundles or independently reproduced the paper.

The [Canella et al. 2026 study](https://arxiv.org/abs/2610.03953) explicitly reuses initial game metadata from Di Sipio et al. Its distinct processing pipeline begins with **10,548 projects**, checks repository links and leaves **500**, then excludes nine to analyze **491**. It analyzes engines, code, repository activity, genre tags and testing.

**The two selected samples are not independent.** The studies share upstream material, but their exact final project-identity overlap is not verified. Do not sum 613 and 491 as independent observed games or interpret their differing counts as a decline in publisher activity. The 765, 613, 10,548, 500 and 491 values have different processing stages and frames; they are not a single survival funnel.

Neither research project identifies active commercial sellers, a positive-price game cohort, unique paying customers, paid purchases, zero-sale frequency, labor inputs or net profit. Repository activity and source-reproducibility are relevant for engineering and maintenance obligations, **not** a validated estimate of how much the average itch.io publisher earns.

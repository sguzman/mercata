# Open-source itch.io game engineering — academic corpus, 2026

Source: Canella, Duarte, Politowski, Durelli and Endo, [*Characterizing Open-Source Video Games from a Software Engineering Perspective*](https://arxiv.org/abs/2610.03953), 2026, DOI 10.1145/3786171.3788385. Study data: [Zenodo record 17451086](https://zenodo.org/records/17451086). Reviewed October 26, 2026. Machine register: [open-source-engineering-2026.json](open-source-engineering-2026.json).

The researchers started with **10,548 itch.io projects** in a prior open-source-oriented collection, matched accessible GitHub repositories, and then screened 500 matches to exclude nine invalid game-source projects, leaving **491 source-visible games**. This is **not a random sample of all commercial games or paid first-time developers**. Closed-source games, publishers without retrievable GitHub repos, and certain project types are systematically absent.

## Genre, ratings, and infrastructure

The corpus assigned **103 Puzzle**, **97 Action**, **69 Platformer**, **44 Adventure**, **38 Shooter** and **38 Simulation** labels. One game may have multiple labels, so genre counts **cannot be added** to calculate an exclusive share. **289 of 491 games (58.9%) had no player rating**, but this is **not a measured zero-sales fraction**. Games without ratings might have downloads, paid units, no players, missing metadata or other outcomes.

GitHub engine-file inspection found **120 Godot** and **84 Unity** projects, while 231 had no detected engine signature. It found mean **4.22 contributors**, with strongly skewed repository activity, but contributor count does not reveal paid employment, and commits do not reveal developer hours or game cost.

## Tests and commercial outcomes are different questions

After manual review of **111 candidate testing repositories**, the authors confirmed **36 of 491 (7.33%)** had automated tests. Their observational models found projects with tests tended to have more commits after some controls, but **test presence did not show a significant correlation with user ratings** (reported rating p = 0.545). Neither comparison observes transactions or profit. Do not interpret tests as a proven route to paid game sales, nor conflate user ratings with actual purchasers.

[The 2025 and 2026 studies share upstream metadata; their final sample counts are not independent game populations.](open-source-reproducibility-lineage-2025-2026.md)

## What this adds and what it cannot answer

This is strong supporting evidence for a narrow technical landscape: tools and engines, development activity, multi-label genres, code visibility and testing constraints facing some small or hobby game teams. It directly complements Mercata's Linux/desktop QA and reproducible build work. It does **not** establish **typical itch.io game income**, whether an individual 2D project is commercially viable, the fraction of games selling zero units, the true median seller profit, or which engine maximizes game sales.

Only the public academic document was read; the individual dataset and GitHub repos were not fetched or republished.

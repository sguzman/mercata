# Historical safety when YouTube subculture labels split, overlap or change

**Review date:** October 25, 2026. [Machine taxonomy-change contract](taxonomy-drift-protocol-2026.json) · [existing topic taxonomy v1.6](taxonomy.json) · [36 original source observations](topic-observations.json). This is a future-proofing research method, **not an enacted taxonomy migration**.

The existing taxonomy has **33 named topics** and selected source observations for 18 of them. Observations are associated with a dated original metric definition and title/publisher inclusion predicate. Reusing a label for another category is not automatically a valid conversion of the old population.

| Existing observation | Hypothetical related labels | Why historical figures cannot be reassigned |
| --- | --- | --- |
| [indie-animation-weekly-us-2025](https://blog.youtube/culture-and-trends/independent-animation-trends-report/) (within_fan_sample_percent, 2025-04) | child-animation, anime | A selected online animation-fan survey is not individually classified into child-directed versus anime or all animation audience groups. |
| [halloween-makeup-2025](https://blog.youtube/culture-and-trends/halloween-makeup/) (video_views, 2025-01-01 to 2025-10-05) | fashion, feminine-lifestyle | A beauty title-keyword view sample cannot be reassigned into styling, fashion or personal lifestyle audiences without video-level inclusion records. |
| [minecraft-cumulative-2024](https://blog.youtube/culture-and-trends/minecraft-15/) (video_views, through 2024-05-28) | esports | All videos related to Minecraft are not the same as organized esports and cannot be allocated by sport-like competitive status. |
| [news-watch-hours-2025](https://blog.youtube/inside-youtube/youtube-news-working-group-tools-future/) (watch_hours, 2025) | political-news, political-commentary | Platform-defined news watch-time cannot be split into political reporting and commentary without validated video labels, and viewer ideology cannot be inferred. |

## Five change types

- **rename:** Same definition, only presentation label changes. possible only with proved unchanged predicate.
- **split:** New buckets partition old membership in a validated underlying microdata or joint table. forbidden without measured mutually exclusive assignment.
- **merge:** Source categories' identity and overlap must be measured before aggregation. forbidden without deduplication and compatible units.
- **cross_list:** Same video may belong to more than one content taxonomy. new label can be added without doubling the metric total if identity verified.
- **deprecate:** Old ID retained as historical definition and linked to a new vocabulary. retain original series with source version.

## Acceptance for a real mapping

Maintain versioned topic IDs, the original source definition, source timing and geography. A rename may preserve historical values only when the predicate truly stays the same. A split requires defensible per-item classification (or a matched joint aggregate), and a merge needs measured deduplication. A cross-listed video can belong to two labels, but its views cannot be counted twice in an undeduplicated platform total.

Do **not** convert children's animation, anime, gaming/esports, fashion/beauty or political-content examples into observed new audiences here. The four examples are methodological tests for **unmeasured overlap**, not actual video-level reclassification or participant profiling. No existing taxonomy rows, observation values, or audience numbers were changed.

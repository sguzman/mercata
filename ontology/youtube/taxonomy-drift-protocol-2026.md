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

## Preserving the original 36 with one newly admitted observation

The original **33 topic IDs and 36 published source observations** remain the audit's historical baseline. On October 26, 2026, Mercata appended a separately attributed **37th selected observation** about *Alien Stage* video-view events under the existing `general-animation` topic. This was **not** a taxonomy split, merger, historical correction or reassignment of an original metric.

The [machine protocol](taxonomy-drift-protocol-2026.json) now records this addition in `post_baseline_source_observations`, with its own date, taxonomy version, source URL, original population, unit and topic. The [regression audit](../../site/taxonomy-drift-audit.mjs) requires every added observation to be declared and rejects changes to the four historical baseline examples. No new viewer population or creator census was inferred.

## Historical baseline field integrity (October 26, 2026)

The 36 original observations are preserved from public [commit `31b81057`](https://github.com/sguzman/mercata/commit/31b81057431d58af837d38f8a4f12a43fe2f6efc). The machine guard records their original ID, topic, source, reporting period, population, value, comparison operator, unit, geographic scope, view-metric epoch, source type, status and limitations. Every future verification compares **all 36** protected rows field-for-field with the current observations, rather than only counting rows or checking four selected examples.

A new observation (including the independently registered Alien Stage event metric) remains permissible when separately admitted under the post-baseline source register. The guard now fails if any original row is deleted, duplicated, silently recoded or changed without a formal version transition. It does **not** claim to independently reproduce publisher view counters or estimate unique viewers.

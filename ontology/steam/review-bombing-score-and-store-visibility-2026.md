# Steam review bombing, Review Score and visibility: distinct filters and outcomes

**Reviewed October 28, 2026.** [Structured findings](review-bombing-score-and-store-visibility-2026.json) and [synthetic score-denominator helper](../../site/steam-review-score-filters.mjs). This is public policy research, not an observed review-bomb incident or experiment.

## The 40% threshold is not a universal ranking formula

[Valve's current Steam visibility guide](https://partner.steamgames.com/doc/marketing/visibility) states that **Mixed or above (40%+ positive)** does not influence algorithmic featuring on the basis of Review Score; **below 40%**, a game is **less likely** to be featured. This is *not* a guarantee above 40%, an automatic disappearance below it, or a quantified causal effect on sales.

That same guide says **buying and playing** are important discovery signals; store-page visits and a site's conversion rate alone are not direct ranking factors. Wishlists generally do **not** determine algorithmic visibility, with an exception such as Popular Upcoming, while wishlist notifications can still drive launch/discount awareness. There is no evidence here of independent traffic, units sold or ranking experiments.

## Individual off-topic reviews and excluded review-bomb periods are different

Valve's [current User Reviews guide](https://partner.steamgames.com/doc/store/reviews) says normal paid-game Review Scores count eligible **Steam purchases** rather than key-only activations and show separate **last 30 days** and lifetime summaries. Steam prohibits exchanging rewards for reviews and asking for reviews from inside the game; editorial review keys are a separate permitted form of outreach.

For an *individual* review reported and deemed **Off-Topic**, Steam may reduce its prominence while **still including it in Review Score**. This differs from Valve's [March 15, 2019 review-bomb rule](https://store.steampowered.com/news/posts/?enddate=1558453683&feed=steam_blog): automated anomalous-review detection triggers **human examination**; only periods judged *off-topic review bombs* are excluded from the **default Review Score**. Those reviews are **not deleted** and can still be read. Customers can choose to include them in their review-score preferences.

The distinction matters for both policy and economics. A public review count, individual flagged count, default rating denominator and unfiltered review-period denominator can all be different. It is incorrect to infer lost sales from a review-score shock without genuine sales evidence, or to infer a game's true buyer count from the displayed score.

## API provenance must preserve filters

[Valve's IUserReviewsService](https://partner.steamgames.com/doc/webapi/IUserReviewsService) defaults to **English**, **Steam-origin reviews**, and **off-topic period filtering enabled**. To retrieve more languages and off-topic periods, callers must explicitly change the corresponding options. The score summary is only on the first page with `review_type=All`; paging review records is not equivalent to summing score totals. This study called no live reviews endpoint.

The synthetic helper only contrasts review shares before and after *assumed* exclusions. It does **not** reproduce Valve's proprietary rules, estimate actual user review scores, or calculate an observed visibility effect. A 39% versus 40% synthetic fraction is a threshold illustration, **not** a prediction of Steam frontpage treatment.

## Remaining economic evidence

To quantify real review-bomb risks or the effect of score changes on sales, a study would need dated AppIDs with complete review filter metadata; tracked discovery impressions and relevant purchases; exact treatment period; non-affected comparison games; confounding patch, price, press and platform changes; and authenticated refunded merchant units. Those data were **not** collected. No actual review-bomb incidence, paid-unit loss, revenue decline or developer profit is established.

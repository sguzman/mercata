import assert from 'node:assert/strict';
import {readFile, mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {firefox} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.md':'text/plain'};
const server=createServer(async(req,res)=>{
  const requestPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const resource=path.resolve(root,'.'+(requestPath==='/'?'/index.html':requestPath));
  if(!resource.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{
    const file=await readFile(resource);
    res.writeHead(200,{'content-type':types[path.extname(resource)]||'application/octet-stream'});
    res.end(file);
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port+'/';
let browser;
const failures=[];
try{
  browser=await firefox.launch({headless:true});
  await mkdir(path.join(root,'screenshots'),{recursive:true});
  for(const size of [{name:'desktop',width:1280,height:850},{name:'mobile',width:390,height:844}]){
    const context=await browser.newContext({viewport:{width:size.width,height:size.height}});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push('PAGE ERROR '+String(e?.stack || e)));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    page.on('response',response=>{if(response.status()>=400)errors.push('HTTP '+response.status()+' '+response.url());});
    const failedRequests=[];
    page.on('requestfailed',request=>failedRequests.push(request.url()));
    await page.goto(base,{waitUntil:'networkidle'});
    try {
      await page.waitForFunction(()=>document.querySelector('#count-specimens')?.textContent==='26',null,{timeout:12000});
    } catch(error) {
      const state=await page.evaluate(()=>({
        count:document.querySelector('#count-specimens')?.textContent ?? null,
        catalog:document.querySelector('#catalog-grid')?.textContent?.slice(0,400) ?? null,
        readyState:document.readyState
      })).catch(e=>({browserStateError:String(e)}));
      throw new Error('Mercata catalog startup failed: '+JSON.stringify({state,errors,failedRequests,originalError:String(error)}));
    }
    assert.equal(await page.locator('#theme').inputValue(),'system','System theme should be default');
    await page.locator('#search').fill('YouTube');
    assert.equal(await page.locator('#catalog-grid .specimen-card').count(),1,'YouTube filter');
    await page.locator('#catalog-grid .specimen-card a.inline-link').click();
    await page.locator('#dossier-view h3').first().waitFor();
    assert.equal(await page.locator('#dossier-view h3').first().textContent(),'YouTube',errors.join('\n')||'Expected YouTube dossier');
    assert.equal(await page.locator('#dossier-view .video-concentration').count(),1,'Video-concentration research section failed to render');
    assert((await page.locator('#dossier-view .video-concentration').textContent()).includes('91%'),'Source-backed concentration result absent from rendered site');
    // Gallery claim source anchor contract: every claim is visible, dated, limited and linked.
    const currentDossier=JSON.parse(await readFile(path.join(root,'specimens/youtube.json'),'utf8'));
    const allClaims=page.locator('#dossier-view .dossier-evidence .dossier-section').nth(1).locator('.research-item');
    assert.equal(await allClaims.count(),currentDossier.claims.length,'Missing claim cards in research gallery');
    assert.equal(await allClaims.locator('.measure-limit').count(),currentDossier.claims.length,'Claim limitations not fully displayed');
    const expectedSourceReferences=currentDossier.claims.reduce((n,c)=>n+c.source_ids.length,0);
    const sourceAnchors=allClaims.locator('.audience-source-links a');
    assert.equal(await sourceAnchors.count(),expectedSourceReferences,'Research source anchors do not match registered claims');
    assert.equal(await allClaims.locator('.audience-source-links span').count(),0,'Unresolved source ID rendered as plain text');
    assert(await sourceAnchors.evaluateAll(anchors=>anchors.every(a=>
       a.href.startsWith('https://')&&a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.textContent.startsWith('Source:'))),
      'Gallery source anchors require HTTPS, source indicators and new-tab isolation');
    assert.equal(await allClaims.locator('small').count(),currentDossier.claims.length,'Claim date and confidence labels are missing');
    const galleryNav=page.locator('#dossier-view .dossier-shell > .dossier-links > a');
    assert.equal(await galleryNav.count(),3,'Gallery navigation must include official, dossier JSON and task JSON');
    assert((await galleryNav.allTextContents()).some(x=>x.includes('Dossier JSON')),'Missing public dossier JSON link');
    assert((await galleryNav.allTextContents()).some(x=>x.includes('Task JSON')),'Missing public task JSON link');

    assert((await page.locator('.platform-policy-grid .policy-card').count())>=10,'Missing YouTube policy cards');
    const future=page.locator('.ypp-transition');
    assert.equal(await future.locator('.ypp-transition-card').count(),3,'Missing separate current/future membership rules');
    await future.locator('.ypp-transition-details > summary').click();
    assert((await future.textContent()).includes('February 1, 2027'));
    assert((await future.textContent()).includes('future subscriber floor'));
    assert((await future.textContent()).includes('Rolling qualification'));
    assert.equal(await future.locator('.ypp-shorts-card').count(),2,'Missing distinct pooled and direct Shorts ad routes');
    assert((await future.textContent()).includes('15th of the preceding month'));
    assert((await future.textContent()).includes('5 or fewer channels'));
    await future.locator('.ypp-transition-pools > summary').click();
    assert.equal(await future.locator('.ypp-transition-pool').count(),2,'Missing Premium and Premium Lite pools');
    assert((await future.textContent()).includes('60% of net subscription revenue'));
    assert.equal(await page.locator('.revenue-pathway-card').count(),16,'Missing distinct monetization routes');
    const riskMatrix=page.locator('.opportunity-risk-matrix');
    assert.equal(await riskMatrix.locator('.opportunity-method-item').count(),10,'Missing sourced risk axes');
    assert((await riskMatrix.textContent()).includes('No probability of profit or financial loss was inferred'));

    const stack=page.locator('.earning-stream-stack');
    assert.equal(await stack.locator('.earning-stack-checkbox').count(),16,'Missing independently conditional earning routes');
    await stack.locator('summary').click();
    await stack.locator('.earning-stack-checkbox[value="watch-page-ads"]').check();
    await stack.locator('.earning-stack-checkbox[value="shopping-affiliate"]').check();
    await stack.locator('.earning-stack-checkbox[value="external-affiliates"]').check();
    assert((await stack.textContent()).includes('AdSense for YouTube 2'));
    assert((await stack.textContent()).includes('outside providers 1'));
    assert((await stack.textContent()).includes('shopping-affiliate + external-affiliates'));
    await stack.locator('.earning-stack-checkbox[value="shopping-affiliate"]').uncheck();
    assert((await stack.textContent()).includes('AdSense for YouTube 1'));

    assert.equal(await page.locator('.earning-gate-details').count(),16,'Missing product-specific eligibility checklists');
    assert.equal(await page.locator('.application-stage').count(),9,'Missing application stages');
    const appealPanel=page.locator('.application-lifecycle .ypp-review-appeal-panel');
    assert.equal(await appealPanel.count(),1,'Missing video versus YPP enforcement routes');
    assert.equal(await appealPanel.locator('.ypp-appeal-route').count(),5,'Missing five distinct appeal states');
    assert((await appealPanel.textContent()).includes('Pre-suspension 7 days'));
    assert((await appealPanel.textContent()).includes('Post-suspension 21 days'));
    assert((await appealPanel.textContent()).includes('First ordinary rejection may allow a new application after 30 days'));
    assert((await appealPanel.textContent()).includes('failed formal appeals can involve 90 days'));
    assert((await appealPanel.textContent()).includes('yellow ad icon is not YPP expulsion'));
    const effort=page.locator('.production-effort');
    assert.equal(await effort.locator('.production-effort-card').count(),6,'Missing educational/entertainment production workflows');
    await effort.locator('summary').click();
    assert((await effort.textContent()).includes('NOT difficulty scores'));
    assert((await effort.textContent()).includes('typical hour difference unknown'));
    assert((await effort.textContent()).includes('abandoned projects and zero earners'));
    const production=page.locator('.production-costs');
    assert.equal(await production.locator('.production-cost-group').count(),2,'Missing money and time classes');
    assert.equal(await production.locator('.production-cost-item').count(),20,'Incomplete creator cost taxonomy');
    await production.locator('.production-costs-details > summary').click();
    assert.equal(await production.locator('.adjacent-cost-survey').count(),1);
    await production.locator('.adjacent-cost-survey > summary').click();
    assert.equal(await production.locator('.adjacent-cost-survey .adjacent-cost-bin').count(),11);
    assert.equal(await production.locator('.adjacent-labor-survey').count(),1,'Missing separate 2026 creator weekly hours study');
    await production.locator('.adjacent-labor-survey > summary').click();
    assert.equal(await production.locator('.adjacent-labor-survey .adjacent-cost-bin').count(),2);
    assert((await production.locator('.adjacent-labor-survey').textContent()).includes('These two highlighted bins are not a complete distribution'));
    assert((await production.textContent()).includes('Not a causal comparison.'));
    assert((await production.textContent()).includes('not a YouTube zero-earner estimate'));
    assert((await production.textContent()).includes('typical production hours: unknown'));
    assert.equal(await page.locator('.creator-entry-gates .age-entry-routes .ownership-card').count(),4,'Missing distinct minor account and payee age gates');
    assert.equal(await page.locator('.creator-entry-gates .ypp-review-gates .ownership-card').count(),6,'Missing distinct YPP review and appeal clocks');
    const onboarding=page.locator('.channel-onboarding');
    assert.equal(await onboarding.locator('.channel-onboarding-stage').count(),6,'Missing publishing access stages');
    assert.equal(await onboarding.locator('.channel-feature-gate').count(),4,'Missing independent feature gates');
    const ownership=page.locator('.ownership-continuity');
    assert.equal(await ownership.locator('.ownership-card').count(),5,'Missing channel management and continuity operations');
    for(const [selector,cards,phrase] of [
      ['.reputation-portability',7,'not verified buyer ratings'],
      ['.checkout-refund-evidence',3,'Membership cancellation'],
      ['.member-cohort-protocol',6,'No paid cohort or experiment'],
      ['.shorts-referral-study',4,'not verified click-through events'],
      ['.audience-population-crosswalk',7,'deduplicated worldwide MAU and DAU remain unknown'],
      ['.country-ad-reach',4,'Advertiser planning can be revised'],
      ['.topic-evidence-coverage',4,'not measured unique audiences'],
      ['.topic-evidence-coverage',4,'4 of 33 categories have at least two types of selected measurement'],
      ['.virtual-worship-boundary',4,'not specifically YouTube religious audiences'],
      ['.neutral-news-attention',5,'not any channel audience political affiliation'],
      ['.neutral-news-attention',5,'NOT the same population as the Pew 34% U.S. adult regular-news rate'],
      ['.us-news-demographic-crosswalk',8,'Biological sex, overlapping age-by-party'],
      ['.synthetic-media-rights',4,'no AI creator earnings'],
      ['.agentio-engaged-view-study',6,'not a universal engaged-to-public conversion factor'],
      ['.watch-page-accounting',8,'not 55% of advertiser grossRevenue'],
      ['.live-monetization-units',4,'Rubies do not take a further 70% Commerce cut'],
      ['.meme-trending-study',5,'not individual viewers or measured creator earnings'],
      ['.educational-video-studies',3,'not a universal best video length or typical creator earnings'],
      ['.public-comment-language-study',4,'not unique people or viewer language'],
      ['.public-community-post-protocol',4,'no verified unique member count or earnings'],
      ['.language-audience-crosswalk',7,'country is not language'],
      ['.niche-pilot-budget',4,'not measured creator earnings or a guaranteed viable niche'],
      ['.air-revenue-concentration',5,'not global creator profit or zero earner prevalence'],
      ['.evergreen-search-study',5,'not absolute keyword search volume or creator earnings'],
      ['.air-country-cpm',10,'not creator RPM or resident income'],
      ['.fashion-lifestyle-signals',7,'not audience sex or gender or typical creator earnings'],
      ['.small-channel-discovery',5,'not owner-only thumbnail impressions'],
      ['.video-essay-cohort',5,'not a representative creator income or attention study'],
      ['.country-policy-crosswalk',3,'not verified account approval or creator income'],
      ['.content-id-appeals',5,'not creator payout or automatic copyright strikes'],
      ['.content-id-revenue',6,'held revenue is not creator bank cash'],
      ['.creator-processing-settlement',4,'not verified creator bank cash'],
      ['.creator-country-income',4,'Viewer country is not creator residence'],
      ['.adobe-ai-production-survey',6,'not measured creator profit or causal savings'],
      ['.photography-production-labor',6,'not representative creator hourly wages'],
      ['.creator-hourly-bounds',6,'not an observed income distribution'],
      ['.monthly-income-volatility',6,'no payment is not proof of zero earnings'],
      ['.podcast-publication-routes',6,'not automatic creator payouts or outside podcast syndication'],
      ['.podcast-viewing-frames',5,'not a unique-person or creator-income comparison'],
      ['.nielsen-tv-device-share',3,'not a mobile viewing share or total unique viewers'],
      ['.creator-localization-access',6,'not measured multilingual audience or creator income'],
      ['.creator-entry-gates',7,'not actual account approval or creator income'],
      ['.monthly-creator-cash-flow',4,'Bank arrival is not the same as issuance'],
      ['.agentio-sponsor-study',6,'not representative creator pay or verified incremental sales'],
      ['.shopping-funnel-evidence',4,'no verified public conversion rate'],
      ['.ytlive-attendance-study',4,'not unique viewers or earnings'],
      ['.live-chat-culture-study',4,'not verified creator earnings'],
      ['.vtuber-superchat-cohort',7,'not zero total earnings'],
      ['.playlist-series-observability',9,'not unique returning viewers'],
      ['.native-packaging-ab',3,'not click-through rate'],
      ['.recommendation-evidence',5,'No minimum Shorts posting cadence'],
      ['.creator-payout-scale',3,'not individual earnings'],
      ['.alphabet-ad-revenue',8,'not creator payouts'],
      ['.oxford-creator-study',12,'EU27 includes France and Germany'],
      ['.channel-cohort-evidence',4,'do not prove uploading causes growth'],
      ['.first-upload-vlog',4,'no YouTube payouts'],
      ['.external-link-funnel',7,'no test has been launched'],
      ['.retention-observability',11,'full-video completion fraction'],
      ['.patreon-shock-study',4,'creator labor and profit are unknown'],
      ['.reaction-compilation-rights',7,'No case-specific fair-use finding'],
      ['.crossplatform-posting',4,'no viewer migration measured'],
      ['.gaming-period-study',4,'external migration remain unknown'],
      ['.search-demand-proxies',4,'No absolute monthly searches'],
      ['.production-cost-audit',5,'No representative equipment costs'],
      ['.exclusive-rights-audit',5,'No actual creator contract'],
      ['.creator-fraud-security',5,'no verified sampled incident rates']
    ]){
      const section=page.locator(selector);
      const researchCards=selector==='.creator-entry-gates'
        ?section.locator(':scope > details > .ownership-grid > .ownership-card')
        :section.locator('.ownership-card');
      assert.equal(await researchCards.count(),cards,'Missing research cards in '+selector);
      await section.locator('summary').click();
      assert((await section.textContent()).includes(phrase),'Missing uncertainty boundary in '+selector);
    }

    const chatCulture=page.locator('.live-chat-culture-study .live-chat-language-study');
    assert.equal(await chatCulture.count(),1,'Missing selected Japanese-language VTuber interaction cohort');
    assert((await chatCulture.textContent()).includes('64,279 messages across 10 chosen livestreams'));
    assert((await chatCulture.textContent()).includes('0.4%–8.7%'));
    assert((await chatCulture.textContent()).includes('8–38 seconds'));
    assert((await chatCulture.textContent()).includes('No individual chat identities'));
    const studyWithMe=page.locator('.creator-collaboration-evidence .study-with-me-comment-evidence');
    assert.equal(await studyWithMe.count(),1,'Missing bounded study-comment research');
    assert((await studyWithMe.textContent()).includes('393 title-selected prerecorded videos'));
    assert((await studyWithMe.textContent()).includes('164,611 analyzed public comments'));
    assert((await studyWithMe.textContent()).includes('causal learning and creator-profit effects were not measured'));
    const shows=page.locator('.playlist-series-observability .show-serial-product-evidence');
    assert.equal(await shows.count(),1,'Missing official Shows series mode research');
    assert((await shows.textContent()).includes('serial shows list oldest first'));
    assert((await shows.textContent()).includes('maximum 180 seconds'));
    assert((await shows.textContent()).includes('No verified show completion'));
    const cadenceCase=page.locator('.publishing-cadence .cadence-korean-beauty-evidence');
    assert.equal(await cadenceCase.count(),1,'Missing bounded beauty cohort research');
    assert((await cadenceCase.textContent()).includes('47 selected South Korean beauty channels'));
    assert((await cadenceCase.textContent()).includes('Abstract-level evidence only'));
    const returningPanel=page.locator('.post-membership-retention .return-viewer-beauty-panel');
    assert.equal(await returningPanel.count(),1,'Missing selected returning-viewer revenue evidence');
    assert((await returningPanel.textContent()).includes('50 South Korean beauty channels'));
    assert((await returningPanel.textContent()).includes('Likes were not statistically significant'));
    assert((await returningPanel.textContent()).includes('do not measure a new-to-returning person transition'));
    const firstTen=page.locator('.small-channel-discovery .first-ten-created-channels');
    assert.equal(await firstTen.count(),1,'Missing selected first-ten upload cohort');
    assert((await firstTen.textContent()).includes('448,413 channels created'));
    assert((await firstTen.textContent()).includes('56,185 qualify for BOTH'));
    assert((await firstTen.textContent()).includes('Per individual video: 56.6% Shorts, 30.2% long-form'));
    assert((await firstTen.textContent()).includes('Excluded: all channels stopping before ten'));
    const firstWeek=page.locator('.small-channel-discovery .first-week-video-distribution');
    assert.equal(await firstWeek.count(),1,'Missing bounded video-level distribution');
    assert((await firstWeek.textContent()).includes('38,229,639 indexed long-form-classified videos'));
    assert((await firstWeek.textContent()).includes('70.1% received fewer than 1,000'));
    assert((await firstWeek.textContent()).includes('107 search-selected channels'));
    assert((await firstWeek.textContent()).includes('not seven-day video views'));
    assert((await firstWeek.textContent()).includes('No stratified newcomer distribution'));
    const reachPanel=page.locator('.audience-population-crosswalk .country-selected-reach-panel');
    assert.equal(await reachPanel.count(),1,'Missing source-linked seven-country comparison');
    assert.equal(await reachPanel.locator('.country-selected-reach-item').count(),7,'Country panel must have seven matched estimates');
    assert((await reachPanel.textContent()).includes('1. India'));
    assert((await reachPanel.textContent()).includes('500 million estimated ad-reachable'));
    assert((await reachPanel.textContent()).includes('NOT a global ranking or measured MAU/DAU'));
    const regionRights=page.locator('.country-policy-crosswalk .region-content-availability');
    assert.equal(await regionRights.count(),1,'Missing country video rights policy distinctions');
    assert((await regionRights.textContent()).includes('Video owner licensing territory'));
    assert((await regionRights.textContent()).includes('local-law compliance'));
    assert((await regionRights.textContent()).includes('No country-specific affected-video counts'));
    const datedCountry=page.locator('.country-policy-crosswalk .country-ypp-dated-restriction');
    assert.equal(await datedCountry.count(),1,'Missing dated Russian onboarding notice');
    assert((await datedCountry.textContent()).includes('2022-03-10'));
    assert((await datedCountry.textContent()).includes('new YPP sign-ups'));
    assert((await datedCountry.textContent()).includes('No determination about existing Russian creators'));
    const packaging=page.locator('.native-packaging-ab .external-packaging-rotations');
    assert.equal(await packaging.count(),1,'Missing externally selected thumbnail rotation evidence');
    assert((await packaging.textContent()).includes('460 alternating packaging patterns'));
    assert((await packaging.textContent()).includes('75,998 first-week edited videos'));
    assert((await packaging.textContent()).includes('NOT a verified Studio winner'));
    const bfi2025=page.locator('.video-essay-cohort .bfi-2025-essay-communities');
    assert.equal(await bfi2025.count(),1,'Missing 2025 BFI curated video essay comparison');
    assert((await bfi2025.textContent()).includes('72 invited expert voters'));
    assert((await bfi2025.textContent()).includes('255 works'));
    assert((await bfi2025.textContent()).includes('does not establish a growth rate'));
    const strikes=page.locator('.content-id-appeals .copyright-strike-accumulation');
    assert.equal(await strikes.count(),1,'Missing actual strike accumulation rules');
    assert((await strikes.textContent()).includes('after 90 days requires Copyright School'));
    assert((await strikes.textContent()).includes('Three active strikes in 90 days'));
    assert((await strikes.textContent()).includes('a legal process, not a Content ID dispute'));
    const childCountry=page.locator('.demographic-cross-tabs .child-age-country-frames');
    assert.equal(await childCountry.count(),1,'Missing bounded country-age observations');
    assert((await childCountry.textContent()).includes('Australia 6–7 84%'));
    assert((await childCountry.textContent()).includes('United Kingdom 8–14 96%'));
    assert((await childCountry.textContent()).includes('United States 2–4 84%'));
    assert((await childCountry.textContent()).includes('No common international rank'));
    const learningSurvey=page.locator('.evergreen-search-study .instructional-video-survey');
    assert.equal(await learningSurvey.count(),1,'Missing source-bounded instructional demand survey');
    assert((await learningSurvey.textContent()).includes('2,160 U.S. weekly video viewer survey respondents'));
    assert((await learningSurvey.textContent()).includes('learning a skill 69%'));
    assert((await learningSurvey.textContent()).includes('do not measure actual search visits'));
    const exceptional=page.locator('.first-upload-vlog .exceptional-earnings-panel');
    assert.equal(await exceptional.count(),1,'Missing high-income exception boundary');
    assert((await exceptional.textContent()).includes('1,020 million gross across platforms'));
    assert((await exceptional.textContent()).includes('Not audited YouTube payouts'));
    assert((await exceptional.textContent()).includes('prevent same-person earnings growth inference'));
    const shoppingIntent=page.locator('.shopping-funnel-evidence .shopping-intent-surveys');
    assert.equal(await shoppingIntent.count(),1,'Missing bounded shopping-intent survey panel');
    assert((await shoppingIntent.textContent()).includes('2,160 selected US weekly video viewers'));
    assert((await shoppingIntent.textContent()).includes('seven descriptive shopping journeys'));
    assert((await shoppingIntent.textContent()).includes('No matched YouTube purchase conversions'));
    const nicheMaturity=page.locator('.channel-cohort-evidence .niche-maturity-evidence');
    assert.equal(await nicheMaturity.count(),1,'Missing bounded new/mature channel niche evidence');
    assert((await nicheMaturity.textContent()).includes('TubeAI curated active 10k+ subscriber channels'));
    assert((await nicheMaturity.textContent()).includes('Gaming: 13.7%'));
    assert((await nicheMaturity.textContent()).includes('roblox: 42.32%'));
    assert((await nicheMaturity.textContent()).includes('Not a matched mature cohort'));
    const historicalIncome=page.locator('.channel-cohort-evidence .historical-tier-income-panel');
    assert.equal(await historicalIncome.count(),1,'Missing bounded 2019 modeled income data');
    assert.equal(await historicalIncome.locator('.historical-tier-income-row').count(),6);
    assert((await historicalIncome.textContent()).includes('USD 295 / modeled channel-year mean'));
    assert((await historicalIncome.textContent()).includes('USD 1,707,446 / modeled channel-year mean'));
    assert((await historicalIncome.textContent()).includes('not actual creator payouts'));
    assert((await historicalIncome.textContent()).includes('No observed medians'));
    await ownership.locator('.ownership-details > summary').click();
    assert((await ownership.textContent()).includes('seven-day role tenure'));
    assert((await ownership.textContent()).includes('permanently delete the target channel'));
    await onboarding.locator('summary').click();
    assert((await onboarding.textContent()).includes('time to first creator payment: unknown'));
    assert.equal(await page.locator('.content-policy-item').count(),8,'Missing sourced content restrictions');
    const adsHistory=page.locator('.advertiser-policy-history');
    assert.equal(await adsHistory.locator('.advertiser-revision-card').count(),6,'Missing 2026 advertiser revisions');
    await adsHistory.locator('.advertiser-policy-details > summary').click();
    assert((await adsHistory.textContent()).includes('2026-10'));
    assert((await adsHistory.textContent()).includes('review error rate and appeal success'));
    const music=page.locator('.music-rights');
    assert.equal(await music.locator('.music-rights-card').count(),5,'Missing audio licensing routes');
    await music.locator('summary').click();
    assert((await music.textContent()).includes('paid Creator Music licenses'));
    assert((await music.textContent()).includes('Typical audio cost: unknown'));
    assert.equal(await music.locator('.music-enforcement-card').count(),2,'Claims and legal takedowns must be separate');
    assert((await music.textContent()).includes('Copyright removal and strike'));
    assert((await music.textContent()).includes('YouTube Shopping'));
    assert.equal(await page.locator('.analytics-metric-item').count(),11,'Missing Youtube Analytics metric guide');
    const countBreak=page.locator('.view-definition-break');
    assert.equal(await countBreak.locator('.view-definition-card').count(),8,'Missing distinct view metric units');
    await countBreak.locator('summary').click();
    assert((await countBreak.textContent()).includes('August 24, 2026'));
    assert((await countBreak.textContent()).includes('does not establish more attentive viewers'));
    assert((await countBreak.locator('.view-definition-invalid-list li').count())>=5);
    const checker=countBreak.locator('.view-comparison-tool');
    assert.equal(await checker.locator('select option').count(),7,'Missing distinct comparison metrics');
    await checker.locator('input[type=date]').nth(0).fill('2026-08-23');
    await checker.locator('input[type=date]').nth(1).fill('2026-08-24');
    await checker.locator('input[type=date]').nth(1).dispatchEvent('change');
    assert((await checker.locator('.view-comparison-result').textContent()).includes('straddle August 24'));
    await checker.locator('input[type=date]').nth(0).fill('2026-08-25');
    await checker.locator('input[type=date]').nth(0).dispatchEvent('change');
    assert((await checker.locator('.view-comparison-result').textContent()).includes('These dates do not cross'));
    await checker.locator('input[type=date]').nth(0).fill('2026-08-23');
    await checker.locator('select').selectOption('engaged_view');
    assert((await checker.locator('.view-comparison-result').textContent()).includes('must be checked across dates'));
    const promote=page.locator('.promote-economics');
    assert.equal(await promote.locator('.promote-format-card').count(),3,'Missing CPV billing format distinctions');
    assert.equal(await promote.locator('.promote-metric-card').count(),8,'Missing campaign ad cost/attribution units');
    await promote.locator('summary').click();
    assert((await promote.textContent()).includes('generated directly by ad campaigns do not meet YPP'));
    assert((await promote.textContent()).includes('net creator profit remain unknown'));
    const posting=page.locator('.post-membership-retention');
    assert.equal(await posting.locator('.post-membership-surface').count(),3,'Missing distinct Posts / Communities / members-only distinctions');
    assert.equal(await posting.locator('.post-membership-metric').count(),7,'Missing membership event and stock denominators');
    await posting.locator('summary').click();
    assert((await posting.textContent()).includes('not a distinct buyer'));
    assert((await posting.textContent()).includes('renewal rate and net member profit: unknown'));
    assert((await posting.textContent()).includes('300 million users engaging with Posts'));
    assert.equal(await page.locator('.creator-growth-stage').count(),6,'Missing audience lifecycle stages');
    assert.equal(await page.locator('.creator-growth-metric').count(),17,'Missing audience measurement glossary');
    assert.equal(await page.locator('.content-format-card').count(),8,'Missing format-by-format comparison');
    assert.equal(await page.locator('.content-surface-layer-card').count(),8,'Missing functional product-surface crosswalk');
    const synthesis=page.locator('.evidence-synthesis');
    assert.equal(await synthesis.locator('.evidence-synthesis-card').count(),7,'Missing bounded review narrative');
    await synthesis.locator('summary').click();
    assert((await synthesis.textContent()).includes('zero-earner share'));
    assert((await synthesis.textContent()).includes('Not measured'));
    const animeFrame=page.locator('.animation-format-cycles');
    await animeFrame.locator('summary').click();
    assert((await animeFrame.textContent()).includes('outside Japan. View events are not unique viewers'));
    const animeAdjacent=animeFrame.locator('.anime-cross-platform-context');
    assert.equal(await animeAdjacent.count(),1);
    assert((await animeAdjacent.textContent()).includes('United States 22%'));
    assert((await animeAdjacent.textContent()).includes('Japan 55%'));
    assert((await animeAdjacent.textContent()).includes('>45 billion US anime streaming minutes'));
    assert((await animeAdjacent.textContent()).includes('not YouTube or adults alone'));
    await animeFrame.locator('summary').click();
    const declining=page.locator('.declining-topic-audit');
    assert.equal(await declining.locator('.declining-topic-card').count(),4,'Missing candidate decline inference audit');
    await declining.locator('summary').click();
    assert((await declining.textContent()).includes('No verified YouTube niche decline'));
    assert((await declining.textContent()).includes('not a proven persistent trend'));
    const season=page.locator('.seasonal-discovery');
    assert.equal(await season.locator('.seasonal-discovery-card').count(),5,'Missing distinct seasonal evidence cases');
    await season.locator('summary').click();
    assert((await season.textContent()).includes('offseason'));
    assert((await season.textContent()).includes('best upload month'));
    const publishing=page.locator('.publish-time-study');
    assert.equal(await publishing.locator('.publish-time-card').count(),4,'Missing separate publication format timing cases');
    await publishing.locator('summary').click();
    assert((await publishing.textContent()).includes('28 days'));
    assert((await publishing.textContent()).includes('long-term performance'));
    assert((await publishing.textContent()).includes('unknown'));
    const teenFormats=page.locator('.teen-format-evidence');
    assert.equal(await teenFormats.locator('.teen-format-card').count(),2,'Missing separated UK age-band video genre samples');
    await teenFormats.locator('summary').click();
    assert.equal(await teenFormats.locator('.teen-format-row').count(),6);
    assert.equal(await teenFormats.locator('.teen-au-category').count(),12,'Missing measured Australian YouTube genre-by-gender sample');
    assert((await teenFormats.textContent()).includes('Boys 67% · Girls 39%'));
    assert((await teenFormats.textContent()).includes('Boys 5% · Girls 31%'));
    assert((await teenFormats.textContent()).includes('NOT YouTube alone'));
    assert((await teenFormats.textContent()).includes('These are platform-use rates, not genre-use estimates'));
    assert((await teenFormats.textContent()).includes('Never infer a minor’s identity or viewing history'));
    const child=page.locator('.child-format-study');
    assert.equal(await child.locator('.child-format-card').count(),5,'Missing separate child/general/adult classifications');
    await child.locator('summary').click();
    assert((await child.textContent()).includes('safe for a whole family'));
    assert((await child.textContent()).includes('No individual minors are profiled'));
    assert((await child.textContent()).includes('96%'));
    assert.equal(await child.locator('.child-format-observation').count(),2,'Missing published separate UK measures');
    const preschool=child.locator('.preschool-survey-policy');
    assert.equal(await preschool.count(),1,'Missing protected preschool parent survey');
    assert((await preschool.textContent()).includes('3,054 parents'));
    assert((await preschool.textContent()).includes('84% reportedly ever watched YouTube'));
    assert((await preschool.textContent()).includes('51% daily'));
    assert((await preschool.textContent()).includes('93% of YouTube-watching children'));
    assert((await preschool.textContent()).includes('NOT identical to a creator Made for Kids designation'));
    const screenStudy=page.locator('.screen-viewing-study');
    assert.equal(await screenStudy.locator('.screen-viewing-card').count(),2,'Missing UK device share subgroups');
    await screenStudy.locator('summary').click();
    assert((await screenStudy.textContent()).includes('Q2 2025'));
    assert((await screenStudy.textContent()).includes('TV-set viewing share: 43%'));
    assert((await screenStudy.textContent()).includes('Smartphone viewing share: 32%'));
    assert((await screenStudy.textContent()).includes('unknown in cited source'));
    const surfaces=page.locator('.video-surface-study');
    assert.equal(await surfaces.locator('.video-surface-card').count(),7,'Missing format and ad-inventory study');
    assert((await surfaces.textContent()).includes('6.5 billion microdrama views'));
    await surfaces.locator('summary').click();
    assert((await surfaces.textContent()).includes('8 minutes (480 seconds)'));
    assert((await surfaces.textContent()).includes('not a served ad'));
    assert((await surfaces.textContent()).includes('Shorts over one minute'));
    const language=page.locator('.multilingual-distribution');
    assert.equal(await language.locator('.multilingual-product-card').count(),6,'Missing multilingual feature catalog');
    assert.equal(await language.locator('.multilingual-choice-card').count(),6,'Missing localized media decision matrix');
    assert.equal(await language.locator('.multilingual-observation').count(),2,'Missing selected product observations');
    await language.locator('summary').first().click();
    assert((await language.textContent()).includes('not additional traffic or causal income lift'));
    await language.locator('.multilingual-language-examples > summary').click();
    assert.equal(await language.locator('.multilingual-language-list li').count(),8,'Missing documented language examples');
    assert.equal(await page.locator('.scale-observation').count(),4,'Missing global scale observations');
    const reach=page.locator('.country-reach');
    assert.equal(await reach.locator('.country-reach-card').count(),4,'Missing bounded country/survey rates');
    assert.equal(await reach.locator('.country-reach-trend').count(),3,'Missing source-consistent UK trend series');
    await reach.locator('summary').click();
    assert((await reach.textContent()).includes('Do not sum percentages or device minutes'));
    assert((await reach.textContent()).includes('global monthly distinct viewers: unknown'));
    const expertQuality=page.locator('.video-quality-research .quality-expert-rubric');
    assert.equal(await expertQuality.count(),1,'Missing bounded expert-rated statistics tutorial review');
    assert((await expertQuality.textContent()).includes('87 of 114 selected English statistics search results'));
    assert((await expertQuality.textContent()).includes('Search-result selection and expert judgments are not measured learning'));
    const frames=page.locator('.survey-frame-crosswalk');
    assert.equal(await frames.locator('.survey-frame-card').count(),8,'Missing the eight independent source-frame distinctions');
    await frames.locator('summary').click();
    assert((await frames.textContent()).includes('including zero-earning YouTube entrants remain unknown'));
    assert((await frames.textContent()).includes('5,511 respondents'));
    assert((await frames.textContent()).includes('Sample size: unknown'),'Null survey counts must render without suppressing dossier');
    assert((await frames.textContent()).includes('8 documented source frames'));

    const identity=page.locator('.identity-research');
    assert.equal(await identity.locator('.identity-research-card').count(),4,'Missing explicitly scoped race/ethnicity study');
    await identity.locator('summary').click();
    assert((await identity.textContent()).includes('English speakers only'));
    assert((await identity.textContent()).includes('Religion-specific YouTube use: unknown'));
    assert((await identity.textContent()).includes('ADULTS WITHIN EACH NAMED GROUP'));
    const demographics=page.locator('.us-demographic-use');
    assert.equal(await demographics.locator('.us-demographic-card').count(),3,'Missing U.S. adult subgroup study');
    await demographics.locator('summary').click();
    assert.equal(await demographics.locator('.us-demographic-row').count(),10,'Missing conditional usage figures');
    assert((await demographics.textContent()).includes('IN THAT GROUP'));
    assert((await demographics.textContent()).includes('subgroup sample sizes and uncertainty'));
    const parentIncome=demographics.locator('.parent-child-income-study');
    assert.equal(await parentIncome.count(),1,'Missing separate parent-child income study');
    assert.equal(await parentIncome.locator('.parent-income-band').count(),3);
    assert((await parentIncome.textContent()).includes('55% of parents report child watches YouTube daily'));
    assert((await parentIncome.textContent()).includes('40% of parents report child watches YouTube daily'));
    assert((await parentIncome.textContent()).includes('2023 USD adjusted for regional cost of living'));
    const waves=demographics.locator('.demographic-npors-two-wave');
    assert.equal(await waves.count(),1,'Missing separate adult survey comparisons');
    assert.equal(await waves.locator('.demographic-npors-stratum').count(),3);
    assert.equal(await waves.locator('.demographic-npors-row').count(),10);
    assert((await waves.textContent()).includes('5,022 U.S. adults in the 2025 survey'));
    assert((await waves.textContent()).includes('5,511 in 2026'));
    assert((await waves.textContent()).includes('High school or less: 78% (2025), 77% (2026)'));
    assert((await waves.textContent()).includes('not active use'));
    assert((await waves.textContent()).includes('no change is established as statistically significant'));
    const viewTime=page.locator('.country-reach .country-reach-account-viewtime');
    assert.equal(await viewTime.count(),1,'Missing bounded account-level view time evidence');
    assert((await viewTime.textContent()).includes('2024: 87.2 minutes/day'));
    assert((await viewTime.textContent()).includes('2025: 99.1 minutes/day'));
    assert((await viewTime.textContent()).includes('not unique humans'));
    assert((await viewTime.textContent()).includes('Not comparable with Ofcom'));
    const people=page.locator('.viewer-person-metrics');
    assert.equal(await people.locator('.viewer-person-card').count(),8,'Missing public/owner viewer measurement types');
    await people.locator('summary').click();
    assert((await people.textContent()).includes('rolling 28-day'));
    assert((await people.textContent()).includes('up to 90 days'));
    assert((await people.textContent()).includes('worldwide person census'));
    const demographicLimits=people.locator('.demographic-reporting-limits');
    assert.equal(await demographicLimits.count(),1,'Missing Analytics privacy-suppression scope');
    assert((await demographicLimits.textContent()).includes('threshold is unpublished'));
    assert((await demographicLimits.textContent()).includes('Private or unlisted videos'));
    assert((await demographicLimits.textContent()).includes('not proof of zero viewers'));
    const seasonality=page.locator('.children-seasonality');
    assert.equal(await seasonality.locator('.children-seasonality-card').count(),3,'Missing bounded child viewing yearly observations');
    await seasonality.locator('summary').click();
    assert((await seasonality.textContent()).includes('7h 07m'));
    assert((await seasonality.textContent()).includes('seasonal effects: unknown'));
    assert((await seasonality.textContent()).includes('all-source TV impressions +27%'));
    assert((await seasonality.textContent()).includes('streaming impressions +25%'));
    assert((await seasonality.textContent()).includes('not a YouTube-specific seasonal rate'));
    assert((await seasonality.textContent()).includes('all TV viewing -9%'));
    assert((await seasonality.textContent()).includes('combined streaming TV -8%'));
    assert((await seasonality.textContent()).includes('First-to-last week: TV -21%; streaming -22%'));
    assert((await seasonality.textContent()).includes('Not a measured YouTube-specific or causal school-return effect.'));
    const genderEvidence=page.locator('.gender-community-evidence');
    assert.equal(await genderEvidence.locator('.gender-community-card').count(),2,'Missing aggregate gender data limits');
    await genderEvidence.locator('summary').click();
    assert((await genderEvidence.textContent()).includes('unknown, never zero'));
    assert((await genderEvidence.textContent()).includes('No gender stereotype'));
    const beautyGaming=page.locator('.beauty-gaming-panel');
    assert.equal(await beautyGaming.locator('.beauty-gaming-card').count(),4,'Missing bounded beauty-gaming panel findings');
    await beautyGaming.locator('summary').click();
    assert((await beautyGaming.textContent()).includes('74,276'));
    assert((await beautyGaming.textContent()).includes('5%'));
    assert((await beautyGaming.textContent()).includes('Exact intersection count and percentage denominator: unknown'));
    const overlap=page.locator('.audience-overlap');
    assert.equal(await overlap.locator('.audience-overlap-card').count(),5,'Missing topic overlap evidence cards');
    await overlap.locator('summary').click();
    assert((await overlap.textContent()).includes('Joint audience size: unknown'));
    assert((await overlap.textContent()).includes('higher-order intersections'));
    const geo=page.locator('.geographic-scope');
    assert.equal(await geo.locator('.geographic-card').count(),5,'Missing regional source and population branches');
    await geo.locator('summary').click();
    assert((await geo.textContent()).includes('newcomer profit including zero earners: unknown'));
    const countryPrograms=page.locator('.country-programs');
    assert.equal(await countryPrograms.locator('.country-program-card').count(),3,'Missing verified YPP/payment country rows');
    await countryPrograms.locator('summary').click();
    assert.equal(await countryPrograms.locator('.country-program-currency').count(),3,'Missing currency-scoped payout thresholds');
    assert((await countryPrograms.textContent()).includes('Account currency and feature-specific permissions: unknown'));
    assert((await countryPrograms.textContent()).includes('MXN 1,200'));
    const eu=page.locator('.eu-consultation');
    assert.equal(await eu.locator('.eu-consultation-card').count(),7,'Missing bounded EU27 consultation responses');
    await eu.locator('summary').click();
    assert((await eu.textContent()).includes('over 20,000 EU27 creators'));
    assert((await eu.textContent()).includes('only to professional creators'));
    const trafficPanel=page.locator('.traffic-concentration');
    assert.equal(await trafficPanel.locator('.traffic-concentration-card').count(),9,'Missing Studio traffic source classes');
    await trafficPanel.locator('summary').click();
    assert((await trafficPanel.textContent()).includes('No channel traffic mix'));
    assert((await trafficPanel.textContent()).includes('does not measure ownership'));
    const safety=page.locator('.creator-safety');
    assert.equal(await safety.locator('.creator-safety-card').count(),4,'Missing distinct safety and recovery procedures');
    await safety.locator('summary').click();
    assert((await safety.textContent()).includes('October 21, 2026'));
    assert((await safety.textContent()).includes('not guaranteed'));
    assert((await safety.textContent()).includes('recovery success are unmeasured'));
    const cadenceStudy=page.locator('.publishing-cadence');
    assert.equal(await cadenceStudy.locator('.publishing-cadence-card').count(),14,'Missing observed upload cadence niche/tier dispersion');
    await cadenceStudy.locator('summary').click();
    assert.equal(await cadenceStudy.locator('.publishing-cadence-tier').count(),5,'Missing separate vidIQ cadence bins');
    assert((await cadenceStudy.textContent()).includes('Middle half: 2–8 uploads/month'));
    assert((await cadenceStudy.textContent()).includes('does not establish causation'));
    const sponsorStudy=page.locator('.sponsor-categories');
    assert.equal(await sponsorStudy.locator('.sponsor-category-card').count(),11,'Missing sourced long-form sponsorship categories');
    await sponsorStudy.locator('summary').click();
    assert((await sponsorStudy.textContent()).includes('176,686 detections (6.1%)'));
    assert((await sponsorStudy.textContent()).includes('newcomer zero-earner share'));
    const brand=page.locator('.brand-disclosure');
    assert.equal(await brand.locator('.brand-disclosure-card').count(),3,'Missing independent platform/legal layers');
    assert.equal(await brand.locator('.brand-disclosure-surface').count(),4,'Missing video/live/affiliate disclosure scopes');
    await brand.locator('summary').click();
    assert((await brand.textContent()).includes('not a universal legal safe harbor'));
    assert((await brand.textContent()).includes('September 3, 2026'));
    assert((await brand.textContent()).includes('revenue, country compliance expense'));
    const withholding=page.locator('.tax-withholding');
    assert.equal(await withholding.locator('.tax-withholding-card').count(),4,'Missing documented withholding cases');
    await withholding.locator('summary').click();
    assert((await withholding.textContent()).includes('worldwide youtube earnings'));
    assert((await withholding.textContent()).includes('earnings attributed to us viewers'));
    assert((await withholding.textContent()).includes('not personal tax advice'));
    assert.equal(await page.locator('.payout-currency').count(),2,'Missing documented payout currencies');
    assert((await page.locator('.topic-catalogue-card').count())>=33,'Missing community taxonomy');
    const sampling=page.locator('.sampling-budget');
    assert.equal(await sampling.locator('.sampling-budget-card').count(),4,'Missing API sampling limits');
    await sampling.locator('summary').click();
    assert((await sampling.textContent()).includes('48 search calls'));
    assert((await sampling.textContent()).includes('actual distinct videos, creators and viewers unknown'));
    assert.equal(await page.locator('.community-card').count(),1,'Missing event-specific measured community');
    assert.equal(await page.locator('.opportunity-method-details > .opportunity-method-grid > .opportunity-method-item').count(),10,'Missing economic opportunity framework');
    await page.locator('.opportunity-method-details > summary').click();
    const niche=page.locator('.niche-explorer');
    assert.equal(await niche.locator('select option').count(),33,'Missing research topics');
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Gaming'));
    await niche.locator('select').selectOption('beauty');
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Beauty'));
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Typical creator profit: unknown'));
    const scores=page.locator('.opportunity-framework .sample-niche-scorecard');
    assert.equal(await scores.count(),1,'Missing visible comparison of bounded niche inputs');
    assert.equal(await scores.locator('.sample-niche-scorecard-row').count(),4);
    assert((await scores.textContent()).includes('Sample native RPM median USD 10.22'));
    assert((await scores.textContent()).includes('One of six required axes observed; five missing'));
    assert((await scores.textContent()).includes('Opportunity rank: unavailable'));
    assert((await scores.textContent()).includes('Typical creator profit: unknown'));

    const tool=page.locator('.scenario-tool');
    await tool.locator('summary').click();
    assert.equal(await tool.locator('input').count(),8,'Missing required scenario inputs');
    assert((await tool.locator('.scenario-result').textContent()).includes('Enter all fields'));
    const values={currency:'USD',watch_views:'1000',watch_ad_only_rpm:'2',shorts_engaged_views:'2000',shorts_ad_only_rpm:'1',net_other_receipts:'5',cash_costs:'6',labor_hours:'3'};
    for(const [name,value] of Object.entries(values)) await tool.locator('input[name='+name+']').fill(value);
    await tool.locator('.scenario-stats').waitFor();
    assert((await tool.locator('.scenario-stats').textContent()).includes('1.00'),'Expected synthetic profit per hour');
    await tool.locator('.scenario-clear').click();
    assert((await tool.locator('.scenario-result').textContent()).includes('Enter all fields'));

    assert((await page.locator('.topic-activity-row').count())>=36,'Missing dated topic evidence');
    assert.equal(await page.locator('.usage-history-point').count(),7,'Missing dated U.S. adult usage series');
    assert.equal(await page.locator('.community-survey-year').count(),7,'Missing U.S. YouTube news trend');
    assert.equal(await page.locator('.community-profile-card').count(),12,'Missing U.S. news audience composition');
    const comparators=page.locator('.video-comparators');
    assert.equal(await comparators.locator('.video-comparator').count(),3,'Missing scoped video-product comparisons');
    await comparators.locator('summary').click();
    assert((await comparators.textContent()).includes('not been added as Mercata specimens'));
    assert((await comparators.textContent()).includes('general profitability: unknown'));
    assert.equal(await page.locator('.competition-tier').count(),5,'Missing sampled subscriber tiers');
    const fitness=page.locator('.health-fitness-research');
    assert.equal(await fitness.locator('.health-fitness-card').count(),9,'Missing fitness subcategory policy cards');
    await fitness.locator('summary').click();
    assert((await fitness.textContent()).includes('Unique audience, creator count and creator earnings: unknown'));
    assert((await fitness.textContent()).includes('medical misinformation'));
    assert((await fitness.textContent()).includes('does not automatically qualify'));
    const finance=page.locator('.finance-content');
    assert.equal(await finance.locator('.finance-content-card').count(),8,'Missing finance-content families');
    await finance.locator('summary').click();
    assert((await finance.textContent()).includes('investor warning does not determine'));
    assert((await finance.textContent()).includes('creator profits are unknown'));
    const technology=page.locator('.technology-subcultures');
    assert.equal(await technology.locator('.technology-subculture-card').count(),6,'Missing separate technology/video topics');
    assert.equal(await technology.locator('.technology-metric-card').count(),2,'Missing separate technology observation bases');
    await technology.locator('summary').click();
    assert((await technology.textContent()).includes('More than 250,000,000'));
    assert((await technology.textContent()).includes('More than 5,500,000,000'));
    assert((await technology.textContent()).includes('cannot be divided'));
    const developerPanel=technology.locator('.technology-developer-survey');
    assert.equal(await developerPanel.count(),1,'Missing separate developer learning survey');
    assert.equal(await developerPanel.locator('.technology-developer-survey-row').count(),3);
    assert((await developerPanel.textContent()).includes('41.1%'));
    assert((await developerPanel.textContent()).includes('25.8%'));
    assert((await developerPanel.textContent()).includes('58.4%'));
    assert((await developerPanel.textContent()).includes('not YouTube-exclusive'));
    assert((await developerPanel.textContent()).includes('no respondent records copied'));
    const commentNorms=page.locator('.comment-norms-evidence');
    assert.equal(await commentNorms.locator('.comment-norms-card').count(),2,'Missing distinct peer-reviewed comment samples');
    await commentNorms.locator('summary').click();
    assert((await commentNorms.textContent()).includes('just over 2%'));
    assert((await commentNorms.textContent()).includes('129 selected videos'));
    assert((await commentNorms.textContent()).includes('Association is not causation'));
    assert((await commentNorms.textContent()).includes('No individual comments or profiles are collected'));
    const collab=page.locator('.creator-collaboration-evidence');
    assert.equal(await collab.locator('.creator-fandom-cohort').count(),2,'Missing separate NRG fan survey age groups');
    assert.equal(await collab.locator('.creator-fandom-metric').count(),8,'Missing age-scoped fandom responses');
    await collab.locator('summary').click();
    assert((await collab.textContent()).includes('up to 10 collaborators'));
    assert((await collab.textContent()).includes('does not split collaboration payouts'));
    assert((await collab.textContent()).includes('No collaboration earnings'));
    const gameRelease=page.locator('.gaming-release-events');
    assert.equal(await gameRelease.locator('.gaming-release-card').count(),2,'Missing dated gaming launch events');
    assert.equal(await gameRelease.locator('.gaming-release-measure').count(),3,'Missing independently qualified gaming view units');
    await gameRelease.locator('summary').click();
    assert((await gameRelease.textContent()).includes('Over 50,000,000'));
    assert((await gameRelease.textContent()).includes('Over 93,000,000'));
    assert((await gameRelease.textContent()).includes('cannot be summed'));
    const nfl=page.locator('.nfl-seasonality');
    assert.equal(await nfl.locator('.nfl-seasonality-card').count(),4,'Missing measured NFL view/upload/offseason distinctions');
    await nfl.locator('summary').click();
    assert((await nfl.textContent()).includes('More than 20 billion'));
    assert((await nfl.textContent()).includes('not 30% seasonal growth'));
    assert((await nfl.textContent()).includes('must not be interpolated'));
    const styleQueries=page.locator('.beauty-fashion-query-series');
    assert.equal(await styleQueries.locator('.beauty-fashion-query-card').count(),5,'Missing source-scoped beauty/fashion title observations');
    await styleQueries.locator('summary').click();
    assert((await styleQueries.textContent()).includes('uploads, not views'));
    assert((await styleQueries.textContent()).includes('Year-over-year trend, unique people'));
    const animation=page.locator('.animation-format-cycles');
    assert.equal(await animation.locator('.animation-format-event').count(),4,'Missing dated animation editorial evidence');
    assert.equal(await animation.locator('.animation-format-survey').count(),7,'Missing distinct U.S./Mexico fan-survey items');
    await animation.locator('summary').click();
    assert((await animation.textContent()).includes('April 2025'));
    assert((await animation.textContent()).includes('no 2024–2026 audience growth rate'));
    const attention=page.locator('.video-attention-culture');
    assert.equal(await attention.locator('.video-attention-card').count(),2,'Missing independent video stock and niche survey studies');
    assert.equal(await attention.locator('.video-attention-observation').count(),11,'Missing measured dated stock, watch-time and survey items');
    await attention.locator('summary').click();
    assert((await attention.textContent()).includes('~29 billion'));
    assert((await attention.textContent()).includes('Distinct niche viewers'));
    assert((await attention.textContent()).includes('must not be added to 100%'));
    const historyLinking=page.locator('.historical-linking');
    assert.equal(await historyLinking.locator('.historical-link-card').count(),2,'Missing historical linking observations');
    await historyLinking.locator('summary').click();
    assert((await historyLinking.textContent()).includes('end of 2019'));
    assert((await historyLinking.textContent()).includes('not observed channel payout data'));
    assert.equal(await page.locator('.competition-traffic-item').count(),6,'Missing observed traffic shares');
    assert.equal(await page.locator('.academic-study').count(),4,'Missing scoped academic studies');
    const air=page.locator('.air-studio-benchmarks');
    assert.equal(await air.locator('.air-studio-card').count(),2,'Missing selected AIR RPM and live cohorts');
    await air.locator('summary').click();
    assert((await air.textContent()).includes('USD 2.30'));
    assert((await air.textContent()).includes('127 monetized livestreamers'));
    assert((await air.textContent()).includes('newcomer zero-earner share'));
    const lifecycle=page.locator('.lifecycle-horizons');
    assert.equal(await lifecycle.locator('.lifecycle-horizon-card').count(),3,'Missing video lifecycle horizons');
    await lifecycle.locator('summary').click();
    assert((await lifecycle.textContent()).includes('30 days after publishing'));
    assert((await lifecycle.textContent()).includes('365 days after publishing'));
    assert.equal(await lifecycle.locator('.lifecycle-horizon-unknown').count(),3,'Unsupported earnings shown as measured');
    const otherIncome=page.locator('.cross-platform-income');
    assert.equal(await otherIncome.locator('.cross-platform-income-card').count(),3,'Missing selected cross-platform income studies');
    await otherIncome.locator('summary').first().click();
    assert((await otherIncome.textContent()).includes('not representative YouTube creator earnings'));
    assert((await otherIncome.textContent()).includes('same underlying respondents'));
    assert((await otherIncome.textContent()).includes('Typical YouTube income: unknown'));
    assert((await otherIncome.textContent()).includes('5,095 respondents'),'Missing bounded CreatorIQ 2026 survey');

    const newcomer=page.locator('.newcomer-income');
    assert.equal(await newcomer.locator('.newcomer-gate').count(),5,'Missing newcomer income methodology gates');
    await newcomer.locator('summary').click();
    assert((await newcomer.textContent()).includes('Median native payout: unknown'));
    assert((await newcomer.textContent()).includes('Zero-income share: unknown'));
    assert.equal(await page.locator('.income-evidence .income-study').count(),1,'Missing scoped creator earnings study');
    assert.equal(await page.locator('.small-channel-income .income-table').count(),3,'Missing sampled channel month, country and niche tables');
    assert((await page.locator('#dossier-view .demographic-row').count())>=20,'Missing demographic data');
    const overflowReport=await page.evaluate(()=>{
      const viewportWidth=document.documentElement.clientWidth;
      const documentWidth=document.documentElement.scrollWidth;
      const offenders=[...document.querySelectorAll('body *')].map(element=>{
        const rect=element.getBoundingClientRect();
        return {element,rect};
      }).filter(({rect})=>rect.right>viewportWidth+1 && rect.width>1)
        .sort((a,b)=>b.rect.right-a.rect.right).slice(0,12)
        .map(({element,rect})=>({
          tag:element.tagName.toLowerCase(),
          className:typeof element.className==='string'?element.className.slice(0,100):'',
          right:Math.round(rect.right),
          width:Math.round(rect.width)
        }));
      const unclipped=offenders;
      const visibleOffenders=[...document.querySelectorAll('body *')].flatMap(element=>{
        const rect=element.getBoundingClientRect();
        if(rect.right<=viewportWidth+1||rect.width<=1)return [];
        let ancestor=element.parentElement;
        while(ancestor){
          const style=getComputedStyle(ancestor);
          if(['auto','scroll','hidden','clip'].includes(style.overflowX) &&
             ancestor.getBoundingClientRect().right<=viewportWidth+1)return [];
          ancestor=ancestor.parentElement;
        }
        return [{
          tag:element.tagName.toLowerCase(),
          className:typeof element.className==='string'?element.className.slice(0,100):'',
          right:Math.round(rect.right),
          width:Math.round(rect.width)
        }];
      }).sort((a,b)=>b.right-a.right).slice(0,15);
      return {viewportWidth,documentWidth,visibleOffenders,offenders:unclipped};
    });
    await page.screenshot({path:path.join(root,'screenshots','mercata-'+size.name+'.png'),fullPage:false});
    assert(overflowReport.documentWidth<=overflowReport.viewportWidth+1,
      'Horizontal overflow in '+size.name+' viewport: '+JSON.stringify(overflowReport));
    await page.locator('#theme').selectOption('dark');
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('#theme').inputValue(),'dark','Saved theme should persist');
    assert.deepEqual(errors,[],'Page JavaScript errors');
    assert.deepEqual(failedRequests,[],'Failed local assets');
    await context.close();
    process.stdout.write('PASS '+size.name+': catalog, YouTube dossier, demographics, topics, theme and layout\n');
  }
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}

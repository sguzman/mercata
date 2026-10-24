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
    page.on('pageerror',e=>errors.push(String(e)));
    const failedRequests=[];
    page.on('requestfailed',request=>failedRequests.push(request.url()));
    await page.goto(base,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('#count-specimens')?.textContent==='26');
    assert.equal(await page.locator('#theme').inputValue(),'system','System theme should be default');
    await page.locator('#search').fill('YouTube');
    assert.equal(await page.locator('#catalog-grid .specimen-card').count(),1,'YouTube filter');
    await page.locator('#catalog-grid .specimen-card a.inline-link').click();
    await page.locator('#dossier-view h3').first().waitFor();
    assert.equal(await page.locator('#dossier-view h3').first().textContent(),'YouTube');
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
    assert.equal(await page.locator('.earning-gate-details').count(),16,'Missing product-specific eligibility checklists');
    assert.equal(await page.locator('.application-stage').count(),9,'Missing application stages');
    const production=page.locator('.production-costs');
    assert.equal(await production.locator('.production-cost-group').count(),2,'Missing money and time classes');
    assert.equal(await production.locator('.production-cost-item').count(),20,'Incomplete creator cost taxonomy');
    await production.locator('.production-costs-details > summary').click();
    assert.equal(await production.locator('.adjacent-cost-survey').count(),1);
    await production.locator('.adjacent-cost-survey > summary').click();
    assert.equal(await production.locator('.adjacent-cost-bin').count(),11);
    assert((await production.textContent()).includes('Not a causal comparison.'));
    assert((await production.textContent()).includes('not a YouTube zero-earner estimate'));
    assert((await production.textContent()).includes('typical production hours: unknown'));
    const onboarding=page.locator('.channel-onboarding');
    assert.equal(await onboarding.locator('.channel-onboarding-stage').count(),6,'Missing publishing access stages');
    assert.equal(await onboarding.locator('.channel-feature-gate').count(),4,'Missing independent feature gates');
    const ownership=page.locator('.ownership-continuity');
    assert.equal(await ownership.locator('.ownership-card').count(),5,'Missing channel management and continuity operations');
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
    assert.equal(await page.locator('.creator-growth-stage').count(),6,'Missing audience lifecycle stages');
    assert.equal(await page.locator('.creator-growth-metric').count(),17,'Missing audience measurement glossary');
    assert.equal(await page.locator('.content-format-card').count(),8,'Missing format-by-format comparison');
    const language=page.locator('.multilingual-distribution');
    assert.equal(await language.locator('.multilingual-product-card').count(),6,'Missing multilingual feature catalog');
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
    assert.equal(await page.locator('.payout-currency').count(),2,'Missing documented payout currencies');
    assert((await page.locator('.topic-catalogue-card').count())>=32,'Missing community taxonomy');
    const sampling=page.locator('.sampling-budget');
    assert.equal(await sampling.locator('.sampling-budget-card').count(),4,'Missing API sampling limits');
    await sampling.locator('summary').click();
    assert((await sampling.textContent()).includes('48 search calls'));
    assert((await sampling.textContent()).includes('actual distinct videos, creators and viewers unknown'));
    assert.equal(await page.locator('.community-card').count(),1,'Missing event-specific measured community');
    assert.equal(await page.locator('.opportunity-method-item').count(),10,'Missing economic opportunity framework');
    await page.locator('.opportunity-method-details > summary').click();
    const niche=page.locator('.niche-explorer');
    assert.equal(await niche.locator('select option').count(),32,'Missing research topics');
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Gaming'));
    await niche.locator('select').selectOption('beauty');
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Beauty'));
    assert((await niche.locator('.niche-explorer-report').textContent()).includes('Typical creator profit: unknown'));

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

    assert((await page.locator('.topic-activity-row').count())>=31,'Missing topic evidence');
    assert.equal(await page.locator('.usage-history-point').count(),7,'Missing dated U.S. adult usage series');
    assert.equal(await page.locator('.community-survey-year').count(),7,'Missing U.S. YouTube news trend');
    assert.equal(await page.locator('.community-profile-card').count(),12,'Missing U.S. news audience composition');
    const comparators=page.locator('.video-comparators');
    assert.equal(await comparators.locator('.video-comparator').count(),3,'Missing scoped video-product comparisons');
    await comparators.locator('summary').click();
    assert((await comparators.textContent()).includes('not been added as Mercata specimens'));
    assert((await comparators.textContent()).includes('general profitability: unknown'));
    assert.equal(await page.locator('.competition-tier').count(),5,'Missing sampled subscriber tiers');
    const historyLinking=page.locator('.historical-linking');
    assert.equal(await historyLinking.locator('.historical-link-card').count(),2,'Missing historical linking observations');
    await historyLinking.locator('summary').click();
    assert((await historyLinking.textContent()).includes('end of 2019'));
    assert((await historyLinking.textContent()).includes('not observed channel payout data'));
    assert.equal(await page.locator('.competition-traffic-item').count(),6,'Missing observed traffic shares');
    assert.equal(await page.locator('.academic-study').count(),4,'Missing scoped academic studies');
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

import assert from 'node:assert/strict';
import {readFile, mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {firefox} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.md':'text/plain'};
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
    assert((await page.locator('.topic-catalogue-card').count())>=28,'Missing community taxonomy');
    assert((await page.locator('.topic-activity-row').count())>=14,'Missing topic evidence');
    assert((await page.locator('#dossier-view .demographic-row').count())>=20,'Missing demographic data');
    const bodyOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
    assert.equal(bodyOverflow,false,'Horizontal overflow in '+size.name+' viewport');
    await page.screenshot({path:path.join(root,'screenshots','mercata-'+size.name+'.png'),fullPage:false});
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

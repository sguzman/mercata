// Maintain only *current* Steam progress summaries; historical checkpoints remain immutable.
// Usage: node scripts/sync-steam-status.mjs --check | --write
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const FILES=['README.md','gallery/README.md','plans/steam.md','pipeline/README.md','roadmap/README.md'];
export function metricsFromSteam(plan,queue,dossier){
 if(!plan||!queue||!dossier||!Array.isArray(plan.detail_tasks)||!Array.isArray(queue.queues)||!Array.isArray(dossier.evidence)||!Array.isArray(dossier.claims))throw new TypeError('Missing Steam data');
 const a=plan.detail_tasks.map(t=>t.percent),b=queue.queues.flatMap(g=>(g.tasks||[]).map(t=>t.progress)),scores=[...a,...b];
 if(a.length!==209||b.length!==84||scores.some(x=>!Number.isInteger(x)||x<0||x>100))throw new RangeError('Steam requires original 293 valid scores');
 const exact=scores.reduce((sum,n)=>sum+n,0)/293,rounded=Math.round(exact);
 if(plan.progress_percent!==rounded)throw new RangeError('Recorded Steam percent does not match tasks');
 return {exact,rounded,sources:dossier.evidence.length,claims:dossier.claims.length};
}
function change(text,pattern,value,label){
 const found=[...text.matchAll(pattern)];
 if(found.length!==1)throw new Error('Expected one current '+label+' anchor; found '+found.length);
 return text.replace(pattern,value);
}
export function synchronizeSteamTexts(input,m){
 const f={...input},n=m.rounded;
 for(const file of FILES)if(typeof f[file]!=='string')throw new TypeError('Missing '+file);
 f['README.md']=change(f['README.md'],/Steam research is underway at \d+% across its fixed 293-task inventory/g,'Steam research is underway at '+n+'% across its fixed 293-task inventory','README headline');
 f['README.md']=change(f['README.md'],/Steam research is \*\*\d+% complete\*\* across its fixed inventory/g,'Steam research is **'+n+'% complete** across its fixed inventory','README study');
 f['gallery/README.md']=change(f['gallery/README.md'],/Steam has \*\*\d+% source-backed research progress/g,'Steam has **'+n+'% source-backed research progress','gallery headline');
 f['gallery/README.md']=change(f['gallery/README.md'],/\| \[Steam\]\(\.\.\/specimens\/steam\.json\) \| games \| \*\*Researching, \d+%\*\*/g,'| [Steam](../specimens/steam.json) | games | **Researching, '+n+'%**','gallery row');
 f['plans/steam.md']=change(f['plans/steam.md'],/\*\*Current progress is \d+% task-weighted\.\*\*/g,'**Current progress is '+n+'% task-weighted.**','study heading');
 f['pipeline/README.md']=change(f['pipeline/README.md'],/Steam research now has \*\*\d+% task-weighted progress\*\*/g,'Steam research now has **'+n+'% task-weighted progress**','pipeline');
 const lines=f['roadmap/README.md'].split('\n');
 const ix=lines.flatMap((line,i)=>line.startsWith('**Current Steam research checkpoint (')?[i]:[]);
 if(ix.length!==1)throw new Error('Expected one current roadmap checkpoint');
 let line=lines[ix[0]];
 line=change(line,/\*\*\d+%\*\* \(exact \*\*\d+(?:\.\d+)?%\*\*\)/g,'**'+n+'%** (exact **'+m.exact.toFixed(3)+'%**)','roadmap score');
 line=change(line,/\*\*\d+ public sources\*\* and \*\*\d+ source-linked claims\*\*/g,'**'+m.sources+' public sources** and **'+m.claims+' source-linked claims**','roadmap sources');
 lines[ix[0]]=line;f['roadmap/README.md']=lines.join('\n');
 return f;
}
function main(){
 const mode=process.argv[2]||'--check';
 if(mode!=='--check'&&mode!=='--write')throw new TypeError('Expected --check or --write');
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const read=p=>fs.readFileSync(path.join(root,p),'utf8');
 const m=metricsFromSteam(JSON.parse(read('plans/steam.json')),JSON.parse(read('queues/steam.json')),JSON.parse(read('specimens/steam.json')));
 const files=Object.fromEntries(FILES.map(f=>[f,read(f)]));
 const next=synchronizeSteamTexts(files,m),stale=FILES.filter(f=>files[f]!==next[f]);
 if(mode==='--check'&&stale.length){console.error('Out of sync: '+stale.join(', '));process.exitCode=1;}
 if(mode==='--write')for(const f of stale)fs.writeFileSync(path.join(root,f),next[f]);
 console.log('Steam '+m.exact.toFixed(3)+'% (rounded '+m.rounded+'%), '+m.sources+' sources, '+m.claims+' claims; '+stale.length+' status updates required');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();

// Keep current itch.io progress summaries aligned to the authoritative study plan.
// Historical milestone percentages in research notes are intentionally unchanged.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const statusFiles = ['README.md','ontology/itch-io/README.md','plans/itch-io.md','gallery/README.md'];
function replaceExactlyOnce(source, pattern, next, label) {
 const flags=pattern.flags.includes('g')?pattern.flags:pattern.flags+'g';
 const matches=[...source.matchAll(new RegExp(pattern.source,flags))];
 if(matches.length!==1)throw new Error(label+' requires exactly one progress anchor; found '+matches.length);
 return source.replace(pattern,next);
}
export function alignItchText(filename,source,percent) {
 if(!Number.isInteger(percent)||percent<0||percent>100)throw new RangeError('Invalid progress percentage');
 switch(filename) {
 case 'README.md':
  return replaceExactlyOnce(source,/evidence-scored progress is now \d+%/,'evidence-scored progress is now '+percent+'%',filename);
 case 'ontology/itch-io/README.md': {
  const a=replaceExactlyOnce(source,/Research is underway: \d+%/,'Research is underway: '+percent+'%',filename+' introduction');
  return replaceExactlyOnce(a,/^- \d+% task-weighted research scoring/m,'- '+percent+'% task-weighted research scoring',filename+' status');
 }
 case 'plans/itch-io.md':
  return replaceExactlyOnce(source,/Research is now \*\*\d+%\*\*/,'Research is now **'+percent+'%**',filename);
 case 'gallery/README.md': {
  const a=replaceExactlyOnce(source,/itch.io has source-linked economic research underway and is \d+% through/,'itch.io has source-linked economic research underway and is '+percent+'% through',filename+' introduction');
  return replaceExactlyOnce(a,/Researching: \d+% task-weighted evidence/,'Researching: '+percent+'% task-weighted evidence',filename+' table');
 }
 default: throw new Error('Unsupported status page: '+filename);
 }
}
export function expectedItchStatus(root=process.cwd()) {
 const plan=JSON.parse(fs.readFileSync(path.join(root,'plans/itch-io.json'),'utf8'));
 if(plan.total_tracked_tasks!==244||!Number.isInteger(plan.progress_percent))throw new Error('Unexpected itch.io study plan');
 return plan.progress_percent;
}
export function syncItchStatus(root=process.cwd()) {
 const percent=expectedItchStatus(root);
 const changes=[];
 for(const filename of statusFiles) {
  const filepath=path.join(root,filename);
  const before=fs.readFileSync(filepath,'utf8');
  const after=alignItchText(filename,before,percent);
  if(before!==after){fs.writeFileSync(filepath,after);changes.push(filename);}
 }
 return {percent,changes};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const result=syncItchStatus(process.cwd());
 process.stdout.write('itch.io '+result.percent+'%: '+(result.changes.join(', ')||'already synced')+'\n');
}

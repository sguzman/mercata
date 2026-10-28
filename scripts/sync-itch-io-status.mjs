// Keep current itch.io progress summaries aligned to the authoritative study plan.
// Historical milestone percentages in research notes are intentionally unchanged.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditItchTaskScores} from './itch-task-score-audit.mjs';
import {alignItchLiveEvidenceProgress} from './align-itch-io-research-progress.mjs';

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
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
 return auditItchTaskScores(read('plans/itch-io.json'),read('queues/itch-io.json'),
  read('ontology/itch-io/research-synthesis-2026.json')).rounded_percent;
}
export function syncItchStatus(root=process.cwd()) {
 const read=name=>fs.readFileSync(path.join(root,name),'utf8');
 const originals={
  'plans/itch-io.json':read('plans/itch-io.json'),
  'ontology/itch-io/research-synthesis-2026.json':read('ontology/itch-io/research-synthesis-2026.json'),
  'ontology/itch-io/research-synthesis-2026.md':read('ontology/itch-io/research-synthesis-2026.md')
 };
 const current=alignItchLiveEvidenceProgress(JSON.parse(originals['plans/itch-io.json']),
  JSON.parse(read('queues/itch-io.json')),
  JSON.parse(originals['ontology/itch-io/research-synthesis-2026.json']),
  originals['ontology/itch-io/research-synthesis-2026.md']);
 const proposed={
  'plans/itch-io.json':JSON.stringify(current.plan,null,2)+'\n',
  'ontology/itch-io/research-synthesis-2026.json':JSON.stringify(current.synthesis,null,2)+'\n',
  'ontology/itch-io/research-synthesis-2026.md':current.markdown
 };
 // Fail closed for a malformed summary before writing any of the live score files.
 for(const filename of statusFiles)proposed[filename]=alignItchText(filename,read(filename),current.rounded);
 const changes=[];
 for(const [filename,after] of Object.entries(proposed)){
  const was=originals[filename]??read(filename);
  if(was!==after){fs.writeFileSync(path.join(root,filename),after);changes.push(filename);}
 }
 return {percent:current.rounded,changes};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const result=syncItchStatus(process.cwd());
 process.stdout.write('itch.io '+result.percent+'%: '+(result.changes.join(', ')||'already synced')+'\n');
}

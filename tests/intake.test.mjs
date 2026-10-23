import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pickColor,toHex,deltaE,verifyPalette} from '../scripts/palette.mjs';

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('assigns different stable, in-gamut colors and preserves earlier colors', () => {
  const assigned = [];
  for (let i = 0; i < 32; i++) {
    const color = pickColor('synthetic-' + i, assigned);
    assert.equal(toHex(color.oklch), color.hex);
    assert(!assigned.some(x => x.hex === color.hex));
    if (assigned.length) assert(deltaE(color.oklch,assigned[0].oklch) > 0);
    assigned.push(color);
  }
  verifyPalette(assigned.map((color,i) => ({id:'synthetic-' + i,color})));
  const first = pickColor('synthetic-0', []);
  assert.deepEqual(first,assigned[0]);
});

test('intake generates full empty research record and rejects duplicates', async () => {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'mercata-test-'));
  try {
    for (const folder of ['gallery','pipeline','specimens','queues']) await fs.mkdir(path.join(root,folder));
    for (const file of ['gallery/index.json','pipeline/queues.json','pipeline/domains.json']) {
      await fs.copyFile(path.join(project,file),path.join(root,file));
    }
    const args=['scripts/intake.mjs','--name','Synthetic Platform','--url','https://example.org/','--domain','literature','--root',root];
    execFileSync(process.execPath,args,{cwd:project,stdio:'pipe'});
    const dossier=JSON.parse(await fs.readFile(path.join(root,'specimens/synthetic-platform.json')));
    const queue=JSON.parse(await fs.readFile(path.join(root,'queues/synthetic-platform.json')));
    const gallery=JSON.parse(await fs.readFile(path.join(root,'gallery/index.json')));
    assert.equal(dossier.status,'queued');
    assert.deepEqual(dossier.claims,[]);
    assert.deepEqual(dossier.observations,[]);
    assert.equal(gallery.specimens.length,1);
    assert.equal(queue.queues.length,13);
    assert(queue.queues.flatMap(q=>q.tasks).length>=75);
    assert(queue.queues.every(q=>q.tasks.every(t=>t.progress===0 && t.evidence.length===0)));
    assert.throws(()=>execFileSync(process.execPath,args,{cwd:project,stdio:'pipe'}));
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});

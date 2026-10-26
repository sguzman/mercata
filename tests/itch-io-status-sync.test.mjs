import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {statusFiles,expectedItchStatus,alignItchText} from '../scripts/sync-itch-io-status.mjs';

test('All public itch.io progress summaries match machine task score',()=>{
 const score=expectedItchStatus();
 for(const file of statusFiles) {
  const content=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
  assert.equal(alignItchText(file,content,score),content,file+' is stale. Run node scripts/sync-itch-io-status.mjs');
 }
});
test('Status sync is idempotent and does not rewrite historical checkpoints',()=>{
 const example='Research is now **81%** at current status, while the June 2026 checkpoint was 26%.';
 assert.equal(alignItchText('plans/itch-io.md',example,83),
 'Research is now **83%** at current status, while the June 2026 checkpoint was 26%.');
 assert.throws(()=>alignItchText('README.md','No progress anchor',83),/requires exactly one/);
});

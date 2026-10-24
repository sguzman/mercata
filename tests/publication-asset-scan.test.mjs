import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditLocalPublicationMedia} from '../scripts/publication-asset-scan.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const rights=JSON.parse(fs.readFileSync(path.join(root,'ontology/youtube/publication-rights.json'),'utf8'));
test('Checked-in repository media inventory matches the two explicitly reviewed SVG paths',()=>{
 const result=auditLocalPublicationMedia(root,rights);
 assert.equal(result.metadata_inventory_valid,true,JSON.stringify(result.errors));
 assert.deepEqual(result.media,['assets/favicon.svg','assets/swatch.svg']);
 assert.deepEqual(result.remoteEmbeds,[]);
 assert.equal(result.copyright_clearance_established,false);
});
test('Unregistered image or embedded externally fetched media fails publication inventory',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'mercata-publish-test-'));
 try{
  fs.mkdirSync(path.join(temp,'site'),{recursive:true});
  fs.writeFileSync(path.join(temp,'site','unreviewed.png'),'synthetic file bytes');
  fs.writeFileSync(path.join(temp,'site','styles.css'),'p{background:url(https://example.org/image.png)}');
  const result=auditLocalPublicationMedia(temp,{reviewed_original_graphics:[],third_party_asset_manifest:[]});
  assert.equal(result.metadata_inventory_valid,false);
  assert(result.unregistered.includes('site/unreviewed.png'));
  assert(result.remoteEmbeds.includes('site/styles.css'));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});

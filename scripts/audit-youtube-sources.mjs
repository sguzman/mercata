import fs from 'node:fs';
import path from 'node:path';
import {auditPublicSources} from './source-provenance.mjs';
const root=path.resolve(process.argv[2]||process.cwd());
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dossier=load('specimens/youtube.json');
const family=load('ontology/youtube/source-families.json');
const report=auditPublicSources(dossier.evidence,dossier.claims,family);
process.stdout.write(JSON.stringify(report,null,2)+'\n');
if(report.unregistered_duplicate_documents.length||
   report.invalid_source_family_records.length||
   report.missing_claim_sources.length||
   report.missing_retrieval_dates.length) process.exitCode=1;

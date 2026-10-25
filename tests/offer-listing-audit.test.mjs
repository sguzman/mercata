import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditListingSurfaces} from '../site/offer-listing-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Native video metadata, memberships and merchant product tags have distinct money units',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/offer-listing-controls-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditListingSurfaces(d,new Set(record.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.deepEqual(d.surfaces.map(x=>x.id),['ordinary_video_presentation','channel_membership_levels','youtube_shopping_own_products']);
 assert(d.surfaces.every(x=>x.observed_purchase_rate===null));
});
test('Offer audit rejects a video sale, nonexistent membership tiers, and merchant gross as creator earnings',async()=>{
 const [d,record]=await Promise.all([load('ontology/youtube/offer-listing-controls-2026.json'),load('specimens/youtube.json')]),ids=new Set(record.evidence.map(x=>x.id)),copy=()=>structuredClone(d);
 const video=copy();video.surfaces[0].buyer_transaction_on_listing=true;assert(!auditListingSurfaces(video,ids).valid);
 const tiers=copy();tiers.surfaces[1].max_levels=25;assert(!auditListingSurfaces(tiers,ids).valid);
 const sale=copy();sale.surfaces[2].creator_net_price=100;assert(!auditListingSurfaces(sale,ids).valid);
});

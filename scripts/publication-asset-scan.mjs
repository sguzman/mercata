// Repository-local media inventory guard. Complements, never replaces, rights review.
import fs from 'node:fs';
import path from 'node:path';

const mediaExtensions=new Set(['.svg','.png','.jpg','.jpeg','.gif','.webp','.avif','.mp4','.webm','.mp3','.wav','.ogg','.woff','.woff2','.ttf','.otf','.pdf']);
const excludedDirectories=new Set(['.git','node_modules','.cache','coverage','playwright-report','test-results','dist']);
export function auditLocalPublicationMedia(root,rightsRecord){
  const media=[],remoteEmbeds=[],errors=[];
  const walk=(directory)=>{
    for(const ent of fs.readdirSync(directory,{withFileTypes:true})){
      if(ent.isSymbolicLink())continue;
      if(ent.isDirectory()){if(!excludedDirectories.has(ent.name))walk(path.join(directory,ent.name));continue;}
      if(!ent.isFile())continue;
      const absolute=path.join(directory,ent.name);
      const relative=path.relative(root,absolute).split(path.sep).join('/');
      if(mediaExtensions.has(path.extname(ent.name).toLowerCase()))media.push(relative);
      if(relative==='index.html'||relative.startsWith('site/')&&/\.(html|css)$/.test(relative)){
        const content=fs.readFileSync(absolute,'utf8');
        if(/<(?:img|video|audio|source|iframe)\b[^>]*\bsrc\s*=\s*['"]https?:\/\//i.test(content)||
          /url\(\s*['"]?https?:\/\//i.test(content))
          remoteEmbeds.push(relative);
      }
    }
  };
  walk(root);
  media.sort();
  const permitted=new Set((rightsRecord?.reviewed_original_graphics||[]).map(x=>x.path));
  const external=new Set((rightsRecord?.third_party_asset_manifest||[]).map(x=>x.path));
  const unregistered=media.filter(x=>!permitted.has(x)&&!external.has(x));
  for(const file of unregistered)errors.push('Local media file not enrolled in rights review: '+file);
  for(const file of remoteEmbeds)errors.push('Remote embedded media requiring rights review: '+file);
  for(const file of permitted)if(!media.includes(file))errors.push('Expected original asset absent: '+file);
  return {metadata_inventory_valid:errors.length===0,media,remoteEmbeds,unregistered,errors,
    // Even a complete media-path inventory does not examine prose quotes, licenses, datasets or artwork provenance.
    copyright_clearance_established:false};
}

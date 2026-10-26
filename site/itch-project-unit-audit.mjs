// Catalog unit audit: no external APIs, scraped pages, user identities or purchases.
function nonempty(x){return typeof x==='string'&&x.trim().length>0;}
export function auditItchProjectUnits(pages){
 if(!Array.isArray(pages))throw new TypeError('Project pages array required');
 const errors=[],seenPages=new Set();
 let files=0,channels=0,builds=0, demos=0,browserArchives=0;
 for(const page of pages){
  if(!page||!nonempty(page.page_id)){errors.push('Missing project page identifier');continue;}
  if(seenPages.has(page.page_id)){errors.push('Duplicate project page');continue;}
  seenPages.add(page.page_id);
  if(!Array.isArray(page.uploads)||!Array.isArray(page.channels)){errors.push('Project lacks upload/channel arrays');continue;}
  const seenUploads=new Set(),seenChannels=new Set();
  for(const f of page.uploads){
   if(!nonempty(f.file_id)||seenUploads.has(f.file_id)){errors.push('Duplicate or invalid upload identifier');continue;}
   seenUploads.add(f.file_id);
   if(!['demo','game_download','html5_archive','game_asset','bonus_content'].includes(f.type)){errors.push('Unknown upload type');continue;}
   files++;
   if(f.type==='demo')demos++;
   if(f.type==='html5_archive')browserArchives++;
  }
  for(const channel of page.channels){
   if(!nonempty(channel.channel_id)||seenChannels.has(channel.channel_id)){errors.push('Duplicate or invalid build channel');continue;}
   seenChannels.add(channel.channel_id);
   if(!Array.isArray(channel.build_ids)){errors.push('Missing build revision list');continue;}
   const unique=new Set(channel.build_ids);
   if(unique.size!==channel.build_ids.length||channel.build_ids.some(x=>!nonempty(x)))errors.push('Invalid or repeated build revision identifiers');
   else {channels++;builds+=unique.size;}
  }
 }
 return {valid:errors.length===0,errors,project_page_count:seenPages.size,file_upload_count:files,
  channel_count:channels,build_revision_count:builds,demo_upload_count:demos,browser_archive_upload_count:browserArchives,
  distinct_selling_people:null,active_paid_publishers:null,positive_price_game_count:null,paid_orders:null,unique_buyers:null,profit:null,
  note:'Page, file, channel and revision events are not purchases or publisher income.'
 };
}

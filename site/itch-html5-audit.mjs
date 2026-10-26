// Inspect a proposed HTML5 ZIP's extracted manifest, not a live build.
export function assessHtml5Manifest({files}={}){
 if(!Array.isArray(files))throw new TypeError('Provide an array of extracted file records');
 let bytes=0;const names=new Set();const issues=[];
 for(const file of files){
  if(typeof file?.path!=='string'||file.path.length===0||!Number.isSafeInteger(file.bytes)||file.bytes<0)
   throw new TypeError('Every file must have a relative path and nonnegative integer byte count');
  if(file.path.startsWith('/')||file.path.includes('\\')||file.path.split('/').includes('..'))
   issues.push('unsafe_path:'+file.path);
  if(names.has(file.path))issues.push('duplicate_path:'+file.path);
  names.add(file.path);
  if([...file.path].length>240)issues.push('path_length:'+file.path);
  if(file.bytes>200000000)issues.push('large_file:'+file.path);
  bytes+=file.bytes;
 }
 if(files.length>1000)issues.push('file_count_exceeds_1000');
 if(bytes>500000000)issues.push('extracted_size_exceeds_500mb');
 if(!names.has('index.html'))issues.push('missing_root_index_html');
 if(!Number.isSafeInteger(bytes))issues.push('total_bytes_not_safe_integer');
 return {static_manifest_ok:issues.length===0,issues,extracted_file_count:files.length,
 extracted_bytes:bytes,game_runs:null,works_on_mobile:null,accepts_paid_browser_access:false,
 caveat:'Static limits only; real ZIP parsing and runtime QA are not performed.'};
}

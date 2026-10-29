import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(readFileSync(resolve(root,'seo/pages.json'),'utf8'));
const check=process.argv.includes('--check');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const [path,page] of Object.entries(config)){
 const file=resolve(root,path);let html=readFileSync(file,'utf8');const before=html;
 if(page.title.length>60||page.description.length>155)throw Error('Metadata too long: '+path);
 const url=new URL(page.canonical);if(url.origin!=='https://www.gabsinteriors.com.ng')throw Error('Wrong canonical: '+path);
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(page.title)+'</title>');
 for(const name of ['name="description"','property="og:description"','name="twitter:description"'])html=html.replace(new RegExp('<meta '+name+' content="[^"]*">'),'<meta '+name+' content="'+escape(page.description)+'">');
 for(const name of ['property="og:title"','name="twitter:title"'])html=html.replace(new RegExp('<meta '+name+' content="[^"]*">'),'<meta '+name+' content="'+escape(page.title)+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+page.canonical+'">');
 html=html.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+page.canonical+'">');
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,json)=>{
  const schema=JSON.parse(json);
  for(const entity of schema['@graph']||[]){
   if(entity['@type']==='WebPage'){entity.name=page.title;entity.description=page.description;entity.url=page.canonical;}
   if(entity['@type']==='Service')entity.description=page.description;
  }
  return '<script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>';
 });
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)throw Error('Expected one primary heading: '+path);
 if(/<meta[^>]+content="[^"]*noindex/i.test(html))throw Error('Accidental noindex: '+path);
 if(check&&html!==before)throw Error('Generated metadata is stale: '+path);
 if(!check)writeFileSync(file,html);
 console.log((check?'Checked ':'Generated ')+path);
}


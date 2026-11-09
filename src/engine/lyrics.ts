import type { Section, Slide } from '../types';
export function titleFromLyrics(lyrics:string){const words=lyrics.match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’-]*/gu)||[];return words.slice(0,4).join(' ')}
export function detectSections(input:string):Section[]{
 const blocks=input.replace(/\r/g,'').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean); const counts=new Map<string,number>();
 const key=(s:string)=>s.toLocaleLowerCase().replace(/[.,!?;:'"“”‘’—–-]/g,'').replace(/\s+/g,' ').trim();
 const labelPattern=/^(verse\s*\d*|chorus|bridge|refrain|ending|intro|opening)\s*:?$/i;
 blocks.forEach(b=>{const lines=b.split('\n').map(x=>x.trim()).filter(Boolean);if(labelPattern.test(lines[0]||''))lines.shift();const k=lines.map(key).join('|');counts.set(k,(counts.get(k)||0)+1)});
 let verse=0;const seen=new Set<string>();return blocks.map((b,i)=>{const lines=b.split('\n').map(x=>x.trim()).filter(Boolean);const labelLine=labelPattern.test(lines[0]||'');const declared=labelLine?lines.shift()!:'';const k=lines.map(key).join('|');let label=declared?declared.replace(/:$/,''):counts.get(k)!>1?'Chorus':i===0?'Opening':`Verse ${++verse}`;if(counts.get(k)!>1&&seen.has(k))label='Chorus (repeat)';seen.add(k);return{id:crypto.randomUUID(),label,lines}});
}
export function generateSlides(sections:Section[],themeId:string):Slide[]{const slides:Slide[]=[];for(const section of sections){let page:string[]=[];const flush=()=>{if(page.length)slides.push({id:crypto.randomUUID(),text:page.join('\n'),themeId,transition:'fade'});page=[]};for(const line of section.lines){const max= line.length>52?2:3;if(page.length>=max||page.join(' ').length+line.length>120)flush();page.push(line)}flush()}return slides}

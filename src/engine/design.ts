import type { Theme } from '../types';
import { themes } from './themes';

const topicTerms: Record<string,string[]> = {
  'Heavenly Clouds':['heaven','glory','angel','eternity','eternal','heavenly','பரலோகம்','மகிமை','தூதர்','நித்தியம்'],
  'The Cross':['cross','calvary','sacrifice','blood','crucified','சிலுவை','கல்வாரி','பலியாய்','இரத்தம்'],
  'Creation of God':['creation','mountain','nature','earth','river','forest','படைப்பு','மலை','இயற்கை','பூமி','காடு'],
  'Still Waters':['peace','rest','stillness','trust','calm','சமாதானம்','அமைதி','இளைப்பாறு','நம்பிக்கை','இளைப்பாறுதல்'],
  'Royal Glory':['praise','victory','majesty','king','kingdom','triumph','வெற்றி','ஸ்தோத்திரம்','ராஜா','அரசாட்சி','துதி'],
  'Heavenly Sunrise':['sunrise','hope','new beginning','dawn','morning','renewal','நம்பிக்கை','புதிய','உதயம்','விடியல்','காலை'],
  'Deep Worship':['prayer','surrender','repentance','reverence','humble','ஜெபம்','ஒப்புக்கொடு','மனந்திரும்பு','தாழ்மை','ஆராதனை'],
  'Christmas Glory':['christmas','nativity','birth of','manger','bethlehem','கிறிஸ்துமஸ்','பிறப்பு','பெத்லகேம்','மாட்டுத்தொழுவம்'],
};
const fontOptions=['Poppins','Montserrat','Lato','Playfair Display','Cinzel','Cormorant Garamond','Libre Baskerville'];
export type DesignSelection={theme:Theme;font:string;textColor:string;recent:string[]};

export function selectDesign(lyrics:string,favourites:string[]=[],recent:string[]=[]):DesignSelection{
  const text=lyrics.toLocaleLowerCase();
  const scored=themes.map(theme=>{
    const terms=topicTerms[theme.category]||[];
    const hits=terms.reduce((count,term)=>count+(text.includes(term.toLocaleLowerCase())?1:0),0);
    const favorite=favourites.includes(theme.id)||favourites.includes(`theme:${theme.id}`)||favourites.includes(`background:${theme.id}`);
    const repeated=recent.indexOf(theme.id);
    const recencyMultiplier=repeated<0?1:Math.max(.24,.38+repeated*.18);
    // Semantic relevance is the main signal; favourites get a moderate boost,
    // while the final weighted draw and recency penalty keep variety.
    const relevance=1+hits*2.7;
    const preferenceMultiplier=favorite?1.45:1;
    return {theme,hits,weight:relevance*preferenceMultiplier*recencyMultiplier};
  });
  const strongestSignal=Math.max(...scored.map(item=>item.hits));
  // Require multiple independent lyric cues before narrowing the candidate pool;
  // when the topic is clear, keep unrelated categories out of the draw.
  const candidates=strongestSignal>=2?scored.filter(item=>item.hits>0):scored;
  const total=candidates.reduce((sum,item)=>sum+item.weight,0);
  let draw=Math.random()*total;
  const chosen=candidates.find(item=>(draw-=item.weight)<=0)?.theme||candidates[candidates.length-1].theme;
  const fontFavourites=favourites.map(item=>item.startsWith('font:')?item.slice(5):item).filter(item=>fontOptions.includes(item));
  const fonts=fontOptions.map(font=>({font,weight:fontFavourites.includes(font)?2.2:1}));
  const fontTotal=fonts.reduce((sum,item)=>sum+item.weight,0);
  draw=Math.random()*fontTotal;
  const font=fonts.find(item=>(draw-=item.weight)<=0)?.font||fontOptions[0];
  return {theme:chosen,font,textColor:chosen.text||'#fffaf0',recent:[chosen.id,...recent.filter(id=>id!==chosen.id)].slice(0,5)};
}

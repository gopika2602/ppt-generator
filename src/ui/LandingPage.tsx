import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, Download, Heart, Languages, Layers3, Menu, Play, Sparkles, WandSparkles, X } from 'lucide-react';
import { themes } from '../engine/themes';

type LandingPageProps = { onLogin: () => void; onRegister: () => void; onGuest: () => void };

const featureCards = [
  { icon: WandSparkles, title: 'Lyrics to slides, naturally', text: 'Detect verses and repeated choruses, then split each section into projector-friendly slides.' },
  { icon: Layers3, title: 'A worshipful design library', text: 'Choose from eight original theme families, each with its own atmosphere and palette.' },
  { icon: Languages, title: 'Made for Tamil and English', text: 'Keep Tamil Unicode intact, mix languages freely, and choose fonts with suitable glyph support.' },
  { icon: Heart, title: 'Your designs, remembered', text: 'Save songs and favourite looks to your personal library when your account is connected.' },
  { icon: Play, title: 'Present without friction', text: 'Move through slides in full-screen mode with keyboard or touch controls.' },
  { icon: Download, title: 'Editable PowerPoint files', text: 'Export real PPTX slides with editable lyric text and embedded backgrounds.' },
];

const steps = [
  ['01', 'Bring your words', 'Paste worship lyrics or enter a Bible verse. Your original wording stays yours.'],
  ['02', 'Choose the atmosphere', 'Pick a theme and refine its typography, glass panel, glow, and background.'],
  ['03', 'Create and present', 'Review every slide, make adjustments, then present live or download your deck.'],
];

export default function LandingPage({ onLogin, onRegister, onGuest }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const themeNames = ['Heavenly Sunrise', 'Deep Worship', 'Creation of God', 'The Cross', 'Royal Glory', 'Still Waters', 'Heavenly Clouds', 'Christmas Glory'];
  const previews = themeNames.map((name) => themes.find((theme) => theme.category === name && theme.image) ?? themes.find((theme) => theme.category === name)!);

  return <div className="marketing-site">
    <header className="marketing-nav">
      <a className="marketing-brand" href="#home" aria-label="PEACE SLIDES home">
        <span className="marketing-brand-mark"><Sparkles size={18}/></span>
        <span>PEACE <b>SLIDES</b><small>WORSHIP PRESENTATION STUDIO</small></span>
      </a>
      <nav className={`marketing-links ${menuOpen?'open':''}`} aria-label="Main navigation">
        <a className="active" href="#home" onClick={()=>setMenuOpen(false)}>Home</a><a href="#features" onClick={()=>setMenuOpen(false)}>Features</a><a href="#how-it-works" onClick={()=>setMenuOpen(false)}>How it works</a><a href="#themes" onClick={()=>setMenuOpen(false)}>Themes</a><a href="#about" onClick={()=>setMenuOpen(false)}>About</a>
      </nav>
      <div className="marketing-nav-actions"><button className="marketing-login" onClick={onLogin}>Log in</button><button className="marketing-start" onClick={onRegister}>Get started <ArrowRight size={15}/></button><button className="marketing-menu" aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</button></div>
    </header>

    <main>
      <section className="peace-hero" id="home">
        <div className="peace-hero-image" aria-hidden="true"/>
        <div className="peace-hero-shade" aria-hidden="true"/>
        <div className="peace-hero-content">
          <div className="peace-eyebrow"><span/> A QUIETER WAY TO CREATE WORSHIP SLIDES</div>
          <h1>Let every word<br/>find its <em>light.</em></h1>
          <p className="peace-hero-copy">Transform worship lyrics and Bible verses into beautiful, presentation-ready slides in moments.</p>
          <div className="peace-hero-actions"><button className="peace-button primary" onClick={onRegister}>Get started <ArrowRight size={17}/></button><a className="peace-button secondary" href="#features">Explore features <ArrowDown size={15}/></a></div>
          <button className="peace-guest-link" onClick={onGuest}>Try the local workspace without an account <ArrowRight size={13}/></button>
          <div className="peace-proof"><span><Check size={13}/> Tamil + English</span><span><Check size={13}/> Editable PowerPoint</span><span><Check size={13}/> Full-screen presenting</span></div>
        </div>
        <div className="peace-preview-wrap" aria-label="Example worship slide preview">
          <div className="peace-preview-label"><span className="preview-live-dot"/> A MOMENT OF WORSHIP <i>16:9</i></div>
          <div className="peace-slide-preview" style={{ backgroundImage: `linear-gradient(180deg,#12132918,#10102175),url(${themes.find(t=>t.id==='deep-photo')?.image})` }}>
            <div className="peace-slide-glass"><span>YOUR WORDS · BEAUTIFULLY PRESENTED</span><strong>Make space for<br/>the worship moment</strong><i/></div>
            <small>PEACE SLIDES</small>
          </div>
          <div className="peace-preview-footer"><span><b>Deep Worship</b><small>Soft blue glow · glass lyric panel</small></span><span className="preview-controls"><i/><i/><i/><i/></span></div>
        </div>
        <div className="peace-scroll-hint"><span/> SCROLL TO EXPLORE</div>
      </section>

      <section className="peace-feature-band" aria-label="Platform highlights"><div><span>01</span><b>Write</b><small>Paste lyrics or scripture</small></div><i/><div><span>02</span><b>Design</b><small>Find the right atmosphere</small></div><i/><div><span>03</span><b>Present</b><small>Share the moment</small></div></section>

      <section className="peace-section peace-features" id="features">
        <div className="peace-section-intro"><div className="peace-eyebrow"><span/> BUILT FOR THE WORSHIP TEAM</div><h2>Everything you need<br/>for the <em>gathered moment.</em></h2><p>PEACE SLIDES brings the words, visual design, and presentation tools together in one calm workspace.</p></div>
        <div className="peace-feature-grid">{featureCards.map(({icon:Icon,title,text},index)=><article className="peace-feature-card" key={title}><div className="peace-feature-icon"><Icon size={19}/></div><small>0{index+1}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="peace-workflow" id="how-it-works">
        <div className="peace-workflow-heading"><div className="peace-eyebrow"><span/> SIMPLE BY DESIGN</div><h2>From words to worship<br/><em>in three quiet steps.</em></h2></div>
        <div className="peace-steps">{steps.map(([number,title,text],index)=><article key={number}><span className="peace-step-no">{number}</span><div className="peace-step-line"><i className={index===0?'lit':''}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="peace-theme-section" id="themes">
        <div className="peace-theme-heading"><div><div className="peace-eyebrow"><span/> A PLACE FOR EVERY SONG</div><h2>Choose the <em>feeling.</em></h2><p>Eight distinct visual worlds, from the stillness of water to the warmth of sunrise.</p></div><button className="peace-text-action" onClick={onRegister}>Explore the studio <ArrowRight size={15}/></button></div>
        <div className="peace-theme-strip">{previews.map((theme,index)=><button key={theme.id} className={`peace-theme-tile theme-tile-${index+1}`} onClick={onRegister} style={{background:theme.image?`linear-gradient(180deg,#11132100 22%,#0b0d16d9 100%),url(${theme.image}) center / cover no-repeat`:theme.background}}><span>{theme.name}</span><i><ArrowRight size={14}/></i></button>)}</div>
      </section>

      <section className="peace-final-cta" id="about"><div className="peace-cta-glow"/><div className="peace-eyebrow"><span/> FOR THE MOMENTS THAT MATTER</div><h2>Make every worship<br/>presentation <em>beautiful.</em></h2><p>Bring your lyrics, your team, and your next gathering into PEACE SLIDES.</p><button className="peace-button primary" onClick={onRegister}>Get started <ArrowRight size={17}/></button></section>
    </main>
    <footer className="peace-footer"><a className="marketing-brand" href="#home"><span className="marketing-brand-mark"><BookOpen size={17}/></span><span>PEACE <b>SLIDES</b><small>WORSHIP PRESENTATION STUDIO</small></span></a><span>Made with care for the gathered church.</span><a href="#home">Back to top <ChevronRight size={14}/></a></footer>
  </div>;
}

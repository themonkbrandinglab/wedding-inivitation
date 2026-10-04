import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, Navigation, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { weddingData, eventDate, eventTime, eventTimestamp, directionsUrl, calendarUrl, type WeddingEvent } from '@/lib/wedding-data';
import dawn from '@/assets/lotus-dawn-hero.jpg';
import door from '@/assets/thoranam-door.jpg';
import lotus from '@/assets/lotus-petal.png';
import engagement from '@/assets/engagement.jpg';
import bangles from '@/assets/bangles.jpg';
import muhurtham from '@/assets/muhurtham.jpg';
import receptionStage from '@/assets/reception-stage.jpg';
import pond from '@/assets/final-pond.jpg';

const eventImages: Record<WeddingEvent['id'], string> = { engagement, bangleCeremony: bangles, muhurtham, reception: receptionStage };

const { bride, groom } = weddingData;

export const Route = createFileRoute('/')({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Aruna × Aravind | A Tale of Dawn & Lotus' },
    { name: 'description', content: 'Join Aruna and Aravind in Bengaluru and Salem for a celebration of love, light, and new beginnings.' },
    { property: 'og:title', content: 'Aruna × Aravind | A Tale of Dawn & Lotus' },
    { property: 'og:description', content: 'A cinematic Tamil wedding invitation. Celebrate with us in Bengaluru and Salem.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Invitation,
});

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
function useCinematicPointer() {
  useEffect(() => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.tilt');
      document.querySelectorAll<HTMLElement>('.tilt.tilting').forEach(t => { if (t !== el) { t.classList.remove('tilting'); t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); } });
      if (!el) return;
      const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      el.classList.add('tilting');
      el.style.setProperty('--rx', `${(0.5 - y) * 3}deg`); el.style.setProperty('--ry', `${(x - 0.5) * 4}deg`);
      el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
}
function Petals({ count = 7 }: { count?: number }) {
  return <div className="petal-drift" aria-hidden="true">{Array.from({ length: count }, (_, i) => <img key={i} src={lotus} alt="" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${i * -2.3}s`, animationDuration: `${14 + (i % 4) * 3}s`, width: `${26 + (i % 3) * 12}px` }} />)}</div>;
}
function CountDown() {
  const muhurthamEvent = weddingData.events.find(event => event.id === 'muhurtham');
  const target = muhurthamEvent ? eventTimestamp(muhurthamEvent) : Date.now();
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => { const update = () => setRemaining(Math.max(0, target - Date.now())); update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer); }, [target]);
  if (!muhurthamEvent) return null;
  const seconds = Math.floor(remaining / 1000);
  const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <section className="countdown-band"><span className="eyebrow">UNTIL WE BEGIN</span><div className="countdown-grid">{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><span>{['DAYS','HOURS','MINUTES','SECONDS'][i]}</span></div>)}</div><p>{eventDate(muhurthamEvent)} · {eventTime(muhurthamEvent)}</p></section>;
}
function EventActions({ event, prominent = false }: { event: WeddingEvent; prominent?: boolean }) {
  return <div className={`event-actions ${prominent ? 'prominent' : ''}`}>
    <a href={directionsUrl(event)} target="_blank" rel="noopener noreferrer"><Navigation size={15} /> Get Directions</a>
    <a href={calendarUrl(event)} target="_blank" rel="noopener noreferrer"><CalendarDays size={15} /> Add to Calendar</a>
    {prominent && <a href="#rsvp"><ArrowRight size={15} /> RSVP</a>}
  </div>;
}
function EventSection({ event, index }: { event: WeddingEvent; index: number }) {
  const isGrand = event.id === 'muhurtham';
  return <section id={event.id} data-mood={event.id} className={`event-section ${index % 2 ? 'event-alt' : ''} ${isGrand ? 'event-grand' : ''} ${event.id === 'reception' ? 'event-night' : ''}`}>
    <div className="event-photo tilt reveal"><span className="dawn-sweep" aria-hidden="true" /><img src={eventImages[event.id]} alt={`${event.name} setting inspired by South Indian temple craftsmanship`} loading="lazy" width={1536} height={1024} />{event.id === 'bangleCeremony' && <span className="bangle-sheen" aria-hidden="true" />}</div>
    <div className="event-copy reveal"><div className="event-heading-row"><span className="tiny-ornament">✦</span></div><h2>{event.name}</h2><p className="event-subtitle">{event.subtitle}</p><div className="hairline" />
      <dl className="event-facts"><div><dt>DATE</dt><dd>{eventDate(event)}</dd></div><div><dt>TIME</dt><dd>{eventTime(event)}</dd></div><div><dt>VENUE</dt><dd>{event.venue}<small>{event.address}</small></dd></div></dl>
      <EventActions event={event} prominent={event.id === 'reception'} />
    </div>
  </section>;
}
function RSVP() {
  return <section id="rsvp" className="rsvp-section"><div className="rsvp-intro reveal"><span className="eyebrow">THE JOY OF YOUR COMPANY</span><h2>Your presence will make our celebration complete.</h2><p>We would be honoured to celebrate these moments with you.</p><div className="rsvp-flower" aria-hidden="true">✳</div></div></section>;
}
function Invitation() {
  useReveal();
  const [lit, setLit] = useState(false);
  const [entered, setEntered] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<(AudioContext & { initialized?: boolean; musicTimer?: number; masterGain?: GainNode }) | null>(null);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const songReady = useRef(false);
  const muhurthamEvent = weddingData.events.find(event => event.id === 'muhurtham');
  useEffect(() => { if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLit(true); setEntered(true); } }, []);
  useCinematicPointer();
  const startAudio = async () => {
    let song = songRef.current;
    if (!song) {
      song = new Audio('/audio/jessies-land.mp3');
      song.loop = true;
      song.preload = 'auto';
      song.volume = 0;
      song.addEventListener('canplay', () => { songReady.current = true; });
      song.addEventListener('error', () => { songReady.current = false; });
      songRef.current = song;
    }
    if (!songReady.current && !song.error) {
      await new Promise<void>(resolve => {
        const timer = window.setTimeout(resolve, 2500);
        song!.addEventListener('canplay', () => { window.clearTimeout(timer); resolve(); }, { once: true });
      });
    }
    if (songReady.current && !song.error) {
      try {
        song.volume = 0;
        await song.play();
        const fade = window.setInterval(() => {
          if (!song || song.volume >= 0.75) { window.clearInterval(fade); return; }
          song.volume = Math.min(0.75, song.volume + 0.02);
        }, 200);
        setAudioOn(true);
        return;
      } catch { /* song unavailable — fall back to the ambient melody */ }
    }
    const context: AudioContext & { initialized?: boolean; musicTimer?: number; masterGain?: GainNode } = audioRef.current ?? new AudioContext(); audioRef.current = context;
    if (!context.state || context.state === 'suspended') await context.resume();
    if (!context.initialized) {
      const master = context.createGain();
      master.gain.setValueAtTime(.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(.22, context.currentTime + 7);
      master.connect(context.destination);
      context.masterGain = master;
      [130.81, 196].forEach((frequency, i) => { const osc = context.createOscillator(); const gain = context.createGain(); osc.type = 'sine'; osc.frequency.value = frequency; gain.gain.value = i === 0 ? .045 : .018; osc.connect(gain).connect(master); osc.start(); });
      const notes = [261.63, 293.66, 329.63, 392, 349.23, 329.63, 293.66, 261.63, 392, 440, 392, 349.23];
      let step = 0;
      const playPhrase = () => { const now = context.currentTime; const osc = context.createOscillator(); const tone = context.createBiquadFilter(); const gain = context.createGain(); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(notes[step % notes.length] ?? 261.63, now); osc.detune.setValueAtTime(step % 3 === 0 ? 7 : -4, now); tone.type = 'lowpass'; tone.frequency.value = 1300; gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.055, now + .08); gain.gain.exponentialRampToValueAtTime(.0001, now + .72); osc.connect(tone).connect(gain).connect(master); osc.start(now); osc.stop(now + .75); step += 1; };
      playPhrase(); context.musicTimer = window.setInterval(playPhrase, 780); context.initialized = true;
    }
    setAudioOn(true);
  };
  const lightLamp = () => { setLit(true); void startAudio(); window.setTimeout(() => setEntered(true), 2600); };
  const toggleAudio = async () => {
    if (audioOn) { songRef.current?.pause(); await audioRef.current?.suspend(); setAudioOn(false); return; }
    await startAudio();
  };
  return <main>
    <div className={`opening ${lit ? 'is-opening' : ''} ${entered ? 'opening-done' : ''}`} aria-hidden={entered} onClick={lit ? undefined : lightLamp}>
      <div className="opening-world" style={{ backgroundImage: `url(${dawn})` }} />
      <div className="opening-glow" />
      <div className="door-stage">
        <div className="door door-left"><div style={{ backgroundImage: `url(${door})` }} /></div>
        <div className="door door-right"><div style={{ backgroundImage: `url(${door})` }} /></div>
      </div>
      <Petals count={9} />
      <div className="opening-inner"><span className="eyebrow">A TALE OF DAWN &amp; LOTUS</span><h1>{bride} <em>×</em> {groom}</h1><Button variant="ghost" onClick={e => { e.stopPropagation(); lightLamp(); }} className="light-button">ENTER THE CELEBRATION <ArrowRight size={16} /></Button></div>
    </div>
    <header className="site-header"><a href="#home" className="monogram">A <span>✦</span> A</a><nav aria-label="Main navigation"><a href="#events">THE CELEBRATION</a><a href="#venue">VENUE</a><a href="#rsvp">RSVP</a></nav><Button variant="ghost" size="icon" className="sound-button" title={audioOn ? 'Mute traditional wedding music' : 'Play traditional wedding music'} aria-label={audioOn ? 'Mute traditional wedding music' : 'Play traditional wedding music'} onClick={toggleAudio}>{audioOn ? <Volume2 size={19} /> : <VolumeX size={19} />}</Button></header>
    <section id="home" className="hero"><img className="hero-image" src={dawn} alt="Lotus on a pond at sunrise within a South Indian temple courtyard" width={1536} height={1024} /><div className="hero-scrim" /><span className="dawn-sweep hero-sweep" aria-hidden="true" /><Petals /><div className="hero-content"><span className="eyebrow">A CELEBRATION OF LOVE &amp; LIGHT</span><div className="hero-mark">✦</div><h1>{bride} <span>×</span> {groom}</h1><p className="hero-title">{weddingData.title}</p><p className="hero-tamil">{weddingData.tamilTitle}</p><div className="hero-rule"><span>✧</span></div>{muhurthamEvent && <p className="hero-date">{eventDate(muhurthamEvent)} <span>·</span> SALEM, TAMIL NADU</p>}</div><a href="#story" className="scroll-prompt">SCROLL TO DISCOVER <ArrowDown size={14} /></a></section>
    <section id="story" className="story-section"><div className="story-inner reveal"><div className="story-columns"><div><span className="story-symbol">☀</span><h2>Aruna</h2><p>Of the dawn. The first golden warmth that turns darkness into light.</p></div><div className="story-and">&amp;</div><div><img className="story-lotus" src={lotus} alt="" aria-hidden="true" width={1024} height={1024} loading="lazy" /><h2>Aravind</h2><p>Of the lotus. A quiet bloom, beautiful in its beginning.</p></div></div><p className="story-ending">Where dawn meets lotus, forever begins.</p></div></section>
    <CountDown />
    <div id="events" className="events-intro lotus-watermark"><h2>The celebrations</h2><p>From the first promise to a lifetime together.</p></div>
    {weddingData.events.map((event, index) => <div key={event.id} className="contents">{event.id === 'reception' && <div className="dusk-transition" aria-hidden="true"><span>FROM SUNRISE TO TWILIGHT</span></div>}<EventSection event={event} index={index} /></div>)}
    <section id="venue" className="venue-section"><div className="venue-top reveal"><span className="eyebrow">FIND YOUR WAY TO US</span><h2>Meet Us in Salem.</h2><p>Every celebration has a place. Find the one you’re joining below.</p></div><div className="venue-list">{weddingData.events.map(event => <article key={event.id} className="reveal"><span className="venue-number">{event.number}</span><div><h3>{event.name}</h3><p>{event.venue}</p><small>{event.address}</small><span className="venue-datetime">{eventDate(event)} · {eventTime(event)}</span></div><EventActions event={event} /></article>)}</div></section>
    <RSVP />
    <footer className="final-scene"><img src={pond} loading="lazy" width={1536} height={1024} alt="Lotus floating on a temple pond at sunset, surrounded by glowing deepams" /><div className="final-overlay" /><div className="final-content"><span className="eyebrow">WITH LOVE &amp; BLESSINGS FROM OUR FAMILIES</span><h2>{bride} <span>×</span> {groom}</h2><p>Two lights. One journey. Forever begins here.</p><div className="final-monogram">A <span>✦</span> A</div></div></footer>
  </main>;
}

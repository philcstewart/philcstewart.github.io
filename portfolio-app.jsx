// portfolio-app.jsx
// Nav, HeroCanvas, HeroSection, AboutSection, App root

const { useState, useEffect, useRef, useCallback } = React;

/* ── Scroll reveal ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Hero canvas: maintenance network graph ────────────── */
function HeroCanvas({ dark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 30;
    const nodes = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 1.5,
      type: i < 5 ? 'active' : i < 9 ? 'warn' : 'idle',
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() / 1000;

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 150) {
            const a = (1 - d / 150) * (dark ? 0.1 : 0.07);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = dark ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const pulse = Math.sin(t * 1.8 + n.phase);
        let rgb, alpha;
        if (n.type === 'active')      { rgb = '228,105,28'; alpha = 0.85; }
        else if (n.type === 'warn')   { rgb = '220,175,40'; alpha = 0.7; }
        else                          { rgb = dark ? '255,255,255' : '60,40,20'; alpha = dark ? 0.12 : 0.09; }

        if (n.type === 'active') {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(228,105,28,${0.15 + pulse * 0.07})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [dark]);

  return (
    <canvas ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  );
}

/* ── Nav ───────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--open' : ''}`}>
      <button className="nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Phil Stewart
      </button>
      <div className="nav__links">
        {['about','work','experience','skills','contact'].map(id => (
          <button key={id} className="nav__link" onClick={() => go(id)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
      <button className="nav__burger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
        <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
      </button>
      {menuOpen && (
        <div className="nav__mobile">
          {['about','work','experience','skills','contact'].map(id => (
            <button key={id} className="nav__mobile-link" onClick={() => go(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── Hero ──────────────────────────────────────────────── */
function HeroSection({ dark }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(id); }, []);

  const metrics = [
    { label: 'Assets tracked', value: '12,450', delta: '+3.2% this quarter' },
    { label: 'Avg MTTR reduced', value: '34%', delta: 'from 12h to 8h avg' },
    { label: 'PM compliance rate', value: '97.1%', delta: 'up from 84%' },
    { label: 'Work orders / month', value: '2,830', delta: '+12% year over year' },
  ];
  const [mIdx, setMIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setMIdx(i => (i + 1) % metrics.length); setFading(false); }, 300);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={`hero ${loaded ? 'hero--in' : ''}`} id="hero" data-screen-label="Hero">
      <HeroCanvas dark={dark} />
      <div className="hero__content">
        <p className="hero__eyebrow">Product Manager · Maintenance Tracking</p>
        <h1 className="hero__name">Phil<br />Stewart</h1>
        <p className="hero__tagline">Building software that keeps critical assets running — from the first PM ticket to the final inspection.</p>

        <div className={`hero__metric ${fading ? 'hero__metric--fade' : ''}`}>
          <span className="hero__metric-dot" />
          <span className="hero__metric-label">{metrics[mIdx].label}</span>
          <strong className="hero__metric-value">{metrics[mIdx].value}</strong>
          <span className="hero__metric-delta">{metrics[mIdx].delta}</span>
        </div>

        <div className="hero__ctas">
          <button className="btn btn--primary" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
            View my work
          </button>
          <button className="btn btn--ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Get in touch
          </button>
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────── */
function AboutSection() {
  const [ref, visible] = useReveal();
  return (
    <section id="about" className="section" ref={ref} data-screen-label="About">
      <div className={`section__inner reveal ${visible ? 'revealed' : ''}`}>
        <div className="about-grid">
          <div className="about-left">
            <span className="section-label">About</span>
            <div className="about-photo-wrap">
              <img src="headshot.jpeg" alt="Phil Stewart" className="about-photo" />
            </div>
          </div>
          <div className="about-right">
            <h2 className="section-heading">I help maintenance teams do more with less.</h2>
            <p className="body-text">
              With 9 years in product management across industrial and enterprise software, I specialize in translating the language of the shop floor into products technicians actually want to use. My work lives at the intersection of operations reliability, data intelligence, and human-centered design.
            </p>
            <p className="body-text">
              I've shipped products used by maintenance teams at facilities ranging from commercial HVAC operations to heavy manufacturing plants — building tools that reduce unplanned downtime and surface insights that actually drive decisions.
            </p>
            <div className="about-stats">
              {[
                { n: '9+', label: 'years in product' },
                { n: '50k+', label: 'assets under management' },
                { n: '4', label: 'major products shipped' },
              ].map(s => (
                <div key={s.n} className="about-stat">
                  <span className="about-stat__n">{s.n}</span>
                  <span className="about-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── App root ──────────────────────────────────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "light",
  "workDisplay": "grid",
  "accentHue": "45"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const dark = t.vibe === 'dark';
  const hue = parseFloat(t.accentHue) || 45;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.vibe = t.vibe;
    root.style.setProperty('--accent-hue', hue);
  }, [t.vibe, hue]);

  return (
    <>
      <Nav />
      <HeroSection dark={dark} />
      <AboutSection />
      <WorkSection workDisplay={t.workDisplay} />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Visual style" />
        <TweakRadio label="Vibe" value={t.vibe}
          options={['light','dark','warm']}
          onChange={v => setTweak('vibe', v)} />
        <TweakSection label="Projects" />
        <TweakRadio label="Display" value={t.workDisplay}
          options={['grid','list']}
          onChange={v => setTweak('workDisplay', v)} />
        <TweakSection label="Color" />
        <TweakSlider label="Accent hue" value={hue} min={20} max={80} step={1}
          onChange={v => setTweak('accentHue', String(v))} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

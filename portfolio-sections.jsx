// portfolio-sections.jsx
// WorkSection, ExperienceSection, SkillsSection, BlogSection, ContactSection, Footer

const { useState: useState2, useRef: useRef2, useEffect: useEffect2 } = React;

function useRevealS() {
  const ref = useRef2(null);
  const [visible, setVisible] = useState2(false);
  useEffect2(() => {
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

const PROJECTS = [
  {
    num: '01', name: 'CMMS Platform Redesign',
    tags: ['Redesign', 'Enterprise', 'CMMS'], year: '2024',
    desc: 'End-to-end redesign of a legacy computerized maintenance management system serving 200+ enterprise clients. Reduced work order completion time by 34% and cut technician onboarding from 3 days to 4 hours.',
    outcome: 'Work order cycle time −34%',
  },
  {
    num: '02', name: 'Asset Intelligence Dashboard',
    tags: ['Analytics', 'New Product', 'Data'], year: '2023',
    desc: 'New analytics layer providing predictive maintenance insights across 50,000+ tracked assets. Surfaced failure-risk scores and maintenance backlog trends for operations managers.',
    outcome: 'Unplanned downtime −28%',
  },
  {
    num: '03', name: 'Field Technician Mobile App',
    tags: ['Mobile', 'Offline-first', 'iOS/Android'], year: '2022',
    desc: 'Offline-first mobile app for field technicians in low-connectivity environments. Features barcode scanning, voice-to-text work logs, and seamless sync when back online.',
    outcome: '4.7★ App Store rating',
  },
  {
    num: '04', name: 'Preventive Maintenance Scheduler',
    tags: ['AI/ML', 'Automation', 'Scheduling'], year: '2021',
    desc: 'AI-assisted scheduling tool that optimizes PM windows based on asset criticality, technician availability, and historical failure patterns. Reduced scheduling manual effort by 60%.',
    outcome: 'PM compliance +13pp',
  },
];

function StripePlaceholder({ id, label }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <pattern id={`s${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#s${id})`} />
      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="monospace" opacity="0.35">project screenshot</text>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="monospace" opacity="0.22">{label}</text>
    </svg>
  );
}

function WorkSection({ workDisplay }) {
  const [ref, visible] = useRevealS();
  return (
    <section id="work" className="section section--alt" ref={ref} data-screen-label="Work">
      <div className={`section__inner reveal ${visible ? 'revealed' : ''}`}>
        <div className="section-header">
          <span className="section-label">Work</span>
          <h2 className="section-heading">Selected projects</h2>
        </div>
        {workDisplay === 'list' ? (
          <div className="projects-list">
            {PROJECTS.map((p, i) => (
              <div key={p.num} className="project-row" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="project-row__num">{p.num}</span>
                <div className="project-row__body">
                  <div className="project-row__top">
                    <h3 className="project-row__name">{p.name}</h3>
                    <span className="project-row__year">{p.year}</span>
                  </div>
                  <p className="project-row__desc">{p.desc}</p>
                  <div className="project-row__bottom">
                    <div className="project-row__tags">
                      {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <span className="project-outcome">{p.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={p.num} className="project-card" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="project-card__thumb">
                  <StripePlaceholder id={p.num} label={p.name} />
                </div>
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span className="project-card__num">{p.num}</span>
                    <span className="project-card__year">{p.year}</span>
                  </div>
                  <h3 className="project-card__name">{p.name}</h3>
                  <p className="project-card__desc">{p.desc}</p>
                  <div className="project-card__footer">
                    <div className="project-card__tags">
                      {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <span className="project-outcome">{p.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    role: 'Senior Product Manager', company: 'Meridian Asset Systems', period: '2022 – Present',
    desc: 'Leading product strategy for a B2B CMMS platform serving 200+ enterprise clients across manufacturing, healthcare, and facilities management.',
    highlights: ['Shipped platform redesign with 34% efficiency improvement', 'Grew ARR 40% through new analytics product line', 'Built and managed cross-functional team of 14'],
  },
  {
    role: 'Product Manager', company: 'FieldTech Software', period: '2019 – 2022',
    desc: 'Owned the mobile product line for field service management software. Launched iOS/Android apps from 0 to 50,000 monthly active technicians.',
    highlights: ['Led 0→1 mobile app launch', 'Reduced technician onboarding from 3 days to 4 hours', 'Ran beta program with 6 enterprise clients'],
  },
  {
    role: 'Associate Product Manager', company: 'Reliable Ops Inc.', period: '2017 – 2019',
    desc: 'Supported product development for preventive maintenance scheduling and compliance tracking across 300+ industrial clients.',
    highlights: ['Managed backlog and sprint planning for 2 scrum teams', 'Conducted 100+ user interviews with field technicians', 'Shipped first AI-powered scheduling feature'],
  },
];

function ExperienceSection() {
  const [ref, visible] = useRevealS();
  return (
    <section id="experience" className="section" ref={ref} data-screen-label="Experience">
      <div className={`section__inner reveal ${visible ? 'revealed' : ''}`}>
        <div className="section-header">
          <span className="section-label">Experience</span>
          <h2 className="section-heading">Where I've worked</h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="timeline-item" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="timeline-item__track">
                <div className="timeline-item__dot" />
                {i < EXPERIENCE.length - 1 && <div className="timeline-item__line" />}
              </div>
              <div className="timeline-item__body">
                <div className="timeline-item__header">
                  <div>
                    <h3 className="timeline-item__role">{exp.role}</h3>
                    <span className="timeline-item__company">{exp.company}</span>
                  </div>
                  <span className="timeline-item__period">{exp.period}</span>
                </div>
                <p className="timeline-item__desc">{exp.desc}</p>
                <ul className="timeline-item__highlights">
                  {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SKILLS = {
  'Product': ['Strategy & Roadmapping', 'Prioritization Frameworks', 'User Research', 'A/B Testing', 'Go-to-Market'],
  'Domain': ['CMMS / EAM Systems', 'Maintenance Operations', 'Asset Lifecycle Mgmt', 'IoT / Sensor Data', 'Compliance Tracking'],
  'Technical': ['SQL', 'REST API Design', 'Data Analytics', 'Agile / Scrum', 'Product Analytics'],
  'Tools': ['Jira', 'Figma', 'Mixpanel', 'Amplitude', 'Tableau', 'Salesforce'],
};

function SkillsSection() {
  const [ref, visible] = useRevealS();
  return (
    <section id="skills" className="section section--alt" ref={ref} data-screen-label="Skills">
      <div className={`section__inner reveal ${visible ? 'revealed' : ''}`}>
        <div className="section-header">
          <span className="section-label">Skills</span>
          <h2 className="section-heading">What I bring to the table</h2>
        </div>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([cat, skills]) => (
            <div key={cat} className="skills-group">
              <h3 className="skills-group__title">{cat}</h3>
              <div className="skills-group__tags">
                {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, visible] = useRevealS();
  const contacts = [
    { label: 'Email', value: 'phil@philstewart.co', href: 'mailto:phil@philstewart.co' },
    { label: 'LinkedIn', value: 'linkedin.com/in/philstewart', href: 'https://linkedin.com' },
    { label: 'GitHub', value: 'github.com/philstewart', href: 'https://github.com' },
  ];
  return (
    <section id="contact" className="section section--accent" ref={ref} data-screen-label="Contact">
      <div className={`section__inner reveal ${visible ? 'revealed' : ''}`}>
        <div className="contact-simple">
          <div className="contact-simple__left">
            <span className="section-label section-label--inv">Contact</span>
            <h2 className="section-heading contact-heading">Let's work together.</h2>
            <p className="contact-intro">
              Whether you're building in maintenance tech, hiring for product leadership, or just want to swap notes — I'd love to hear from you.
            </p>
          </div>
          <div className="contact-simple__links">
            {contacts.map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith('mailto') ? '_self' : '_blank'} className="contact-item">
                <span className="contact-item__label">{c.label}</span>
                <span className="contact-item__value">{c.value} ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__name">Phil Stewart</span>
        <span className="footer__links">
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
          <a href="https://github.com" target="_blank">GitHub</a>
        </span>
        <span className="footer__copy">© 2026</span>
      </div>
    </footer>
  );
}

Object.assign(window, { WorkSection, ExperienceSection, SkillsSection, ContactSection, Footer });

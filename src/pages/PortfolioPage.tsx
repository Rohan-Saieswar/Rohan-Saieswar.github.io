import { useState, useEffect, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Award, Github, Star, GitFork, ExternalLink, Code, Database, Layout, X } from 'lucide-react';
import { useMotionValue, useTransform } from 'framer-motion';
import styles from './Certificates.module.css';

// ─── Education Data ────────────────────────────────────────────────────────────
const educationList = [
  {
    degree: "Senior Secondary Education",
    institution: "FIITJEE GLOBAL SCHOOL",
    period: "2024 - 2026",
    description: "Completing senior secondary education with a focus on advanced academics and competitive exam preparation.",
    icon: <GraduationCap size={20} />
  },
  {
    degree: "Secondary Education",
    institution: "Velammal New-Gen School",
    period: "2022 - 2024",
    description: "Completed secondary education with a strong foundation in core subjects.",
    icon: <BookOpen size={20} />
  },
  {
    degree: "Middle School Education",
    institution: "Satya Sai Institute of Educare",
    period: "2020 - 2022",
    description: "Focused on holistic education and foundational academic development.",
    icon: <BookOpen size={20} />
  },
  {
    degree: "Primary & Middle Education",
    institution: "Narayana E-Techno School",
    period: "2015 - 2020",
    description: "Formative years of education emphasizing technology-integrated learning.",
    icon: <BookOpen size={20} />
  },
  {
    degree: "Early Education",
    institution: "DAV Baba School",
    period: "2014 - 2015",
    description: "Early childhood education.",
    icon: <Award size={20} />
  },
  {
    degree: "Early Education",
    institution: "Rainbow School, Nellore",
    period: "2013 - 2014",
    description: "Early childhood education.",
    icon: <Award size={20} />
  }
];

// ─── Certificates Data ─────────────────────────────────────────────────────────
const certificatesData = [
  {
    title: 'Computer Science – School Connect',
    issuer: 'IITM',
    date: '2024 - 2025',
    icon: <Award size={32} />,
    color: '#a78bfa',
    certificate: true
  },
  {
    title: 'Advanced React Patterns',
    issuer: 'Frontend Masters',
    date: '2025',
    icon: <Code size={32} />,
    color: '#3b82f6'
  },
  {
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    date: '2024',
    icon: <Database size={32} />,
    color: '#f59e0b'
  },
  {
    title: 'UI/UX Specialization',
    issuer: 'Google via Coursera',
    date: '2023',
    icon: <Layout size={32} />,
    color: '#10b981'
  },
  {
    title: 'Full-Stack Engineering',
    issuer: 'Codecademy',
    date: '2023',
    icon: <Award size={32} />,
    color: '#8b5cf6'
  }
];

// ─── Tab Type ──────────────────────────────────────────────────────────────────
type Tab = 'education' | 'projects' | 'certificates';

// ─── GlassCard (Certificates) ──────────────────────────────────────────────────
const GlassCard = ({ cert, index, onOpenCert }: { cert: any; index: number; onOpenCert: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <motion.div
      className={styles.glassCardContainer}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <motion.div
        className={styles.glassCard}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - (rect.left + rect.width / 2));
          y.set(e.clientY - (rect.top + rect.height / 2));
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.05 }}
      >
        <div
          className={styles.iconWrapper}
          style={{ color: cert.color, background: `${cert.color}22`, border: `1px solid ${cert.color}55`, transform: 'translateZ(50px)' }}
        >
          {cert.icon}
        </div>
        <div style={{ transform: 'translateZ(30px)', marginTop: '1rem', width: '100%' }}>
          <h3 className={styles.certTitle}>{cert.title}</h3>
          <p className={styles.certIssuer}>{cert.issuer}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span className={styles.certDate}>{cert.date}</span>
            {cert.certificate && (
              <button
                onClick={(e) => { e.stopPropagation(); onOpenCert(); }}
                style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '6px', color: '#a78bfa', padding: '0.2rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(167,139,250,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(167,139,250,0.2)')}
              >
                View
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Projects Tab ──────────────────────────────────────────────────────────────
interface GitRepo { id: number; name: string; description: string; html_url: string; stargazers_count: number; forks_count: number; language: string; }

const ProjectsTab = () => {
  const [repos, setRepos] = useState<GitRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const languageColors: Record<string, string> = { Python: '#3572A5', TypeScript: '#3178c6', C: '#555555', HTML: '#e34c26' };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Rohan-Saieswar/repos');
        const data = await res.json();
        const priority = ['linux', 'Grade12', 'pacman-contribution-graph', 'Rohansaieswarkonda.github.io'];
        const sorted = data.sort((a: GitRepo, b: GitRepo) => {
          if (priority.includes(a.name) && !priority.includes(b.name)) return -1;
          if (!priority.includes(a.name) && priority.includes(b.name)) return 1;
          return b.stargazers_count - a.stargazers_count;
        });
        setRepos(sorted);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchRepos();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {repos.map((repo, i) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="repo-card"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, border-color 0.2s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {repo.name} <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
            </a>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexGrow: 1, marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {repo.description || 'No description provided.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {repo.language && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: languageColors[repo.language] || '#ccc' }} />
                {repo.language}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Star size={13} /> {repo.stargazers_count}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GitFork size={13} /> {repo.forks_count}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Main Portfolio Page ───────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: ReactElement }[] = [
  { id: 'education',    label: 'Education',    icon: <GraduationCap size={18} /> },
  { id: 'projects',     label: 'Projects',     icon: <Github size={18} /> },
  { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
];

const PortfolioPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('education');
  const [certOpen, setCertOpen] = useState(false);

  return (
    <div className="section" style={{ minHeight: '100vh', paddingTop: '8rem' }}>
      <div className="container">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '0.75rem' }}>Portfolio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>My education, open-source projects & certifications — all in one place.</p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', padding: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', width: 'fit-content', margin: '0 auto 3rem' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                transition: 'all 0.25s ease',
                background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? '0 4px 16px rgba(139,92,246,0.35)' : 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: '24px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)', zIndex: 0 }} />
                {educationList.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}
                  >
                    <div style={{ minWidth: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-color)', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', boxShadow: '0 0 15px rgba(59,130,246,0.3)', flexShrink: 0 }}>
                      {edu.icon}
                    </div>
                    <div className="hoverable-edu-card" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '1rem', padding: '1.75rem', flexGrow: 1, transition: 'transform 0.3s ease, border-color 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{edu.degree}</h3>
                          <h4 style={{ fontSize: '1rem', color: '#60a5fa', fontWeight: 500 }}>{edu.institution}</h4>
                        </div>
                        <span style={{ padding: '0.2rem 0.9rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.82rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', whiteSpace: 'nowrap' }}>{edu.period}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{edu.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectsTab />
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.grid}>
                {certificatesData.map((cert, i) => (
                  <GlassCard key={cert.title} cert={cert} index={i} onOpenCert={() => setCertOpen(true)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCertOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '1000px', background: '#0a0a0a', border: '1px solid var(--glass-border)', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}
            >
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>🎓 IITM — School Connect Program</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Certificate of completion · 2024 — 2025</p>
                </div>
                <button onClick={() => setCertOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '2rem', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/iitm-certificate.jpg" alt="IITM Certificate"
                  onError={(e) => {
                    const t = e.currentTarget; t.style.display = 'none';
                    const p = t.parentElement;
                    if (p) { const d = document.createElement('div'); d.style.textAlign = 'center'; d.innerHTML = `<div style="font-size:3rem;margin-bottom:1rem;color:#a78bfa">🎓</div><h3 style="color:var(--text-main);margin-bottom:0.5rem">Certificate image coming soon</h3><p style="color:var(--text-muted);font-size:0.9rem">Drop the image at /public/iitm-certificate.jpg</p>`; p.appendChild(d); }
                  }}
                  style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hoverable-edu-card:hover { transform: translateY(-4px); border-color: rgba(59,130,246,0.3) !important; }
        .repo-card:hover { transform: translateY(-4px); border-color: var(--accent-color) !important; }
      `}</style>
    </div>
  );
};

export default PortfolioPage;

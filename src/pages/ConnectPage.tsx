import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Mail, Github, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import ClickSpark from '../components/ClickSpark';
import ScrollVelocity from '../components/ScrollVelocity';
import DecryptedText from '../components/DecryptedText';
import ShinyText from '../components/ShinyText';
import ArchLinuxTerminal from '../components/ArchLinuxTerminal';
import MagneticField from '../components/MagneticField';

type Tab = 'playground' | 'contact';

const TABS: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: 'playground', label: 'Playground', icon: <Gamepad2 size={18} /> },
  { id: 'contact',    label: 'Contact',    icon: <MessageSquare size={18} /> },
];

// ── Playground Tab ─────────────────────────────────────────────────────────────
const PlaygroundTab = () => (
  <div style={{ position: 'relative', overflowX: 'hidden' }}>
    <ClickSpark color="#8b5cf6" sparkCount={20} />

    {/* Header */}
    <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '4rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', border: '1px solid var(--glass-border)', borderRadius: '9999px', marginBottom: '2rem', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
          <ShinyText text="Interactive Playground" speed={3} />
        </div>
        <h2 className="title" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '1.25rem', fontWeight: 900 }}>
          The <span style={{ color: 'var(--accent-color)' }}>FUN</span> Zone
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '560px', margin: '0 auto 2rem' }}>
          Click anywhere to see sparks. Explore the interactive experiments and technical rices below.
        </p>
        <div style={{ fontSize: '1.25rem', padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '1rem', width: 'fit-content', maxWidth: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DecryptedText text="This website took exactly 3 full days to make." speed={30} />
        </div>
      </motion.div>
    </div>

    {/* Ricing Section */}
    <section style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '100%' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Ricing &amp; System Setup</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          I use Arch Linux btw. Here is a live simulation of my minimal terminal config. (Powered by Catppuccin Mocha &amp; Hyprland).
        </p>
      </div>
      <ArchLinuxTerminal />
    </section>

    {/* Velocity Bands */}
    <div style={{ padding: '3.5rem 0', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
      <ScrollVelocity texts={['React', 'TypeScript', 'Framer Motion', 'Vite', 'UI/UX']} velocity={3} />
    </div>
    <div style={{ padding: '3.5rem 0', background: 'rgba(15,23,42,0.5)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
      <ScrollVelocity texts={['Performant', 'Accessible', 'Stunning', 'Interactive']} velocity={-4} />
    </div>

    {/* Magnetic Field */}
    <section style={{ height: '120vh', position: 'relative', overflow: 'hidden' }}>
      <MagneticField />
    </section>
  </div>
);

// ── Contact Tab ────────────────────────────────────────────────────────────────
const ContactTab = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}
  >
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
      <div style={{ padding: '1.1rem', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', color: '#3b82f6' }}>
        <MessageSquare size={32} />
      </div>
    </div>
    <h2 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Let's Talk</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
      Whether you have a question, a project proposition, or just want to say hi — my inbox is always open.
    </p>

    <a
      href="mailto:rohansaieswar@gmail.com"
      style={{ display: 'block', width: '100%', padding: '1.25rem', background: 'var(--accent-color)', color: 'white', textAlign: 'center', borderRadius: '0.75rem', fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none', marginBottom: '2rem', boxShadow: '0 4px 14px rgba(139,92,246,0.4)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.45)'; }}
      onMouseOut={(e)  => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,92,246,0.4)';  }}
    >
      Send an Email
    </a>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      {[
        { name: 'GitHub',   icon: <Github size={20} />,   link: 'https://github.com/Rohan-Saieswar' },
        { name: 'LinkedIn', icon: <Linkedin size={20} />, link: 'https://linkedin.com/in/' },
        { name: 'Twitter',  icon: <Twitter size={20} />,  link: 'https://twitter.com/' },
        { name: 'Fiverr',   icon: <Mail size={20} />,     link: 'https://www.fiverr.com/s/KeQk6rW' },
      ].map((s) => (
        <a
          key={s.name}
          href={s.link}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'var(--text-main)', textDecoration: 'none', transition: 'background 0.2s ease, border-color 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
          onMouseOut={(e)  => { e.currentTarget.style.background = 'var(--glass-bg)';         e.currentTarget.style.borderColor = 'var(--glass-border)';      }}
        >
          {s.icon} <span>{s.name}</span>
        </a>
      ))}
    </div>
  </motion.div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
const ConnectPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('playground');

  return (
    <div style={{ minHeight: '100vh', paddingTop: '8rem', background: 'var(--bg-color)' }}>
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '0.75rem' }}>Connect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Interactive experiments &amp; ways to reach me — all in one place.</p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', padding: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', width: 'fit-content', margin: '2rem auto 0' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.4rem',
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
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'playground' ? (
          <motion.div
            key="playground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PlaygroundTab />
          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="container"
            style={{ paddingBottom: '6rem' }}
          >
            <ContactTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectPage;

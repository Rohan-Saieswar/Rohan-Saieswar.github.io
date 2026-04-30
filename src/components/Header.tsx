import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import ShinyText from './ShinyText';
import styles from './Header.module.css';

const navItems = [
  { name: 'Home',       path: '/',           num: '01' },
  { name: 'Experience', path: '/experience', num: '02' },
  { name: 'Portfolio',  path: '/portfolio',  num: '03' },
  { name: 'Connect',    path: '/connect',    num: '04' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>

          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="Home">
            <img src="/favicon.png" alt="Logo" className={styles.logoIcon} />
            <ShinyText text="KRS." speed={2.5} shineColor="#3b82f6" />
          </Link>

          {/* Desktop nav links — always visible */}
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              className={styles.closeBtn}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <span className={styles.closeLine} />
              <span className={styles.closeLine} />
            </button>

            {/* Nav Links */}
            <nav className={styles.overlayNav}>
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  className={styles.overlayItemWrapper}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  {i === 0 && <div className={styles.separator} />}
                  <Link
                    to={item.path}
                    className={`${styles.overlayLink} ${isActive(item.path) ? styles.overlayLinkActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.overlayLinkName}>{item.name}</span>
                    <span className={styles.overlayLinkNum}>{item.num}</span>
                  </Link>
                  <div className={styles.separator} />
                </motion.div>
              ))}
            </nav>

            {/* Socials */}
            <motion.div
              className={styles.overlaySocials}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
            >
              <a href="https://github.com/Rohan-Saieswar" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="GitHub"><Github size={22} /></a>
              <a href="https://linkedin.com/in/"           target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="LinkedIn"><Linkedin size={22} /></a>
              <a href="mailto:rohansaieswar@gmail.com"                                      className={styles.socialIcon} aria-label="Email"><Mail size={22} /></a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

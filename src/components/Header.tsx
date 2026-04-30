import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import ShinyText from './ShinyText';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavItem {
    name: string;
    path: string;
    isHash?: boolean;
  }

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Experience', path: '/experience' },
    { name: 'Education', path: '/education' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Fun', path: '/fun' },
    { name: 'Contact', path: '/contact' }
  ];

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <a href="#" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/favicon.png" alt="Logo" className={styles.logoIcon} />
            <ShinyText text="KRS." speed={2.5} shineColor="#3b82f6" />
          </a>

          <nav className={styles.navLinks}>
            {navItems.map((item) => (
              item.isHash && !isHome ? (
                <a key={item.name} href={item.path} className={styles.navLink}>
                  <ShinyText text={item.name} speed={3} pauseOnHover={true} />
                </a>
              ) : (
                <Link key={item.name} to={item.path} className={styles.navLink}>
                  <ShinyText text={item.name} speed={3} pauseOnHover={true} />
                </Link>
              )
            ))}
          </nav>

          <div className={styles.socials}>
            <a href="https://github.com/Rohan-Saieswar" target="_blank" rel="noreferrer" className={styles.socialIcon}>
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className={styles.socialIcon}>
              <Linkedin size={20} />
            </a>
            <a href="mailto:rohansaieswar@gmail.com" className={styles.socialLink} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>

          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.mobileMenu}
          >
            {navItems.map((item, i) => (
              item.isHash && !isHome ? (
                 <motion.a 
                  key={item.name}
                  href={item.path}
                  className={styles.mobileLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ShinyText text={item.name} speed={3} />
                </motion.a>
              ) : (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={item.path}
                    className={styles.mobileLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShinyText text={item.name} speed={3} />
                  </Link>
                </motion.div>
              )
            ))}
            
            <motion.div 
              className="mt-8 flex gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}
            >
              <a href="https://github.com/Rohan-Saieswar" target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Linkedin size={24} />
              </a>
              <a href="mailto:rohansaieswar@gmail.com" className={styles.socialLink} aria-label="Email">
                <Mail size={24} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

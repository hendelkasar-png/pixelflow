import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/tools', label: t.nav.tools },
    { to: '/about', label: t.nav.about },
    { to: '/faq', label: t.nav.faq },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center group-hover:bg-blue transition-colors">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-navy text-lg">{t.brand}</span>
              <span className="text-xs text-secondary hidden sm:block">{t.tagline}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-blue bg-blue-light'
                    : 'text-secondary hover:text-navy hover:bg-gray-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/compress-image"
              className="hidden sm:inline-flex btn-primary !py-2 !px-4"
            >
              {t.nav.startUsing}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-light text-navy"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-border animate-in slide-in-from-top">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-blue bg-blue-light'
                      : 'text-secondary hover:text-navy hover:bg-gray-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/compress-image"
                className="btn-primary mt-2 justify-center"
              >
                {t.nav.startUsing}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

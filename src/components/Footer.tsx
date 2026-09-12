import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function Footer() {
  const { t, isRTL } = useLanguage();

  const quickLinks = [
    { to: '/', label: t.nav.home },
    { to: '/tools', label: t.nav.tools },
    { to: '/about', label: t.nav.about },
    { to: '/faq', label: t.nav.faq },
  ];

  const legalLinks = [
    { to: '/privacy', label: t.footer.privacy },
    { to: '/terms', label: t.footer.terms },
    { to: '/contact', label: t.footer.contact },
  ];

  return (
    <footer className="bg-navy text-white mt-20">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">{t.brand}</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">
                {t.privacyNotice}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">{t.footer.copyright}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{t.brand}</span>
            <span>•</span>
            <span>{t.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

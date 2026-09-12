import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-20 md:py-32">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-light mb-6">
          <AlertTriangle className="w-10 h-10 text-blue" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-navy mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-navy mb-3">{t.notFound.title}</h2>
        <p className="text-secondary mb-8 leading-relaxed">{t.notFound.subtitle}</p>
        
        <Link to="/" className="btn-primary btn-lg inline-flex">
          <Home className="w-5 h-5" />
          {t.notFound.backHome}
        </Link>

        <div className="mt-12 p-6 rounded-2xl bg-white border border-gray-border">
          <p className="text-sm text-secondary">
            You can also try our tools directly:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link to="/compress-image" className="btn-secondary !py-2 !px-4 text-sm">
              Compress Image
            </Link>
            <Link to="/resize-image" className="btn-secondary !py-2 !px-4 text-sm">
              Resize Image
            </Link>
            <Link to="/convert-image" className="btn-secondary !py-2 !px-4 text-sm">
              Convert Image
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

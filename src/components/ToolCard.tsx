import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  linkTo: string;
  isComingSoon?: boolean;
  accentColor?: string;
}

export default function ToolCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  linkTo,
  isComingSoon = false,
  accentColor = '#2563EB',
}: ToolCardProps) {
  const { isRTL } = useLanguage();

  if (isComingSoon) {
    return (
      <div className="card-hover p-6 flex flex-col opacity-70 cursor-not-allowed">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <span className="chip !bg-gray-100 !text-secondary">
            <Lock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
        <p className="text-secondary text-sm leading-relaxed flex-1 mb-4">{description}</p>
        <button
          disabled
          className="btn-secondary w-full cursor-not-allowed opacity-60"
        >
          {actionLabel}
        </button>
      </div>
    );
  }

  return (
    <Link to={linkTo} className="card-hover p-6 flex flex-col group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:scale-105"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon className="w-6 h-6 transition-colors" style={{ color: accentColor }} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-blue transition-colors">
        {title}
      </h3>
      <p className="text-secondary text-sm leading-relaxed flex-1 mb-4">{description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue group-hover:gap-2.5 transition-all">
        {actionLabel}
        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </span>
    </Link>
  );
}

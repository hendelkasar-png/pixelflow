import { Link } from 'react-router-dom';
import {
  Info,
  Target,
  Sparkles,
  Zap,
  Shield,
  MousePointerClick,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function About() {
  const { t, isRTL } = useLanguage();

  const values = [
    { icon: MousePointerClick, title: t.about.values.simplicity.title, desc: t.about.values.simplicity.desc, color: '#2563EB' },
    { icon: Zap, title: t.about.values.speed.title, desc: t.about.values.speed.desc, color: '#F59E0B' },
    { icon: Shield, title: t.about.values.privacy.title, desc: t.about.values.privacy.desc, color: '#16A34A' },
    { icon: Star, title: t.about.values.quality.title, desc: t.about.values.quality.desc, color: '#7C3AED' },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
          <Info className="w-7 h-7 text-blue" />
        </div>
        <h1 className="section-title">{t.about.title}</h1>
        <p className="text-lg text-secondary leading-relaxed mt-4">
          {t.about.intro}
        </p>
      </div>

      {/* Our Goal */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-blue-900 text-white p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-200" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{t.about.goalTitle}</h2>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed">
              {t.about.goal}
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{t.about.valuesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="card p-6 flex gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{value.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{value.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <Link
          to="/tools"
          className="btn-primary btn-lg inline-flex"
        >
          <Sparkles className="w-5 h-5" />
          {t.nav.tools}
          <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
  );
}

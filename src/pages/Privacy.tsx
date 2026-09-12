import { Shield } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();
  const sections = t.privacy.sections;

  const sectionData = [
    { title: sections.dataCollected.title, content: sections.dataCollected.content },
    { title: sections.images.title, content: sections.images.content },
    { title: sections.cookies.title, content: sections.cookies.content },
    { title: sections.analytics.title, content: sections.analytics.content },
    { title: sections.contact.title, content: sections.contact.content },
    { title: sections.changes.title, content: sections.changes.content },
    { title: sections.contactUs.title, content: sections.contactUs.content },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
            <Shield className="w-7 h-7 text-blue" />
          </div>
          <h1 className="section-title">{t.privacy.title}</h1>
          <p className="text-sm text-secondary mt-2">{t.privacy.lastUpdated}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-secondary leading-relaxed mb-8">{sections.intro}</p>

          <div className="space-y-8">
            {sectionData.map((section, index) => (
              <section key={index}>
                <h2 className="text-lg font-semibold text-navy mb-3">{section.title}</h2>
                <p className="text-secondary leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

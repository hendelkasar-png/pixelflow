import { FileText } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();
  const sections = t.terms.sections;

  const sectionData = [
    { title: sections.use.title, content: sections.use.content },
    { title: sections.ip.title, content: sections.ip.content },
    { title: sections.availability.title, content: sections.availability.content },
    { title: sections.disclaimer.title, content: sections.disclaimer.content },
    { title: sections.liability.title, content: sections.liability.content },
    { title: sections.changes.title, content: sections.changes.content },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
            <FileText className="w-7 h-7 text-blue" />
          </div>
          <h1 className="section-title">{t.terms.title}</h1>
          <p className="text-sm text-secondary mt-2">{t.terms.lastUpdated}</p>
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

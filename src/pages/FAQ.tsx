import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ() {
  const { t, isRTL } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    { q: t.faq.q1.q, a: t.faq.q1.a },
    { q: t.faq.q2.q, a: t.faq.q2.a },
    { q: t.faq.q3.q, a: t.faq.q3.a },
    { q: t.faq.q4.q, a: t.faq.q4.a },
    { q: t.faq.q5.q, a: t.faq.q5.a },
    { q: t.faq.q6.q, a: t.faq.q6.a },
    { q: t.faq.q7.q, a: t.faq.q7.a },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
          <HelpCircle className="w-7 h-7 text-blue" />
        </div>
        <h1 className="section-title">{t.faq.title}</h1>
        <p className="section-subtitle mx-auto">{t.faq.subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`card overflow-hidden transition-all ${
                isOpen ? 'border-blue/30 shadow-sm' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-right"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-navy text-left flex-1">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue' : ''
                  } ${isRTL ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`accordion-content transition-all duration-300 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 text-secondary text-sm leading-relaxed border-t border-gray-border pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

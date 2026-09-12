import {
  Compress,
  Maximize2,
  Repeat,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import ToolCard from '../components/ToolCard';

export default function Tools() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-12 md:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-light mb-4">
          <Wrench className="w-7 h-7 text-blue" />
        </div>
        <h1 className="section-title">{t.toolsPage.title}</h1>
        <p className="section-subtitle mx-auto">{t.toolsPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard
          icon={Compress}
          title={t.tools.compress.title}
          description={t.tools.compress.desc}
          actionLabel={t.tools.compress.action}
          linkTo="/compress-image"
          accentColor="#2563EB"
        />
        <ToolCard
          icon={Maximize2}
          title={t.tools.resize.title}
          description={t.tools.resize.desc}
          actionLabel={t.tools.resize.action}
          linkTo="/resize-image"
          accentColor="#7C3AED"
        />
        <ToolCard
          icon={Repeat}
          title={t.tools.convert.title}
          description={t.tools.convert.desc}
          actionLabel={t.tools.convert.action}
          linkTo="/convert-image"
          accentColor="#16A34A"
        />
        <ToolCard
          icon={Sparkles}
          title={t.tools.coming.title}
          description={t.tools.coming.desc}
          actionLabel={t.tools.coming.action}
          linkTo="#"
          isComingSoon
          accentColor="#64748B"
        />
      </div>

      {/* Future Tools Section */}
      <div className="mt-16 p-8 rounded-2xl bg-white border border-gray-border">
        <h2 className="text-xl font-semibold text-navy mb-2">Future Tools</h2>
        <p className="text-secondary text-sm mb-6">
          We're working on more useful image tools. Here's what's coming next:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Remove Background',
            'Image Cropper',
            'Image to PDF',
            'PDF to Image',
            'Watermark Image',
            'Blur Image',
            'Rotate Image',
            'Metadata Remover',
          ].map((tool) => (
            <div
              key={tool}
              className="p-3 rounded-lg bg-gray-light text-sm text-secondary text-center"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

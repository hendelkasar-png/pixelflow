import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Zap,
  MousePointerClick,
  Download,
  Shield,
  ArrowRight,
  ChevronRight,
  Minimize2,
  Maximize2,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import ToolCard from '../components/ToolCard';
import UploadZone, { type UploadedFile } from '../components/UploadZone';
import { validateFile } from '../services/imageProcessing';

export default function Home() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => {
      const validation = validateFile(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        previewUrl: validation.valid ? URL.createObjectURL(file) : '',
        error: validation.error,
      };
    });
    setFiles((prev) => [...prev, ...uploadedFiles]);

    // Navigate to compress tool if valid files selected
    const hasValidFiles = uploadedFiles.some((f) => !f.error);
    if (hasValidFiles) {
      setTimeout(() => navigate('/compress-image'), 300);
    }
  }, [navigate]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
  }, [files]);

  const features = [
    { icon: Zap, title: t.features.fast.title, desc: t.features.fast.desc, color: '#F59E0B' },
    { icon: MousePointerClick, title: t.features.easy.title, desc: t.features.easy.desc, color: '#2563EB' },
    { icon: Download, title: t.features.noInstall.title, desc: t.features.noInstall.desc, color: '#7C3AED' },
    { icon: Shield, title: t.features.privacy.title, desc: t.features.privacy.desc, color: '#16A34A' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-light/40 via-gray-light to-gray-light pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-page relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="chip mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free • No Registration
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight text-balance">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/compress-image" className="btn-primary btn-lg">
                {t.hero.startCompressing}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link to="/tools" className="btn-secondary btn-lg">
                {t.hero.exploreTools}
              </Link>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="max-w-3xl mx-auto">
            <UploadZone
              files={files}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveFile}
              onClearAll={handleClearAll}
              showFileList={false}
            />
          </div>

          {/* Privacy notice */}
          <div className="max-w-2xl mx-auto mt-6 text-center">
            <p className="text-xs text-secondary flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              {t.privacyNotice}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white border border-gray-border hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tools Section */}
      <section className="container-page py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.tools.title}</h2>
          <p className="section-subtitle mx-auto">{t.tools.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ToolCard
            icon={Minimize2}
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

        <div className="text-center mt-10">
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-blue font-medium hover:gap-2.5 transition-all"
          >
            {t.nav.tools}
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-page py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 md:p-14 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to optimize your images?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Start using our free image tools today. No registration required.
            </p>
            <Link to="/compress-image" className="btn btn-lg bg-white text-navy hover:bg-gray-100">
              <ImageIcon className="w-5 h-5" />
              {t.hero.startCompressing}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

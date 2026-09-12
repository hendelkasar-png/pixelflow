import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Repeat,
  Download,
  RefreshCw,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import UploadZone, { type UploadedFile } from '../components/UploadZone';
import Message from '../components/Message';
import {
  convertImage,
  downloadProcessedImage,
  downloadAllImages,
  validateFile,
  formatBytes,
  revokeImageUrl,
  getExtensionFromMime,
  type ProcessedImage,
  type ImageFormat,
} from '../services/imageProcessing';

export default function ConvertImage() {
  const { t, isRTL } = useLanguage();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState(92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setProcessedImages([]);
    setMessage(null);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    processedImages.forEach((img) => revokeImageUrl(img.url));
    setFiles([]);
    setProcessedImages([]);
    setMessage(null);
  }, [files, processedImages]);

  const handleConvert = async () => {
    const validFiles = files.filter((f) => !f.error);
    if (validFiles.length === 0) {
      setMessage({ type: 'error', text: t.errors.noFiles });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setMessage(null);

    processedImages.forEach((img) => revokeImageUrl(img.url));
    setProcessedImages([]);

    const results: ProcessedImage[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const result = await convertImage(validFiles[i].file, {
          targetFormat,
          quality,
        });
        results.push(result);
        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      setProcessedImages(results);
      setMessage({ type: 'success', text: t.success.default });
    } catch (error) {
      setMessage({ type: 'error', text: t.errors.generic });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    handleClearAll();
    setTargetFormat('image/webp');
    setQuality(92);
  };

  const formatLabels: Record<ImageFormat, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
  };

  return (
    <div className="container-page py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-secondary hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        {t.actions.back}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Repeat className="w-6 h-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">{t.convert.title}</h1>
            <p className="text-secondary">{t.convert.subtitle}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6">
          <Message type={message.type} message={message.text} onClose={() => setMessage(null)} autoClose />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-4">Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="input-label">{t.convert.targetFormat}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image/jpeg', 'image/png', 'image/webp'] as ImageFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      disabled={isProcessing}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        targetFormat === fmt
                          ? 'bg-success text-white shadow-sm'
                          : 'bg-gray-light text-secondary hover:bg-green-50 hover:text-success'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {formatLabels[fmt]}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat !== 'image/png' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label !mb-0">{t.convert.quality}</label>
                    <span className="text-sm font-medium text-navy">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-border rounded-lg appearance-none cursor-pointer accent-success"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing || files.filter((f) => !f.error).length === 0}
            className="btn btn-lg w-full bg-success text-white hover:bg-success/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.upload.processing} {progress}%
              </>
            ) : (
              <>
                <Repeat className="w-5 h-5" />
                {t.convert.convertBtn}
              </>
            )}
          </button>

          {processedImages.length > 0 && (
            <>
              <button
                onClick={() => downloadAllImages(processedImages)}
                className="btn-secondary w-full"
                disabled={processedImages.length === 0}
              >
                <Download className="w-5 h-5" />
                {t.convert.downloadAll}
              </button>
              <button onClick={handleReset} className="btn-ghost w-full">
                <RefreshCw className="w-5 h-5" />
                {t.convert.convertAnother}
              </button>
            </>
          )}
        </div>

        {/* Upload & Results */}
        <div className="lg:col-span-2 space-y-6">
          <UploadZone
            files={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
          />

          {isProcessing && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">{t.upload.processing}</span>
                <span className="text-sm font-medium text-navy">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {processedImages.length > 0 && (
            <div className="space-y-4">
              <div className="card p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-success">
                    {processedImages.length} {processedImages.length === 1 ? 'image' : 'images'} converted to {formatLabels[targetFormat]}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {processedImages.map((img) => (
                  <div
                    key={img.id}
                    className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <img
                      src={img.url}
                      alt={img.originalName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate mb-1">
                        {img.originalName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="chip">
                          {getExtensionFromMime(img.originalFormat).toUpperCase()} →{' '}
                          <span className="font-semibold">{formatLabels[img.newFormat as ImageFormat]}</span>
                        </span>
                        <span className="text-secondary">
                          {formatBytes(img.originalSize)} →{' '}
                          <span className="font-medium text-navy">{formatBytes(img.newSize)}</span>
                        </span>
                        {img.savedPercent > 0 && (
                          <span className="chip-success">-{img.savedPercent}%</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => downloadProcessedImage(img)}
                      className="btn btn-primary !py-2 !px-4 flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      {t.convert.download}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

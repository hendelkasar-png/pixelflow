import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compress,
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import UploadZone, { type UploadedFile } from '../components/UploadZone';
import Message from '../components/Message';
import {
  compressImage,
  downloadProcessedImage,
  downloadAllImages,
  validateFile,
  formatBytes,
  revokeImageUrl,
  type ProcessedImage,
} from '../services/imageProcessing';

export default function CompressImage() {
  const { t, isRTL } = useLanguage();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState(80);
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

  const handleCompress = async () => {
    const validFiles = files.filter((f) => !f.error);
    if (validFiles.length === 0) {
      setMessage({ type: 'error', text: t.errors.noFiles });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setMessage(null);

    // Clean previous results
    processedImages.forEach((img) => revokeImageUrl(img.url));
    setProcessedImages([]);

    const results: ProcessedImage[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const result = await compressImage(validFiles[i].file, { quality });
        results.push(result);
        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      setProcessedImages(results);
      setMessage({ type: 'success', text: t.success.compress });
    } catch (error) {
      setMessage({ type: 'error', text: t.errors.compressFailed });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    processedImages.forEach((img) => revokeImageUrl(img.url));
    setFiles([]);
    setProcessedImages([]);
    setMessage(null);
    setQuality(80);
  };

  const getCompressionLevel = () => {
    if (quality >= 85) return { label: t.compress.low, color: 'text-success', bg: 'bg-green-50', border: 'border-green-200' };
    if (quality >= 60) return { label: t.compress.medium, color: 'text-blue', bg: 'bg-blue-light', border: 'border-blue-200' };
    return { label: t.compress.high, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
  };

  const level = getCompressionLevel();
  const totalOriginal = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalNew = processedImages.reduce((sum, img) => sum + img.newSize, 0);
  const totalSaved = totalOriginal > 0 ? Math.round(((totalOriginal - totalNew) / totalOriginal) * 100) : 0;

  return (
    <div className="container-page py-8 md:py-12">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-secondary hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        {t.actions.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-blue-light flex items-center justify-center">
            <Compress className="w-6 h-6 text-blue" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">{t.compress.title}</h1>
            <p className="text-secondary">{t.compress.subtitle}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6">
          <Message
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
            autoClose
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quality Settings */}
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-4">{t.compress.quality}</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">{t.compress.quality}</span>
                <span className="text-sm font-semibold text-navy">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full h-2 bg-gray-border rounded-lg appearance-none cursor-pointer accent-blue"
              />
              <div className="flex justify-between text-xs text-secondary mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${level.bg} ${level.border}`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${level.color}`}>
                  {t.compress.compressionLevel}:
                </span>
                <span className={`text-sm font-semibold ${level.color}`}>
                  {level.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCompress}
            disabled={isProcessing || files.filter((f) => !f.error).length === 0}
            className="btn-primary w-full btn-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.upload.processing} {progress}%
              </>
            ) : (
              <>
                <Compress className="w-5 h-5" />
                {t.compress.compressBtn}
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
                {t.compress.downloadAll}
              </button>
              <button
                onClick={handleReset}
                className="btn-ghost w-full"
              >
                <RefreshCw className="w-5 h-5" />
                {t.compress.compressAnother}
              </button>
            </>
          )}
        </div>

        {/* Right: Upload & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <UploadZone
            files={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
          />

          {/* Progress Bar */}
          {isProcessing && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">{t.upload.processing}</span>
                <span className="text-sm font-medium text-navy">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {processedImages.length > 0 && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="card p-5 bg-gradient-to-r from-green-50 to-blue-light/50 border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-success">
                    {processedImages.length} {processedImages.length === 1 ? 'image' : 'images'} compressed
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-secondary mb-1">{t.compress.originalSize}</p>
                    <p className="font-semibold text-navy">{formatBytes(totalOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary mb-1">{t.compress.newSize}</p>
                    <p className="font-semibold text-navy">{formatBytes(totalNew)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary mb-1">{t.compress.saved}</p>
                    <p className="font-semibold text-success">{totalSaved}%</p>
                  </div>
                </div>
              </div>

              {/* Individual Results */}
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
                        <span className="text-secondary">
                          {formatBytes(img.originalSize)} →{' '}
                          <span className="font-medium text-navy">{formatBytes(img.newSize)}</span>
                        </span>
                        <span className="chip-success">
                          -{img.savedPercent}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadProcessedImage(img)}
                      className="btn-primary !py-2 !px-4 flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      {t.compress.download}
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

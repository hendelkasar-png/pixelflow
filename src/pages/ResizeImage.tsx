import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Maximize2,
  Download,
  RefreshCw,
  ArrowLeft,
  Lock,
  Unlock,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import UploadZone, { type UploadedFile } from '../components/UploadZone';
import Message from '../components/Message';
import {
  resizeImage,
  loadImage,
  downloadProcessedImage,
  validateFile,
  formatBytes,
  revokeImageUrl,
  type ProcessedImage,
  type ImageFormat,
} from '../services/imageProcessing';

interface Preset {
  key: string;
  label: string;
  width: number;
  height: number;
}

export default function ResizeImage() {
  const { t, isRTL } = useLanguage();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [unit, setUnit] = useState<'pixels' | 'percentage'>('pixels');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [quality, setQuality] = useState(92);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const presets: Preset[] = [
    { key: 'yt-thumb', label: t.presets.youtubeThumb, width: 1280, height: 720 },
    { key: 'yt-shorts', label: t.presets.youtubeShorts, width: 1080, height: 1920 },
    { key: 'ig-post', label: t.presets.instagramPost, width: 1080, height: 1080 },
    { key: 'ig-story', label: t.presets.instagramStory, width: 1080, height: 1920 },
    { key: 'fb-post', label: t.presets.facebookPost, width: 1200, height: 630 },
    { key: 'tiktok', label: t.presets.tiktok, width: 1080, height: 1920 },
    { key: 'web-banner', label: t.presets.websiteBanner, width: 1920, height: 600 },
  ];

  // Load image dimensions when first file is selected
  useEffect(() => {
    const validFile = files.find((f) => !f.error);
    if (validFile) {
      loadImage(validFile.file).then((img) => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setWidth(String(img.naturalWidth));
        setHeight(String(img.naturalHeight));
      }).catch(() => {});
    } else {
      setOriginalDimensions(null);
      setWidth('');
      setHeight('');
    }
    setProcessedImage(null);
  }, [files]);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    // For resize, we only handle one file at a time
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    
    const file = newFiles[0];
    if (!file) return;
    
    const validation = validateFile(file);
    setFiles([{
      id: `${Date.now()}`,
      file,
      previewUrl: validation.valid ? URL.createObjectURL(file) : '',
      error: validation.error,
    }]);
    setProcessedImage(null);
    setMessage(null);
    setActivePreset(null);
  }, [files]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return [];
    });
    setProcessedImage(null);
    setOriginalDimensions(null);
  }, []);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    if (processedImage) revokeImageUrl(processedImage.url);
    setFiles([]);
    setProcessedImage(null);
    setOriginalDimensions(null);
    setMessage(null);
  }, [files, processedImage]);

  // Handle width change with aspect ratio lock
  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (lockAspectRatio && originalDimensions && value) {
      const newWidth = Number(value);
      if (newWidth > 0) {
        const ratio = originalDimensions.height / originalDimensions.width;
        if (unit === 'pixels') {
          setHeight(String(Math.round(newWidth * ratio)));
        } else {
          setHeight(value); // percentage keeps same for both
        }
      }
    }
    setActivePreset(null);
  };

  // Handle height change with aspect ratio lock
  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (lockAspectRatio && originalDimensions && value) {
      const newHeight = Number(value);
      if (newHeight > 0) {
        const ratio = originalDimensions.width / originalDimensions.height;
        if (unit === 'pixels') {
          setWidth(String(Math.round(newHeight * ratio)));
        } else {
          setWidth(value);
        }
      }
    }
    setActivePreset(null);
  };

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.key);
    setUnit('pixels');
    setWidth(String(preset.width));
    setHeight(String(preset.height));
  };

  const handleResize = async () => {
    const validFile = files.find((f) => !f.error);
    if (!validFile) {
      setMessage({ type: 'error', text: t.errors.noFiles });
      return;
    }

    if (!width || !height) {
      setMessage({ type: 'error', text: t.errors.generic });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    if (processedImage) revokeImageUrl(processedImage.url);

    try {
      const result = await resizeImage(validFile.file, {
        width: Number(width),
        height: Number(height),
        unit,
        lockAspectRatio,
        quality,
        format,
      });

      setProcessedImage(result);
      setMessage({ type: 'success', text: t.success.default });
    } catch (error) {
      setMessage({ type: 'error', text: t.errors.generic });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    handleClearAll();
    setUnit('pixels');
    setLockAspectRatio(true);
    setQuality(92);
    setFormat('image/jpeg');
    setActivePreset(null);
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
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">{t.resize.title}</h1>
            <p className="text-secondary">{t.resize.subtitle}</p>
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
          {/* Dimensions */}
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-4">Dimensions</h3>
            
            {originalDimensions && (
              <p className="text-sm text-secondary mb-4">
                {t.resize.currentSize}: <span className="font-medium text-navy">{originalDimensions.width} × {originalDimensions.height}</span>
              </p>
            )}

            {/* Unit Toggle */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-light rounded-lg">
              <button
                onClick={() => setUnit('pixels')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  unit === 'pixels' ? 'bg-white text-navy shadow-sm' : 'text-secondary hover:text-navy'
                }`}
              >
                {t.resize.pixels}
              </button>
              <button
                onClick={() => setUnit('percentage')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  unit === 'percentage' ? 'bg-white text-navy shadow-sm' : 'text-secondary hover:text-navy'
                }`}
              >
                {t.resize.percentage}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="input-label">{t.resize.width}</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="input"
                  min="1"
                  disabled={isProcessing || !originalDimensions}
                />
              </div>
              <div>
                <label className="input-label">{t.resize.height}</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="input"
                  min="1"
                  disabled={isProcessing || !originalDimensions}
                />
              </div>
            </div>

            <button
              onClick={() => setLockAspectRatio(!lockAspectRatio)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                lockAspectRatio ? 'text-blue' : 'text-secondary hover:text-navy'
              }`}
            >
              {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {t.resize.lockRatio}
            </button>
          </div>

          {/* Presets */}
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-4">{t.resize.presets}</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => applyPreset(preset)}
                  disabled={isProcessing || !originalDimensions}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                    activePreset === preset.key
                      ? 'bg-blue text-white'
                      : 'bg-gray-light text-secondary hover:bg-blue-light hover:text-blue'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Settings */}
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-4">Output</h3>
            
            <div className="space-y-4">
              <div>
                <label className="input-label">{t.resize.format}</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ImageFormat)}
                  className="input"
                  disabled={isProcessing}
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>

              {format !== 'image/png' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label !mb-0">{t.resize.exportQuality}</label>
                    <span className="text-sm font-medium text-navy">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-border rounded-lg appearance-none cursor-pointer accent-blue"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={handleResize}
            disabled={isProcessing || !originalDimensions}
            className="btn-primary w-full btn-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.upload.processing}
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5" />
                {t.resize.resizeBtn}
              </>
            )}
          </button>

          {processedImage && (
            <>
              <button
                onClick={() => downloadProcessedImage(processedImage)}
                className="btn-secondary w-full"
              >
                <Download className="w-5 h-5" />
                {t.resize.download}
              </button>
              <button onClick={handleReset} className="btn-ghost w-full">
                <RefreshCw className="w-5 h-5" />
                {t.resize.resizeAnother}
              </button>
            </>
          )}
        </div>

        {/* Upload & Preview */}
        <div className="lg:col-span-2 space-y-6">
          <UploadZone
            files={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
            maxFiles={1}
          />

          {/* Result */}
          {processedImage && (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-success">Resized successfully</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                {files[0]?.previewUrl && (
                  <div>
                    <p className="text-sm text-secondary mb-2">Original</p>
                    <div className="rounded-xl overflow-hidden bg-gray-light border border-gray-border">
                      <img
                        src={files[0].previewUrl}
                        alt="Original"
                        className="w-full h-48 object-contain"
                      />
                    </div>
                    <p className="text-xs text-secondary mt-2 text-center">
                      {originalDimensions?.width} × {originalDimensions?.height} • {formatBytes(files[0].file.size)}
                    </p>
                  </div>
                )}
                
                {/* Resized */}
                <div>
                  <p className="text-sm text-secondary mb-2">Resized</p>
                  <div className="rounded-xl overflow-hidden bg-gray-light border border-gray-border">
                    <img
                      src={processedImage.url}
                      alt="Resized"
                      className="w-full h-48 object-contain"
                    />
                  </div>
                  <p className="text-xs text-secondary mt-2 text-center">
                    {processedImage.width} × {processedImage.height} • {formatBytes(processedImage.newSize)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

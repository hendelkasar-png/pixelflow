import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';
import { validateFile, formatBytes } from '../services/imageProcessing';

interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  error?: string;
}

interface UploadZoneProps {
  files: UploadedFile[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
  maxFiles?: number;
  maxSizeMB?: number;
  showFileList?: boolean;
}

export default function UploadZone({
  files,
  onFilesSelected,
  onRemoveFile,
  onClearAll,
  maxFiles = 20,
  maxSizeMB = 20,
  showFileList = true,
}: UploadZoneProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const validation = validateFile(file, maxSizeMB);
        if (validation.valid) {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        const remainingSlots = maxFiles - files.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);
        onFilesSelected(filesToAdd);
      }
    },
    [files.length, maxFiles, maxSizeMB, onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const getErrorMessage = (errorKey?: string) => {
    switch (errorKey) {
      case 'unsupported':
        return t.errors.unsupported;
      case 'tooLarge':
        return t.errors.tooLarge;
      default:
        return t.errors.generic;
    }
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue bg-blue-light/50 scale-[1.01]'
            : 'border-gray-border bg-white hover:border-blue/50 hover:bg-gray-light/50'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload zone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? 'bg-blue text-white' : 'bg-blue-light text-blue'
            }`}
          >
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <p className="text-lg font-semibold text-navy mb-1">
              {t.hero.dragDrop}
            </p>
            <p className="text-secondary text-sm mb-3">
              {t.hero.or}
            </p>
            <span className="btn-primary">{t.hero.chooseFiles}</span>
          </div>

          <p className="text-xs text-secondary mt-2">{t.hero.formats}</p>
        </div>
      </div>

      {/* File List */}
      {showFileList && files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-navy">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </p>
            <button
              onClick={onClearAll}
              className="text-sm text-error hover:text-error/80 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t.upload.clearAll}
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  file.error
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-border bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileImage className="w-5 h-5 text-secondary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-secondary">
                    {formatBytes(file.file.size)}
                  </p>
                  {file.error && (
                    <p className="text-xs text-error flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {getErrorMessage(file.error)}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-light text-secondary hover:text-error transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { UploadedFile };

// Image processing utilities - all client-side using Canvas API

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';
export type FormatExtension = 'jpg' | 'jpeg' | 'png' | 'webp';

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  blob: Blob;
  newSize: number;
  newFormat: string;
  url: string;
  savedPercent: number;
  width: number;
  height: number;
}

export interface CompressOptions {
  quality: number; // 0-100
  format?: ImageFormat;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  unit: 'pixels' | 'percentage';
  lockAspectRatio: boolean;
  quality: number;
  format: ImageFormat;
}

export interface ConvertOptions {
  targetFormat: ImageFormat;
  quality: number; // for jpeg/webp
}

// Load an image file into an HTMLImageElement
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

// Draw image to canvas with optional resizing
function drawToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: ImageFormat
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // For PNG, keep transparent background; for others use white
  if (targetFormatNeedsWhiteBackground(format)) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas;
}

function targetFormatNeedsWhiteBackground(format: ImageFormat): boolean {
  return format === 'image/jpeg';
}

// Convert canvas to blob
function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      format,
      quality / 100
    );
  });
}

// Get file extension from mime type
export function getExtensionFromMime(mime: string): FormatExtension {
  switch (mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: return 'png';
  }
}

// Get mime type from extension
export function getMimeFromExtension(ext: string): ImageFormat {
  const lower = ext.toLowerCase().replace('.', '');
  switch (lower) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    default: return 'image/png';
  }
}

// Get file extension from filename
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

// Replace file extension
export function replaceExtension(filename: string, newExt: string): string {
  const lastDot = filename.lastIndexOf('.');
  const base = lastDot > 0 ? filename.substring(0, lastDot) : filename;
  const cleanExt = newExt.startsWith('.') ? newExt : `.${newExt}`;
  return `${base}${cleanExt}`;
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format bytes to human-readable string
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Compress a single image
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  const format: ImageFormat = options.format || (file.type === 'image/png' ? 'image/png' : 'image/jpeg') as ImageFormat;
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, format);
  
  // For PNG, we need a different approach since quality param doesn't apply
  const actualFormat = format === 'image/png' ? 'image/png' : format;
  const quality = actualFormat === 'image/png' ? undefined : options.quality;
  
  const blob = await canvasToBlob(
    canvas, 
    actualFormat, 
    quality ?? 92
  );
  
  const url = URL.createObjectURL(blob);
  const savedPercent = file.size > 0 ? Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100)) : 0;
  
  return {
    id: generateId(),
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalWidth: img.naturalWidth,
    originalHeight: img.naturalHeight,
    originalFormat: file.type || 'image/png',
    blob,
    newSize: blob.size,
    newFormat: actualFormat,
    url,
    savedPercent,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

// Resize a single image
export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  
  let targetWidth: number;
  let targetHeight: number;
  
  if (options.unit === 'percentage') {
    const percent = (options.width || 100) / 100;
    targetWidth = Math.round(img.naturalWidth * percent);
    targetHeight = options.lockAspectRatio 
      ? Math.round(img.naturalHeight * percent)
      : Math.round(img.naturalHeight * ((options.height || options.width || 100) / 100));
  } else {
    targetWidth = options.width || img.naturalWidth;
    if (options.lockAspectRatio && options.width && !options.height) {
      const ratio = img.naturalHeight / img.naturalWidth;
      targetHeight = Math.round(targetWidth * ratio);
    } else if (options.lockAspectRatio && options.height && !options.width) {
      const ratio = img.naturalWidth / img.naturalHeight;
      targetWidth = Math.round(options.height * ratio);
      targetHeight = options.height;
    } else {
      targetHeight = options.height || img.naturalHeight;
    }
  }
  
  // Ensure minimum dimensions
  targetWidth = Math.max(1, targetWidth);
  targetHeight = Math.max(1, targetHeight);
  
  const canvas = drawToCanvas(img, targetWidth, targetHeight, options.format);
  const blob = await canvasToBlob(canvas, options.format, options.quality);
  
  const url = URL.createObjectURL(blob);
  const savedPercent = file.size > 0 ? Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100)) : 0;
  
  return {
    id: generateId(),
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalWidth: img.naturalWidth,
    originalHeight: img.naturalHeight,
    originalFormat: file.type || 'image/png',
    blob,
    newSize: blob.size,
    newFormat: options.format,
    url,
    savedPercent,
    width: targetWidth,
    height: targetHeight,
  };
}

// Convert a single image format
export async function convertImage(
  file: File,
  options: ConvertOptions
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, options.targetFormat);
  
  const quality = options.targetFormat === 'image/png' ? undefined : options.quality;
  const blob = await canvasToBlob(
    canvas, 
    options.targetFormat, 
    quality ?? 92
  );
  
  const url = URL.createObjectURL(blob);
  const savedPercent = file.size > 0 ? Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100)) : 0;
  
  return {
    id: generateId(),
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalWidth: img.naturalWidth,
    originalHeight: img.naturalHeight,
    originalFormat: file.type || 'image/png',
    blob,
    newSize: blob.size,
    newFormat: options.targetFormat,
    url,
    savedPercent,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

// Download a processed image
export function downloadProcessedImage(image: ProcessedImage): void {
  const ext = getExtensionFromMime(image.newFormat);
  const filename = replaceExtension(image.originalName, ext);
  
  const a = document.createElement('a');
  a.href = image.url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Download multiple processed images as individual files
export function downloadAllImages(images: ProcessedImage[]): void {
  images.forEach((img, index) => {
    setTimeout(() => downloadProcessedImage(img), index * 200);
  });
}

// Validate file type and size
export function validateFile(file: File, maxSizeMB = 20): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'unsupported' };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'tooLarge' };
  }
  
  return { valid: true };
}

// Clean up object URLs to prevent memory leaks
export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

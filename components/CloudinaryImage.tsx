import Image from 'next/image';
import { getCloudinaryUrl, isCloudinaryConfigured } from '@/lib/cloudinary';

type CloudinaryImageProps = {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
}: CloudinaryImageProps) {
  if (!isCloudinaryConfigured() || !publicId) {
    return null;
  }

  const url = getCloudinaryUrl(publicId, {
    width: width || 800,
    height: height || 600,
    crop: fill ? 'fill' : 'fill',
    quality: 'auto',
  });

  if (!url) return null;

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={className}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

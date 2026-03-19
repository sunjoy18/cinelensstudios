const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string }
) {
  if (!CLOUD_NAME) return null;
  const { width, height, crop = 'fill', quality = 'auto' } = options || {};
  const parts = [`c_${crop}`, 'f_auto', `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  const transforms = parts.join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export function isCloudinaryConfigured() {
  return !!CLOUD_NAME;
}


export const R2_CONFIG = {
  endpoint: 'https://d2ee658194859b79564077fad96456cc.r2.cloudflarestorage.com/telugu-sonawale',
  publicUrl: 'https://pub-0a5d163a427242319da103daaf44fbf3.r2.dev',
};

/**
 * Converts a standard image file to WebP format on the client side.
 */
export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context failed'));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP conversion failed'));
        }, 'image/webp', 0.8);
      };
      img.onerror = () => reject(new Error('Image processing failed - check file format.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading failed.'));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image to Cloudflare R2.
 */
export const uploadToR2 = async (data: Blob | File, slug: string): Promise<string> => {
  const fileName = `${slug}-${Date.now()}.webp`;
  const uploadUrl = `${R2_CONFIG.endpoint}/${fileName}`;

  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'image/webp',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("R2 Access Denied: CORS or Pre-signed URL required.");
      }
      throw new Error(`R2 Upload Failed: ${response.status}`);
    }

    return `${R2_CONFIG.publicUrl}/${fileName}`;
  } catch (error) {
    console.error('SONAWALE DEBUG: R2 Storage Error:', error);
    throw error;
  }
};

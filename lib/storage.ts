
const getEnv = (key: string): string | undefined => {
  // @ts-ignore
  return process.env[key] || (import.meta as any).env?.[`VITE_${key}`] || (import.meta as any).env?.[key];
};

export const R2_CONFIG = {
  endpoint: getEnv('R2_ENDPOINT') ? `${getEnv('R2_ENDPOINT')}/${getEnv('R2_BUCKET_NAME')}` : 'https://d2ee658194859b79564077fad96456cc.r2.cloudflarestorage.com/telugu-sonawale',
  publicUrl: getEnv('R2_PUBLIC_URL') || getEnv('VITE_R2_PUBLIC_URL') || 'https://pub-0a5d163a427242319da103daaf44fbf3.r2.dev',
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
  const fileType = data.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
  const fileName = `${slug}-${Date.now()}.webp`;

  try {
    // 1. Get Pre-signed URL from Backend
    const signRes = await fetch('/api/sign-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: fileName, contentType: fileType }),
    });

    if (!signRes.ok) {
      throw new Error(`Sign request failed: ${signRes.statusText}`);
    }

    const { uploadUrl, publicUrl } = await signRes.json();

    // 2. Upload to R2 using the pre-signed URL
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': fileType,
      },
    });

    if (!uploadRes.ok) {
      throw new Error(`R2 Upload Failed: ${uploadRes.status}`);
    }

    return publicUrl;
  } catch (error) {
    console.error('SONAWALE DEBUG: R2 Storage Error:', error);
    throw error;
  }
};

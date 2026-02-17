
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, contentType } = req.body;

        if (!filename || !contentType) {
            return res.status(400).json({ error: 'Filename and content-type are required' });
        }

        const R2_ACCOUNT_ID = 'd2ee658194859b79564077fad96456cc';
        const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
        const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
        const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'telugu-sonawale';

        if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            console.error('Missing R2 credentials');
            return res.status(500).json({ error: 'Server configuration error: Missing R2 credentials' });
        }

        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        });

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filename,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(S3, command, { expiresIn: 60 });

        res.status(200).json({
            uploadUrl: signedUrl,
            publicUrl: `${process.env.R2_PUBLIC_URL || 'https://pub-0a5d163a427242319da103daaf44fbf3.r2.dev'}/${filename}`
        });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Failed to generate upload URL', details: error.message });
    }
}

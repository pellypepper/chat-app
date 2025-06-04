import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import s3 from '../util/s3'; 
import { Upload } from "@aws-sdk/lib-storage";


// Multer memory storage (file will be available in req.file.buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Invalid file type, only images are allowed!'));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Compress with sharp and upload to S3
const compressAndUpload = async (file: Express.Multer.File): Promise<string> => {
  const buffer = await sharp(file.buffer)
    .resize({ width: 800 }) // Resize width to 800px (adjust as needed)
    .jpeg({ quality: 70 })  // Compress to JPEG with 70% quality
    .toBuffer();

  const fileName = `${Date.now()}-${path.parse(file.originalname).name}.jpeg`;

  

    const upload = new Upload({
  client: s3,
  params: {
    Bucket: process.env.AWS_S3_BUCKET || 'pelly-chat',
    Key:  `compressed/${fileName}`,
    Body: buffer,
    ContentType: 'image/jpeg',
  },
});

  const result = await upload.done();
  if (!result.Location) {
    throw new Error("Upload failed: No file location returned from S3.");
  }
  return result.Location;
};

export { upload, compressAndUpload };

import { S3Client } from "@aws-sdk/client-s3";

const s3: S3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAWRLATHMSALNFE4UA",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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",
  },
});

export default s3;
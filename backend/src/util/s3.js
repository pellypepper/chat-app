"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAWRLATHMSALNFE4UA",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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",
    },
});
exports.default = s3;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressAndUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const s3_1 = __importDefault(require("../util/s3"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
// Multer memory storage 
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Invalid file type, only images are allowed!'));
        }
        else {
            cb(null, true);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
exports.upload = upload;
// Compress with sharp and upload to S3
const compressAndUpload = async (file) => {
    const buffer = await (0, sharp_1.default)(file.buffer)
        .resize({ width: 800 }) // Resize width to 800px 
        .jpeg({ quality: 70 }) // Compress to JPEG with 70% quality
        .toBuffer();
    const fileName = `${Date.now()}-${path_1.default.parse(file.originalname).name}.jpeg`;
    const upload = new lib_storage_1.Upload({
        client: s3_1.default,
        params: {
            Bucket: process.env.AWS_S3_BUCKET || 'pelly-chat',
            Key: `compressed/${fileName}`,
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
exports.compressAndUpload = compressAndUpload;
//# sourceMappingURL=upload.js.map
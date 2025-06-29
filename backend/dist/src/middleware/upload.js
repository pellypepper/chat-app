"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressAndUpload = exports.upload = void 0;
var multer_1 = require("multer");
var sharp_1 = require("sharp");
var path_1 = require("path");
var s3_1 = require("../util/s3");
var lib_storage_1 = require("@aws-sdk/lib-storage");
// Multer memory storage 
var upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: function (req, file, cb) {
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
var compressAndUpload = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var buffer, fileName, upload, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, sharp_1.default)(file.buffer)
                    .resize({ width: 800 }) // Resize width to 800px 
                    .jpeg({ quality: 70 }) // Compress to JPEG with 70% quality
                    .toBuffer()];
            case 1:
                buffer = _a.sent();
                fileName = "".concat(Date.now(), "-").concat(path_1.default.parse(file.originalname).name, ".jpeg");
                upload = new lib_storage_1.Upload({
                    client: s3_1.default,
                    params: {
                        Bucket: process.env.AWS_S3_BUCKET || 'pelly-chat',
                        Key: "compressed/".concat(fileName),
                        Body: buffer,
                        ContentType: 'image/jpeg',
                    },
                });
                return [4 /*yield*/, upload.done()];
            case 2:
                result = _a.sent();
                if (!result.Location) {
                    throw new Error("Upload failed: No file location returned from S3.");
                }
                return [2 /*return*/, result.Location];
        }
    });
}); };
exports.compressAndUpload = compressAndUpload;
//# sourceMappingURL=upload.js.map
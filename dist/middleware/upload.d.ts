import multer from 'multer';
declare const upload: multer.Multer;
declare const compressAndUpload: (file: Express.Multer.File) => Promise<string>;
export { upload, compressAndUpload };

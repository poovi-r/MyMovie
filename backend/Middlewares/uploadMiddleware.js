import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and webp files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
    stream.end(buffer);
  });
};

export const getPublicIdFromUrl = (url) => {
  try {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    const publicId = `Movie-Posters/${lastSegment.split(".")[0]}`;
    return publicId;
  } catch (error) {
    console.warn("Failed to extract public ID from URL:", url);
    return null;
  }
};


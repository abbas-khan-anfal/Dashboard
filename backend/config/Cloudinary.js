import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const usereFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : (req, file) => {
        return {
            folder: `dashboard/users`,
            allowedFormats: ['jpg', 'png', 'jpeg'],
            public_id: `${file.fieldname}_${Date.now()}`,
        }
    }
});


const productFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : (req, file) => {
        return {
            folder: `dashboard/products`,
            allowedFormats: ['jpg', 'png', 'jpeg'],
            public_id: `${file.fieldname}_${Date.now()}`,
        }
    }
});


const postFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : (req, file) => {
        return {
            folder: `dashboard/posts`,
            allowedFormats: ['jpg', 'png', 'jpeg'],
            public_id: `${file.fieldname}_${Date.now()}`,
        }
    }
});


const settingFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : (req, file) => {
        return {
            folder: `dashboard/settings`,
            allowedFormats: ['jpg', 'png', 'jpeg'],
            public_id: `${file.fieldname}_${Date.now()}`,
        }
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Only JPG, JPEG, and PNG files are allowed");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
    }
    cb(null, true);
};

const userFileUploader = multer({ 
    storage: usereFileStorage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ✅ 5MB limit
});
const productFileUploader = multer({ 
    storage: productFileStorage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ✅ 5MB limit
 });
const postFileUploader = multer({ 
    storage: postFileStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ✅ 5MB limit
  });

const settingFileUploader = multer({
    storage: settingFileStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ✅ 5MB limit
});


export { userFileUploader, productFileUploader, postFileUploader, settingFileUploader };
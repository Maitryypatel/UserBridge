import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the "uploads" directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Name files with timestamp to avoid conflicts
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Allow only image files (jpg, jpeg, png)
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files (jpg, jpeg, png) are allowed"));
    }
};

// Initialize multer with storage options
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter
});

export default upload;
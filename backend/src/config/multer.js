const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads';

        if (req.baseUrl.includes('profiles')) {
            uploadPath = 'uploads/profiles';
        } 
        else if (req.baseUrl.includes('cvs')) {
            uploadPath = 'uploads/CvsThumbnailUrl';
        }
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);

        cb(null, `${uniqueName}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024}
});

module.exports = upload;
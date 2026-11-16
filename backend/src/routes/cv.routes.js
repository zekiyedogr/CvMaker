const express = require('express');
const router = express.Router();

const upload = require('../config/multer');

const { authenticateToken } = require('../middlewares/auth.middleware');
const cvController = require('../controllers/cv.controller');

// CREATE CV
router.post('/', authenticateToken, upload.single('thumbnail'), cvController.createCv);

// GET ALL CVS
router.get('/', authenticateToken,cvController.getCvs);

// GET CV BY ID
router.get('/:id', authenticateToken,cvController.getCvById);

// UPDATE CV
router.put( '/:id', authenticateToken, upload.single('thumbnail'), cvController.updateCv );

// DELETE CV
router.delete('/:id', authenticateToken, cvController.deleteCv);

module.exports = router;
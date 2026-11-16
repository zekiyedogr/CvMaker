const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/auth.middleware');
const cvPdfController = require('../controllers/pdf.controller');

// CREATE PDF
router.post( '/', authenticateToken, cvPdfController.createPdf);

module.exports = router;
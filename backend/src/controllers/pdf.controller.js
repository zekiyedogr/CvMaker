
const { generatePdf } = require('../services/pdf.service');

const createPdf = async (req, res) => {
    try {
        const { html, css } = req.body;

        if (!html || !css) {
            return res.status(400).json({
                message: 'Knowledge of HTML and CSS is required..',
            });
        }

        const pdfBuffer = await generatePdf(html, css);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="cv.pdf"'
        );
        res.setHeader('Content-Length', pdfBuffer.length);

        return res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF creation error:', error);

        return res.status(500).json({
            message: 'An error occurred while creating the PDF.',
        });
    }
};

module.exports = { createPdf };
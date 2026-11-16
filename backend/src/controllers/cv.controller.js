const cvService = require('../services/cv.service');
const fs = require('fs/promises');
const path = require('path');

const createCv = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'CV thumbnail is required.'
            });
        }

        console.log('CONTENT TYPE:', req.headers['content-type']);
        console.log('REQ BODY:', req.body);
        console.log('REQ FILE:', req.file);
        console.log('DATA:', req.body.data);
        const requestData = JSON.parse(req.body.data);

        requestData.cvData.ThumbnailUrl =
            `/uploads/CvsThumbnailUrl/${req.file.filename}`;

        const result = await cvService.createCv(userId, requestData);

        return res.status(201).json({
            status: 'success',
            message: result.message,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const getCvs = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const result = await cvService.getCvs(userId);

        return res.status(200).json({
            status: 'success',
            message: 'CVs retrieved successfully.',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const getCvById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const cvId = Number(req.params.id);

        if (!Number.isInteger(cvId) || cvId <= 0) {
            const error = new Error('Invalid CV ID.');
            error.statusCode = 400;
            throw error;
        }

        const cv = await cvService.getCvById(userId, cvId);

        res.status(200).json({
            status: 'success',
            data: cv
        });

    } catch (error) {
        next(error);
    }
};

const updateCv = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const cvId = Number(req.params.id);

        if (!Number.isInteger(cvId) || cvId <= 0) {
            const error = new Error('Invalid CV ID.');
            error.statusCode = 400;
            throw error;
        }

        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'CV thumbnail is required.'
            });
        }

        const requestData = JSON.parse(req.body.data);

        requestData.cvData.ThumbnailUrl =
            `/uploads/CvsThumbnailUrl/${req.file.filename}`;

        const result = await cvService.updateCv(
            userId,
            cvId,
            requestData
        );

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const deleteCv = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const cvId = Number(req.params.id);

        if (!Number.isInteger(cvId) || cvId <= 0) {
            const error = new Error('Invalid CV ID.');
            error.statusCode = 400;
            throw error;
        }

        const result = await cvService.deleteCv(userId, cvId);

        if (result.thumbnailUrl) {
            const filename = path.basename(result.thumbnailUrl);

            const thumbnailPath = path.join( __dirname, '../uploads/CvsThumbnailUrl', filename );

            try {
                await fs.unlink(thumbnailPath);
            }
            catch (error) {
                if (error.code !== 'ENOENT') 
                    console.error('Thumbnail deletion error:', error);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: result.message
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createCv, getCvs, getCvById, updateCv, deleteCv};
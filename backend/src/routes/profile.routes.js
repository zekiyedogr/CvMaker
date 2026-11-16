const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, profileController.getMyProfiles);

router.get('/:id', authenticateToken, profileController.getProfileById);

router.patch('/:id', authenticateToken, profileController.updateMyProfile);

router.patch('/:id/contact', authenticateToken, profileController.updateMyContact);

router.patch('/:id/languages', authenticateToken, profileController.updateMyLanguages);

router.patch('/:id/skills', authenticateToken, profileController.updateMySkills);

router.patch('/:id/references', authenticateToken, profileController.updateMyReferences);

router.patch('/:id/hobbies', authenticateToken, profileController.updateMyHobbies);

router.patch('/:id/educations', authenticateToken, profileController.updateMyEducations);

router.patch('/:id/work-experiences', authenticateToken, profileController.updateMyWorkExperiences);

router.patch('/:id/projects', authenticateToken, profileController.updateMyProjects);

router.patch(
    '/:id/certifications',
    authenticateToken,
    (req, res, next) => {
        req.profileTableName = 'Certifications';
        next();
    },
    profileController.updateMyDocuments
);

router.patch(
    '/:id/awards',
    authenticateToken,
    (req, res, next) => {
        req.profileTableName = 'Awards';
        next();
    },
    profileController.updateMyDocuments
);

router.post('/', authenticateToken, profileController.createMyProfile);

router.post('/:id/photo', authenticateToken, upload.single('photo'), profileController.uploadProfilePhoto);

router.delete('/:id', authenticateToken, profileController.deleteMyProfile);

module.exports = router;
const profileService = require('../services/profile.service');

const getMyProfiles = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profiles = await profileService.getMyProfiles(userId);

        return res.status(200).json({
            status: 'success',
            message: 'Profiles retrieved successfully.',
            data: profiles
        })
    }

    catch (error){
        console.error('Get profiles error:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        })
    }
}

const deleteMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);

        if (!Number.isInteger(profileId) || profileId <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid profile ID.'
            });
        }

        await profileService.deleteMyProfile(userId, profileId);

        return res.status(200).json({
            status: 'success',
            message: 'Profile deleted successfully.'
        });

    } catch (error) {
        next(error);
    }
};

const getProfileById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profileId = req.params.id;

        const profile = await profileService.getProfileById(userId, profileId);

        return res.status(200).json({
            status: 'success',
            message: 'Profile retrieved successfully.',
            data: profile
        })

    }

    catch (error){
        console.error('Get profile error:', error.message);

        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.statusCode ? error.message : 'Internal server error.'
        })
    }

};

const updateMyProfile  = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = req.params.id;
        const profileData = req.body;

        const updatedProfile = await profileService.updateMyProfile(userId, profileId, profileData);

        return res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully.',
            data: updatedProfile
        })
    }

    catch (error){
        next(error);
    }
};

const createMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await profileService.createProfile(userId, req.body);
        
        return res.status(201).json({
            status: 'success',
            message: 'Profile created successfully.',
            data: profile
        })
    }

    catch (error){
        console.log('Create profile error:', error.message);

        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.statusCode ? error.message : 'Internal server errorr.'
        });
    }
}

const uploadProfilePhoto = async (req, res) => {
    try {
        const profileId = Number(req.params.id);
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'Please select a photo.'
            });
        }

        const photoUrl = `/uploads/profiles/${req.file.filename}`;

        const result = await profileService.updateProfilePhoto(
            userId,
            profileId,
            photoUrl
        );

        return res.status(200).json({
            status: 'success',
            message: 'Profile photo uploaded successfully.',
            data: result
        });

    } catch (error) {
        console.error('Profile photo upload error:', error.message);

        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.statusCode ? error.message : 'Internal server error.'
        });
    }
};

const updateMyContact = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const contactData = req.body;

        const updatedContact = await profileService.updateMyContact(
            userId,
            profileId,
            contactData
        );

        return res.status(200).json({
            status: 'success',
            message: 'Contact information updated successfully.',
            data: updatedContact
        });

    } catch (error) {
        next(error);
    }
};

const updateMyLanguages = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const languages = req.body;

        const updatedLanguages = await profileService.updateMyLanguages(
            userId,
            profileId,
            languages
        );

        return res.status(200).json({
            status: 'success',
            message: 'Languages updated successfully.',
            data: updatedLanguages
        });

    } catch (error) {
        next(error);
    }
};

const updateMySkills = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const skills = req.body;

        const updatedSkills = await profileService.updateMySkills(
            userId,
            profileId,
            skills
        );

        return res.status(200).json({
            status: 'success',
            message: 'Skills updated successfully.',
            data: updatedSkills
        });

    } catch (error) {
        next(error);
    }
};

const updateMyReferences = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const references = req.body;

        const updatedReferences = await profileService.updateMyReferences(
            userId,
            profileId,
            references
        );

        return res.status(200).json({
            status: 'success',
            message: 'References updated successfully.',
            data: updatedReferences
        });
    } catch (error) {
        next(error);
    }
};

const updateMyHobbies = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const hobbies = req.body;

        const updatedHobbies = await profileService.updateMyHobbies(
            userId,
            profileId,
            hobbies
        );

        return res.status(200).json({
            status: 'success',
            message: 'Bobbies updated successfully.',
            data: updatedHobbies
        });
    }
    catch (error) {
        next(error);
    }
};

const updateMyEducations = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const educations = req.body;

        const updatedEducations = await profileService.updateMyEducations(
            userId,
            profileId,
            educations
        );

        return res.status(200).json({
            status: 'success',
            message: 'Educations updated successfully.',
            data: updatedEducations
        });
    } catch (error) {
        next(error);
    }
};

const updateMyWorkExperiences = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const workExperiences = req.body;

        const updatedWorkExperiences = await profileService.updateMyWorkExperiences(
            userId,
            profileId,
            workExperiences
        );

        return res.status(200).json({
            status: 'success',
            message: 'Work experiences updated successfully.',
            data: updatedWorkExperiences
        });

    } catch (error) {
        next(error);
    }
};

const updateMyProjects = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const projects = req.body;

        const updatedProjects = await profileService.updateMyProjects(
            userId,
            profileId,
            projects
        );

        return res.status(200).json({
            status: 'success',
            message: 'Projects updated successfully.',
            data: updatedProjects
        });

    } catch (error) {
        next(error);
    }
};

const updateMyDocuments = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const profileId = Number(req.params.id);
        const documents = req.body;
        const tableName = req.profileTableName;

        const updatedDocuments = await profileService.updateMyDocuments(
            userId,
            profileId,
            documents,
            tableName
        );

        return res.status(200).json({
            status: 'success',
            message: 'Documents updated successfully.',
            data: updatedDocuments
        });

    }
    catch (error) {
        next(error);
    }
};

module.exports = { getMyProfiles, getProfileById,
    createMyProfile, deleteMyProfile,
    updateMyProfile, uploadProfilePhoto, updateMyContact, updateMyLanguages, updateMySkills, updateMyReferences, updateMyHobbies,
    updateMyEducations, updateMyWorkExperiences, updateMyProjects, updateMyDocuments };
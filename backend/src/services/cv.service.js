const { sql } = require('../config/database');
const { getProfileData } = require('./profile.service');

const withTransaction = async (callback) => {
    const transaction = new sql.Transaction();
    let transactionStarted = false;

    try {
        await transaction.begin();
        transactionStarted = true;

        const result = await callback(transaction);

        await transaction.commit();

        return result;

    } catch (error) {
        if (transactionStarted) {
            await transaction.rollback();
        }

        throw error;
    }
};

const checkProfileOwnership = async (transaction, userId, profileId) => {
    const result = await new sql.Request(transaction).query`
        SELECT * FROM Profiles
        WHERE Id = ${profileId} AND UserId = ${userId}
    `;

    if (result.recordset.length === 0) {
        const error = new Error('Profile not found.');
        error.statusCode = 404;
        throw error;
    }

    return result.recordset[0];
};

const checkContentOwnership = async ( transaction, profileId, contentTypeId, contentId ) => {
    if ([1, 2, 16].includes(contentTypeId)) {
        if (contentId !== null) {
            const error = new Error('Summary and Photo ContentId must be null.');
            error.statusCode = 400;
            throw error;
        }
        return;
    }
    if (!Number.isInteger(contentId) || contentId <= 0) {
        const error = new Error('Invalid ContentId.');
        error.statusCode = 400;
        throw error;
    }

    let result;

    switch (contentTypeId) {

        // Education
        case 4:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Educations
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // ExpDesc -> WorkExperiences -> ProfileId
        case 5:
            result = await new sql.Request(transaction).query`
                SELECT ED.Id
                FROM ExpDesc ED
                INNER JOIN WorkExperiences WE
                    ON ED.WorkExperienceId = WE.Id
                WHERE ED.Id = ${contentId}
                AND WE.ProfileId = ${profileId}
            `;
            break;

        // WorkExperience
        case 6:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM WorkExperiences
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Project
        case 7:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Projects
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Skill
        case 8:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Skills
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // SkillItem -> Skills -> ProfileId
        case 9:
            result = await new sql.Request(transaction).query`
                SELECT SI.Id
                FROM SkillItems SI
                INNER JOIN Skills S
                    ON SI.SkillId = S.Id
                WHERE SI.Id = ${contentId}
                AND S.ProfileId = ${profileId}
            `;
            break;

        // ProDesc -> Projects -> ProfileId
        case 10:
            result = await new sql.Request(transaction).query`
                SELECT PD.Id
                FROM ProDesc PD
                INNER JOIN Projects P
                    ON PD.ProjectId = P.Id
                WHERE PD.Id = ${contentId}
                AND P.ProfileId = ${profileId}
            `;
            break;

        // Language
        case 11:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Languages
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Certification
        case 12:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Certifications
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Award
        case 13:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Awards
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Hobby
        case 14:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM Hobbies
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        // Reference
        case 15:
            result = await new sql.Request(transaction).query`
                SELECT Id FROM ProfileReferences
                WHERE Id = ${contentId}
                AND ProfileId = ${profileId}
            `;
            break;

        default: {
            const error = new Error('Invalid ContentTypeId.');
            error.statusCode = 400;
            throw error;
        }
    }

    if (result.recordset.length === 0) {
        const error = new Error(
            `Content record ${contentId} does not belong to this profile.`
        );
        error.statusCode = 400;
        throw error;
    }
};

const checkCvOwnership = async (transaction, userId, cvId) => {
    const result = await new sql.Request(transaction).query`
        SELECT C.*, 
               P.Name,
               P.PhotoUrl,
               P.FirstName,
               P.LastName,
               P.Profession,
               P.CareerSummary,
               P.CareerGoals
        FROM Cvs C
        INNER JOIN Profiles P ON C.ProfileId = P.Id
        WHERE C.Id = ${cvId}
        AND P.UserId = ${userId}
    `;

    if (result.recordset.length === 0) {
        const error = new Error('CV not found.');
        error.statusCode = 404;
        throw error;
    }

    return result.recordset[0];
};

const createCv = async (userId, data) => {
    const { cvData, CvContactsData, CvVisibilitiesData } = data;
    
    if (
        !cvData ||
        typeof cvData !== 'object' ||
        Array.isArray(cvData) ||
        !CvContactsData ||
        typeof CvContactsData !== 'object' ||
        Array.isArray(CvContactsData) ||
        !Array.isArray(CvVisibilitiesData)
    ) {
        const error = new Error('Invalid CV data.');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(cvData.ProfileId) || cvData.ProfileId <= 0) {
        const error = new Error('Invalid ProfileId.');
        error.statusCode = 400;
        throw error;
    }
    
    const invalidVisibility = CvVisibilitiesData.some(item =>
        !item ||
        !Number.isInteger(item.ContentTypeId) ||
        ![1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(item.ContentTypeId) ||
        !(item.ContentId === null || Number.isInteger(item.ContentId)) ||
        typeof item.Visibility !== 'boolean'
    );

    if (invalidVisibility) {
        const error = new Error('Invalid visibility data.');
        error.statusCode = 400;
        throw error;
    }

    const hasSummary = CvVisibilitiesData.some(item =>
        (item.ContentTypeId === 1 || item.ContentTypeId === 2) &&
        item.Visibility === true
    );

    if (!hasSummary) {
        const error = new Error(
            'CareerSummary or CareerGoals must be visible.'
        );
        error.statusCode = 400;
        throw error;
    }

    return await withTransaction(async (transaction) => {
        await checkProfileOwnership( transaction, userId, cvData.ProfileId );

        for (const item of CvVisibilitiesData) {
            await checkContentOwnership(
                transaction,
                cvData.ProfileId,
                item.ContentTypeId,
                item.ContentId
            );
        }

        // 3. Cvs
        const cvResult = await new sql.Request(transaction).query`
            INSERT INTO Cvs (
                ProfileId,
                CvName,
                Contact,
                Educations,
                WorkExperiences,
                Projects,
                Skills,
                Languages,
                Certifications,
                Awards,
                Hobbies,
                ReferenceSection,
                TemplateId,
                ColorPaletteId,
                ThumbnailUrl,
                sizeValue
            )
            OUTPUT INSERTED.Id
            VALUES (
                ${cvData.ProfileId},
                ${cvData.CvName},
                ${cvData.Contact},
                ${cvData.Educations},
                ${cvData.WorkExperiences},
                ${cvData.Projects},
                ${cvData.Skills},
                ${cvData.Languages},
                ${cvData.Certifications},
                ${cvData.Awards},
                ${cvData.Hobbies},
                ${cvData.ReferenceSection},
                ${cvData.TemplateId},
                ${cvData.ColorPaletteId},
                ${cvData.ThumbnailUrl},
                ${cvData.sizeValue}
            )
        `;

        const cvId = cvResult.recordset[0].Id;

        // 4. CvContacts
        await new sql.Request(transaction).query`
            INSERT INTO CvContacts (
                CvId,
                Email,
                Phone,
                Location,
                LinkedIn,
                GitHub,
                Portfolio,
                X,
                Medium,
                DevTo,
                Hashnode,
                Dribbble,
                Behance,
                StackOverflow,
                Skype,
                Zoom,
                Discord
            )
            VALUES (
                ${cvId},
                ${CvContactsData.Email},
                ${CvContactsData.Phone},
                ${CvContactsData.Location},
                ${CvContactsData.LinkedIn},
                ${CvContactsData.GitHub},
                ${CvContactsData.Portfolio},
                ${CvContactsData.X},
                ${CvContactsData.Medium},
                ${CvContactsData.DevTo},
                ${CvContactsData.Hashnode},
                ${CvContactsData.Dribbble},
                ${CvContactsData.Behance},
                ${CvContactsData.StackOverflow},
                ${CvContactsData.Skype},
                ${CvContactsData.Zoom},
                ${CvContactsData.Discord}
            )
        `;

        // 5. CvVisibilities
        for (const item of CvVisibilitiesData) {

            await new sql.Request(transaction).query`
                INSERT INTO CvVisibilities (
                    CvId,
                    ProfileId,
                    ContentTypeId,
                    ContentId,
                    Visibility
                )
                VALUES (
                    ${cvId},
                    ${cvData.ProfileId},
                    ${item.ContentTypeId},
                    ${item.ContentId},
                    ${item.Visibility}
                )
            `;
        }

        return {
            id: cvId,
            message: 'CV created successfully.'
        };

    });
};

const getCvs = async (userId) => {
    const result = await sql.query`
        SELECT
            C.Id,
            C.CvName,
            C.ThumbnailUrl,
            P.FirstName,
            P.LastName
        FROM Cvs C
        INNER JOIN Profiles P
            ON C.ProfileId = P.Id
        WHERE P.UserId = ${userId}
        ORDER BY C.CreatedAt DESC
    `;

    return result.recordset;
};

const getCvById = async (userId, cvId) => {
    return await withTransaction(async (transaction) => {
        
        const cv = await checkCvOwnership(transaction, userId, cvId);        
        const profile = await getProfileData(transaction, cv.ProfileId);
        
        const visibilityResult = await transaction.request()
            .input('CvId', sql.Int, cvId)
            .query(`
                SELECT ContentTypeId, ContentId, Visibility
                FROM CvVisibilities
                WHERE CvId = @CvId
            `);

        const visibilities = visibilityResult.recordset;

        const getVisibility = (contentTypeId, contentId) => {

            const visibility = visibilities.find(item =>
                item.ContentTypeId === contentTypeId &&
                item.ContentId === contentId
            );

            return visibility ? visibility.Visibility : false;
        };

        // Summary
        profile.Summary.CareerSummaryVisibility = getVisibility(1, null);
        profile.Summary.CareerGoalsVisibility = getVisibility(2, null);

        // Photo
        profile.PhotoVisibility = getVisibility(16, null);

        // Educations
        profile.Educations = profile.Educations.map(item => ({
            ...item,
            Visibility: getVisibility(4, item.Id)
        }));

        // Work Experiences
        profile.WorkExperiences = profile.WorkExperiences.map(item => ({
            ...item,
            Visibility: getVisibility(6, item.Id),
            Responsibilities: item.Responsibilities.map(description => ({
                ...description,
                Visibility: getVisibility(5, description.Id)
            }))
        }));

        // Projects
        profile.Projects = profile.Projects.map(item => ({
            ...item,
            Visibility: getVisibility(7, item.Id),
            Descriptions: item.Descriptions.map(description => ({
                ...description,
                Visibility: getVisibility(10, description.Id)
            }))
        }));

        // Skills
        profile.Skills = profile.Skills.map(item => ({
            ...item,
            Visibility: getVisibility(8, item.Id),
            Items: item.Items.map(skillItem => ({
                ...skillItem,
                Visibility: getVisibility(9, skillItem.Id)
            }))
        }));

        // Languages
        profile.Languages = profile.Languages.map(item => ({
            ...item,
            Visibility: getVisibility(11, item.Id)
        }));

        // Certifications
        profile.Certifications = profile.Certifications.map(item => ({
            ...item,
            Visibility: getVisibility(12, item.Id)
        }));

        // Awards
        profile.Awards = profile.Awards.map(item => ({
            ...item,
            Visibility: getVisibility(13, item.Id)
        }));

        // Hobbies
        profile.Hobbies = profile.Hobbies.map(item => ({
            ...item,
            Visibility: getVisibility(14, item.Id)
        }));

        // References
        profile.References = profile.References.map(item => ({
            ...item,
            Visibility: getVisibility(15, item.Id)
        }));

        const contactResult = await transaction.request()
            .input('CvId', sql.Int, cvId)
            .query(`
                SELECT *
                FROM CvContacts
                WHERE CvId = @CvId
            `);

        const cvContacts = contactResult.recordset[0] || null;

        console.log(profile)
        return {
            ...cv,
            CvContacts: cvContacts,
            Profile: profile
        };
    });
};

const updateCv = async (userId, cvId, data) => {
    const { cvData, CvContactsData, CvVisibilitiesData } = data;

    // Gelen verileri kontrol et
    if (
        !cvData ||
        typeof cvData !== 'object' ||
        Array.isArray(cvData) ||
        !CvContactsData ||
        typeof CvContactsData !== 'object' ||
        Array.isArray(CvContactsData) ||
        !Array.isArray(CvVisibilitiesData)
    ) {
        const error = new Error('Invalid CV data.');
        error.statusCode = 400;
        throw error;
    }

    // Visibility verilerini kontrol et
    const invalidVisibility = CvVisibilitiesData.some(item =>
        !item ||
        !Number.isInteger(item.ContentTypeId) ||
        ![1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(item.ContentTypeId) ||
        !(item.ContentId === null || Number.isInteger(item.ContentId)) ||
        typeof item.Visibility !== 'boolean'
    );

    if (invalidVisibility) {
        const error = new Error('Invalid visibility data.');
        error.statusCode = 400;
        throw error;
    }

    // Summary kontrolü
    const hasSummary = CvVisibilitiesData.some(item =>
        (item.ContentTypeId === 1 || item.ContentTypeId === 2) &&
        item.Visibility === true
    );

    if (!hasSummary) {
        const error = new Error(
            'CareerSummary or CareerGoals must be visible.'
        );
        error.statusCode = 400;
        throw error;
    }

    return await withTransaction(async (transaction) => {

        // 1. CV sahiplik kontrolü
        const existingCv = await checkCvOwnership(
            transaction,
            userId,
            cvId
        );

        const profileId = existingCv.ProfileId;

        // 2. İçerik sahiplik kontrolü
        for (const item of CvVisibilitiesData) {
            await checkContentOwnership(
                transaction,
                profileId,
                item.ContentTypeId,
                item.ContentId
            );
        }

        // 3. CVS TABLOSU
        await new sql.Request(transaction).query`
            UPDATE Cvs
            SET
                CvName = ${cvData.CvName},
                Contact = ${cvData.Contact},
                Educations = ${cvData.Educations},
                WorkExperiences = ${cvData.WorkExperiences},
                Projects = ${cvData.Projects},
                Skills = ${cvData.Skills},
                Languages = ${cvData.Languages},
                Certifications = ${cvData.Certifications},
                Awards = ${cvData.Awards},
                Hobbies = ${cvData.Hobbies},
                ReferenceSection = ${cvData.ReferenceSection},
                TemplateId = ${cvData.TemplateId},
                ColorPaletteId = ${cvData.ColorPaletteId},                
                ThumbnailUrl = ${cvData.ThumbnailUrl },
                sizeValue = ${cvData.sizeValue }
            WHERE Id = ${cvId}
        `;

        // 4. CV CONTACTS
        const contactResult = await new sql.Request(transaction).query`
            UPDATE CvContacts
            SET
                Email = ${CvContactsData.Email},
                Phone = ${CvContactsData.Phone},
                Location = ${CvContactsData.Location},
                LinkedIn = ${CvContactsData.LinkedIn},
                GitHub = ${CvContactsData.GitHub},
                Portfolio = ${CvContactsData.Portfolio},
                X = ${CvContactsData.X},
                Medium = ${CvContactsData.Medium},
                DevTo = ${CvContactsData.DevTo},
                Hashnode = ${CvContactsData.Hashnode},
                Dribbble = ${CvContactsData.Dribbble},
                Behance = ${CvContactsData.Behance},
                StackOverflow = ${CvContactsData.StackOverflow},
                Skype = ${CvContactsData.Skype},
                Zoom = ${CvContactsData.Zoom},
                Discord = ${CvContactsData.Discord}
            WHERE CvId = ${cvId}
        `;

        // Contact kaydı bulunamazsa oluştur
        if (contactResult.rowsAffected[0] === 0) {
            await new sql.Request(transaction).query`
                INSERT INTO CvContacts (
                    CvId,
                    Email,
                    Phone,
                    Location,
                    LinkedIn,
                    GitHub,
                    Portfolio,
                    X,
                    Medium,
                    DevTo,
                    Hashnode,
                    Dribbble,
                    Behance,
                    StackOverflow,
                    Skype,
                    Zoom,
                    Discord
                )
                VALUES (
                    ${cvId},
                    ${CvContactsData.Email},
                    ${CvContactsData.Phone},
                    ${CvContactsData.Location},
                    ${CvContactsData.LinkedIn},
                    ${CvContactsData.GitHub},
                    ${CvContactsData.Portfolio},
                    ${CvContactsData.X},
                    ${CvContactsData.Medium},
                    ${CvContactsData.DevTo},
                    ${CvContactsData.Hashnode},
                    ${CvContactsData.Dribbble},
                    ${CvContactsData.Behance},
                    ${CvContactsData.StackOverflow},
                    ${CvContactsData.Skype},
                    ${CvContactsData.Zoom},
                    ${CvContactsData.Discord}
                )
            `;
        }

        // 5. ESKİ VISIBILITY KAYITLARINI SİL
        await new sql.Request(transaction).query`
            DELETE FROM CvVisibilities
            WHERE CvId = ${cvId}
        `;

        // 6. YENİ VISIBILITY KAYITLARINI EKLE
        for (const item of CvVisibilitiesData) {
            await new sql.Request(transaction).query`
                INSERT INTO CvVisibilities (
                    CvId,
                    ProfileId,
                    ContentTypeId,
                    ContentId,
                    Visibility
                )
                VALUES (
                    ${cvId},
                    ${profileId},
                    ${item.ContentTypeId},
                    ${item.ContentId},
                    ${item.Visibility}
                )
            `;
        }

        return {
            id: cvId,
            message: 'CV updated successfully.'
        };
    });
};

const deleteCv = async (userId, cvId) => {
    return await withTransaction(async (transaction) => {

        const cv = await checkCvOwnership(transaction, userId, cvId);

        await new sql.Request(transaction).query`
            DELETE FROM Cvs
            WHERE Id = ${cvId}
        `;

        return {
            message: 'CV deleted successfully.',
            thumbnailUrl: cv.ThumbnailUrl
        };
    });
};

module.exports = {
    createCv, getCvs, getCvById, updateCv, deleteCv
};

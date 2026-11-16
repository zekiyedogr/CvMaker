const { sql } = require('../config/database');

const getMyProfiles = async (userId) => {
    const result = await sql.query`SELECT * FROM Profiles WHERE UserId = ${userId}`;

    return result.recordset;
};

const getProfileData = async (transaction, profileId) => {

    const profileResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Profiles
            WHERE Id = @ProfileId
        `);

    const createdProfile = profileResult.recordset[0];

    if (!createdProfile) {
        const error = new Error('Profile not found.');
        error.statusCode = 404;
        throw error;
    }

    const profileResponse = {
        Id: createdProfile.Id,
        UserId: createdProfile.UserId,
        Name: createdProfile.Name,
        PhotoUrl: createdProfile.PhotoUrl,

        PersonalInformation: {
            FirstName: createdProfile.FirstName,
            LastName: createdProfile.LastName,
            Profession: createdProfile.Profession
        },

        Summary: {
            CareerSummary: createdProfile.CareerSummary,
            CareerGoals: createdProfile.CareerGoals
        },

        Contact: null,
        Educations: [],
        WorkExperiences: [],
        Projects: [],
        Skills: [],
        Languages: [],
        Certifications: [],
        Awards: [],
        Hobbies: [],
        References: []
    };

    // Contact
    const contactResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM ProfileContacts
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Contact = contactResult.recordset[0] || null;


    // Educations
    const educationResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Educations
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Educations = educationResult.recordset;


    // Work Experiences
    const experienceResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM WorkExperiences
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.WorkExperiences = experienceResult.recordset;

    for (const experience of profileResponse.WorkExperiences) {

        const descriptionResult = await transaction.request()
            .input('WorkExperienceId', sql.Int, experience.Id)
            .query(`
                SELECT *
                FROM ExpDesc
                WHERE WorkExperienceId = @WorkExperienceId
            `);

        experience.Responsibilities = descriptionResult.recordset;
    }


    // Projects
    const projectResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Projects
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Projects = projectResult.recordset;

    for (const project of profileResponse.Projects) {

        const descriptionResult = await transaction.request()
            .input('ProjectId', sql.Int, project.Id)
            .query(`
                SELECT *
                FROM ProDesc
                WHERE ProjectId = @ProjectId
            `);

        project.Descriptions = descriptionResult.recordset;
    }


    // Skills
    const skillResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Skills
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Skills = skillResult.recordset;

    for (const skill of profileResponse.Skills) {

        const itemResult = await transaction.request()
            .input('SkillId', sql.Int, skill.Id)
            .query(`
                SELECT *
                FROM SkillItems
                WHERE SkillId = @SkillId
            `);

        skill.Items = itemResult.recordset;
    }


    // Languages
    const languageResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Languages
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Languages = languageResult.recordset;


    // Certifications
    const certificationResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Certifications
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Certifications = certificationResult.recordset;


    // Awards
    const awardResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Awards
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Awards = awardResult.recordset;


    // Hobbies
    const hobbyResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM Hobbies
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.Hobbies = hobbyResult.recordset;


    // References
    const referenceResult = await transaction.request()
        .input('ProfileId', sql.Int, profileId)
        .query(`
            SELECT *
            FROM ProfileReferences
            WHERE ProfileId = @ProfileId
        `);

    profileResponse.References = referenceResult.recordset;


    return profileResponse;
};

const getProfileById = async (userId, profileId) => {

    return await withTransaction(async (transaction) => {

        // Profilin kullanıcıya ait olup olmadığını kontrol et.
        await checkProfileOwnership(transaction, userId, profileId);

        // Profilin bütün bilgilerini getir.
        const profileResponse = await getProfileData(
            transaction,
            profileId
        );

        return profileResponse;
    });
};

const createProfile = async (userId, profileData) => {
    const transaction = new sql.Transaction();
    let transactionStarted = false;
    let profileResponse;

    try {
        await transaction.begin();
        transactionStarted = true;

        const userRequest = new sql.Request(transaction);

        const userResult = await userRequest.query`SELECT Id, IsActive FROM Users WHERE Id=${userId}`;

        // USER CONTROL
        if (userResult.recordset.length === 0) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        // USER ACTIVE CONTROL
        if(!userResult.recordset[0].IsActive) {
            const error = new Error('Your account is inactive.');
            error.statusCode = 403;
            throw error;
        }

        // PROFILES COUNT CONTROL
        const profileCountRequest = new sql.Request(transaction);
        const profileCount = await profileCountRequest.query`
            SELECT COUNT(*) AS TotalProfiles
            FROM Profiles
            WHERE UserId = ${userId}
        `;

        if(profileCount.recordset[0].TotalProfiles >= 3) {
            const error = new Error('You can create a maximum of 3 profiles.');
            error.statusCode = 409;
            throw error;
        }

        // CREATE PROFILE JSON DATA
        const { Name, PhotoUrl } = profileData;
        const { FirstName, LastName, Profession } = profileData.PersonalInformation;
        const { CareerSummary, CareerGoals } = profileData.Summary;
        
        const profileRequest = new sql.Request(transaction);
        const resultProfile = await profileRequest.query`
            INSERT INTO Profiles (
                UserId,
                Name,
                PhotoUrl,
                FirstName,
                LastName,
                Profession,
                CareerSummary,
                CareerGoals
            )
            OUTPUT
                INSERTED.Id,
                INSERTED.UserId,
                INSERTED.Name,
                INSERTED.PhotoUrl,
                INSERTED.FirstName,
                INSERTED.LastName,
                INSERTED.Profession,
                INSERTED.CareerSummary,
                INSERTED.CareerGoals,
                INSERTED.CreatedAt
            VALUES (
                ${userId},
                ${Name},
                ${PhotoUrl},
                ${FirstName},
                ${LastName},
                ${Profession},
                ${CareerSummary},
                ${CareerGoals}
            )
        `;
        
        const createdProfile = resultProfile.recordset[0];

        profileResponse = {
            Id: createdProfile.Id,
            UserId: createdProfile.UserId,
            Name: createdProfile.Name,
            PhotoUrl: createdProfile.PhotoUrl,
            PersonalInformation: {
                FirstName: createdProfile.FirstName,
                LastName: createdProfile.LastName,
                Profession: createdProfile.Profession
            },
            Summary: {
                CareerSummary: createdProfile.CareerSummary,
                CareerGoals: createdProfile.CareerGoals
            },
            Contact: null,
            Educations: [],
            WorkExperiences: [],
            Projects: [],
            Skills: [],
            Languages: [],
            Certifications: [],
            Awards: [],
            Hobbies: [],
            References: []
        };

        const profileId = createdProfile.Id;

        // CONTACT
        const contactRequest = new sql.Request(transaction);
    const { Contact } = profileData;

    const { Email, Phone, Location, LinkedIn, GitHub, Portfolio, X, Medium, DevTo, Hashnode, Dribbble,
    Behance, StackOverflow, Skype, Zoom, Discord } = Contact;

        const resultContact = await contactRequest.query`
            INSERT INTO ProfileContacts (
                ProfileId,
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
            OUTPUT
                INSERTED.Id,
                INSERTED.ProfileId,
                INSERTED.Email,
                INSERTED.Phone,
                INSERTED.Location,
                INSERTED.LinkedIn,
                INSERTED.GitHub,
                INSERTED.Portfolio,
                INSERTED.X,
                INSERTED.Medium,
                INSERTED.DevTo,
                INSERTED.Hashnode,
                INSERTED.Dribbble,
                INSERTED.Behance,
                INSERTED.StackOverflow,
                INSERTED.Skype,
                INSERTED.Zoom,
                INSERTED.Discord
            VALUES (
                ${profileId},
                ${Email},
                ${Phone},
                ${Location},
                ${LinkedIn},
                ${GitHub},
                ${Portfolio},
                ${X},
                ${Medium},
                ${DevTo},
                ${Hashnode},
                ${Dribbble},
                ${Behance},
                ${StackOverflow},
                ${Skype},
                ${Zoom},
                ${Discord}
            )
        `;
        
        profileResponse.Contact = resultContact.recordset[0];
        
        // EDUCATIONS
        const { Educations } = profileData;
        for (const EducationItem of Educations) {
            const {
                SchoolName, Department, Degree, Location, StartDate, EndDate, IsPresent
            } = EducationItem;
            
            const educaitonRequest = new sql.Request(transaction);
            const resultEducation = await educaitonRequest.query`
                INSERT INTO Educations (
                    ProfileId,
                    SchoolName,
                    Department,
                    Degree,
                    Location,
                    StartDate,
                    EndDate,
                    IsPresent
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.SchoolName,
                    INSERTED.Department,
                    INSERTED.Degree,
                    INSERTED.Location,
                    INSERTED.StartDate,
                    INSERTED.EndDate,
                    INSERTED.IsPresent
                VALUES (
                    ${profileId},
                    ${SchoolName},
                    ${Department},
                    ${Degree},
                    ${Location},
                    ${StartDate},
                    ${EndDate},
                    ${IsPresent}
                )
            `;
            
            profileResponse.Educations.push(resultEducation.recordset[0]);
        }

        // WORK EXPERINCES
        const { WorkExperiences } = profileData;
        for ( const WorkExpItem of WorkExperiences) {
            const { CompanyName, Position, Location, StartDate, EndDate, IsPresent, Responsibilities } = WorkExpItem;
            
            const workExperienceRequest = new sql.Request(transaction);
            const resultWorkExperience = await workExperienceRequest.query`
                INSERT INTO WorkExperiences (
                    ProfileId,
                    CompanyName,
                    Position,
                    Location,
                    StartDate,
                    EndDate,
                    IsPresent
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.CompanyName,
                    INSERTED.Position,
                    INSERTED.Location,
                    INSERTED.StartDate,
                    INSERTED.EndDate,
                    INSERTED.IsPresent
                VALUES (
                    ${profileId},
                    ${CompanyName},
                    ${Position},
                    ${Location},
                    ${StartDate},
                    ${EndDate},
                    ${IsPresent}
                )                
            `;

            const WorkExperienceResponse = {
                ...resultWorkExperience.recordset[0],
                Responsibilities: []
            };
            
            const WorkExperienceId = resultWorkExperience.recordset[0].Id;

            for (const Responsibility of Responsibilities) {
                const { Description } = Responsibility;

                const workDescRequest = new sql.Request(transaction);

                const resultResponsibility = await workDescRequest.query`
                    INSERT INTO ExpDesc (
                        WorkExperienceId,
                        Description
                    )
                    OUTPUT
                        INSERTED.Id,
                        INSERTED.WorkExperienceId,
                        INSERTED.Description
                    VALUES (
                        ${WorkExperienceId},
                        ${Description}
                    )
                `;

                WorkExperienceResponse.Responsibilities.push(
                    resultResponsibility.recordset[0]
                );
            }

            profileResponse.WorkExperiences.push(WorkExperienceResponse);
        }
        
        // PROJECTS
        const { Projects } = profileData;

        for (const ProjectItem of Projects) {
            const { ProjectName, Date, Descriptions, Link } = ProjectItem;

            const projectRequest = new sql.Request(transaction);

            const resultProject = await projectRequest.query`
                INSERT INTO Projects (
                    ProfileId,
                    ProjectName,
                    Date,
                    Link
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.ProjectName,
                    INSERTED.Date,
                    INSERTED.Link
                VALUES (
                    ${profileId},
                    ${ProjectName},
                    ${Date},
                    ${Link}
                )
            `;

            const projectResponse = {
                ...resultProject.recordset[0],
                Descriptions: []
            };

            const ProjectId = resultProject.recordset[0].Id;

            for (const DescItem of Descriptions) {
                const { Description } = DescItem;

                const projectDescRequest = new sql.Request(transaction);

                const resultDesc = await projectDescRequest.query`
                    INSERT INTO ProDesc (
                        ProjectId,
                        Description
                    )
                    OUTPUT
                        INSERTED.Id,
                        INSERTED.ProjectId,
                        INSERTED.Description
                    VALUES (
                        ${ProjectId},
                        ${Description}
                    )
                `;

                projectResponse.Descriptions.push(resultDesc.recordset[0]);
            }

            profileResponse.Projects.push(projectResponse);
        }

       //SKILLS
        const { Skills } = profileData;

        for (const SkillItem of Skills) {
            const { Title, Items } = SkillItem;

            const skillRequest = new sql.Request(transaction);

            const resultSkill = await skillRequest.query`
                INSERT INTO Skills (
                    ProfileId, Title
                )
                OUTPUT
                    INSERTED.Id, INSERTED.ProfileId, INSERTED.Title
                VALUES (
                    ${profileId}, ${Title}
                )
            `;

            const skillResponse = {
                ...resultSkill.recordset[0],
                Items: []
            };

            const SkillId = resultSkill.recordset[0].Id;

            for (const Item of Items) {
                const { Name } = Item;

                const skillItemRequest = new sql.Request(transaction);

                const resultSkillItem = await skillItemRequest.query`
                    INSERT INTO SkillItems (
                        SkillId, Name
                    )
                    OUTPUT
                        INSERTED.Id, INSERTED.SkillId, INSERTED.Name
                    VALUES (
                        ${SkillId}, ${Name}
                    )
                `;

                skillResponse.Items.push(resultSkillItem.recordset[0]);
            }

            profileResponse.Skills.push(skillResponse);
        }

        // LANGUAGES
        const { Languages } = profileData;
        for (const LangItem of Languages) {
            const { Name, Levels } = LangItem;

            const langRequest = new sql.Request(transaction);

            const resultLang = await langRequest.query`
                INSERT INTO Languages (
                    ProfileId,
                    Name,
                    Levels
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.Name,
                    INSERTED.Levels
                VALUES (
                    ${profileId},
                    ${Name},
                    ${Levels}
                )
            `;

            profileResponse.Languages.push(resultLang.recordset[0]);
        }

        // CERTIFICATIONS
        const { Certifications } = profileData;
        for (const CertifItem of Certifications) {
            const { Title, Issuer, Date } = CertifItem;

            const certRequest = new sql.Request(transaction);

            const resultCertif = await certRequest.query`
                INSERT INTO Certifications (
                    ProfileId,
                    Title,
                    Issuer,
                    Date
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.Title,
                    INSERTED.Issuer,
                    INSERTED.Date
                VALUES (
                    ${profileId},
                    ${Title},
                    ${Issuer},
                    ${Date}
                )
            `;

            profileResponse.Certifications.push(resultCertif.recordset[0]);
        }

        //AWARDS
        const { Awards } = profileData;
        for (const AwardItem of Awards) {
            const { Title, Issuer, Date } = AwardItem;

            const awardRequest = new sql.Request(transaction);

            const resultAward = await awardRequest.query`
                INSERT INTO Awards (
                    ProfileId,
                    Title,
                    Issuer,
                    Date
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.Title,
                    INSERTED.Issuer,
                    INSERTED.Date
                VALUES (
                    ${profileId},
                    ${Title},
                    ${Issuer},
                    ${Date}
                )
            `;

            profileResponse.Awards.push(resultAward.recordset[0]);
        }

        // HOBBIES
        const { Hobbies } = profileData;
        for (const HobbyItem of Hobbies) {
            const { Name } = HobbyItem;

            const hobbyRequest = new sql.Request(transaction);

            const resultHobby = await hobbyRequest.query`
                INSERT INTO Hobbies (
                    ProfileId,
                    Name
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.Name
                VALUES (
                    ${profileId},
                    ${Name}
                )
            `;

            profileResponse.Hobbies.push(resultHobby.recordset[0]);
        }

        // REFERENCES
        const { References } = profileData;
        for (const RefItem of References) {
            const { Name, Position, Contact } = RefItem;

            const refRequest = new sql.Request(transaction);

            const resultRef = await refRequest.query`
                INSERT INTO ProfileReferences (
                    ProfileId,
                    Name,
                    Position,
                    Contact
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.ProfileId,
                    INSERTED.Name,
                    INSERTED.Position,
                    INSERTED.Contact
                VALUES (
                    ${profileId},
                    ${Name},
                    ${Position},
                    ${Contact}
                )
            `;

            profileResponse.References.push(resultRef.recordset[0]);
        }

        await transaction.commit();
    }

    catch(error) {
        if (transactionStarted) {
            await transaction.rollback();
        }
        throw error;
    }

    return profileResponse;
};

const updateMyProfile = async (userId, profileId, profileData) => {
    return withTransaction(async (transaction) => {
        const oldProfile = await checkProfileOwnership(transaction, userId, profileId);
        const updates = {};

        // PROFILE FIELDS
        const profileFields = [
            { data: profileData, property: 'Name', column: 'Name' },
            { data: profileData, property: 'PhotoUrl', column: 'PhotoUrl' },

            { data: profileData.PersonalInformation ?? {}, property: 'FirstName', column: 'FirstName' },
            { data: profileData.PersonalInformation ?? {}, property: 'LastName', column: 'LastName' },
            { data: profileData.PersonalInformation ?? {}, property: 'Profession', column: 'Profession' },

            { data: profileData.Summary ?? {}, property: 'CareerSummary', column: 'CareerSummary' },
            { data: profileData.Summary ?? {}, property: 'CareerGoals', column: 'CareerGoals' }
        ];

        for (const { data, property, column } of profileFields) {
            if (
                Object.prototype.hasOwnProperty.call(data, property) &&
                data[property] !== oldProfile[column]
            ) {
                updates[column] = data[property];
            }
        }

        // UPDATE PROFILE
        const columns = Object.keys(updates);

        if (columns.length > 0) {
            const setColumn = columns
                .map(column => `${column} = @${column}`)
                .join(', ');

            const updateRequest = new sql.Request(transaction);

            updateRequest.input('ProfileId', sql.Int, profileId);
            updateRequest.input('UserId', sql.Int, userId);

            for (const column of columns) {
                updateRequest.input(column, updates[column]);
            }

            await updateRequest.query(`
                UPDATE Profiles
                SET ${setColumn}, UpdatedAt = GETDATE()
                WHERE Id = @ProfileId AND UserId = @UserId
            `);
        }

        // GET UPDATED PROFILE
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Profiles
            WHERE Id = ${profileId} AND UserId = ${userId}
        `;

        return responseResult.recordset[0];
    });
};

const updateProfilePhoto = async (userId, profileId, photoUrl) => {
    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // UPDATE PROFILE PHOTO
        const updateRequest = new sql.Request(transaction);

        await updateRequest.query`
            UPDATE Profiles
            SET PhotoUrl = ${photoUrl},
                UpdatedAt = GETDATE()
            WHERE Id = ${profileId} AND UserId = ${userId}
        `;

        // GET UPDATED PROFILE
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Profiles
            WHERE Id = ${profileId} AND UserId = ${userId}
        `;

        return responseResult.recordset[0];
    });
};

const updateMyContact = async (userId, profileId, contactData) => {
    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // CONTACT FIELD MAPPING
        const contactFields = {
            Email: 'Email',
            Phone: 'Phone',
            Location: 'Location',
            LinkedIn: 'LinkedIn',
            GitHub: 'GitHub',
            Portfolio: 'Portfolio',
            X: 'X',
            Medium: 'Medium',
            DevTo: 'DevTo',
            Hashnode: 'Hashnode',
            Dribbble: 'Dribbble',
            Behance: 'Behance',
            StackOverflow: 'StackOverflow',
            Skype: 'Skype',
            Zoom: 'Zoom',
            Discord: 'Discord'
        };

        const updates = {};

        for (const [property, column] of Object.entries(contactFields)) {
            if (Object.prototype.hasOwnProperty.call(contactData, property)) {
                updates[column] = contactData[property];
            }
        }

        // CHECK CONTACT
        const contactRequest = new sql.Request(transaction);

        const existingContact = await contactRequest.query`
            SELECT * FROM ProfileContacts
            WHERE ProfileId = ${profileId}
        `;

        if (existingContact.recordset.length === 0) {
            const error = new Error('Contact information not found.');
            error.statusCode = 404;
            throw error;
        }

        // UPDATE CONTACT
        const columns = Object.keys(updates);

        if (columns.length > 0) {
            const setColumns = columns
                .map(column => `${column} = @${column}`)
                .join(', ');

            const updateRequest = new sql.Request(transaction);

            updateRequest.input('ProfileId', sql.Int, profileId);

            for (const column of columns) {
                updateRequest.input(column, updates[column]);
            }

            await updateRequest.query(`
                UPDATE ProfileContacts
                SET ${setColumns},
                    UpdatedAt = GETDATE()
                WHERE ProfileId = @ProfileId
            `);
        }

        // GET UPDATED CONTACT
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM ProfileContacts
            WHERE ProfileId = ${profileId}
        `;

        return responseResult.recordset[0];
    });
};

const updateMyLanguages = async (userId, profileId, languages) => {
    if (!Array.isArray(languages)) {
        const error = new Error('Languages must be an array.');
        error.statusCode = 400;
        throw error;
    }

    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING LANGUAGES
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM Languages
            WHERE ProfileId = ${profileId}
        `;

        const existingLanguages = existingResult.recordset;

        const existingIds = existingLanguages.map(language => language.Id);
        const receivedIds = languages
            .filter(language => language.Id !== undefined && language.Id !== null)
            .map(language => Number(language.Id));

        // CHECK DUPLICATE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate language IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK LANGUAGE IDS BELONG TO PROFILE
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid language ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE LANGUAGES
        for (const language of languages) {
            const { Id, Name, Levels } = language;

            if (
                typeof Name !== 'string' ||
                !Name.trim() ||
                typeof Levels !== 'string' ||
                !Levels.trim()
            ) {
                const error = new Error('Language name and level are required.');
                error.statusCode = 400;
                throw error;
            }

            if (Id !== undefined && Id !== null) {
                // UPDATE EXISTING LANGUAGE
                const oldLanguage = existingLanguages.find(
                    item => item.Id === Number(Id)
                );

                if (
                    oldLanguage.Name !== Name.trim() ||
                    oldLanguage.Levels !== Levels.trim()
                ) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE Languages
                        SET Name = ${Name.trim()},
                            Levels = ${Levels.trim()},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${Number(Id)}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                // INSERT NEW LANGUAGE
                const insertRequest = new sql.Request(transaction);

                await insertRequest.query`
                    INSERT INTO Languages (
                        ProfileId,
                        Name,
                        Levels
                    )
                    VALUES (
                        ${profileId},
                        ${Name.trim()},
                        ${Levels.trim()}
                    )
                `;
            }
        }

        // DELETE REMOVED LANGUAGES
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `Id${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM Languages
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')})
            `);
        }

        // GET UPDATED LANGUAGES
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Languages
            WHERE ProfileId = ${profileId}
        `;

        return responseResult.recordset;
    });
};

const validateSkills = (skills) => {
    if (!Array.isArray(skills)) {
        const error = new Error('Skills must be an array.');
        error.statusCode = 400;
        throw error;
    }

    for (const skill of skills) {
        if (
            !skill ||
            typeof skill.Title !== 'string' ||
            !skill.Title.trim() ||
            !Array.isArray(skill.Items)
        ) {
            const error = new Error('Skill title and items are required.');
            error.statusCode = 400;
            throw error;
        }

        for (const item of skill.Items) {
            if (
                !item ||
                typeof item.Name !== 'string' ||
                !item.Name.trim()
            ) {
                const error = new Error('Skill name is required.');
                error.statusCode = 400;
                throw error;
            }
        }
    }
};

const updateMySkills = async (userId, profileId, skills) => {
    validateSkills(skills);

    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING SKILLS
        const existingSkillsRequest = new sql.Request(transaction);

        const existingSkillsResult = await existingSkillsRequest.query`
            SELECT * FROM Skills
            WHERE ProfileId = ${profileId}
        `;

        const existingSkills = existingSkillsResult.recordset;
        const existingSkillIds = existingSkills.map(skill => skill.Id);

        const receivedSkillIds = skills
            .filter(skill => skill.Id !== undefined && skill.Id !== null)
            .map(skill => Number(skill.Id));

        // CHECK DUPLICATE SKILL IDS
        if (new Set(receivedSkillIds).size !== receivedSkillIds.length) {
            const error = new Error('Duplicate skill IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK SKILL OWNERSHIP
        for (const id of receivedSkillIds) {
            if (!existingSkillIds.includes(id)) {
                const error = new Error('Invalid skill ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE SKILLS
        for (const skill of skills) {
            const { Id, Title, Items } = skill;
            let skillId;

            if (Id !== undefined && Id !== null) {
                skillId = Number(Id);

                const oldSkill = existingSkills.find(
                    item => item.Id === skillId
                );

                if (oldSkill.Title !== Title.trim()) {
                    const updateSkillRequest = new sql.Request(transaction);

                    await updateSkillRequest.query`
                        UPDATE Skills
                        SET Title = ${Title.trim()},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${skillId}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                const insertSkillRequest = new sql.Request(transaction);

                const insertSkillResult = await insertSkillRequest.query`
                    INSERT INTO Skills (ProfileId, Title)
                    OUTPUT INSERTED.Id
                    VALUES (${profileId}, ${Title.trim()})
                `;

                skillId = insertSkillResult.recordset[0].Id;
            }

            // GET EXISTING SKILL ITEMS
            const existingItemsRequest = new sql.Request(transaction);

            const existingItemsResult = await existingItemsRequest.query`
                SELECT * FROM SkillItems
                WHERE SkillId = ${skillId}
            `;

            const existingItems = existingItemsResult.recordset;
            const existingItemIds = existingItems.map(item => item.Id);

            const receivedItemIds = Items
                .filter(Items => Items.Id !== undefined && Items.Id !== null)
                .map(Items => Number(Items.Id));

            // CHECK DUPLICATE ITEM IDS
            if (new Set(receivedItemIds).size !== receivedItemIds.length) {
                const error = new Error('Duplicate skill item IDs are not allowed.');
                error.statusCode = 400;
                throw error;
            }

            // CHECK ITEM OWNERSHIP
            for (const id of receivedItemIds) {
                if (!existingItemIds.includes(id)) {
                    const error = new Error('Invalid skill item ID.');
                    error.statusCode = 400;
                    throw error;
                }
            }

            // INSERT OR UPDATE SKILL ITEMS
            for (const item of Items) {
                if (item.Id !== undefined && item.Id !== null) {
                    const oldItem = existingItems.find(
                        existing => existing.Id === Number(item.Id)
                    );

                    if (oldItem.Name !== item.Name.trim()) {
                        const updateItemRequest = new sql.Request(transaction);

                        await updateItemRequest.query`
                            UPDATE SkillItems
                            SET Name = ${item.Name.trim()},
                                UpdatedAt = GETDATE()
                            WHERE Id = ${Number(item.Id)}
                            AND SkillId = ${skillId}
                        `;
                    }
                } else {
                    const insertItemRequest = new sql.Request(transaction);

                    await insertItemRequest.query`
                        INSERT INTO SkillItems (SkillId, Name)
                        VALUES (${skillId}, ${item.Name.trim()})
                    `;
                }
            }

            // DELETE REMOVED SKILL ITEMS
            const itemIdsToDelete = existingItemIds.filter(
                id => !receivedItemIds.includes(id)
            );

            if (itemIdsToDelete.length > 0) {
                const deleteItemsRequest = new sql.Request(transaction);

                deleteItemsRequest.input('SkillId', sql.Int, skillId);

                const parameters = itemIdsToDelete.map((id, index) => {
                    const parameterName = `ItemId${index}`;
                    deleteItemsRequest.input(parameterName, sql.Int, id);
                    return `@${parameterName}`;
                });

                await deleteItemsRequest.query(`
                    DELETE FROM SkillItems
                    WHERE SkillId = @SkillId
                    AND Id IN (${parameters.join(', ')})
                `);
            }
        }

        // DELETE REMOVED SKILLS
        const skillIdsToDelete = existingSkillIds.filter(
            id => !receivedSkillIds.includes(id)
        );

        if (skillIdsToDelete.length > 0) {
            const deleteSkillsRequest = new sql.Request(transaction);

            deleteSkillsRequest.input('ProfileId', sql.Int, profileId);

            const parameters = skillIdsToDelete.map((id, index) => {
                const parameterName = `SkillId${index}`;
                deleteSkillsRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteSkillsRequest.query(`
                DELETE FROM SkillItems
                WHERE SkillId IN (${parameters.join(', ')});

                DELETE FROM Skills
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')});
            `);
        }

        // GET UPDATED SKILLS
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Skills
            WHERE ProfileId = ${profileId}
        `;

        const skillsResponse = responseResult.recordset;

        for (const skill of skillsResponse) {
            const itemsRequest = new sql.Request(transaction);

            const itemsResult = await itemsRequest.query`
                SELECT * FROM SkillItems
                WHERE SkillId = ${skill.Id}
            `;

            skill.Items = itemsResult.recordset;
        }

        return skillsResponse;
    });
};

const updateMyReferences = async (userId, profileId, references) => {
    if (!Array.isArray(references)) {
        const error = new Error('References must be an array.');
        error.statusCode = 400;
        throw error;
    }

    for (const reference of references) {
        if (
            !reference ||
            typeof reference.Name !== 'string' ||
            !reference.Name.trim() ||
            typeof reference.Position !== 'string' ||
            !reference.Position.trim() ||
            typeof reference.Contact !== 'string' ||
            !reference.Contact.trim()
        ) {
            const error = new Error(
                'Reference name, position and contact are required.'
            );
            error.statusCode = 400;
            throw error;
        }
    }

    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING REFERENCES
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM ProfileReferences
            WHERE ProfileId = ${profileId}
        `;

        const existingReferences = existingResult.recordset;

        const existingIds = existingReferences.map(
            reference => reference.Id
        );

        const receivedIds = references
            .filter(reference => reference.Id !== undefined && reference.Id !== null)
            .map(reference => Number(reference.Id));

        // CHECK DUPLICATE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate reference IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK REFERENCE OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid reference ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE REFERENCES
        for (const reference of references) {
            const { Id, Name, Position, Contact } = reference;

            if (Id !== undefined && Id !== null) {
                const oldReference = existingReferences.find(
                    item => item.Id === Number(Id)
                );

                if (
                    oldReference.Name !== Name.trim() ||
                    oldReference.Position !== Position.trim() ||
                    oldReference.Contact !== Contact.trim()
                ) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE ProfileReferences
                        SET Name = ${Name.trim()},
                            Position = ${Position.trim()},
                            Contact = ${Contact.trim()},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${Number(Id)}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                const insertRequest = new sql.Request(transaction);

                await insertRequest.query`
                    INSERT INTO ProfileReferences (
                        ProfileId,
                        Name,
                        Position,
                        Contact
                    )
                    VALUES (
                        ${profileId},
                        ${Name.trim()},
                        ${Position.trim()},
                        ${Contact.trim()}
                    )
                `;
            }
        }

        // DELETE REMOVED REFERENCES
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `ReferenceId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM ProfileReferences
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')})
            `);
        }

        // GET UPDATED REFERENCES
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM ProfileReferences
            WHERE ProfileId = ${profileId}
        `;

        return responseResult.recordset;
    });
};

const updateMyHobbies = async (userId, profileId, hobbies) => {
    if (!Array.isArray(hobbies)) {
        const error = new Error('Hobbies must be an array.');
        error.statusCode = 400;
        throw error;
    }

    for (const hobby of hobbies) {
        if (
            !hobby ||
            typeof hobby.Name !== 'string' ||
            !hobby.Name.trim()
        ) {
            const error = new Error('Hobby name is required.');
            error.statusCode = 400;
            throw error;
        }
    }

    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING HOBBIES
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM Hobbies
            WHERE ProfileId = ${profileId}
        `;

        const existingHobbies = existingResult.recordset;

        const existingIds = existingHobbies.map(
            hobby => hobby.Id
        );

        const receivedIds = hobbies
            .filter(hobby => hobby.Id !== undefined && hobby.Id !== null)
            .map(hobby => Number(hobby.Id));

        // CHECK DUPLICATE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate hobby IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK HOBBY OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid hobby ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE HOBBIES
        for (const hobby of hobbies) {
            const { Id, Name } = hobby;

            if (Id !== undefined && Id !== null) {
                const oldHobby = existingHobbies.find(
                    item => item.Id === Number(Id)
                );

                if (oldHobby && oldHobby.Name !== Name.trim()) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE Hobbies
                        SET Name = ${Name.trim()},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${Number(Id)}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                const insertRequest = new sql.Request(transaction);

                await insertRequest.query`
                    INSERT INTO Hobbies (
                        ProfileId,
                        Name
                    )
                    VALUES (
                        ${profileId},
                        ${Name.trim()}
                    )
                `;
            }
        }

        // DELETE REMOVED HOBBIES
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `HobbyId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM Hobbies
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')})
            `);
        }

        // GET UPDATED HOBBIES
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Hobbies
            WHERE ProfileId = ${profileId}
        `;

        return responseResult.recordset;
    });
};

const updateMyEducations = async (userId, profileId, educations) => {
    if (!Array.isArray(educations)) {
        const error = new Error('Educations must be an array.');
        error.statusCode = 400;
        throw error;
    }

    for (const edu of educations) {
        if (
            !edu ||
            typeof edu !== 'object' ||
            typeof edu.SchoolName !== 'string' ||
            !edu.SchoolName.trim() ||
            typeof edu.Department !== 'string' ||
            !edu.Department.trim() ||
            typeof edu.Degree !== 'string' ||
            !edu.Degree.trim() ||
            typeof edu.Location !== 'string' ||
            !edu.Location.trim() ||
            !edu.StartDate ||
            typeof edu.IsPresent !== 'boolean' ||
            edu.IsPresent !== (edu.EndDate == null)
        ) {
            const error = new Error(
                'School name, department, degree, location and start date are required.'
            );
            error.statusCode = 400;
            throw error;
        }
    }

    return withTransaction(async (transaction) => {
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING EDUCATIONS
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM Educations
            WHERE ProfileId = ${profileId}
        `;

        const existingEducations = existingResult.recordset;

        const existingIds = existingEducations.map(
            edu => edu.Id
        );

        const receivedIds = educations
            .filter(edu => edu.Id !== undefined && edu.Id !== null)
            .map(edu => Number(edu.Id));

        // CHECK DUPLICATE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate education IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK EDUCATION OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid education ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE EDUCATIONS
        for (const edu of educations) {
            const {
                Id,
                SchoolName,
                Department,
                Degree,
                Location,
                StartDate,
                EndDate,
                IsPresent
            } = edu;

            if (Id !== undefined && Id !== null) {
                const oldEdu = existingEducations.find(
                    item => item.Id === Number(Id)
                );

                if (
                    oldEdu &&
                    (
                        oldEdu.SchoolName !== SchoolName.trim() ||
                        oldEdu.Department !== Department.trim() ||
                        oldEdu.Degree !== Degree.trim() ||
                        oldEdu.Location !== Location.trim() ||
                        new Date(oldEdu.StartDate).getTime() !== new Date(StartDate).getTime() ||
                        (oldEdu.EndDate ? new Date(oldEdu.EndDate).getTime() : null) !==
                            (EndDate ? new Date(EndDate).getTime() : null) ||
                        Boolean(oldEdu.IsPresent) !== IsPresent
                    )
                ) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE Educations
                        SET SchoolName = ${SchoolName.trim()},
                            Department = ${Department.trim()},
                            Degree = ${Degree.trim()},
                            Location = ${Location.trim()},
                            StartDate = ${StartDate},
                            EndDate = ${EndDate},
                            IsPresent = ${IsPresent},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${Number(Id)}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                const insertRequest = new sql.Request(transaction);

                await insertRequest.query`
                    INSERT INTO Educations (
                        ProfileId,
                        SchoolName,
                        Department,
                        Degree,
                        Location,
                        StartDate,
                        EndDate,
                        IsPresent
                    )
                    VALUES (
                        ${profileId},
                        ${SchoolName.trim()},
                        ${Department.trim()},
                        ${Degree.trim()},
                        ${Location.trim()},
                        ${StartDate},
                        ${EndDate},
                        ${IsPresent}
                    )
                `;
            }
        }

        // DELETE REMOVED EDUCATIONS
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `EduId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM Educations
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')})
            `);
        }

        // GET UPDATED EDUCATIONS
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Educations
            WHERE ProfileId = ${profileId}
        `;

        return responseResult.recordset;
    });
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

const updateMyWorkExperiences = async (userId, profileId, workExperiences) => {
    if (!Array.isArray(workExperiences)) {
        const error = new Error('Work experiences must be an array.');
        error.statusCode = 400;
        throw error;
    }

    // VALIDATE WORK EXPERIENCES
    for (const workExp of workExperiences) {
        if (
            !workExp ||
            typeof workExp !== 'object' ||
            typeof workExp.CompanyName !== 'string' ||
            !workExp.CompanyName.trim() ||
            typeof workExp.Position !== 'string' ||
            !workExp.Position.trim() ||
            typeof workExp.Location !== 'string' ||
            !workExp.Location.trim() ||
            !workExp.StartDate ||
            typeof workExp.IsPresent !== 'boolean' ||
            workExp.IsPresent !== (workExp.EndDate == null) ||
            !Array.isArray(workExp.Responsibilities )
        ) {
            const error = new Error(
                'Company name, position, location, start date and responsibilities are required.'
            );
            error.statusCode = 400;
            throw error;
        }

        for (const responsibility of workExp.Responsibilities) {
            if (
                !responsibility ||
                typeof responsibility.Description !== 'string' ||
                !responsibility.Description.trim()
            ) {
                const error = new Error('Responsibility description is required.');
                error.statusCode = 400;
                throw error;
            }
        }
    }

    return withTransaction(async (transaction) => {
        // CHECK PROFILE OWNERSHIP
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING WORK EXPERIENCES
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM WorkExperiences
            WHERE ProfileId = ${profileId}
        `;

        const existingWorkExperiences = existingResult.recordset;

        const existingIds = existingWorkExperiences.map(
            workExp => workExp.Id
        );

        const receivedIds = workExperiences
            .filter(workExp => workExp.Id !== undefined && workExp.Id !== null)
            .map(workExp => Number(workExp.Id));

        // CHECK DUPLICATE WORK EXPERIENCE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate work experience IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK WORK EXPERIENCE OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid work experience ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE WORK EXPERIENCES
        for (const workExp of workExperiences) {
            const {
                Id,
                CompanyName,
                Position,
                Location,
                StartDate,
                EndDate,
                IsPresent,
                Responsibilities
            } = workExp;

            let workExperienceId;

            if (Id !== undefined && Id !== null) {
                workExperienceId = Number(Id);

                const oldWorkExp = existingWorkExperiences.find(
                    item => item.Id === workExperienceId
                );

                if (
                    oldWorkExp.CompanyName !== CompanyName.trim() ||
                    oldWorkExp.Position !== Position.trim() ||
                    oldWorkExp.Location !== Location.trim() ||
                    new Date(oldWorkExp.StartDate).getTime() !== new Date(StartDate).getTime() ||
                    (oldWorkExp.EndDate ? new Date(oldWorkExp.EndDate).getTime() : null) !==
                        (EndDate ? new Date(EndDate).getTime() : null) ||
                    Boolean(oldWorkExp.IsPresent) !== IsPresent
                ) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE WorkExperiences
                        SET CompanyName = ${CompanyName.trim()},
                            Position = ${Position.trim()},
                            Location = ${Location.trim()},
                            StartDate = ${StartDate},
                            EndDate = ${EndDate},
                            IsPresent = ${IsPresent},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${workExperienceId}
                        AND ProfileId = ${profileId}
                    `;
                }
            } else {
                // INSERT NEW WORK EXPERIENCE
                const insertRequest = new sql.Request(transaction);

                const insertResult = await insertRequest.query`
                    INSERT INTO WorkExperiences (
                        ProfileId,
                        CompanyName,
                        Position,
                        Location,
                        StartDate,
                        EndDate,
                        IsPresent
                    )
                    OUTPUT INSERTED.Id
                    VALUES (
                        ${profileId},
                        ${CompanyName.trim()},
                        ${Position.trim()},
                        ${Location.trim()},
                        ${StartDate},
                        ${EndDate},
                        ${IsPresent}
                    )
                `;

                workExperienceId = insertResult.recordset[0].Id;
            }

            // GET EXISTING RESPONSIBILITIES
            const existingDescRequest = new sql.Request(transaction);

            const existingDescResult = await existingDescRequest.query`
                SELECT * FROM ExpDesc
                WHERE WorkExperienceId = ${workExperienceId}
            `;

            const existingResponsibilities = existingDescResult.recordset;

            const existingDescIds = existingResponsibilities.map(
                responsibility => responsibility.Id
            );

            const receivedDescIds = Responsibilities
                .filter(item => item.Id !== undefined && item.Id !== null)
                .map(item => Number(item.Id));

            // CHECK DUPLICATE RESPONSIBILITY IDS
            if (new Set(receivedDescIds).size !== receivedDescIds.length) {
                const error = new Error('Duplicate responsibility IDs are not allowed.');
                error.statusCode = 400;
                throw error;
            }

            // CHECK RESPONSIBILITY OWNERSHIP
            for (const id of receivedDescIds) {
                if (!existingDescIds.includes(id)) {
                    const error = new Error('Invalid responsibility ID.');
                    error.statusCode = 400;
                    throw error;
                }
            }

            // INSERT OR UPDATE RESPONSIBILITIES
            for (const responsibility of Responsibilities) {
                const { Id, Description } = responsibility;

                if (Id !== undefined && Id !== null) {
                    const oldResponsibility = existingResponsibilities.find(
                        item => item.Id === Number(Id)
                    );

                    if (oldResponsibility.Description !== Description.trim()) {
                        const updateDescRequest = new sql.Request(transaction);

                        await updateDescRequest.query`
                            UPDATE ExpDesc
                            SET Description = ${Description.trim()},
                                UpdatedAt = GETDATE()
                            WHERE Id = ${Number(Id)}
                            AND WorkExperienceId = ${workExperienceId}
                        `;
                    }
                } else {
                    // INSERT NEW RESPONSIBILITY
                    const insertDescRequest = new sql.Request(transaction);

                    await insertDescRequest.query`
                        INSERT INTO ExpDesc (
                            WorkExperienceId,
                            Description
                        )
                        VALUES (
                            ${workExperienceId},
                            ${Description.trim()}
                        )
                    `;
                }
            }

            // DELETE REMOVED RESPONSIBILITIES
            const descIdsToDelete = existingDescIds.filter(
                id => !receivedDescIds.includes(id)
            );

            if (descIdsToDelete.length > 0) {
                const deleteDescRequest = new sql.Request(transaction);

                deleteDescRequest.input(
                    'WorkExperienceId',
                    sql.Int,
                    workExperienceId
                );

                const parameters = descIdsToDelete.map((id, index) => {
                    const parameterName = `DescId${index}`;
                    deleteDescRequest.input(parameterName, sql.Int, id);
                    return `@${parameterName}`;
                });

                await deleteDescRequest.query(`
                    DELETE FROM ExpDesc
                    WHERE WorkExperienceId = @WorkExperienceId
                    AND Id IN (${parameters.join(', ')})
                `);
            }
        }

        // DELETE REMOVED WORK EXPERIENCES
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `WorkExpId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM ExpDesc
                WHERE WorkExperienceId IN (
                    SELECT Id FROM WorkExperiences
                    WHERE ProfileId = @ProfileId
                    AND Id IN (${parameters.join(', ')})
                );

                DELETE FROM WorkExperiences
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')});
            `);
        }

        // GET UPDATED WORK EXPERIENCES
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM WorkExperiences
            WHERE ProfileId = ${profileId}
        `;

        const workExperiencesResponse = responseResult.recordset;

        // GET RESPONSIBILITIES FOR EACH WORK EXPERIENCE
        for (const workExp of workExperiencesResponse) {
            const descRequest = new sql.Request(transaction);

            const descResult = await descRequest.query`
                SELECT * FROM ExpDesc
                WHERE WorkExperienceId = ${workExp.Id}
            `;

            workExp.Responsibilities = descResult.recordset;
        }

        return workExperiencesResponse;
    });
};

const updateMyProjects = async (userId, profileId, projects) => {
    if (!Array.isArray(projects)) {
        const error = new Error('Projects must be an array.');
        error.statusCode = 400;
        throw error;
    }

    // VALIDATE PROJECTS
    for (const project of projects) {
       if (
            !project ||
            typeof project !== 'object' ||
            typeof project.ProjectName !== 'string' ||
            !project.ProjectName.trim() ||
            (
                project.Date &&
                Number.isNaN(new Date(project.Date).getTime())
            ) ||
            (
                project.Link != null &&
                typeof project.Link !== 'string'
            ) ||
            !Array.isArray(project.Descriptions)
        ) {
            const error = new Error(
                'Project name and descriptions are required. Date must be valid if provided.'
            );
            error.statusCode = 400;
            throw error;
        }

        for (const description of project.Descriptions) {
            if (
                !description ||
                typeof description.Description !== 'string' ||
                !description.Description.trim()
            ) {
                const error = new Error('Project description is required.');
                error.statusCode = 400;
                throw error;
            }
        }
    }

    return withTransaction(async (transaction) => {

        // CHECK PROFILE OWNERSHIP
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING PROJECTS
        const existingRequest = new sql.Request(transaction);

        const existingResult = await existingRequest.query`
            SELECT * FROM Projects
            WHERE ProfileId = ${profileId}
        `;

        const existingProjects = existingResult.recordset;

        const existingIds = existingProjects.map(
            project => project.Id
        );

        const receivedIds = projects
            .filter(project => project.Id !== undefined && project.Id !== null)
            .map(project => Number(project.Id));

        // CHECK DUPLICATE PROJECT IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate project IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK PROJECT OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid project ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE PROJECTS
        for (const project of projects) {
            const { Id, ProjectName, Date: projectDate, Link, Descriptions } = project;
            const projectLink = Link?.trim() || null;

            let projectId;

            if (Id !== undefined && Id !== null) {
                projectId = Number(Id);

                const oldProject = existingProjects.find(
                    item => item.Id === projectId
                );

                if (
                    oldProject.ProjectName !== ProjectName.trim() ||
                    (
                        oldProject.Date
                            ? new Date(oldProject.Date).getTime()
                            : null
                    ) !== (
                        projectDate
                            ? new Date(projectDate).getTime()
                            : null
                    ) ||
                    oldProject.Link !== projectLink
                ) {
                    const updateRequest = new sql.Request(transaction);

                    await updateRequest.query`
                        UPDATE Projects
                        SET ProjectName = ${ProjectName.trim()},
                            Date = ${projectDate || null},
                            Link = ${projectLink},
                            UpdatedAt = GETDATE()
                        WHERE Id = ${projectId}
                        AND ProfileId = ${profileId}
                    `;
                }

            } else {
                // INSERT NEW PROJECT
                const insertRequest = new sql.Request(transaction);

                const insertResult = await insertRequest.query`
                    INSERT INTO Projects (
                        ProfileId,
                        ProjectName,
                        Date,
                        Link
                    )
                    OUTPUT INSERTED.Id
                    VALUES (
                        ${profileId},
                        ${ProjectName.trim()},
                        ${projectDate || null},
                        ${projectLink}
                    )
                `;

                projectId = insertResult.recordset[0].Id;
            }

            // GET EXISTING PROJECT DESCRIPTIONS
            const existingDescRequest = new sql.Request(transaction);

            const existingDescResult = await existingDescRequest.query`
                SELECT * FROM ProDesc
                WHERE ProjectId = ${projectId}
            `;

            const existingDescriptions = existingDescResult.recordset;

            const existingDescIds = existingDescriptions.map(
                description => description.Id
            );

            const receivedDescIds = Descriptions
                .filter(item => item.Id !== undefined && item.Id !== null)
                .map(item => Number(item.Id));

            // CHECK DUPLICATE DESCRIPTION IDS
            if (new Set(receivedDescIds).size !== receivedDescIds.length) {
                const error = new Error(
                    'Duplicate project description IDs are not allowed.'
                );
                error.statusCode = 400;
                throw error;
            }

            // CHECK DESCRIPTION OWNERSHIP
            for (const id of receivedDescIds) {
                if (!existingDescIds.includes(id)) {
                    const error = new Error('Invalid project description ID.');
                    error.statusCode = 400;
                    throw error;
                }
            }

            // INSERT OR UPDATE PROJECT DESCRIPTIONS
            for (const description of Descriptions) {
                const { Id, Description } = description;

                if (Id !== undefined && Id !== null) {
                    const oldDescription = existingDescriptions.find(
                        item => item.Id === Number(Id)
                    );

                    if (oldDescription.Description !== Description.trim()) {
                        const updateDescRequest = new sql.Request(transaction);

                        await updateDescRequest.query`
                            UPDATE ProDesc
                            SET Description = ${Description.trim()},
                                UpdatedAt = GETDATE()
                            WHERE Id = ${Number(Id)}
                            AND ProjectId = ${projectId}
                        `;
                    }

                } else {
                    // INSERT NEW PROJECT DESCRIPTION
                    const insertDescRequest = new sql.Request(transaction);

                    await insertDescRequest.query`
                        INSERT INTO ProDesc (
                            ProjectId,
                            Description
                        )
                        VALUES (
                            ${projectId},
                            ${Description.trim()}
                        )
                    `;
                }
            }

            // DELETE REMOVED PROJECT DESCRIPTIONS
            const descIdsToDelete = existingDescIds.filter(
                id => !receivedDescIds.includes(id)
            );

            if (descIdsToDelete.length > 0) {
                const deleteDescRequest = new sql.Request(transaction);

                deleteDescRequest.input('ProjectId', sql.Int, projectId);

                const parameters = descIdsToDelete.map((id, index) => {
                    const parameterName = `DescId${index}`;
                    deleteDescRequest.input(parameterName, sql.Int, id);
                    return `@${parameterName}`;
                });

                await deleteDescRequest.query(`
                    DELETE FROM ProDesc
                    WHERE ProjectId = @ProjectId
                    AND Id IN (${parameters.join(', ')})
                `);
            }
        }

        // DELETE REMOVED PROJECTS
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `ProjectId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM ProDesc
                WHERE ProjectId IN (
                    SELECT Id FROM Projects
                    WHERE ProfileId = @ProfileId
                    AND Id IN (${parameters.join(', ')})
                );

                DELETE FROM Projects
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')});
            `);
        }

        // GET UPDATED PROJECTS
        const responseRequest = new sql.Request(transaction);

        const responseResult = await responseRequest.query`
            SELECT * FROM Projects
            WHERE ProfileId = ${profileId}
        `;

        const projectsResponse = responseResult.recordset;

        // GET DESCRIPTIONS FOR EACH PROJECT
        for (const project of projectsResponse) {
            const descRequest = new sql.Request(transaction);

            const descResult = await descRequest.query`
                SELECT * FROM ProDesc
                WHERE ProjectId = ${project.Id}
            `;
            project.Descriptions = descResult.recordset;
        }

        return projectsResponse;
    });
};

const updateMyDocuments = async (userId, profileId, documents, tableName) => {

    // ALLOWED TABLES
    const allowedTables = ['Certifications', 'Awards'];

    if (!allowedTables.includes(tableName)) {
        const error = new Error('Invalid table name.');
        error.statusCode = 400;
        throw error;
    }

    // VALIDATE DOCUMENTS
    if (!Array.isArray(documents)) {
        const error = new Error('Documents must be an array.');
        error.statusCode = 400;
        throw error;
    }

    for (const document of documents) {
        if (
            !document ||
            typeof document !== 'object' ||
            typeof document.Title !== 'string' ||
            !document.Title.trim() ||
            typeof document.Issuer !== 'string' ||
            !document.Issuer.trim() ||
            (
                document.Date &&
                Number.isNaN(new Date(document.Date).getTime())
            )
        ) {
            const error = new Error(
                'Title and issuer are required. Date must be valid if provided.'
            );
            error.statusCode = 400;
            throw error;
        }
    }

    return withTransaction(async (transaction) => {

        // CHECK PROFILE OWNERSHIP
        await checkProfileOwnership(transaction, userId, profileId);

        // GET EXISTING DOCUMENTS
        const existingRequest = new sql.Request(transaction);

        existingRequest.input('ProfileId', sql.Int, profileId);

        const existingResult = await existingRequest.query(`
            SELECT * FROM [${tableName}]
            WHERE ProfileId = @ProfileId
        `);

        const existingDocuments = existingResult.recordset;

        const existingIds = existingDocuments.map(
            document => document.Id
        );

        const receivedIds = documents
            .filter(document => document.Id !== undefined && document.Id !== null)
            .map(document => Number(document.Id));

        // CHECK DUPLICATE IDS
        if (new Set(receivedIds).size !== receivedIds.length) {
            const error = new Error('Duplicate document IDs are not allowed.');
            error.statusCode = 400;
            throw error;
        }

        // CHECK DOCUMENT OWNERSHIP
        for (const id of receivedIds) {
            if (!existingIds.includes(id)) {
                const error = new Error('Invalid document ID.');
                error.statusCode = 400;
                throw error;
            }
        }

        // INSERT OR UPDATE DOCUMENTS
        for (const document of documents) {
            const {
                Id,
                Title,
                Issuer,
                Date: documentDateValue
            } = document;

            const documentDate = documentDateValue || null;

            if (Id !== undefined && Id !== null) {
                const documentId = Number(Id);

                const oldDocument = existingDocuments.find(
                    item => item.Id === documentId
                );

                const oldDate = oldDocument.Date
                    ? new Date(oldDocument.Date).getTime()
                    : null;

                const newDate = documentDate
                    ? new Date(documentDate).getTime()
                    : null;

                if (
                    oldDocument.Title !== Title.trim() ||
                    oldDocument.Issuer !== Issuer.trim() ||
                    oldDate !== newDate
                ) {
                    // UPDATE EXISTING DOCUMENT
                    const updateRequest = new sql.Request(transaction);

                    updateRequest.input('Title', sql.NVarChar(200), Title.trim());
                    updateRequest.input('Issuer', sql.NVarChar(200), Issuer.trim());
                    updateRequest.input('Date', sql.Date, documentDate);
                    updateRequest.input('Id', sql.Int, documentId);
                    updateRequest.input('ProfileId', sql.Int, profileId);

                    await updateRequest.query(`
                        UPDATE [${tableName}]
                        SET Title = @Title,
                            Issuer = @Issuer,
                            Date = @Date,
                            UpdatedAt = GETDATE()
                        WHERE Id = @Id
                        AND ProfileId = @ProfileId
                    `);
                }

            } else {
                // INSERT NEW DOCUMENT
                const insertRequest = new sql.Request(transaction);

                insertRequest.input('ProfileId', sql.Int, profileId);
                insertRequest.input('Title', sql.NVarChar(200), Title.trim());
                insertRequest.input('Issuer', sql.NVarChar(200), Issuer.trim());
                insertRequest.input('Date', sql.Date, documentDate);

                await insertRequest.query(`
                    INSERT INTO [${tableName}] (
                        ProfileId,
                        Title,
                        Issuer,
                        Date
                    )
                    VALUES (
                        @ProfileId,
                        @Title,
                        @Issuer,
                        @Date
                    )
                `);
            }
        }

        // DELETE REMOVED DOCUMENTS
        const idsToDelete = existingIds.filter(
            id => !receivedIds.includes(id)
        );

        if (idsToDelete.length > 0) {
            const deleteRequest = new sql.Request(transaction);

            deleteRequest.input('ProfileId', sql.Int, profileId);

            const parameters = idsToDelete.map((id, index) => {
                const parameterName = `DocumentId${index}`;
                deleteRequest.input(parameterName, sql.Int, id);
                return `@${parameterName}`;
            });

            await deleteRequest.query(`
                DELETE FROM [${tableName}]
                WHERE ProfileId = @ProfileId
                AND Id IN (${parameters.join(', ')})
            `);
        }

        // GET UPDATED DOCUMENTS
        const responseRequest = new sql.Request(transaction);

        responseRequest.input('ProfileId', sql.Int, profileId);

        const responseResult = await responseRequest.query(`
            SELECT * FROM [${tableName}]
            WHERE ProfileId = @ProfileId
        `);

        return responseResult.recordset;
    });
};

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

const deleteMyProfile = async (userId, profileId) => {
    return withTransaction(async (transaction) => {

        // CHECK PROFILE OWNERSHIP
        await checkProfileOwnership(transaction, userId, profileId);

        // DELETE PROFILE
        await new sql.Request(transaction).query`
            DELETE FROM Profiles
            WHERE Id = ${profileId}
            AND UserId = ${userId}
        `;

        return { message: 'Profile deleted successfully.' };
    });
};

module.exports = { getMyProfiles, getProfileById, getProfileData,
    createProfile, deleteMyProfile,
    updateMyProfile, updateProfilePhoto, updateMyContact, updateMyLanguages, updateMySkills, updateMyReferences, updateMyHobbies,
    updateMyEducations, updateMyWorkExperiences, updateMyProjects, updateMyDocuments };
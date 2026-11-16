import type { CvTemplate } from './CvList';

interface LoadContentProfileOptions {
    cv: any;
    template: CvTemplate;
}

const contactFields = [
    'Email', 'Phone', 'Location', 'LinkedIn', 'GitHub', 'Portfolio', 'X', 'Medium',
    'DevTo', 'Hashnode', 'Dribbble', 'Behance', 'StackOverflow', 'Skype', 'Zoom', 'Discord',
];

const loadContentProfile = ({ cv, template }: LoadContentProfileOptions) => {
    const profile = cv.Profile;
    const cvContacts = cv.CvContacts ?? {};

    const selectedTheme = template.themes.find(theme => theme.id === cv.ColorPaletteId) ?? template.theme;

    console.log(cv.Profile)
    return {
        id: cv.Id,
        name: cv.CvName,

        template: template.key,
        templateId: cv.TemplateId,

        theme: selectedTheme,
        colorPaletteId: cv.ColorPaletteId,

        sizes: template.sizes(template.sizeValue),
        sizeValue: Number(cv.sizeValue),

        heading: template.heading,
        body: template.body,

        limits: template.limits,

        lang: 'en',
        profileId: cv.ProfileId,

        // Personal Information
        personalInformation: {
            firstName: profile.PersonalInformation.FirstName,
            lastName: profile.PersonalInformation.LastName,
            profession: profile.PersonalInformation.Profession,

            photo: {
                value: profile.PhotoUrl,
                visibility: profile.PhotoVisibility ?? false,
            },
        },

        // Summary
        summary: {
            visibility: Boolean(
                profile.Summary.CareerSummaryVisibility ||
                profile.Summary.CareerGoalsVisibility
            ),

            careerSummary: {
                text: profile.Summary.CareerSummary,
                visibility: profile.Summary.CareerSummaryVisibility,
            },

            careerGoals: {
                text: profile.Summary.CareerGoals,
                visibility: profile.Summary.CareerGoalsVisibility,
            },
        },

        // Contact
        contact: {
            visibility: Boolean(cv.Contact),

            content: contactFields.map(field => ({
                field: field.toLowerCase(),
                value: profile.Contact?.[field] ?? '',
                visibility: Boolean(cvContacts[field]),
            })),
        },

        // Educations
        educations: {
            visibility: Boolean(cv.Educations),

            singularTitle: 'education',
            pluralTitle: 'educations',

            content: (profile.Educations ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // Work Experiences
        workExperience: {
            visibility: Boolean(cv.WorkExperiences),

            singularTitle: 'experience',
            pluralTitle: 'experiences',

            content: (profile.WorkExperiences ?? []).map(
                (item: any) => {
                    const { Responsibilities, ...experienceData } = item;

                    return {
                        ...experienceData,
                        visibility: item.Visibility,

                        responsibilities: (Responsibilities ?? []).map(
                            (description: any) => ({
                                Id: description.Id,
                                description: description.Description,
                                visibility: description.Visibility,
                            })
                        ),
                    };
                }
            ),
        },

        // Projects
        projects: {
            visibility: Boolean(cv.Projects),

            singularTitle: 'project',
            pluralTitle: 'projects',

            content: (profile.Projects ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,

                subclause: (item.Descriptions ?? []).map(
                    (description: any) => ({
                        Id: description.Id,
                        text: description.Description,
                        visibility: description.Visibility,
                    })
                ),
            })),
        },

        // Skills
        skills: {
            visibility: Boolean(cv.Skills),

            singularTitle: 'skill',
            pluralTitle: 'skills',

            content: (profile.Skills ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,

                items: (item.Items ?? []).map((skillItem: any) => ({
                    ...skillItem,
                    visibility: skillItem.Visibility,
                })),
            })),
        },

        // Languages
        languages: {
            visibility: Boolean(cv.Languages),

            singularTitle: 'language',
            pluralTitle: 'languages',

            content: (profile.Languages ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // Certifications
        certifications: {
            visibility: Boolean(cv.Certifications),
            singularTitle: 'certification',
            pluralTitle: 'certifications',

            content: (profile.Certifications ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // Awards
        awards: {
            visibility: Boolean(cv.Awards),
            singularTitle: 'award',
            pluralTitle: 'awards',

            content: (profile.Awards ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // Hobbies
        hobbies: {
            visibility: Boolean(cv.Hobbies),

            singularTitle: 'hobby',
            pluralTitle: 'hobbies',

            content: (profile.Hobbies ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // References
        references: {
            visibility: Boolean(cv.References),

            singularTitle: 'reference',
            pluralTitle: 'references',

            content: (profile.References ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },
    };
};

export default loadContentProfile;
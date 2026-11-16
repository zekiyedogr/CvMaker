import type { CvTemplate } from './CvList';

interface CreateContentProfileOptions {
    profile: any;
    template: CvTemplate;
}

const contactFields = [
    'Email', 'Phone', 'Location', 'LinkedIn',
    'GitHub', 'Portfolio', 'X', 'Medium',
    'DevTo', 'Hashnode', 'Dribbble', 'Behance',
    'StackOverflow', 'Skype', 'Zoom', 'Discord',
];

const createContentProfile = ({
    profile,
    template,
}: CreateContentProfileOptions) => {
    const limits = template.limits;

    return {
        id: Date.now(),
        name: `${template.key} — ${profile.Name}`,

        template: template.key,
        templateId: template.templateId,

        theme: template.theme,
        colorPaletteId: template.theme.id,

        sizes: template.sizes(template.sizeValue),
        sizeValue: template.sizeValue,

        heading: template.heading,
        body: template.body,

        limits,

        lang: 'en',
        profileId: profile.Id,

        // Personal Information
        personalInformation: {
            firstName: profile.PersonalInformation.FirstName,
            lastName: profile.PersonalInformation.LastName,
            profession: profile.PersonalInformation.Profession,

            photo: {
                value: profile.PhotoUrl,
                visibility: profile.PhotoVisibility ?? true,
            },
        },

        // Summary
        summary: {
            visibility: Boolean(
                profile.Summary.CareerSummary ||
                profile.Summary.CareerGoals
            ),

            careerSummary: {
                text: profile.Summary.CareerSummary,
                visibility: profile.Summary.CareerSummary !== null,
            },

            careerGoals: {
                text: profile.Summary.CareerGoals,
                visibility: profile.Summary.CareerGoals === null,
            },
        },

        // Contact
        contact: {
            visibility: contactFields.some(
                field => Boolean(profile.Contact?.[field])
            ),

            content: contactFields.map((field, index) => ({
                field: field.toLowerCase(),
                value: profile.Contact?.[field] ?? '',
                visibility: index < limits.contactLimit,
            })),
        },

        // Educations
        educations: {
            visibility:
                (profile.Educations ?? []).length > 0 &&
                limits.educationLimit > 0,

            singularTitle: 'education',
            pluralTitle: 'educations',

            content: (profile.Educations ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.educationLimit,
                })
            ),
        },

        // Work Experiences
        workExperience: {
            visibility:
                (profile.WorkExperiences ?? []).length > 0 &&
                limits.expLimit > 0,

            singularTitle: 'experience',
            pluralTitle: 'experiences',

            content: (profile.WorkExperiences ?? []).map(
                (item: any, index: number) => {
                    const { Responsibilities, ...experienceData } = item;

                    return {
                        ...experienceData,
                        visibility: index < limits.expLimit,

                        responsibilities: (Responsibilities ?? []).map(
                            (description: any, descriptionIndex: number) => ({
                                Id: description.Id,
                                description: description.Description,
                                visibility: descriptionIndex < limits.responLimit,
                            })
                        ),
                    };
                }
            ),
        },

        // Projects
        projects: {
            visibility:
                (profile.Projects ?? []).length > 0 &&
                limits.projectLimit > 0,

            singularTitle: 'project',
            pluralTitle: 'projects',

            content: (profile.Projects ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.projectLimit,

                    subclause: (item.Descriptions ?? []).map(
                        (description: any, descriptionIndex: number) => ({
                            Id: description.Id,
                            text: description.Description,
                            visibility: descriptionIndex < limits.descripLimit,
                        })
                    ),
                })
            ),
        },

        // Skills
        skills: {
            visibility:
                (profile.Skills ?? []).length > 0 &&
                limits.skillTitle > 0,

            singularTitle: 'skill',
            pluralTitle: 'skills',

            content: (profile.Skills ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.skillTitle,

                    items: (item.Items ?? []).map(
                        (skillItem: any, skillIndex: number) => ({
                            ...skillItem,
                            visibility: skillIndex < limits.skillLimit,
                        })
                    ),
                })
            ),
        },

        // Languages
        languages: {
            visibility:
                (profile.Languages ?? []).length > 0 &&
                limits.langLimit > 0,

            singularTitle: 'language',
            pluralTitle: 'languages',

            content: (profile.Languages ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.langLimit,
                })
            ),
        },

        // Certifications
        certifications: {
            visibility:
                (profile.Certifications ?? []).length > 0 &&
                limits.certifLimit > 0,

            singularTitle: 'certification',
            pluralTitle: 'certifications',

            content: (profile.Certifications ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.certifLimit,
                })
            ),
        },

        // Awards
        awards: {
            visibility:
                (profile.Awards ?? []).length > 0 &&
                limits.awardLimit > 0,

            singularTitle: 'award',
            pluralTitle: 'awards',

            content: (profile.Awards ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.awardLimit,
                })
            ),
        },

        // Hobbies
        hobbies: {
            visibility:
                (profile.Hobbies ?? []).length > 0 &&
                limits.hobbyLimit > 0,

            singularTitle: 'hobby',
            pluralTitle: 'hobbies',

            content: (profile.Hobbies ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.hobbyLimit,
                })
            ),
        },

        // References
        references: {
            visibility:
                (profile.References ?? []).length > 0 &&
                limits.referenceLimit > 0,

            singularTitle: 'reference',
            pluralTitle: 'references',

            content: (profile.References ?? []).map(
                (item: any, index: number) => ({
                    ...item,
                    visibility: index < limits.referenceLimit,
                })
            ),
        },
    };
};

export default createContentProfile;

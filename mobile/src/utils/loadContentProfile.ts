
import CvList from '../constants/CvList';

interface LoadContentProfileOptions {
    cv: any;
    template: (typeof CvList)[number];
}

const contactFields = [
    'Email',
    'Phone',
    'Location',
    'LinkedIn',
    'GitHub',
    'Portfolio',
    'X',
    'Medium',
    'DevTo',
    'Hashnode',
    'Dribbble',
    'Behance',
    'StackOverflow',
    'Skype',
    'Zoom',
    'Discord',
];

const loadContentProfile = ({
    cv,
    template,
}: LoadContentProfileOptions) => {
    const profile = cv.Profile;
    const cvContacts = cv.CvContacts ?? {};

    const sizeValue = Number(cv.sizeValue ?? template.sizeValue);

    const selectedTheme =
        template.themes.find(
            (theme: any) => theme.id === cv.ColorPaletteId
        ) ?? template.theme;

    return {
        id: cv.Id,
        name: cv.CvName,

        template: template.key,
        templateId: cv.TemplateId,

        theme: selectedTheme,
        colorPaletteId: cv.ColorPaletteId,

        sizes: template.sizes(sizeValue),
        sizeValue,

        heading: template.heading,
        body: template.body,

        limits: template.limits,

        lang: 'en',
        profileId: cv.ProfileId,

        // PERSONAL INFORMATION
        personalInformation: {
            firstName: profile.PersonalInformation.FirstName,
            lastName: profile.PersonalInformation.LastName,
            profession: profile.PersonalInformation.Profession,

            photo: {
                value: profile.PhotoUrl,
                visibility: profile.PhotoVisibility ?? false,
            },
        },

        // SUMMARY
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

        // CONTACT
        contact: {
            visibility: Boolean(cv.Contact),

            content: contactFields.map(field => ({
                field: field.toLowerCase(),
                value: profile.Contact?.[field] ?? '',
                visibility: Boolean(cvContacts[field]),
            })),
        },

        // EDUCATIONS
        educations: {
            visibility: Boolean(cv.Educations),

            singularTitle: 'education',
            pluralTitle: 'educations',

            content: (profile.Educations ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // WORK EXPERIENCES
        workExperience: {
            visibility: Boolean(cv.WorkExperiences),

            singularTitle: 'experience',
            pluralTitle: 'experiences',

            content: (profile.WorkExperiences ?? []).map((item: any) => {
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
            }),
        },

        // PROJECTS
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

        // SKILLS
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

        // LANGUAGES
        languages: {
            visibility: Boolean(cv.Languages),

            singularTitle: 'language',
            pluralTitle: 'languages',

            content: (profile.Languages ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // CERTIFICATIONS
        certifications: {
            visibility: Boolean(cv.Certifications),

            singularTitle: 'certification',
            pluralTitle: 'certifications',

            content: (profile.Certifications ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // AWARDS
        awards: {
            visibility: Boolean(cv.Awards),

            singularTitle: 'award',
            pluralTitle: 'awards',

            content: (profile.Awards ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // HOBBIES
        hobbies: {
            visibility: Boolean(cv.Hobbies),

            singularTitle: 'hobby',
            pluralTitle: 'hobbies',

            content: (profile.Hobbies ?? []).map((item: any) => ({
                ...item,
                visibility: item.Visibility,
            })),
        },

        // REFERENCES
        references: {
            visibility: Boolean(cv.ReferenceSection),

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

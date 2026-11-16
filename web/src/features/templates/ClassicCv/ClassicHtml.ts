import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { FaPhone, FaLocationDot, FaEnvelope, FaLinkedinIn, FaGithub, FaGlobe, FaXTwitter, FaMedium, FaDev, FaHashnode, FaDribbble,
    FaBehance, FaStackOverflow, FaSkype, FaVideo, FaDiscord } from 'react-icons/fa6';

type AnyRecord = Record<string, any>;

const escapeHtml = (value: unknown): string => {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const formatMonthYear = (date: string | null): string => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '';

    return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

const formatYear = (date: string | null): string => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '';

    return parsedDate.getUTCFullYear().toString();
};

const getSectionTitle = (
    section: AnyRecord,
    visibleCount: number
): string => {
    return escapeHtml(
        visibleCount > 1
            ? section.pluralTitle
            : section.singularTitle
    ).toUpperCase();
};

const contactIcons: Record<string, React.ElementType> = {
    phone: FaPhone,
    location: FaLocationDot,
    email: FaEnvelope,
    linkedin: FaLinkedinIn,
    github: FaGithub,
    portfolio: FaGlobe,
    x: FaXTwitter,
    medium: FaMedium,
    devto: FaDev,
    hashnode: FaHashnode,
    dribbble: FaDribbble,
    behance: FaBehance,
    stackoverflow: FaStackOverflow,
    skype: FaSkype,
    zoom: FaVideo,
    discord: FaDiscord,
};

const urlFields = [
    'linkedin', 'github', 'portfolio', 'x', 'medium',
    'devto', 'hashnode', 'dribbble', 'behance',
    'stackoverflow', 'skype', 'zoom', 'discord',
];

const getContactUrl = (value: string) => {
    return value.startsWith('http')
        ? value
        : `https://${value}`;
};

const formatContactValue = (key: string, value: string) => {
    if (!urlFields.includes(key)) return value;

    try {
        const url = new URL(
            value.startsWith('http') ? value : `https://${value}`
        );

        if (key === 'portfolio') {
            return url.hostname.replace(/^www\./, '');
        }

        return url.pathname.replace(/\/$/, '') || url.hostname;
    } catch {
        return value;
    }
};

const getContactHtml = (contact: AnyRecord): string => {
    if (!contact?.visibility || !contact.content) return '';

    const items = contact.content.filter(
        (item: AnyRecord) =>
            item.visibility &&
            item.value &&
            contactIcons[item.field]
    );

    if (!items.length) return '';

    return `
        <section class="classic-contact">

            <h3 class="cv-title">CONTACT</h3>

            ${items.map((item: AnyRecord) => {
                const Icon = contactIcons[item.field];

                const iconHtml = renderToStaticMarkup(
                    createElement(Icon, {
                        className: 'classic-contact-icon',
                    })
                );

                return `
                    <div class="classic-contact-text classic-contact-item">

                        ${iconHtml}

                        ${urlFields.includes(item.field)
                            ? `
                                <a
                                    href="${escapeHtml(getContactUrl(item.value))}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="cv-content classic-contact-text classic-contact-link"
                                >
                                    ${escapeHtml(formatContactValue(item.field, item.value))}
                                </a>
                            `
                            : `
                                <span class="cv-content classic-contact-text">
                                    ${escapeHtml(item.value)}
                                </span>
                            `
                        }

                    </div>
                `;
            }).join('')}

        </section>
    `;
};

const getEducationHtml = (education: AnyRecord): string => {
    if (!education?.visibility || !education.content) return '';

    const items = education.content.filter(
        (item: AnyRecord) => item.visibility
    );

    if (!items.length) return '';

    return `
        <section class="classic-education">
            <h3 class="cv-title">
                ${getSectionTitle(education, items.length)}
            </h3>

            ${items.map((item: AnyRecord) => `
                <div class="classic-education-item">
                    <div class="classic-education-years cv-small">
                        <span>${formatYear(item.StartDate)}</span>
                        <span>-</span>
                        <span>
                            ${item.IsPresent
                                ? 'PRESENT'
                                : formatYear(item.EndDate)}
                        </span>
                    </div>

                    <h4 class="cv-subtitle">
                        ${escapeHtml(item.SchoolName).toUpperCase()}
                    </h4>

                    <p class="cv-content">
                        ${escapeHtml(item.Department)}
                    </p>

                    ${item.Degree ? `
                        <p class="cv-content">
                            GPA: ${escapeHtml(item.Degree)} / 4.0
                        </p>
                    ` : ''}
                </div>
            `).join('')}
        </section>
    `;
};

const getListItemHtml = (items: AnyRecord): string => {
    if (!items?.visibility || !items.content) return '';

    const type = String(items.pluralTitle).toLowerCase();

    let formattedItems: AnyRecord[] = [];

    if (type === 'hobbies') {
        formattedItems = items.content
            .filter((item: AnyRecord) => item.visibility)
            .map((item: AnyRecord) => ({
                Id: item.Id,
                Name: item.Name,
            }));
    }

    if (type === 'languages') {
        formattedItems = items.content
            .filter((item: AnyRecord) => item.visibility)
            .map((item: AnyRecord) => ({
                Id: item.Id,
                Name: `${item.Name} (${item.Levels})`,
            }));
    }

    if (type === 'skills') {
        items.content.forEach((group: AnyRecord) => {
            if (!group.visibility) return;

            (group.items ?? [])
                .filter((skill: AnyRecord) => skill.visibility)
                .forEach((skill: AnyRecord) => {
                    formattedItems.push(skill);
                });
        });
    }

    if (!formattedItems.length) return '';

    return `
        <section class="classic-list-item">
            <h3 class="cv-title classic-list-title">
                ${getSectionTitle(items, formattedItems.length)}
            </h3>

            <div class="classic-list-content">
                ${formattedItems.map((item: AnyRecord) => `
                    <div class="classic-list-row">
                        <span class="classic-list-bullet">•</span>
                        <span class="cv-content">
                            ${escapeHtml(item.Name)}
                        </span>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
};

const getProjectHtml = (projects: AnyRecord): string => {
    if (!projects?.visibility || !projects.content) return '';

    const items = projects.content.filter(
        (item: AnyRecord) => item.visibility
    );

    if (!items.length) return '';

    return `
        <section class="classic-project">
            <h3 class="cv-title classic-project-title">
                ${getSectionTitle(projects, items.length)}
            </h3>

            <div class="classic-project-inner">
                <div class="classic-project-line"></div>

                <div class="classic-project-content">
                    ${items.map((project: AnyRecord) => `
                        <div class="classic-project-item">

                            <div class="classic-project-heading">
                                <span class="classic-project-bullet"></span>

                                <h4 class="cv-subtitle">
                                    ${escapeHtml(project.ProjectName)}
                                </h4>

                                <div class="classic-project-date cv-small">
                                    ${formatMonthYear(project.Date)}
                                </div>
                            </div>

                            <div class="classic-project-descriptions">
                                ${(project.subclause ?? [])
                                    .filter((item: AnyRecord) => item.visibility)
                                    .map((item: AnyRecord) => `
                                        <div class="classic-project-description">
                                            <span class="classic-project-description-bullet">•</span>
                                            <span class="cv-content">
                                                ${escapeHtml(item.text)}
                                            </span>
                                        </div>
                                    `).join('')}
                            </div>

                            ${project.Link ? `
                                <a
                                    href="${escapeHtml(
                                        project.Link.startsWith('http')
                                            ? project.Link
                                            : `https://${project.Link}`
                                    )}"
                                    class="classic-project-link cv-content"
                                >
                                    Link
                                </a>
                            ` : ''}

                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

const getSummaryHtml = (summary: AnyRecord): string => {
    if (!summary?.visibility) return '';

    const careerSummary =
        summary.careerSummary?.visibility &&
        summary.careerSummary?.text;

    const careerGoals =
        summary.careerGoals?.visibility &&
        summary.careerGoals?.text;

    if (!careerSummary && !careerGoals) return '';

    return `
        <section class="classic-profile">

            ${careerSummary ? `
                <div class="classic-profile-section">
                    <h3 class="cv-title">CAREER SUMMARY</h3>
                    <p class="cv-content">
                        ${escapeHtml(summary.careerSummary.text)}
                    </p>
                </div>
            ` : ''}

            ${careerGoals ? `
                <div class="classic-profile-section">
                    <h3 class="cv-title">MY GOALS</h3>
                    <p class="cv-content">
                        ${escapeHtml(summary.careerGoals.text)}
                    </p>
                </div>
            ` : ''}

        </section>
    `;
};

const getExperienceHtml = (experience: AnyRecord): string => {
    if (!experience?.visibility || !experience.content) return '';

    const items = experience.content.filter(
        (item: AnyRecord) => item.visibility
    );

    if (!items.length) return '';

    return `
        <section class="classic-experience">
            <h3 class="cv-title classic-experience-title">
                ${getSectionTitle(experience, items.length)}
            </h3>

            <div class="classic-experience-inner">
                <div class="classic-experience-line"></div>

                <div class="classic-experience-content">
                    ${items.map((item: AnyRecord) => `
                        <div class="classic-experience-item">

                            <div class="classic-experience-heading">
                                <span class="classic-experience-bullet"></span>

                                <h4 class="cv-subtitle">
                                    ${escapeHtml(item.CompanyName)}
                                </h4>

                                <span class="classic-experience-date cv-content">
                                    ${formatMonthYear(item.StartDate)}
                                    —
                                    ${item.IsPresent
                                        ? 'PRESENT'
                                        : formatMonthYear(item.EndDate)}
                                </span>
                            </div>

                            <p class="classic-experience-position cv-content">
                                ${escapeHtml(item.Position)}
                            </p>

                            <div class="classic-experience-descriptions">
                                ${(item.subclause ?? [])
                                    .filter((description: AnyRecord) => description.visibility)
                                    .map((description: AnyRecord) => `
                                        <div class="classic-experience-description">
                                            <span class="classic-experience-description-bullet">•</span>
                                            <span class="cv-content">
                                                ${escapeHtml(description.text)}
                                            </span>
                                        </div>
                                    `).join('')}
                            </div>

                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

const getAchievementHtml = (items: AnyRecord): string => {
    if (!items?.visibility || !items.content) return '';

    const visibleItems = items.content.filter(
        (item: AnyRecord) => item.visibility
    );

    if (!visibleItems.length) return '';

    return `
        <section class="classic-achievement">
            <h3 class="cv-title classic-achievement-title">
                ${getSectionTitle(items, visibleItems.length)}
            </h3>

            <div class="classic-achievement-content">
                ${visibleItems.map((item: AnyRecord) => `
                    <div class="classic-achievement-item">
                        <h4 class="classic-achievement-name cv-subtitle">
                            ${escapeHtml(item.Title)}
                        </h4>

                        <div class="classic-achievement-footer">
                            <span class="classic-achievement-issuer cv-content">
                                ${escapeHtml(item.Issuer)}
                            </span>

                            <span class="classic-achievement-date cv-small">
                                ${formatMonthYear(item.Date)}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
};

const getReferenceHtml = (references: AnyRecord): string => {
    if (!references?.visibility || !references.content) return '';

    const items = references.content.filter(
        (item: AnyRecord) => item.visibility
    );

    if (!items.length) return '';

    return `
        <section class="classic-reference">
            <h3 class="cv-title classic-reference-title">
                ${getSectionTitle(references, items.length)}
            </h3>

            <div class="classic-reference-content">
                ${items.map((item: AnyRecord) => `
                    <div class="classic-reference-item">
                        <h4 class="classic-reference-name cv-subtitle">
                            ${escapeHtml(item.Name)}
                        </h4>

                        <p class="classic-reference-position cv-content">
                            ${escapeHtml(item.Position)}
                        </p>

                        <div class="classic-reference-contact">
                            <span class="cv-small">Contact:</span>
                            <span class="cv-small">
                                ${escapeHtml(item.Contact)}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
};

const wrapContentArea = (content: string): string => {
    if (!content) return '';

    return `
        <div class="classic-content-area">
            ${content}
        </div>
    `;
};

export function getClassicHtml(profile: AnyRecord): string {
    const {
        personalInformation,
        summary,
        contact,
        educations,
        workExperience,
        projects,
        skills,
        languages,
        certifications,
        awards,
        hobbies,
        references,
        theme,
        sizes,
        heading,
        body,
    } = profile;

    const photo = personalInformation?.photo;
    const serverUrl = (import.meta.env.VITE_API_URL ?? '')
        .replace(/\/api$/, '');

    const imageUrl = photo?.value
        ? `${serverUrl}${photo.value}`
        : '';

    const styles = {
        '--cv-left-bg': theme.mainColor,
        '--cv-right-bg': theme.white,
        '--cv-left-color': theme.white,
        '--cv-right-color': theme.secondColor,
        '--cv-left-title-color': theme.white,
        '--cv-right-title-color': theme.mainColor,
        '--cv-title-size': `${sizes.fontChapterTitles}px`,
        '--cv-subtitle-size': `${sizes.fontTitles}px`,
        '--cv-content-size': `${sizes.fontText}px`,
        '--cv-small-size': `${sizes.fontTextSmall}px`,
        '--cv-heading-font': heading.html,
        '--cv-body-font': body.html,
        '--cv-padding': `${sizes.leftPadding}px`,
        '--cv-gap': `${sizes.step}px`,
        '--cv-title-border-width': `${sizes.sizeValue}px`,
        '--cv-photo-border-width': '3px',
        '--cv-name-size': `${sizes.fontNameSize}px`,
        '--cv-profession-size': `${sizes.fontProfSize}px`,
        '--cv-name-line-width': `${sizes.lineWidth}px`,
        '--cv-name-line-height': `${sizes.lineHeight}px`,
    };

    const cssVariables = Object.entries(styles)
        .map(([key, value]) => `${key}:${escapeHtml(value)}`)
        .join(';');

    return `
        <div class="classic-cv" style="${cssVariables}">

            <div class="classic-left cv-left">

                ${imageUrl && photo?.visibility ? `
                    <div class="classic-photo-container">
                        <img
                            src="${escapeHtml(imageUrl)}"
                            class="classic-profile-photo"
                            alt="Profile"
                        />
                    </div>
                ` : ''}

                ${wrapContentArea(getContactHtml(contact))}
                ${wrapContentArea(getEducationHtml(educations))}
                ${wrapContentArea(getListItemHtml(skills))}
                ${wrapContentArea(getListItemHtml(languages))}
                ${wrapContentArea(getListItemHtml(hobbies))}
                ${wrapContentArea(getProjectHtml(projects))}

            </div>

            <div class="classic-right cv-right">

                <div class="classic-name-container">
                    <div class="classic-name">
                        <span class="classic-first-name">
                            ${escapeHtml(personalInformation.firstName).toUpperCase()}
                        </span>

                        <span class="classic-last-name">
                            ${escapeHtml(personalInformation.lastName).toUpperCase()}
                        </span>
                    </div>

                    ${personalInformation.profession ? `
                        <div class="classic-profession">
                            ${escapeHtml(personalInformation.profession).toUpperCase()}
                        </div>
                    ` : ''}

                    <div class="classic-name-line"></div>
                </div>

                ${wrapContentArea(getSummaryHtml(summary))}
                ${wrapContentArea(getExperienceHtml(workExperience))}
                ${wrapContentArea(getAchievementHtml(certifications))}
                ${wrapContentArea(getAchievementHtml(awards))}
                ${wrapContentArea(getReferenceHtml(references))}

            </div>

        </div>
    `;
}

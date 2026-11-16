import './Experience.css';

interface ExperienceItem {
    Id: number;
    CompanyName: string;
    Position: string;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
    visibility: boolean;
    responsibilities: {
        Id: number;
        description: string;
        visibility: boolean;
    }[];
}

interface ExperienceProps {
    experience: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ExperienceItem[];
    };
}

const formatMonthYear = (date: string | null) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const Experience = ({ experience }: ExperienceProps) => {
    if (!experience?.visibility || !experience.content) return null;

    const visibleExperiences = experience.content.filter(
        item => item.visibility
    );

    if (visibleExperiences.length === 0) return null;

    const title = visibleExperiences.length > 1
        ? experience.pluralTitle
        : experience.singularTitle;
        
    return (
        <div className="classic-experience classic-content-area">
            <h3 className="cv-title classic-experience-title">
                {title.toUpperCase()}
            </h3>

            <div className="classic-experience-inner">

                <div className="classic-experience-line" />

                <div className="classic-experience-content">

                    {visibleExperiences.map(exp => (
                        <div
                            className="classic-experience-item"
                            key={exp.Id}
                        >

                            <div className="classic-experience-heading">

                                <span className="classic-experience-bullet" />

                                <h4 className="cv-subtitle">
                                    {exp.CompanyName}
                                </h4>

                                <span className="classic-experience-date cv-content">
                                    {formatMonthYear(exp.StartDate)} — {
                                        exp.IsPresent
                                            ? 'PRESENT'
                                            : formatMonthYear(exp.EndDate)
                                    }
                                </span>

                            </div>

                            <p className="classic-experience-position cv-content">
                                {exp.Position}
                            </p>

                            <div className="classic-experience-descriptions">

                                {(exp.responsibilities ?? [])
                                    .filter(respon => respon.visibility)
                                    .map(respon => (
                                        <div
                                            className="classic-experience-description"
                                            key={respon.Id}
                                        >
                                            <span className="classic-experience-description-bullet">
                                                •
                                            </span>

                                            <span className="cv-content">
                                                {respon.description}
                                            </span>
                                        </div>
                                    ))}

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Experience;

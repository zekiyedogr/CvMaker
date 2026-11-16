import './Education.css';

interface EducationItem {
    Id: number;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
    SchoolName: string;
    Department: string;
    Degree: string | null;
    visibility: boolean;
}

interface EducationProps {
    education: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: EducationItem[];
    };
}

const Education = ({ education }: EducationProps) => {
    if (!education?.visibility || !education.content) return null;

    const visibleEducations = education.content.filter(
        item => item.visibility
    );

    if (visibleEducations.length === 0) return null;

    const title = visibleEducations.length > 1
        ? education.pluralTitle
        : education.singularTitle;
    
    const formatYear = (date: string | null, present = false) => {
        if (present) return 'PRESENT';
        if (!date) return '';

        return new Date(date).getFullYear().toString();
    };
    
    return (
        <div className="classic-education classic-content-area">
            <h3 className="classic-education-title cv-title">
                {title.toUpperCase()}
            </h3>

            {visibleEducations.map((edu) => (
                <div className="classic-education-item" key={edu.Id}>

                    <div className="classic-education-years cv-small">
                        <span>
                            {formatYear(edu.StartDate)}
                        </span>

                        <span> - </span>

                        <span>
                            {edu.IsPresent
                                ? 'PRESENT'
                                : formatYear(edu.EndDate)}
                        </span>
                    </div>

                    <h4 className="cv-subtitle">
                        {edu.SchoolName?.toUpperCase()}
                    </h4>

                    <p className="cv-content">
                        {edu.Department}
                    </p>

                    {edu.Degree && (
                        <p className="cv-content">
                            GPA: {edu.Degree} / 4.0
                        </p>
                    )}

                </div>
            ))}

        </div>
    );
};

export default Education;

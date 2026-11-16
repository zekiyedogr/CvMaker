import './Project.css';

interface ProjectItem {
    Id: number;
    ProjectName: string;
    Date: string;
    Link: string | null;
    visibility: boolean;
    subclause?: {
        text: string;
        visibility: boolean;
    }[];
}

interface ProjectProps {
    projects: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ProjectItem[];
    };
}

const formatMonthYear = (date: string | null) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const Project = ({ projects }: ProjectProps) => {
    if (!projects?.visibility || !projects.content) return null;

    const visibleProjects = projects.content.filter(
        project => project.visibility
    );

    if (visibleProjects.length === 0) return null;

    const title = visibleProjects.length > 1
        ? projects.pluralTitle
        : projects.singularTitle;

    return (
        <div className="classic-project classic-content-area">
            <h3 className="cv-title classic-project-title">
                {title.toUpperCase()}
            </h3>

            <div className="classic-project-inner">
                <div className="classic-project-line" />

                <div className="classic-project-content">
                    {visibleProjects.map(project => (
                        <div className="classic-project-item" key={project.Id}>

                            <div className="classic-project-heading">
                                <span className="classic-project-bullet" />

                                <h4 className="cv-subtitle">
                                    {project.ProjectName}
                                </h4>

                                <div className="classic-project-date cv-small">
                                    {formatMonthYear(project.Date)}
                                </div>
                            </div>

                            <div className="classic-project-descriptions">
                                {(project.subclause ?? [])
                                    .filter(description => description.visibility)
                                    .map((description, index) => (
                                        <div
                                            className="classic-project-description"
                                            key={index}
                                        >
                                            <span className="classic-project-description-bullet">
                                                •
                                            </span>

                                            <span className="cv-content">
                                                {description.text}
                                            </span>
                                        </div>
                                    ))}
                            </div>

                            {project.Link && (
                                <a
                                    href={project.Link.startsWith('http')
                                        ? project.Link
                                        : `https://${project.Link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="classic-project-link cv-content"
                                >
                                    Link
                                </a>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;

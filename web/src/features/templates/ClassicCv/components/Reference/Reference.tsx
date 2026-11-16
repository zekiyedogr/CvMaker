import './Reference.css';

interface ReferenceItem {
    Id: number;
    Name: string;
    Position: string;
    Contact: string;
    visibility: boolean;
}

interface ReferenceProps {
    references: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ReferenceItem[];
    };
}

const Reference = ({ references }: ReferenceProps) => {
    if (!references?.visibility || !references.content) return null;

    const visibleReferences = references.content.filter(ref => ref.visibility);

    if (visibleReferences.length === 0) return null;

    const title = visibleReferences.length > 1
        ? references.pluralTitle
        : references.singularTitle;

    return (
        <div className="classic-reference classic-content-area">
            <h3 className="cv-title classic-reference-title">
                {title.toUpperCase()}
            </h3>

            <div className="classic-reference-content">
                {visibleReferences.map(ref => (
                    <div className="classic-reference-item" key={ref.Id}>

                        <h4 className="classic-reference-name cv-subtitle">
                            {ref.Name}
                        </h4>

                        <p className="classic-reference-position cv-content">
                            {ref.Position}
                        </p>

                        <div className="classic-reference-contact">
                            <span className="classic-reference-contact-title cv-small">
                                Contact:
                            </span>

                            <span className="classic-reference-contact-info cv-small">
                                {ref.Contact}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default Reference;
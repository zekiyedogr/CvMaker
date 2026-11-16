import './Achievement.css';

interface AchievementItem {
    Id: number;
    Title: string;
    Issuer: string;
    Date: string;
    visibility: boolean;
}

interface AchievementProps {
    items: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: AchievementItem[];
    };
}

const formatMonthYear = (date: string | null) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const Achievement = ({ items }: AchievementProps) => {
    if (!items?.visibility || !items.content) return null;

    const visibleItems = items.content.filter(item => item.visibility);

    if (visibleItems.length === 0) return null;

    const title = visibleItems.length > 1
        ? items.pluralTitle
        : items.singularTitle;

    return (
        <div className="classic-achievement classic-content-area">
            <h3 className="cv-title classic-achievement-title">
                {title.toUpperCase()}
            </h3>

            <div className="classic-achievement-content">
                {visibleItems.map(item => (
                    <div className="classic-achievement-item" key={item.Id}>

                        <h4 className="classic-achievement-name cv-subtitle">
                            {item.Title}
                        </h4>

                        <div className="classic-achievement-footer">
                            <span className="classic-achievement-issuer cv-content">
                                {item.Issuer}
                            </span>

                            <span className="classic-achievement-date cv-small">
                                {formatMonthYear(item.Date)}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default Achievement;
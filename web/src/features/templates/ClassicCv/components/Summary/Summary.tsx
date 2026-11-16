import './Summary.css';

interface ProfileProps {
    summary: {
        visibility: boolean;
        careerSummary: {
            text: string | null;
            visibility: boolean;
        };
        careerGoals: {
            text: string | null;
            visibility: boolean;
        };
    };
}

const Summary = ({ summary }: ProfileProps) => {
    if (!summary?.visibility) return null;

    const showSummary =
        summary.careerSummary.visibility &&
        Boolean(summary.careerSummary.text);

    const showGoals =
        summary.careerGoals.visibility &&
        Boolean(summary.careerGoals.text);

    if (!showSummary && !showGoals) return null;

    return (
        <div className="classic-profile classic-content-area">
            {showSummary && (
                <div className="classic-profile-section">
                    <h3 className="cv-title">
                        CAREER SUMMARY
                    </h3>

                    <p className="cv-content">
                        {summary.careerSummary.text}
                    </p>
                </div>
            )}

            {showGoals && (
                <div className="classic-profile-section">
                    <h3 className="cv-title">
                        MY GOALS
                    </h3>

                    <p className="cv-content">
                        {summary.careerGoals.text}
                    </p>
                </div>
            )}

        </div>
    );
};

export default Summary;

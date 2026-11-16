import './CvCard.css';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../DeleteButton/DeleteButton';

const serverUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

interface CvCardProps {
    id: number;
    cvName: string;
    firstName: string;
    lastName: string;
    thumbnailUrl: string | null;
    onDelete: (id: number) => void;
}

const CvCard = ({
    id,
    cvName,
    firstName,
    lastName,
    thumbnailUrl,
    onDelete
}: CvCardProps) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cvs/${id}`);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div className="cv-card" onClick={handleClick}>
            <div className="cv-card-image">
                {thumbnailUrl ? (
                    <img
                        src={`${serverUrl}${thumbnailUrl}`}
                        alt={`${cvName} thumbnail`}
                    />
                ) : (
                    <div className="cv-card-placeholder">
                        {firstName.charAt(0)}
                        {lastName.charAt(0)}
                    </div>
                )}
            </div>

            <div className="cv-card-content">
                <h3>{cvName}</h3>
                <p>{firstName} {lastName}</p>
            </div>

            <div
                className="cv-card-actions"
                onClick={(event) => event.stopPropagation()}
            >
                <DeleteButton
                    label="Delete"
                    onClick={handleDelete}
                />
            </div>
        </div>
    );
};

export default CvCard;
import './ProfileCard.css';
import { useNavigate } from 'react-router-dom';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

const serverUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

interface ProfileCardProps {
    id: number;
    photoUrl: string | null;
    firstName: string;
    lastName: string;
    profession: string | null;
    onDelete: (id: number) => void;
}

const ProfileCard = ({
    id,
    photoUrl,
    firstName,
    lastName,
    profession,
    onDelete
}: ProfileCardProps) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profiles/${id}`);
    };

    const handleCopy = () => {
        navigate(`/profiles/add-profile?copyFrom=${id}`);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    const goToCreateCv = () => {
        navigate(`/cvs/create/${id}`);
    }

    return (
        <div className="profile-card" onClick={handleClick}>
            <div className="profile-card-inf">
                <div className="profile-card-image">
                    {photoUrl ? (
                        <img
                            src={`${serverUrl}${photoUrl}`}
                            alt={`${firstName} ${lastName}`}
                        />
                    ) : (
                        <div className="profile-placeholder">
                            {firstName.charAt(0)}{lastName.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="profile-card-info">
                    <h3>{firstName} {lastName}</h3>
                    <p>{profession || 'Profession not specified'}</p>

                    
                </div>

            </div>
           
            <div className="buttons" onClick={(event) => event.stopPropagation()}>
                <AddButton
                    label="Copy"
                    onClick={handleCopy}
                />

                <DeleteButton
                    label="Delete"
                    onClick={handleDelete}
                />
            </div>

            <div className="buttons" onClick={(event) => event.stopPropagation()}>
                <AddButton label="Create Cv" onClick={goToCreateCv}/>
            </div>
            
        </div>
    );
};

export default ProfileCard;
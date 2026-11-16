import './Home.css';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar/Sidebar';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-page">

            <Sidebar />

            <main className="home-content">
                <div className="home-header">
                    <h1>My Dashboard</h1>
                    <p>Welcome to CvMaker!</p>
                </div>

                <div className="user-info-card">
                    <div className="user-avatar">
                        <span>
                            {user?.FirstName?.charAt(0)}
                            {user?.LastName?.charAt(0)}
                        </span>
                    </div>

                    <div className="user-details">
                        <h2>
                            {user?.FirstName} {user?.LastName}
                        </h2>

                        <p>{user?.Email}</p>

                        <span>CvMaker Member</span>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Home;
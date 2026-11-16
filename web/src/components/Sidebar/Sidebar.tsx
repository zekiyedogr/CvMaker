import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logo from '../../assets/images/CvMaker-Logo.png';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="home-sidebar">
            <img
                src={logo}
                alt="CvMaker Logo"
                className="sidebar-logo"
            />

            <nav className="sidebar-menu">
                <NavLink to="/home">Dashboard</NavLink>
                <NavLink to="/profiles">Profiles</NavLink>
                <NavLink to="/cvs">My CVs</NavLink>
                <NavLink to="/settings">Settings</NavLink>
            </nav>

            <button
                onClick={handleLogout}
                className="logout-button"
            >
                Logout
            </button>
        </aside>
    );
};

export default Sidebar;
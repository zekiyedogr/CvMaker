import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth } from '../context/AuthContext';

import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';

import Profiles from '../pages/Profile/Profiles/Profiles';
import MyProfile from '../pages/Profile/MyProfile/MyProfile';
import AddProfile from '../pages/Profile/AddProfile/AddProfile';

import Cvs from '../pages/Cv/Cvs/Cvs';
import EditCv from '../pages/Cv/EditCv/EditCv';
import CreateCv from '../pages/Cv/CreateCv/CreateCv';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Only unauthenticated users
const GuestRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

const Router = () => {
    const { isAuthenticated } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Navigate to={isAuthenticated ? "/home" : "/login"} replace
                    /> 
                } />

                <Route path="/login" element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                } />

                <Route path="/register" element={
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                } />

                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                <Route path="/profiles" element={
                    <ProtectedRoute>
                        <Profiles />
                    </ProtectedRoute>
                } />

                <Route path="/profiles/:id" element={
                    <ProtectedRoute>
                        <MyProfile />
                    </ProtectedRoute>
                } />

                <Route path="/profiles/add-profile" element={
                    <ProtectedRoute>
                        <AddProfile />
                    </ProtectedRoute>
                } />

                <Route path="/cvs" element={
                    <ProtectedRoute>
                        <Cvs />
                    </ProtectedRoute>
                } />

                <Route path="/cvs/:id" element={
                    <ProtectedRoute>
                        <EditCv />
                    </ProtectedRoute>
                } />

                <Route path="/cvs/create/:profileId" element={
                    <ProtectedRoute>
                        <CreateCv />
                    </ProtectedRoute>
                } />

                <Route path="*" element={
                    <Navigate
                        to={isAuthenticated ? "/home" : "/login"}
                        replace
                    />
                } />

            </Routes>
        </BrowserRouter>
    );
}

export default Router;
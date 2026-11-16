import { useState, type SyntheticEvent } from 'react';

import './Login.css';
import logo from '../../assets/images/CvMaker-Logo.png'

import BaseButton from '../../components/BaseButton/BaseButton'
import Input from '../../components/Input/Input'

import api from '../../services/api';
import {useAuth} from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', { email, password });

            const { data: user, token } = response.data;

            login(user, token);

            navigate('/home');

            console.log('Login successful!', user);

        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-page">
            <div className='login-panel'>
                <img src={logo} alt="CvMaker Logo" className='logo-img' />
                <div className='login-content'>
                    <p className='login-p'>Sign in with email</p>
                    <p className='explanation-p'>Create a professional CV that tells your story and highlights your strengths. Build your future with CvMaker.</p>
                
                    <form id="form-login" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <BaseButton type='submit' title='Get Started'/>
                    </form>
                    <p className='footer-p'>Don't you have an account? <a id='register-href' href="/register">Sign Up</a></p>
                </div>
            </div>            
        </div>
    );
}

export default Login;
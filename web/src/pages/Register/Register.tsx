import { useState, type SyntheticEvent } from 'react';

import './Register.css';
import logo from '../../assets/images/CvMaker-Logo.png'

import BaseButton from '../../components/BaseButton/BaseButton'
import Input from '../../components/Input/Input'

import api from '../../services/api';
import {useAuth} from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister  = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/register', { firstName, lastName, email, password });

            const { data: user, token } = response.data;

            register(user, token);

            navigate('/home');

            console.log('Register successful!', user);

        } catch (error) {
            console.error('Register error:', error);
        }
    };

    return (
        <div className="login-page">
            <div className='login-panel'>
                <img src={logo} alt="CvMaker Logo" className='logo-img' />
                <div className='login-content'>
                    <p className='login-p'>Create your account</p>
                    <p className="explanation-p">
                        Start building your professional CV.
                        Create an account and take the next step
                        toward your future with CvMaker.
                    </p>
                    <form id="form-login" onSubmit={handleRegister} autoComplete="off">
                        <Input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="off"
                        />
                        <Input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="off"
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                        />
                        <BaseButton type='submit' title='Create Account'/>
                    </form>
                    <p className="footer-p">
                        Already have an account?{' '}
                        <Link id="login-href" to="/login">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>            
        </div>
    );
}

export default Register;
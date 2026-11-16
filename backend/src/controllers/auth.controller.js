const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Required field validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid email address.'
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long.'
            });
        }

        const result = await authService.registerUser({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password
        });

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully.',
            data: result.user,
            token: result.token
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.statusCode
                ? error.message
                : 'Internal server error.'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email or password are required.'
            })
        }

        const result = await authService.loginUser( email.trim().toLowerCase(), password );

        return res.status(200).json({
            status: 'success',
            message: 'Login successful.',
            data: result.user,
            token: result.token
        })
    }

    catch (error) {
        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.statusCode ? error.message : 'Internal server error.'
        });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};

module.exports = { register, login, getCurrentUser };
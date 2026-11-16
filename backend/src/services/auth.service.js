const { generateToken } = require('../utils/token');
const { sql } = require('../config/database');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    // Email check
    const existingUser = await sql.query`
        SELECT Id
        FROM Users
        WHERE Email = ${email}
    `;

    if (existingUser.recordset.length > 0) {
        const error = new Error('This email address is already registered.');
        error.statusCode = 409;
        throw error;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Add user to database
    const result = await sql.query`
        INSERT INTO Users (
            FirstName,
            LastName,
            Email,
            PasswordHash
        )
        OUTPUT
            INSERTED.Id,
            INSERTED.FirstName,
            INSERTED.LastName,
            INSERTED.Email,
            INSERTED.CreatedAt
        VALUES (
            ${firstName},
            ${lastName},
            ${email},
            ${passwordHash}
        )
    `;

    const token = generateToken(result.recordset[0].Id);

    return {
        user: result.recordset[0],
        token
    };
};

const loginUser = async (email, password) => {
    console.log(email);
    const userResult = await sql.query`
        SELECT
            Id,
            FirstName,
            LastName,
            Email,
            PasswordHash,
            IsActive
        FROM Users
        WHERE Email = ${email}
    `;

    if (userResult.recordset.length === 0) {
        const error = new Error('Invalid email.');
        error.statusCode = 401;
        throw error;
    }

    const user = userResult.recordset[0];
    const isPasswordValid = await bcrypt.compare( password, user.PasswordHash );

    if(!isPasswordValid) {
        const error = new Error('Invalid password.');
        error.statusCode = 401;
        throw error;
    }

    if (!user.IsActive) {
        const error = new Error('Your account is inactive.');
        error.statusCode = 403;
        throw error;
    }

    const token = generateToken(user.Id);

    return {
        user: {
            Id: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email
        }, token
    };

};

const getUserById = async (userId) => {
    const result = await sql.query` SELECT Id, FirstName, LastName, Email FROM Users WHERE Id = ${userId}`;

    return result.recordset[0] || null;
};

module.exports = { registerUser, loginUser, getUserById };

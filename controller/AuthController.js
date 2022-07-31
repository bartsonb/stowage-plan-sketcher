const User = require('../models/User');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * @name    Show
 * @route   GET /api/auth
 * @returns the currently authenticated user
 */
exports.show = (req, res) => {
    User.findById(req.user.id, '-password -createdAt -updatedAt -__v', (err, user) => {
        if (err) return res.status(404).json({ details: [{ message: 'User not found' }]});

        return res.send(user);
    });
};

/**
 * @name    Login
 * @route   POST /api/auth
 * @returns the currently authenticated user
 */
exports.login = (req, res) => {
    let { value: { email, password }, error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    // Check if user with given email exists.
    User.findOne({ email }, (err, user) => {
        if (!user) return res.status(400).json({ details: [{ message: 'Credentials are invalid' }]});

        // Compare hashed password values
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(400).json({ details: [{ message: 'Credentials are invalid' }]});

            jwt.sign(
                { user: { id: user.id }},
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) return res.status(500).json({ details: [{ message: err }]});

                    return res.send({ token });
                });
        })
    });
};
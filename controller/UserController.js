const User = require('../models/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @name    Store
 * @route   POST /api/users
 * @returns User after storing the new user
 */
exports.store = (req, res) => {
    let { value: { name, email, password }, error } = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    // Check if user with given email address already exists.
    User.findOne({ email }, (err, user) => {
        if (user) return res.status(400).json({ details: [{ message: 'User with this email already exists' }]});

        // Hash user password
        bcrypt.hash(password, 10, (err, password) => {
            User.create({ name, email, password }, (err, user) => {
                if (error) return res.status(500).json({ details: [{ message: 'User creation failed unexpectedly' }]});

                jwt.sign(
                    { user: { id: user.id }},
                    process.env.JWT_SECRET,
                    { expiresIn: 86400 },
                    (err, token) => {
                        if (error) throw err;

                        return res.send({ token });
                });
            });
        });
    });
};
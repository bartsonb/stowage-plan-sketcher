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
    let { value, error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    let { email, password } = value;

    return res.json({ email, password });

    User.findOne({ email }, (err, user) => {
        if (user) return res.status(400).json({ details: [{ message: 'User with this email already exists' }]});

        bcrypt.hash(password, 10, function(err, password) {
            User.create({ email, password }, (err, user) => {
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
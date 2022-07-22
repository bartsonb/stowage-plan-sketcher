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
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    let { name, email, password } = value;

    User.findOne({ email }, (err, user) => {
        if (user) return res.status(400).json({'message': `User with Email '${email}' already exists.`});

        bcrypt.hash(password, 10, function(err, password) {
            User.create({ name, email, password }, (err, user) => {
                if (error) return res.status(500).json({ 'message': 'User creation failed.' });

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
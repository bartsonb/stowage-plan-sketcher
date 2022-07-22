const Sketch = require('../models/Sketch');
const Joi = require('@hapi/joi');

/**
 * @name    Get
 * @route   GET /api/sketches
 * @returns returns the sketch with given ID
 */
exports.get = (req, res) => {

};

/**
 * @name    Store
 * @route   POST /api/sketches
 * @returns returns the sketch that was stored
 */
exports.store = (req, res) => {
    let { value, error } = Joi.object({
        name: Joi.string().required(),
        decks: Joi.string().required(),
        cargo: Joi.string().required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    let { name, decks, cargo } = value;

    res.json({ message: name })
};
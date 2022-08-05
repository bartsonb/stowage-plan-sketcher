const Sketch = require('../models/Sketch');
const Joi = require('@hapi/joi');

/**
 * @name    getAll
 * @route   GET /api/sketches/
 * @returns returns all sketches from user
 */
exports.getAll = (req, res) => {
    Sketch.find({ userId: req.user.id }, (error, sketches) => {
        if (error) return res.status(400).json({ error });

        return res.json({ sketches });
    });
};

/**
 * @name    getOne
 * @route   GET /api/sketches/:id
 * @returns returns the sketch with given ID
 */
exports.getOne = (req, res) => {
    Sketch.find({ uuid: req.params.id, userId: req.user.id }, (error, sketches) => {
        if (error) return res.status(400).json({ error });

        return res.json({ sketches });
    });
};

/**
 * @name    store
 * @route   POST /api/sketches
 * @returns returns the sketch that was stored
 */
exports.store = (req, res) => {
    let { value, error } = Joi.object({
        uuid: Joi.string().guid(),
        userId: Joi.string(),
        shipName: Joi.string().required(),
        shipDestination: Joi.string().required(),
        decks: Joi.array().required(),
        cargo: Joi.array().required()
    }).validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) return res.status(400).json(error);

    // Get sketch and update, if sketch exists.
    Sketch.findOneAndUpdate({ uuid: value.uuid }, value, { new: true }, (error, sketch) => {
        if (error) return res.status(400).json({ message: error });
        if (sketch) return res.json({ sketch });

        // Create sketch if it doesn't exist.
        if (!sketch) {
            Sketch.create(value, (error, sketch) => {
                if (error) return res.status(500).json({ message: error });

                return res.json({ sketch });
            });
        }
    });
};
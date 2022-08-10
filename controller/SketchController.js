const Sketch = require('../models/Sketch');
const Joi = require('@hapi/joi');
const PdfGenerator = require('../lib/PdfGenerator');
const { attachCargoToDecks, toUsDate } = require('../lib/helpers');
const QRCode = require('qrcode');
const stream = require('stream');

/**
 * @name    getAll
 * @route   GET /api/sketches/
 * @returns returns all sketches from user
 */
exports.getAll = (req, res) => {
    Sketch
        .find({ userId: req.user.id })
        .then(sketches => {
            return res.json({ sketches });
        })
        .catch(error => {
            return res.status(400).json({ error });
        });
};

/**
 * @name    getOne
 * @route   GET /api/sketches/:id
 * @query   download?
 * @returns returns the sketch with given ID
 */
exports.getOne = (req, res) => {
    // Using mongoose query with lean to get a POJO instead of a mongoose document,
    // because of object property conflicts with handlebars.
    Sketch
        .findOne({ uuid: req.params.id, userId: req.user.id })
        .lean()
        .then(async sketch => {
            if (req.query.download === "1") {
                    // Generating the PDF from the sketch with puppeteer after
                    // preparing the data.
                    const data = attachCargoToDecks(sketch);

                    // Also attaching the user object (from jwt) to access name and email in the
                    // handlebars template.
                    data.user = req.user;

                    // Changing date format for createdAt and updatedAt to US date
                    data.createdAt = toUsDate(data.createdAt);
                    data.updatedAt = toUsDate(data.updatedAt);

                    // Attaching QR Code
                    data.qrcodeUrl = await QRCode.toDataURL("das istmeine adresse");

                    PdfGenerator
                        .create(data)
                        .then(pathToFile => {
                            return res.download(pathToFile);
                        });
    
                    /*
                    
                                    const readStream = new stream.PassThrough();
                readStream.end(data);
                
                res.set('Content-disposition', 'attachment; filename=' + "sketcherpdf.js");
                res.set('Content-Type', 'text/plain');         
                
                readStream.pipe(res);  
                    */
                    
            } else { 
                return res.json({ sketch });
            }
        })
        .catch(error => {
            return res.status(400).json({ error });
        });
};

/**
 * @name    store
 * @route   POST /api/sketches
 * @returns returns the sketch that was stored
 */
exports.store = (req, res) => {    
    // Append userId from the JWT (auth middleware).
    req.body.userId = req.user.id;

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
    Sketch
        .findOneAndUpdate({ uuid: value.uuid }, value, { new: true },)
        .then(sketch => {
            if (sketch) return res.json({ sketch });

            // Create sketch if it doesn't exist.
            if (!sketch) {
                Sketch
                    .create(value)
                    .then(sketch => {
                        return res.json({ sketch });
                    })
                    .catch(error => {
                        return res.status(500).json({ message: error });
                    });
            }
        })
        .catch(error => {
            return res.status(400).json({ message: error });
        })
};

/**
 * @name    delete
 * @route   GET /api/sketches/:id
 * @returns returns true if deleted.
 */
 exports.delete = (req, res) => {
    Sketch
        .findOneAndDelete({ userId: req.user.id })
        .then(sketch => {
            return res.json({ deleted: true });
        })
        .catch(error => {
            return res.status(400).json({ error });  
        });
};

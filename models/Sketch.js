const mongoose = require('mongoose');

const SketchSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true, 
        unique: true
    },
    userId: {
        type: String, 
        required: true
    },
    decks: {
        type: [{
            _id: false,
            name: {
                type: String,
                required: true
            },
            index: {
                type: Number, 
                required: true
            },
            visible: {
                type: Boolean,
                required: true
            },
            width: {
                type: Number,
                required: true
            }, 
            height: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    cargo: {
        type: [{
            _id: false,
            cargoIndex: {
                type: Number, 
                required: true
            },
            deckIndex: {
                type: Number, 
                required: true
            },
            coords: {
                type: {
                    _id: false,
                    x: {
                        type: Number, 
                        required: true
                    }, 
                    y: {
                        type: Number, 
                        required: true
                    }, 
                }, 
                required: true
            }, 
            cargoType: {
                type: String, 
                required: true
            }, 
            selected: {
                type: Boolean, 
                required: true
            },
            hazardous: {
                type: Boolean, 
                required: true
            }
        }], 
        required: true
    },
    shipDestination: {
        type: String, 
        required: true
    },
    shipName: {
        type: String, 
        required: true
    }
}, { timestamps: true });

module.exports = Sketch = mongoose.model('sketches', SketchSchema);
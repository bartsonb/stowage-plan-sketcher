const mongoose = require('mongoose');

const CoordsSchema = new mongoose.Schema({
    x: {
        type: Number, 
        required: true
    }, 
    y: {
        type: Number, 
        required: true
    }, 
})

const CargoSchema = new mongoose.Schema({
    index: {
        type: Number, 
        required: true
    },
    deckIndex: {
        type: Number, 
        required: true
    },
    coords: {
        type: {CoordsSchema}, 
        required: true
    }, 
    type: {
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
});

const DeckSchema = new mongoose.Schema({
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
});

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
        type: [DeckSchema],
        required: true
    },
    cargo: {
        type: [CargoSchema], 
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
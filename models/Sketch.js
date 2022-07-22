const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
    name: {
        type: String
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
    coords: {
        type: {CoordsSchema}, 
        required: true
    }, 
    type: {
        type: String, 
        required: true
    }, 
    hazardous: {
        type: Boolean, 
        required: true
    }, 
    index: {
        type: Number, 
        required: true
    }
});

const SketchSchema = new mongoose.Schema({
    userId: {
        type: Number, 
        required: true
    },
    ship: {
        decks: {
            type: [DeckSchema],
            required: true
        },
        cargo: {
            type: [CargoSchema], 
            required: true
        },
        name: {
            type: String, 
            required: true
        }
    }
}, { timestamps: true });

module.exports = Sketch = mongoose.model('sketches', SketchSchema);
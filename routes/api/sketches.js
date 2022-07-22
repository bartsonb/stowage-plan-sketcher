const router = require('express').Router();
const SketchController = require('../../controller/SketchController');
const AuthMiddleware = require('../../middleware/AuthMiddleware');

// @route   GET /api/sketches
module.exports = router.get('/:id', 
    SketchController.get
);

// @route   POST /api/sketches
module.exports = router.post('/', 
    SketchController.store
);
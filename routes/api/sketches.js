const router = require('express').Router();
const SketchController = require('../../controller/SketchController');
const AuthMiddleware = require('../../middleware/AuthMiddleware');

// @route   GET /api/sketches
module.exports = router.get('/', 
    AuthMiddleware,
    SketchController.getAll
);

// @route   GET /api/sketches
module.exports = router.get('/:id', 
    AuthMiddleware,
    SketchController.getOne
);

// @route   POST /api/sketches
module.exports = router.post('/', 
    AuthMiddleware,
    SketchController.store
);
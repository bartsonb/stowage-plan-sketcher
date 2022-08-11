const router = require('express').Router();
const SketchController = require('../../controller/SketchController');
const AuthMiddleware = require('../../middleware/AuthMiddleware');

// @route   GET /api/sketches
module.exports = router.get('/', 
    AuthMiddleware,
    SketchController.getAll
);

// @route   GET /api/sketches/:uuid
module.exports = router.get('/:uuid', 
    AuthMiddleware,
    SketchController.getOne
);

// @route   POST /api/sketches/:uuid/export
module.exports = router.post('/:uuid/export', 
    AuthMiddleware,
    SketchController.export
);

// @route   POST /api/sketches
module.exports = router.post('/', 
    AuthMiddleware,
    SketchController.store
);

// @route   DELETE /api/sketches/id
module.exports = router.delete('/:id', 
    AuthMiddleware,
    SketchController.delete
);
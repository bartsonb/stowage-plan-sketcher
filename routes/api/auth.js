const router = require('express').Router();
const AuthController = require('../../controller/AuthController');
const AuthMiddleware = require('../../middleware/AuthMiddleware');

// @route   GET api/auth
module.exports = router.get('/', 
    AuthMiddleware, 
    AuthController.show
);

// @route   POST api/auth
module.exports = router.post('/', 
    AuthController.login
);
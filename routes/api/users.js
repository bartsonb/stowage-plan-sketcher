const router = require('express').Router();
const UserController = require('../../controller/UserController');

// @route   POST /api/users
module.exports = router.post('/', 
    UserController.store
);
exports.addHeaders = (req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'X-Filename, Content-Disposition');

    next();
};
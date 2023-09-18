const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
        return res.status(413).json({
            msg: 'Use less than 2 MB image size'
        })
    }
    if (req.fileValidationError) {
        return res.status(422).json({
            msg: req.fileValidationError
        })
    }
    next()
}

module.exports = {fileSizeLimitErrorHandler}
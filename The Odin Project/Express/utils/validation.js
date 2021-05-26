const { body, validationResult } = require("express-validator");


exports.authorValidator = () => {
    return [
        body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.').escape(),
        body('lastName').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.').escape(),
        body('dob', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
        body('dod', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    ]
}

exports.bookValidator = () => {
    return [
         // Validate fields.
        body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
        body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
        body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
        body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
    
        // Sanitize fields (using wildcard).
        body('*').blacklist("<>"),
        body('genre.*').blacklist("<>"),

    ]
}

exports.genreValidator = () => {
    return [
        // Validate that the name field is not empty.
        body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    ]
}


exports.signupValidator = () => {
    return [
        body("username").notEmpty().withMessage("Provide username").bail().trim().isString().blacklist("<>"),
        body("password").notEmpty().withMessage("Provide password").bail().trim().isString().blacklist("<>"),
        body("comfirm-password").notEmpty().withMessage("Provide password").bail().trim().isString()
        .custom((value, {req}) => value === req.body.password).withMessage("Comfirm Password does not match").blacklist("<>")
    ]
}

exports.loginValidator = () => {
    return [
        body("username").notEmpty().withMessage("Provide username").bail().trim().isString().blacklist("<>"),
        body("password").notEmpty().withMessage("Provide password").bail().trim().isString().blacklist("<>"),
    ]
}

exports.results = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
        next()
    }else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
}
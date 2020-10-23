require("dotenv/config")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET


//jwt token generator
const generateToken = (data) => {
    return jwt.sign(data, secret, {expiresIn: '1h'})
}

//user authentication
const authenticate = (req, res, next) => {
    const bearer = req.headers.authorization

    if(bearer) {
        const token = bearer.split(" ")[1]

        jwt.verify(token, secret, (err, data) => {
            if(err) return res.status(401).json({message: "User is not authenticated"})
            
            //on success
            if(data) {
                req.isAuthenticated = true
                req.user = data
                next()
            }
        })
    
    }else return res.sendStatus(403)
}


//exports
module.exports = {
    generateToken,
    authenticate
}
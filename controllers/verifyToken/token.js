const jwt = require('jsonwebtoken')

async function authToken(req, res, next) {
    const token = req.headers['xxx-authen-token']

    if (!token) {
        return res.status(404).json({ msg: 'No token found' })
    }
    try {
        const decodeToken = jwt.verify(token, 'sirbao')

        req.user = decodeToken
        next()
    } catch {
        return res.status(403).json({ msg: 'Token is invalid' })
    }
}

module.exports = authToken

const jwt = require('jsonwebtoken');

// Auth token
function authPrivilege(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ msg: 'Token must be provided' });
    }
    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({ msg: 'Token not found' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) throw err;
        const { username } = payload;
        req.username = username;
        next();
    });
}

function resetVerifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.RESET_TOKEN_SECRET, (err, payload) => {
        if (err) throw err;
        const { username } = payload;
        req.idResetToken = username;
        next();
    });
}

module.exports = {
    authPrivilege,
    resetVerifyToken,
};

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration/configurations');

exports.createToken = (id, username) => {
    const token = jwt.sign({id, username}, JWT_SECRET, {expiresIn: '3h'})
    return token
}
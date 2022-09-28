const { JWT_SECRET } = require("../configuration/configurations");
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');

exports.userAuthentication = async(req, res, next) => {
    try {
        const {authorization} = req.headers

        if(!authorization){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: `Failed !!!`,
                message: `Required token not available !!!`
            })
        }

        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);

        if(!payload){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: `Failed !!!`,
                message: `Authorization failed !!!`
            })
        }

        req.user = {currentUser_id: payload.id, username: payload.username};
        next()

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
}
const jwt = require('jsonwebtoken');
const role = require('../utils/roles');
const User = require('../models/users');

exports.onlyAuthUser = function (req, res, next) {
    const userToken = req.header('authorization');
    if ( !userToken ) return res.status(401).send({
        errors: {
            message: 'Not Authenticated!'
        }
    });

    try {
        const token = userToken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_SECRET);

        User.findById(decoded.id, function (err, user) {
            if (err) { return done(err, false)}

            if (user) {
                if (role[user.role].find(function (url) {
                    return url === req.baseUrl
                })) {
                    req.user = user;
                    next();
                } else
                    return res.status(401).send({
                        errors: {
                            message: 'Access Denied: You dont have correct privilege to perform this operation'                        
                        }
                    });
            } else {
                return res.status(500).send({
                    errors: {
                        message: 'Something went wrong, please try again later.'   
                    }                                
                });
            }
        });

    } catch (ex) {
            res.status(401).send({
                errors: {
                message: 'Not sufficient permissions!'
            }
        })
    }
};

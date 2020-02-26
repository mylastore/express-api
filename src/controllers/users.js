
const { promisify } = require('util');
const User = require('../models/users');
const Meetup = require('../models/meetups');
const Thread = require('../models/threads');
const Post = require('../models/posts');
const Category = require('../models/categories');
const passport = require('passport');
const validator = require('validator');
const _ = require('lodash');
const crypto = require('crypto');
const _data = require('../utils/files');
const helpers = require('../utils/helpers');

/**
 * Helper method for getting user's gravatar and storing it for both endpoints
 * new user and user update
 */
function gravatar(email) {
    const size = 200;
    if (!email) {
        return `https://gravatar.com/avatar/?s=${size}&d=mp`;
    }
    const md5 = crypto.createHash('md5').update(email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=mp`;
};

// password must be 8 to 50 characters, must have 1 capital letter and 1 special character 
function validatePassword(val) {
    return new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(.{8,50})$"
    ).test(val);
}


const randomBytesAsync = promisify(crypto.randomBytes);

exports.getCurrentUser = function (req, res, next) {
    const user = req.user;
    if (!user) {
        return res.sendStatus(422);
    }
    return res.json(user.toUpdatedUser());
};

exports.register = function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;
    const avatar = gravatar(email);
    const registerData = {
        email,
        password,
        passwordConfirmation,
        avatar
    }
    if (registerData.name && !registerData.name.length >= 3) {
        return res.status(422).json({
            errors: {
                name: 'is required',
                message: 'Name must be at least 3 characters'
            }
        })
    }
    if (!registerData.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
                message: 'Email is required'
            }
        })
    }
    if (!registerData.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
                message: 'Password is required'
            }
        })
    }
    if (!validatePassword(registerData.password)) {
        return res.status(422).json({
            errors: {
                password: 'is required',
                message: 'Password must be at least 8 characters, must have at least 1 number and 1 special character'
            }
        })
    }

    if (registerData.password !== registerData.passwordConfirmation) {
        return res.status(422).json({
            errors: {
                password: 'is not the same as confirmation password',
                message: 'Password is not the same as confirmation password'
            }
        })
    }
    const user = new User(registerData);
    return user.save((error, savedUser, next) => {
        if (error) {
            return res.status(422).json({
                // this returns unique validation erorrs 
                errors: error
            })
        }
        return passport.authenticate('local', (err, passportUser) => {
            if (err) {
                return next(err)
            }

            const settingId = 'setting-39ob0ar23m9444j73zqj';
            _data.read('settings', settingId, function (err, checkData) {                
                if (!err && checkData && passportUser && checkData.newUser === true) {
                    const userEmail = registerData.email;
                    helpers.sendEmailNewUser(userEmail);    
                }
            });
            return res.json(passportUser.toAuthJSON())

        })(req, res, next)
    });
};

exports.login = function (req, res, next) {
    const { email, password } = req.body;
    if (!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
                message: 'Email is required'
            }
        })
    }
    if (!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
                message: 'Password is required'
            }
        })
    }
    return passport.authenticate('local', (err, passportUser) => {
        if (err) {
            return next(err)
        }
        if (passportUser) {
            return res.json(passportUser.toAuthJSON())
        } else {
            return res.status(422).json({ errors: { message: 'Invalid password or email' } })
        }
    })(req, res, next)
};

exports.logout = function (req, res) {
    req.logout();
    return res.json({ status: 'Session destroyed!' })
};

exports.updateUser = (req, res, next) => {
    const userId = req.params.id;
    const userData = req.body;
    User.findById(userId, (err, user) => {
        if (err) { return next(err); }
        if (user.email !== userData.email) {
            user.emailVerified = false;
            user.avatar = gravatar(userData.email);
        }
        user.email = userData.email || '';
        user.profile.name = userData.name || '';
        user.profile.gender = userData.gender || '';
        user.profile.location = userData.location || '';
        user.profile.website = userData.website || '';
        user.save({ new: true }, (err, updatedUser) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(422).json({
                        errors: {
                            message: 'Email already exist'
                        }
                    })
                }
                return res.status(422).json({
                    errors: err
                })
            }
            return res.json(updatedUser.toUpdatedUser());
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.updatePassword = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isLength(req.body.password, { min: 6 })) validationErrors.push({ message: 'Password must be at least 6 characters long' });
    if (req.body.password !== req.body.passwordConfirmation) validationErrors.push({ message: 'Passwords do not match' });
    if (validationErrors.length) {
        return res.status(422).json({
            errors: {
                message: "Password did not comply with our requirements",
                error: validationErrors
            }
        })
    }
    User.findById(req.user.id, (err, foundUser) => {
        if (err) { return next(err) }
        const userEmail = foundUser.email;
        foundUser.password = req.body.password;        
        foundUser.save((err) => {
            if (err) { return next(err); }
            helpers.sendEmailPasswordUpdatedSuccessfully(userEmail);
            return res.status(200).json({
                message: 'Your password was updated successfully!'
            })

        });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.processResetPassword = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ message: 'Password must be at least 6 characters long' });
    if (req.body.password !== req.body.passwordConfirmation) validationErrors.push({ message: 'Passwords do not match' });
    if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ message: 'Invalid Token.  Please retry.' });
    if (validationErrors.length) {
        return res.status(500).json({
            errors: {
                message: validationErrors
            }
        })
    }
  
    User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .then((user) => {
            if (!user) {
                return res.status(422).json({
                    errors: {
                        message: 'Password reset token is invalid or has expired.'
                    }
                })
            } else {
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save();
                helpers.sendEmailPasswordResetSuccessfully(user.email);
                res.status(200).json({
                    message: 'Password was updated successfully. You may now log in to your account.'
                })         
            }
            return user;
        });   

};


/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;
    const host = process.env.REQUEST_HOST;

    const createRandomToken = randomBytesAsync(16)
        .then((buf) => buf.toString('hex'));

    const setRandomToken = (token) =>{
        User
            .findOne({ email: email })
            .then((user) => {
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user = user.save();    
                helpers.sendEmailForgotPassword(email, token, host)
                res.status(200).json({
                    message: `An e-mail has been sent to ${email} with further instructions.`
                })        
            })                   
            return token;
    }

    createRandomToken
        .then(setRandomToken)
        .then(() => res.status(200))
        .catch(next);
};


/**
 * POST /account/delete
 * Delete user account.
 */
exports.deleteAccount = (req, res, next) => {
    User.deleteOne({ _id: req.user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        return res.status(200).json({
            message: 'Account was deleted successfully!'
        });
    });
};


// @facet
// Processes multiple aggregation pipelines within a single stage on the same set of input documents.
// Each sub-pipeline has its own field in the output document where its results are stored as an array of documents.


// meetups: find all of the meetups where meetupCreator is loggedIn user
//          find only 5 meetups
//          sort meetups by newest ones

// meetupsCount: find all of the meetups where meetupCreator is loggedIn user
//               don't return data but count of all meetups

function fetchMeetupsByUserQuery(userId) {
    return Meetup.aggregate([
        {
            "$facet": {
                "meetups": [
                    { "$match": { "meetupCreator": userId } },
                    { "$limit": 5 },
                    { "$sort": { "createdAt": -1 } }
                ],
                "meetupsCount": [
                    { "$match": { "meetupCreator": userId } },
                    { "$count": "count" }
                ]
            }
        }
    ])
        .exec()
        .then(results => {
            return new Promise((resolve, reject) => {
                Category.populate(results[0].meetups, { path: 'category' })
                    .then(pMeetups => {
                        if (pMeetups && pMeetups.length > 0) {
                            resolve({ data: pMeetups, count: results[0].meetupsCount[0].count });
                        } else {
                            resolve({ data: results[0].meetups, count: 0 })
                        }
                    })
            })
        })
}

function fetchThreadsByUserQuery(userId) {
    return Thread.aggregate([
        {
            "$facet": {
                "threads": [
                    { "$match": { "user": userId } },
                    { "$limit": 5 },
                    { "$sort": { "createdAt": -1 } }
                ],
                "threadsCount": [
                    { "$match": { "user": userId } },
                    { "$count": "count" }
                ]
            }
        }
    ])
        .exec()
        .then(results => {
            const threads = results[0].threads;
            if (threads && threads.length > 0) {
                return { data: threads, count: results[0].threadsCount[0].count }
            }

            return { data: threads, count: 0 }
        })
}

function fetchPostByUserQuery(userId) {
    return Post.aggregate([
        {
            "$facet": {
                "posts": [
                    { "$match": { "user": userId } },
                    { "$limit": 5 },
                    { "$sort": { "createdAt": -1 } }
                ],
                "postsCount": [
                    { "$match": { "user": userId } },
                    { "$count": "count" }
                ]
            }
        }
    ])
        .exec()
        .then(results => {
            const posts = results[0].posts;
            if (posts && posts.length > 0) {
                return { data: results[0].posts, count: results[0].postsCount[0].count }
            }

            return { data: results[0].posts, count: 0 }
        }
        )
}

exports.getUserActivity = function (req, res) {
    const userId = req.user._id;

    Promise.all(
        [fetchMeetupsByUserQuery(userId),
        fetchThreadsByUserQuery(userId),
        fetchPostByUserQuery(userId)
        ])
        // Writing [] to get data from the array

        .then(([meetups, threads, posts]) => res.json({ meetups, threads, posts }))
        .catch(err => {
            res.status(422).json({ err })
        })
};

// addFavorite
exports.addFavoriteMeetup = function (req, res) {
    const { id } = req.params;
    const user = req.user;

    if (user) {
        var isInArray = user.favoriteMeetups.some(function (meetup) {
            return meetup.equals(id);
        });

        if (isInArray !== true) {
            User.findOneAndUpdate({ _id: user.id }, { $push: { favoriteMeetups: id } })
                .exec(errors => {
                    if (errors) {
                        return res.status(422).json({ errors })
                    }
                    return res.json(user)
                })

        } else if (isInArray === true) {
            User.findOneAndUpdate({ _id: user.id }, { $pull: { favoriteMeetups: id } })
                .exec(errors => {
                    if (errors) {
                        return res.status(422).json({ errors })
                    }

                    return res.json(user)
                })
        }

    } else {
        return res.status(401).json({ errors: { message: 'Not Authorized!' } })
    }
};

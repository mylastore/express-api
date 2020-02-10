

const nodemailer = require('nodemailer');
const { promisify } = require('util');
const User = require('../models/users');
const Meetup = require('../models/meetups');
const Thread = require('../models/threads');
const Post = require('../models/posts');
const Category = require('../models/categories');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const _ = require('lodash');
const crypto = require('crypto');

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
 
// password must be 8 characters or more, must have a capital letter and 1 special character 
function validatePassword(val) {
  return new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(.{8,50})$"
  ).test(val);
}

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USER_NAME,
      pass: process.env.SENDGRID_PASSWORD
    }
  });

const companyName = process.env.COMPANY_NAME;
const companyEmail = process.env.EMAIL_TO;
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
            if (passportUser) {
                const userEmail = registerData.email;

                const mailOptions = {
                    from: companyName + ' ' + '<' + companyEmail + '>',
                    to: companyEmail,
                    subject: 'New user created | ' + companyName,
                    html: `<h1>New user was created.</h1><br><p>Email: ${userEmail}</p>`
                }

                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        res.status(422).json({
                            errors: {
                                message: 'Oops something went wrong, please try again.',
                                error: err,
                            }
                        })
                    } else {
                        res.status(200).json({
                            message: 'Your email was sent successfully!',
                        })
                    }
                });
                return res.json(passportUser.toAuthJSON())
            } else {
                return res.status(422).json({ errors: { message: 'Invalid password or email' } })
            }

        })(req, res, next)

        //return res.json(savedUser)
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
        if (user.email !== userData.email){
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
        return res.status(500).json({
            errors: validationErrors
        })
    }

    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.password = req.body.password;
        user.save((err) => {
            if (err) { return next(err); }
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
    const resetPassword = () =>
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
          }
          return user;  
        
        });
  
    const sendResetPasswordEmail = (user) => {
        if(!user){
            return;
        } else {      
            const userEmail = user.email;
            const mailOptions = {
              to: userEmail,
              from: companyName + ' ' + '<' + companyEmail + '>',
              subject: `Your password at ${companyName} has been changed`,
              text: `Hello,\n\nThis is a confirmation that the password for your account ${userEmail} has just been changed.\n`
            };
            return transporter.sendMail(mailOptions)
              .then(() => {
                  res.status(200).json({
                      message: 'Success! Your password has been changed.'
                  })
              })
              .catch((err) => {
                  if(err){
                      console.log('oops: ',err);
                    //   return res.status(422).json({
                    //       errors: {
                    //           message: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.',
                    //           error: err
                    //       }
                    //   })
                  }      
              });
        }



    };
  
    resetPassword()
      .then(sendResetPasswordEmail)
      .then(() => res.status(200))
      .catch(next);
  };
  

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.forgotPassword = (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(422).json({
            errors: {
                message: "Please enter a valid email address."
            }
        })
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    const createRandomToken = randomBytesAsync(16)
        .then((buf) => buf.toString('hex'));

    const setRandomToken = (token) =>
        User
            .findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    return res.status(422).json({
                        errors: {
                            message: 'No account with that email was found.'
                        }
                    })
                } else {
                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                    user = user.save();
                }
                return user;
            });

    const sendForgotPasswordEmail = (user) => {
        if(!user){
            return next();
        }
        const token = user.passwordResetToken;
        const requestHost = process.env.REQUEST_HOST;
        const mailOptions = {
            to: user.email,
            from: companyName + ' ' + '<' + companyEmail + '>',
            subject: 'Password reset on ' + companyName,
            text:   `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n
                    Please click on the following link, or paste this into your browser to complete the process:\n
                    http://${requestHost}/#/reset/${token}\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        return transporter.sendMail(mailOptions)
            .then(() => {
                return res.status(200).json({
                    message: `An e-mail has been sent to ${user.email} with further instructions.`
                })
            })
            .catch((err) => {
                if(err){
                    return res.status(422).json({
                      errors: {
                          message: 'Error sending the password reset email. Please try again later'
                      }
                  });
                }
            });
    };

    createRandomToken
        .then(setRandomToken)
        .then(sendForgotPasswordEmail)
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


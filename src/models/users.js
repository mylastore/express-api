const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Meetup = require('./meetups');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const _ = require('lodash');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: String,
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },

  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  google: String,
  
  avatar: String,
  role: {type: String, default: 'customer'},

  info: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  joinedMeetups: [{type: Schema.Types.ObjectId, ref: 'Meetup'}],
  favoriteMeetups: [{type: Schema.Types.ObjectId, ref: 'Meetup'}]

});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//Every user have acces to this methods
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({
    email: this.email,
    id: this._id,
    xsrfToken: process.env.XSRF_TOKEN
  }, process.env.JWT_SECRET, {expiresIn: '1h'})
};

userSchema.methods.toUpdatedUser = function () {
  return {
    user: {
      _id: this._id,
      role: this.role,
      avatar: this.gravatar(),
      info: this.info,
      email: this.email,
      joinedMeetups: this.joinedMeetups,
      favoriteMeetups: this.favoriteMeetups,
      memberSince: this.createdAt,
      emailVerified: this.emailVerified,
      profile: this.profile
    }
  }
};

userSchema.methods.toAuthJSON = function () {
  return {
    user: {
      _id: this._id,
      role: this.role,
      avatar: this.gravatar(),
      info: this.info,
      email: this.email,
      joinedMeetups: this.joinedMeetups,
      favoriteMeetups: this.favoriteMeetups,
      memberSince: this.createdAt,
      emailVerified: this.emailVerified,
      profile: this.profile
    },
    token: {
      token: this.generateJWT()
    }
   
  }
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};


userSchema.plugin(uniqueValidator, {message: '{PATH} is already in used' });

module.exports = mongoose.model('User', userSchema);

const User = require('../models/users');

exports.getUsers = function(req, res) {
  User.find({})
        .limit(10)
        .sort({'creatdAt': -1})
        .exec((errors, users) => {

    if (errors) {
      return res.status(422).send({
        errors
      });
    }

    return res.json(users);
  });
}

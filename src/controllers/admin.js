const User = require('../models/users');

exports.getUsers = async function (req, res) {
  const resPerPage = 2; // results per page
  const page = req.params.page || 1; // Page

  try {
    const foundUsers = await User.find({})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage);
      if (!foundUsers) {
        return res.status(422).send({
          errors: {
            message: 'No users found!'
          }
        });
      }
      const totalItems = await User.countDocuments({});
      return res.status(200).json(
        {
          "totalItems": totalItems,
          "resPerPage": resPerPage,
          "users": foundUsers,

        } 
      );

  } catch (err) {
    if (err) {
      return res.status(422).send({
        errors: err
      });
    }
  }

}

exports.getUser = function (req, res) {
  User.findById(req.params.id)
    .exec((errors, user) => {
      if (!user) {
        return res.status(422).send({
          errors: {
            message: 'User not found!'
          }
        });
      }
      if (errors) {
        return res.status(422).send({
          errors
        })
      }
      return res.json(user);
    })
}

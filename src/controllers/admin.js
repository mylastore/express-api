
const User = require('../models/users');
const _data = require('../utils/files');

exports.getUsers = async (req, res) => {
  const resPerPage = 2; // results per page
  const page = req.params.page || 1; // Page
  try {
    const foundUsers = await User.find({})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage);
    if (foundUsers < 0) {
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

exports.postAdminSettings = (req, res, next) => {
  const userId = req.params.id;
  const userData = req.body;
  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    user.settings.userNotification = userData.userSelected;
    user.settings.quoteNotification = userData.quoteSelected;
    user.save({ new: true }, (err, updatedUser) => {
      if (err) {
        return res.status(422).json({
          errors: err
        })
      }
      const settingId = 'setting-39ob0ar23m9444j73zqj';
      if(updatedUser && settingId === 'setting-39ob0ar23m9444j73zqj'){
         const settingsObject = {
          "settingId": settingId,
          'newUser': userData.userSelected,
          "newQuote": userData.quoteSelected,
        };
        // Update the new sttings
        _data.update('settings', settingId, settingsObject, function (err) {
          if (!err) {
            res.status(200);
          } else {
            res.status(500, { 'Error': 'Could not create the new setting' });
          }
        });
      }
      return res.json(updatedUser.toUpdatedUser());
    });
  });
};

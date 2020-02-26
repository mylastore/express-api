const helpers = require('../utils/helpers');


exports.send = function (req, res) {
    const data = req.body;
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('msg', 'Message cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        res.status(422).json({
            errors: {
                message: 'Validation Errors',
                error: errors,
            }
        })
    }

    const name = data.name;
    const email = data.email;
    const tel = data.tel || '';
    const site = data.site || '';
    const msg = data.msg;
    const reason = "New Contact Email"
    helpers.sendEmailNotification(name, email, tel, site, msg, reason, function(err){
        if(err){
            res.status(422).json({
                errors: {
                    message: 'Oops something went wrong, please try again later.'
                }
            })
        }
        res.status(200).json({
            message: 'Your eamil was sent successfully!'
        })
    });

};

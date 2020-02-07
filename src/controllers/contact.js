const transporter = require('../utils/helpers.js').sendEmail();

exports.send = function (req, res) {
    const data = req.body;

    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('content', 'Message cannot be blank').notEmpty();
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

    const companyName = process.env.COMPANY_NAME;
    const companyUrl = process.env.COMPANY_URL;
    const emailTo = process.env.EMAIL_TO;

    const mailOptions = {
        from: data.name + ' ' + '<' + data.email + '>',
        to: emailTo,
        subject: 'Contact Form | ' + companyName,
        template: 'contact-form',

        context: {
            companyName: companyName,
            companyUrl: companyUrl,
            tel: data.phone,
            name: data.name,
            message: data.content,
            email: data.email,
            company: data.company
        }
    };

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
};

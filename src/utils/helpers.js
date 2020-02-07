
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

// Container for all the helpers
var helpers = {};
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER_NAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

helpers.sendEmail = function () {
  const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: 'src/views/partials',
      layoutsDir: 'src/views/layouts',
      defaultLayout: '',
    },
    viewPath: 'src/views/emails',
    extName: '.hbs',
  };
   return transporter.use('compile', hbs(handlebarOptions));
}

helpers.sendPlainEmail = function () {
 
   return transporter;

}

// Export the module
module.exports = helpers;

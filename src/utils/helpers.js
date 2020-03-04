
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

// Container for all the helpers
var helpers = {};

const transport = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER_NAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

function htmlstring(txt){
  return txt.replace(/(\r\n|\n|\r)/gm, "<br>");
};

// get the site owner info
const emailTo = process.env.EMAIL_TO;
const companyName = process.env.COMPANY_NAME;
const companyEmail = process.env.COMPANY_EMAIL;
const companyUrl = process.env.COMPANY_URL;
const companyTagline = process.env.COMPANY_TAG_LINE;
const companyAddress = process.env.COMPANY_ADDRESS;

helpers.cart = function(oldCart){
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.addItem = function(item, id) {
      let storedItem = this.items[id];
      if (!storedItem) {
          storedItem = this.items[id] = {item: item, qty: 0, price: 0};
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty++;
      this.totalPrice += storedItem.item.price;
  };

  this.reduceByOne = function(id) {
      this.items[id].qty--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.price;

      if (this.items[id].qty <= 0) {
          delete this.items[id];
      }
  };

  this.increaseByOne = function(id) {
      this.items[id].qty++;
      this.items[id].price += this.items[id].item.price;
      this.totalQty++;
      this.totalPrice += this.items[id].item.price;

      if (this.items[id].qty <= 0) {
          delete this.items[id];
      }
  };

  this.removeItem = function(id) {
      this.totalQty -= this.items[id].qty;
      this.totalPrice -= this.items[id].price;
      delete this.items[id];
  };

  this.generateArray = function() {
      var arr = [];
      for (let id in this.items) {
          arr.push(this.items[id]);
      }
      return arr;
  };
}

helpers.formatDate = function(data){
  const d = moment(new Date(date));
  return d.format('MMMM DD, YYYY');
}

helpers.formatPrice = function(cents, location = "USD"){
  return (cents / 100).toLocaleString("en-US", {
    style: 'currency',
    currency: location
  })
}

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
  strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for (i = 1; i <= strLength; i++) {
      // Get a random charactert from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendEmailForgotPassword = function (email, token, host){
  if (email && token && host) {
    const title = "Reset Password";
    const buttonTitle = "Reset Password";
    const buttonLink = `${host}/#/reset/${token}`;
    const content =  `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\ Please click on the button below to complete the process.\ If you did not request this, please ignore this email and your password will remain unchanged.`;
    var payload = {
      to: email,
      from: companyName + ' ' + '<' +companyEmail +'>',
      subject: `Password reset from ${companyName}`,
      template: 'reset-password',
      context: {
        companyName: companyName,
        companyUrl: companyUrl,
        companyTagline: companyTagline,
        companyAddress: companyAddress,
        title: title,
        content: htmlstring(content),
        buttonTitle: buttonTitle,
        buttonLink: buttonLink
      }    
    }
    // pass handlebar options to send full html/hbs template email
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
    transport.use('compile', hbs(handlebarOptions));    
    transport.sendMail(payload, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return console.log('Email sent: ' + info.response);
      }
    });
  }


}

helpers.sendEmailPasswordResetSuccessfully = function(email){
  email = typeof (email) == 'string' && email.trim().length > 0 && email.trim().length <= 60 ? email.trim() : false;
  if(email){
    var payload = {
      to: email,
      from: companyName + ' '+'<'+ companyEmail+'>',
      subject: `Your password at ${companyName} has been changed`,
      html: `Hello,\n this is a confirmation that the password for your account with ${email} has just been changed.\n`
    }
    transport.sendMail(payload, function(err){
      if(err){
        res.status(422).json({
          errors: {
            message: 'Email failed to send',
            error: err
          }
        })
      }
      res.status(200).json({
        message: 'Email was sent successfully'
      })
    })
  }
}

helpers.sendEmailPasswordUpdatedSuccessfully = function(email){
  email = typeof (email) == 'string' && email.trim().length > 0 && email.trim().length <= 60 ? email.trim() : false;
  if(email){
    var payload = {
      from: companyName + ' ' + '<' +companyEmail + '>',
      to: emailTo,
      subject: 'Password was updated successfully',
      html: 'Your password for account with email '+ email +' was updated successfully.<br> If you did not perform this operation please contact support immidiatly.'
    };
  }
  transport.sendMail(payload, function(err){
    if(err){
      res.status(422).json({
        errors: {
          message: 'Oops, the email could not be sent',
          error: err
        }
      })
    }
    res.status(200).json({
      message: 'Email was sent successfully!'
    })
  });
};

helpers.sendEmailQuote = function (name, email, tel, site, msg, reason) {
  // Validate parameters
  name = typeof (name) == 'string' && name.trim().length > 0 && name.trim().length <= 60 ? name.trim() : false;
  email = typeof (email) == 'string' && email.trim().length > 0 && email.trim().length <= 60 ? email.trim() : false;
  reason = typeof (reason) == 'string' && reason.trim().length > 0 && reason.trim().length <= 60 ? reason.trim() : false;
  msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if (name && email && reason && msg) {
    // Configure the request payload
    var payload = {
      from: name + ' ' + '<' + email + '>',
      to: emailTo,
      subject: 'From: ' + name + ' - ' + 'Reason: ' + reason,
      tel: tel,
      site: site,
      html: 'NEW QUOTE: '+ "<br><br>" +msg
    };
    transport.sendMail(payload, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
};

helpers.sendEmailNotification = function (name, email, tel, site, msg, reason) {
  // Validate parameters
  msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  email = typeof (email) == 'string' && email.trim().length > 0 && email.trim().length <= 60 ? email.trim() : false;

  if (email && msg) {
    // Configure the request payload for mail with template
    const mailOptions = {
      from: name + ' ' + '<' + email + '>',
      to: emailTo,
      subject: 'From: ' + name + ' - ' + 'Reason: ' + reason,
      // template name
      template: 'contact-form',
      context: {
        companyName: companyName,
        companyUrl: companyUrl,
        tel: tel,
        name: name,
        msg: msg,
        email: email,
        site: site
      }
    };

    // pass handlebar options to send full html/hbs template email
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
    transport.use('compile', hbs(handlebarOptions));

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
};

helpers.sendEmailNewUser = function (email) {
  // Validate parameters
  email = typeof (email) == 'string' && email.trim().length > 0 && email.trim().length <= 60 ? email.trim() : false;

  if (email) {
    // Configure the request payload
    var payload = {
      from: companyName + ' ' + '<' + companyEmail + '>',
      to: emailTo,
      subject: 'New user was created at '+companyName,
      html: `<h1>New user was created.</h1><br><p>Email: ${userEmail}</p>`
    };
    transport.sendMail(payload, function (error, info) {
      if (error) {
        res.status(422).json({
          errors: {
            message: 'Oops, something went wrong when trying to send the email.',
            error: err
          }
        })
      } else {
        res.status(200).json({
          message: 'Email notification has been sent'
        })
      }
    });
  }
};

// Export the module
module.exports = helpers;

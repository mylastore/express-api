const Quote = require('../models/quotes');
const transporter = require('../utils/helpers').sendPlainEmail();

exports.getQuote = function (req, res, next) {
    const quoteId = req.params.id;

    if (quoteId) {
        Quote.findById(quoteId, (errors, quote) => {
            if (errors) return res.status(422).send({ errors });

            return res.json(quote);
        });
    } else {
        return res.status(422).send({
            errors: {
                errors: 'Quote not found!'
            }
        })
    }

};

exports.getAllQuotes = async (req, res, next) => {
    try {
      const quotes = await Quote.list(req.query);
      const transformedQuotes = quotes.map(quotes => quotes.transform());
      res.json(transformedQuotes);
    } catch (error) {
      next(error);
    }
  };
  

exports.create = function (req, res) {
    const quoteData = req.body;
    const quote = new Quote(quoteData);

    return quote.save((error, savedQuote, next) => {
        if (error) {
            res.status(422).json({
                errors: {
                    message: error.message,
                    error: error.errors,
                }         
            });
        } else {
            const emailTo = process.env.EMAIL_TO;
            const companyName = process.env.COMPANY_NAME;
            const companyEmail = process.env.COMPANY_EMAIL;

            const name = savedQuote.name;
            const email = savedQuote.email;
            const content = savedQuote.content;
            
            const mailOptions ={
                from: companyName + ' ' + '<' + companyEmail + '>',
                to: emailTo,
                subject: 'New Quote | ' + companyName,
                html: `<h1>New quote was created.</h1><br><p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${content}</p>`
            }
            transporter.sendMail(mailOptions, function(err){
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
            return res.json(savedQuote)
        }
    });
};

exports.delete = function (req, res, next) {
    const quoteId = req.params.id;

    if (quoteId) {
        Quote.findById(quoteId, (errors, quote) => {
            if (errors) return res.status(422).send({ errors });

            quote.remove()
                .then(() => res.status(200).end())
                .catch(e => next(e));
        });
    } else {
        return res.status(422).send({
            errors: {
                errors: 'Quote not found!'
            }
        })
    }

};

exports.logout = function (req, res) {
    req.logout();
    return res.json({ status: 'Session destroyed!' })
};

exports.update = (req, res) => {
    const quoteId = req.params.id;
    const quoteData = req.body;

    if (quoteId) {
        // new: bool - true to return the modified document rather than the original. defaults to false
        Quote.findByIdAndUpdate(quoteId, { $set: quoteData }, { new: true }, (errors, updatedQuote) => {
            if (errors) return res.status(422).send({ errors });

            return res.json(updatedQuote);
        });

    } else {
        return res.status(422).send({
            errors: {
                errors: 'Quote not found!'
            }
        })
    }

};

const Quote = require('../models/quotes');
const _data = require('../utils/files');
const helpers = require('../utils/helpers');

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

exports.getQuotes = async (req, res, next) => {
    const resPerPage = 2;
    const page = req.params.page || 1;
    try {
        const foundQuotes = await Quote.find({})
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
        if(foundQuotes.length <= 0){
            return res.status(422).send({
                errors: {
                    message: "No quotes found!"
                }
            })
        }
        const totalItems = await Quote.countDocuments({});
        return res.status(200).json({  "totalItems": totalItems, "resPerPage": resPerPage, "quotes": foundQuotes  })
    } catch (err) {
        if (err) {
          return res.status(422).send({
            errors: err
          });
        }
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
        } 

        const settingId = 'setting-39ob0ar23m9444j73zqj';
        _data.read('settings', settingId, function (err, checkData) {       
             if(!err && checkData && savedQuote && checkData.newQuote === true){
                const name = savedQuote.name;
                const email = savedQuote.email;
                const tel = savedQuote.tel || '';
                const site = savedQuote.site || '';
                const msg = savedQuote.msg;
                const reason = "New Quote";
                helpers.sendEmailQuote(name, email, tel, site, msg, reason);    
             }
        });

        return res.json(savedQuote)
      
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

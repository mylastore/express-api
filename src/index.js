require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')({ session: session });
const helmet = require('helmet');
const hbs = require('express-handlebars');
const errorHandler = require('errorhandler');
const diyHbsHelpers = require('diy-handlebars-helpers');
const hbsHelpers = require('../src/utils/hbsHelpers');
const connectAssets = require('connect-assets');
const morgan = require('morgan');
const path = require('path');

const dataBase = process.env.DB_URI;
const requestHost = process.env.REQUEST_HOST;

// 1. package.json add heroku script CHECKED
// 2. change sockets url CHECKED
// 3. change location by ip address CHECKED
// 4. create ENV variables in Svelte fronend CHECKED
// 5. Create ENV variables on Heroku CHECKED

require("../src/models/quotes");
require("../src/models/meetups");
require("../src/models/users");
require("../src/models/threads");
require("../src/models/posts");
require("../src/models/categories");
require("../src/services/passport");

const ApiCtrl = require('./controllers/api')
const meetupsRoutes = require('../src/routes/meetups'),
      usersRoutes = require('../src/routes/users'),
      quotesRoutes = require('../src/routes/quotes'),
      contactRoutes = require('../src/routes/contact'),
      threadsRoutes = require('../src/routes/threads'),
      postsRoutes = require('../src/routes/posts'),
      categoriesRoutes = require('../src/routes/categories'),
      adminRoutes = require('../src/routes/admin'),
      apiRoutes = require('../src/routes/api');

mongoose.connect(dataBase, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB:',dataBase))
  .catch(err => console.log(err));

const app = express();
app.use(helmet());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main.hbs',
  partialsDir: [ path.join(__dirname, 'views/partials') ],
  helpers: _.extend(hbsHelpers, diyHbsHelpers)
}));
app.set('view engine', 'hbs');

// if (process.env.NODE_ENV === 'development') {
//   const appPath = path.join(__dirname, '..', 'public');
//   app.use(express.static(appPath));

//   app.get('*', function(req, res) {
//     res.sendFile(path.resolve(appPath, 'views/index.hbs'));
//   });
// }

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {pingTimeout: 60000});

require('./socket')(io);

app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));

const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: sessionSecret,
  store: new MongoStore({
    url: dataBase,
    auto_reconnect: true
  })
}));

// Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: {
    isImage: function (value, filename) {
      let extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));
app.use(flash());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", requestHost);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get('/', ApiCtrl.getIndex);

app.use('/api/v1', apiRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/meetups', meetupsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/threads', threadsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/admin', adminRoutes);


/**
 * 500 Error Handler.
 * As of Express 4.0 it must be placed at the end of all routes.
 */
app.use(errorHandler());

app.use(morgan('combined'));

const PORT = process.env.SERVER_PORT;

server.listen(PORT , function() {
   console.log('Server: http://localhost:' + PORT);
});


const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose'); 


const flash = require('connect-flash');
const session = require('express-session');


// Passport config , przekazujemy TUTAJ zmienna passport, bo przekazujemy funkcje ze zmienna
const passport = require('passport')
require('./config/passport')(passport)



//EJS
//middleware 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser - wbudowany w express
app.use(express.urlencoded({extended: false}));

// EXPRESS SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

// PASSPORT SESSION  middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect Flash 
  app.use(flash());

  //global variables #Flash messages 
  app.use((req,res,next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  })


//DB config 
 const db = require('./config/keys').MongoURI;
//connecting  to mongo using mongoose 
mongoose.connect(db, {useNewUrlParser: true}).then(() => console.log('Connected to DB')).catch(err => console.log(err));


// ROUTES //
// landing page
app.use('/', require('./routes/index'));
// register
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port:  ${PORT}`));
const LocalStrategy = require('passport-local').Strategy;
// for checking the db ... if email and pass matches
const mongoose = require('mongoose');
// need to compare the hash to the plain text
const bcrypt = require('bcryptjs');


// Loading the user model
const User = require('../usermodels/user');


// przekazuje funkcje
module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email,password, done ) => {
            //Match user, check if there is one with that email, using mongoose 
            User.findOne({email: email})
            .then(user => {
                if(!user) {
                    return done(null, false, {message: 'There is user with that email in the database'});
                } else {
                    // Match password.  //user.password is a hashed password of a user, taken from a database //password is a plain text password taken from login fields //isMatch is a boolean
                    bcrypt.compare(password, user.password, (err, isMatch)=> {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null,user)
                        } else {
                            return done(null, false, {message: 'False password'})
                        }
                    });
                    
                }
            })
            .catch((err) => console.log(err))
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user)=>{
          done(err, user);
        });
    });
}


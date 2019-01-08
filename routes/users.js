const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const passport = require('passport')

//User model 
const User = require('../usermodels/user')

// ROUTES 
// login
router.get('/login', (req,res)=>
    res.render('login')
);
//register
router.get('/register', (req,res)=>
    res.render('register')
);
// Register handle - post 
router.post('/register', (req,res) => { 
    //destructuring 
    const { name, email, password, password2} = req.body;
    let err = [];

    if(!name || !email || !password || !password2 && password !== password2) {
        err.push({msg: 'Fill in all fields before submiting'})
    } else {
    //check required fields
    if(!name || !email || !password || !password2) {
        err.push({msg: 'Fill in all fields before submiting'})
    }

    //check if passwords match
    if(password !== password2) {
        err.push({msg: 'Passwords do not match'})
    }
    
    //check password length 
    if(password.length < 6) {
        err.push({msg: 'Password needs to have 6 letter or more'})
    }
}
   

    if(err.length > 0){
        //issue = sending err array 
        res.render('register', {
        err,
        name,
        email,
        password,
        password2
        })
             
    } else {
        //proceede
        User.findOne({email: email})
        .then(user => {
            if(user) {
                // User already exists
                err.push({msg: 'There is a User with that EMAIL already.'})
                res.render('register', {
                    err,
                    name,
                    email,
                    password,
                    password2
                    }) 
            } else {
                // create user 
                const newUser = new User({
                    name,
                    email,
                    password,  
                });
                // HASH passwort and generate a salt
                bcrypt.genSalt(10, (error, salt)=> {
                    bcrypt.hash(newUser.password, salt, (error,hash)=> {
                        if(error) throw error
                        
                        //set passowrd to hashed password
                        newUser.password = hash
                        //finally save the user in a database
                        newUser.save()
                            .then(user=> {
                                // created flash msg
                                req.flash('success_msg', 'Register successfull')
                                res.redirect('/users/login')

                            })
                            .catch(err => console.log(err))
                        
                    } )
                }) 
            }
        })
    } }
)

// Login Handle 
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

// LOGOUT 
router.get('/logout', (req,res)=> {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login')
})
module.exports = router;
// Auth middleware
module.exports = {
    ensureAuthenticated: (req,res,next) => {
        if(req.isAuthenticated()) {
            next();
        }
        req.flash('error_msg', ' You need to be logged in to view this route')
        res.redirect('/users/login');
    }
}
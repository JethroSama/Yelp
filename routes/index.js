const express = require("express"),
User = require("../models/user"),
Comment = require("../models/comment"),
Campsite = require("../models/campsite"),
passport = require("passport"),
middleware = require("../middleware/index"),
async = require("async"),
nodemailer = require("nodemailer"),
crypto = require("crypto"),
router = express.Router(),
multer = require('multer'),
storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'jethrosama', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

 //landing
  router.get("/", (req, res)=>{
    res.render("landing");
  });

//---register---
//render registration page
router.get("/register", (req, res)=>{
  res.render("register", {page: "register"});
});
//register user logic
router.post("/register", upload.single('avatar'), (req, res)=>{
  cloudinary.uploader.upload(req.file.path, function(result){
    const newUser = new User({
      username: req.body.username,
      avatar: cloudinary.url(result.public_id+ ".jpg", {width: 90, height: 90, crop: "thumb", gravity: "face"}),
      avatarId: result.public_id,
      email: req.body.email
    });
    if(req.body.adminCode === process.env.ADMIN_CODE){
    newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, data)=>{
      if (err) {
        return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, ()=>{
        req.flash("success", "Welcome to Yelp Camp, "+ data.username);
        res.redirect("/campsites");
      });
    });
  });
});
//-----login-----
//render login
router.get("/login", (req, res)=>{
  res.render("login", {page: "login"});
});
//login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campsites",
  successFlash: "Welcome back",
  failureRedirect: "/login",
  failureFlash: true
}), (req, res)=>{
});
//-----logout-----
router.get("/logout", (req, res)=>{
  req.logout();
  req.flash("success", "Succesfully logged out");
  res.redirect("/campsites");
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'kel73896@gmail.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'YelpCamp',
        subject: 'YelpCamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
//reset
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'kel73896@gmail.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'YelpCamp',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campsites');
  });
});

//USER PROFILE
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, (err, user)=>{
    if (err) {
      console.log(err);
      req.flash("error", "something went wrong");
      return res.redirect("/campsites");
    }
    Campsite.find().where("author.id").equals(user._id).exec((err, campsites)=>{
      if (err) {
      console.log(err);
      req.flash("error", "something went wrong");
      return res.redirect("/campsites");
    }
      res.render("./user/show", {user: user, campsites: campsites});
    });
  });
});
//user settings
router.get("/users/:id/settings",middleware.checkUser, function(req, res){
  User.findById(req.params.id, (err, user)=>{
    if (err) {
      req.flash("error", "user does not exist")
      res.redirect("/campsites")
    } else{
      res.render("settings",{user:user})
    }
  })
})
router.get("/users/:id/settings/password",middleware.checkUser, function(req, res, next){
    async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.user.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'kel73896@gmail.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'YelpCamp',
        subject: 'YelpCamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/users/'+req.params.id+'/settings');
  });
});
router.get("/user/:id/settings/delete",middleware.checkUser, (req, res)=>{
  User.findByIdAndRemove(req.params.id, (err, user)=>{
    if (err) {
      req.flash("error", "something went wrong")
      return res.redirect("/campsites")
    }
    cloudinary.v2.uploader.destroy(user.avatarId);
    req.logout();
    req.flash("error", "permanently deleted " + user.username)
    res.redirect("/login")
  });
});
router.get("*", (req, res)=>{
  req.flash("error", "Page not found")
  res.redirect("/campsites")
})
module.exports = router;
//--setup--
const express = require("express"),
app           = express(),
bodyParser    = require("body-parser"),
mongoose      = require("mongoose"),
Campsite      = require("./models/campsite"),
Comment       = require("./models/comment"),
User          = require("./models/user"),
seedDB        = require("./seeds"),
passport = require("passport"),
localStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
expressSession = require("express-session");
      

//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://jethrosama:undeadban07@master-2viyl.mongodb.net/YelpCamp?retryWrites=true&w=majority");
//bodyparser
app.use(bodyParser.urlencoded({extended:true}));
//express
app.use(express.static("public"));
app.set("view engine", "ejs");

//seedDB();

//Passport Auth setup
app.use(expressSession({
  secret: "Metamorphosis",
  resave: false,
  saveUninitialized: false
}));

passport.use(new localStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
});
//--routes--
  //homepage
  app.get("/", (req, res)=>{
    res.redirect("/campsites");
  });
  //campsites index
  app.get("/campsites", (req, res)=>{
    //grab campsites from db
    Campsite.find({}, function(err, data){
      if(err){
        console.log(err);
      } else{
        //send the data to campsites.ejs
        res.render("campsites/index", {campsites:data});
      }
    });
  });
  //New 
  app.get("/campsites/new", isLoggedIn,(req, res)=>{
    res.render("campsites/new");
  });
  //Create
  app.post("/campsites", (req, res)=>{
      //grab data from form
    const name = req.body.name,
          image = req.body.image,
          desc = req.body.description;
    const campsite = {name: name, image: image, description: desc};
      //add to database
      Campsite.create(campsite, function(err, data){
    if(err){
      console.log(err);
    } else{
      //redirect to campsites
      res.redirect("/campsites");
    }
  });
});
      //SHOW
      app.get("/campsites/:id", (req, res)=>{
         const id = req.params.id;
         Campsite.findById(id).populate("comments").exec((err, data)=>{
           if(err){
             console.log(err);
           } else{
             res.render("campsites/show", {campsite: data});
           }
         });
      });
//--------------
//comments route
//--------------
    //new
app.get("/campsites/:id/comments/new", isLoggedIn, (req, res)=>{
  Campsite.findById(req.params.id, (err, campsite)=>{
    if (err) {
      console.log(err);
    } else{
      res.render("comments/new", {campsite: campsite});
    }
  });
});
    //create
app.post("/campsites/:id/comments",isLoggedIn, (req, res)=>{
  Campsite.findById(req.params.id, (err, campsite)=>{
    if (err) {
      console.log(err);
    } else{
      Comment.create(req.body.comment, (err, comment)=>{
        if (err) {
          console.log(err);
        } else{
          campsite.comments.push(comment);
          campsite.save((err)=>{
            if (err) {
              console.log(err);
            } else{
              res.redirect("/campsites/" + campsite._id);
            }
          });
        }
      });
    }
  });
});
//---------------------
//Authentication routes
//---------------------

//---register---
//render registration page
app.get("/register", (req, res)=>{
  res.render("register");
});
//register user logic
app.post("/register", (req, res)=>{
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, data)=>{
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, ()=>{
      res.redirect("/campsites");
    });
  });
});
//-----login-----
//render login
app.get("/login", (req, res)=>{
  res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campsites",
  failureRedirect: "/login"
}), (req, res)=>{
});

//-----logout-----
app.get("/logout", (req, res)=>{
  req.logout();
  res.redirect("/campsites");
});


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//--server--
app.listen(3000, ()=>{
  console.log("server started at http://localhost:3000");
});
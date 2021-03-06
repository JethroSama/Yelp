require('dotenv').config()
//--setup--
const express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Campsite = require("./models/campsite"),
Comment = require("./models/comment"),
User = require("./models/user"),
seedDB = require("./seeds"),
flash = require("connect-flash"),
passport = require("passport"),
localStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
expressSession = require("express-session"),
methodOverride = require("method-override");


//---requiring routes----
const campsiteRoutes = require("./routes/campsites"),
commentRoutes = require("./routes/comments"),
indexRoutes = require("./routes/index");

//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://jethrosama:undeadban07@master-2viyl.mongodb.net/YelpCamp?retryWrites=true&w=majority");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
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
//data of current user pass in all routes
app.use((req , res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//routes
app.use("/campsites/:id/comments", commentRoutes);
app.use("/campsites", campsiteRoutes);
app.use("/", indexRoutes);
//--server--
app.listen(process.env.PORT || 80, ()=>{
  console.log("server started");
});
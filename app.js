let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let express = require("express");
let session = require("express-session");
let morgan = require("morgan");
let passport = require("passport");
let Strategy = require("passport-facebook").Strategy;

passport.use(new Strategy({
    clientID: "2011663825736984",
    clientSecret: "be1356af343e679c6dcd078093cb7c0c",
    callbackURL: "https://learning-passport-js.herokuapp.com/login/facebook/return"
}, (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

let app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "gk43ff2hhhsbm652kjlk21682768787687", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/",
    (req, res) => {
        res.render("home", { user: req.user });
    });

app.get("/login",
    (req, res) => {
        res.render("login");
    });

app.get("/login/facebook",
    passport.authenticate("facebook"));

app.get("/login/facebook/return",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/");
    });

app.get("/profile",
    require("connect-ensure-login").ensureLoggedIn(),
    (req, res) => {
        res.render("profile", { user: req.user });
    });

app.listen(process.env.PORT || 80);
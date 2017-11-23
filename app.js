let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let express = require("express");
let session = require("express-session");
let morgan = require("morgan");
let passport = require("passport");
let FacebookStrategy = require("passport-facebook").Strategy;
let GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new FacebookStrategy({
    clientID: "1446458398805750",
    clientSecret: "f354532384e5b3c37309a2496ee20c3d",
    callbackURL: "https://learning-passport-js.herokuapp.com/login/facebook/return"
}, (accessToken, refreshToken, profile, callback) => {
    return callback(null, profile);
}));

passport.use(new GoogleStrategy({
    clientID: "456795005039-o89i1cn0kqdii8ie5urono1oli31lcc9.apps.googleusercontent.com",
    clientSecret: "8_wdc_EsgykuWTdnMqYASVop",
    callbackURL: "https://learning-passport-js.herokuapp.com/login/google/return"
}, (accessToken, refreshToken, profile, callback) => {
    return callback(null, profile);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
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

app.get("/login/google",
    passport.authenticate("google", { scope: ["profile"] }));

app.get("/login/facebook/return",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/");
    });

app.get("/login/google/return",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/");
    });

app.get("/profile",
    require("connect-ensure-login").ensureLoggedIn(),
    (req, res) => {
        res.render("profile", { user: req.user });
    });

app.listen(process.env.PORT || 80);
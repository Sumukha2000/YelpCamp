var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var flash=require("connect-flash")
var mongoose=require("mongoose");
var passport=require("passport");
var methodOverride=require("method-override")
var User=require("./models/user")
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
var seedDB=require("./seeds")
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes=require("./routes/index")
//seedDB(); 

mongoose.set('useUnifiedTopology', true);
var url= process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11"
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended:true}));
//app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(flash());

/*
Campground.create(
    {name:"sal hill",
    image:"/images/def.jpg",
    description:"This is a nice camp!"
},function(err, campground){
    if(err)
    {
        console.log(err);
    }else{
        console.log("Newly Created Campground");
        console.log(campground);
    }
}
);
*/
//PASSPORT CONFIG
app.use(require("express-session")(
    {
        secret:"Once again Rusty wins!",
        resave:false,
        saveUninitialized:false
    }
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function(req,res,next)
{
res.locals.currentUser=req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
next();
});

//requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server starTed")
});



var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware=require("../middleware/index.js")
router.get("/", function (req, res) {//get all cg from db

    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    })

    //res.render("campgrounds",{campgrounds:campgrounds});
});
//CREATE
router.post("/",middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price =req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name,price:price, image: image, description: description, author: author };
    //create a new cg and save to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {

            res.redirect("/campgrounds");
        }
    });



});
//NEW 
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

    //render show template


});
//EDIT CAMPGROUND ROUTE

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
   
        Campground.findById(req.params.id, function(err, foundCampground) {

                    res.render("campgrounds/edit", { campground: foundCampground });
        });
       
    });



//UPDATE

router.put("/:id", middleware.checkCampgroundOwnership,function (req, res) {
    //find and update
    var data = {}
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });


})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership ,function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
})





module.exports = router;
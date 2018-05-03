require('dotenv').load();
const express = require('express');
const router = express.Router();
const userCtrl = require('../models/Db_controllers/userCtrl');

const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model('UserModel');

//required for authentication of API routes
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

// create a user a new user
var testUser = new User();
testUser.email = 'valtteri.kukkola@gmail.com';
testUser.name = 'vade';
testUser.setPassword("testpassword");
//testUser.save();
//console.log(testUser);

router.post("/login",function(req,res){
    if(!req.body.username || !req.body.password){
        res.status(400);
        res.json({"message": "All fields required"});
        return;
    }
    passport.authenticate("local", function(err,user,info){
        var token;
        if (err) {
            console.log(err);
            res.status(404);
            res.json(err);
            return;
        }
        if(user){
            console.log(user);
            token = user.generateJwt();
            res.status(200);
            res.json({"token":token});
        } else {
            console.log(info);
            res.status(401);
            res.json(info);
        }
    })(req,res);
});


//returns the user details of parameter user. Requires authentication
router.get('/:id',auth, function(req,res){
    const userId = req.params.id;

    userCtrl.findUser(userId).then((user)=>{
        res.status(200);
        res.json(user);
    }).catch((err)=>{
        console.log(err);
        res.status(400);
        res.json(err);
    });
});

module.exports = router;

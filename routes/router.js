const express = require('express');
const router = express.Router();
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');

router.post("/signup",
  [
      check("user", "Please Enter a Valid Name").not().isEmpty(),
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").not().isEmpty()
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.json({
              errors: errors.array()
          });
      }

      const {
          user,
          email,
          password
      } = req.body;
      try {
          let user = await User.findOne({
            email
          });
          if (user) {
              return res.json({
                  msg: "User Already Exists"
              });
          }

          user = new User({
              user: req.body.user,
              email: req.body.email,
              password: req.body.password
          });

          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);

          await user.save();

          const payload = {
              user: {
                  id: user.id
              }
          };

          jwt.sign(
              payload,
              "randomStringToMakeThatReallyHardToHashRandomly", {
                  expiresIn: 3600000 * 6
              },
              (err, token) => {
                  if (err) throw err;
                  return res.status(200).json({
                      token, user
                  });
              }
          );
      } catch (err) {
          console.log(err.message);
          return res.json({
            msg: "Error in Saving"
        });
      }
  }
);

router.post("/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.json({
          msg: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({
          msg: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomStringToMakeThatReallyHardToHashRandomly", {
          expiresIn: 3600000 * 6
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token, user
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.json({
        msg: "Server Error"
      });
    }
  }
);
  
router.post('/logout', function (req, res, next) {
    return res.send('/Logging');
  });

router.post('/addSchedule', function (req, res, next) {
   User.find({_id: req.body.userID}).then(function(user){
    const newData = User.updateOne({"_id": user[0]._id}, {$push: {"schedule":{googleId:req.body.googleId,date:req.body.date,updated:req.body.updated,updatedContent:req.body.updatedContent,scheduleContent:req.body.scheduleContent,start:req.body.start,end:req.body.end,hours:req.body.hours,lunch:req.body.lunch}}, new: true})
      return newData
  }).then(function(data){
    return res.json(data)
  }).catch(function(err){
    throw err
  });
});

router.post('/updateItem', function (req, res, next) {
  User.find({_id: req.body.userID}).then(function(user){  
    for (let i = 0; i < user[0].schedule.length; i++){   
          if(user[0].schedule[i]._id == req.body.scheduleID){
            const newData = User.updateOne(
              {
                "schedule._id": user[0].schedule[i]._id,
              }, 
              {$set:
                {
                  "schedule.$.start":req.body.start,
                  "schedule.$.end":req.body.end,
                  "schedule.$.lunch":req.body.lunch,
                  "schedule.$.hours":req.body.hours,
                  "schedule.$.updatedContent":req.body.updatedContent,
                  "schedule.$.scheduleContent":req.body.scheduleContent
          }, new: true})
            return newData
          }      
   }
 }).then(function(data){
   return res.json(data)
 }).catch(function(err){
   throw err
 }); 
});

router.get('/AllSchedule/:query', function (req,res) {
  User.find({_id: req.params.query}).then(function(user){
    return res.json(user);
  })
});

router.post('/deleteSchedule', function(req, res) {
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$pull: {schedule:{_id:ObjectID(req.body.scheduleID)}}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});


module.exports = router;



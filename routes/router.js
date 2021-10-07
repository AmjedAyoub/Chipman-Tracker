const express = require('express');
const router = express.Router();
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');

// router.get('/', function (req, res, next) {
//   // return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
//   return true;
// });

// router.get('/Logging', function (req, res, next) {
//   return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
// });

// router.get('/Home', function (req, res, next) {
//   return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
// });

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

router.post('/addItems', function (req, res, next) {
   User.find({_id: req.body.userID}).then(function(user){
     let existItem=false;
    for (let i = 0; i < user[0].items.length; i++){
      if(user[0].items[i].name.toLowerCase() === req.body.name.toLowerCase()){
        // console.log(user[0].items[i].name.toLowerCase(),req.body.name.toLowerCase())
        existItem=true;
        const qty = parseFloat(user[0].items[i].quantity)
        const total = qty+parseFloat(req.body.quantity)
        // console.log(total,"      ",user[0].items[i].name)
        if(req.body.image==="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUW-NhL541eHkTOKzBjghAfFPz-D1FUHjNQ&usqp=CAU"){
          User.updateOne({"_id": user[0]._id, "items._id": user[0].items[i]._id}, {$set: {"items.$.quantity":total,"items.$.name":req.body.name,"items.$.unit":req.body.unit}, new: true}).then(function (params) {
            // console.log(params)
          }).catch(function (err) {
            throw err
          })
        }else{
            User.updateOne({"_id": user[0]._id, "items._id": user[0].items[i]._id}, {$set: {"items.$.quantity":total,"items.$.name":req.body.name,"items.$.unit":req.body.unit,"items.$.image":req.body.image}, new: true}).then(function (params) {
              // console.log(params)
            }).catch(function (err) {
              throw err
            })
        }}      
    }
    if(!existItem){
      const newData = User.updateOne({"_id": user[0]._id}, {$push: {"items":{name:req.body.name,quantity:req.body.quantity,unit:req.body.unit,image:req.body.image}}, new: true})
      return newData
    }
  }).then(function(data){
    return res.json(data)
  }).catch(function(err){
    throw err
  });
});

router.post('/cookItems', function (req, res, next) {
   User.find({_id: req.body.userID}).then(function(user){
    for (let i = 0; i < user[0].items.length; i++){
      if(user[0].items[i].name.toLowerCase() === req.body.name.toLowerCase()){
        const qty = parseFloat(user[0].items[i].quantity)
        const total = qty-parseFloat(req.body.quantity)
        const newData = User.updateOne({"_id": user[0]._id,"items.name": user[0].items[i].name}, {$set: {"items.$.quantity":total}, new: true})
        return newData
      }      
    }  
  }).then(function(data){
    return res.json(data)
  }).catch(function(err){
    throw err
  });  
});

router.post('/deleteItem', function(req, res) {
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$pull: {items:{_id:ObjectID(req.body.itemID)}}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/addRecipe', function(req, res) {
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$addToSet: {meals:{  
      id: req.body.id,
      image: req.body.image,
      title: req.body.title,
      readyInMinutes:req.body.readyInMinutes
    }}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/updateItem', function (req, res, next) {
  User.find({_id: req.body.userID}).then(function(user){  
    for (let i = 0; i < user[0].items.length; i++){   
          if(user[0].items[i]._id == req.body.itemID){
            const newData = User.updateOne(
              {
                "items._id": user[0].items[i]._id,
              }, 
              {$set:
                {
                  "items.$.name":req.body.name,
                  "items.$.quantity":req.body.quantity,
                  "items.$.unit":req.body.unit,
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

router.post('/deleteRecipe', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$pull: {meals:{_id:ObjectID(req.body.recipeID)}}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/cooking', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {cookingId:req.body.cookingId})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/finishTime', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {finishTime:req.body.finishTime})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/wash', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {washLoads:req.body.washLoads})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.get('/AllItems/:query', function (req,res) {
  User.find({_id: req.params.query}).then(function(user){
    return res.json(user);
  })
});

module.exports = router;



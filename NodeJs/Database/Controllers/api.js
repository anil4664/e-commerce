const express = require('express');
const router = express.Router();

var { User } = require('../Schema/User');

router.get('/',(req,res) => {
    console.log("listening at home");
    res.send("i am responding");
})

router.post('/register',(req, res) => {
    //console.log("in teh api.js file",req);
    let user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.mailId = req.body.email;
    user.password = req.body.password;
    User.findOne({mailId : req.body.email}, (err, existingUser) => {
        if(existingUser){
            res.json({
                success:false,
                message : 'Account already exists with the given mail id',
            });
        }
        else{
            user.save((err, doc) => {
                if(err)
                    console.log("error while saving"+JSON.stringify(err, undefined, 2));
                else{
                    res.send(doc);
                }
            });

        }
    });
});

router.post('/login',(req, res) => {
    console.log("request is:",req.body);
    User.findOne({ mailId:req.body.email }, (err, user) => {
        if(err){
            console.log("error is:",err);
        }
        else if(!user){
            res.json({
                success:false,
                message:'no user exists with the given mail id'
            });
        }
        else{
            var isPasswordValid = user.password==req.body.password;
            console.log("result from the search query is:",user);
            if(!isPasswordValid){
                res.json({
                    success:false,
                    message:'invalid password',
                });
            }
            else{
                res.json({
                    success:true,
                    message:'login successful',
                });
            }
        }
    });
});

module.exports = router;
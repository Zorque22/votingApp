const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userPoll = require('./models/userPoll.js')
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/userpolls', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.post('/signup', function(req,res){
  userPoll.findOne({email:req.body.email}).then(function(data){
    if(data){
      console.log('email already exists return error msg');
      console.log(data);
      res.json({'errorMessage':'Email address already signed up.'});
    } else {
      bcrypt.hash(req.body.password, 8, function(err, passwordHash){
        if(err){console.log('error = '+err);}
        var user = new userPoll({
          userName: req.body.username,
          email: req.body.email,
          password: passwordHash
        });

        user.save(function(err, data) {
          if(err){console.log('save>err: '+err);}
          res.json(data);
        });
      });
    }
  });
});
app.post('/login', function(req,res){
  // console.log('start: '+req.body.email);
  userPoll.findOne({email:req.body.email}).then(function(data){
    if(data){
      bcrypt.compare(req.body.password, data.password,function(err, passwordMatch) {
        // console.log('bcrypt.compare; data.password:'+data.password+'; req.body.password:'+req.body.password);
        // console.log('passwordMatch = '+passwordMatch);
					if (err) {
						res.status(500).send()
					}
					if (passwordMatch) {
						// console.log('password is a match, go on son!')
            res.json(data);
					} else {
            // console.log('unfortunately peanutbutter...')
            res.json({'errorMessage':'Unfortunately peanutbutter...'});
          }
				})
      // console.log('email already exists return error msg');
      // res.json({'errorMessage':'Email address already signed up.'});
    } else {
      // console.log('email not found go on and insert...');
      res.json({'errorMessage':'Email address does not have an account.'});
    }
  });
});
app.post('/submitpoll', function(req,res){
  userPoll.findOne({_id:req.body.id}).then(function(rec){
    rec.polls.push(req.body.poll);
    rec.save().then(function(err, rec){
      if(err){console.log(err);
      }
      console.log(req.body.poll.pollName);
      res.json({pollName:req.body.poll.pollName});
    });
  });

});
app.listen(process.env.port||3000, function(){
  console.log('Server running on port 3000...');
});

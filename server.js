const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userPoll = require('./models/userPoll.js')
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/userpolls', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');

app.post('/signup', function(req,res){
  userPoll.findOne({email:req.body.email}).then(function(data){
    if(data){
      res.json({'errorMessage':'Email address already signed up'});
      // res.status(401).send('Email address already bla bla');
    } else {
      bcrypt.hash(req.body.password, 8, function(err, passwordHash){
        if(err){
          console.log('error = '+err);
        }
        var user = new userPoll({
          userName: req.body.username,
          email: req.body.email,
          password: passwordHash
        });

        user.save(function(err, data) {
          res.json(data);
        });
      });
    }
  });
});
app.post('/login', function(req,res){
  userPoll.findOne({email:req.body.email}).then(function(data){
    if(data){
      bcrypt.compare(req.body.password, data.password,function(err, passwordMatch) {
					if (err) {
						res.status(500).send();
					}
					if (passwordMatch) {
            res.json(data);
					} else {
            res.json({'errorMessage':'Invalid password'});
          }
				})
    } else {
      res.json({'errorMessage':'Email address does not have an account.'});
    }
  });
});
app.post('/submitpoll', function(req,res){

  var pollName = req.body.poll.pollName;
  userPoll.findOne({polls:{$elemMatch:{pollName:pollName}}}).then(function(data){
    if(data){
        res.json({'errorMessage':'Poll already exists'});
     }
   });
  userPoll.findOne({_id:req.body.id}).then(function(rec){
    rec.polls.push(req.body.poll);
    var pollName = rec.polls[rec.polls.length-1].pollName;
    var pollId = rec.polls[rec.polls.length-1]._id;
    rec.save().then(function(err, data){
      res.json({pollName:pollName, pollId:pollId});
    });
  });

});
app.get('/poll/:pollName', function(req, res){
 var pollName = req.params.pollName;
 userPoll.findOne({polls:{$elemMatch:{pollName:pollName}}}).then(function(data){
   if(data){
    for(var i=data.polls.length-1;i>=0;i--){
       if(data.polls[i].pollName != pollName){
         data.polls.splice(i,1);
       }
     }
     res.render('poll', {pollData:data})
   } else {
     res.json({'errorMessage':'Whoooaaaaaaaaa...'});
   }
 });
})
app.post('/deletepoll', function(req, res){
  userPoll.findOne({polls:{$elemMatch:{_id:req.body.pollId}}}).then(function(data){
    if(data){
      var polls = data.polls.filter(function(elem){
        return elem._id != req.body.pollId;
      });
      data.polls = polls;
      data.save();
      res.json(data);
    } else {
      res.json({'errorMessage':'Whoooaaaaaaaaa...'});
    }
  });
});

// to do use $set for update and increment option for voteCount
app.post('/vote/:pollName', function(req, res){
  var pollName = req.params.pollName;
  var option = req.body;

  if(option==''){
    res.status(500).send();
  }
  userPoll.findOne({polls:{$elemMatch:{pollName:req.params.pollName}}}).then(function(data){
    for (var i=0;i<data.polls.length;i++){
      if(data.polls[i].pollName == pollName){
        for(var j=0;j<data.polls[i].options.length;j++){
          if(data.polls[i].options[j].description == option.option){
            data.polls[i].options[j].voteCount++;
            data.save().then(function(data){

              for(var i=data.polls.length-1;i>=0;i--){

                 if(data.polls[i].pollName != pollName){
                   data.polls.splice(i,1);
                 }
               }
              res.render('pollResult', {pollName:data.polls[0].pollName, pollOptions:data.polls[0].options});
            });
          }
        }
      }
    }
  });
})
app.listen(process.env.PORT||3000, function(){
  console.log('Server running on port 3000...');
});

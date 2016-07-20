// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    auth = require('./resources/auth'),
    User = require('./models/user'),
    Post = require('./models/post'),
    google = require('google')


// require and load dotenv
require('dotenv').load();


// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// set up models
var db = require('./models');


/*
 * API Routes
 */

app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    res.send(user.populate('posts'));
  });
});

app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found.' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.send(user.populate('posts'));
    });
  });
});

app.post('/api/leads', function (req, res) {
    console.log("posting to leads API")




    req.body.leads.forEach(function(lead){


      // Google Scraper

      google.resultsPerPage = 5

      var query = "linkedin " + lead.firstName + " " + lead.lastName
      console.log(query)
      google(query, function (err, res){
        if (err) console.error(err)

        var link = res.links[0];

        lead.jobTitle = link.body

        
        console.log("link.body:", link.body);
        console.log("lead.jobTitle:", lead.jobTitle);


      })

      // End Google Scraper


      var newLead = new db.Lead({

        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        location: lead.location,
        jobTitle: lead.jobTitle,
        company: lead.company

      });

      console.log(newLead.jobTitle)

      newLead.save(function(err){
        // if (err) {
        //   console.log("save error: " + err);
        //   res.send('ERROR');
        // }
        // else {
        //   console.log("saved ", lead.firstName);
        //   res.send("SUCCESS!")
        // }
      });
    });


});


app.get('/api/leads', auth.ensureAuthenticated, function (req, res) {
    console.log("getting from leads API")

});



/*
 * Auth Routes
 */

app.post('/auth/signup', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }
    var user = new User({
      displayName: req.body.displayName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: auth.createJWT(result) });
    });
  });
});

app.post('/auth/login', function (req, res) {
  User.findOne({ email: req.body.email }, '+password', function (err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email or password.' });
      }
      res.send({ token: auth.createJWT(user) });
    });
  });
});



/*
 * Catch All Route
 */
app.get('*', function (req, res) {
  res.render('index');
});


/*
 * Listen on localhost:3000
 */
app.listen(9000, function() {
  console.log('server started');
});

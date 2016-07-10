// require express and other modules
var express = require('express'),
    app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var me = {name: "Charlie Fish", github_link: "https://github.com/fishcharlie", github_profile_image: "https://avatars2.githubusercontent.com/u/860375?v=3&s=460", current_city: "Denver", pets: [{name: "Oliver", type: "Dog", color: "Golden"}, {name: "Annie", type: "Cat", breed: "Dark Gray"}, {name: "Howie", type: "Cat", breed: "Dark Gray"}]};

/************
 * DATABASE *
 ************/

 var db = require('./models');


/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */
//DONE Documented
app.get('/api/profile', function (req, res) {
 res.json(me);
});
//DONE Documented
app.post('/api/destinations', function (req, res) {
  var new_destination = req.body;
  console.log(req.body);
  console.log(req.headers);
  db.Destination.create(new_destination, function(err, destination){
    if (err){
      res.send("Error: "+err);
    }
    res.json(destination);
  });
});
//DONE Documented
app.get('/api/destinations', function (req, res) {
  db.Destination.find({}, function(err, destinations) {
    res.json(destinations);
  });
});
//DONE Documented
app.get('/api/destinations/:title', function (req, res) {
  var title = req.params.title;
  console.log(title);
  db.Destination.find({location: title}, function(err, destinations) {
    res.json(destinations);
  });
});
//DONE Documented
app.put('/api/destinations/:title', function (req, res) {
  var title = req.params.title;
  var body = req.body;
  db.Destination.findOne({location: title}, function(err, destinations) {
    if(req.body.rating!==undefined) {
      destinations.rating = req.body.rating;
    }
    if(req.body.haveBeen!==undefined) {
      destinations.haveBeen = req.body.haveBeen;
    }
    if(req.body.location!==undefined) {
      destinations.location = req.body.location;
    }
    destinations.save();
    res.json(destinations);
  });
});
//Done
app.delete('/api/destinations/:title', function (req, res) {
  var title = req.params.title;
  db.Destination.remove({location: title}, function(err, destinations) {
    if (err) res.send(err);
    res.json({message: 'Successfully deleted'});
  });
});



app.get('/api', function api_index(req, res) {
  // TODO: Document all your api endpoints below
  res.json({
    message: "Welcome to my personal api! Here's what you need to know!",
    documentation_url: "https://github.com/example-username/express_self_api/README.md", // CHANGE ME
    base_url: "http://YOUR-APP-NAME.herokuapp.com", // CHANGE ME
    endpoints: [
      {method: "GET", path: "/api", description: "API Documentation"},
      {method: "GET", path: "/api/profile", description: "My Profile (name, github link, profile image, current city, and my pets)"},
      {method: "GET", path: "/api/destinations", description: "List all destinations"},
      {method: "POST", path: "/api/destinations", description: "Create new destination"},
      {method: "GET", path: "/api/destinations/:location", description: "Find destination with location"},
      {method: "PUT", path: "/api/destinations/:location", description: "Update destination while finding location"},
      {method: "DELETE", path: "/api/destinations/:location", description: "Delete destination"}
    ]
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});

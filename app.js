
/**
 * Module dependencies.
 */


db = require('./db');
// config = require('./sensitive.config');
var dotenv = require('dotenv');
dotenv.load();

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var https = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
// var stripe = require("stripe")(config.stripePublicKey);
var stripe = require("stripe")(process.env.stripePublicKey);

app.use(express.cookieParser('secret'));

// redirect to https
function redirectSec(req, res, next) {
        if (req.headers['x-forwarded-proto'] == 'http') { 
            res.redirect('https://' + req.headers.host + req.path);
        } else {
            return next();
        }
    }

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(express.favicon());

// uploaded files goes to uploads directory
app.use(express.bodyParser());

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// allows https redirection
app.get('/', redirectSec, routes.index);
//app.get('/', routes.index);
app.get('/harvard', routes.harvard);
app.get('/about', routes.about);
app.get('/yourguide', routes.yourguide);
app.post('/submitSuggestion', db.submitSuggestion);
app.post('/saveEmail', db.saveEmail);
app.get('/purchased', routes.purchased);

// delete  line below later b/c useless --- just for reference
app.get('/users', user.list);


// STRIPE
app.post('/charge', function(req, res){
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://manage.stripe.com/account
	//stripe.setApiKey(config.stripeSecretKey);
	stripe.setApiKey(process.env.stripeSecretKey);

	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form
	var stripeToken = req.body.stripeToken;
	
	var charge = stripe.charges.create({
	  amount: 500, // amount in cents, again
	  currency: "usd",
	  card: stripeToken,
	  description: "payinguser@example.com"
	}, function(err, charge) {
	  if (err && err.type === 'StripeCardError') {
	    // The card has been declined
	  }
	});

	var twentyMin = 60 * 1000 * 20;
  	res.cookie('remember', 1, { maxAge: twentyMin });

	res.redirect("/purchased");
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

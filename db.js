var dotenv = require('dotenv');
dotenv.load();

var mongoose = require('mongoose');
//var uristring = config.mongoUriString;
var uristring = process.env.mongoUriString;


mongoose.connect(uristring, function (err, db) {
  console.log ('Succeeded connected to: ' + uristring);
  if (err) {throw err;}
});

var db = mongoose.connection;


//////////////////////////////////////////////////////////////////////////////////////////

// suggestions
var suggestionSchema = mongoose.Schema({
    content    : String,
    updated_at : Date
}) 
 
var Suggestion = mongoose.model( 'Suggestion', suggestionSchema );


// create a suggestion
exports.submitSuggestion = function(req, res){

    var suggestion = new Suggestion({
        content    : req.body.suggest,
        updated_at : Date.now()   
    });

    suggestion.save(function (err) {
        if (!err) {
            return res.send(suggestion);        
        } else {
            console.log(err);
            return res.send(404, { error: "Suggestion was not saved." });
        }
    });

    return res.send(suggestion);
}

//////////////////////////////////////////////////////////////////////////////////////////

// save email
var emailSchema = mongoose.Schema({
    content    : String,
    updated_at : Date
}) 
 
var Email = mongoose.model( 'Email', emailSchema );

exports.saveEmail = function(req, res){
    var email = new Email({
        content    : req.body.EMAIL,
        updated_at : Date.now()   
    });

    email.save(function (err) {
        if (!err) {
            return res.send(email);
        } else {
            console.log(err);
            return res.send(404, { error: "Email was not saved." });
        }
    });

    return res.send(email);
}

//////////////////////////////////////////////////////////////////////////////////////////


var userSchema = mongoose.Schema({
    name        : String,
    email       : String,
    password    : String,
    updated_at  : Date 
}) 
 
var User = mongoose.model( 'User', userSchema );

exports.signup = function(req, res){

    var user = new User({
        name        : req.body.name,
        email       : req.body.email,
        password    : req.body.password,
        updated_at  : Date.now()   
    });

    user.save(function (err) {
        if (!err) {
            return res.send(user);
        } else {
            console.log(err);
            return res.send(404, { error: "User info was not saved." });
        }
    });

    return res.send(user);

}

exports.login = function(req, res){

}
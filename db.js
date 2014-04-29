var dotenv = require('dotenv');
dotenv.load();

var crypto = require('crypto');
var bcrypt   = require('bcrypt-nodejs');

var mongoose = require('mongoose');
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


/////////////////////////////////////////////////////////////////////////


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


////////////////////////  GUIDE EDITING/UPLOADING RELATED    ///////////////


// save email
var guideSchema = mongoose.Schema({
    //maybe needs to be different
    guide       : Buffer,
    //authorEmail : String,
    //author    : String,
    // description  : String,
    // photo: ?,
    // title: String,
    // pages: 
    // price: 
    // 
    updated_at : Date
}) 
 
var Guide = mongoose.model( 'Guide', guideSchema );

exports.uploadguide = function(req, res){

    var guide = new Guide({
        // TODO: add parts
        guide    : req.body,
        updated_at : Date.now()   
    });

    guide.save(function (err) {
        if (!err) {
            return res.send(guide);
        } else {
            console.log(err);
            return res.send(404, { error: "Guide was not saved." });
        }
    });


    console.log(db.collection("users").find({ email: "ejim@gmail.com" }));


    // save guide id to user document
    // save email from session
    db.collection("users").update(
        { "local.email": "ejim@gmail.com" },
        { $push: { guidearray: guide.id } }, 
        function (err, result) {
            if (err) throw err;
        });


}

////////////////////////   DASHBOARD RELATED     ////////////////


var dotenv      = require('dotenv');
dotenv.load();
var crypto      = require('crypto');
var bcrypt      = require('bcrypt-nodejs');
var mongoose    = require('mongoose');
var uristring   = process.env.mongoUriString;
var fs          = require('fs');

mongoose.connect(uristring, function (err, db) {
  console.log ('Succeeded connected to: ' + uristring);
  if (err) {throw err;}
});

var db          = mongoose.connection;


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


////////////////////////  GUIDE EDITING/UPLOADING send    ///////////////


// save email
var guideSchema = mongoose.Schema({
    //TODO: add parts
    guidePath       : String,
    authorEmail : String,
    //author    : String,
    // description  : String,
    // photo: ?,
    // title: String,
    // pages: 
    // price: 
    updated_at : Date
}) 
 
var Guide = mongoose.model( 'Guide', guideSchema );


exports.uploadguide = function(req, res){

    // get the temporary location of the file
    var tmp_path = req.files.guide.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    //TODO: create some unique identifier as the file path addendum, not the guide name, 
            //TODO: which isn't necessarily unique
    var target_path = './public/guideuploads/' + req.files.guide.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.guide.size + ' bytes');
        });
    });


    var guide = new Guide({
        // TODO: add parts
        guidePath    : target_path,
        authorEmail : "ejim@gmail.com",
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

    // save guide id to user document
    // save email from session
    db.collection("users").update(
        { "local.email": "ejim@gmail.com" },
        { $push: { guidearray: guide.id } }, 
        function (err, result) {
            if (err) throw err;
        });

    res.redirect('/guide');


}

exports.downloadguide = function(req, res){
    res.download(db.collection("guides").find({authorEmail: "ejim@gmail.com"}));
}


////////////////////////   DASHBOARD RELATED     ////////////////


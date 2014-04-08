
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index.html', { title: 'Express' });
};

exports.harvard = function(req, res){
  res.render('harvard.html', { title: 'Express' });
};

exports.about = function(req, res){
  res.render('about.html', { title: 'Express' });
};

exports.yourguide = function(req, res){
  res.render('yourguide.html', { title: 'Express' });
};

exports.purchased = function(req, res){
	if (req.cookies.remember) {
  		res.render('purchased.html', { title: 'Express' });
	} else {
		res.redirect("/");
	}
};
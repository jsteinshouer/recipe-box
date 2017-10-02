var jwt = require('jwt-simple');
var tokenSecret;
var tokenTtl;
var config;

exports.configure = function(params) {
    config = params.config;
    tokenSecret = config.tokenSecret;
    tokenTtl = config.tokenTtl || 60;
};

/* Redirect to SSL */
exports.sslRedirect = function(req,res,next) {
    if (req.headers['x-forwarded-proto'] === 'http') { 
        res.redirect('https://' + req.headers.host + req.path);
    } else {
        return next();
    }
};

exports.grantToken = function(req,res) {
	var timestamp = new Date();
	var payload = {id: req.user.id, ts:  timestamp};
	var token = jwt.encode(payload,tokenSecret);
	return res.json({token: token});
};

exports.validateToken = function(req,res,next) {
	var accessToken = req.get('auth-token') || req.query.authToken || '';

	try {
		var data = jwt.decode(accessToken,tokenSecret);

		var currentTs = new Date();
		var tokenTs = new Date(data.ts);
		
		/* Check if token has expired. ttl is in minutes */
		if (Math.round((currentTs - tokenTs)/1000/60) <= tokenTtl) {
			req.userid = data.id;
			return next();
		}
	}
	catch (err) {
		//console.log(err);
	}

	res.statusCode = 401;
	return res.json({msg: "Unauthorized"});
};
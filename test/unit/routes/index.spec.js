describe( "Routes/Index.js: ", function(){

	var jwt = require('jwt-simple');
	var config = require("../../../config");
	var routes = require('../../../routes');
	var tokenSecret = config.tokenSecret;
	var tokenTtl = config.tokenTtl;
	var req = {};
	var res = {};
	var testToken;
	var util = require('util');

	routes.configure({config: config});

	beforeEach(function(done) {
		req = {
			get: function(item) {
				return this[item];
			},
			set: function(item,value) {
				this[item] = value;
			}
		};
		res = {
			json: function(obj) {
				return JSON.stringify(obj);
			}
		};

		testToken = jwt.encode({id: 'testuser', ts:  new Date()},tokenSecret);

		done();
	});

	it( "grantToken should return an access token", function(done){
		/* Mock the request */
		req.user = {id: 'testuser'};

		var result = JSON.parse(routes.grantToken(req,res));

		expect(result.token).toBeDefined();
		expect(jwt.decode(result.token,tokenSecret).id).toBe('testuser');
		done();
	});

	it( "validateToken should call next if the token is valid", function(done){
		var next = jasmine.createSpy('next');
		req.set('auth-token',testToken);

		routes.validateToken(req,res,next);

		expect(next).toHaveBeenCalled();
		done();
	});

	it( "validateToken should return status 401 for an invalid token", function(){
		res.statusCode = 200;
		var next = jasmine.createSpy('next');

		var invalidToken = jwt.encode({id: 'testuser', ts:  new Date()},"invalidsecretkey");

		req.set('auth-token',invalidToken);
		routes.validateToken(req,res,next);

		expect(res.statusCode).toBe(401);
		expect(next).not.toHaveBeenCalled();
	});

	it( "validateToken should return status 401 for an expired token", function(){
		res.statusCode = 200;

		var next = jasmine.createSpy('next');

		var current = new Date();
		var old = new Date(current - 130 * 60 * 1000);

		var expiredToken = jwt.encode({id: 'testuser', ts:  old},tokenSecret);

		req.set('auth-token',expiredToken);

		routes.validateToken(req,res,next);

		expect(res.statusCode).toBe(401);
		expect(next).not.toHaveBeenCalled();

	});

});
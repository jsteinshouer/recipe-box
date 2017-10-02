	describe("Users Model Tests", function() {

	var config = require("../../../config");
	var mongoose = require("mongoose");
	try {
		mongoose.connect(config.mongo.url);
	}
	catch(err) {
		console.log(err.msg);
	}
	var users = require("../../../model/users");
	users.configure({mongoose: mongoose});
	var User = mongoose.model('User');

	beforeEach(function(done) {
		/* remove existing users from the test database */
		User.remove(function() {
			users.create("testuser","testpassword","test@localdomain.local", function(err) {
				done();
			});
		});
	});

	it("users.create should create a new user", function(done) {
		users.create("testuser2","testpassword","test@localdomain.local", function(err) {
			expect(err).toBeUndefined();
			done();
		});
	});

	it("users.read should return a valid document", function(done) {
		users.read("testuser", function(err,user) {
			expect(err).toBe(null);
			expect(user.email).toBe("test@localdomain.local");
			done();
		});
	});

	it("users.authenticate should return true for correct password", function(done) {
		users.authenticate("testuser","testpassword", function(err,user) {
			expect(err).toBe(null);
			expect(user.id).toBe("testuser");
			done();
		});
	});

	it("users.authenticate should return false for incorrect password", function(done) {
		users.authenticate("testuser","testzzz", function(err,result) {
			expect(err).toBe(null);
			expect(result).toBe(false);
			done();
		});
	});


});
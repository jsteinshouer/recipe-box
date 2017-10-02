describe("Recipes Integration Tests", function() {

	var request = require('request');
	var util = require('util');
	var app = require('../../app');
	var config = require('../../config');
	var mongoose = require("mongoose");
	var users = require("../../model/users");
	var User = mongoose.model('User');
	var testRecipe;
	var token;

	beforeEach(function(done) {
		/* remove existing users from the test database */
		User.remove(function() {
			users.create("testuser","testpassword","test@localdomain.local", function(err) {
				done();
			});
		});
	});

	beforeEach(function(done) {
		testRecipe = {
			title: 'My Test Recipe',
			description:'', 
			ingredients:'1 tsp sugar',
			directions:'bake at 350 for 15 minutes',
			tags:['tag1','tag2']
		};

		request.post(
			{
				uri: 'http://' + config.host + ':' + config.port + '/authorize',
				json: {username: 'testuser', password: 'testpassword'}
			},
			function(error, response, body){
				token = body.token;
				done();
			}
		);

	});

	it("DEL /recipes/my-test-recipe should delete the test recipe if it exists or send a 404 status if it does not", function(done) {
		request.del({	
			uri: 'http://' + config.host + ':' + config.port + '/recipes/my-test-recipe',
			headers: {'auth-token': token}
		},
		function(error,response, body){
			expect(response.statusCode === 404 || response.statusCode === 200).toBe(true);
			done();
		});
	});

	it("POST /recipes should create a new recipe and return status 201 Created", function(done) {
		request.post(
			{
				uri: 'http://' + config.host + ':' + config.port + '/recipes',
				headers: {'auth-token': token},
				json: testRecipe
			},
			function(error, response, body){
				expect(response.statusCode).toBe(201);
				done();
			}
		);
	});

	it("POST /recipes invalid request should return status 400 Bad Request", function(done) {
		
		delete testRecipe['ingredients'];
		request.post(
			{
				uri: 'http://' + config.host + ':' + config.port + '/recipes',
				headers: {'auth-token': token},
				json: testRecipe
			},
			function(error, response, body){
				expect(response.statusCode).toBe(400);
				done();
			}
		);
	});
  
	it("GET /recipes should have an at least 1 item in the collection", function(done) {
		request.get({

			uri: 'http://' + config.host + ':' + config.port + '/recipes',
			headers: {'auth-token': token}
		},
		function(error, response, body){
			var recipes = JSON.parse(body);
			expect(recipes.items.length).toBeGreaterThan(0);
			done();
		});
	});

	it("GET /recipes/my-test-recipe should be equal to our test recipe", function(done) {
		request.get({
			uri: 'http://' + config.host + ':' + config.port + '/recipes/my-test-recipe',
			headers: {'auth-token': token}
		},
		function(error, response, body){
			var recipe = JSON.parse(body);
			expect(response.statusCode).toBe(200);
			expect(recipe.title).toBe(testRecipe.title);
			expect(recipe.description).toBe(testRecipe.description);
			expect(recipe.ingredients).toBe(testRecipe.ingredients);
			expect(recipe.directions).toBe(testRecipe.directions);
			expect(recipe.tags).toContain('tag1');
			expect(recipe.tags).toContain('tag2');
				done();
		});
	});

	it("PUT /recipes it should update a recipe and return a status 200 OK", function(done) {
		testRecipe.directions = 'Bake at 400 for 25 minutes';

		request.put(
			{
				uri: 'http://' + config.host + ':' + config.port + '/recipes/my-test-recipe',
				headers: {'auth-token': token},
				json: testRecipe
			},
			function(error, response, body){
				expect(response.statusCode).toBe(200);
				done();
			}
		);
	});

	it("GET /recipes/my-test-recipe should now be modifed", function(done) {
		request.get({
			uri: 'http://' + config.host + ':' + config.port + '/recipes/my-test-recipe',
			headers: {'auth-token': token}
		}, 
		function(error, response, body){
			var recipe = JSON.parse(body);
			expect(response.statusCode).toBe(200);
			expect(recipe.title).toBe(testRecipe.title);
			expect(recipe.directions).not.toBe(testRecipe.directions);
			done();
		});
	});

		it("DEL /recipes/my-test-recipe should delete the test recipe and return 200 OK", function(done) {
		request.del({
			uri: 'http://' + config.host + ':' + config.port + '/recipes/my-test-recipe',
			headers: {'auth-token': token}
		},
		function(error,response, body){
			expect(response.statusCode).toBe(200);
			done();
		});
	});

});


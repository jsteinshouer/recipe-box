describe("Recipes Model Tests", function() {
	var config = require("../../../config");
	var util = require('util');
	var mongoose = require("mongoose");
	try {
		mongoose.connect(config.mongo.url);
	}
	catch(err) {
		console.log(err.msg);
	}
	var recipes = require("../../../model/recipes");
	recipes.configure({mongoose: mongoose});

	var Recipe = mongoose.model('Recipe');

	describe("Recipes CRUD Tests", function() {


		var testRecipe = {
			title: 'Instant Grits',
			description:'My mama\'s old fashion instant grits recipe', 
			ingredients:'1 package instant grits\n Some water',
			directions:'Combine instant grits with water\n Microwave for 2 minutes',
			user: 'testuser',
			tags:['tag1','tag3']
		};

		beforeEach(function(done) {
			/* Remove all receipes and create a test */
			Recipe.remove(function() {
				recipes.create(
					testRecipe.title,
					testRecipe.description,
					testRecipe.ingredients,
					testRecipe.directions,
					testRecipe.tags,
					testRecipe.user,
					function(data) {
						done();
					}
				);
			});
		});

		it("recipes.read should return null because it does not exist", function(done) {
			recipes.read("instant-grits-zzz", function(err,recipe) {
				expect(err.msg).toBe('Not Found');
				expect(recipe).toBe(null);
				done();
			});
		});

		it("recipes.create should add a recipe to the collection", function(done) {
			recipes.create(
				'My Test Recipe',
				testRecipe.description,
				testRecipe.ingredients,
				testRecipe.directions,
				testRecipe.tags,
				testRecipe.user,
				function(data) {
					expect(data.msg).toBe(undefined);
					expect(data.key).toBe('my-test-recipe');
					done();
				}
			);
		});

		it("recipes.read should return a valid recipe", function(done) {
			recipes.read("instant-grits", function(err,recipe) {
				expect(err).toBe(null);
				expect(recipe.title).toBe("Instant Grits");
				done();
			});
		});

		it("recipes.update should update the recipe in the collection", function(done) {
			testRecipe.tags.push("Side Dish");

			recipes.update(
				"instant-grits",
				testRecipe.title,
				testRecipe.description,
				testRecipe.ingredients,
				testRecipe.directions,
				testRecipe.tags,
				function(data) {
					/* no error */
					expect(data.msg).toBe(undefined);
					/* key */
					expect(data.key).toBe('instant-grits');
					done();
				}
			);
		});

		it("recipes.read should return the modified recipe", function(done) {
			recipes.read("instant-grits", function(err,recipe) {
				expect(err).toBe(null);
				expect(recipe.tags).toContain("Side Dish");
				done();
			});
		});

		it("recipes.remove should delete the recipe from the collection", function(done) {
			recipes.remove("instant-grits", function(err,recipe) {
				expect(err).toBe(undefined);
				done();
			});
		});
	});

	describe("Recipes Collection Tests", function() {

		var testRecipes = [
			{
				key: "test-recipe1",
				title: 'Test Recipe1',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag3']
			},
			{
				key: "test-recipe2",
				title: 'Test Recipe2',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag2','tag3']
			},
			{
				key: "test-recipe3",
				title: 'Test Recipe3',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag2']
			},
			{
				key: "test-recipe4",
				title: 'Test Recipe4',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag4','tag3']
			},
			{
				key: "test-recipe5",
				title: 'Test Recipe5',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag4','tag3']
			},
			{
				key: "test-recipe6",
				title: 'Test Recipe6',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag3']
			},
			{
				key: "test-recipe7",
				title: 'Test Recipe7',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag2','tag3']
			},
			{
				key: "test-recipe8",
				title: 'Test Recipe8',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag4','tag3']
			},
			{
				key: "test-recipe9",
				title: 'Test Recipe9',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag3']
			},
			{
				key: "test-recipe10",
				title: 'Test Recipe10',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag3']
			},
			{
				key: "test-recipe11",
				title: 'Test Recipe11',
				description:'', 
				ingredients:'zzz',
				directions:'zzz',
				tags:['tag1','tag3']
			}
		];

		/* populate test data */
		beforeEach(function(done) {
			/* remove all test recipes from the collection */
			Recipe.remove(function() {
				done();
			});
		});

		beforeEach(function(done) {
			/* add test recipes */
			Recipe.create(testRecipes,function(err) {
				done();
			});
		});

		it("recipe.collection should return a collection object with 5 items", function(done) {
			recipes.collection({},5,0,["key","title"],function(err,results) {
				expect(results.items.length).toBe(5);
				expect(results.items[0].ingredients || null).toBe(null);
				done();
			});
		});

		it("recipes.collection should return a collection object 10 items", function(done) {
			recipes.collection({},10,0,["key","title"],function(err,results) {
				expect(results.items.length).toBe(10);
				done();
			});
		});

		it("recipes.collection should return a collection object", function(done) {
			recipes.collection({},10,1,["key","title","ingredients"],function(err,results) {
				expect(results.items.length).toBe(1);
				//expect(results.items[0].ingredients).toBe("zzz");
				done();
			});	
		});

		it("recipes.collection filtered by tag", function(done) {
			recipes.collection({tags: 'tag2'},10,0,["key","title"],function(err,results) {
				expect(results.items.length).toBe(3);
				done();
			});
		});

		it("recipes.tags should return a collection of tags", function(done) {
			recipes.tags(function(err,results) {
				expect(results[0].id).toBe("tag1");
				expect(results[0].count).toBe(6);
				done();
			});
		});

	});
});
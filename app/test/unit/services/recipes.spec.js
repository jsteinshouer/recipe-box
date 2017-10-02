describe("services.recipes ", function() {

	var $http, $httpBackend, Recipe;
	beforeEach(module('services.recipes'));
	beforeEach(inject(function ($injector) {
		$http = $injector.get('$http');
		$httpBackend = $injector.get('$httpBackend');
		Recipe = $injector.get('Recipe');
	}));

	describe("Recipe.getItems: ", function() {

		it("should limit the result to 1 recipe", function() {
			//fake response
			$httpBackend.whenGET('/recipes?limit=1&offset=0&expand=0&fields=key,title,description').respond({
				limit: 1,
				offset: 0,
				total: 2,
				items: [
					{key: 'recipe-1', title: 'Recipe 1', description: ''}
				]
			});

			var data;

			Recipe.getItems({limit: 1},function(response) {
				data = response.data;
			});

			//simulate response
			$httpBackend.flush();

			expect(data.items.length).toBe(1);
			expect(data.items[0].description).toBeDefined();
		});

		it("should return limit to 5 recipes and only return key and title fields", function() {
			//fake response
			$httpBackend.whenGET('/recipes?limit=5&offset=0&expand=0&fields=key,title').respond({
				limit: 5,
				offset: 0,
				total: 3,
				items: [
					{key: 'recipe-1', title: 'Recipe 1'},
					{key: 'recipe-2', title: 'Recipe 2'},
					{key: 'recipe-3', title: 'Recipe 3'},
					{key: 'recipe-4', title: 'Recipe 4'},
					{key: 'recipe-5', title: 'Recipe 5'}
				]
			});

			var data;

			Recipe.getItems({limit: 5,fields: 'key,title'},function(response) {
				data = response.data;
			});

			//simulate response
			$httpBackend.flush();

			expect(data.items.length).toBe(5);
			expect(data.items[0].description).toBeUndefined();
		});

	});

	describe("Recipe.getItemsByTag: ", function() {

		it("should limit the result to 1 recipe", function() {
			//fake response
			$httpBackend.whenGET('/tags/tag1?limit=1&offset=0&expand=0&fields=key,title,description').respond({
				limit: 1,
				offset: 0,
				total: 2,
				items: [
					{key: 'recipe-1', title: 'Recipe 1', description: ''}
				]
			});

			var data;

			Recipe.getItemsByTag('tag1',{limit: 1},function(response) {
				data = response.data;
			});

			//simulate response
			$httpBackend.flush();

			expect(data.items.length).toBe(1);
			expect(data.items[0].description).toBeDefined();
		});

		it("should return limit to 5 recipes and only return key and title fields", function() {
			//fake response
			$httpBackend.whenGET('/tags/tag1?limit=5&offset=0&expand=0&fields=key,title').respond({
				limit: 5,
				offset: 0,
				total: 3,
				items: [
					{key: 'recipe-1', title: 'Recipe 1'},
					{key: 'recipe-2', title: 'Recipe 2'},
					{key: 'recipe-3', title: 'Recipe 3'},
					{key: 'recipe-4', title: 'Recipe 4'},
					{key: 'recipe-5', title: 'Recipe 5'}
				]
			});

			var data;

			Recipe.getItemsByTag('tag1',{limit: 5,fields: 'key,title'},function(response) {
				data = response.data;
			});

			//simulate response
			$httpBackend.flush();

			expect(data.items.length).toBe(5);
			expect(data.items[0].description).toBeUndefined();
		});

	});

	describe("Recipe.get: ",function(){

		it("should return a recipe", function() {
			$httpBackend.whenGET('/recipes/recipe-1').respond({
				key: 'recipe-1', 
				title: 'Recipe 1',
				description: 'A great recipe',
				ingredients: 'spoonful of sugar',
				directions: 'helps the medicine go down',
				tags: ['tag1']
			}); 

			var recipe;

			Recipe.get('recipe-1',function(response) {
				recipe = response.data;
			});

			$httpBackend.flush();

			expect(recipe.title).toBe('Recipe 1');
			expect(recipe.ingredients).toBe('spoonful of sugar');	
		});
	});

	describe( "Recipe.getTags: ", function(){
		
		it( "should return a collection of tags", function(){
			$httpBackend.expectGET('/tags').respond([
				{id: 'tag1', count: 5},
				{id: 'tag2', count: 3}
			]);

			var data;
			Recipe.getTags(function(response) {
				data = response.data;
			});

			$httpBackend.flush();

			expect(data.length).toBe(2);
			expect(data[0].id).toBe('tag1');
			expect(data[1].count).toBe(3);
		});
	
	});

	describe( "Recipe.save: ", function(){
		
		it( "should create a new recipe ", function(){

			var data = {
				title: 'Test Recipe',
				description: '',
				ingredients: 'spoonful of sugar',
				directions: 'bake at 350 for 1 hour',
				tags: ['tag1', 'tag2']
			};

			$httpBackend.expectPOST('/recipes').respond(201,{msg: 'OK', key: 'test-recipe'});

			var recipe = new Recipe(data);

			var r;
			recipe.save(function(res) {
				r = res;
			}, function(err) {
				console.log(err);	
			});

			$httpBackend.flush();

			expect(recipe.key).not.toBeUndefined();
			expect(r.status).toBe(201);


		});

		it( "should save an existing recipe ", function(){
			$httpBackend.expectPUT('/recipes/test-recipe').respond(200,{msg: "OK", key: "test-recipe"});

			var recipe = new Recipe();
			recipe.key = 'test-recipe';
			recipe.title = "Test Recipe";
			recipe.description = "";
			recipe.ingredients = "spoonful of sugar";
			recipe.tags = ["tag1","tag3"];

			var r;
			recipe.save(function(response) {
				r = response;
			});

			$httpBackend.flush();

			expect(r.status).toBe(200);
		});
	
	});
});
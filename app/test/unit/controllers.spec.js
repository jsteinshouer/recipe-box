describe("Controller Tests", function() {

	var $scope;
	beforeEach(module('controllers'));
	beforeEach(module('mocks.services'));
	beforeEach(inject(function ($injector) {
		$scope = $injector.get('$rootScope').$new();
		Recipe = $injector.get('MockRecipe');
		$timeout = $injector.get('$timeout');
	}));


	describe('RecipeListCtrl: ', function () {

		function runController($scope, Recipe) {
			inject(function($controller) {
				$controller('RecipeListCtrl', { $scope: $scope, Recipe: Recipe });
			});
		}

		it('should call Recipe.getItems to populate $scope.recipes', function () {
			runs(function() {
				runController($scope,Recipe);
			});

			waitsFor(function() {
				return $scope.recipes;
			},'$scope.recipes was not defined', 750);

			runs(function() {
				expect($scope.recipes[0].key).toBe('test-recipe');
			});
		});

	});

	describe('RecipeEditCtrl: ', function () {


		function runController($scope,Recipe,$timeout) {
			inject(function($controller) {
				$controller('RecipeEditCtrl', { 
					$scope: $scope, 
					Recipe: Recipe,
					$timeout: $timeout,
					$routeParams: {key: 'test-recipe'}
				});
			});
		}

		it('should call Recipe.get to populate $scope.recipe', function () {
			runs(function() {
				runController($scope, Recipe,$timeout);
			});

			waitsFor(function() {
				return $scope.recipe;
			},'$scope.recipe was not defined', 750);

			runs(function() {
				expect($scope.recipe.key).toBe('test-recipe');
			});
		});

		it( "$scope.save should save the current recipe and set a success flag", function(){
			runs(function() {
				runController($scope, Recipe,$timeout);
				$scope.save();
			});

			waitsFor(function() {
				return $scope.saveSuccess;
			},'$scope.saveSuccess was not defined', 750);

			runs(function() {
				expect($scope.saveSuccess).toBeTruthy();
				expect($scope.saveError).toBeUndefined();
				$timeout.flush();
				expect($scope.saveSuccess).toBeFalsy();
			});
		});

		it( "$scope.save should set an error flag when an save error occurs", function(){
			runs(function() {
				runController($scope, Recipe,$timeout);
				$scope.recipe.key = 'test-recipe-error';
				$scope.save();
			});

			waitsFor(function() {
				return $scope.saveError;
			},'$scope.saveError was not defined', 750);

			runs(function() {
				expect($scope.saveSuccess).toBeUndefined();
				expect($scope.saveError).toBeTruthy();
				$timeout.flush();
				expect($scope.saveError).toBeFalsy();
			});
		});

	});

	describe('TagListCtrl: ', function () {

		function runController($scope, Recipe) {
			inject(function($controller) {
				$controller('TagListCtrl', { $scope: $scope, Recipe: Recipe });
			});
		}

		it('should call Recipe.getTags to populate $scope.tags', function () {
			/* Mock getTags using a jasmine spy */
			Recipe.getTags = jasmine.createSpy('getTags');

			runController($scope,Recipe);

			expect(Recipe.getTags).toHaveBeenCalled();
		});

	});

	describe('RecipesByTagCtrl: ', function () {

		function runController($scope, Recipe) {
			inject(function($controller) {
				$controller('RecipesByTagCtrl', { $scope: $scope, Recipe: Recipe, $routeParams: {id: 'tag1'} });
			});
		}

		it('should call Recipe.getItemsByTag to populate $scope.recipes', function () {
			runs(function() {
				runController($scope,Recipe);
			});

			waitsFor(function() {
				return $scope.recipes;
			},'$scope.recipes was not defined', 750);

			runs(function() {
				expect($scope.recipes[0].key).toBe('test-recipe-by-tag');
			});
		});

	});

});
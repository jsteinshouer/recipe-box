/* Controllers */

angular.module('controllers', ['services.recipes','services.security'])
	
	.controller('LoginCtrl', ['$scope','$location','authorizationProvider', function($scope,$location,auth) {

		$scope.login = function() {
			auth.login(
				$scope.user.id,
				$scope.user.password,
				function(data) {
					$location.path('/recipes');
				},
				function(response){
					$scope.authError = "Logon failed! Please make sure your username and password are correct.";
				}
			);
		};

	}])

	.controller('RecipeListCtrl', ['$scope','Recipe',function($scope,Recipe) {
		$scope.heading = 'Recipes';
		$scope.pagination = {};
		Recipe.getItems({limit: 10},function(response) {
			$scope.recipes = response.data.items;
			$scope.pagination.count = Math.ceil(response.data.total / response.data.limit);
			$scope.pagination.current = response.data.offset + 1;
		});

		$scope.changePage = function(page) {
			var offset = page - 1;

			Recipe.getItems({offset: offset},function(response) {
				$scope.recipes = response.data.items;
			});
		};

	}])

	.controller('MyRecipesListCtrl', ['$scope','Recipe',function($scope,Recipe) {
		$scope.heading = 'My Recipes';
		$scope.pagination = {};
		Recipe.getMyRecipes({limit: 10},function(response) {
			$scope.recipes = response.data.items;
			$scope.pagination.count = Math.ceil(response.data.total / response.data.limit);
			$scope.pagination.current = response.data.offset + 1;
		});

		$scope.changePage = function(page) {
			var offset = page - 1;

			Recipe.getItems({offset: offset},function(response) {
				$scope.recipes = response.data.items;
			});
		};

	}])

	.controller('RecipeDetailCtrl', ['$scope','Recipe','$routeParams', function($scope,Recipe,$routeParams) {

		Recipe.get($routeParams.key,function(response) {
			$scope.recipe = new Recipe(response.data);
		});

		$scope.formatString = function(str) {
			return str.replace(/\n/g, '<br />');
		};

	}])

	.controller('RecipeEditCtrl', ['$scope','$timeout','Recipe','$routeParams', function($scope,$timeout,Recipe,$routeParams) {
		
		if ($routeParams.key) {
			Recipe.get($routeParams.key,function(response) {
				$scope.recipe = new Recipe(response.data);
			});
		}
		else {
			$scope.recipe = new Recipe();
		}

		$scope.save = function() {
			$scope.recipe.save(function() {
				$scope.saveSuccess = true;

				$timeout(function() {
					$scope.saveSuccess = false;
				}, 5000);
			},function(response){
				$scope.saveError = true;

				if (response.status = 404) {
					$scope.saveError = 'Some required data was missing.';
				}
				else {
					$scope.saveError = 'An error occured while saving.';
				}

				$timeout(function() {
					$scope.saveError = '';
				}, 5000);
			});
		};
	}])

	.controller('TagListCtrl', ['$scope','Recipe',function($scope,Recipe) {
		Recipe.getTags(function(response) {
			$scope.tags = response.data;
		});
	}])

	.controller('RecipesByTagCtrl', ['$scope','Recipe','$routeParams',function($scope,Recipe,$routeParams) {
		Recipe.getItemsByTag($routeParams.id,{},function(response) {
			$scope.recipes = response.data.items;
		});
	}])
;
var recipeService = angular.module('mocks.services', []);


recipeService.factory('MockRecipe', ['$http', '$q', function ($http, $q) {

  var Recipe = function (data) {
    angular.extend(this, data);
  };

  Recipe.get = function(key,cb,errcb) {
      cb({data: {
          key: key,
          description: '',
          title: 'Test Recipe',
          ingredients: 'test ingredients',
          directions: 'test directions',
          tags: ['tag1','tag2']
        }
      }); 
  };

  Recipe.getItems = function(options,cb,errcb) {
    cb({data: {items: [{key: 'test-recipe'}]}});
  };

  Recipe.getItemsByTag = function(tag,options,cb,errcb) {
    cb({data: {items: [{key: 'test-recipe-by-tag'}]}});
  };

  Recipe.getTags = function(cb,errcb) {

  };

  Recipe.prototype.save = function(cb,errcb) {
    if (this.key && this.key === 'test-recipe-error'){
      errcb({data: {msg: 'The recipe save failed!'}});
    }
    else if (this.key && this.key === 'test-recipe') {
      this.key = 'test-recipe';
      cb({status: 200, data: {msg: 'OK',key: 'test-recipe'}});
    }
    else {
      this.key = 'test-recipe-new';
      cb({status: 201,data: {msg: 'Created', key: 'test-recipe-new'}});
    }
  }

  return Recipe;

}]);
    
   
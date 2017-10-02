var recipeService = angular.module('services.recipes', []);


recipeService.factory('Recipe', ['$http', '$q', function ($http, $q) {

  var url = '/recipes';

  var Recipe = function (data) {
    angular.extend(this, data);
  };

  Recipe.get = function(key,cb,errcb) {
    $http.get('/recipes/' + key).then(cb,errcb);
  };

  Recipe.getItems = function(options,cb,errcb) {
    var defaults = {
      limit: 10,
      offset: 0,
      fields: 'key,title,description',
      expand:0
    };

    options = angular.extend(defaults,options);

    $http.get('/recipes?limit='+options.limit+'&offset='+options.offset+'&expand='+options.expand+'&fields='+options.fields).then(cb,errcb);
  };

  Recipe.getMyRecipes = function(options,cb,errcb) {
    var defaults = {
      limit: 10,
      offset: 0,
      fields: 'key,title,description',
      expand:0
    };

    options = angular.extend(defaults,options);

    $http.get('/myrecipes?limit='+options.limit+'&offset='+options.offset+'&expand='+options.expand+'&fields='+options.fields).then(cb,errcb);
  };

  Recipe.getItemsByTag = function(tag,options,cb,errcb) {
    var defaults = {
      limit: 10,
      offset: 0,
      fields: 'key,title,description',
      expand:0
    };

    options = angular.extend(defaults,options);

    $http.get('/tags/' + tag + '?limit='+options.limit+'&offset='+options.offset+'&expand='+options.expand+'&fields='+options.fields).then(cb,errcb);
  };

  Recipe.getTags = function(cb,errcb) {
    $http.get('/tags').then(cb,errcb);
  };

  Recipe.prototype.save = function(cb,errcb) {

    if (!errcb) {
      errcb = function(){};
    }

    /* Update */
    var self = this;
    if (this.key && this.key !== '') {
      $http.put('/recipes/' + this.key, {
          title: this.title,
          description: this.description,
          ingredients: this.ingredients,
          directions: this.directions,
          tags: this.tags
      })
      .then(function(response) {
        self.key = response.data.key;
        cb(response);
      },errcb);
    }
    /* Create */
    else {
      $http.post('/recipes', {
          title: this.title,
          description: this.description,
          ingredients: this.ingredients,
          directions: this.directions,
          tags: this.tags
      })
      .then(function(response) {
        self.key = response.data.key;
        cb(response);
      }, errcb);
    }
  };

  return Recipe;

}]);
    
   
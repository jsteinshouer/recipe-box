app = angular.module('app', ['ngRoute','controllers','services.security','templates-main','ngTagsInput','directives.pagination']);

/* Register security interceptor */
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('securityInterceptor');
}]);

/* routing configuration */
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/login', {templateUrl: 'login-form.tpl.html',   controller:  'LoginCtrl'}).
      when('/recipes', {templateUrl: 'recipe-list.tpl.html',   controller:  'RecipeListCtrl'}).
      when('/myrecipes', {templateUrl: 'recipe-list.tpl.html',   controller:  'MyRecipesListCtrl'}).
      when('/recipes/add', {templateUrl: 'recipe-form.tpl.html', controller:  'RecipeEditCtrl'}).
      when('/recipes/edit/:key', {templateUrl: 'recipe-form.tpl.html', controller:  'RecipeEditCtrl'}).
      when('/recipes/:key', {templateUrl: 'recipe-detail.tpl.html', controller:  'RecipeDetailCtrl'}).
      when('/tags', {templateUrl: 'tag-list.tpl.html',   controller:  'TagListCtrl'}).
      when('/tags/:id', {templateUrl: 'recipe-list.tpl.html',   controller:  'RecipesByTagCtrl'}).
      otherwise({redirectTo: '/recipes'});
}]);

/* initialize authorization service when app is loaded */
app.run(['authorizationProvider', function(auth) {
  auth.init();
}]);


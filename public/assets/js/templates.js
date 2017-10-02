angular.module('templates-main', ['login-form.tpl.html', 'recipe-detail.tpl.html', 'recipe-form.tpl.html', 'recipe-list.tpl.html', 'tag-list.tpl.html']);

angular.module("login-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login-form.tpl.html",
    "<div class=\"container\" style=\"margin-top: 30px\">\n" +
    "<form class=\"form-signin\" role=\"form\">\n" +
    "    <h2 class=\"form-signin-heading\">Please sign in</h2>\n" +
    "    <div class=\"alert alert-warning\" ng-show=\"authError\">{{authError}}</div>\n" +
    "    <input type=\"text\" class=\"form-control input-lg\" ng-model=\"user.id\" placeholder=\"Username\" required autofocus>\n" +
    "    <input type=\"password\" class=\"form-control input-lg\" placeholder=\"Password\" ng-model=\"user.password\" required>\n" +
    "    <button class=\"btn btn-lg btn-primary btn-block\" ng-click=\"login()\" ng-disabled='form.$invalid'>Sign in</button>\n" +
    "  </form>\n" +
    "</div>");
}]);

angular.module("recipe-detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("recipe-detail.tpl.html",
    "<div class=\"container\" style=\"margin-top: 30px\">\n" +
    "  <h1>{{recipe.title}}</h1>\n" +
    "  <p class=\"text-muted\">{{recipe.description}}</p>\n" +
    "  <div ng-show=\"recipe.user\">\n" +
    "    <h5><strong>Entered By:</strong> {{recipe.user}}</h5>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <h5><strong>Tags:</strong> {{recipe.tags.join()}}</h5>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <h5><strong>Ingredients</strong></h5>\n" +
    "    <pre>{{recipe.ingredients}}</pre>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <h5><strong>Directions</strong></h5>\n" +
    "    <pre>{{recipe.directions}}</pre>\n" +
    "  </div>\n" +
    "  <a class=\"btn btn-default\" href=\"#/recipes/edit/{{recipe.key}}\">Edit</a>\n" +
    "</div>");
}]);

angular.module("recipe-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("recipe-form.tpl.html",
    "<div class=\"container\" style=\"margin-top: 30px\">\n" +
    "<form role=\"form\" ng-submit=\"save()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"title\">Title</label>\n" +
    "    <input type=\"text\" class=\"form-control input-lg\" name=\"title\" ng-model=\"recipe.title\" required>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"description\">Description</label>\n" +
    "    <input type=\"text\" class=\"form-control input-lg\" name=\"description\" size=\"150\" ng-model=\"recipe.description\" />\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"ingredients\">Ingredients</label>\n" +
    "    <textarea name=\"ingredients\" ng-model=\"recipe.ingredients\" class=\"form-control\" rows=\"7\" required></textarea>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"directions\">Directions</label>\n" +
    "    <textarea name=\"directions\" ng-model=\"recipe.directions\" class=\"form-control\" rows=\"7\" required></textarea>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"tags\">Tags</label>\n" +
    "    <tags-input ng-model=\"recipe.tags\"></tags-input>\n" +
    "  </div>\n" +
    "  <button type=\"submit\" class=\"btn btn-default\">Save</button>\n" +
    "  <span class=\"text-success\" style=\"margin-left: 5px\" ng-show=\"saveSuccess\"><strong>Saved!</strong> The recipe was saved successfully.</span>\n" +
    "  <span class=\"text-danger\" style=\"margin-left: 5px\" ng-show=\"saveError\"><strong>Error!</strong> {{saveError}}</div>\n" +
    "</form>\n" +
    "</div>");
}]);

angular.module("recipe-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("recipe-list.tpl.html",
    "<div>\n" +
    "	<h3>{{heading}}</h3>\n" +
    "	<div class=\"list-group\">\n" +
    "	<a href=\"#/recipes/{{recipe.key}}\" class=\"list-group-item\" ng-repeat=\"recipe in recipes\">\n" +
    "	  <h4 class=\"list-group-item-heading\" ng-bind=\"recipe.title\"></h4>\n" +
    "	  <p class=\"list-group-item-text\" ng-bind=\"recipe.description\"></p>\n" +
    "	</a>\n" +
    "	</div>\n" +
    "	<pagination num-pages=\"pagination.count\" current-page=\"pagination.current\" on-select-page=\"changePage(page)\"></pagination>\n" +
    "</div>");
}]);

angular.module("tag-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tag-list.tpl.html",
    "<div>\n" +
    "	<h3>Tags</h3>\n" +
    "	<div class=\"list-group\">\n" +
    "	<a href=\"#/tags/{{tag.id}}\" class=\"list-group-item\" ng-repeat=\"tag in tags\">\n" +
    "	  <span class=\"badge\" ng-bind=\"tag.count\"></span>\n" +
    "	  <h4 class=\"list-group-item-heading\" ng-bind=\"tag.id\"></h4>\n" +
    "	</a>\n" +
    "</div>");
}]);

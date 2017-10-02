/*! recipe-box - v0.0.1 - 2017-09-26*/
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
angular.module('directives.pagination', [])

.directive('pagination', function() {
  return {
    restrict: 'E',
    scope: {
      numPages: '=',
      currentPage: '=',
      onSelectPage: '&'
    },
    /*template:
      '<ul class="pagination pagination-lg">' +
        '<li ng-class="{disabled: noPrevious()}"><a ng-click="selectPrevious()">Previous</a></li>' +
        '<li ng-repeat="page in pages" ng-class="{active: isActive(page)}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
        '<li ng-class="{disabled: noNext()}"><a ng-click="selectNext()">Next</a></li>' +
      '</ul>',*/
    template: 
      '<div class="btn-group btn-group-lg">' +
        '<button type="button" class="btn btn-default" ng-class="{disabled: noPrevious()}" ng-click="selectPrevious()">Previous</button>' +
        '<button type="button" class="btn btn-default" ng-repeat="page in pages" ng-class="{active: isActive(page)}" ng-click="selectPage(page)">{{page}}</button>' +
        '<button type="button" class="btn btn-default" ng-class="{disabled: noNext()}" ng-click="selectNext()">Next</button>' +
      '</div>',
    replace: true,
    link: function(scope) {
      scope.$watch('numPages', function(value) {
        scope.pages = [];
        for(var i=1;i<=value;i++) {
          scope.pages.push(i);
        }
        if ( scope.currentPage > value ) {
          scope.selectPage(value);
        }
      });
      scope.noPrevious = function() {
        return scope.currentPage === 1;
      };
      scope.noNext = function() {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function(page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function(page) {
        if ( ! scope.isActive(page) ) {
          scope.currentPage = page;
          scope.onSelectPage({ page: page });
        }
      };

      scope.selectPrevious = function() {
        if ( !scope.noPrevious() ) {
          scope.selectPage(scope.currentPage-1);
        }
      };
      scope.selectNext = function() {
        if ( !scope.noNext() ) {
          scope.selectPage(scope.currentPage+1);
        }
      };
    }
  };
});
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
    
   
angular.module('services.security',[])

	.factory('authorizationProvider',['$http','$rootScope', function($http,$rootScope) {
	
		var self = JSON.parse(sessionStorage.getItem('auth')) || {isLoggedIn: false, token: ''};

		return {
			init: function() {
				$rootScope.auth = self;
			},
			login: function(username,password,cb,errcb) {
				$http.post('/authorize',{
					username: username,
					password: password
				})
				.success(function(data) {
					self.isLoggedIn = true;
					self.token = data.token;
					sessionStorage.setItem('auth',JSON.stringify(self));
					cb(data);
				})
				.error(function(data,status){
					self.isLoggedIn = false;
					self.token = '';
					sessionStorage.setItem('auth',JSON.stringify(self));
					errcb(data,status);
				});
			},
			logout: function() {
				self.isLoggedIn = false;
				self.token = '';
				sessionStorage.setItem('auth',JSON.stringify(self));
			},
			isLoggedIn: function() {
				return self.isLoggedIn;
			},
			token: self.token
		};
	}])

	.factory('securityInterceptor',['$q','$location','$rootScope', function($q,$location,$rootScope) {
		return {
			'request': function(config) {
				if ($rootScope.auth && $rootScope.auth.token && config.url !== '/authorize') {
					/* Add authorization header */
					config.headers['Auth-Token'] =  $rootScope.auth.token;
				}
				return config;
			},
			'responseError': function(response) {
				/* Check for 401 error */
				if (response.config.url !== '/authorize' && response.status === 401) {
					$rootScope.auth.isLoggedIn = false;
					$rootScope.auth.token = '';
					sessionStorage.setItem('auth',JSON.stringify($rootScope.auth));
					$location.path('/login');
				}
				
				return $q.reject(response);
				
			}	
		};
	}]);

(function() {
'use strict';

var KEYS = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    up: 38,
    down: 40,
    comma: 188
};

var tagsInput = angular.module('ngTagsInput', []);

/**
 * @ngdoc directive
 * @name tagsInput.directive:tagsInput
 *
 * @description
 * ngTagsInput is an Angular directive that renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} customClass CSS class to style the control.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
 * @param {string=} [removeTagSymbol=×] Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=^[a-zA-Z0-9\s]+$*] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into
 *                                                the new tag input box instead of being removed when the backspace key
 *                                                is pressed and the input box is empty.
 * @param {expression} onTagAdded Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression} onTagRemoved Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 */
tagsInput.directive('tagsInput', ["$timeout","$document","tagsInputConfig", function($timeout, $document, tagsInputConfig) {
    function SimplePubSub() {
        var events = {};

        return {
            on: function(name, handler) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            },
            trigger: function(name, args) {
                angular.forEach(events[name], function(handler) {
                   handler.call(null, args);
                });
            }
        };
    }

    return {
        restrict: 'E',
        scope: {
            tags: '=ngModel',
            onTagAdded: '&',
            onTagRemoved: '&'
        },
        replace: false,
        transclude: true,
        templateUrl: 'ngTagsInput/tags-input.html',
        controller: ["$scope","$attrs","$element", function($scope, $attrs, $element) {
            var events = new SimplePubSub(),
                shouldRemoveLastTag;

            tagsInputConfig.load($scope, $attrs, {
                customClass: { type: String, defaultValue: '' },
                placeholder: { type: String, defaultValue: 'Add a tag' },
                tabindex: { type: Number },
                removeTagSymbol: { type: String, defaultValue: String.fromCharCode(215) },
                replaceSpacesWithDashes: { type: Boolean, defaultValue: true },
                minLength: { type: Number, defaultValue: 3 },
                maxLength: { type: Number },
                addOnEnter: { type: Boolean, defaultValue: true },
                addOnSpace: { type: Boolean, defaultValue: false },
                addOnComma: { type: Boolean, defaultValue: true },
                addOnBlur: { type: Boolean, defaultValue: true },
                allowedTagsPattern: { type: RegExp, defaultValue: /^[a-zA-Z0-9\s]+$/ },
                enableEditingLastTag: { type: Boolean, defaultValue: false }
            });

            events.on('tag-added', $scope.onTagAdded);
            events.on('tag-removed', $scope.onTagRemoved);

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.options.minLength && $scope.options.allowedTagsPattern.test(tag)) {

                    if ($scope.options.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);

                        events.trigger('tag-added', { $tag: tag });
                    }

                    $scope.newTag = '';
                    events.trigger('input-changed', '');
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;

                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        $scope.newTag = $scope.remove($scope.tags.length - 1);
                    }
                    else {
                        if (shouldRemoveLastTag) {
                            $scope.remove($scope.tags.length - 1);

                            shouldRemoveLastTag = false;
                        }
                        else {
                            shouldRemoveLastTag = true;
                        }
                    }
                    changed = true;
                }
                return changed;
            };

            $scope.remove = function(index) {
                var removedTag = $scope.tags.splice(index, 1)[0];
                events.trigger('tag-removed', { $tag: removedTag });
                return removedTag;
            };

            $scope.getCssClass = function(index) {
                var isLastTag = index === $scope.tags.length - 1;
                return shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                shouldRemoveLastTag = false;
            });

            this.registerAutocomplete = function() {
                var input = $element.find('input');
                input.on('keydown', function(e) {
                    events.trigger('input-keydown', e);
                });

                $scope.newTagChange = function() {
                    events.trigger('input-changed', $scope.newTag);
                };

                return {
                    tryAddTag: function(tag) {
                        $scope.newTag = tag;
                        return $scope.tryAdd();
                    },
                    focusInput: function() {
                        input[0].focus();
                    },
                    getTags: function() {
                        return $scope.tags;
                    },
                    on: function(name, handler) {
                        events.on(name, handler);
                        return this;
                    }
                };
            };
        }],
        link: function(scope, element) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace];
            var input = element.find('input');

            input
                .on('keydown', function(e) {
                    var key;

                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return;
                    }

                    if (hotkeys.indexOf(e.keyCode) === -1) {
                        return;
                    }

                    key = e.keyCode;

                    if (key === KEYS.enter && scope.options.addOnEnter ||
                        key === KEYS.comma && scope.options.addOnComma ||
                        key === KEYS.space && scope.options.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }
                        e.preventDefault();
                    }
                    else if (key === KEYS.backspace && this.value.length === 0) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();

                            e.preventDefault();
                        }
                    }
                })
                .on('focus', function() {
                    if (scope.hasFocus) {
                        return;
                    }
                    scope.hasFocus = true;
                    scope.$apply();
                })
                .on('blur', function() {
                    $timeout(function() {
                        var parentElement = angular.element($document[0].activeElement).parent();
                        if (parentElement[0] !== element[0]) {
                            scope.hasFocus = false;
                            if (scope.options.addOnBlur) {
                                scope.tryAdd();
                            }
                            scope.$apply();
                        }
                    }, 0, false);
                });

            element.find('div').on('click', function() {
                input[0].focus();
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name tagsInput.directive:autoComplete
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Expression to evaluate upon changing the input content. The input value is available as
 *                            $query. The result of the expression must be a promise that eventually resolves to an
 *                            array of strings.
 * @param {number=} [debounceDelay=100] Amount of time, in milliseconds, to wait before evaluating the expression in
 *                                      the source option after the last keystroke.
 * @param {number=} [minLength=3] Minimum number of characters that must be entered before evaluating the expression
 *                                 in the source option.
 * @param {boolean=} [highlightMatchedText=true] Flag indicating that the matched text will be highlighted in the
 *                                               suggestions list.
 * @param {number=} [maxResultsToShow=10] Maximum number of results to be displayed at a time.
 */
tagsInput.directive('autoComplete', ["$document","$timeout","$sce","tagsInputConfig", function($document, $timeout, $sce, tagsInputConfig) {
    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId, getDifference;

        getDifference = function(array1, array2) {
            var result = [];

            array1.forEach(function(item) {
                if (array2.indexOf(item) === -1) {
                    result.push(item);
                }
            });

            return result;
        };

        self.reset = function() {
            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;
            self.query = null;

            $timeout.cancel(debouncedLoadId);
        };
        self.show = function() {
            self.selected = null;
            self.visible = true;
        };
        self.hide = function() {
            self.visible = false;
        };
        self.load = function(query, tags) {
            if (query.length < options.minLength) {
                self.reset();
                return;
            }

            $timeout.cancel(debouncedLoadId);
            debouncedLoadId = $timeout(function() {
                self.query = query;
                loadFn({ $query: query }).then(function(items) {
                    self.items = getDifference(items, tags);
                    if (self.items.length > 0) {
                        self.show();
                    }
                });
            }, options.debounceDelay, false);
        };
        self.selectNext = function() {
            self.select(++self.index);
        };
        self.selectPrior = function() {
            self.select(--self.index);
        };
        self.select = function(index) {
            if (index < 0) {
                index = self.items.length - 1;
            }
            else if (index >= self.items.length) {
                index = 0;
            }
            self.index = index;
            self.selected = self.items[index];
        };

        self.reset();

        return self;
    }

    return {
        restrict: 'E',
        require: '?^tagsInput',
        scope: { source: '&' },
        templateUrl: 'ngTagsInput/auto-complete.html',
        link: function(scope, element, attrs, tagsInputCtrl) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down],
                suggestionList, tagsInput, highlight;

            tagsInputConfig.load(scope, attrs, {
                debounceDelay: { type: Number, defaultValue: 100 },
                minLength: { type: Number, defaultValue: 3 },
                highlightMatchedText: { type: Boolean, defaultValue: true },
                maxResultsToShow: { type: Number, defaultValue: 10 }
            });

            tagsInput = tagsInputCtrl.registerAutocomplete();
            suggestionList = new SuggestionList(scope.source, scope.options);

            if (scope.options.highlightMatchedText) {
                highlight = function(item, text) {
                    var expression = new RegExp(text, 'gi');
                    return item.replace(expression, '<em>$&</em>');
                };
            }
            else {
                highlight = function(item) {
                    return item;
                };
            }

            scope.suggestionList = suggestionList;

            scope.addSuggestion = function() {
                var added = false;

                if (suggestionList.selected) {
                    tagsInput.tryAddTag(suggestionList.selected);
                    suggestionList.reset();
                    tagsInput.focusInput();

                    added = true;
                }
                return added;
            };

            scope.highlight = function(item) {
                return $sce.trustAsHtml(highlight(item, suggestionList.query));
            };

            tagsInput
                .on('input-changed', function(value) {
                    if (value) {
                        suggestionList.load(value, tagsInput.getTags());
                    } else {
                        suggestionList.reset();
                    }
                })
                .on('input-keydown', function(e) {
                    var key, handled;

                    if (hotkeys.indexOf(e.keyCode) === -1) {
                        return;
                    }

                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    var immediatePropagationStopped = false;
                    e.stopImmediatePropagation = function() {
                        immediatePropagationStopped = true;
                        e.stopPropagation();
                    };
                    e.isImmediatePropagationStopped = function() {
                        return immediatePropagationStopped;
                    };

                    if (suggestionList.visible) {
                        key = e.keyCode;
                        handled = false;

                        if (key === KEYS.down) {
                            suggestionList.selectNext();
                            handled = true;
                        }
                        else if (key === KEYS.up) {
                            suggestionList.selectPrior();
                            handled = true;
                        }
                        else if (key === KEYS.escape) {
                            suggestionList.reset();
                            handled = true;
                        }
                        else if (key === KEYS.enter || key === KEYS.tab) {
                            handled = scope.addSuggestion();
                        }

                        if (handled) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            scope.$apply();
                        }
                    }
                });

            $document.on('click', function() {
                if (suggestionList.visible) {
                    suggestionList.reset();
                    scope.$apply();
                }
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name tagsInput.directive:transcludeAppend
 *
 * @description
 * Re-creates the old behavior of ng-transclude.
 */
tagsInput.directive('transcludeAppend', function() {
    return function(scope, element, attrs, ctrl, transcludeFn) {
        transcludeFn(function(clone) {
            element.append(clone);
        });
    };
});

/**
 * @ngdoc service
 * @name tagsInput.service:tagsInputConfig
 *
 * @description
 * Loads and initializes options from HTML attributes. Used internally for tagsInput and autoComplete directives.
 */
tagsInput.service('tagsInputConfig', ["$interpolate", function($interpolate) {
    this.load = function(scope, attrs, options) {
        var converters = {};
        converters[String] = function(value) { return value; };
        converters[Number] = function(value) { return parseInt(value, 10); };
        converters[Boolean] = function(value) { return value === 'true'; };
        converters[RegExp] = function(value) { return new RegExp(value); };

        scope.options = {};

        angular.forEach(options, function(value, key) {
            var interpolatedValue = attrs[key] && $interpolate(attrs[key])(scope.$parent),
                converter = converters[options[key].type];

            scope.options[key] = interpolatedValue ? converter(interpolatedValue) : options[key].defaultValue;
        });
    };
}]);

tagsInput.run(["$templateCache", function($templateCache) {
  
  $templateCache.put('ngTagsInput/tags-input.html',
    "<div class=\"ngTagsInput\" tabindex=\"-1\" ng-class=\"options.customClass\" transclude-append=\"\"><div class=\"tags\" ng-class=\"{focused: hasFocus}\"><ul><li ng-repeat=\"tag in tags\" ng-class=\"getCssClass($index)\"><span>{{tag}}</span> <button type=\"button\" ng-click=\"remove($index)\">{{options.removeTagSymbol}}</button></li></ul><input placeholder=\"{{options.placeholder}}\" size=\"{{options.placeholder.length}}\" maxlength=\"{{options.maxLength}}\" tabindex=\"{{options.tabindex}}\" ng-model=\"newTag\" ng-change=\"newTagChange()\"></div></div>"
  );

  $templateCache.put('ngTagsInput/auto-complete.html',
    "<div class=\"autocomplete\" ng-show=\"suggestionList.visible\"><ul><li ng-repeat=\"item in suggestionList.items | limitTo:options.maxResultsToShow\" ng-class=\"{selected: item == suggestionList.selected}\" ng-click=\"addSuggestion()\" ng-mouseenter=\"suggestionList.select($index)\" ng-bind-html=\"highlight(item)\"></li></ul></div>"
  );
}]);

}());
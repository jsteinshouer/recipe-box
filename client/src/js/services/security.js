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

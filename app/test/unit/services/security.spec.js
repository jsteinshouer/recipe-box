describe( "services.security module tests", function() {

	var $http,$httpBackend,$rootScope,auth;
	beforeEach(module('services.security'));
	beforeEach(inject(function ($injector) {
		$http = $injector.get('$http');
		$location = $injector.get('$location');
		$httpBackend = $injector.get('$httpBackend');
		$rootScope = $injector.get('$rootScope');
		auth = $injector.get('authorizationProvider');
		interceptor = $injector.get('securityInterceptor');
		auth.init();
	}));

	describe( "authorizationProvider: ", function(){

		it( "should return 200 status for a successful login", function(){
			$httpBackend.expectPOST('/authorize').respond({
				"token": "mytesttoken"
			});

			var successData,errorResponse;

			auth.login(
				'testuser',
				'testpassword', 
				function(data) {
					successData = data;
				},
				function(res) {
					errorResponse = res;
				}
			);

			$httpBackend.flush();

			expect(successData.token).toBe('mytesttoken');
			expect(errorResponse).toBeUndefined();
			expect($rootScope.auth.isLoggedIn).toBeTruthy();
		});

		it( "should return 401 status for a failed login", function(){
			$httpBackend.expectPOST('/authorize').respond(401);

			var successData,errorResponse;

			auth.login(
				'testuser',
				'testwrongpassword', 
				function(data) {
					successData = data;
				},
				function(data,status) {
					errorResponse = status;
				}
			);

			$httpBackend.flush();

			expect(errorResponse).toBe(401);
			expect($rootScope.auth.isLoggedIn).toBeFalsy();
		});
	
	});

	describe( "securityInterceptor: ", function(){
		
		it( "should logout a user if a 401 status is intercepted", function(){
			$rootScope.auth.isLoggedIn = true;
			$location.path('/recipes');

			var response = {
				config: {
					url: '/recipes'
				},
				status: 401
			};

			expect(auth.isLoggedIn()).toBeTruthy();

			interceptor.responseError(response);

			expect(auth.isLoggedIn()).toBeFalsy();
			expect($location.path()).toBe('/login');
		});	
	
	});

});
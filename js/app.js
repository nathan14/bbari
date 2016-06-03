(function(){
	var app = angular.module('bariBari',
			['ngRoute', 'ngSanitize', 'posts', 'utils', 'ui.bootstrap',
			 'angularFileUpload', 'angularUtils.directives.dirDisqus', 'textAngular', 'facebook']);

	app.config(['$routeProvider', '$locationProvider', 'FacebookProvider',
				function($routeProvider, $locationProvider, FacebookProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeController',
			jumbotron: true,
			SEOTitle: 'בית',
			SEODesc: 'בלוג הבריאות בריא בריא מביא לכם את המתכונים שכולם מכירים אבל בגרסה הבריאה שלהם - תזונה נכונה, מתכונים בריאים וטעימים המתאימים לכולם.'
		}).
		when('/search', {
			templateUrl: 'partials/search.html',
			controller: 'HomeController',
			jumbotron: false,
			SEOTitle: 'חיפוש מתכונים בריאים',
			SEODesc: 'חיפוש מתכונים בריאים, מתכוני בריאות ופוסטים בנוגע לתזונה נכונה ובריאה יותר.'
		}).
		when('/login-register', {
			templateUrl: 'partials/login-register.html',
			controller: 'UserController',
			toLogin: true,
			jumbotron: false,
			SEOTitle: 'התחברות / הרשמה'
		}).
		when('/post/:id/:title', {
			templateUrl: 'partials/post.html',
			controller: 'PostController',
			recepieBtn: true,
			jumbotron: false,
			adminBtns: true
		}).
		when('/posts/:month/:year', {
			templateUrl: 'partials/archive.html',
			controller: 'ArchiveController',
			recepieBtn: true,
			adminBtns: true,
			jumbotron: false,
			SEOTitle: 'ארכיון'
		}).
		when('/post-new', {
			templateUrl: 'partials/post-new.html',
			controller: 'PostNewController',
			actionBtn: 'הוסף פוסט',
			jumbotron: false,
			SEOTitle: 'הוסף פוסט'
		}).
		when('/post-edit/:id', {
			templateUrl: 'partials/post-edit.html',
			controller: 'PostEditController',
			actionBtn: 'עדכן פוסט',
			jumbotron: false,
			SEOTitle: 'עדכן פוסט'
		}).
		when('/recepie-send', {
			templateUrl: 'partials/recepie-send.html',
			jumbotron: false,
			SEOTitle: 'בקשת מתכוני בריאות',
			SEODesc: 'גם אתם רוצים שנקח את המתכון שלכם ונעשה אותו בריא? שלחו לנו את המתכון.'
		}).
		when('/about', {
			templateUrl: 'partials/about.html',
			jumbotron: false,
			SEOTitle: 'אודות',
			SEODesc: 'אודות בריא בריא - מתכונים בריאים, איך עושים מתכון בריא.'
		}).
		otherwise({
			redirectTo: '/'
		});
		
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		FacebookProvider.init('1644782512406345');
	}]);

	app.constant('serverPath', {
		path: 'http://bbari.co.il/'
	});
	
	// --- Services ---
	app.service('UserService', ['$rootScope', '$http', '$q', '$location', 'serverPath',
			function($rootScope, $http, $q, $location, serverPath) {
		
		$rootScope.user = JSON.parse(localStorage.getItem('user'));
		
		this.getUserDetails = function() {
			var user = $rootScope.user;
			return user;
		};
		
		this.emptyUser = function() {
			return {
				email: '',
				passowrd: '',
				permissions: 2,
				name: '',
			};
		};
		
		this.registerUser = function(user) {
			var promise = $http.post(serverPath.path + 'server.php/user-register', user);
			var def = $q.defer();
			
			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.loginUser = function(user) {
			var promise = $http.post(serverPath.path + 'server.php/user-login', user);
			var def = $q.defer();
			
			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.setLogin = function(user) {
			console.log(user);

			var loggedInUser = {
				email: user[0].email,
				permissions: user[0].permissions,
				name: user[0].name,
				id: user[0].id
			};
			
			localStorage.setItem('user', JSON.stringify(loggedInUser));
			$location.path('/'); // *** CHANGE THIS INTO CONTROLLER 
		};
		
		this.logout = function() {
			localStorage.removeItem('user');
			$rootScope.user = '';
			$location.path('/'); // *** CHANGE THIS INTO CONTROLLER 
		};
	}]);
	
	app.service('PostService', ['$http','$q', 'serverPath', function($http, $q, serverPath) {
		this.emptyPost = function() {
			return {
				title: '',
				date: '',
				badge: '',
				estTime: '',
				author: '',
				authorId: '',
				shortDesc: '',
				content: '',
				recepie: '',
				recepieHowTo: '',
				imgId: ''
			};
		};
		
		this.postById = function(postId) {
			var promise = $http.get(serverPath.path + 'server.php/post/' + postId);
			var def = $q.defer();
			
			promise.then(function(response) {
				response.data[0].shortDesc = decodeURIComponent(response.data[0].shortDesc.replace(/\+/g, '%20'));
				response.data[0].badge = decodeURIComponent(response.data[0].badge.replace(/\+/g, '%20'));
				response.data[0].content = decodeURIComponent(response.data[0].content.replace(/\+/g, '%20'));
				response.data[0].recepie = decodeURIComponent(response.data[0].recepie.replace(/\+/g, '%20'));
				response.data[0].recepieHowTo = decodeURIComponent(response.data[0].recepieHowTo.replace(/\+/g, '%20'));
				return def.resolve(response);
			});
			
			return def.promise;
		};

		this.postsByMonthYear = function(month, year) {
			var promise = $http.get(serverPath.path + 'server.php/posts/' + month + '/' + year);
			var def = $q.defer();
			
			promise.then(function(response) {
				var posts = response.data;
				for(var i = 0; i < posts.length; i++) {
					if(posts[i].shortDesc.indexOf('%') != -1) {
						posts[i].shortDesc = decodeURIComponent(posts[i].shortDesc.replace(/\+/g, '%20'));
						posts[i].badge = decodeURIComponent(posts[i].badge.replace(/\+/g, '%20'));
						posts[i].content = decodeURIComponent(posts[i].content.replace(/\+/g, '%20'));
						posts[i].recepie = decodeURIComponent(posts[i].recepie.replace(/\+/g, '%20'));
						posts[i].recepieHowTo = decodeURIComponent(posts[i].recepieHowTo.replace(/\+/g, '%20'));
					}
				}

				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.postNew = function(postNew) {
			var promise = $http.post(serverPath.path + 'server.php/post-new', postNew);
			var def = $q.defer();
			
			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.postDelete = function(postId) {
			var promise = $http.delete(serverPath.path + 'server.php/post-delete/' + postId);
			var def = $q.defer();
			
			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.postEdit = function(postEdit) {
			var promise = $http.put(serverPath.path + 'server.php/post-edit', postEdit);
			var def = $q.defer();
			
			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
		
		this.allPosts = function() {
			var promise = $http.get(serverPath.path + 'server.php/all-posts');
			var def = $q.defer();
			
			promise.then(function(response) {
				var posts = response.data;
				for(var i = 0; i < posts.length; i++) {
					if(posts[i].shortDesc.indexOf('%') != -1) {
						posts[i].shortDesc = decodeURIComponent(posts[i].shortDesc.replace(/\+/g, '%20'));
						posts[i].badge = decodeURIComponent(posts[i].badge.replace(/\+/g, '%20'));
						posts[i].content = decodeURIComponent(posts[i].content.replace(/\+/g, '%20'));
						posts[i].recepie = decodeURIComponent(posts[i].recepie.replace(/\+/g, '%20'));
						posts[i].recepieHowTo = decodeURIComponent(posts[i].recepieHowTo.replace(/\+/g, '%20'));
					}
				}
				
				return def.resolve(response);
			});
			
			return def.promise;
		};
	}]);

	app.service('MailService', ['$rootScope', '$http', '$q', '$location', function($rootScope, $http, $q, $location) {

		this.sendEmail = function(form) {
			var promise = $http.post('server.php/send-email', form);
			var def = $q.defer();

			promise.then(function(response) {
				return def.resolve(response);
			});
			
			return def.promise;
		};
	}]);

	app.service('SEOService', ['$rootScope', '$http', '$q', '$location',
			function($rootScope, $http, $q, $location) {

		this.changeSEO = function(title, desc) {
			var baseTitle = 'בריא בריא - מתכונים בריאים | ';
			title = baseTitle + title;
			$rootScope.SEO = {title: title, desc: desc};
		};
	}]);

	// --- Controllers ---
	app.controller('NavBarCtrl', ['$scope', 'UserService', function($scope, UserService) {
		$scope.isCollapsed = true;
		
		$scope.logout = function() {
			UserService.logout();
		};
	}]);

	app.controller('MainController', ['$rootScope', '$scope', '$location', '$timeout', '$anchorScroll', 'FileUploader', '$window', 'SEOService',
					function($rootScope, $scope, $location, $timeout, $anchorScroll, FileUploader, $window, SEOService) {
		
		$scope.isActive = false;
	  	$scope.activeBtn = function() {
	    	$scope.isActive = !$scope.isActive;
	    	$scope.isCollapsed = !$scope.isCollapsed;
	  	};
						
		$scope.uploader = new FileUploader({
							url: 'server.php/upload-img',
							autoUpload: true,
		});
		
		$scope.uploader.onSuccessItem = function(item, response, status, headers) {
			console.log('Upload Image ' + response);
			$scope.uploader.formData = { id: response.id };
		};
		
		$scope.uploader.onAfterAddingFile = function(item) {
			$scope.uploader.formData = { id: '' };
		};
		
		$scope.$on('$routeChangeStart', function(next, current) {
			/* jshint ignore:start */
			$scope.jumbotron = (current['$$route'].jumbotron);
			/* jshint ignore:end */

			// Fix Jumbotron height
			$scope.jumbotronHeight = $window.innerHeight;
			$scope.jumbotronHeightStyle = 'jumbotronHeight={"height:' + $scope.jumbotronHeight +'"}"';

			/* jshint ignore:start */
			$scope.recepieBtn = (current['$$route'].recepieBtn);
			$scope.adminBtns = (current['$$route'].adminBtns);
			$scope.actionBtn = (current['$$route'].actionBtn);
			$scope.toLogin = (current['$$route'].toLogin);
			/* jshint ignore:end */

			$rootScope.user = JSON.parse(localStorage.getItem('user'));

			/* jshint ignore:start */
			var SEOTitle = (current['$$route'].SEOTitle);
			var SEODesc = (current['$$route'].SEODesc);
			/* jshint ignore:end */
			
			SEOService.changeSEO(SEOTitle, SEODesc);
		});
		
		$scope.gotoPosts = function() {
			var height = $window.innerHeight;
			var target = $location.hash('posts');
			$anchorScroll.yOffset = 50;
			$anchorScroll(target);
		};
		
		$scope.gotoRecepie = function() {
			var height = $window.innerHeight;
			var target = $location.hash('recepie');
			$anchorScroll.yOffset = 100;
			$anchorScroll(target);
		};
	}]);

	app.controller('HomeController', ['$scope', '$http', 'PostService', function($scope, $http, PostService) {
		var posts = PostService.allPosts();
		
		posts.then(function(response) {
			$scope.posts = response.data;
			console.log('All Posts');
			console.log(response);
		});
	}]);

	app.controller('ArchiveController', ['$scope', '$routeParams', 'PostService', 'SEOService',
					function($scope, $routeParams, PostService, SEOService) {
		var month = $routeParams.month;
		var year = $routeParams.year;
		var monthYear = month + '/' + year;

		$scope.month = month;
		$scope.year = year;
		SEOService.changeSEO('ארכיון ' + monthYear, 'ריכוז כל הפוסטים בבלוג הבריאות בריא בריא שפורסמו בתאריך ' + monthYear);

		var posts = PostService.postsByMonthYear(month, year);
		
		posts.then(function(response) {
			$scope.posts = response.data;
			console.log('Archive Posts');
			console.log(response);
		});
	}]);

	app.controller('PostController', ['$location', '$scope', '$routeParams', 'PostService', 'SEOService', 'Facebook',
				    function($location, $scope, $routeParams, PostService, SEOService, Facebook) {
		var postId = $routeParams.id;
		var post = PostService.postById(postId);

		$scope.FBShare = function() {
			ga('send', {
			  hitType: 'event',
			  eventCategory: 'social',
			  eventAction: 'share',
			  eventLabel: postId
			});

			var url = $location.absUrl();

			FB.ui({
				method: 'share',
				href: url,
				name: 'בריא בריא',
				picture: 'http://bbari.co.il/img/posts/' + $scope.post.imgId + '.jpg',
				title: $scope.post.title,
				description: $scope.post.shortDesc
			}, function(response){});
  		};
		
		post.then(function(response) {
			$scope.post = response.data[0];
			console.log('A Post');
			console.log(response);
			SEOService.changeSEO(response.data[0].title, response.data[0].shortDesc);
		});
	}]);

	app.controller('PostEditController', ['$location', '$scope', '$filter', '$routeParams', 'PostService', 'UserService',
					function($location, $scope, $filter, $routeParams, PostService, UserService) {
		var postId = $routeParams.id;
		var post = PostService.postById(postId);

		var cuurentUser = UserService.getUserDetails();
		if(!cuurentUser || cuurentUser.permissions < 4) {
			$location.path('/');
		}

		post.then(function(response) {
			$scope.post = response.data[0];
			$scope.post.date = new Date(response.data[0].date);
			$scope.post.authorId = response.data[0].authorId;
			$scope.post.authorName = response.data[0].authorName;
			$scope.uploader.formData = { id: response.data[0].imgId };
		});
		
		$scope.postEdit = function() {
			$scope.post.imgId = $scope.uploader.formData.id;
			var status = PostService.postEdit($scope.post);

			titleSpaceless = $filter('spaceless')($scope.post.title);
			$location.path('post/' + $scope.post.id + '/' + titleSpaceless);
		};
	}]);
	
	app.controller('PostNewController', ['$location', '$scope', '$filter', '$http', 'PostService', 'UserService',
					function($location, $scope, $filter, $http, PostService, UserService) {
		$scope.post = PostService.emptyPost();
		
		var cuurentUser = UserService.getUserDetails();
		if(!cuurentUser || cuurentUser.permissions < 4) {
			$location.path('/');
		}
		$scope.post.authorId = cuurentUser.id;
		$scope.post.authorName = cuurentUser.name;
		
		$scope.postNew = function() {
			$scope.post.imgId = $scope.uploader.formData.id;
			var status = PostService.postNew($scope.post);

			status.then(function(response) {
				console.log('New Post Added');
				console.log(response);
				titleSpaceless = $filter('spaceless')(response.data.title);
				$location.path('post/' + response.data.id + '/' + titleSpaceless);
			});
		};
	}]);
	
	app.controller('UserController', ['$location', '$scope', '$http', 'UserService', 'Facebook',
					function($location, $scope, $http, UserService, Facebook) {
						
		$scope.user = UserService.emptyUser();
		
		$scope.registerUser = function() {
			var status = UserService.registerUser($scope.user);
			
			$scope.loginUser();
		};
		
		$scope.loginUser = function() {
			var status = UserService.loginUser($scope.user);
			
			status.then(function(response) {
				var isLoggedIn = response.data.length ? 'Logged In' : 'Wrong Credentials';
				if(isLoggedIn == 'Logged In') {
					UserService.setLogin(response.data);
					console.log('User Login');
					console.log(response);
				}
				else {
					alert('פרטים שגויים');
				}
			});
		};

	    $scope.FBlogin = function() {
	      	// From now on you can use the Facebook service just as Facebook api says
			Facebook.login(function(response) {
	        	console.log(response);
	        	if(response.status === 'connected') {
	        		console.log('connected to FB');
	        		$scope.FBme();
	        	}
	        	else {
	        		console.log('not connected to FB');
	        	}
			});
	    };

	    $scope.FBme = function() {
			Facebook.api('/me', function(response) {
				console.log(response);
				var FBuser = [{email: 'fb@fb.com', password: 'none', name: response.name, permissions: 2}];
				console.log(FBuser);
				UserService.setLogin(FBuser);
			});
	    };
	}]);
	
	app.controller('SendEmailController', ['$timeout', '$scope', '$http', 'MailService',
					function($timeout, $scope, $http, MailService) {
		$scope.formData = {};

		$scope.submit = function() {
			console.log('Form Send');
			console.log(this.formData);

			var status = MailService.sendEmail(this.formData);

			status.then(function(response) {
				console.log(response);
				$scope.statusBtn = response.data ? 'נשלח בהצלחה' : 'התרחשה שגיאה';

			    $timeout(function() {
					$scope.statusBtn = false;
			    }, 2300);
			});
		};
	}]);
})();
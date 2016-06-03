(function(){
	var app = angular.module('posts', []);

	app.directive('postForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/post-form.html',
		};
	});

	app.directive('post', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/post.html'
		};
	});

	app.directive('postPreview', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/post-preview.html'
		};
	});

	app.directive('postPreviewSearch', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/post-preview-search.html'
		};
	});
	
})();
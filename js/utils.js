(function(){
	var app = angular.module('utils', []);

	app.directive('loading', ['$http', '$timeout', function ($http, $timeout) {
	    return {
	        restrict: 'A',
	        link: function (scope, elm, attrs) {
	            scope.isLoading = function () {
	                return $http.pendingRequests.length > 0;
	            };

	            scope.$watch(scope.isLoading, function (v) {
	                if(v) {
	                    scope.loader = true;
	                } else {
					    $timeout(function() {
							scope.loader = false;
					    }, 300);
	                }
	            });
	        }
	    };
	}]);

	app.directive('fullHeight', ['$window', function ($window) {
	    return {
	        restrict: 'A',
	        link: function (scope, elem, attrs) {
	            var winHeight = $window.innerHeight;
	            var winWidth = $window.innerWidth;
	            winHeight = winHeight - 50;
	            elem.css('height', winHeight + 'px');
	        }
	    };
	}]);

	app.directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
    	        });
	        }
	    };
	});

	app.controller('ModalCtrl', ['$location', '$scope', '$modal', 'PostService', function($location, $scope, $modal, PostService) {
		$scope.open = function (modalContent, postId) {
			
			var title = '';
			var content = '';
			var action = '';
			
			if(modalContent === 'postDelete') {
				title = 'למחוק את הפוסט?';
				action = 'postDelete';
			}
			
		    var modalInstance = $modal.open({
				templateUrl: 'partials/modal.html',
		      	controller: 'ModalInstanceCtrl',
		      	size: 'sm',
		      	scope: $scope,
		      	resolve: {
		      			 	title: function() {
		      			 		return title;
		      			 	},
		      			 	content: function() {
		      			 		return content;
		      			 	},
		      			 	postId: function() {
		      			 		return postId;
		      			 	},
		      			 	action: function() {
		      			 		return action;
		      			 	}
		      			 }
		    	}
		    );
	
		    modalInstance.result.then(function (answer) {
		    	switch(answer.action) {
		    		case 'postDelete': 
		    			var status = PostService.postDelete(answer.postId);
						status.then(function(response) {
							console.log('Post Deleted');
							console.log(response);
							$location.path('/');
						});
		    	}
		    	
		    },
		    function () {
		    	// do if modal CANCEL
		    });
	  };
	}]);
	
	app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'title', 'content', 'postId', 'action',
			function($scope, $modalInstance, title, content, postId, action) {
		$scope.title = title;
		$scope.content = content;
		
		$scope.ok = function () {
			var answer = {
				action: action,
				postId: postId
			};

			$modalInstance.close(answer);
	  	};
	
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);

	app.filter('searchFor', function(){
	    return function(arr, searchString){
	        if(!searchString){
	            return arr;
	        }
	        var result = [];
	        searchString = searchString.toLowerCase();
	        angular.forEach(arr, function(item){
	            if(item.title.toLowerCase().indexOf(searchString) !== -1){
	            result.push(item);
	        }
	        });
	        return result;
	    };
	});

	app.filter('spaceless', function() {
	    return function(input) {
	        if(input) {
	            return input.replace(/\s+/g, '-');  
	        }
	    };
	});

})();
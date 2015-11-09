/**
 * Created by colinjlacy on 11/9/15.
 */
angular.module('pb.search', [])
	.config(function($stateProvider) {
		$stateProvider
			.state('search', {
				url: "search/",
				templateUrl: './src/search/views/search.main.html',
				controller: 'searchCtrl'
			});
	});

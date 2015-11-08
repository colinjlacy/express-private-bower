/**
 * Created by colinjlacy on 11/8/15.
 */
angular.module('pb.packages', [])
	.config(function($stateProvider) {
		$stateProvider
			.state('packages', {
				url: "packages/",
				templateUrl: './src/packages/views/packages.main.html',
				controller: 'packageCtrl'
			});
	});

angular.module('pb', [
	'ui.router',
	'pb.packages',
	'pb.search'
])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('root', {
				url: '/',
				templateUrl: './src/app.main.html'
			});
	});
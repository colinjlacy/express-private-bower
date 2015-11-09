angular.module('pb', [
	'ui.router',
	'pb.packages'
])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('root', {
				url: "/",
				templateUrl: './src/app.main.html',
				controller: 'appCtrl',
				abstract: true
			});
	})
	.run(($rootScope) => {
		$rootScope.$on("$stateChangeError", console.log.bind(console));
	});
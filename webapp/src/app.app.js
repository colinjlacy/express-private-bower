angular.module('pb', [
	'ui.router',
	'pb.packages'
])
	.config(function($stateProvider, $UrlRouterProvider) {
		$UrlRouterProvider.otherwise('/');
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
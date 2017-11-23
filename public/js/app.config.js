'use strict';

angular.module('oenator').config(function ($urlRouterProvider, $stateProvider, $httpProvider, $locationProvider, API_URL) {
    $urlRouterProvider.otherwise('/oenator/');
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('main', {
            url: '/oenator/',
            templateUrl: 'views/main.html',
            controller: 'FileCtrl'
        });
})

    .constant('API_URL', 'http://localhost:3000/oenator/')


    .run(function ($window) {
        var params = $window.location.search.substring(1);
        if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
            var pair = params.split('=');
            var code = decodeURIComponent(pair[1]);
            $window.opener.postMessage(code, $window.location.origin);
        }
    });
'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularUtils.directives.dirPagination',
    'ui.select',
    'ngProgress'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/analytics', {
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsCtrl'
      })
      .when('/analytics', {
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsCtrl'
      })
      .when('/prefs', {
        templateUrl: 'views/prefs.html',
        controller: 'PrefsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('settings', ['$cookies', function ($cookies) {
        var obj = {};
        obj.getConfig = function() {
            var url = $cookies.get('backend_url') || "";
            var username = $cookies.get('username') || "username";
            var password = $cookies.get('password') || "password";

            return {"url": url, "username": username, "password": password};
        };
        obj.setConfig = function(settings) {
            // this will set the expiration to 12 months
            var now = new Date();
            var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
            $cookies.put('backend_url', settings.url, {expires: exp});
            $cookies.put('username', settings.username, {expires: exp});
            $cookies.put('password', settings.password, {expires: exp});
        };
        return obj;
  }]);

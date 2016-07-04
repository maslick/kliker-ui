'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PrefsCtrl
 * @description
 * # PrefsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PrefsCtrl', ['$scope','$http', 'settings', function ($scope, $http, settings) {
      $scope.backend_addr = settings.getConfig().url;
      $scope.username = settings.getConfig().username;
      $scope.password = settings.getConfig().password;

      $scope.backend_addr_new = settings.getConfig().url;
      $scope.username_new = settings.getConfig().username;
      $scope.password_new = settings.getConfig().password;

      $scope.setPrefs = function() {
          $scope.status = false;
          settings.setConfig({
            "url": $scope.backend_addr_new,
            "username": $scope.username_new,
            "password": $scope.password_new
          });
          $scope.status = true;
      };
  }]);

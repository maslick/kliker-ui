'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PrefsCtrl
 * @description
 * # PrefsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PrefsCtrl', [
              '$scope',
              '$http',
              'settings',
              'notification',
              'ngProgressFactory',
              function ($scope, $http, settings, notification, ngProgressFactory) {
      $scope.backend_addr = settings.getConfig().url;
      $scope.username = settings.getConfig().username;
      $scope.password = settings.getConfig().password;

      $scope.backend_addr_new = settings.getConfig().url;
      $scope.username_new = settings.getConfig().username;
      $scope.password_new = settings.getConfig().password;

      $scope.progressbar = ngProgressFactory.createInstance();

      $scope.setPrefs = function() {
          settings.setConfig({
            "url": $scope.backend_addr_new,
            "username": $scope.username_new,
            "password": $scope.password_new
          });
          notification.ok("OK", "New settings have been set");
      };

      $scope.testConnection = function() {
        $scope.progressbar.start();

        var url = $scope.backend_addr_new + "/_ah/api/linky/v1/campaign/getAll";
        $http.defaults.headers.common.Authorization = 'Basic ' + btoa($scope.username_new + ":" + $scope.password_new);
        $http.get(url).then(function(response) {
              $scope.progressbar.complete();
              notification.ok("Ok", "Connection is steady");
        },
        function(error) {
              $scope.progressbar.complete();
              if (error.status == "401") {
                  notification.err401();
              }
              else {
                  notification.err404();
              }
        });
      };
  }]);

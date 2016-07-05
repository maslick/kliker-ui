'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', [
              '$scope',
              '$http',
              'settings',
              'ngProgressFactory',
              'notification',
              function ($scope, $http, settings, ngProgressFactory, notification) {

      $scope.backend_addr = settings.getConfig().url;
      $scope.username = settings.getConfig().username;
      $scope.password = settings.getConfig().password;

      $scope.progressbar = ngProgressFactory.createInstance();

      $http.defaults.headers.common.Authorization = 'Basic ' + btoa($scope.username + ":" + $scope.password);

      $scope.list = [];
      $scope.getAll = function () {
          $scope.progressbar.start();
          var url=$scope.backend_addr + "/_ah/api/linky/v1/campaign/getAll";
          $http.get(url).then(function(response) {
                angular.copy(response.data.items, $scope.list);
                $scope.progressbar.complete();
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

      $scope.getAll();
      $scope.campaign = {};
      $scope.platform = [{}];


      $scope.addPlatform = function() {
          $scope.platform.push({});
      };

      $scope.popPlatform = function() {
          $scope.platform.pop();
      };

      $scope.setPlatforms = function() {
          $scope.campaign.platform = [];
          for (var key in $scope.platform) {
              if ($scope.platform.hasOwnProperty(key)) {
                  if (typeof $scope.platform[key].name !== "undefined") {
                      $scope.campaign.platform.push($scope.platform[key].name);
                  }
              }
          }

          $scope.progressbar.start();
          $http.post($scope.backend_addr + "/_ah/api/linky/v1/campaign/add", $scope.campaign).then(function(response) {
                if (response.data.status === "OK") {
                    notification.ok("Success","New campaign added", '<i class="glyphicon glyphicon-plus"></i>');
                    $scope.progressbar.complete();
                    $scope.getAll();
                }
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

      $scope.clearCampaign = function() {
          $scope.campaign = {};
          $scope.platform = [{}];
      };


      $scope.searchByPlatform = function () {
          $scope.progressbar.start();
          $scope.listByPlatform = [];
          var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/findByPlatform" + "?platform=" + $scope.plat;
          $http.get(url).then(function(response) {
                angular.copy(response.data.items, $scope.listByPlatform);
                $scope.progressbar.complete();
          },function(error) {
                $scope.progressbar.complete();
                if (error.status == "401") {
                    notification.err401();
                }
                else {
                    notification.err404();
                }
          });
      };

      $scope.deleteCampaign = function (id) {
          $scope.progressbar.start();
          var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/delete?campaign=" + id;
          $http.get(url).then(function(response) {
                $scope.progressbar.complete();
                if (response.data.status === "OK") {
                    $scope.getAll();
                    notification.ok("Success","Campaign deleted", '<i class="glyphicon glyphicon-remove"></i>');
                }
          },function(error){
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

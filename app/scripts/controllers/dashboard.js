'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', ['$scope','$http', 'settings', function ($scope, $http, settings) {
      $scope.backend_addr = settings.getConfig().url;
      $scope.username = settings.getConfig().username;
      $scope.password = settings.getConfig().password;

      $http.defaults.headers.common.Authorization = 'Basic ' + btoa($scope.username + ":" + $scope.password);

      $scope.list = [];
      $scope.getAll = function () {
          var url=$scope.backend_addr + "/_ah/api/linky/v1/campaign/getAll";
          $http.get(url).success(function(data) {
                angular.copy(data.items, $scope.list);
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

          $http.post($scope.backend_addr + "/_ah/api/linky/v1/campaign/add", $scope.campaign).success(function(data) {
              if (data.status === "OK") {
                  $scope.campaign_ready = true;
                  $scope.getAll();
              }
          });
      };

      $scope.clearCampaign = function() {
          $scope.campaign = {};
          $scope.platform = [{}];
          $scope.campaign_ready = false;
      };


      $scope.searchByPlatform = function () {
          $scope.listByPlatform = [];
          var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/findByPlatform" + "?platform=" + $scope.plat;
          $http.get(url).success(function(data) {
                angular.copy(data.items, $scope.listByPlatform);
          });
      };

      $scope.deleteCampaign = function (id) {
        var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/delete?campaign=" + id;
        $http.get(url).success(function(data) {
              if (data.status === "OK") {
                  $scope.getAll();
              }
        });
      };



  }]);

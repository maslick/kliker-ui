'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', ['$scope','$http', function ($scope, $http) {
      $scope.list = [];
      var url="http://localhost:8080/_ah/api/linky/v1/campaign/getAll";
      $scope.getAll = function () {
          $http.get(url).success(function(data) {
                //$scope.list = data.items;
                angular.copy(data.items, $scope.list);
                console.log(data);
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

          $http.post("http://localhost:8080/_ah/api/linky/v1/campaign/add", $scope.campaign).success(function(data) {
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
          var url = "http://localhost:8080/_ah/api/linky/v1/campaign/findByPlatform" + "?platform=" + $scope.plat;
          $http.get(url).success(function(data) {
                console.log(data);
                angular.copy(data.items, $scope.listByPlatform);
          });
      };



  }]);

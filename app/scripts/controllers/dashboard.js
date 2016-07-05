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
              '$window',
              function ($scope, $http, settings, ngProgressFactory, $window) {

      $scope.backend_addr = settings.getConfig().url;
      $scope.username = settings.getConfig().username;
      $scope.password = settings.getConfig().password;

      $scope.progressbar = ngProgressFactory.createInstance();
      var Snarl = $window.Snarl;
      var timeout = 8000;

      var err404 = function () {
          Snarl.addNotification({
              title: "Cannot connect",
              text: "Try again later or change backend URL",
              icon: '<i class="glyphicon glyphicon-thumbs-down"></i>',
              timeout: timeout
          });
      };

      var err401 = function () {
          Snarl.addNotification({
              title: "Unauthorized",
              text: "Change admin credentials in the prefs",
              icon: '<i class="glyphicon glyphicon-thumbs-down"></i>',
              timeout: timeout
          });
      };

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
                    err401();
                }
                else {
                    err404();
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
          $http.post($scope.backend_addr + "/_ah/api/linky/v1/campaign/add", $scope.campaign).success(function(data) {
              if (data.status === "OK") {
                  $scope.campaign_ready = true;
                  $scope.progressbar.complete();
                  $scope.getAll();
              }
          }).error(function(data) {
              $scope.progressbar.complete();
          });
      };

      $scope.clearCampaign = function() {
          $scope.campaign = {};
          $scope.platform = [{}];
          $scope.campaign_ready = false;
      };


      $scope.searchByPlatform = function () {
          $scope.progressbar.start();
          $scope.listByPlatform = [];
          var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/findByPlatform" + "?platform=" + $scope.plat;
          $http.get(url).success(function(data) {
                angular.copy(data.items, $scope.listByPlatform);
                $scope.progressbar.complete();
          }).error(function(data) {
                $scope.progressbar.complete();
          });
      };

      $scope.deleteCampaign = function (id) {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/delete?campaign=" + id;
        $http.get(url).success(function(data) {
              $scope.progressbar.complete();
              if (data.status === "OK") {
                  $scope.getAll();
              }
        }).error(function(data){
              $scope.progressbar.complete();
        });
      };



  }]);

'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AnalyticsCtrl
 * @description
 * # AnalyticsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AnalyticsCtrl', [
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

    $scope.getAll = function () {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/getAll";
        $http.get(url).then(function(response) {
              $scope.progressbar.complete();
              angular.copy(response.data.items, $scope.list);
              $scope.createPlatformList();
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
    $scope.list = [];
    $scope.getAll();
    $scope.counterByPlatform = 0;
    $scope.counterByPlatformAndCampaign = 0;

    $scope.getClicksByPlatform = function (platform) {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/counter/platform?platform=" + platform;
        $http.get(url).then(function(response) {
              $scope.progressbar.complete();
              if (response.data.status === "OK") {
                  $scope.counterByPlatform = response.data.message;
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

    $scope.getClicksByPlatformAndCampaign = function (platform,campaign) {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/counter?platform="+ platform+"&campaign="+campaign;
        $http.get(url).then(function(response) {
              $scope.progressbar.complete();
              if (response.data.status === "OK") {
                  $scope.counterByPlatformAndCampaign = response.data.message;
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

    $scope.createPlatformList = function() {
      var tempArr = [];
      $scope.platformsList = [];
      var array = $scope.list;
      for (var i = 0; i < array.length; i++) {
          var subarray = array[i].platform;
          if(typeof(subarray) === undefined || !subarray) { continue; }
          for (var j = 0; j < subarray.length; j++) {
              if (typeof(subarray[j]) !== undefined) {
                  tempArr.push(subarray[j]);
              }
          }
      }
      var array2 = unique(tempArr);
      for (i = 0; i < array2.length; i++) {
        $scope.platformsList.push({"name": array2[i]});
      }
    };

    function unique(arr) {
        var u = {}, a = [];
        for(var i = 0, l = arr.length; i < l; ++i){
            if(!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }

    $scope.platform = {};
    $scope.campaign = {};

  }]);

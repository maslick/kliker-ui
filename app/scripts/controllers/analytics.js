'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AnalyticsCtrl
 * @description
 * # AnalyticsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AnalyticsCtrl', ['$scope','$http', 'settings', 'ngProgressFactory', function ($scope, $http, settings, ngProgressFactory) {
    $scope.backend_addr = settings.getConfig().url;
    $scope.username = settings.getConfig().username;
    $scope.password = settings.getConfig().password;

    $scope.progressbar = ngProgressFactory.createInstance();

    $http.defaults.headers.common.Authorization = 'Basic ' + btoa($scope.username + ":" + $scope.password);

    $scope.getAll = function () {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/campaign/getAll";
        $http.get(url).success(function(data) {
              angular.copy(data.items, $scope.list);
              $scope.createPlatformList();
              $scope.progressbar.complete();
        }).error(function(data) {
              $scope.progressbar.complete();
        });
    };
    $scope.list = [];
    $scope.getAll();
    $scope.counterByPlatform = 0;
    $scope.counterByPlatformAndCampaign = 0;

    $scope.getClicksByPlatform = function (platform) {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/counter/platform?platform="+platform;
        $http.get(url).success(function(data) {
              $scope.progressbar.complete();
              if (data.status === "OK") {
                  $scope.counterByPlatform = data.message;
              }
        }).error(function(data){
              $scope.progressbar.complete();
        });
    };

    $scope.getClicksByPlatformAndCampaign = function (platform,campaign) {
        $scope.progressbar.start();
        var url = $scope.backend_addr + "/_ah/api/linky/v1/counter?platform="+ platform+"&campaign="+campaign;
        $http.get(url).success(function(data) {
              $scope.progressbar.complete();
              if (data.status === "OK") {
                  $scope.counterByPlatformAndCampaign = data.message;
              }
        }).error(function(data){
              $scope.progressbar.complete();
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

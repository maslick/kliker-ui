'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AnalyticsCtrl
 * @description
 * # AnalyticsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AnalyticsCtrl', ['$scope','$http', function ($scope, $http) {
    $scope.getAll = function () {
        var url="http://127.0.0.1:8080/_ah/api/linky/v1/campaign/getAll";
        $http.get(url).success(function(data) {
              angular.copy(data.items, $scope.list);
              $scope.createPlatformList();
        });
    };
    $scope.list = [];
    $scope.getAll();
    $scope.counterByPlatform = 0;
    $scope.counterByPlatformAndCampaign = 0;

    $scope.getClicksByPlatform = function (platform) {
        var url="http://127.0.0.1:8080/_ah/api/linky/v1/counter/platform?platform="+platform;
        $http.get(url).success(function(data) {
              if (data.status === "OK") {
                  $scope.counterByPlatform = data.message;
              }
        });
    };

    $scope.getClicksByPlatformAndCampaign = function (platform,campaign) {
        var url="http://127.0.0.1:8080/_ah/api/linky/v1/counter?platform="+ platform+"&campaign="+campaign;
        $http.get(url).success(function(data) {
              if (data.status === "OK") {
                  $scope.counterByPlatformAndCampaign = data.message;
              }
        });
    };

    $scope.createPlatformList = function() {
      var tempArr = [];
      $scope.platformsList = [];
      var array = $scope.list;
      for (var i = 0; i < array.length; i++) {
          var subarray = array[i].platform;
          if(typeof(subarray) == undefined || !subarray) { continue };
          for (var j = 0; j < subarray.length; j++) {
              if (typeof(subarray[j]) !== undefined) {
                  tempArr.push(subarray[j]);
              }
          }
      }
      var array2 = unique(tempArr);
      // $scope.platformsList = unique(tempArr);
      for (var i = 0; i < array2.length; i++) {
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
    // $scope.campaign = {};

    // $scope.$watch('$scope.selected.value', function(newVal, oldVal){
    //     console.log('changed');
    // }, true);



  }]);

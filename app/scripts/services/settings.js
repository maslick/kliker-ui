'use strict';

/**
 * @ngdoc service
 * @name frontendApp.settings
 * @description
 * # settings
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
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

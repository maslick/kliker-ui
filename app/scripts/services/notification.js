'use strict';

/**
 * @ngdoc service
 * @name frontendApp.notification
 * @description
 * # notification
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('notification', ['$window', function ($window) {
    var Snarl = $window.Snarl;
    var timeout = 2000;
    var obj = {};

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

    var ok = function (title,text) {
      Snarl.addNotification({
          title: title || "Success",
          text: text || "Operation completed",
          icon: '<i class="glyphicon glyphicon-thumbs-up"></i>',
          timeout: timeout
      });
    };

    obj.err401 = err401;
    obj.err404 = err404;
    obj.ok = ok;
    obj.snarl = Snarl;
    return obj;

  }]);

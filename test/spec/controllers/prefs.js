'use strict';

describe('Controller: PrefsCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var PrefsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrefsCtrl = $controller('PrefsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

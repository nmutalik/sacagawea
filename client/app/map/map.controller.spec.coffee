'use strict'

describe 'Controller: MapCtrl', ->

  # load the controller's module
  beforeEach module 'sacagaweaApp'
  MapCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    MapCtrl = $controller 'MapCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1

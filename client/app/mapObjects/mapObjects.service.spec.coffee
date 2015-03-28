'use strict'

describe 'Service: mapObjects', ->

  # load the service's module
  beforeEach module 'sacagaweaApp'

  # instantiate service
  mapObjects = undefined
  beforeEach inject (_mapObjects_) ->
    mapObjects = _mapObjects_

  it 'should do something', ->
    expect(!!mapObjects).toBe true
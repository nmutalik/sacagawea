'use strict'

angular.module 'sacagaweaApp'
.factory 'mapObjects', ->

  posToObj: (pos) ->
    lat: pos.lat()
    lng: pos.lng()

  boundsToObj: (bounds) ->
    if bounds
      return {
        ne: this.posToObj bounds.getNorthEast()
        sw: this.posToObj bounds.getSouthWest()
      }
    else return undefined

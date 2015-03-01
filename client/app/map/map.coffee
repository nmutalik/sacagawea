'use strict'

angular.module 'sacagaweaApp'
.config ($stateProvider) ->
  $stateProvider.state 'map',
    url: '/'
    templateUrl: 'app/map/map.html'
    controller: 'MapCtrl'

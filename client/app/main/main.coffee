'use strict'

angular.module 'sacagaweaApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'main',
    url: '/default'
    templateUrl: 'app/main/main.html'
    controller: 'MainCtrl'

'use strict'

angular.module 'sacagaweaApp'
.controller 'MapCtrl', ($scope, socket) ->
  
  socket = new WebSocket "ws://10.0.170.9:8374/"
  
  mapOptions = {
    center: { lat: 36.131389, lng: -95.937222},
    zoom: 6
  }
  
  map = new google.maps.Map document.getElementById('map-canvas'), mapOptions

  socket.onopen = ->
    socket.send '{"type": "company_query"}'
    socket.send '{"type": "service_query"}'
    socket.send '{"type": "fault_query"}'

  $scope.faults = []

  companyMarkers = {}
  serviceMarkers = {}

  socketHandler =
    "company_query": (data) ->
      data.forEach (company) ->
        companyMarkers[company.id] = new google.maps.Marker
          icon: "http://localhost:9000/assets/images/silk/building.png"
          id: company.id
          map: map
          position: company.position
          title: company.name
    "service_query": (data) ->
      data.forEach (service) ->
        serviceMarkers[service.id] = new google.maps.Marker
          icon: "http://localhost:9000/assets/images/silk/car.png"
          id: service.id
          map: map
          position: service.position
    "fault_query": (data) ->
      $scope.faults = data.map (fault) ->
        companyMarkers[fault]
    "fault": (fault) ->
      $scope.$apply ->
        $scope.faults.push companyMarkers[fault]


  socket.onmessage = (message) ->
    data = JSON.parse message.data
    socketHandler[data.type] data.value
'use strict'

angular.module 'sacagaweaApp'
.controller 'MapCtrl', ($scope, $q, mapObjects, socket) ->

  socket = new WebSocket "ws://localhost:8374/"
  
  mapOptions =
    center: { lat: 36.131389, lng: -95.937222}
    zoom: 6
  
  map = new google.maps.Map document.getElementById('map-canvas'), mapOptions

  oldBounds = undefined


  socket.onopen = ->
    google.maps.event.addListener map, 'idle', () ->
      socket.send JSON.stringify
        type: "company_query"
        data: 
          old: mapObjects.boundsToObj oldBounds
          new: mapObjects.boundsToObj map.getBounds()
      socket.send JSON.stringify
        type: "service_query"
        data: 
          old: mapObjects.boundsToObj oldBounds
          new: mapObjects.boundsToObj map.getBounds()
      oldBounds = map.getBounds()

  companyData = {}
  serviceData = {}
  $scope.faultValues = []

  companyMarkers = {}
  serviceMarkers = {}

  companyWindows = {}
  companyListeners = {}

  companies = $q.defer()

  faultIcon = 
    scaledSize: new google.maps.Size(32, 32)
    url: '/assets/images/silk/exclamation.png'

  businessIcon = 
    scaledSize: new google.maps.Size(16, 16)
    url: '/assets/images/silk/building.png'

  serviceIcon = 
    scaledSize: new google.maps.Size(16, 16)
    url: '/assets/images/silk/car.png'

  $scope.goToFault = (fault) ->
    map.setZoom 15
    map.panTo companyData[fault.id].position

  plotCompany = (company) ->
    companyData[company.id] =
      id: company.id
      position: company.position
      name: company.name
    companyMarkers[company.id] = new google.maps.Marker
      icon: if company.fault then faultIcon else businessIcon
      id: company.id
      map: map
      position: company.position
      title: company.name

  plotService = (service) ->
    serviceData[service.id] =
      id: service.id
      position: service.position
    serviceMarkers[service.id] = new google.maps.Marker
      icon: serviceIcon
      id: service.id
      map: map
      position: service.position
  
  socketHandler =
    "company_query": (data) ->
      for company in data.removed
        delete companyData[company.id]
        delete companyMarkers[company.id]
        if company.fault
          _.remove($scope.faultValues, {id: company.id})

      for company in data.added
        plotCompany(company)
        if company.fault
          $scope.$apply ->
            $scope.faultValues.push company
          companyWindows[company.id] = new google.maps.InfoWindow
              content: companyData[company.id].name
          companyListeners[company.id] = google.maps.event.addListener \
            companyMarkers[company.id], 'click', () ->
              companyWindows[company.id].open map, companyMarkers[company.id]

      for fault in $scope.faultValues
        companyMarkers[fault.id].setZIndex google.maps.Marker.MAX_ZINDEX + 1

      $scope.$apply ->
        $scope.companyLength =  Object.keys(companyData).length



    "service_query": (data) ->
      for service in data.removed
        delete serviceData[service.id]
        delete serviceMarkers[service.id]

      for service in data.added
        plotService(service)
          
      $scope.$apply ->
        $scope.serviceLength =  Object.keys(serviceData).length

    "fault": (fault) -> 
      if fault in companyMarkers
        companyMarkers[fault].setIcon faultIcon
        companyMarkers[fault].setZIndex google.maps.Marker.MAX_ZINDEX + 1

        companyMarkers[fault].info = new google.maps.InfoWindow
              content: companyData[fault].name

        companyMarkers[fault].listener = google.maps.event.addListener \
          companyMarkers[fault], 'click', () ->
            companyMarkers[fault].info.open map, companyMarkers[fault]

        $scope.$apply ->
          $scope.faultValues.push companyMarkers[fault]



  socket.onmessage = (message) ->
    data = JSON.parse message.data
    socketHandler[data.type] data.value
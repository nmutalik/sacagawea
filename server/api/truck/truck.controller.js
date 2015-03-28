'use strict';

var _ = require('lodash');
var Truck = require('./truck.model');
var kd = require('kdtree');

var company_tree = new kd.KDTree(2);
Truck.find({}, function(err, trucks){
  for (var i = 0; i < trucks.length; ++i) {
    company_tree.insert(trucks[i].lat, trucks[i].lng, trucks[i]._id);
  }
  console.log('Successfully inserted trucks in kdtree');
});

/**
 * Middleware functions
*/
Truck.schema.pre('save', function (next, done) {
  next();
});

Truck.schema.pre('remove', function (next, done) {
  next();
});

/*
Internal functions
*/
// Creates an object
exports.create = function(params, callback) {
  Truck.create(params, callback);
}

// Finds an object by its id
exports.findById = function(id, callback) {
  Truck.findById(id, callback);
}

// Updates an object given the object and new parameters
exports.update = function(truck, params ,callback) {
  if(params._id) { delete params._id; }
  var updated = _.merge(truck, params);
  updated.save(function (err) {
    if (err) { return callback(err); }
    return callback(null, truck);
  });
}

//Deletes an object
exports.destroy = function(truck, callback) {
  truck.remove(function(err) {
    if(err) { return callback(err); }
    return callback(null);
  });
}

/*
* API functions
*/
// Get list of trucks
exports.index = function(req, res) {
  Truck.find(function (err, trucks) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(trucks);
  });
};

// Get a single truck
exports.showByIdReq = function(req, res) {
  Truck.findById(req.params.id, function (err, truck) {
    if(err) { return handleError(res, err); }
    if(!truck) { return res.status(404).send('Not Found'); }
    return res.json(truck);
  });
};

// Creates a new truck in the DB.
exports.createReq = function(req, res) {
  exports.create(req.body, function(err, truck) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(truck);
  });
};

// Updates an existing truck in the DB.
exports.updateReqById = function(req, res) {
  exports.findById(req.params.id, function (err, truck) {
    if (err) { return handleError(res, err); }
    if(!truck) { return res.status(404).send('Not Found'); }
    exports.update(truck, req.body, function(err, truck){
      if (err) { return handleError(res, err); }
      return res.status(200).json(truck);
    });
  });
};

// Deletes a truck from the DB.
exports.destroyReqById = function(req, res) {
  exports.findById(req.params.id, function (err, truck) {
    if(err) { return handleError(res, err); }
    if(!truck) { return res.status(404).send('Not Found'); }
    exports.destroy(truck, function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

/**
* Helper functions
*/

function handleError(res, err) {
  return res.status(500).send(err);
}
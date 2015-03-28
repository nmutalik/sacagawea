'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var kd = require('kdtree');

var company_tree = new kd.KDTree(2);
Business.find({}, function(err, businesses){
  for (var i = 0; i < businesses.length; ++i) {
    company_tree.insert(businesses[i].lat, businesses[i].lng, businesses[i]._id);
  }
  console.log('Successfully inserted businesses in kdtree');
});

/**
 * Middleware functions
*/
Business.schema.pre('save', function (next, done) {
  next();
});

Business.schema.pre('remove', function (next, done) {
  next();
});

/*
Internal functions
*/
// Creates an object
exports.create = function(params, callback) {
  Business.create(params, callback);
}

// Finds an object by its id
exports.findById = function(id, callback) {
  Business.findById(id, callback);
}

// Updates an object given the object and new parameters
exports.update = function(business, params ,callback) {
  if(params._id) { delete params._id; }
  var updated = _.merge(business, params);
  updated.save(function (err) {
    if (err) { return callback(err); }
    return callback(null, business);
  });
}

//Deletes an object
exports.destroy = function(business, callback) {
  business.remove(function(err) {
    if(err) { return callback(err); }
    return callback(null);
  });
}

/*
* API functions
*/
// Get list of businesss
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.showByIdReq = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

// Creates a new business in the DB.
exports.createReq = function(req, res) {
  exports.create(req.body, function(err, business) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(business);
  });
};

// Updates an existing business in the DB.
exports.updateReqById = function(req, res) {
  exports.findById(req.params.id, function (err, business) {
    if (err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    exports.update(business, req.body, function(err, business){
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroyReqById = function(req, res) {
  exports.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    exports.destroy(business, function(err) {
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
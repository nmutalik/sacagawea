/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');

/**
 * Middleware functions
*/
Thing.schema.pre('save', function (next, done) {
  next();
});

Thing.schema.pre('remove', function (next, done) {
  next();
});

/*
Internal functions
*/
// Creates an object
exports.create = function(params, callback) {
  Thing.create(params, callback);
}

// Finds an object by its id
exports.findById = function(id, callback) {
  Thing.findById(id, callback);
}

// Updates an object given the object and new parameters
exports.update = function(thing, params ,callback) {
  if(params._id) { delete params._id; }
  var updated = _.merge(thing, params);
  updated.save(function (err) {
    if (err) { return callback(err); }
    return callback(null, thing); //I think this should be updated
  });
}

//Deletes an object
exports.destroy = function(thing, callback) {
  thing.remove(function(err) {
    if(err) { return callback(err); }
    return callback(null);
  });
}

/*
* API functions
*/
// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(things);
  });
};

// Get a single thing
exports.showByIdReq = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.createReq = function(req, res) {
  exports.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(thing);
  });
};

// Updates an existing thing in the DB.
exports.updateReqById = function(req, res) {
  exports.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    exports.update(thing, req.body, function(err, thing){
      if (err) { return handleError(res, err); }
      return res.status(200).json(thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroyReqById = function(req, res) {
  exports.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    exports.destroy(thing, function(err) {
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
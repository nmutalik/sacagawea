/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Truck = require('./truck.model');

exports.register = function(socket) {
  Truck.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Truck.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('truck:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('truck:remove', doc);
}
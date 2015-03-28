'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User', require:false},
  name: {type: String, require:false, trim:true, default: 'Unnamed Thing'},
  info: {type: String, require:false, trim:true},
  active: {type: Boolean}
});

/**
 * Virtuals
 */
// Displays Thing's activity
ThingSchema
  .virtual('activity')
  .get(function() {
    return {
      'name': this.name,
      'active': this.active
    };
  });

/**
 * Validations
*/
// Validate empty name
ThingSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

/**
 * Methods
 */
ThingSchema.methods = {
  /**
   * has_name - returns if the user name is set
   *
   * @param
   * @return {Boolean}
   */
  has_name: function() {
    return this.name !== 'Unnamed Thing';
  }
};

module.exports = mongoose.model('Thing', ThingSchema);
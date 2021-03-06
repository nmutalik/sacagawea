'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  name: {type: String, require:false, trim:true},
  location: {
    lat: {type: Number, require:false, trim:true},
    lng: {type: Number, require:false, trim:true}
  }
});

/**
 * Virtuals
 */
// Displays Thing's activity
// BusinessSchema
//   .virtual('activity')
//   .get(function() {
//     return {
//       'name': this.name,
//       'active': this.active
//     };
//   });

// /**
//  * Validations
// */
// // Validate empty name
// BusinessSchema
//   .path('name')
//   .validate(function(name) {
//     return name.length;
//   }, 'Name cannot be blank');

// /**
//  * Methods
//  */
// BusinessSchema.methods = {
//   /**
//    * has_name - returns if the user name is set
//    *
//    * @param
//    * @return {Boolean}
//    */
//   has_name: function() {
//     return this.name !== 'Unnamed Thing';
//   }
// };

module.exports = mongoose.model('Business', BusinessSchema);
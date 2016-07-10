var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DestinationSchema = new Schema({
  location: String,
  haveBeen: Boolean,
  rating: Number,
});

var Destination = mongoose.model('Destination', DestinationSchema);

module.exports = Destination;

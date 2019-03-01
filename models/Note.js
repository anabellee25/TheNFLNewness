var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;

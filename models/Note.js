var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
  title: String,
  body: String
});

var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;

var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var articleSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
});

var Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;
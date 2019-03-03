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
  image: {
    type: String,
    required: false,
    default: "./public/images/nfl.png"
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
});

var Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;
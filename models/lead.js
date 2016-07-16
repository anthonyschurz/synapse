var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var leadSchema = new Lead({
  title: { type: String },
  content: { type: String }
});

var Post = mongoose.model('Lead', leadSchema);

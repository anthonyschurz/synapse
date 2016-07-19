var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var leadSchema = new Lead({
  first_name: { type: String },
  last_name: { type: String },
  job_title: { type: String },
  company: { type: String }
});

var Post = mongoose.model('Lead', leadSchema);

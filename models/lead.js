var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var leadSchema = new Lead({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phoneNo: { type: String },
  jobTitle: { type: String },
  company: { type: String }
});

var Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;

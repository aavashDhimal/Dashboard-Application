const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  source: { type: String, enum: ['apache', 'nginx'] },
  ipAddress: { type: String },
  dateTime: {
    type: Date,
  },
  httpMethod: { type: String },
  url: { type: String },
  httpStatus: { type: Number },
  responseSize: { type: String },
  raw: { type: String }
});

const logsModel = mongoose.model('LogData', logsSchema);

module.exports = logsModel;
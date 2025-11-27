const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    submitterIp: { type: String },   // <- Required for rate-limit
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);

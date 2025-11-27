// controllers/contactController.js
const Contact = require("../models/Contact");

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// Create Inquiry (IP-based rate limit)
exports.createInquiry = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;

    // Validate body
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, email, subject, message"
      });
    }

    // Find last submission from this same IP
    const lastInquiry = await Contact.findOne({ submitterIp: ip }).sort({ createdAt: -1 });

    if (lastInquiry) {
      const now = Date.now();
      const lastTime = new Date(lastInquiry.createdAt).getTime();
      const diff = now - lastTime;

      if (diff < WINDOW_MS) {
        const retryAfter = Math.ceil((WINDOW_MS - diff) / 1000);

        res.set("Retry-After", retryAfter.toString());

        return res.status(429).json({
          success: false,
          message: `You must wait ${retryAfter} seconds before submitting another inquiry.`,
          retryAfter
        });
      }
    }

    // Create new contact + store IP
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      submitterIp: ip
    });

    return res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

// Get all inquiries
exports.getInquiries = async (req, res, next) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

// Get one inquiry
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Contact.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// Update inquiry
exports.updateInquiry = async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: "Inquiry not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res, next) => {
  try {
    const removed = await Contact.findByIdAndDelete(req.params.id);

    if (!removed) return res.status(404).json({ success: false, message: "Inquiry not found" });

    res.json({ success: true, message: "Inquiry deleted" });
  } catch (err) {
    next(err);
  }
};

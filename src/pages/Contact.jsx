import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";
import Navigation from "../components/Home/Navigation";
import Header from "../components/common/Header";
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

const API_URL = `${BASE_URL}/api/contacts`;
const HEADER_IMAGE = "https://images.pexels.com/photos/4046791/pexels-photo-4046791.jpeg"; 
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (retryAfterSeconds > 0) {
      timer = setInterval(() => {
        setRetryAfterSeconds((s) => {
          if (s <= 1) {
            clearInterval(timer);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [retryAfterSeconds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (retryAfterSeconds > 0) {
      setError(`Please wait ${retryAfterSeconds} second(s) before trying again.`);
      return;
    }

    // Basic client validation
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      setError("Please fill in all required fields (name, email, subject, message).");
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      // success
      setIsSubmitted(true);
      resetForm();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      // network / server error handling
      if (err.response) {
        // server responded with a status
        const status = err.response.status;
        const data = err.response.data || {};
        if (status === 429) {
          // rate limited
          // prefer `Retry-After` header, fallback to response body
          const headerVal = err.response.headers["retry-after"];
          const retry = headerVal ? parseInt(headerVal, 10) : data.retryAfter || 300;
          setRetryAfterSeconds(Number(retry));
          setError(data.message || "Too many requests. Please wait before trying again.");
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError("Server error. Please try again later.");
        }
      } else if (err.request) {
        setError("No response from server. Check your connection or API server.");
      } else {
        setError("Request error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: "How accurate is the rice yield prediction?",
      answer:
        "Our AI model provides about 85–90% accuracy. Sudden weather changes may affect precision.",
    },
    {
      question: "Can I use the app offline?",
      answer: "Basic features work offline, but predictions & weather require internet.",
    },
    {
      question: "What regions are supported?",
      answer: "All major rice-growing regions across South Asia.",
    },
    {
      question: "Is the weather data real-time?",
      answer: "Yes, updated every 30 minutes from multiple sources.",
    },
    {
      question: "How can I improve my farm's yield?",
      answer:
        "Follow recommendations, use soil tests, and monitor rainfall patterns.",
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "support@riceprediction.com",
      link: "mailto:support@riceprediction.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+977-1-4123456",
      link: "tel:+977-1-4123456",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Kathmandu, Nepal",
      link: "#",
    },
  ];

  return (
    <>
      <Header className="mb-12" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 mt-24">
        {/* Top image/header using your uploaded file */}
        <div className="relative h-44 overflow-hidden rounded-b-lg">
          <img
            src={HEADER_IMAGE}
            alt="header"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center px-6">
            <h1 className="text-3xl text-white font-bold">Get in Touch</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="p-8 bg-white rounded-xl shadow-lg border">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {isSubmitted ? (
                <div className="bg-green-100 border border-green-400 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-semibold">
                    Thank you! We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="+977"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || retryAfterSeconds > 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Sending..." : retryAfterSeconds > 0 ? `Wait ${retryAfterSeconds}s` : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.link}
                  className="flex items-start gap-4 p-4 bg-white border rounded-lg shadow hover:border-green-400 transition"
                >
                  <div className="text-green-600">{info.icon}</div>
                  <div>
                    <p className="text-sm text-gray-600">{info.title}</p>
                    <p className="text-lg font-semibold">{info.value}</p>
                  </div>
                </a>
              ))}

              <div className="p-4 bg-green-50 border rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Response Time:</span> Within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 border">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-50 transition"
                  >
                    <span className="font-semibold">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-green-600 transition-transform ${expandedFAQ === index ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedFAQ === index && (
                    <div className="px-6 py-4 bg-green-50 border-t">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

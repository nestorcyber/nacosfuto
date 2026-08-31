
import React, { useState } from "react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const ReportIssue = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    category: "Safety Concern",
    subject: "",
    message: "",
  });

  const categories = [
    "Safety Concern",
    "Academic Issue",
    "Bullying/Harassment"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { category, subject, message } = formData;
    const whatsappMessage = `*Report Issue*\n\n*Category:* ${category}\n*Subject:* ${subject}\n*Message:* ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/2348123456789?text=${encodedMessage}`; // Replace with actual number
    window.open(whatsappUrl, "_blank");
  };

  const handleEmergency = () => {
      const emergencyMsg = encodeURIComponent("EMERGENCY REPORT: I have an urgent emergency situation!");
      window.open(`https://wa.me/2348123456789?text=${emergencyMsg}`, "_blank");
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div
          className={`max-w-2xl w-full p-8 rounded-2xl shadow-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Report an Issue</h1>
          <p className="mb-8 text-center opacity-80">
            We value your safety and feedback. Please select a category and tell us
            about your concern.
            <br />
            <span className="text-sm italic">
              (This will open a WhatsApp chat)
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief summary of the issue..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Describe the issue in detail..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              Submit Report via WhatsApp
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-600/30 text-center">
            <p className="mb-4 text-red-500 font-semibold">
              Is this a life-threatening emergency?
            </p>
            <button
              onClick={handleEmergency}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors animate-pulse shadow-lg ring-4 ring-red-500/20"
            >
              REPORT AN EMERGENCY
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportIssue;

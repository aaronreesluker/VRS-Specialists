"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    location: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColour: "",
    message: "",
    honeypot: "", // Spam prevention
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot check
    if (formData.honeypot) {
      return; // Silent fail for bots
    }

    setIsSubmitting(true);

    try {
      // Format email body
      const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Interest: ${formData.service}
Preferred Location: ${formData.location}
Vehicle: ${formData.vehicleMake} ${formData.vehicleModel} (${formData.vehicleYear}) - ${formData.vehicleColour}

Message:
${formData.message}
      `.trim();

      // Simulate form submission delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use mailto: to open email client
      window.location.href = `mailto:info@vrsspecialists.com?subject=Enquiry from ${formData.name}&body=${encodeURIComponent(emailBody)}`;

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        location: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColour: "",
        message: "",
        honeypot: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-green-600 mx-auto mb-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-2xl font-bold text-dark-900 mb-2">
          Thank You!
        </h3>
        <p className="text-dark-700 mb-4">
          We've received your enquiry and will get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="btn-secondary"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-dark-900">
        Request a Quote
      </h2>

      {error && (
        <div className="bg-red-50 border border-brand-red/30 text-brand-red p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-900 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-900 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark-900 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-dark-900 mb-2">
            Service Interest *
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a service</option>
            <option value="detailing">Car Detailing</option>
            <option value="correction">Paint Correction</option>
            <option value="coating">Ceramic Coating</option>
            <option value="ppf">PPF Protection</option>
            <option value="multiple">Multiple Services</option>
            <option value="other">Other / Consultation</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-dark-900 mb-2">
            Preferred Location *
          </label>
          <select
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select location</option>
            <option value="studio">Studio (Brighton)</option>
            <option value="mobile">Mobile Service</option>
            <option value="either">Either</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleMake" className="block text-sm font-medium text-dark-900 mb-2">
              Vehicle Make
            </label>
            <input
              type="text"
              id="vehicleMake"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              placeholder="e.g. BMW"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="vehicleModel" className="block text-sm font-medium text-dark-900 mb-2">
              Model
            </label>
            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="e.g. 3 Series"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleYear" className="block text-sm font-medium text-dark-900 mb-2">
              Year
            </label>
            <input
              type="text"
              id="vehicleYear"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleChange}
              placeholder="e.g. 2020"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="vehicleColour" className="block text-sm font-medium text-dark-900 mb-2">
              Colour
            </label>
            <input
              type="text"
              id="vehicleColour"
              name="vehicleColour"
              value={formData.vehicleColour}
              onChange={handleChange}
              placeholder="e.g. Black"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-dark-900 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Tell us about your vehicle and what you're looking to achieve..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Enquiry"
          )}
        </button>
      </div>
    </form>
  );
}

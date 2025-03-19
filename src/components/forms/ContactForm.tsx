"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Aqui você pode adicionar a lógica para enviar o formulário
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full p-2 mt-1 bg-black border border-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-2 mt-1 bg-black border border-muted-foreground rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            className="w-full p-2 mt-1 bg-black border border-muted-foreground  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
            className="w-full p-2 mt-1 bg-black border border-muted-foreground rounded-md  h-32 focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          className=" p-2 border border-muted-foreground  rounded-md text-white font-semibold transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

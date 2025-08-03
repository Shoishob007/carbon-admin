import { Mail } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import qs from "qs";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/auth";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  interested: string;
  message: string;
}

const ContactPage = () => {
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    interested: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user, fetchUserProfile, loading, error } = useUserStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken && !user) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, fetchUserProfile, user]);

  // Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      // Extract first and last name from user.name
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setForm({
        firstName,
        lastName,
        email: user.email || '',
        phone: user.business_profile?.phone_number || '',
        company: user.business_profile?.company_name || '',
        location: '', // No direct mapping in user data
        interested: '', // No direct mapping in user data
        message: '', // Leave empty
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        business_email: form.email,
        phone: form.phone,
        company_name: form.company,
        company_location: form.location,
        interests: form.interested,
        message: form.message,
      };

      const query = qs.stringify({ type: "talk" });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/send-email/?${query}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      Swal.fire({
        title: "Form Submitted!",
        text: "Thank you for contacting us. We will get back to you soon.",
        icon: "success",
        confirmButtonColor: "#0a2d23",
        confirmButtonText: "OK",
      });

      // Don't reset the form completely, just the message field
      setForm(prev => ({
        ...prev,
        message: "",
      }));
    } catch (error) {
      Swal.fire({
        title: "Submission Failed",
        text: "Sorry, there was a problem submitting your message. Please try again.",
        icon: "error",
        confirmButtonColor: "#0a2d23",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading user data: {error}
      </div>
    );
  }

  return (
    <section className="w-full bg-white flex items-center justify-center min-h-screen">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="flex flex-col">
          {/* Top: Hero */}
          <div className="rounded-t-2xl rounded-b-lg bg-[#0a2d23] p-8 md:p-10 text-left mb-2">
            <h1
              className="text-white text-4xl font-semibold mb-5 leading-tight"
              style={{ lineHeight: 1.1, fontWeight: 600 }}
            >
              Get in Touch with <span className="text-primary">Our Admin</span>
            </h1>
            <p className="text-[#eaf6e5] text-lg leading-relaxed">
              We'd love to learn more about your company and how we can assist
              you. Fill out the form to tell us more, and we'll get back to you.
            </p>
          </div>

          {/* Middle: Direct Contact Message */}
          <div className="rounded-lg bg-[#eaf3e5] text-[#1a3323] text-lg px-6 py-4 mb-2">
            If you prefer, feel free to contact us directly via the emails
            listed below.
          </div>

          {/* Contact grid */}
          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="rounded-lg bg-white px-6 pt-3 pb-3">
              <div className="font-semibold text-[#1a3323] mb-1">
                General Inquiries
              </div>
              <div className="text-[#1a3323] text-base">
                hello@aiemissionlab.com
              </div>
            </div>
            <div className="rounded-lg bg-white px-6 pb-3">
              <div className="font-semibold text-[#1a3323] mb-1">Sales</div>
              <div className="text-[#1a3323] text-base">
                sales@aiemissionlab.com
              </div>
            </div>
            <div className="mb-4 text-[#1a3323] text-sm leading-relaxed">
              By submitting this form, you are consenting to Emission Lab is
              contacting you. For information on how to unsubscribe, as well as
              our privacy practices, check out our{" "}
              <a href="/terms" className="text-[#2357b4] underline">
                Terms And Conditions
              </a>
              .
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <form
          className="rounded-2xl bg-white border border-[#d8e3c7] px-10 py-8 flex flex-col justify-between"
          style={{ minHeight: 640 }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <label
                className="block text-[#1a3323] font-medium mb-2"
                htmlFor="firstName"
              >
                First name<span className="text-[#ef4444]">*</span>
              </label>
              <input
                required
                id="firstName"
                className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition"
                value={form.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-[#1a3323] font-medium mb-2"
                htmlFor="lastName"
              >
                Last name<span className="text-[#ef4444]">*</span>
              </label>
              <input
                required
                id="lastName"
                className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition"
                value={form.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="email"
            >
              Business email<span className="text-[#ef4444]">*</span>
            </label>
            <input
              required
              id="email"
              type="email"
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition"
              value={form.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="phone"
            >
              Phone<span className="text-[#ef4444]">*</span>
            </label>
            <input
              required
              id="phone"
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition"
              value={form.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="company"
            >
              Company Name
            </label>
            <input
              id="company"
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition"
              value={form.company}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <label
                className="block text-[#1a3323] font-medium mb-2"
                htmlFor="location"
              >
                Company Location?
              </label>
              <select
                id="location"
                className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base text-[#6d7c6e] outline-none focus:ring-2 focus:ring-primary transition"
                value={form.location}
                onChange={handleInputChange}
              >
                <option value="">Please Select</option>
                <option value="us">United States</option>
                <option value="eu">Europe</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                className="block text-[#1a3323] font-medium mb-2"
                htmlFor="interested"
              >
                I'm facing problem in
              </label>
              <select
                required
                id="interested"
                className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base text-[#6d7c6e] outline-none focus:ring-2 focus:ring-primary transition"
                value={form.interested}
                onChange={handleInputChange}
              >
                <option value="">Please Select</option>
                <option value="offsetting">Offsetting</option>
                <option value="api">API Integration</option>
                <option value="projects">Project Listing</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          {/* Message textarea */}
          <div className="mb-5">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              required
              id="message"
              rows={5}
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary transition resize-none"
              value={form.message}
              onChange={handleInputChange}
              placeholder="How can we help you?"
              style={{ minHeight: 120 }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="rounded-lg bg-primary hover:bg-primary/90 text-white font-bold justify-center text-base flex items-center gap-2 shadow-lg px-8 py-3 transition mt-1 disabled:opacity-70"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
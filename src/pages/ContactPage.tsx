import { Mail } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/auth";

interface ContactForm {
  interests: string;
  message: string;
}

const ContactPage = () => {
  const [form, setForm] = useState<ContactForm>({
    interests: "",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        interests: form.interests,
        message: form.message,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/contact-admin/?type=contact_admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
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

      // Reset form after successful submission
      setForm({
        interests: "",
        message: "",
      });
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
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
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
      <div className="w-full mx-auto grid md:grid-cols-2 gap-8">
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
              We'd love to learn more about your interests and how we can assist
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
        <div
          className="rounded-2xl bg-white border border-[#d8e3c7] px-10 py-8 flex flex-col justify-start"
          style={{ minHeight: 640 }}
        >
          {/* Interests field */}
          <div className="mb-6">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="interests"
            >
              What are you interested in? <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              required
              id="interests"
              rows={6}
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary transition resize-none"
              value={form.interests}
              onChange={handleInputChange}
              placeholder="e.g., We are interested in carbon footprint tracking for our logistics operations and want to integrate emission calculations into our supply chain management system."
              style={{ minHeight: 160 }}
            />
          </div>

          {/* Message field */}
          <div className="mb-6">
            <label
              className="block text-[#1a3323] font-medium mb-2"
              htmlFor="message"
            >
              Additional Message <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              required
              id="message"
              rows={6}
              className="block w-full rounded-md border border-[#d8e3c7] bg-[#f4f7ec] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary transition resize-none"
              value={form.message}
              onChange={handleInputChange}
              placeholder="e.g., We would like to schedule a demo next week. Please contact us at your earliest convenience."
              style={{ minHeight: 160 }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-lg bg-primary hover:bg-primary/90 text-white font-bold justify-center text-base flex items-center gap-2 shadow-lg px-8 py-3 transition disabled:opacity-70"
            disabled={submitting}
          >
            <Mail className="w-4 h-4" />
            {submitting ? "Submitting..." : "Send Message"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
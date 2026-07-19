import { useState } from "react";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

  return (
    <main className="bg-background text-foreground min-h-[calc(100vh-80px)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-4 py-1.5 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            We'd love to <span className="text-accent">hear from you</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have a question, idea, or partnership inquiry? Drop us a message and
            we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="mx-auto max-w-5xl grid md:grid-cols-5 gap-10">
          {/* Info sidebar */}
          <aside className="md:col-span-2 space-y-6">
            {[
              { icon: Mail, label: "Email Us", value: "hello@evntro.com" },
              { icon: Phone, label: "Call Us", value: "+1 (800) EVN-TRO" },
              { icon: MapPin, label: "Location", value: "San Francisco, CA" },
              { icon: MessageSquare, label: "Live Chat", value: "Available 9am – 6pm" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-accent/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </aside>

          {/* Form */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border/60 bg-card p-8 space-y-5 shadow-sm"
            >
              <h2 className="text-xl font-bold text-foreground mb-1">Send a Message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@email.com"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  className={inputCls + " resize-none"}
                />
              </div>

              {sent && (
                <p className="text-sm font-semibold text-green-500 bg-green-500/10 rounded-xl px-4 py-2.5">
                  ✓ Message sent! We'll be in touch shortly.
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl bg-accent hover:bg-accent/90 text-background dark:text-foreground font-bold shadow-lg shadow-accent/20 transition-all"
              >
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;

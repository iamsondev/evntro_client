import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "@/components/Logo/Logo";

const FOOTER_LINKS = {
  Product: [
    { label: "Browse Events", to: "/events" },
    { label: "Create Event", to: "/organizer/create" },
    { label: "Pricing", to: "/pricing" },
    { label: "For Organizers", to: "/organizers" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Careers", to: "/careers" },
    { label: "Press", to: "/press" },
  ],
  Support: [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "Community", to: "/community" },
    { label: "Status", to: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Refund Policy", to: "/refund" },
  ],
};

const SOCIAL_LINKS = [
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/sondip-kumar-8637b9179/",
    label: "LinkedIn",
  },
  {
    icon: FaGithub,
    href: "https://github.com/iamsondev",
    label: "GitHub",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/sondip.kumar.750",
    label: "Facebook",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/SonDIPX",
    label: "X (Twitter)",
  },
];

const CONTACT_INFO = [
  {
    icon: Mail,
    href: "mailto:support@evntro.com",
    label: "support@evntro.com",
    isLink: true,
  },
  {
    icon: Phone,
    href: "tel:+8801700000000",
    label: "+880 1700-000000",
    isLink: true,
  },
  {
    icon: MapPin,
    href: null,
    label: "Dhaka, Bangladesh",
    isLink: false,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-background border-t">
      {/* Newsletter Banner */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">Stay in the loop</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest events and updates delivered to your inbox. No
                spam, ever.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 sm:w-60 rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="w-fit">
              <Logo />
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Discover, create, and manage events that bring people together.
              Your next great experience starts here.
            </p>

            {/* Contact Info */}
            <ul className="flex flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, href, label, isLink }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  {isLink ? (
                    <a
                      href={href}
                      className="hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-muted/50 active:scale-95 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold tracking-wide">
                  {category}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Evntro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              Made with <span className="text-red-500 text-sm">♥</span> in
              Bangladesh
            </span>
            <span className="hidden sm:block h-3 w-px bg-border" />
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors hidden sm:block"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-primary transition-colors hidden sm:block"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
  MapPin,
  Instagram,
  AlertCircle,
  Loader,
} from "lucide-react";
import { SITE_CONFIG } from "../data/config";

function EyebrowLabel({ children, red = false }) {
  return (
    <span
      style={{
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.3em",
        fontWeight: 600,
        color: red ? "var(--rumr-red)" : "var(--rumr-green-soft)",
      }}
    >
      {children}
    </span>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
}) {
  return (
    <div>
      {label && (
        <label
          style={{
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            display: "block",
            marginBottom: "8px",
            color: "var(--rumr-text2)",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--rumr-red)", marginLeft: "4px" }}>
              *
            </span>
          )}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-5 py-4 rounded-xl text-sm outline-none"
        style={{
          backgroundColor: "rgba(44,74,64,0.15)",
          border: `1px solid ${error ? "var(--rumr-red)" : "var(--rumr-border)"}`,
          color: "var(--rumr-text)",
          transition: "border-color 0.3s ease",
          width: "100%",
        }}
        onFocus={(e) =>
          !error && (e.currentTarget.style.borderColor = "var(--rumr-green-h)")
        }
        onBlur={(e) =>
          !error && (e.currentTarget.style.borderColor = "var(--rumr-border)")
        }
      />
      {error && (
        <p
          style={{
            fontSize: "11px",
            color: "var(--rumr-red)",
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function OptionButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300"
      style={{
        backgroundColor: selected ? "var(--rumr-green)" : "rgba(44,74,64,0.12)",
        color: selected ? "var(--rumr-text)" : "var(--rumr-text2)",
        border: selected
          ? "1px solid var(--rumr-green-h)"
          : "1px solid var(--rumr-border)",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--rumr-green-h)";
          e.currentTarget.style.color = "var(--rumr-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--rumr-border)";
          e.currentTarget.style.color = "var(--rumr-text2)";
        }
      }}
    >
      {label}
    </button>
  );
}

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const services = [
    "Ad Film / Product Shoot",
    "Event Cinematography",
    "Social Media Content",
    "Performance Marketing",
    "Website Design / Development",
    "Post-Production",
    "Something else",
  ];
  const budgets = [
    "Under ₹25,000",
    "₹25,000–₹50,000",
    "₹50,000–₹1,00,000",
    "₹1,00,000–₹3,00,000",
    "₹3,00,000+",
    "Let's discuss",
  ];
  const timelines = [
    "ASAP",
    "Within 2 weeks",
    "Within 1 month",
    "1–3 months",
    "Flexible",
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((e) => ({ ...e, [field]: null }));
  };

  const validateStep = () => {
    const errors = {};
    if (step === 1) {
      if (!formData.name.trim()) errors.name = "Your name is required";
      if (!formData.email.trim()) errors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errors.email = "Please enter a valid email";
    }
    if (step === 2 && !formData.service)
      errors.service = "Please select a service";
    if (step === 3 && !formData.budget)
      errors.budget = "Please select a budget range";
    if (step === 4 && !formData.timeline)
      errors.timeline = "Please select a timeline";
    if (step === 5 && !formData.message.trim())
      errors.message = "Please tell us about your project";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 5));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch("https://formspree.io/f/xdarbqye", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      
      await response.json();
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success state ── */
  if (isSubmitted) {
    return (
      <div
        style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
        className="pt-40 flex items-center justify-center px-6"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center p-16 rounded-2xl max-w-2xl w-full"
          style={{
            backgroundColor: "var(--rumr-surface)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              backgroundColor: "rgba(5,75,64,0.15)",
              border: "1px solid rgba(11,117,98,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <Check size={38} style={{ color: "var(--rumr-green-soft)" }} />
          </div>
          <EyebrowLabel>Submission Received</EyebrowLabel>
          <h2
            style={{
              marginTop: "14px",
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              marginBottom: "20px",
            }}
          >
            WE GOT IT.
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--rumr-text2)",
              lineHeight: 1.65,
              marginBottom: "36px",
            }}
          >
            Thanks for reaching out,{" "}
            <span style={{ color: "var(--rumr-text)" }}>
              {formData.name.split(" ")[0] || "friend"}
            </span>
            . We'll review your project details and get back to you within 24
            hours.
          </p>
          <Link
            to="/"
            className="btn-emerald"
            style={{ padding: "14px 32px", fontSize: "13px" }}
          >
            Back to Studio
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div
      style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
      className="pt-40 pb-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* LEFT */}
        <div>
          <EyebrowLabel>New Project Inquiry</EyebrowLabel>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(40px, 7vw, 90px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.86,
              marginTop: "14px",
            }}
          >
            LET'S START
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              WITH A GOOD IDEA.
            </em>
          </motion.h1>
          <p
            style={{
              marginTop: "28px",
              marginBottom: "52px",
              fontSize: "15px",
              color: "var(--rumr-text2)",
              lineHeight: 1.7,
              maxWidth: "420px",
            }}
          >
            Tell us what you're planning. We'll figure out how to make it move
            and make it matter.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {[
              {
                icon: (
                  <Send size={13} style={{ color: "var(--rumr-green-soft)" }} />
                ),
                label: "Email",
                value: SITE_CONFIG.brand.email,
                href: `mailto:${SITE_CONFIG.brand.email}`,
              },
              {
                icon: (
                  <MapPin
                    size={13}
                    style={{ color: "var(--rumr-green-soft)" }}
                  />
                ),
                label: "Location",
                value: `${SITE_CONFIG.brand.location}, India`,
                href: null,
              },
              {
                icon: (
                  <Instagram
                    size={13}
                    style={{ color: "var(--rumr-green-soft)" }}
                  />
                ),
                label: "Instagram",
                value: SITE_CONFIG.brand.instagram,
                href: SITE_CONFIG.brand.instagramUrl,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(5,75,64,0.12)",
                    border: "1px solid rgba(11,117,98,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      display: "block",
                      marginBottom: "2px",
                      color: "var(--rumr-text2)",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <Link
                      to={item.href}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--rumr-text)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--rumr-green-soft)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--rumr-text)")
                      }
                    >
                      {item.value}
                    </Link>
                  ) : (
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--rumr-text)",
                      }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            backgroundColor: "var(--rumr-surface)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          {/* Ambient glows */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "250px",
              height: "250px",
              background:
                "radial-gradient(ellipse at top right, rgba(255,59,48,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "350px",
              height: "250px",
              background:
                "radial-gradient(ellipse at bottom left, rgba(5,75,64,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Progress bar — emerald for completed */}
          <div className="mb-10 flex justify-between items-center relative z-10">
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  style={{
                    height: "3px",
                    borderRadius: "9999px",
                    transition: "all 0.45s ease",
                    width: s <= step ? "32px" : "14px",
                    backgroundColor:
                      s <= step ? "var(--rumr-green-h)" : "var(--rumr-border)",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "var(--rumr-text2)",
              }}
            >
              Step {step} of 5
            </span>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <EyebrowLabel>01 — About You</EyebrowLabel>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "22px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        color: "var(--rumr-text)",
                      }}
                    >
                      Who are you?
                    </h3>
                  </div>
                  <InputField
                    label="Full Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    error={formErrors.name}
                  />
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    error={formErrors.email}
                  />
                  <InputField
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                  <InputField
                    label="Company / Brand Name"
                    placeholder="Your brand"
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <EyebrowLabel>02 — Service</EyebrowLabel>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "22px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        color: "var(--rumr-text)",
                      }}
                    >
                      What do you need?
                    </h3>
                  </div>
                  {formErrors.service && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--rumr-red)",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={11} />
                      {formErrors.service}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {services.map((s) => (
                      <OptionButton
                        key={s}
                        label={s}
                        selected={formData.service === s}
                        onClick={() => updateField("service", s)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <EyebrowLabel>03 — Budget</EyebrowLabel>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "22px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        color: "var(--rumr-text)",
                      }}
                    >
                      Project budget?
                    </h3>
                  </div>
                  {formErrors.budget && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--rumr-red)",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={11} />
                      {formErrors.budget}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {budgets.map((b) => (
                      <OptionButton
                        key={b}
                        label={b}
                        selected={formData.budget === b}
                        onClick={() => updateField("budget", b)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <EyebrowLabel>04 — Timeline</EyebrowLabel>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "22px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        color: "var(--rumr-text)",
                      }}
                    >
                      When do you need it?
                    </h3>
                  </div>
                  {formErrors.timeline && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--rumr-red)",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={11} />
                      {formErrors.timeline}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {timelines.map((t) => (
                      <OptionButton
                        key={t}
                        label={t}
                        selected={formData.timeline === t}
                        onClick={() => updateField("timeline", t)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="s5"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <EyebrowLabel>05 — Details</EyebrowLabel>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "22px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.03em",
                        color: "var(--rumr-text)",
                      }}
                    >
                      Tell us more
                    </h3>
                  </div>
                  <label
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      display: "block",
                      marginBottom: "8px",
                      color: "var(--rumr-text2)",
                    }}
                  >
                    Project Description{" "}
                    <span style={{ color: "var(--rumr-red)" }}>*</span>
                  </label>
                  <textarea
                    placeholder="Describe your project, objectives, and any specific ideas or references..."
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "rgba(44,74,64,0.15)",
                      border: `1px solid ${formErrors.message ? "var(--rumr-red)" : "var(--rumr-border)"}`,
                      color: "var(--rumr-text)",
                      minHeight: "180px",
                      transition: "border-color 0.3s ease",
                      width: "100%",
                    }}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    onFocus={(e) =>
                      !formErrors.message &&
                      (e.currentTarget.style.borderColor =
                        "var(--rumr-green-h)")
                    }
                    onBlur={(e) =>
                      !formErrors.message &&
                      (e.currentTarget.style.borderColor = "var(--rumr-border)")
                    }
                  />
                  {formErrors.message && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--rumr-red)",
                        marginTop: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={11} />
                      {formErrors.message}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--rumr-text2)",
                      lineHeight: 1.6,
                      marginTop: "12px",
                    }}
                  >
                    By submitting you agree to be contacted by RUMR STUDIOS.{" "}
                    <span
                      style={{ color: "var(--rumr-border)", fontSize: "9px" }}
                    >
                      [Integration: connect to Formspree/Resend/EmailJS before
                      publishing]
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit error */}
            {submitError && (
              <div
                className="mt-4 p-4 rounded-xl flex items-start gap-3"
                style={{
                  backgroundColor: "rgba(255,59,48,0.08)",
                  border: "1px solid rgba(255,59,48,0.25)",
                }}
              >
                <AlertCircle
                  size={14}
                  style={{
                    color: "var(--rumr-red)",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--rumr-red)",
                    lineHeight: 1.5,
                  }}
                >
                  {submitError}
                </p>
              </div>
            )}

            {/* Navigation controls */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "var(--rumr-text2)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--rumr-text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--rumr-text2)")
                  }
                >
                  <ArrowLeft size={13} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-emerald"
                  style={{ padding: "13px 28px", fontSize: "12px" }}
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-red"
                  style={{
                    padding: "13px 28px",
                    fontSize: "12px",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) =>
                    !isLoading &&
                    (e.currentTarget.style.backgroundColor =
                      "var(--rumr-red-h)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader
                        size={14}
                        style={{ animation: "spin 0.8s linear infinite" }}
                      />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Project
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

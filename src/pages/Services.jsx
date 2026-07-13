import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Check, MapPin } from "lucide-react";
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

export default function ServicesPage() {
  return (
    <div
      style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
      className="pt-40 pb-32"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-36">
          <EyebrowLabel>What We Do</EyebrowLabel>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(46px, 9vw, 116px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.86,
              marginTop: "16px",
            }}
          >
            CREATIVE SYSTEMS
            <br />
            FOR BRANDS
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              WITH MOMENTUM.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{
              marginTop: "32px",
              fontSize: "clamp(15px, 1.8vw, 20px)",
              color: "var(--rumr-text2)",
              maxWidth: "560px",
              lineHeight: 1.65,
            }}
          >
            A production-first creative studio designed to turn attention into
            momentum through cinematic storytelling and digital execution.
          </motion.p>
        </header>

        <div className="flex flex-col gap-36">
          {SITE_CONFIG.services.map((service, index) => (
            <motion.section
              key={service.id}
              id={`service-${service.id}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start scroll-mt-40"
            >
              <div className="lg:sticky lg:top-36">
                <div className="flex items-center gap-4 mb-8">
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: "var(--rumr-red)",
                      fontFamily: "monospace",
                    }}
                  >
                    {service.id}
                  </span>
                  <div
                    style={{
                      height: "1px",
                      width: "48px",
                      backgroundColor: "var(--rumr-border)",
                    }}
                  />
                </div>
                <h2
                  style={{
                    fontSize: "clamp(26px, 3.8vw, 54px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "var(--rumr-text)",
                    lineHeight: 0.9,
                    marginBottom: "24px",
                  }}
                >
                  {service.title}
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--rumr-text2)",
                    maxWidth: "420px",
                    lineHeight: 1.7,
                    marginBottom: "36px",
                  }}
                >
                  {service.description}
                </p>
                <Link
                  to="/contact"
                  className="btn-red"
                  style={{ padding: "14px 28px", fontSize: "12px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--rumr-red-h)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                  }
                >
                  Start This Project <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex flex-col gap-8">
                <div
                  className="rounded-xl p-10"
                  style={{
                    backgroundColor: "var(--rumr-surface)",
                    border: "1px solid var(--rumr-border)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3em",
                      marginBottom: "28px",
                      fontWeight: 700,
                      color: "var(--rumr-green-soft)",
                    }}
                  >
                    Deliverables
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-3">
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(5,75,64,0.15)",
                            border: "1px solid rgba(11,117,98,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check
                            size={10}
                            style={{ color: "var(--rumr-green-soft)" }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "var(--rumr-text2)",
                          }}
                        >
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="aspect-video rounded-xl relative overflow-hidden"
                  style={{
                    backgroundColor: "var(--rumr-bg3)",
                    border: "1px solid var(--rumr-border)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse 55% 55% at 25% 55%, rgba(5,75,64,0.06) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 80% 25%, rgba(255,59,48,0.03) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        border: "1px solid rgba(11,117,98,0.25)",
                        backgroundColor: "rgba(5,75,64,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowRight
                        size={15}
                        style={{ color: "var(--rumr-green-soft)" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: "var(--rumr-border)",
                      }}
                    >
                      Visual preview area
                    </span>
                    <span
                      style={{
                        fontSize: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "var(--rumr-bg3)",
                      }}
                    >
                      Replace with project media
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <section
          className="mt-48 py-32 px-12 text-center rounded-2xl"
          style={{
            backgroundColor: "var(--rumr-bg2)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          <EyebrowLabel>Ready to Begin?</EyebrowLabel>
          <h2
            style={{
              marginTop: "20px",
              marginBottom: "44px",
              fontSize: "clamp(34px, 6vw, 78px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.9,
            }}
          >
            READY TO
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              MAKE NOISE?
            </em>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-5">
            <Link
              to="/contact"
              className="btn-red"
              style={{ padding: "18px 52px", fontSize: "15px" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
              }
            >
              Get Started
            </Link>
            <a
              href={`mailto:${SITE_CONFIG.brand.email}`}
              className="btn-emerald"
              style={{ padding: "18px 52px", fontSize: "15px" }}
            >
              Email RUMR
            </a>
          </div>
          <div
            style={{
              marginTop: "36px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--rumr-text2)",
            }}
          >
            <MapPin size={13} style={{ color: "var(--rumr-green-soft)" }} />
            Pitampura, New Delhi, India
          </div>
        </section>
      </div>
    </div>
  );
}

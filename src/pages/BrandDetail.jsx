import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Film, Calendar, Tag, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "../data/config";
import VideoModal from "../components/VideoModal";

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

export default function BrandDetailPage() {
  const { brandId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);

  // Find the brand from configuration
  const brand = SITE_CONFIG.projects.find((p) => p.id === brandId);

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 text-center">
        <h1 className="text-4xl font-black mb-4 text-white">BRAND NOT FOUND</h1>
        <p className="text-gray-400 mb-8">The brand you are looking for does not exist in our portfolio.</p>
        <Link to="/work" className="btn-emerald">
          <ArrowLeft size={16} /> Back to Work
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
      className="pt-32 md:pt-40 pb-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 group text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span
              className="w-8 h-8 rounded-full border border-[var(--rumr-border)] flex items-center justify-center group-hover:bg-[var(--rumr-green)] group-hover:border-[var(--rumr-green)] group-hover:text-black transition-all duration-300"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            </span>
            <span className="font-semibold uppercase tracking-wider text-[11px]">Back to Projects</span>
          </Link>
        </div>

        {/* Folder Shell Structure */}
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: "1px solid var(--rumr-border)",
            backgroundColor: "rgba(11, 14, 15, 0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Folder Tab Header */}
          <div 
            className="flex items-center justify-between px-6 md:px-10 py-6 border-b"
            style={{ borderColor: "var(--rumr-border)" }}
          >
            <div className="flex items-center gap-3">
              {/* Folder tab icon styling */}
              <div 
                className="w-10 h-8 rounded-t-lg rounded-b-sm flex items-center justify-center"
                style={{ 
                  backgroundColor: "rgba(11, 117, 98, 0.15)",
                  border: "1px solid rgba(11, 117, 98, 0.3)",
                  borderBottomWidth: "2px"
                }}
              >
                <Film size={15} style={{ color: "var(--rumr-green-soft)" }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Project Archive</span>
                <span className="text-xs font-mono text-[var(--rumr-green-soft)]">
                  dir://work/{brand.id}
                </span>
              </div>
            </div>
            
            {/* Shoot counter badge */}
            <div 
              className="px-3 py-1 rounded font-mono text-[10px] text-gray-400"
              style={{ 
                border: "1px solid var(--rumr-border)",
                backgroundColor: "rgba(255, 255, 255, 0.02)"
              }}
            >
              {brand.shoots?.length || 0} FILES
            </div>
          </div>

          {/* Folder Content Inner */}
          <div className="p-6 md:p-10">
            {/* Brand Intro Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Tag size={12} className="text-[var(--rumr-green-soft)]" />
                    {brand.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--rumr-border)]" />
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} className="text-[var(--rumr-red)]" />
                    {brand.year}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "clamp(38px, 6vw, 78px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "var(--rumr-text)",
                    lineHeight: 0.9,
                  }}
                >
                  {brand.title}
                  <br />
                  <em className="serif-italic" style={{ color: "var(--rumr-green-soft)" }}>
                    ARCHIVE.
                  </em>
                </h1>
                
                <p 
                  className="mt-6 text-base text-gray-400 max-w-2xl leading-relaxed"
                  style={{ color: "var(--rumr-text2)" }}
                >
                  {brand.description}
                </p>
              </div>

              {/* Brand Cover Graphic / Folder tab metadata */}
              <div className="lg:col-span-5 w-full h-full min-h-[160px] rounded-xl overflow-hidden relative border border-[var(--rumr-border)]">
                <img 
                  src={brand.image} 
                  alt={brand.title} 
                  className="w-full h-full object-cover opacity-30 blur-sm scale-110 absolute inset-0"
                />
                <div 
                  className="absolute inset-0 p-6 flex flex-col justify-between"
                  style={{ background: "linear-gradient(135deg, rgba(9,11,11,0.95) 0%, rgba(9,11,11,0.7) 100%)" }}
                >
                  <div className="flex justify-between items-start">
                    <EyebrowLabel>META-RECORD</EyebrowLabel>
                    <span className="text-[10px] font-mono text-gray-500 font-semibold">ID: #{brand.id.toUpperCase()}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">CLIENT:</span>
                      <span className="text-white font-bold">{brand.title}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">DISCIPLINE:</span>
                      <span className="text-white font-bold">{brand.category}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">RELEASED:</span>
                      <span className="text-white font-bold">{brand.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="h-px w-full mb-12" style={{ backgroundColor: "var(--rumr-border)" }} />

            {/* Shoots/Files Title */}
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-gray-400">
                Shoots &amp; Deliverables
              </h2>
              <div className="h-[2px] flex-1" style={{ backgroundColor: "rgba(11, 117, 98, 0.15)" }} />
            </div>

            {/* Grid of Shoots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {brand.shoots?.map((shoot, idx) => (
                <motion.div
                  key={shoot.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    if (shoot.video) {
                      setActiveVideo(shoot.video);
                    }
                  }}
                >
                  {/* Shoot Thumbnail Box */}
                  <div 
                    className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[var(--rumr-border)] bg-[var(--rumr-surface)] transition-all duration-300 group-hover:border-[var(--rumr-green-soft)]"
                  >
                    <img
                      src={shoot.image}
                      alt={shoot.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      style={{ filter: "grayscale(30%) brightness(0.65)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0%) brightness(0.85)")}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(30%) brightness(0.65)")}
                    />
                    
                    {/* Dark/color gradient overlay on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at center, rgba(5,75,64,0.15) 0%, rgba(9,11,11,0.6) 100%)"
                      }}
                    />

                    {/* Corner index number badge */}
                    <div 
                      className="absolute top-4 left-4 px-2 py-0.5 rounded font-mono text-[9px] text-[var(--rumr-green-soft)] border border-[rgba(11,117,98,0.3)]"
                      style={{ backgroundColor: "rgba(9,11,11,0.75)" }}
                    >
                      FILE_0{idx + 1}
                    </div>

                    {/* Action overlay (red play button) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "var(--rumr-red)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 20px rgba(255,59,48,0.45)",
                        }}
                      >
                        <Play size={20} fill="#fff" className="ml-0.5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Shoot Metadata Card Footer */}
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-semibold">
                          {shoot.category || brand.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="text-[10px] font-mono text-gray-500 font-semibold">
                          {shoot.year || brand.year}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-[var(--rumr-green-soft)] transition-colors duration-300">
                        {shoot.title}
                      </h3>
                      
                      <p className="mt-1 text-xs text-gray-400">
                        {shoot.description}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full border border-[var(--rumr-border)] flex items-center justify-center text-gray-500 group-hover:border-[var(--rumr-green-soft)] group-hover:text-[var(--rumr-green-soft)] transition-all duration-300">
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            videoUrl={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import React from "react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center border-b border-white/20">
        <h1 className="text-xl tracking-wider font-light">MICHELLE LIN</h1>
        <nav className="flex gap-6 text-sm opacity-80 hover:opacity-100 transition">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* HERO / SPACER */}
      <section className="h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-4xl font-light opacity-60">Scroll ↓ to view portfolio</h2>
      </section>

      {/* PDF SECTION */}
      <section id="portfolio-pdf" className="py-24 px-12 border-t border-white/10">
        <div
          className="w-[90%] h-[90vh] mx-auto rounded-3xl overflow-hidden backdrop-blur-xl border border-white/20 transition-all duration-700"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const offsetX = (x - rect.width / 2) / 15;
            const offsetY = (y - rect.height / 2) / 15;
            e.currentTarget.style.boxShadow = `${offsetX}px ${offsetY}px 90px rgba(255,255,255,0.45)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.25)";
          }}
          style={{
            animation:
              "float 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite",
          }}
        >
          <embed
            src="assets/files/Michelle_Lin_Portfolio_2025.pdf"
            type="application/pdf"
            className="w-full h-full"
          />
        </div>

        {/* 动画 keyframes */}
        <style>{`
          @keyframes float { 
            0% { transform: translateY(0); } 
            50% { transform: translateY(-12px); } 
            100% { transform: translateY(0); } 
          }
          @keyframes pulseGlow { 
            0% { box-shadow: 0 0 40px rgba(255,255,255,0.15); } 
            50% { box-shadow: 0 0 80px rgba(255,255,255,0.45); } 
            100% { box-shadow: 0 0 40px rgba(255,255,255,0.15); } 
          }
        `}</style>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-12">
        <h3 className="text-3xl font-light mb-12 border-b border-white/20 pb-4 tracking-wide">Selected Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="group relative bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition cursor-pointer">
            <div className="aspect-video bg-white/10 rounded-xl mb-4"></div>
            <h4 className="text-xl tracking-wide">Project Title</h4>
            <p className="opacity-60 text-sm mt-2">Short description of the project.</p>
          </div>

          <div className="group relative bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition cursor-pointer">
            <div className="aspect-video bg-white/10 rounded-xl mb-4"></div>
            <h4 className="text-xl tracking-wide">Project Title</h4>
            <p className="opacity-60 text-sm mt-2">Short description of the project.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-12 border-t border-white/10">
        <h3 className="text-3xl font-light mb-6 tracking-wide">About</h3>
        <p className="max-w-3xl opacity-70 text-sm leading-relaxed">
          Bio / Artist statement goes here.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-12 border-t border-white/10 text-sm opacity-80">
        <p>Contact → email@domain.com</p>
      </section>
    </div>
  );
}

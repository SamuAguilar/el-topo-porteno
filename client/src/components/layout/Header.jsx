import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="El Topo Porteño"
            className="h-24 w-24 object-contain"
          />
          <span className="text-white font-bold text-lg leading-tight">
            El Topo<br />
            <span className="text-brand-accent">Porteño</span>
          </span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Inicio",    target: "inicio" },
            { label: "Servicios", target: "servicios" },
            { label: "FAQ",       target: "faq" },
            { label: "Contacto",  target: "contacto" },
          ].map(({ label, target }) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className="text-white hover:text-brand-accent transition font-medium bg-transparent border-none cursor-pointer"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA desktop */}
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accentDk text-black font-bold px-5 py-2 rounded transition"
        >
          <span>📞</span> Llamános
        </a>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-surface px-6 py-4 flex flex-col gap-4">
          {["inicio", "servicios", "faq", "contacto"].map((target) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className="text-white hover:text-brand-accent transition bg-transparent border-none cursor-pointer text-left"
            >
              {target.charAt(0).toUpperCase() + target.slice(1)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
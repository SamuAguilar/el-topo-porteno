import { useState } from "react";
import logo from "../../assets/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B] border-b border-[#1F2937]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="El Topo Porteño" className="h-24 w-24 object-contain" />
          <span className="text-white font-bold text-lg leading-tight">
            El Topo<br />
            <span className="text-[#F59E0B]">Porteño</span>
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
              onClick={() => {
                const el = document.getElementById(target);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 60;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="text-white hover:text-[#F59E0B] transition font-medium bg-transparent border-none cursor-pointer"
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
          className="hidden md:inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-5 py-2 rounded transition"
        >
          <span>📞</span> Llamános {/* El número aún no está definido */}
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
        <div className="md:hidden bg-[#1F2937] px-6 py-4 flex flex-col gap-4">
          <a href="#inicio" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="#servicios" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#faq" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contacto" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>Contacto</a>
        </div>
      )}
    </header>
  );
}

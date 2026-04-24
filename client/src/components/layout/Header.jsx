import { useState } from "react";
import logo from "../../assets/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B] border-b border-[#1F2937]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="El Topo Porteño" className="h-12 w-12 object-contain" />
          <span className="text-white font-bold text-lg leading-tight">
            El Topo<br />
            <span className="text-[#F59E0B]">Porteño</span>
          </span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-white hover:text-[#F59E0B] transition font-medium">Inicio</a>
          <a href="#servicios" className="text-white hover:text-[#F59E0B] transition font-medium">Servicios</a>
          <a href="#nosotros" className="text-white hover:text-[#F59E0B] transition font-medium">Nosotros</a>
          <a href="#contacto" className="text-white hover:text-[#F59E0B] transition font-medium">Contacto</a>
        </nav>

        {/* CTA desktop */}
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-5 py-2 rounded transition"
        >
          <span>📞</span> Llamanos
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
          <a href="#nosotros" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>Nosotros</a>
          <a href="#contacto" className="text-white hover:text-[#F59E0B] transition" onClick={() => setMenuOpen(false)}>Contacto</a>
        </div>
      )}
    </header>
  );
}

import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const isScrolling = useRef(false);

  // detecta la sección visible al scrollear
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      const secciones = ["inicio", "servicios", "faq", "contacto"];
      let actual = "inicio";

      for (const seccion of secciones) {
        const elemento = document.getElementById(seccion);
        if (elemento) {
          const rect = elemento.getBoundingClientRect();
          if (rect.top <= 150) {
            actual = seccion;
          }
        }
      }
      setSeccionActiva(actual);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    isScrolling.current = true;
    setSeccionActiva(id);
    
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false);

    // reactiva la detección al terminar la animación
    setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo con redirección al inicio */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => scrollTo("inicio")}
        >
          <img
            src="/assets/logo.png"
            alt="El Topo Porteño"
            className="h-14 w-auto object-contain" 
          />
          <span className="text-white font-bold text-xl tracking-wide">
            El Topo <span className="text-brand-accent">Porteño</span>
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
              className={`transition font-medium bg-transparent border-none cursor-pointer ${
                seccionActiva === target 
                  ? "text-brand-accent" 
                  : "text-white hover:text-brand-accent"
              }`}
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
              className={`transition bg-transparent border-none cursor-pointer text-left ${
                seccionActiva === target 
                  ? "text-brand-accent" 
                  : "text-white hover:text-brand-accent"
              }`}
            >
              {target.charAt(0).toUpperCase() + target.slice(1)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
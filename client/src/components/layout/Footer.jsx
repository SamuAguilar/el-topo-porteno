import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const [contador, setContador] = useState(0);
  const navigate = useNavigate();

  const handleClickSecreto = () => {
    const nuevosClics = contador + 1;
    setContador(nuevosClics);
    
    if (nuevosClics >= 7) {
      navigate('/admin');
      setContador(0);
    }
  };

  return (
    <footer className="bg-brand-bg border-t border-brand-surface py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo y descripción */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/assets/logo.png" alt="El Topo Porteño" className="h-10 w-10 object-contain" />
            <span className="text-white font-bold text-lg">
              El Topo <span className="text-brand-accent">Porteño</span>
            </span>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed">
            Servicios profesionales de excavación en Buenos Aires. Excavación,
            Zanjeo y Limpieza de Pozos.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Navegación</h3>
          <ul className="space-y-2 text-brand-muted text-sm">
            <li><a href="#inicio" className="hover:text-brand-accent transition">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-brand-accent transition">Servicios</a></li>
            <li><a href="#nosotros" className="hover:text-brand-accent transition">Preguntas frecuentes</a></li>
            <li><a href="#contacto" className="hover:text-brand-accent transition">Contacto</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div id="contacto">
          <h3 className="text-white font-semibold mb-4">Contacto</h3>
          <ul className="space-y-2 text-brand-muted text-sm">
            <li>📍 Buenos Aires, Argentina</li>
            <li>
              <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-accent transition"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>📞 +54 11 0000-0000</li>
          </ul>
        </div>
      </div>

      {/* onClick, select-none y cursor-default para no delatar el atajo */}
      <div 
        onClick={handleClickSecreto}
        className="max-w-6xl mx-auto mt-10 pt-6 border-t border-brand-surface text-center text-brand-muted text-xs select-none cursor-default"
      >
        © {new Date().getFullYear()} El Topo Porteño. Todos los derechos reservados.
      </div>
    </footer>
  );
}
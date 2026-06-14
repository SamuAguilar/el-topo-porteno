import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { formatDate, normalizarEstado } from "../../utils/formatters";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

const estadoConfig = {
  "Presupuestado": { bg: "#1a1a2a", text: "#6B7280" },
  "Aceptado":      { bg: "#1a2a3a", text: "#3B82F6" },
  "En ejecución":  { bg: "#1a2a1a", text: "#10B981" },
  "Finalizado":    { bg: "#1a1a3a", text: "#8B5CF6" },
  "En garantía":   { bg: "#2a2a1a", text: "#F59E0B" },
  "Cerrado":       { bg: "#1a2a1a", text: "#34D399" },
};

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cliente, setCliente] = useState(() => location.state?.cliente ?? null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(!cliente);
  const [error, setError] = useState("");

  // Estados para el Modal de Nuevo Trabajo
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [creandoTrabajo, setCreandoTrabajo] = useState(false);
  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    tipo_servicio: "Excavacion",
    ubicacion: "",
    profundidad_estimada: "",
    precio: "",
    observaciones: ""
  });

  // Función auxiliar para cargar los trabajos y reutilizarla
  const fetchTrabajosDelCliente = async (clienteId) => {
    try {
      const resTrabajos = await apiFetch("/trabajos");
      const todosTrabajos = resTrabajos.data || [];
      const trabajosCliente = todosTrabajos
        .filter(t => t.cliente_id === parseInt(clienteId))
        .map(t => ({ ...t, estado: normalizarEstado(t.estado) }));
      setTrabajos(trabajosCliente);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los trabajos del cliente.");
    }
  };

  useEffect(() => {
    let cancelado = false;
    
    async function inicializar() {
      if (cliente) {
        await fetchTrabajosDelCliente(cliente.id);
        if (!cancelado) setLoading(false);
        return;
      }

      try {
        const clienteData = await apiFetch(`/clientes/${id}`); // Fallback por si entran directo por URL
        if (!cancelado) { 
          setCliente(clienteData); 
          await fetchTrabajosDelCliente(clienteData.id); 
        }
      } catch (err) { 
        if (!cancelado) { 
          setError("Cliente no encontrado."); 
        } 
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    inicializar();
    return () => { cancelado = true; };
  }, [id, cliente]);

  // Manejador para enviar el formulario del nuevo trabajo
  const handleCrearTrabajo = async (e) => {
    e.preventDefault();
    setCreandoTrabajo(true);

    try {
      await apiFetch('/trabajos', {
        method: 'POST',
        body: {
          lead_id: cliente.id,
          // Añadimos cliente_id como parche de seguridad por si una ruta antigua lo exige
          cliente_id: cliente.id, 
          tipo_servicio: nuevoTrabajo.tipo_servicio,
          ubicacion: nuevoTrabajo.ubicacion,
          profundidad_estimada: nuevoTrabajo.profundidad_estimada || null,
          precio: nuevoTrabajo.precio || null,
          observaciones: nuevoTrabajo.observaciones || null
        }
      });
      
      // Cerramos modal, limpiamos formulario y recargamos la tabla
      setMostrarFormulario(false);
      setNuevoTrabajo({ tipo_servicio: "Excavacion", ubicacion: "", profundidad_estimada: "", precio: "", observaciones: "" });
      await fetchTrabajosDelCliente(cliente.id);

    } catch (err) {
      // Mejoramos la captura de errores para que sea más fácil diagnosticar
      console.error("El servidor rechazó la creación del trabajo. Detalle del error:", err);
      alert("No se pudo crear el trabajo. Revisa la consola del navegador (F12) o la terminal de Node.js para ver el motivo exacto.");
    } finally {
      setCreandoTrabajo(false);
    }
  };

  const columnasTrabajos = [
    { key: "servicio", label: "Servicio", render: (t) => t.tipo_servicio ?? "—", cellStyle: { color: "#fff", fontSize: "14px" } },
    { key: "ubicacion", label: "Ubicación", cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "estado", label: "Estado", render: (t) => <Badge estado={t.estado} config={estadoConfig} /> },
    { key: "inicio", label: "Inicio", render: (t) => formatDate(t.fecha_inicio), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "fin", label: "Fin", render: (t) => formatDate(t.fecha_fin), cellStyle: { color: "#6B7280", fontSize: "13px" } },
    { key: "accion", label: "", render: (t) => (
      <button onClick={() => navigate(`/admin/trabajos/${t.id}`)}
        className="bg-transparent border border-brand-border rounded-md text-brand-muted text-xs px-3 py-1.5 cursor-pointer hover:border-brand-accent hover:text-brand-accent transition">Ver</button>
    )},
  ];

  if (loading) return <div className="text-brand-muted p-8 text-center text-sm">Cargando cliente...</div>;
  if (error || !cliente) return (
    <div className="text-brand-muted p-8 text-center">
      <p>{error || "Cliente no encontrado."}</p>
      <button onClick={() => navigate("/admin/gestion-contactos")} className="text-brand-accent bg-transparent border-none cursor-pointer text-sm mt-2">← Volver a Contactos</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 relative">
      <button onClick={() => navigate("/admin/gestion-contactos")} className="bg-transparent border-none text-brand-muted cursor-pointer text-sm w-fit">← Volver a Contactos</button>
      
      <div>
        <h1 className="text-white text-xl font-bold m-0">{cliente.nombre}</h1>
        <p className="text-brand-muted text-sm mt-1">Cliente desde {formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)}</p>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-white text-sm font-bold m-0">Datos de contacto</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {[["Nombre", cliente.nombre], ["WhatsApp", cliente.whatsapp], ["Email", cliente.email], ["Alta en sistema", formatDate(cliente.fecha_alta ?? cliente.fecha_creacion)]].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-brand-muted text-xs uppercase tracking-wider">{label}</span>
              <span className="text-white text-sm">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 flex-wrap pt-1">
          <a href={`https://wa.me/${cliente.whatsapp}`} target="_blank" rel="noreferrer" className="bg-emerald-900 border-none rounded-md text-emerald-500 text-sm font-medium px-4 py-2 no-underline inline-block">WhatsApp</a>
          <a href={`mailto:${cliente.email}`} className="bg-brand-surface text-brand-muted border border-brand-border rounded-md text-sm px-4 py-2 no-underline inline-block">Email</a>
        </div>
      </div>

      {/* Cabecera de la tabla con el botón de Nuevo Trabajo */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-white text-lg font-bold m-0">Trabajos del Cliente</h2>
        <button 
          onClick={() => setMostrarFormulario(true)}
          className="bg-brand-accent hover:bg-brand-accent/90 text-black font-bold text-sm px-4 py-2 rounded-md border-none cursor-pointer transition"
        >
          + Nuevo Trabajo
        </button>
      </div>

      <DataTable columns={columnasTrabajos} data={trabajos} loading={false} emptyMessage="Este cliente no tiene trabajos registrados." keyExtractor={(t) => t.id} />

      {/* Modal Flotante para Nuevo Trabajo */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-5 mt-0">Registrar Nuevo Trabajo</h2>
            
            <form onSubmit={handleCrearTrabajo} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-brand-muted text-xs uppercase tracking-wider">Servicio *</label>
                <select
                  required
                  className="bg-brand-bg text-white border border-brand-border rounded-md p-2.5 outline-none focus:border-brand-accent transition cursor-pointer text-sm"
                  value={nuevoTrabajo.tipo_servicio}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, tipo_servicio: e.target.value })}
                >
                  <option value="Excavacion">Excavación</option>
                  <option value="Zanjeo">Zanjeo</option>
                  <option value="Limpieza">Limpieza de pozos</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-brand-muted text-xs uppercase tracking-wider">Ubicación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cordoba, Capital"
                  className="bg-brand-bg text-white border border-brand-border rounded-md p-2.5 outline-none focus:border-brand-accent transition text-sm placeholder:text-gray-600"
                  value={nuevoTrabajo.ubicacion}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, ubicacion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-brand-muted text-xs uppercase tracking-wider">Profundidad (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Opcional"
                    className="bg-brand-bg text-white border border-brand-border rounded-md p-2.5 outline-none focus:border-brand-accent transition text-sm placeholder:text-gray-600"
                    value={nuevoTrabajo.profundidad_estimada}
                    onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, profundidad_estimada: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-brand-muted text-xs uppercase tracking-wider">Precio ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Opcional"
                    className="bg-brand-bg text-white border border-brand-border rounded-md p-2.5 outline-none focus:border-brand-accent transition text-sm placeholder:text-gray-600"
                    value={nuevoTrabajo.precio}
                    onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, precio: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-brand-muted text-xs uppercase tracking-wider">Observaciones</label>
                <textarea
                  rows={3}
                  placeholder="Detalles adicionales del trabajo..."
                  className="bg-brand-bg text-white border border-brand-border rounded-md p-2.5 outline-none focus:border-brand-accent transition resize-none text-sm placeholder:text-gray-600"
                  value={nuevoTrabajo.observaciones}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, observaciones: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="text-brand-muted bg-transparent border border-transparent hover:border-brand-border rounded-md cursor-pointer px-4 py-2 transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creandoTrabajo}
                  className="bg-brand-accent hover:bg-brand-accent/90 text-black font-bold rounded-md px-4 py-2 border-none cursor-pointer transition text-sm disabled:opacity-50"
                >
                  {creandoTrabajo ? "Guardando..." : "Guardar Trabajo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
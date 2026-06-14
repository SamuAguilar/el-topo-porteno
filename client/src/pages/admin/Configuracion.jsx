import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import DataTable from "../../components/ui/DataTable";

const serviciosMock = ["Excavación — Pozo séptico", "Excavación — Pozo de agua", "Zanjeo", "Limpieza de pozos"];
const preciosMock = { "Excavación — Pozo séptico": 85000, "Excavación — Pozo de agua": 95000, "Zanjeo": 60000, "Limpieza de pozos": 35000 };

export default function Configuracion() {
  const [servicios, setServicios] = useState(serviciosMock);
  const [precios, setPrecios] = useState(preciosMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorEdit, setValorEdit] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let cancelado = false;
    async function fetchConfig() {
      try {
        const data = await apiFetch("/configuracion");
        if (!cancelado) {
          if (data && typeof data === "object") {
            if (Array.isArray(data.servicios)) setServicios(data.servicios);
            if (data.precios && typeof data.precios === "object") setPrecios(data.precios);
          }
          setError("");
        }
      } catch { if (!cancelado) console.warn("Endpoint de configuración no disponible, usando datos locales."); }
      finally { if (!cancelado) setLoading(false); }
    }
    fetchConfig();
    return () => { cancelado = true; };
  }, []);

  function iniciarEdicion(servicio) { setEditando(servicio); setValorEdit(precios[servicio]?.toString() ?? "0"); setMensaje(""); }
  function cancelarEdicion() { setEditando(null); setValorEdit(""); }

  async function guardarPrecio(servicio) {
    const nuevoPrecio = parseFloat(valorEdit);
    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) { setMensaje("Ingresá un valor numérico válido."); return; }
    setPrecios(prev => ({ ...prev, [servicio]: nuevoPrecio }));
    setEditando(null);
    setMensaje(`Precio de "${servicio}" actualizado correctamente.`);
    setTimeout(() => setMensaje(""), 3000);
    try { await apiFetch("/configuracion", { method: "PUT", body: { servicio, precio: nuevoPrecio } }); }
    catch { console.warn("No se pudo guardar en el servidor"); }
  }

  const filas = servicios.map(servicio => ({ servicio, precio: precios[servicio] }));
  const columnas = [
    { key: "servicio", label: "Servicio", render: (fila) => fila.servicio, cellStyle: { color: "#fff", fontSize: "14px" } },
    { key: "precio", label: "Precio actual", render: (fila) => (
      editando === fila.servicio ? (
        <input type="number" value={valorEdit} onChange={(e) => setValorEdit(e.target.value)}
          className="bg-brand-bg border border-brand-border rounded-md px-2.5 py-1.5 text-white text-sm w-28 outline-none" />
      ) : (
        <span className="text-brand-accent text-base font-bold">${fila.precio?.toLocaleString("es-AR") ?? "—"}</span>
      )
    )},
    { key: "acciones", label: "", render: (fila) => (
      <div className="flex justify-end">
        {editando === fila.servicio ? (
          <div className="flex gap-2">
            <button onClick={() => guardarPrecio(fila.servicio)} className="bg-brand-accent text-black border-none rounded-md px-3.5 py-1.5 text-sm font-bold cursor-pointer">Guardar</button>
            <button onClick={cancelarEdicion} className="bg-transparent border border-brand-border rounded-md text-brand-muted text-sm px-3.5 py-1.5 cursor-pointer">Cancelar</button>
          </div>
        ) : (
          <button onClick={() => iniciarEdicion(fila.servicio)} className="bg-transparent border border-brand-border rounded-md text-brand-muted text-sm px-3.5 py-1.5 cursor-pointer">Editar</button>
        )}
      </div>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-xl font-bold m-0">Configuración</h1>
        <p className="text-brand-muted text-sm mt-1">Precios de referencia por tipo de servicio</p>
      </div>
      {error && <div className="bg-red-900/20 border border-red-500 rounded-md text-red-500 text-sm p-3">{error}</div>}
      {mensaje && <div className="bg-emerald-900/20 border border-emerald-500 rounded-md text-emerald-500 text-sm p-3">{mensaje}</div>}
      <DataTable columns={columnas} data={filas} loading={loading} emptyMessage="No hay servicios configurados." keyExtractor={(fila) => fila.servicio} />
    </div>
  );
}
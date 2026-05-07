import { useParams } from "react-router-dom";

export default function TrabajoDetalle() {
  const { id } = useParams();
  return (
    <div>
      <h1 style={{ color: "#F59E0B", marginBottom: "8px" }}>Detalle del Trabajo</h1>
      <p style={{ color: "#6B7280" }}>ID del trabajo: <strong style={{ color: "#fff" }}>{id}</strong></p>
      <p style={{ color: "#6B7280" }}>Estado actual, historial del ciclo de vida y observaciones.</p>
    </div>
  );
}

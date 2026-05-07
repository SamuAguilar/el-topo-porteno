import { useParams } from "react-router-dom";

export default function ClienteDetalle() {
  const { id } = useParams();
  return (
    <div>
      <h1 style={{ color: "#F59E0B", marginBottom: "8px" }}>Detalle del Cliente</h1>
      <p style={{ color: "#6B7280" }}>ID del cliente: <strong style={{ color: "#fff" }}>{id}</strong></p>
      <p style={{ color: "#6B7280" }}>Información del cliente y sus trabajos asociados.</p>
    </div>
  );
}

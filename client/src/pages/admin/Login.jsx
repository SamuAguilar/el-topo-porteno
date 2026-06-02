// src/pages/admin/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { apiFetch } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      const data = await apiFetch(
        "/auth/login",
        { method: "POST", body: { username: form.username, password: form.password } },
        false
      );
      localStorage.setItem("token", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.errores) {
        setError(err.errores.map((e) => e.mensaje).join(", "));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error de conexión");
      }
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0B0B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "#1F2937",
        border: "1px solid #374151",
        borderRadius: "12px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src={logo}
            alt="El Topo Porteño"
            style={{
              height: "64px",
              objectFit: "contain",
              marginBottom: "12px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            El Topo <span style={{ color: "#F59E0B" }}>Porteño</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
            Panel Administrativo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            label="Usuario"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            error={error ? " " : undefined} // Solo mostramos borde rojo, el mensaje general va abajo
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            error={error ? " " : undefined}
          />

          {error && (
            <p style={{ color: "#EF4444", fontSize: "13px", margin: 0 }}>
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" style={{ marginTop: "8px" }}>
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
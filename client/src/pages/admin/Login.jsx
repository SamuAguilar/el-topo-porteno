import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
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
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              style={{
                background: "#0B0B0B",
                border: `1px solid ${error ? "#EF4444" : "#374151"}`,
                borderRadius: "6px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              style={{
                background: "#0B0B0B",
                border: `1px solid ${error ? "#EF4444" : "#374151"}`,
                borderRadius: "6px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#EF4444", fontSize: "13px", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              background: "#F59E0B",
              color: "#000",
              fontWeight: "bold",
              fontSize: "15px",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              cursor: "pointer",
              marginTop: "8px",
              transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#D97706"}
            onMouseOut={e => e.currentTarget.style.background = "#F59E0B"}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
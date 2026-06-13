import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
      <div className="bg-brand-surface border border-brand-border rounded-xl p-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/logo.png"
            alt="El Topo Porteño"
            className="h-16 object-contain mb-3 mx-auto block"
          />
          <h1 className="text-white text-xl font-bold m-0">
            El Topo <span className="text-brand-accent">Porteño</span>
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Panel Administrativo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Usuario"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            error={error ? " " : undefined}   // solo borde rojo, sin mensaje
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
            <p className="text-red-500 text-sm m-0">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" className="mt-2">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rolId: 1,   // 1 = admin | 2 = vendedor
    estado: 1,  // siempre activo
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "rolId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol_id: form.rolId,
        estado: 1,
      });

      navigate("/login");
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Error al registrar el usuario");
  } else {
    setError("Error inesperado");
  }
}

  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Crear cuenta</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="rolId"
          value={form.rolId}
          onChange={handleChange}
          style={styles.input}
        >
          <option value={1}>Administrador</option>
          <option value={2}>Vendedor</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p style={styles.linkText}>
          ¿Ya tienes cuenta?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
  linkText: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: 500,
  },
};

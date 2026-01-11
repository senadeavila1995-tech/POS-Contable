import { useState } from "react";
import type { Cliente } from "../../shared/types/Cliente";

type ClientFormData = Omit<
  Cliente,
  "id" | "creado_en" | "actualizado_en"
>;

interface Props {
  client?: Cliente | null;
  onSave: (data: ClientFormData) => Promise<void>;
  onClose: () => void;
}

export const ClientsForm = ({ client, onSave, onClose }: Props) => {
  const [form, setForm] = useState<ClientFormData>({
    nombre: client?.nombre ?? "",
    cc: client?.cc ?? "",
    telefono: client?.telefono ?? "",
    email: client?.email ?? "",
    direccion: client?.direccion ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container p-4 border rounded bg-white"
      style={{ maxWidth: 600 }}
    >
      <h5 className="mb-4 text-center fw-bold">
        {client ? "Editar cliente" : "Nuevo cliente"}
      </h5>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cédula (CC)</label>
        <input
          className="form-control"
          name="cc"
          value={form.cc}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Teléfono</label>
          <input
            className="form-control"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <input
          className="form-control"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-dark">
          Guardar
        </button>
      </div>
    </form>
  );
};

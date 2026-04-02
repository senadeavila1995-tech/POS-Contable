// src/modules/caja/CajaForm.tsx
import { useState } from "react";

interface Props {
  tipo: "ABRIR" | "CERRAR";
  onSubmit: (data: any) => Promise<void>;
}

const CajaForm: React.FC<Props> = ({ tipo, onSubmit }) => {
  const [monto, setMonto] = useState(0);
  const [obs, setObs] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === "ABRIR") {
      await onSubmit({ monto_inicial: monto });
    } else {
      await onSubmit({
        monto_final_real: monto,
        observaciones: obs,
      });
    }

    setMonto(0);
    setObs("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          {tipo === "ABRIR" ? "Monto inicial" : "Monto final real"}
        </label>
        <input
          type="number"
          className="form-control"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          required
        />
      </div>

      {tipo === "CERRAR" && (
        <div className="mb-3">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-control"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </div>
      )}

      <button
        className={`btn ${
          tipo === "ABRIR" ? "btn-success" : "btn-danger"
        }`}
      >
        {tipo === "ABRIR" ? "Abrir Caja" : "Cerrar Caja"}
      </button>
    </form>
  );
};

export default CajaForm;

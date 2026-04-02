// src/modules/caja/CajaPage.tsx
import { useEffect, useState } from "react";
import {
  abrirCaja,
  getCajaActual,
} from "./caja.service";
import CajaForm from "./CajaForm";
import { cerrarCaja } from "../cierre-caja/cierre.service";

interface Caja {
  id: number;
  estado: "ABIERTA" | "CERRADA";
  monto_inicial: number;
}




const CajaPage: React.FC = () => {
  const [caja, setCaja] = useState<Caja | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarCaja = async () => {
    try {
      const res = await getCajaActual();
      setCaja(res.data);
    } catch {
      setCaja(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCaja();
  }, []);

  const handleAbrir = async (data: { monto_inicial: number }) => {
    await abrirCaja(data);
    await cargarCaja();
  };

  const handleCerrar = async (data: {
    monto_final_real: number;
    observaciones?: string;
  }) => {
    if (!caja) return;

    await cerrarCaja({
      caja_id: caja.id,
      ...data,
    });

    await cargarCaja();
  };

  if (loading) return <p>Cargando caja...</p>;




  return (
    <div className="container mt-4">
      <h2>Caja</h2>

      {caja?.estado === "ABIERTA" ? (
        <div className="card">
          <div className="card-body">
            <p>
              <strong>Estado:</strong>{" "}
              <span className="text-success">ABIERTA</span>
            </p>
            <p>
              <strong>Monto inicial:</strong> ${caja.monto_inicial}
            </p>

            <CajaForm tipo="CERRAR" onSubmit={handleCerrar} />
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <p>
              <strong>Estado:</strong>{" "}
              <span className="text-danger">CERRADA</span>
            </p>

            <CajaForm tipo="ABRIR" onSubmit={handleAbrir} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CajaPage;

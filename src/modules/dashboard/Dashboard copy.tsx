import { useEffect, useMemo, useState } from "react";
import { listarVentas } from "../ventas/ventas.service";
import { getCompras } from "../compras/compras.service";
import {
  getCajaActual,
  abrirCaja,
  cerrarCaja,
} from "./dashboardService";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Sale } from "../../shared/types/Sale";
import type { Compra } from "../../shared/types/Compra";

interface FlujoDiario {
  fecha: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

interface Caja {
  id: number;
  monto_inicial: number;
  estado: "ABIERTA" | "CERRADA";
}

const Dashboard: React.FC = () => {
  const [flujo, setFlujo] = useState<FlujoDiario[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== CAJA =====
  const [caja, setCaja] = useState<Caja | null>(null);
  const [montoInicial, setMontoInicial] = useState("");
  const [montoFinal, setMontoFinal] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // ======================
  // Cargar caja actual
  // ======================
  const cargarCaja = async () => {
    try {
      const resp = await getCajaActual();
      setCaja(resp.data ?? null);
    } catch {
      setCaja(null);
    }
  };

  // ======================
  // Dashboard contable
  // ======================
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [ventasResp, comprasResp] = await Promise.all([
          listarVentas(),
          getCompras(),
        ]);

        const ventas: Sale[] = ventasResp.data ?? [];
        const compras: Compra[] = comprasResp.data ?? [];

        const flujoMap: Record<string, FlujoDiario> = {};

        ventas.forEach((v) => {
          if (!v.creado_en) return;
          const fecha = v.creado_en.split("T")[0];

          flujoMap[fecha] ??= { fecha, ingresos: 0, egresos: 0, balance: 0 };
          flujoMap[fecha].ingresos += Number(v.total ?? 0);
        });

        compras.forEach((c) => {
          if (!c.fecha_compra) return;
          const fecha = c.fecha_compra.split("T")[0];

          flujoMap[fecha] ??= { fecha, ingresos: 0, egresos: 0, balance: 0 };
          flujoMap[fecha].egresos += Number(c.total ?? 0);
        });

        const resultado = Object.values(flujoMap)
          .map((f) => ({ ...f, balance: f.ingresos - f.egresos }))
          .sort(
            (a, b) =>
              new Date(a.fecha).getTime() -
              new Date(b.fecha).getTime()
          );

        setFlujo(resultado);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
    cargarCaja();
  }, []);

  // ======================
  // KPIs
  // ======================
  const resumen = useMemo(() => {
    return flujo.reduce(
      (acc, f) => {
        acc.ingresos += f.ingresos;
        acc.egresos += f.egresos;
        acc.balance += f.balance;
        return acc;
      },
      { ingresos: 0, egresos: 0, balance: 0 }
    );
  }, [flujo]);

  // ======================
  // Acciones Caja
  // ======================
  const handleAbrirCaja = async () => {
    if (!montoInicial) {
      alert("Ingrese monto inicial");
      return;
    }

    await abrirCaja({
      monto_inicial: Number(montoInicial),
    });

    setMontoInicial("");
    cargarCaja();
  };

  const handleCerrarCaja = async () => {
    if (!caja) return;

    await cerrarCaja({
      caja_id: caja.id,
      monto_final_real: Number(montoFinal),
      observaciones,
    });

    setMontoFinal("");
    setObservaciones("");
    cargarCaja();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Contable</h2>

      {/* ================= CAJA ================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Caja del Día</h5>

          {!caja && (
            <>
              <input
                className="form-control mb-2"
                placeholder="Monto inicial"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
              />
              <button
                className="btn btn-success"
                onClick={handleAbrirCaja}
              >
                Abrir Caja
              </button>
            </>
          )}

          {caja && caja.estado === "ABIERTA" && (
            <>
              <p><strong>Monto inicial:</strong> ${caja.monto_inicial}</p>
              <p>
                <strong>Balance sistema:</strong>{" "}
                ${resumen.balance.toFixed(2)}
              </p>

              <input
                className="form-control mb-2"
                placeholder="Monto final real"
                value={montoFinal}
                onChange={(e) => setMontoFinal(e.target.value)}
              />

              <textarea
                className="form-control mb-2"
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />

              <button
                className="btn btn-danger"
                onClick={handleCerrarCaja}
              >
                Cerrar Caja
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= KPIs ================= */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-bg-success">
            <div className="card-body">
              <h6>Total Ventas</h6>
              <h4>${resumen.ingresos.toFixed(2)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-danger">
            <div className="card-body">
              <h6>Total Compras</h6>
              <h4>${resumen.egresos.toFixed(2)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-dark">
            <div className="card-body">
              <h6>Balance Neto</h6>
              <h4>${resumen.balance.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRAFICOS ================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Ingresos vs Egresos</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={flujo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ingresos" />
              <Bar dataKey="egresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Evolución del Balance</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={flujo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

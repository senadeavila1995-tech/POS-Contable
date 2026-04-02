import api from "../../shared/api/axios";

/* ========= INGRESOS ========= */

// Ventas por día
export const getVentasPorDia = (empresa_id: number) =>
  api.get<{ fecha: string; total_ventas: number }[]>(
    `/ventas/dashboard/por-dia/${empresa_id}`
  );

// Top productos vendidos
export const getTopProductosVentas = (empresa_id: number) =>
  api.get<{
    nombre: string;
    total_vendido: number;
    total_ingresos: number;
  }[]>(`/ventas/dashboard/top-products/${empresa_id}`);


/* ========= EGRESOS ========= */

// Compras por día
export const getComprasPorDia = (
  empresa_id: number,
  mes: number,
  anio: number
) =>
  api.get<{ dia: string; total_dia: number }[]>(
    `/compras/dashboard/por-dia/${empresa_id}?mes=${mes}&anio=${anio}`
  );

// Listar compras (para totales)
export const getCompras = () =>
  api.get(`/compras`);


/* ========= CAJA ========= */

// Caja actual
export const getCajaActual = () =>
  api.get<{
    id: number;
    fecha: string;
    monto_inicial: number;
    estado: "ABIERTA" | "CERRADA";
  }>(`/caja/actual`);

// Abrir caja
export const abrirCaja = (data: {
  monto_inicial: number;
}) =>
  api.post("/caja/abrir", data);

// Cerrar caja
export const cerrarCaja = (data: {
  caja_id: number;
  monto_final_real: number;
  observaciones?: string;
}) =>
  api.post("/caja/cerrar", data);

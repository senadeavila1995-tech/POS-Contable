// src/modules/caja/caja.service.ts
import api from "../../shared/api/axios";

export const getCajaActual = () =>
  api.get<{ id: number; estado: "ABIERTA" | "CERRADA"; monto_inicial: number }>("/caja/actual");

export const abrirCaja = (data: { monto_inicial: number }) =>
  api.post("/caja/abrir", data);

export const cerrarCaja = (data: { caja_id: number; monto_final_real: number; observaciones?: string }) =>
  api.post("/caja/cerrar", data);

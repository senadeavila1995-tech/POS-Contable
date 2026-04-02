// src/modules/ventas/ventas.service.ts
import api from "../../shared/api/axios";
import type { CreateSale, Sale } from "../../shared/types/Sale";

// Listar todas las ventas
export const listarVentas = () => api.get<Sale[]>("/ventas");

// Obtener detalles de una venta
export const getVentaDetalle = (id: number) => api.get<Sale>(`/ventas/${id}`);

// Crear nueva venta
export const crearVenta = (data: CreateSale) => api.post("/ventas", data);

// Anular venta
export const anularVenta = (id: number) => api.patch(`/ventas/${id}/anular`);

// Facturar venta
export const facturarVenta = (id: number) => api.post(`/ventas/${id}/facturar`);


// src/modules/ventas/ventas.service.ts (frontend)
export const ventasPorDia = (empresa_id: number) =>
  api.get(`/ventas/dashboard/por-dia/${empresa_id}`);

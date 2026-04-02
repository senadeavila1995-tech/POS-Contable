// src/modules/compras/compras.service.ts
import api from "../../shared/api/axios";
import type { Compra } from "../../shared/types/Compra";

// Listar todas las compras
export const getCompras = () => api.get<Compra[]>("/compras");

// Obtener compra por ID
export const getCompraById = (id: number) => api.get<Compra>(`/compras/${id}`);

// Crear nueva compra
export const createCompra = (data: Omit<Compra, "id" | "creado_en">) => api.post<Compra>("/compras", data);

// Actualizar compra
export const updateCompra = (id: number, data: Partial<Omit<Compra, "id" | "creado_en">>) => 
  api.put<Compra>(`/compras/${id}`, data);

// Eliminar compra
export const deleteCompra = (id: number) => api.delete(`/compras/${id}`);

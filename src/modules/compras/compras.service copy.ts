// src/modules/compras/compras.service.ts
import api from "../../shared/api/axios";
import type { Compra } from "../../shared/types/Compra";

export const getCompras = () => api.get<Compra[]>("/compras");
export const getCompraById = (id: number) => api.get<Compra>(`/compras/${id}`);
export const createCompra = (data: Omit<Compra, "id" | "creado_en">) => api.post<Compra>("/compras", data);
export const updateCompra = (id: number, data: Partial<Omit<Compra, "id" | "creado_en">>) => api.put<Compra>(`/compras/${id}`, data);
export const deleteCompra = (id: number) => api.delete(`/compras/${id}`);

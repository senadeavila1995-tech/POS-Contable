import api from '../services/api';
import type { CreateSale, Sale } from '../../shared/types/Sale';


export const listarVentas = () => api.get<Sale[]>('/ventas');


export const getVentaDetalle = (id: number) =>
  api.get(`/ventas/${id}`);


export const crearVenta = (data: CreateSale) =>
api.post('/ventas', data);


export const anularVenta = (id: number) =>
api.patch(`/ventas/${id}/anular`);

export const facturarVenta = (ventaId: number) =>
  api.post(`/ventas/${ventaId}/facturar`);

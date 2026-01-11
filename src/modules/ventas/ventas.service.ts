import api from '../services/api';
import type { CreateSale, Sale, SaleDetail } from '../../shared/types/Sale';


export const listarVentas = () => api.get<Sale[]>('/ventas');


export const getVentaDetalle = (id: number) =>
api.get<SaleDetail[]>(`/ventas/${id}/detalle`);


export const crearVenta = (data: CreateSale) =>
api.post('/ventas', data);


export const anularVenta = (id: number) =>
api.patch(`/ventas/${id}/anular`);
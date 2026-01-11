// src/modules/dashboard/dashboardService.ts
import api from '../services/api'; // ajusta la ruta según tu proyecto

// Solo tipos para TS (no se importan en runtime)
export interface TopProduct {
  nombre: string;
  total_vendido: number;
  total_ingresos: number;
}

export interface VentasDia {
  dia: number;
  total_dia: number;
}

// Funciones que sí existen en runtime
export const getTopProductsDashboard = (): Promise<TopProduct[]> =>
  api.get<TopProduct[]>('/ventas/dashboard/top-productos').then(res => res.data);

export const getVentasPorDiaDashboard = (): Promise<VentasDia[]> =>
  api.get<VentasDia[]>('/ventas/dashboard/ventas-dia').then(res => res.data);

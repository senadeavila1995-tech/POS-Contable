export interface CartItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreateSale {
  metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  cliente_id?: number; // listo para después
  detalles: {
    producto_id: number;
    cantidad: number;
  }[];
}


export interface Sale {
id: number;
usuario_id: number;
total: number;
metodo_pago: string;
estado: string;
creado_en: string;
}


export interface SaleDetail {
id: number;
venta_id: number;
producto_id: number;
cantidad: number;
precio_unitario: number;
subtotal: number;
nombre: string;
}
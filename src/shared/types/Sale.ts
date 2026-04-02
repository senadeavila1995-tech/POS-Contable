export interface CartItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreateSale {
  usuario_id: number;               // <--- agregar
  empresa_id: number;               // <--- agregar
  cliente_id: number;
  caja_id: number;
  metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}



export interface Sale {
id: number;
usuario_id: number;
total: number;
metodo_pago: string;
estado: string;
creado_en: string;
empresa_id:number;
caja_id: number;
}


export interface SaleDetail {
  id: number;
  producto_id: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}


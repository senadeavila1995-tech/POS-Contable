export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock_unidades: number;
  peso_unitario: number;
  unidad_peso: "g" | "kg" | "lb";
  talla?: string | null;
  imagen_url?: string | null;
  estado: number;
  categoria_id: number;
  creado_en: string;
  actualizado_en: string;
}

export type ProductDto = Omit<
  Product,
  "id" | "estado" | "creado_en" | "actualizado_en"
>;

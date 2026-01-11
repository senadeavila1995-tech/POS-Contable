import { useEffect, useState } from "react";
import type { Product } from "../../shared/types/Product";
import type { Category } from "../../shared/types/Category";
import { getCategories } from "../categorias/category.service";

interface Props {
  product: Product | null;
  onSave: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}
type ProductFormData = Omit<
  Product,
  "id" | "creado_en" | "actualizado_en"
>;

export const ProductsForm = ({ product, onSave, onClose }: Props) => {
  const [form, setForm] = useState<ProductFormData>({
  nombre: product?.nombre ?? "",
  descripcion: product?.descripcion ?? "",
  precio: product?.precio ?? 0,
  stock_unidades: product?.stock_unidades ?? 0,
  peso_unitario: product?.peso_unitario ?? 0,
  unidad_peso: product?.unidad_peso ?? "kg",
  categoria_id: product?.categoria_id ?? 0,
  talla: product?.talla ?? "",
  imagen_url: product?.imagen_url ?? "",
  estado: product?.estado ?? NaN,
});


  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const numericFields = [
      "precio",
      "stock_unidades",
      "peso_unitario",
      "categoria_id",
    ];

    setForm(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoria_id) {
      alert("Seleccione una categoría");
      return;
    }

    await onSave(form);
    onClose();
  };

  return (
    
    <form
      onSubmit={handleSubmit}
      className="container p-4 border rounded bg-white"
      style={{ maxWidth: 600 }}
    >
      <h5 className="mb-4 text-center fw-bold">
        {product ? "Editar producto" : "Nuevo producto"}
      </h5>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input
          className="form-control"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            name="precio"
            value={form.precio}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock_unidades"
            value={form.stock_unidades}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Peso</label>
          <input
            type="number"
            className="form-control"
            name="peso_unitario"
            value={form.peso_unitario}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Unidad de peso</label>
          <select
            className="form-select"
            name="unidad_peso"
            value={form.unidad_peso}
            onChange={handleChange}
          >
            <option value="g">Gramos</option>
            <option value="kg">Kilos</option>
            <option value="lb">Libras</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="categoria_id"
            value={form.categoria_id ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-dark">
          Guardar
        </button>
      </div>
    </form>
  );
};

import { useEffect, useState } from "react";
import {
  listarVentas,
  getVentaDetalle,
  crearVenta
} from "./ventas.service";

import type {
  Sale,
  SaleDetail,
  CartItem,
  CreateSale
} from "../../shared/types/Sale";
import axios from "axios";
import { getProductById } from "../productos/Product.service";
import { getClienteByDocumento } from "../Clientes/cliente.service";
import type { Product } from "../../shared/types/Product";
import type { Cliente } from "../../shared/types/Cliente";

const VentasPage = () => {
  /* ===============================
     ESTADOS
  =============================== */
  const [ventas, setVentas] = useState<Sale[]>([]);
  const [detalleVenta, setDetalleVenta] = useState<SaleDetail[]>([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<number | null>(null);

  const [carrito, setCarrito] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productoId, setProductoId] = useState("");
  const [documento, setDocumento] = useState("");

  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);

  /* ===============================
     CARGAR VENTAS
  =============================== */
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const res = await listarVentas();
      setVentas(res.data);
    } catch {
      setError("Error al cargar ventas");
    }
  };

  /* ===============================
     BUSCAR PRODUCTO
  =============================== */
  const buscarProductoPorId = async () => {
    if (!productoId) return;

    try {
      const res = await getProductById(Number(productoId));
      agregarAlCarrito(res.data);
      setProductoId("");
      setError(null);
    } catch {
      setError("Producto no encontrado");
    }
  };

  /* ===============================
     BUSCAR CLIENTE
  =============================== */
  const buscarCliente = async () => {
    if (!documento) {
      setError("Ingrese un documento");
      return;
    }

    try {
      const res = await getClienteByDocumento(documento);
      setClienteEncontrado(res.data);
      setMostrarFormularioCliente(false);
      setError(null);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setClienteEncontrado(null);
        setMostrarFormularioCliente(true);
        setError(null);
        return;
      }
      setError("Error al buscar cliente");
    }
  };

  /* ===============================
     CARRITO
  =============================== */
  const agregarAlCarrito = (producto: Product) => {
    setCarrito((prev) => {
      const existente = prev.find(
        (item) => item.producto_id === producto.id
      );

      if (existente) {
        return prev.map((item) =>
          item.producto_id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * item.precio_unitario
              }
            : item
        );
      }

      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precio_unitario: producto.precio,
          subtotal: producto.precio
        }
      ];
    });
  };

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  /* ===============================
     CONFIRMAR VENTA
  =============================== */
  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    if (!clienteEncontrado) {
      setError("Debe seleccionar o registrar un cliente");
      return;
    }

    const payload: CreateSale = {
      metodo_pago: "EFECTIVO",
      cliente_id: clienteEncontrado.id,
      detalles: carrito.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))
    };

    try {
      setLoading(true);
      const res = await crearVenta(payload);
      console.log(res.data)
      const ventaId = res.data.venta_id;

      window.open(
        `http://localhost:3000/api/facturas/${ventaId}/pdf`,
        "_blank"
      );

      setCarrito([]);
      setClienteEncontrado(null);
      await cargarVentas();
      alert("Venta registrada correctamente");
    } catch {
      setError("Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DETALLE
  =============================== */
  const verDetalle = async (ventaId: number) => {
    try {
      const res = await getVentaDetalle(ventaId);
      setDetalleVenta(res.data);
      setVentaSeleccionada(ventaId);
    } catch {
      setError("Error al cargar detalle de venta");
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Módulo de Ventas</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ===============================
          NUEVA VENTA
      =============================== */}
      <div className="row g-4 mb-4">
        {/* Producto */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Producto</h5>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="ID del producto"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
              />
              <button className="btn btn-dark w-100" onClick={buscarProductoPorId}>
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Cliente</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
              {mostrarFormularioCliente && (
                <div className="text-warning small mb-2">
                  Cliente no encontrado. Regístrelo.
                </div>
              )}
              {clienteEncontrado && (
                <div className="text-success small mb-2">
                  Cliente encontrado. 
                </div>
              )}
              <button className="btn btn-outline-dark w-100" onClick={buscarCliente}>
                Buscar cliente
              </button>
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Carrito</h5>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item.producto_id}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h6 className="fw-bold">Total: ${total}</h6>

              <button
                className="btn btn-success w-100"
                onClick={confirmarVenta}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar venta"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===============================
          LISTA DE VENTAS
      =============================== */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>${v.total}</td>
                <td>{v.metodo_pago}</td>
                <td>
                  <span className="badge bg-dark">{v.estado}</span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => verDetalle(v.id)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===============================
          DETALLE
      =============================== */}
      {ventaSeleccionada && (
        <>
          <hr />
          <h5 className="fw-bold">
            Detalle de venta #{ventaSeleccionada}
          </h5>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalleVenta.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>${d.precio_unitario}</td>
                  <td>${d.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default VentasPage;

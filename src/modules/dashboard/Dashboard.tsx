// src/pages/Dashboard.tsx

import { FC, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import { getTopProductsDashboard,  getVentasPorDiaDashboard,  } from './dashboardService';

import type {TopProduct , VentasDia}  from './dashboardService';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6F91', '#FF9F1C', '#2EC4B6'];

export const Dashboard: FC = () => {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ventasPorDia, setVentasPorDia] = useState<VentasDia[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, ventas] = await Promise.all([
          getTopProductsDashboard(),
          getVentasPorDiaDashboard()
        ]);
        setTopProducts(products);
        setVentasPorDia(ventas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Cargando dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Dashboard POS</h2>

      <Row className="mb-4">
        <Col lg={8} md={12}>
          <Card className="shadow-sm">
            <Card.Header>Productos más vendidos</Card.Header>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_vendido" fill="#0088FE" name="Cantidad vendida" />
                  <Bar dataKey="total_ingresos" fill="#00C49F" name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="shadow-sm">
            <Card.Header>Porcentaje de ventas</Card.Header>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    dataKey="total_vendido"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>Ingresos diarios del mes</Card.Header>
            <Card.Body style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventasPorDia} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" label={{ value: "Día", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Ingresos", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_dia" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

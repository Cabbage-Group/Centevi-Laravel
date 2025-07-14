import React, { useState } from 'react';
import { Row, Col, Card, Input, DatePicker, Tabs, Select, Button, Typography } from 'antd';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const CrearCobro = () => {
    const [fecha, setFecha] = useState(null);

    return (
        <div style={{ padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Crear Cobro</Title>
                </Col>
                <Col>
                    <Button type="primary">Crear Cobro</Button>
                </Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card title="Cuenta Relacionada">
                        <Select
                            showSearch
                            placeholder="Buscar Cuenta Rápida"
                            style={{ width: '100%', marginBottom: 16 }}
                            options={[]}
                        />
                        <Button block type="default">Buscar Cuenta</Button>
                    </Card>

                    <Card title="Propiedades del Cobro" style={{ marginTop: 24 }}>
                        <Input placeholder="Referencia" style={{ marginBottom: 16 }} />
                        <DatePicker
                            value={fecha}
                            onChange={(date) => setFecha(date)}
                            style={{ width: '100%', marginBottom: 16 }}
                            placeholder="Seleccionar Fecha"
                        />
                        <TextArea rows={4} placeholder="Escriba un comentario" />
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Cobrar Facturas" key="1">
                            <Select
                                showSearch
                                placeholder="Buscar proyecto..."
                                style={{ width: '100%', marginBottom: 24 }}
                                options={[]}
                            />
                            <Text type="secondary">Seleccione las facturas a cobrar:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text strong type="danger">Seleccione un cliente primero!</Text>
                            </div>
                        </TabPane>
                        <TabPane tab="Abono a Cuenta" key="2">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <div style={{ marginBottom: 16 }}>
                                        <label>Buscar cotización</label>
                                        <Select
                                            showSearch
                                            placeholder="Buscar cotización..."
                                            style={{ width: '100%' }}
                                            options={[]}
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div style={{ marginBottom: 16 }}>
                                        <label>Asociar Cotización</label>
                                        <Select
                                            showSearch
                                            placeholder="Buscar Cotización..."
                                            style={{ width: '100%' }}
                                            options={[]}
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label>Monto del abono</label>
                                        <Input
                                            type="number"
                                            placeholder="Monto del abono"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>

                    </Tabs>
                </Col>
            </Row>
        </div>
    );
};

export default CrearCobro;

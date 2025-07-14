import React from 'react';
import { Table, Input, Row, Col, Typography } from 'antd';
import '../../../css/tables/TableCotizaciones.css'
const { Title } = Typography;

const TableCobros = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
        },
        {
            title: 'Referencia',
            dataIndex: 'referencia',
            key: 'referencia',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
        },
    ];

    const data = [
        {
            key: '1',
            id: '1',
            cliente: 'Juan Pérez',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '2',
            id: '2',
            cliente: 'Juan Pérez2',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '3',
            id: '3',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '4',
            id: '4',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '5',
            id: '5',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '6',
            id: '6',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '8',
            id: '8',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '9',
            id: '9',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '10',
            id: '10',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '11',
            id: '11',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '12',
            id: '12',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '13',
            id: '13',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '14',
            id: '14',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '15',
            id: '15',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '16',
            id: '16',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '17',
            id: '17',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },
        {
            key: '18',
            id: '18',
            cliente: 'Juan Pérez3',
            fecha: '2023-04-01',
            referencia: 'Sucursal1',
            estado: 'CLOSED',
            monto: '30.00',
        },

    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={4}>Cobros</Title>

            <Row style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                    <Input.Search placeholder="Buscar..." style={{ maxWidth: 300 }} allowClear />
                </Col>
            </Row>

            <Table
                className="compact-table"
                columns={columns}
                dataSource={data}
                pagination={{
                    current:  1,
                    pageSize: 18,
                    showSizeChanger: false,
                }}
                bordered
            />
        </div>
    );
};

export default TableCobros;

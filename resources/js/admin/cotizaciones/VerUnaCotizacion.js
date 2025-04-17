import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    DatePicker,
    InputNumber,
    Select,
    Space,
    Table,
    Typography,
    Divider,
    Row,
    Col,
    Switch
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchExchangeRate, VerUnaQuote } from '../../redux/features/quotes/quotesSlice';
import { useParams } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const VerUnaCotizacion = () => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { exchangeRate, quote } = useSelector((state) => state.quotes);
    const nombre = localStorage.getItem('nombre');
    const [lines, setLines] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(VerUnaQuote(id));
        }
    }, [id]);

    useEffect(() => {
        if (exchangeRate || quote) {
            form.setFieldsValue({
                Vendedor: nombre || '',
                Currency_Rate: exchangeRate,
                Cliente: quote?.Cliente,
                Status: quote?.Status,
                Type: quote?.Type,
                Date: quote?.Date ? dayjs(quote.Date) : null,
                Expira: quote?.Expira ? dayjs(quote.Expira) : null,
                Bodega: quote?.Bodega,
                Vendedor: quote?.Vendedor,
                Reservar_Productos: quote?.Reservar_Productos === 'SI',
                Comentario: quote?.Comentario,
                Taxes: quote?.Taxes,
                SubTotal: quote?.SubTotal,
                Total: quote?.Total

            });

            if (quote?.lines && Array.isArray(quote.lines)) {
                setLines(quote.lines.map((line, index) => ({
                    key: index,
                    ...line
                })));
            }
        }
    }, [form, nombre, exchangeRate, quote]);

    useEffect(() => {
        dispatch(fetchPacientes({ page: 1, limit: 50000 }))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchExchangeRate());
    }, []);

    const columns = [
        {
            title: 'Código',
            dataIndex: 'Codigo',
            key: 'Codigo',
            width: 250,
            render: (text, record, index) => {
                return (
                    <Select
                        showSearch
                        disabled
                        style={{ width: '100%' }}
                        value={record.Codigo}
                        placeholder="Selecciona un producto"
                        optionFilterProp="children"
                        filterOption={false}
                    >
                    </Select >
                )
            }
        },
        {
            title: 'Nombre',
            dataIndex: 'Nombre',
            key: 'Nombre',
            width: 250,
            render: (text, record, index) => (
                <Select
                    showSearch
                    disabled
                    style={{ width: '100%' }}
                    placeholder="Selecciona un producto"
                    value={record.Nombre}
                    optionFilterProp="children"
                >

                </Select>
            )
        },
        {
            title: 'Marca',
            dataIndex: 'Marca',
            key: 'Marca',
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => updateLine(index, 'Marca', e.target.value)}
                    disabled
                />
            )
        },
        {
            title: 'Unidades',
            dataIndex: 'Unidades',
            key: 'Unidades',
            render: (text, record, index) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(value) => updateLine(index, 'Unidades', value)}
                    precision={2}
                    min={0}
                    disabled
                />
            )
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'Precio_Unitario',
            key: 'Precio_Unitario',
            render: (text, record, index) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(value) => updateLine(index, 'Precio_Unitario', value)}
                    precision={4}
                    min={0}
                    disabled
                />
            )
        },
        {
            title: '% Descuento',
            dataIndex: 'DiscountFactor',
            key: 'DiscountFactor',
            render: (text, record, index) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={parseFloat(text) * 100}
                    onChange={(value) => updateLine(index, 'DiscountFactor', value / 100)}
                    min={0}
                    max={100}
                    precision={2}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace('%', '')}
                    disabled
                />
            )
        },
        {
            title: 'Descuento ($)',
            dataIndex: 'Discount',
            key: 'Discount',
            render: (text) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={parseFloat(text)}
                    precision={2}
                    disabled
                />
            )
        },
        {
            title: 'Impuestos',
            dataIndex: 'TaxValue',
            key: 'TaxValue',
            render: (text) => (
                <InputNumber
                    value={parseFloat(text)}
                    disabled
                    precision={2}
                />
            )
        },
        {
            title: 'Total',
            dataIndex: 'Total',
            key: 'Total',
            render: (text) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={parseFloat(text)}
                    disabled
                    precision={2}

                />
            )
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record, index) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeLine(index)}
                    disabled
                />
            )
        }
    ];

    return (
        <Card title={<Title level={2}>Factura Bodega</Title>}>
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="Cliente"
                            label="Cliente"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select
                                placeholder="Seleccione un cliente"
                                showSearch
                                optionFilterProp="children"
                                disabled
                            >
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            name="Status"
                            label="Estado"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select disabled>
                                <Option value="ACTIVE">ACTIVO</Option>
                                <Option value="INACTIVE">INACTIVO</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Type"
                            label="Tipo"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select disabled>
                                <Option value="SALES-TEAM">EQUIPO DE VENTAS</Option>
                                <Option value="CUSTOMER">CLIENTE</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="Date"
                            label="Fecha Inicio"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Expira"
                            label="Fecha de Expiración"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Bodega"
                            label="Bodega"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select
                                placeholder="Seleccione una Bodega"
                                showSearch
                                optionFilterProp='children'
                                disabled
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Vendedor"
                            label="Vendedor"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="Currency"
                            label="Moneda"
                            initialValue="USD"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Currency_Rate"
                            label="Tasa de Cambio"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <InputNumber style={{ width: '100%' }} precision={9} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Reservar_Productos"
                            label="Reservar Productos"
                            valuePropName="checked"
                        >
                            <Switch
                                disabled
                                checkedChildren="SI" unCheckedChildren="NO"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="Comentario"
                    label="Comentario"
                >
                    <Input.TextArea
                        disabled
                        rows={4}
                    />
                </Form.Item>

                <Divider>Líneas de Factura</Divider>

                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="dashed"
                        disabled
                        icon={<PlusOutlined />}
                    >
                        Agregar Línea
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={lines.map((line, index) => ({ ...line, key: index }))}
                    pagination={false}
                    bordered
                    size="small"
                />

                <Divider />
                <Row gutter={16}>
                    <Col span={8} offset={8}>
                        <Form.Item
                            name="Taxes"
                            label="Impuesto"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                precision={2}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8} offset={8}>
                        <Form.Item
                            name="SubTotal"
                            label="Subtotal"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                precision={2}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8} offset={8}>
                        <Form.Item
                            name="Total"
                            label="Total"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                precision={2}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled
                        >
                            Guardar Cotización
                        </Button>
                        <Button>
                            Cancelar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default VerUnaCotizacion;
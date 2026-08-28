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
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { convertQuote, fetchExchangeRate, VerUnaQuote } from '../../redux/features/quotes/quotesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import CrearOrdenModal from './components/CrearOrdenModal';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';

const { Option } = Select;
const { Title } = Typography;

const VerUnaCotizacion = () => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { exchangeRate, quote } = useSelector((state) => state.quotes);
  const { sucursales_option_selects } = useSelector((state) => state.sucursales);
  const nombre = localStorage.getItem('nombre');
  const [lines, setLines] = useState([]);
  const { id } = useParams();
  const [openCrearOrden, setOpenCrearOrden] = useState(false);
  const [idSucursal, setIdSucursal] = useState(null);
  const [ordenCreada, setOrdenCreada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(VerUnaQuote(id));
      dispatch(fetchSucursales({ page: 1, limit: 100 }));
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
        Total: quote?.Total,
        Discount: quote?.Discount,
        SubTotalMenosDescuentos: quote?.SubTotal - quote?.Discount

      });

      if (quote?.lines && Array.isArray(quote.lines)) {
        setLines(quote.lines.map((line, index) => ({ key: index, ...line })));
      }
      if (quote?.orden) {
        setOrdenCreada(quote.orden);
      }
    }
  }, [form, nombre, exchangeRate, quote]);


  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 50000 }))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchExchangeRate());
  }, []);

  const handleCrearOrden = async () => {
    console.log('quote2::', quote);

    if (!quote?.id || !idSucursal) {
      message.warning('Seleccione una sucursal');
      return;
    }

    try {
      const result = await dispatch(
        convertQuote({
          quote_id: quote.id,
          id_sucursal: idSucursal,
        })
      ).unwrap();

      console.log('Respuesta convertir orden:', result);

      if (!result?.orden) {
        console.error('No se encontró la orden:', result);
        message.error('La orden fue creada pero no se pudo obtener la información');
        return;
      }

      // Guardamos TODA la orden
      setOrdenCreada(result.orden);

    } catch (error) {
      console.error('Error al convertir cotización:', error);

      message.error(
        error?.message || 'No se pudo convertir la cotización en orden'
      );
    }
  };



  const columns = [
    {
      title: 'Código',
      dataIndex: 'Item_Number',
      key: 'Item_Number',
      width: "100px",
      render: (text, record, index) => {
        return (
          <Select
            showSearch
            disabled
            style={{ width: '100px' }}
            value={record.Item_Number}
            placeholder="Selecciona un producto"
            optionFilterProp="children"
            filterOption={false}
            title={record.Item_Number}
          >
          </Select >
        )
      }
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      width: "150px",
      render: (text, record, index) => (
        <Select
          showSearch
          disabled
          style={{ width: '150px', color: 'black' }}
          placeholder="Selecciona un producto"
          value={record.Nombre}
          optionFilterProp="children"
          title={record.Nombre}
        >

        </Select>
      )
    },
    // {
    //   title: 'Marca',
    //   dataIndex: 'Marca',
    //   key: 'Marca',
    //   render: (text, record, index) => (
    //     <Input
    //       value={text}
    //       onChange={(e) => updateLine(index, 'Marca', e.target.value)}
    //       disabled
    //       style={{ width: '100%', color: 'black' }}
    //       title={text}
    //     />
    //   )
    // },
    {
      title: 'Unidades',
      dataIndex: 'Unidades',
      key: 'Unidades',
      render: (text, record, index) => (
        <InputNumber
          style={{ width: '100%', color: 'black' }}
          value={text}
          onChange={(value) => updateLine(index, 'Unidades', value)}
          precision={2}
          min={0}
          disabled
          title={text}
        />
      )
    },
    {
      title: 'P. Unitario',
      dataIndex: 'Precio_Unitario',
      key: 'Precio_Unitario',
      render: (text, record, index) => (
        <InputNumber
          style={{ width: '100%', color: 'black' }}
          value={text}
          onChange={(value) => updateLine(index, 'Precio_Unitario', value)}
          precision={2}
          min={0}
          disabled
          title={parseFloat(text)}
        />
      )
    },

    {
      title: 'SubTotal',
      dataIndex: 'SubTotal',
      key: 'SubTotal',
      render: (text, record) => (
        <InputNumber
          value={parseFloat(record.SubTotal)}
          disabled
          precision={2}
          style={{ width: '100%', color: 'black' }}
          title={parseFloat(record.SubTotal)}
          onClick={() => console.log(record)}
        />
      )
    },

    {
      title: '% Descuento',
      dataIndex: 'DiscountFactor',
      key: 'DiscountFactor',
      render: (text, record, index) => (
        <InputNumber
          style={{ width: '100%', color: 'black' }}
          value={parseFloat(text) * 100}
          onChange={(value) => updateLine(index, 'DiscountFactor', value / 100)}
          min={0}
          max={100}
          precision={2}
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace('%', '')}
          disabled
          title={parseFloat(text)}
        />
      )
    },
    {
      title: 'Descuento ($)',
      dataIndex: 'Discount',
      key: 'Discount',
      render: (text) => (
        <InputNumber
          style={{ width: '100%', color: 'black' }}
          value={parseFloat(text)}
          precision={2}
          disabled
          title={parseFloat(text)}
        />
      )
    },
    // {
    //   title: 'Impuestos',
    //   dataIndex: 'TaxValue',
    //   key: 'TaxValue',
    //   render: (text) => (
    //     <InputNumber
    //       value={parseFloat(text)}
    //       disabled
    //       precision={2}
    //       style={{ width: '100%', color: 'black' }}
    //       title={parseFloat(text)}
    //     />
    //   )
    // },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      render: (text) => (
        <InputNumber
          style={{ width: '100%', color: 'black' }}
          value={parseFloat(text)}
          disabled
          precision={2}
          title={parseFloat(text)}
        />
      )
    },
    // {
    //   title: 'Acciones',
    //   key: 'actions',
    //   render: (_, record, index) => (
    //     <Button
    //       type="text"
    //       danger
    //       icon={<DeleteOutlined />}
    //       onClick={() => removeLine(index)}
    //       disabled
    //     />
    //   )
    // }
  ];

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Cotizaciones
          </Title>

          <Button
            type="primary"
            onClick={() => {
              if (ordenCreada) {
                navigate(
                  `/orden-receta/${ordenCreada.id_orden}/${ordenCreada.nro_orden_id}/${ordenCreada.id_paciente}`
                );
              } else {
                setOpenCrearOrden(true);
              }
            }}
          >
            {ordenCreada
              ? `Ver orden ${ordenCreada.nro_orden_id}`
              : 'Crear orden'}
          </Button>
        </div>
      }
    >
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
                style={{ color: 'black !important' }}
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

        <Row>
          <Col xxl={14} xl={14} md={14}></Col>
          <Col xxl={10} xl={10} md={10}>
            <Row gutter={16}>
              <Col xxl={12} xl={12} md={12}>
                SubTotal
              </Col>
              <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                <Form.Item
                  name="SubTotal"
                // label="Subtotal"
                >
                  <InputNumber
                    style={{ width: '100%', color: 'black', textAlign: 'right' }}
                    disabled
                    precision={2}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/*  */}

            <Row gutter={16}>
              <Col xxl={12} xl={12} md={12}>
                Descuento Total
              </Col>
              <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                <Form.Item
                  name="Discount"
                // label="Discount"
                >
                  <InputNumber
                    style={{ width: '100%', color: 'black', textAlign: 'right' }}
                    disabled
                    precision={2}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xxl={12} xl={12} md={12}>
                Subtotal menos descuento
              </Col>
              <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                <Form.Item
                  name="SubTotalMenosDescuentos"
                // label="SubTotalMenosDescuentos"
                >
                  <InputNumber
                    style={{ width: '100%', color: 'black', textAlign: 'right' }}
                    disabled
                    precision={2}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/*  */}

            <Row gutter={16}>
              <Col xxl={12} xl={12} md={12}>
                Impuesto
              </Col>
              <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                <Form.Item
                  name="Taxes"
                // label="Impuesto"
                >
                  <InputNumber
                    style={{ width: '100%', color: 'black', textAlign: 'right' }}
                    disabled
                    precision={2}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xxl={12} xl={12} md={12}>
                Total
              </Col>
              <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                <Form.Item
                  name="Total"
                // label="Total"
                >
                  <InputNumber
                    style={{ width: '100%', color: 'black', textAlign: 'right' }}
                    disabled
                    precision={2}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>

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
            <Button
              onClick={() => navigate('/table-cotizaciones')}
            >
              Cancelar
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <CrearOrdenModal
        open={openCrearOrden}
        onCancel={() => setOpenCrearOrden(false)}
        quote={quote}
        sucursales={sucursales_option_selects}
        idSucursal={idSucursal}
        setIdSucursal={setIdSucursal}
        onCrearOrden={handleCrearOrden}
        ordenCreada={ordenCreada}
        onVerOrden={(orden) => {
          console.log('Ver orden:', orden);

          navigate(
            `/orden-receta/${orden.id_orden}/${orden.nro_orden_id}/${orden.id_paciente}`
          );
        }}
        onVerListaOrdenes={() => {
          navigate(
            `/ordenes`
          );
        }}
      />
    </Card>

  );
};


export default VerUnaCotizacion;
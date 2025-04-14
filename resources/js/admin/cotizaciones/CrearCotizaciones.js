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
  Switch,
  message
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { createInterfuerzaQuotes } from '../../redux/features/interfuerza/interfuerzaQuotes/interfuerzaQuotesSlice';
import { fetchInterfuerzaCustomers } from '../../redux/features/interfuerza/interfuerzaCustomers/interfuerzaCustomersSlice';
import { fetchInterfuerzaWareHouses } from '../../redux/features/interfuerza/interfuerzaWareHouses/interfuerzaWareHousesSlice';

const { Option } = Select;
const { Title } = Typography;
const TAX_RATE = 0.07;

const CrearCotizacion = () => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { interfuerzaQuotes } = useSelector((state) => state.interfuerzaQuotes);
  const { interfuerzaWareHouses } = useSelector((state) => state.interfuerzaWareHouses);
  const {
    interfuerzaCustomers,
    Status,
    page,
    hasMore
  } = useSelector((state) => state.interfuerzaCustomers);
  const [lines, setLines] = useState([]);
  const [searchValue, setSearchValue] = useState('');


  // const initialValues = {
  //   id: '00001',
  //   Cliente: 'C0001',
  //   Token: '2131212ddsqeq123123',
  //   Bodega: 'SLN BRIGOLF ARRIJAN',
  //   Status: 'ACTIVE',
  //   Date: moment('2015-01-14'),
  //   Expira: moment('2015-02-14'),
  //   Comentario: '',
  //   SubTotal: 5.00,
  //   Discount: 0.00,
  //   Taxes: 0.00,
  //   Total: 5.00,
  //   Reservar_Productos: false,
  //   Type: 'SALES-TEAM',
  //   Vendedor: 'adm@elconix.com',
  //   Currency: 'USD',
  //   Currency_Rate: 1.000000000,
  //   Lines: [
  //     {
  //       Codigo: 'PS0000118',
  //       Descripcion: 'CORTE DE CABELLO',
  //       Item_Number: '0002',
  //       Nombre: 'CORTE DE CABELLO - GLORIA',
  //       Marca: 'GLORIA',
  //       Category_L1: 'SERVICIO SALON',
  //       Category_L2: '',
  //       Category_L3: '',
  //       Unidades: 1.00,
  //       Precio_Unitario: 5.0000,
  //       Discount: 0.00,
  //       DiscountFactor: 0.00,
  //       TaxID: '1',
  //       TaxName: 'ITBMS',
  //       TaxFactor: 0.00,
  //       TaxValue: 0.0000,
  //       Total: 5.00
  //     }
  //   ]
  // };


  useEffect(() => {
    dispatch(fetchInterfuerzaWareHouses())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchInterfuerzaCustomers({ page: 1 }));
  }, [dispatch]);

  const handleSearch = (inputValue) => {
    setSearchValue(inputValue);
    dispatch(fetchInterfuerzaCustomers({
      page: 1,
      field: 'RUC',
      operator: '=',
      value: inputValue
    }));
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && status !== 'loading') {
      dispatch(fetchInterfuerzaCustomers({
        page: page + 1,
        field: 'RUC',
        operator: '=',
        value: searchValue
      }));
    }
  };

  console.log('page:', page)


  const onFinish = async (values) => {
    console.log('values:', values);
    const formattedValues = {
      ...values,
      Date: values.Date?.format('YYYY-MM-DD'),
      Expira: values.Expira?.format('YYYY-MM-DD'),
      Reservar_Productos: values.Reservar_Productos ? 'YES' : 'NO',
      Lines: lines,
    };

    console.log('Datos de formulario enviados:', formattedValues);

    try {
      await dispatch(createInterfuerzaQuotes(formattedValues)).unwrap();
      message.success('✅ Cotización creada exitosamente');
    } catch (error) {
      message.error('❌ Ocurrió un error al crear la cotización');
      console.error(error);
    }
  };

  const addLine = () => {
    setLines([
      ...lines,
      {
        key: Date.now(),
        Codigo: '',
        Descripcion: '',
        Item_Number: '',
        Nombre: '',
        Marca: '',
        Category_L1: '',
        Category_L2: '',
        Category_L3: '',
        Unidades: 0,
        Precio_Unitario: 0,
        Discount: 0,
        DiscountFactor: 0,
        TaxID: '',
        TaxName: '',
        TaxFactor: 0,
        TaxValue: 0,
        Total: 0
      }
    ]);
  };

  const removeLine = (index) => {
    const newLines = [...lines];
    newLines.splice(index, 1);
    setLines(newLines);

    calculateTotals(newLines);
  };

  const updateLine = (index, field, value) => {
    console.log('value2:',value)
    const newLines = [...lines];
    newLines[index][field] = value;

    const line = newLines[index];
    const unidades = parseFloat(line.Unidades || 0);
    const precio = parseFloat(line.Precio_Unitario || 0);
    const discountFactor = parseFloat(line.DiscountFactor || 0);

    if (['Unidades', 'Precio_Unitario', 'DiscountFactor'].includes(field)) {
      const subtotal = unidades * precio;
      const descuento = subtotal * discountFactor;
      const taxableAmount = subtotal - descuento;
      const impuesto = taxableAmount * TAX_RATE;
      const total = subtotal - descuento + impuesto;

      newLines[index].Discount = descuento.toFixed(2);
      newLines[index].TaxValue = impuesto.toFixed(2);
      newLines[index].Total = total.toFixed(2);
    }

    setLines(newLines);

    calculateTotals(newLines);
  };
  const calculateTotals = (currentLines) => {
    const linesArray = currentLines || lines;
    const subtotal = linesArray.reduce((sum, line) => sum + parseFloat(line.Total || 0), 0);

    form.setFieldsValue({
      SubTotal: subtotal.toFixed(2),
      Total: subtotal.toFixed(2)
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'Codigo',
      key: 'Codigo',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateLine(index, 'Codigo', e.target.value)}
        />
      )
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateLine(index, 'Nombre', e.target.value)}
        />
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
        />
      )
    }
  ];

  return (
    <Card title={<Title level={2}>Factura Bodega</Title>}>
      <Form
        form={form}
        layout="vertical"
        // initialValues={initialValues}
        onFinish={onFinish}
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
                onSearch={handleSearch}
                optionFilterProp="children"
                filterOption={false}
                onPopupScroll={handleScroll}
                notFoundContent={status === 'loading' ? <Spin size="small" /> : null}
              >
                {interfuerzaCustomers?.map((customer) => (
                  <Option key={customer.Cliente} value={customer.Cliente}>
                    {customer.RUC} || {customer.Nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="Status"
              label="Estado"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select>
                <Option value="ACTIVE">ACTIVO</Option>
                <Option value="INACTIVE">INACTIVO</Option>
                <Option value="PENDING">PENDIENTE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="Type"
              label="Tipo"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select>
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
              label="Fecha"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="Expira"
              label="Fecha de Expiración"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
              >
                {interfuerzaWareHouses?.map((wareHouse) => (
                  <Option key={wareHouse.Nombre} value={wareHouse.Nombre}>
                    {wareHouse.Nombre}
                  </Option>
                ))}

              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="Vendedor"
              label="Vendedor"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="Currency"
              label="Moneda"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="PAB">PAB</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="Currency_Rate"
              label="Tasa de Cambio"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <InputNumber style={{ width: '100%' }} precision={9} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="Reservar_Productos"
              label="Reservar Productos"
              valuePropName="checked"
            >
              <Switch checkedChildren="SÍ" unCheckedChildren="NO" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="Comentario"
          label="Comentario"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Divider>Líneas de Factura</Divider>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="dashed"
            onClick={addLine}
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
            <Button type="primary" htmlType="submit">
              Guardar Factura
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

export default CrearCotizacion;
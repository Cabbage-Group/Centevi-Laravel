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
  Spin
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createInterfuerzaQuotes } from '../../redux/features/interfuerza/interfuerzaQuotes/interfuerzaQuotesSlice';
import { fetchInterfuerzaCustomers } from '../../redux/features/interfuerza/interfuerzaCustomers/interfuerzaCustomersSlice';
import { fetchInterfuerzaWareHouses } from '../../redux/features/interfuerza/interfuerzaWareHouses/interfuerzaWareHousesSlice';
import { fetchInterfuerzaProducts } from '../../redux/features/interfuerza/interfuerzaProducts/interfuerzaproductsSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { createQuotes, fetchExchangeRate, updateEstadoQuote } from '../../redux/features/quotes/quotesSlice';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { fetchProductsInterfuerza } from '../../redux/features/productsInterfuerza/ProductsInterfuerza';

const { Option } = Select;
const { Title } = Typography;
const TAX_RATE = 0.07;

const CrearCotizacion = () => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { interfuerzaQuotes } = useSelector((state) => state.interfuerzaQuotes);
  const { interfuerzaWareHouses } = useSelector((state) => state.interfuerzaWareHouses);
  const { exchangeRate, exchangeRateStatus } = useSelector((state) => state.quotes);
  const location = useLocation();
  const record = location.state?.record;
  const nombre = localStorage.getItem('nombre');
  const {
    pacientes_options_cotizacion
  } = useSelector((state) => state.pacientes);
  const {
    interfuerzaProducts,
    page_products,
    hasMore_products
  } = useSelector((state) => state.interfuerzaProducts);

  const {
    productsInterfuerza,
    limit,
    page,
    sortColumn,
    sortOrder,
    meta,
    searchTerm,
    status,
    error
} = useSelector((state) => state.productsInterfuerza);

  const [lines, setLines] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchValueProducts, setSearchValueProducts] = useState('');

  useEffect(() => {
    if (exchangeRate) {
      form.setFieldsValue({
        Vendedor: nombre || '',
        Currency_Rate: exchangeRate,
      });
    }
  }, [form, nombre, exchangeRate]);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        Cliente: record.Cliente || '',
        Status: record.Status || '',
        Type: record.Type || '',
        Date: record.Date ? dayjs(record.Date) : null,
        Expira: record.Expira ? dayjs(record.Expira) : null,
        Bodega: record.Bodega || '',
        Vendedor: record.Vendedor || '',
        Reservar_Productos: record?.Reservar_Productos === 'YES',
        Comentario: record.Comentario || '',
        Taxes: record.Taxes || '',
        SubTotal: record.SubTotal || '',
        Total: record.Total || ''

      });

      if (record?.lines && Array.isArray(record.lines)) {
        setLines(record.lines.map((line, index) => ({
          key: index,
          ...line
        })));
      }
    }
  }, [record]);

  useEffect(() => {
    dispatch(fetchPacientes({ page: 1, limit: 50000 }))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchExchangeRate());
  }, []);

  useEffect(() => {
    dispatch(fetchInterfuerzaProducts({}))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchInterfuerzaWareHouses())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProductsInterfuerza({}))
  },[])

  console.log('productsInterfuerza:',productsInterfuerza)

  // useEffect(() => {
  //   dispatch(fetchInterfuerzaCustomers({ page: 1 }));
  // }, [dispatch]);



  const handleSearch = (inputValue) => {
    setSearchValue(inputValue);
    dispatch(fetchInterfuerzaCustomers({
      page: 1,
      field: 'RUC',
      operator: '=',
      value: inputValue
    }));
  };

  const handleSearchProducts = (inputValue) => {
    setSearchValue(inputValue);
    dispatch(fetchInterfuerzaProducts({
      page: 1,
      field: 'Item_Number',
      operator: '=',
      value: inputValue
    }));
  };

  const handleScrollProducts = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore_products && status !== 'loading') {
      dispatch(fetchInterfuerzaProducts({
        page: page_products + 1,
        field: 'Item_Number',
        operator: '=',
        value: searchValueProducts
      }));
    }
  };


  const onFinish = async (values) => {
    console.log('values:', values)
    const formattedValues = {
      ...values,
      Date: values.Date?.format('YYYY-MM-DD'),
      Expira: values.Expira?.format('YYYY-MM-DD'),
      Reservar_Productos: values.Reservar_Productos ? 'YES' : 'NO',
      Lines: lines,
    };

    let responseQuote = null;
    try {
      Swal.fire({
        title: 'Guardando cotización...',
        text: 'Procesando datos en el sistema principal',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      responseQuote = await dispatch(createQuotes(formattedValues)).unwrap();

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Cotización guardada correctamente',
        text: 'Se guardó en el sistema principal.',
        confirmButtonText: 'Continuar'
      });
    } catch (error) {
      console.error('Error en Laravel:', error);
      Swal.close();

      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar en el sistema',
        text: error?.message || 'Ocurrió un error al guardar la cotización.',
        confirmButtonText: 'Entendido'
      });

      return;
    }

    if (responseQuote) {
      try {
        Swal.fire({
          title: 'Enviando a Interfuerza...',
          text: 'Creando cotización en Interfuerza',
          icon: 'info',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const responseInterfuerzaQuote = await dispatch(createInterfuerzaQuotes(formattedValues)).unwrap();
        Swal.close();

        await Swal.fire({
          icon: 'success',
          title: 'Cotización enviada a Interfuerza',
          text: 'Se guardó también en Interfuerza.',
          confirmButtonText: 'Continuar'
        });

        try {
          Swal.fire({
            title: 'Actualizando estado...',
            text: 'Registrando información en el sistema',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await dispatch(updateEstadoQuote({
            id: responseQuote.quote.id,
            data: {
              estado: 1,
              codigo_interfuerza: responseInterfuerzaQuote.data.response.id
            }
          })).unwrap();

          Swal.close();
        } catch (updateError) {
          console.error('Error al actualizar estado:', updateError);
          Swal.close();
        }

      } catch (interfuerzaError) {
        console.error('Error en Interfuerza:', interfuerzaError);
        Swal.close();

        await Swal.fire({
          icon: 'error',
          title: 'Error al crear en Interfuerza',
          text: interfuerzaError?.message || 'No se pudo crear la cotización en Interfuerza.',
          confirmButtonText: 'Entendido'
        });

        try {
          Swal.fire({
            title: 'Actualizando estado...',
            text: 'Registrando el error en el sistema',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await dispatch(updateEstadoQuote({
            id: responseQuote.quote.id,
            data: {
              estado: 0
            }
          })).unwrap();

          Swal.close();
        } catch (updateError) {
          console.error('Error al actualizar estado después del fallo:', updateError);
          Swal.close();
        }
      }
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

  const handleSelectProduct = (index, value) => {
    const selectedWrapper = productsInterfuerza.find(p => p.item_number === value);
    console.log('valor:', value)
    console.log('selectedWrapper:', selectedWrapper)
    const selectedProduct = selectedWrapper;

    if (selectedProduct) {
      updateLine(index, 'Codigo', selectedProduct.codigo);
      updateLine(index, 'Item_Number', selectedProduct.item_number);
      updateLine(index, 'Nombre', selectedProduct.nombre || '');
      updateLine(index, 'Marca', selectedProduct.marca || '');
      updateLine(index, 'Precio_Unitario', parseFloat(selectedProduct.ultimo_costo_unidad) || 0);
      updateLine(index, 'Unidades', 1);
    }
  };



  const calculateTotals = (currentLines) => {
    const linesArray = currentLines || lines;
    const subtotal = linesArray.reduce((sum, line) => sum + parseFloat(line.Total || 0), 0);
    const discount_total = linesArray.reduce((sum, line) => sum + parseFloat(line.Discount || 0), 0);
    const impuesto_total = subtotal * TAX_RATE
    form.setFieldsValue({
      Taxes: impuesto_total.toFixed(2),
      SubTotal: subtotal.toFixed(2) - impuesto_total.toFixed(2),
      Discount: discount_total.toFixed(2),
      Total: subtotal.toFixed(2)
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'Item_Number',
      key: 'Item_Number',
      width: 250,
      render: (text, record, index) => {
        return (
          <Select
            showSearch
            style={{ width: '100%' }}
            value={record.Item_Number}
            placeholder="Selecciona un producto"
            optionFilterProp="children"
            onChange={(value) => {
              console.log('Seleccionado:', value);
              handleSelectProduct(index, value)
            }}
            filterOption={(input, option) => {
              const normalizedInput = input.toLowerCase().trim();
              const normalizedLabel = (option?.children ?? '').toString().toLowerCase();
              return normalizedLabel.includes(normalizedInput);
            }}
          >
            {
              productsInterfuerza.map((item) => (
                <Option
                  key={item?.id} value={item?.item_number}>
                  {item?.item_number}
                </Option>
              ))
            }
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
          style={{ width: '100%' }}
          placeholder="Selecciona un producto"
          value={record.Nombre}
          optionFilterProp="children"
          onChange={(value) => {
            console.log('Seleccionado2222:', value);
            handleSelectProduct(index, value)
          }}
          filterOption={(input, option) => {
            const normalizedInput = input.toLowerCase().trim();
            const normalizedLabel = (option?.children ?? '').toString().toLowerCase();
            return normalizedLabel.includes(normalizedInput);
          }}     
        >
          {
            productsInterfuerza.map((item) => (
              <Option
                key={item?.id} value={item?.item_number}>
                {item?.nombre}
              </Option>
            ))
          }
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
    <Card title={<Title level={2}>Cotizaciones</Title>}>
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
                filterOption={(input, option) => {
                  const searchTerms = input.toLowerCase().split(' ');
                  return searchTerms.every(term =>
                    (option?.label ?? '').toLowerCase().includes(term)
                  );
                }}
                options={pacientes_options_cotizacion}
                notFoundContent={status === 'loading' ? <Spin size="small" /> : null}
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
              <Select>
                <Option value="ACTIVE">ACTIVO</Option>
                <Option value="BILLED">FACTURADA</Option>
                <Option value="APROVED">APROVADA</Option>
                <Option value="EXPIRED">EXPIRADA</Option>
                <Option value="CANCELLED">CANCELADA</Option>
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
          <Col span={6}>
            <Form.Item
              name="Vendedor"
              label="Vendedor"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Input
                disabled
              />
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
              <Switch checkedChildren="SI" unCheckedChildren="NO" />
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
          <Col span={8} offset={16}>
            <Form.Item
              name="Taxes"
              label="Impuesto"
              layout="horizontal"

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
          <Col span={8} offset={16}>
            <Form.Item
              name="SubTotal"
              label="Subtotal"
              layout="horizontal"
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
          <Col span={8} offset={16}>
            <Form.Item
              name="Discount"
              label="Descuento Total"
              layout="horizontal"
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
          <Col span={8} offset={16}>
            <Form.Item
              name="Total"
              label="Total"
              layout="horizontal"
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
        <Row justify="end">
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Guardar Cotización
              </Button>
              <Button>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export default CrearCotizacion;
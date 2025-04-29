import { Button, Card, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const ProductInterfuerza = () => {
  const [form] = Form.useForm();
  const location = useLocation();

  const handleCreate = (values) => {
    console.log('Product Created:', values);
  };

  useEffect(() => {
    if (location.state?.nombreProducto) {
        form.setFieldsValue({ Item_Number: location.state.nombreProducto });
    }
}, [location.state, form]);

  return (
    <Card
      title="Crear Nuevo Producto"
      bordered={false}
      style={{ maxWidth: 1200, margin: 'auto', marginTop: 24, padding: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreate}
      >

        <Divider orientation="left">General del Producto</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Nombre del Producto" name="productName" rules={[{ required: true }]}>
              <Input/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Numero de item." name="Item_Number" rules={[{ required: true }]}>
              <Input/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Proveedor" name="supplier">
              <Select placeholder="Buscar proveedor">
                <Option value="Proveedor1">Proveedor1</Option>
                <Option value="Proveedor2">Proveedor2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="supplier">
              <Select placeholder="Seleccione el estado">
                <Option value="Activo">Activo</Option>
                <Option value="Cancelado">Cancelado</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

   


        <Divider orientation="left">Propiedades del Producto</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tipo de Producto" name="productType" initialValue="PRODUCTO">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="UPC Code" name="upcCode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Marca" name="brand">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Último Costo Unitario" name="lastUnitCost">
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

   
        <Divider orientation="left">Categoría del Producto</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Categoría" name="category">
              <Select placeholder="Selecciona una categoría">
                <Option value="CAMARAS">CAMARAS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Categoría L2" name="categoryL2">
              <Select placeholder="Selecciona subcategoría">
                <Option value="INSTANTANEAS">INSTANTANEAS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Categoría L3" name="categoryL3">
              <Select placeholder="Selecciona detalle">
                <Option value="CANON">CANON</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

  
        <Divider orientation="left">Tags del Producto</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tags del Producto" name="tags">
              <Select mode="tags" placeholder="Relaciona los tags del producto">
                <Option value="ACCESORIOS">ACCESORIOS</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

 
        <Row justify="end">
          <Col>
            <Button type="primary" htmlType="submit">
              Crear
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProductInterfuerza;

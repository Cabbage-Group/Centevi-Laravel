import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Segmented, Table, Button, Modal, Form, Input, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import {
  createCristales,
  deleteCristales,
  fetchCristales,
  updateCristales,
} from "../../redux/features/cristales/cristalesSlice";
import {
  createMateriales,
  deleteMateriales,
  fetchMateriales,
  updateMateriales
} from "../../redux/features/materiales/materialesSlice";
import {
  createTratamientos,
  deleteTratamientos,
  fetchTratamientos,
  updateTratamientos
} from "../../redux/features/tratamientos/tratamientosSlice";
import { createMarcas, deleteMarcas, fetchMarcas, updateMarcas } from "../../redux/features/marcas/marcasSlice";
import { createTiposAros, deleteTiposAros, fetchTiposAros, updateTiposAros } from "../../redux/features/tipos-aros/tiposArosSlice";
import { createProveedorMaterial, deleteProveedorMaterial, fetchProveedorMaterial, updateProveedorMaterial } from "../../redux/features/proveedor-material/proveedorMaterialSlice";

const CristalesMaterialesTratamientos = () => {
  const dispatch = useDispatch();
  const [selectedTable, setSelectedTable] = useState("Cristales");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterLenteContacto, setFilterLenteContacto] = useState(0);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);


  const [isLenteContacto, setIsLenteContacto] = useState(false);

  const { cristales } = useSelector((state) => state.cristales);
  const { materiales } = useSelector((state) => state.materiales);
  const { tratamientos } = useSelector((state) => state.tratamientos);
  const { tiposAros } = useSelector((state) => state.tiposAros)
  const { marcas_lente_contacto, marcas_lente_normal } = useSelector((state) => state.marcas)
  const { proveedorMaterial } = useSelector((state) => state.proveedorMaterial)

  useEffect(() => {
    dispatch(fetchCristales());
    dispatch(fetchMateriales());
    dispatch(fetchTratamientos());
    dispatch(fetchMarcas());
    dispatch(fetchTiposAros());
    dispatch(fetchProveedorMaterial());
  }, [dispatch]);

  // Manejo del modal
  const showModal = (record = null) => {
    console.log('record:', record)
    setEditingItem(record);
    form.setFieldsValue(record || { codigo: "", nombre: "", lente_contacto: "" });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        if (selectedTable === "Cristales") dispatch(updateCristales({ id: editingItem.id, ...values }));
        if (selectedTable === "Materiales") dispatch(updateMateriales({ id: editingItem.id, ...values }));
        if (selectedTable === "Tratamientos") dispatch(updateTratamientos({ id: editingItem.id, ...values }));
        if (selectedTable === "MarcasLenteContacto") dispatch(updateMarcas({ id: editingItem.id, ...values }));
        if (selectedTable === "MarcasLenteNormal") dispatch(updateMarcas({ id: editingItem.id, ...values }));
        if (selectedTable === "TiposAros") dispatch(updateTiposAros({ id: editingItem.id, ...values }))
        if (selectedTable === "ProveedorMaterial") dispatch(updateProveedorMaterial({ id: editingItem.id, ...values }))
        message.success("Actualizado correctamente!");
      } else {
        if (selectedTable === "Cristales") dispatch(createCristales(values));
        if (selectedTable === "Materiales") dispatch(createMateriales(values));
        if (selectedTable === "Tratamientos") dispatch(createTratamientos(values));
        if (selectedTable === "MarcasLenteContacto") {
          dispatch(createMarcas(values))
            .unwrap()
            .then(() => {
              message.success("Creado correctamente!");
              handleCancel();
            })
            .catch((error) => {
              if (error.errors?.codigo) {
                message.error("El código ya ha sido registrado.");
              } else if (error.errors?.nombre) {
                message.error("El nombre ya ha sido registrado.");
              } else {
                message.error("Error al crear la marca de lente de contacto.");
              }
            });
        }
        if (selectedTable === "MarcasLenteNormal") dispatch(createMarcas(values));
        if (selectedTable === "TiposAros") dispatch(createTiposAros(values));
        if (selectedTable === "ProveedorMaterial") {
          dispatch(createProveedorMaterial(values))
            .unwrap()
            .then(() => {
              message.success("Creado correctamente!");
              handleCancel();
            })
            .catch((error) => {
              if (error.errors?.nombre) {
                message.error("El nombre ya ha sido registrado.");
              } else {
                message.error("Error al crear el proveedor de material.");
              }
            });
        }
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Estás seguro?",
      content: "Esto no se puede deshacer",
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      onOk: () => {
        if (selectedTable === "Cristales") dispatch(deleteCristales(id));
        if (selectedTable === "Materiales") dispatch(deleteMateriales(id));
        if (selectedTable === "Tratamientos") dispatch(deleteTratamientos(id));
        if (selectedTable === "MarcasLenteContacto") dispatch(deleteMarcas(id));
        if (selectedTable === "MarcasLenteNormal") dispatch(deleteMarcas(id));
        if (selectedTable === "TiposAros") dispatch(deleteTiposAros(id));
        if (selectedTable === "ProveedorMaterial") dispatch(deleteProveedorMaterial(id));
        message.success("Eliminado correctamente!");
      }
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    ...(selectedTable === "Cristales"
      ? [{ title: "Código", dataIndex: "codigo", key: "codigo" }]
      : []),
    ...(selectedTable === "MarcasLenteContacto" || selectedTable === "MarcasLenteNormal"
      ? [
        { title: "Código", dataIndex: "codigo", key: "codigo" },
        {
          title: "Lente de Contacto",
          dataIndex: "lente_contacto",
          key: "lente_contacto",
          render: (value) => (value ? "Sí" : "No"),
        }
      ]
      : []),
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <>
          <Button
            className="btn btn-warning btnEditarReceta"
            size="large"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center"
            }}
          />

          <Button
            className="btn btn-danger btnEliminarReceta"
            size="large"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          />

        </>
      ),
    },
  ];

  const dataSource = {
    Cristales: cristales || [],
    Materiales: materiales || [],
    Tratamientos: tratamientos || [],
    MarcasLenteContacto: marcas_lente_contacto || [],
    MarcasLenteNormal: marcas_lente_normal || [],
    TiposAros: tiposAros || [],
    ProveedorMaterial: proveedorMaterial || []
  };


  return (
    <div style={{ padding: "20px" }}>
      <Segmented
        options={["Cristales", "Materiales", "Tratamientos", "MarcasLenteContacto", "MarcasLenteNormal", "TiposAros", "ProveedorMaterial"]}
        value={selectedTable}
        onChange={setSelectedTable}
        style={{ marginBottom: 20 }}
      />

      <Button
        className="btn btn-success"
        onClick={() => showModal()}
        style={{ marginBottom: 16, lineHeight: "1", padding: "8px 16px" }}
      >
        Crear {selectedTable}
      </Button>

      <Table
        columns={columns}
        dataSource={dataSource[selectedTable]}
        rowKey="id"
        className="dataTables_wrapper container-fluid dt-bootstrap4"
        id="zero-config_wrapper"
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />

      <Modal
        title={editingItem ? "Editar " + selectedTable : "Crear " + selectedTable}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          {selectedTable === "Cristales" && (
            <Form.Item
              name="codigo"
              label="Código"
              rules={[{ required: true, message: "Campo obligatorio" }]}
            >
              <Input />
            </Form.Item>
          )}

          {(selectedTable === "MarcasLenteContacto") && (
            <>
              <Form.Item
                name="codigo"
                label="Código"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lente_contacto"
                label="Lente de Contacto"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Select>
                  <Select.Option value={1}>Sí</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {(selectedTable === "MarcasLenteNormal") && (
            <>
              <Form.Item
                name="codigo"
                label="Código"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lente_contacto"
                label="Lente Normal"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Select>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CristalesMaterialesTratamientos;

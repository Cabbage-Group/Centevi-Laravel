import { Button, Form, Input, Modal, Segmented, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createServicios,
  deleteServicios,
  fetchServicios,
  updateServicios,
} from "../../redux/features/servicios/serviciosSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const VerServicios = () => {
  const dispatch = useDispatch();
  const { servicios, status_servicios } = useSelector((state) => state.servicios);
  const [selectedTable, setSelectedTable] = useState("Servicios");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [form] = Form.useForm();
  const dataSource = {
    Servicios: servicios || [],
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchServicios({ search: debouncedSearchText }));
  }, [debouncedSearchText, dispatch]);

  const showModal = (record = null) => {
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
    form.validateFields().then((values) => {
      if (editingItem) {
        if (selectedTable === "Servicios")
          dispatch(updateServicios({ id: editingItem.id, ...values }));
        console.log("Actualizando servicio:", { ...editingItem, ...values });
      } else {
        if (selectedTable === "Servicios") dispatch(createServicios(values));
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el servicio permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServicios(id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Servicio eliminado",
              text: "El servicio se ha eliminado correctamente",
              confirmButtonColor: "#3085d6",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el servicio",
            });
          });
      }
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Codigo",
      dataIndex: "codigo",
      key: "codigo",
    },
    {
      title: "Servicio",
      dataIndex: "servicio",
      key: "servicio",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <>
          <Button
            className="btn btn-warning btnEditarServicio"
            size="large"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
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
              justifyContent: "center",
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Segmented
            options={["Servicios"]}
            value={selectedTable}
            onChange={setSelectedTable}
            style={{ marginRight: 5 }}
          />
          <Input
            placeholder={`Buscar en ${selectedTable}`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ marginBottom: 16, width: 300 }}
          />
        </div>

        <Button
          className="btn btn-success"
          onClick={() => showModal()}
          style={{
            marginLeft: "auto",
            lineHeight: "1",
            padding: "8px 16px",
          }}
        >
          Crear {selectedTable}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource[selectedTable]}
        rowKey="id"
        className="dataTables_wrapper container-fluid dt-bootstrap4"
        id="zero-config_wrapper"
        loading={status_servicios}
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      ></Table>

      <Modal
        title={editingItem ? "Editar " + selectedTable : "Crear " + selectedTable}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="codigo"
            label="Código"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="servicio"
            label="Servicio"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VerServicios;

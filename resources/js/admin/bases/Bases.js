import { Button, Form, Input, Modal, Segmented, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  fetchBases,
  createBases,
  updateBases,
  deleteBases,
} from "../../redux/features/bases/basesSlice";

const Bases = () => {
  const dispatch = useDispatch();
  const { bases, loading } = useSelector((state) => state.bases);
  const [selectedTable, setSelectedTable] = useState("Bases");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [form] = Form.useForm();
  const dataSource = {
    Bases: bases || [],
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
    dispatch(fetchBases({ search: debouncedSearchText }));
  }, [debouncedSearchText, dispatch]);

  const showModal = (record = null) => {
    setEditingItem(record);
    form.setFieldsValue(record || { codigo: "", diagnostico: "" });
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
        if (selectedTable === "Bases")
          dispatch(updateBases({id: editingItem.id, values}));
      } else {
        if (selectedTable === "Bases") dispatch(createBases(values));
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la base permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBases(id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Base eliminada",
              text: "La base se ha eliminado correctamente",
              confirmButtonColor: "#3085d6",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar la base",
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
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <>
          <Button
            className="btn btn-warning btnEditarDiagnostico"
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
            options={["Bases"]}
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
        loading={loading}
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
            name="descripcion"
            label="Descripcion"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bases;

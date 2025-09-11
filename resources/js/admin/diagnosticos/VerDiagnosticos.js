import { Button, Form, Input, Modal, Segmented, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  createDiagnosticos,
  deleteDiagnosticos,
  fectchDiagnosticos,
  updateDiagnosticos,
} from "../../redux/features/diagnosticos/DiagnosticosSlice";

const VerDiagnosticos = () => {
  const dispatch = useDispatch();
  const { diagnosticos, status } = useSelector((state) => state.diagnosticos);
  const [selectedTable, setSelectedTable] = useState("Diagnosticos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [form] = Form.useForm();
  const dataSource = {
    Diagnosticos: diagnosticos || [],
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
    dispatch(fectchDiagnosticos({ search: debouncedSearchText }));
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
        if (selectedTable === "Diagnosticos")
          dispatch(updateDiagnosticos({ id: editingItem.id, ...values }));
        console.log("Actualizando diagnostico:", { ...editingItem, ...values });
      } else {
        if (selectedTable === "Diagnosticos") dispatch(createDiagnosticos(values));
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el diagnostico permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDiagnosticos(id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Diagnostico eliminado",
              text: "El diagnostico se ha eliminado correctamente",
              confirmButtonColor: "#3085d6",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el diagnostico",
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
      title: "Diagnostico",
      dataIndex: "diagnostico",
      key: "diagnostico",
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
            options={["Diagnosticos"]}
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
        loading={status === "loading"}
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
            name="diagnostico"
            label="Diagnostico"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VerDiagnosticos;

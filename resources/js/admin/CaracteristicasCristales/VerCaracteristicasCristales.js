import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Segmented, Table, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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

const CristalesMaterialesTratamientos = () => {
    const dispatch = useDispatch();
    const [selectedTable, setSelectedTable] = useState("Cristales");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState(null);

    const { cristales } = useSelector((state) => state.cristales);
    const { materiales } = useSelector((state) => state.materiales);
    const { tratamientos } = useSelector((state) => state.tratamientos);

    useEffect(() => {
        dispatch(fetchCristales());
        dispatch(fetchMateriales());
        dispatch(fetchTratamientos());
    }, [dispatch]);

    // Manejo del modal
    const showModal = (record = null) => {
        setEditingItem(record);
        form.setFieldsValue(record || { codigo: "", nombre: "" });
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
                console.log('editingItem:', editingItem)
                if (selectedTable === "Cristales") dispatch(updateCristales({ id: editingItem.id, ...values }));
                if (selectedTable === "Materiales") dispatch(updateMateriales({ id: editingItem.id, ...values }));
                if (selectedTable === "Tratamientos") dispatch(updateTratamientos({ id: editingItem.id, ...values }));
                message.success("Actualizado correctamente!");
            } else {
                if (selectedTable === "Cristales") dispatch(createCristales(values));
                if (selectedTable === "Materiales") dispatch(createMateriales(values));
                if (selectedTable === "Tratamientos") dispatch(createTratamientos(values));
                message.success("Creado correctamente!");
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
                message.success("Eliminado correctamente!");
            }
        });
    };

    // Configuración de columnas
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        ...(selectedTable === "Cristales"
            ? [{ title: "Código", dataIndex: "codigo", key: "codigo" }]
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
    };

    return (
        <div style={{ padding: "20px" }}>
            <Segmented
                options={["Cristales", "Materiales", "Tratamientos"]}
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

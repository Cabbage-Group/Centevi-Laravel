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
  updateMateriales,
} from "../../redux/features/materiales/materialesSlice";
import {
  createTratamientos,
  deleteTratamientos,
  fetchTratamientos,
  updateTratamientos,
} from "../../redux/features/tratamientos/tratamientosSlice";
import {
  createMarcas,
  deleteMarcas,
  fetchMarcas,
  updateMarcas,
} from "../../redux/features/marcas/marcasSlice";
import {
  createTiposAros,
  deleteTiposAros,
  fetchTiposAros,
  updateTiposAros,
} from "../../redux/features/tipos-aros/tiposArosSlice";
import {
  createProveedorMaterial,
  deleteProveedorMaterial,
  fetchProveedorMaterial,
  updateProveedorMaterial,
} from "../../redux/features/proveedor-material/proveedorMaterialSlice";
import { createMarcasOnefitMed, deleteMarcasOnefitMed, fetchMarcasOnefitMed, updateMarcasOnefitMed } from "../../redux/features/marcas-onefit-med/marcasOnefitMedSlice";
import { createMarcasOnefit, deleteMarcasOnefit, fetchMarcasOnefit, updateMarcasOnefit } from "../../redux/features/marcas-onefit/marcasOnefitSlice";

const CristalesMaterialesTratamientos = () => {
  const dispatch = useDispatch();
  const [selectedTable, setSelectedTable] = useState("Cristales");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterLenteContacto, setFilterLenteContacto] = useState(0);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [isLenteContacto, setIsLenteContacto] = useState(false);

  const { cristales, status_cristales } = useSelector((state) => state.cristales);
  const { materiales, status_materiales } = useSelector((state) => state.materiales);
  const { tratamientos, status_tratamientos } = useSelector((state) => state.tratamientos);
  const { tiposAros, status_tiposAros } = useSelector((state) => state.tiposAros);
  const { marcas_lente_contacto, marcas_lente_normal, status_marcas } = useSelector(
    (state) => state.marcas
  );
  const {
    marcas: marcasOnefit,
    status_marcas: statusMarcasOnefit,
  } = useSelector((state) => state.marcasOnefit);

  const {
    marcas: marcasOnefitMed,
    status_marcas: statusMarcasOnefitMed,
  } = useSelector((state) => state.marcasOnefitMed);

  const [tipoMarca, setTipoMarca] = useState("normal");

  const { proveedorMaterial, status_proveedorMaterial } = useSelector(
    (state) => state.proveedorMaterial
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    setSearchText("");
  }, [selectedTable]);

  useEffect(() => {
    switch (selectedTable) {
      case "Cristales":
        dispatch(fetchCristales({ search: debouncedSearchText }));
        break;

      case "Materiales":
        dispatch(fetchMateriales({ search: debouncedSearchText }));
        break;

      case "Tratamientos":
        dispatch(fetchTratamientos({ search: debouncedSearchText }));
        break;

      case "Marcas":
        if (tipoMarca === "normal") {
          dispatch(fetchMarcas({ search: debouncedSearchText }));
        } else if (tipoMarca === "contacto") {
          dispatch(fetchMarcas({ search: debouncedSearchText }));
        } else if (tipoMarca === "onefit") {
          dispatch(fetchMarcasOnefit({ search: debouncedSearchText }));
        } else if (tipoMarca === "onefitmed") {
          dispatch(fetchMarcasOnefitMed({ search: debouncedSearchText }));
        }
        break;

      case "TiposAros":
        dispatch(fetchTiposAros({ search: debouncedSearchText }));
        break;

      case "ProveedorMaterial":
        dispatch(fetchProveedorMaterial({ search: debouncedSearchText }));
        break;

      default:
        break;
    }
  }, [
    debouncedSearchText,
    selectedTable,
    tipoMarca,
    dispatch,
  ]);

  // Manejo del modal
  const showModal = (record = null) => {
    console.log("record:", record);
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
        if (selectedTable === "Cristales")
          dispatch(updateCristales({ id: editingItem.id, ...values }));

        if (selectedTable === "Materiales")
          dispatch(updateMateriales({ id: editingItem.id, ...values }));

        if (selectedTable === "Tratamientos")
          dispatch(updateTratamientos({ id: editingItem.id, ...values }));

        if (selectedTable === "Marcas") {
          if (tipoMarca === "normal" || tipoMarca === "contacto") {
            dispatch(updateMarcas({ id: editingItem.id, ...values }));
          }

          if (tipoMarca === "onefit") {
            dispatch(updateMarcasOnefit({
              id: editingItem.id,
              ...values,
            }));
          }

          if (tipoMarca === "onefitmed") {
            dispatch(updateMarcasOnefitMed({
              id: editingItem.id,
              ...values,
            }));
          }
        }

        if (selectedTable === "TiposAros")
          dispatch(updateTiposAros({ id: editingItem.id, ...values }));

        if (selectedTable === "ProveedorMaterial")
          dispatch(updateProveedorMaterial({
            id: editingItem.id,
            ...values,
          }));

        message.success("Actualizado correctamente!");
      } else {
        if (selectedTable === "Cristales") {
          dispatch(createCristales(values));
        }

        if (selectedTable === "Materiales") {
          dispatch(createMateriales(values));
        }

        if (selectedTable === "Tratamientos") {
          dispatch(createTratamientos(values));
        }

        if (selectedTable === "Marcas") {
          if (tipoMarca === "normal" || tipoMarca === "contacto") {
            dispatch(createMarcas(values));
          }

          if (tipoMarca === "onefit") {
            dispatch(createMarcasOnefit(values));
          }

          if (tipoMarca === "onefitmed") {
            dispatch(createMarcasOnefitMed(values));
          }
        }

        if (selectedTable === "TiposAros") {
          dispatch(createTiposAros(values));
        }

        if (selectedTable === "ProveedorMaterial") {
          dispatch(createProveedorMaterial(values));
        }

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
        if (selectedTable === "Cristales") {
          dispatch(deleteCristales(id));
        }

        if (selectedTable === "Materiales") {
          dispatch(deleteMateriales(id));
        }

        if (selectedTable === "Tratamientos") {
          dispatch(deleteTratamientos(id));
        }

        if (selectedTable === "Marcas") {
          if (tipoMarca === "normal" || tipoMarca === "contacto") {
            dispatch(deleteMarcas(id));
          }

          if (tipoMarca === "onefit") {
            dispatch(deleteMarcasOnefit(id));
          }

          if (tipoMarca === "onefitmed") {
            dispatch(deleteMarcasOnefitMed(id));
          }
        }

        if (selectedTable === "TiposAros") {
          dispatch(deleteTiposAros(id));
        }

        if (selectedTable === "ProveedorMaterial") {
          dispatch(deleteProveedorMaterial(id));
        }

        message.success("Eliminado correctamente!");
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    ...(selectedTable === "Cristales"
      ? [{ title: "Código", dataIndex: "codigo", key: "codigo" }]
      : []),
    ...(selectedTable === "Cristales" || selectedTable === "Marcas"
      ? [
        {
          title: "Código",
          dataIndex: "codigo",
          key: "codigo",
        },
      ]
      : []),
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Button
            size="large"
            onClick={() => showModal(record)}
            icon={
              <EditOutlined
                style={{
                  color: "#fff",
                  fontSize: 18,
                }}
              />
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e2a03f",
              borderColor: "#ffc107",
              color: "#fff",
            }}
          />
          <Button
            size="large"
            onClick={() => handleDelete(record.id)}
            icon={
              <DeleteOutlined
                style={{
                  color: "#fff",
                  fontSize: 18,
                }}
              />
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              color: "#fff",
            }}
          />
        </div>
      ),
    },
  ];

  const dataSource = {
    Cristales: cristales || [],
    Materiales: materiales || [],
    Tratamientos: tratamientos || [],

    Marcas:
      tipoMarca === "normal"
        ? marcas_lente_normal || []
        : tipoMarca === "contacto"
          ? marcas_lente_contacto || []
          : tipoMarca === "onefit"
            ? marcasOnefit || []
            : marcasOnefitMed || [],

    TiposAros: tiposAros || [],
    ProveedorMaterial: proveedorMaterial || [],
  };


  let tableLoading = false;

  if (selectedTable === "Cristales") {
    tableLoading = status_cristales;
  } else if (selectedTable === "Materiales") {
    tableLoading = status_materiales;
  } else if (selectedTable === "Tratamientos") {
    tableLoading = status_tratamientos;
  } else if (selectedTable === "Marcas") {
    if (tipoMarca === "normal" || tipoMarca === "contacto") {
      tableLoading = status_marcas;
    } else if (tipoMarca === "onefit") {
      tableLoading = statusMarcasOnefit;
    } else if (tipoMarca === "onefitmed") {
      tableLoading = statusMarcasOnefitMed;
    }
  } else if (selectedTable === "TiposAros") {
    tableLoading = status_tiposAros;
  } else if (selectedTable === "ProveedorMaterial") {
    tableLoading = status_proveedorMaterial;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Segmented
          options={[
            "Cristales",
            "Materiales",
            "Tratamientos",
            "Marcas",
            "TiposAros",
            "ProveedorMaterial",
          ]}
          value={selectedTable}
          onChange={(value) => {
            setSelectedTable(value);

            if (value === "Marcas") {
              setTipoMarca("normal");
            }
          }}
        />
        {selectedTable === "Marcas" && (
          <Select
            value={tipoMarca}
            onChange={setTipoMarca}
            style={{ width: 220 }}
            options={[
              {
                value: "normal",
                label: "Marcas de Lente Normal",
              },
              {
                value: "contacto",
                label: "Marcas de Lente de Contacto",
              },
              {
                value: "onefit",
                label: "Marcas OneFit",
              },
              {
                value: "onefitmed",
                label: "Marcas OneFit Med",
              },
            ]}
          />
        )}
        <Input
          placeholder={`Buscar en ${selectedTable}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ marginBottom: 16, width: 300 }}
        />

        <Button
          className="btn btn-success"
          onClick={() => showModal()}
          style={{ lineHeight: "1", padding: "8px 16px" }}
        >
          Crear {selectedTable}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource[selectedTable]}
        loading={tableLoading}
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

          {selectedTable === "Marcas" && (
            <Form.Item
              name="codigo"
              label="Código"
              rules={[
                {
                  required: true,
                  message: "Campo obligatorio",
                },
              ]}
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

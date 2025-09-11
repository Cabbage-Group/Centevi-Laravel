import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, Table, Typography, Progress, message } from "antd";
import {
  fetchWareHouses,
  setPage,
  syncWarehouses,
  updateSendDiscount,
  updateSucursalWareHouse,
} from "../../../redux/features/warehouses/warehousesSlice";
import { useDispatch, useSelector } from "react-redux";
import "../../../../css/tables/TableCotizaciones.css";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";

const { Option } = Select;
const { Text } = Typography;

const TableWareHouses = () => {
  const dispatch = useDispatch();
  const { warehouses, meta, limit, page, status_warehouses } = useSelector(
    (state) => state.warehousesSlice
  );
  const { sucursales_option_selects, status_updateSucursal } = useSelector(
    (state) => state.sucursales
  );
  const [progress, setProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState();
  useEffect(() => {
    dispatch(fetchWareHouses({ page, limit }));
  }, [page, limit, dispatch]);

  useEffect(() => {
    dispatch(fetchSucursales({}));
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    // const newSortColumn = sorter.field;
    // const newSortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null;

    if (newPage !== page) dispatch(setPage(newPage));
    // dispatch(setSort({ sortColumn: newSortColumn, sortOrder: newSortOrder }));
  };
  const handleSyncWarehouses = async () => {
    setSyncing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev));
    }, 300);

    try {
      await dispatch(syncWarehouses()).unwrap();
      clearInterval(interval);
      setProgress(100);
      message.success("Bodegas actualizadas correctamente");

      dispatch(fetchWareHouses({ page, limit }));
    } catch (error) {
      clearInterval(interval);
      setProgress(100);
      message.error("Error al sincronizar bodegas");
    } finally {
      setTimeout(() => {
        setSyncing(false);
        setProgress(0);
      }, 800);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Tienda",
      dataIndex: "tienda",
      key: "tienda",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Venta Pos",
      dataIndex: "venta_pos",
      key: "venta_pos",
      render: (value) => {
        return (
          <Text ellipsis title={`${value}`}>
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },

    {
      title: "Acción",
      key: "accion",
      render: (_, record) => {
        const hasDiscount = record.send_discount;
        return (
          <Button
            className="discount-btn"
            onClick={() => {
              dispatch(updateSendDiscount({ id: record.id, send_discount: !hasDiscount }))
                .unwrap()
                .catch((error) => {
                  message.error(
                    `Error al ${!hasDiscount ? "activar" : "desactivar"} descuento: ${
                      error.message
                    }`
                  );
                });
            }}
            style={{
              backgroundColor: hasDiscount ? "#4CAF50" : "#F44336",
              border: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "11px",
              height: "26px",
              padding: "0 6px",
            }}
          >
            {hasDiscount ? "Con Descuento" : "Sin Descuento"}
          </Button>
        );
      },
    },
    {
      title: "Sucursal",
      key: "sucursal_id",
      render: (_, record) => {
        const value = record.sucursal_id ?? null;
        const handleChange = async (val) => {
          try {
            await dispatch(updateSucursalWareHouse({ id: record.id, sucursal_id: val })).unwrap();
            message.success("Sucursal actualizada correctamente");
          } catch (error) {
            message.error(`Error al actualizar sucursal: ${error.message}`);
            dispatch(fetchWareHouses({ page, limit }));
          }
        };

        return (
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <Select
              style={{ width: 300 }}
              placeholder="Seleccionar sucursal"
              value={value || undefined}
              onChange={handleChange}
              options={sucursales_option_selects}
              loading={status_updateSucursal === "loading"}
              disabled={status_updateSucursal === "loading"}
              allowClear
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20, marginLeft: 10 }}>
          <Button type="primary" onClick={handleSyncWarehouses} disabled={syncing}>
            {syncing ? "Sincronizando..." : "Sincronizar bodegas"}
          </Button>

          {syncing && (
            <div style={{ marginLeft: 12, width: 150 }}>
              <Progress percent={progress} status="active" />
            </div>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={warehouses}
        rowKey="id"
        onChange={handleTableChange}
        className="compact-table"
        id="zero-config_wrapper"
        pagination={{
          current: meta?.page || 1,
          total: meta?.total || 0,
          pageSize: limit,
          showSizeChanger: false,
        }}
        loading={status_warehouses}
      ></Table>
    </div>
  );
};

export default TableWareHouses;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserMd, FaClinicMedical, FaFileExcel } from "react-icons/fa";
import { Table, DatePicker, Button } from "antd";
import moment from "moment";
import {
  fetchReporteDiagnosticos,
  setFechaRange,
  setPage,
} from "../../../redux/features/reportes/Diagnosticos/diagnosticosSlice";
import "./Diagnosticos.css";

const { RangePicker } = DatePicker;

export default function Diagnosticos() {
  const dispatch = useDispatch();
  const { data, status, startDate, endDate, page, meta } = useSelector(
    (state) => state.reporteDiagnosticos
  );

  const [dateRange, setDateRange] = useState([
    startDate ? moment(startDate) : null,
    endDate ? moment(endDate) : null,
  ]);

  // Cargar datos cuando cambian fecha o página
  useEffect(() => {
    dispatch(
      fetchReporteDiagnosticos({
        startDate: dateRange[0]?.format("YYYY-MM-DD") || "",
        endDate: dateRange[1]?.format("YYYY-MM-DD") || "",
        page,
      })
    );
  }, [dispatch, dateRange, page]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleFilter = () => {
    dispatch(
      setFechaRange({
        startDate: dateRange[0]?.format("YYYY-MM-DD") || "",
        endDate: dateRange[1]?.format("YYYY-MM-DD") || "",
      })
    );
    dispatch(setPage(1));
  };

  const handlePageChange = (current) => {
    dispatch(setPage(current));
  };

  const exportToExcel = () => {
    const host = window.location.origin; // Dominio dinámico según host
    const desde = dateRange[0]?.format("YYYY-MM-DD") || "";
    const hasta = dateRange[1]?.format("YYYY-MM-DD") || "";
    const url = `${host}/api/reportes/reporte-diagnosticos/exportar?desde=${desde}&hasta=${hasta}`;

    window.open(url, "_blank"); // Abrir la descarga en nueva pestaña
  };

  const columns = [
    {
      title: "Item",
      render: (_, __, index) => (meta.current_page - 1) * meta.per_page + index + 1,
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (text) => (
        <span>
          <FaUserMd className="icon-small" /> {text}
        </span>
      ),
    },
    {
      title: "Sucursal",
      dataIndex: "sucursal_nombre",
    },
    {
      title: "Paciente",
      dataIndex: "paciente_nombre",
    },
    {
      title: "Consultas",
      dataIndex: "consulta",
    },
    {
      title: "Diagnosticos",
      dataIndex: "diagnosticos",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
    },
  ];

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-icon">
          <FaClinicMedical />
        </div>
        <h2 className="report-title">Reporte de Diagnósticos</h2>

        <div className="fecha-filtro">
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              border: "1px solid #d9d9d9",
              marginRight: "10px",
              padding: "6px 10px",
              width: "280px",
            }}
          />
          <Button type="primary" onClick={handleFilter} style={{ marginRight: "10px" }}>
            Filtrar
          </Button>
          <Button
            type="default"
            onClick={exportToExcel}
            style={{ backgroundColor: "#1E90FF", color: "white", border: "none" }}
          >
            <FaFileExcel style={{ marginRight: "6px" }} /> Descargar Excel
          </Button>
        </div>
      </div>

      <div className="report-body">
        <Table
          columns={columns}
          dataSource={data}
          loading={status === "loading"}
          rowKey={(record, index) => (meta.current_page - 1) * meta.per_page + index + 1}
          pagination={{
            current: page,
            pageSize: meta.per_page || 10,
            total: meta.total || 0,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showLessItems: true,
            pageSizeOptions: [],
          }}
          bordered
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
}

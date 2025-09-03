import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaginationAtendidosPorDia from "./PaginationAtendidosPorDia";
import {
  fetchAtendidosPorDia,
  setOrden,
  setOrdenPor,
  setFechaRange,
} from "../../redux/features/reportes/atendidosPorDiaSilce";
import DateRangePicker from "./DateRangePicker";
import { fetchPacientes } from "../../redux/features/pacientes/pacientesSlice";
import ExportButton from "./exportButton";
import { transformDataForAtendidosPorDia } from "../../../utils/dataTransform";

const ReportePaciente = () => {
  const dispatch = useDispatch();
  const metaPacientes = useSelector((state) => state.pacientes.meta);
  const {
    atendidosPorDia,
    status,
    startDate,
    endDate,
    error,
    meta,
    totalPages,
    orden,
    ordenPor,
    search,
    dataexport,
  } = useSelector((state) => state.atendidosPorDia);

  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(search);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localStartDate, setLocalStartDate] = useState(startDate);

  useEffect(() => {
    dispatch(fetchPacientes({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAtendidosPorDia({
        page: currentPage,
        limit: 20,
        orden,
        ordenPor,
        startDate,
        endDate,
        search: localSearch,
      })
    );
  }, [dispatch, localSearch, currentPage, startDate, endDate, orden, ordenPor]);

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = () => {
    dispatch(setFechaRange({ startDate: localStartDate, endDate: localEndDate }));
    dispatch(
      fetchAtendidosPorDia({
        page: currentPage,
        startDate: localStartDate,
        endDate: localEndDate,
        limit: 20,
        orden,
        ordenPor,
      })
    );
  };

  const handleSort = (newOrdenPor) => {
    const newOrder = orden === "asc" ? "desc" : "asc";
    dispatch(setOrden(newOrder));
    dispatch(setOrdenPor(newOrdenPor));
    dispatch(
      fetchAtendidosPorDia({
        page: currentPage,
        startDate,
        endDate,
        limit: 20,
        orden: newOrder,
        ordenPor: newOrdenPor,
      })
    );
  };

  const handleClearSearch = () => {
    setLocalSearch("");
  };

  return (
    <div className="row layout-top-spacing">
      <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
        <div className="widget-content-area br-4">
          <div className="widget-one">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div className="widget widget-one">
                  <div className="widget-heading">
                    <h6 className="">Reporte de pacientes atendidos por dia</h6>
                  </div>
                  <div className="w-chart"></div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div
                className="form-group col-md-4 mt-4 "
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{ marginRight: "10px", marginTop: "px" }}>
                  <label>Buscar por Fecha:</label>
                  <DateRangePicker
                    startDate={localStartDate}
                    endDate={localEndDate}
                    onChange={(start, end) => {
                      setLocalStartDate(start);
                      setLocalEndDate(end);
                    }}
                    onApply={handleDateChange}
                  />
                </div>
                <div
                  className="col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center"
                  style={{ marginTop: "50px" }}
                >
                  <ExportButton
                    dataexport={dataexport}
                    transformData={transformDataForAtendidosPorDia}
                    fileName="Reporte_Paciente.xlsx"
                  />
                </div>
                <div className="col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3">
                  <div className="dataTables_filter" id="html5-extension_filter">
                    <label>
                      <input
                        style={{ marginTop: "50px" }}
                        aria-controls="html5-extension"
                        className="form-control"
                        placeholder="Search..."
                        type="search"
                        value={localSearch}
                        onChange={handleSearchChange}
                      />
                      {localSearch && (
                        <button
                          onClick={handleClearSearch}
                          style={{
                            position: "absolute",
                            right: "25px",
                            top: "70%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          &#x2715; {}
                        </button>
                      )}
                      {!localSearch && (
                        <img
                          src="/assets/img/lupa.png"
                          alt="Search"
                          style={{
                            position: "absolute",
                            right: "25px",
                            top: "70%",
                            transform: "translateY(-50%)",
                            width: "20px",
                            height: "20px",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <div
                  className="dataTables_wrapper container-fluid dt-bootstrap4 no-footer"
                  id="html5-extension_wrapper"
                >
                  <div className="table-responsive">
                    {status === "loading" && <p>Loading...</p>}
                    {status === "failed" && <p>Error: {error}</p>}
                    {status === "succeeded" && (
                      <table
                        aria-describedby="zero-config_info"
                        className="table dt-table-hover tablas dataTable"
                        id="zero-config"
                        role="grid"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              aria-controls="zero-config"
                              aria-label={`Nombre: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("PACIENTE_NOMBRE")}
                            >
                              Nombre del Paciente
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Cedula: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("PACIENTE_CEDULA")}
                            >
                              Cedula
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Sucursal: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("SUCURSAL")}
                            >
                              Sucursal
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Celular: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("PACIENTE_CELULAR")}
                            >
                              Celular
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Tipo: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("TIPO")}
                            >
                              Tipo de Consulta
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Fecha atencion: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("FECHA_ATENCION")}
                            >
                              Fecha de atencion
                            </th>
                            <th
                              aria-controls="zero-config"
                              aria-label={`Doctor: activate to sort column ${
                                orden === "desc" ? "descending" : "ascending"
                              }`}
                              className={`sorting ${orden}`}
                              colSpan="1"
                              rowSpan="1"
                              style={{ width: "153.82px" }}
                              tabIndex="0"
                              onClick={() => handleSort("DOCTOR")}
                            >
                              Doctor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {atendidosPorDia.map((atendidoPorDia) => (
                            <tr key={atendidoPorDia.ID_PACIENTE}>
                              <td>{atendidoPorDia.PACIENTE_NOMBRE.trim()}</td>
                              <td>{atendidoPorDia.PACIENTE_CEDULA}</td>
                              <td>{atendidoPorDia.SUCURSAL}</td>
                              <td>{atendidoPorDia.PACIENTE_CELULAR}</td>
                              <td>{atendidoPorDia.TIPO}</td>
                              <td>{atendidoPorDia.FECHA_ATENCION}</td>
                              <td>{atendidoPorDia.DOCTOR}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <PaginationAtendidosPorDia
                      meta={meta}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportePaciente;

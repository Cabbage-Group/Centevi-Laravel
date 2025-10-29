import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPacientes,
  eliminarPaciente,
  fetchInterfuerza,
} from "../../redux/features/pacientes/pacientesSlice.js";
import { Link } from "react-router-dom";
import PaginationPacientes from "./PaginationPacientes.js";
import Swal from "sweetalert2";
import moment from "moment";
import { funPermisosObtenidos } from "../../utils/ValidarPermisos.js";
import { FaFileExcel } from "react-icons/fa";

const ListaPaciente = () => {
  const dispatch = useDispatch();
  const { meta, pacientes, status, error, totalPages } = useSelector((state) => state.pacientes);
  const { permisos } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const usuario = localStorage.getItem("usuario");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchPacientes({ page: currentPage, limit: 20, search: debouncedSearchText }));
  }, [currentPage, debouncedSearchText, dispatch]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEliminarPaciente = (id_paciente) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(eliminarPaciente(id_paciente))
          .then(() => Swal.fire("Eliminado", "El paciente ha sido eliminado.", "success"))
          .catch(() => Swal.fire("Error", "Hubo un problema al eliminar el paciente.", "error"));
      }
    });
  };

  const handleVerificarInterfuerza = (ruc) => {
    Swal.fire({
      title: "¿Deseas verificar este paciente en el sistema externo?",
      text: `RUC: ${ruc}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, verificar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Verificando...",
          text: "Por favor espera",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        try {
          const resultAction = await dispatch(fetchInterfuerza({ ruc, usuario }));
          Swal.close();
          if (resultAction.type === "pacientes/fetchInterfuerza/rejected") {
            Swal.fire("Error", resultAction.payload.message, "error");
          } else {
            Swal.fire("Verificación exitosa", resultAction.payload.message, "success");
          }
          dispatch(fetchPacientes({ page: currentPage, limit: 10, search: debouncedSearchText }));
        } catch (error) {
          Swal.close();
          Swal.fire(
            "Error",
            error.response?.data?.message || "Hubo un problema al verificar",
            "error"
          );
        }
      }
    });
  };

  const handleDescargarExcel = async () => {
    Swal.fire({
      title: "Descargando...",
      text: "Generando archivo Excel, por favor espera.",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch("/api/exportar-pacientes", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al generar el archivo");
      }

      // Convertir respuesta a Blob (archivo)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear enlace temporal para descarga
      const a = document.createElement("a");
      a.href = url;
      a.download =
        "Pacientes_" + new Date().toISOString().slice(0, 19).replace(/:/g, "-") + ".xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      Swal.fire({
        title: "Éxito",
        text: "El archivo Excel se ha descargado correctamente.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el archivo Excel.",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>Lista de Pacientes</h4>
          <div style={styles.searchSection}>
            <input
              style={styles.searchInput}
              type="search"
              placeholder="Buscar por cédula o nombre..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {/* <button style={styles.excelButton} onClick={handleDescargarExcel}>
              <FaFileExcel size={16} style={{ marginRight: 6 }} />
              Descargar Excel
            </button> */}
          </div>
        </div>

        <div style={styles.tableContainer}>
          {status === "loading" && <p>Cargando...</p>}
          {status === "failed" && <p>Error: {error}</p>}
          {status === "succeeded" && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombres</th>
                  <th style={styles.th}>Cédula</th>
                  <th style={styles.th}>Dirección</th>
                  <th style={styles.th}>Fecha</th>
                  {/* <th style={styles.th}>N° Bl Baja Vision</th>
                  <th style={styles.th}>N° Bl Ortop. Adultos</th>
                  <th style={styles.th}>N° Bl Ortop. Neonatos</th>
                  <th style={styles.th}>N° Bl Total</th> */}
                  <th style={styles.th}>Interfuerza</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.id_paciente} style={styles.tr}>
                    <td style={styles.td}>{`${p.nombres} ${p.apellidos}`}</td>
                    <td style={styles.td}>{p.nro_cedula}</td>
                    <td style={styles.td}>{p.direccion}</td>
                    <td style={styles.td}>{moment(p?.fecha_creacion).format("YYYY-MM-DD")}</td>
                    {/* <td style={styles.td}>{p.N_Bloques_Baja_Vision}</td>
                    <td style={styles.td}>{p.N_Bloques_Ortoptica_Adultos}</td>
                    <td style={styles.td}>{p.N_Bloques_Ortoptica_Neonatos}</td>
                    <td style={styles.td}>{p.N_Bloques_Total}</td> */}
                    <td
                      style={{
                        ...styles.td,
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => handleVerificarInterfuerza(p.nro_cedula)}
                    >
                      {p.interfuerza === null ? "Sin verificar" : p.interfuerza ? "Sí" : "No"}
                    </td>
                    <td style={styles.actions}>
                      <Link to={`/historia-paciente/${p.id_paciente}`}>
                        <button style={styles.iconBtn}>📖</button>
                      </Link>
                      <Link to={`/editar-paciente/${p.id_paciente}`}>
                        <button style={styles.iconBtn}>✏️</button>
                      </Link>
                      {funPermisosObtenidos(
                        permisos,
                        "pacientes.eliminarpaciente",
                        <button
                          style={{ ...styles.iconBtn, background: "#e74c3c" }}
                          onClick={() => handleEliminarPaciente(p.id_paciente)}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <PaginationPacientes
          meta={meta}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListaPaciente;

const styles = {
  container: {
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    padding: "20px 30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    backgroundColor: "#eff5ff",
    borderRadius: "8px",
    padding: "12px 16px",
  },
  title: {
    margin: 0,
    color: "#1f2937",
    fontWeight: "600",
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  searchInput: {
    padding: "6px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "250px",
    outline: "none",
  },
  excelButton: {
    background: "#2ecc71",
    border: "none",
    color: "white",
    fontSize: "13px",
    borderRadius: "6px",
    padding: "7px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    color: "#000",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    backgroundColor: "#eff5ff",
    color: "#000",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  tr: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    transition: "background 0.2s ease",
  },
  td: {
    padding: "6px 10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "160px",
  },
  actions: {
    display: "flex",
    gap: "5px",
  },
  iconBtn: {
    border: "none",
    background: "#3498db",
    color: "#fff",
    padding: "4px 6px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

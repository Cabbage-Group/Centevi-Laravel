import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEditarConsultaGenerica } from '../../redux/features/consultas/EditarConsultaGenericaSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerConsultaGenerica } from '../../redux/features/pacientes/VerConsultaGenericaSlice.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Select, Button } from 'antd';
import Swal from 'sweetalert2';
import moment from 'moment';
import { formatDate } from '../../utils/DateUtils.js';
import { funPermisosObtenidosBoolean } from '../../utils/ValidarPermisos.js';

const formatToDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const EditarConsultaGenerica = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, id_consulta } = useParams();
  const { permisos } = useSelector((state) => state.auth);
  const { pacientes, pacientes_options_selecteds } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { data: consultagenerica } = useSelector((state) => state.verConsultaGenerica)
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [doctorActual, setDoctorActual] = useState('');

  const [formData, setFormData] = useState({
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    paciente: '',
    id_terapia: '',
    edad: '',
    fecha_atencion: '',
    m_c: '',
    fecha_creacion: '',
    editado: {
      doctor: localStorage.getItem('nombre'),
      fecha_edicion: ''
    },
    fecha_proxima_consulta: ''
  });

  useEffect(() => {
    if (consultagenerica) {
      setFormData({
        sucursal: consultagenerica.sucursal || '',
        doctor: consultagenerica.doctor || '',
        paciente: consultagenerica.paciente || '',
        id_terapia: consultagenerica.id_terapia || '',
        edad: consultagenerica.edad || '',
        fecha_atencion: consultagenerica.fecha_atencion || '',
        m_c: consultagenerica.m_c || '',
        fecha_creacion: consultagenerica.fecha_creacion || '',
        editado: consultagenerica.editado ? JSON.parse(consultagenerica.editado) : {},
        fecha_proxima_consulta: moment.utc(consultagenerica.fecha_proxima_consulta).format('YYYY-MM-DD') || '',
      });
    }
  }, [consultagenerica]);

  useEffect(() => {
    const nombreUsuarioActual = localStorage.getItem('nombre');
    setDoctorActual(nombreUsuarioActual);
    if (id && id_consulta) {
      dispatch(fetchVerConsultaGenerica({ id, id_consulta }));
      dispatch(fetchSucursales({ page: 1, limit: 100 }));
      dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    }
  }, [dispatch, id, id_consulta]);

  useEffect(() => {
    if (pacientes && pacientes.length > 0 && formData.paciente !== '' && consultagenerica) {
      console.log('Ejecutando ------------');
      const paciente = pacientes.find(p => p.id_paciente == formData.paciente);

      if (paciente && paciente.fecha_nacimiento) {
        const edad = calculateAge(paciente.fecha_nacimiento);
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            edad: edad
          };
        });
      }
    }
  }, [pacientes, consultagenerica])

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;

    setFormData((prevFormData) => {
      switch (dataset.group) {
        case 'editado':
          return {
            ...prevFormData,
            editado: {
              ...prevFormData.editado,
              [name]: value,
            },
          };
        case 'fecha_proxima_consulta':
          return {
            ...prevFormData,
            fecha_proxima_consulta: {
              ...prevFormData.fecha_proxima_consulta,
              [name]: formatDate(value),
            },
          };

        default:
          return {
            ...prevFormData,
            [name]: value,
          };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Confirmarás los cambios en los datos!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'white',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Despachar la acción
        dispatch(fetchEditarConsultaGenerica({ id, id_consulta, data: formData }));

        // Mostrar alerta de éxito
        await Swal.fire(
          'Guardado!',
          'Los datos han sido actualizados.',
          'success'
        );

        // Redirigir a la página anterior
        navigate(-1);
      }
    } catch (erro) {
      Swal.fire(
        'Error',
        'Ocurrió un error al actualizar los datos. Por favor, inténtalo de nuevo.',
        'error'
      );
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();

    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const handlePacienteChange = (e, setFieldValue) => {
    console.log(e);
    // const { value } = e.target;
    const value = e;
    setSelectedPaciente(value);
    setFieldValue('paciente', value);
    const paciente = pacientes.find(p => p.id_paciente == value);

    if (paciente && paciente.fecha_nacimiento) {
      const edad = calculateAge(paciente.fecha_nacimiento);
      setFieldValue('edad', edad);
    }
  };

  return (
    <div
      className="admin-data-content"
      data-select2-id="12"
      style={{
        marginTop: '50px'
      }}
    >
      <div
        className="row layout-top-spacing"
        data-select2-id="11"
      >
        <div
          className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing"
          data-select2-id="10"
        >
          <div
            className="widget-content-area br-4"
            data-select2-id="9"
          >
            <form
              method="put"
              role="form"
              onSubmit={handleSubmit}
            >
              <div
                className="widget-one"
                data-select2-id="8"
              >
                <div
                  className="row"
                  data-select2-id="7"
                >
                  <div
                    className="col-lg-12 layout-spacing"
                    data-select2-id="flFormsGrid"
                    id="flFormsGrid"
                  >
                    <div
                      className="statbox widget box box-shadow"
                      data-select2-id="6"
                    >
                      <div className="widget-header">
                        <div className="row">
                          <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                            <h4>
                              {' '}Editar Historia Clínica
                            </h4>
                          </div>
                        </div>
                      </div>
                      <nav aria-label="breadcrumb" className="breadcrumb-one">
                        <ol className="breadcrumb" style={{ background: '#0096881c' }}>
                          <li className="breadcrumb-item">
                            <a href="javascript:void(0);">Doctor actual:</a>
                          </li>
                          <li aria-current="page" className="breadcrumb-item active">
                            <b>{  }</b>
                            {doctorActual === consultagenerica.doctor ? " (mismo doctor)" : " (doctor diferente)"}
                          </li>
                        </ol>
                      </nav>
                      <nav
                        aria-label="breadcrumb"
                        className="breadcrumb-one"
                      >
                        <ol
                          className="breadcrumb"
                          style={{
                            background: '#0096881c'
                          }}
                        >
                          <li className="breadcrumb-item">
                            <a href="javascript:void(0);">
                              Doctor:
                            </a>
                          </li>
                          <li
                            aria-current="page"
                            className="breadcrumb-item active"
                          >
                            <b>
                              {consultagenerica.doctor}
                            </b>
                          </li>
                        </ol>
                      </nav>
                    
                      <div className="widget-content widget-content-area">
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="paciente">
                              Paciente:
                            </label>
                            <Select
                              showSearch
                              placeholder="Seleccione el paciente"
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              options={pacientes_options_selecteds}
                              style={{
                                width: "100%",
                                height: "52px",
                                color: "black",
                                fontWeight: "bold",
                              }}
                              onChange={(e) => {
                                handlePacienteChange(e, setFieldValue)
                              }}
                              value={consultagenerica.paciente}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="form-row mb-12">
                          <div className="form-group col-md-6">
                            <label htmlFor="sucursal">
                              Sucursal
                            </label>
                            <select
                              className="form-control"
                              name="sucursal"
                              value={formData.sucursal || ''} // Asigna el valor de la sucursal seleccionada
                              onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })} // Manejo del cambio
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            >
                              <option value="">Seleccione una sucursal</option> {/* Opción por defecto */}
                              {sucursales.filter(sucursal => sucursal.id_sucursal).map((sucursal) => (
                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                  {sucursal.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="edad" onClick={() => console.log(formData)}>
                              Edad
                            </label>
                            <input
                              className="form-control"
                              value={formData.edad}
                              name="edad"
                              type="text"
                              onChange={handleChange}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="inputAddress" onClick={() => console.log(formData.fecha_atencion)}>
                              Fecha de atencion
                            </label>
                            <input
                              className="form-control"
                              value={
                                formData
                                  ? moment.utc(formData.fecha_atencion).format('YYYY-MM-DD')
                                  : ''
                              }
                              name="fecha_atencion"
                              type="date"
                              onChange={handleChange}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="inputAddress">
                              Motivo de Consulta:
                            </label>
                            <textarea
                              className="form-control textarea"
                              value={formData.m_c}
                              maxLength="10000"
                              name="m_c"
                              placeholder="Esta área tiene un limite de 800 caracteres."
                              rows="25"
                              onChange={handleChange}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputAddress">
                              Fecha de proxima cita
                            </label>
                            <input
                              className="form-control"
                              value={
                                consultagenerica
                                  ? formData.fecha_proxima_consulta
                                  : ''
                              }
                              name="fecha_proxima_consulta"
                              type="date"
                              onChange={handleChange}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editarfechaproximaconsulta"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-success mt-3"
                        type="submit"
                      >
                        Editar Consulta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditarConsultaGenerica
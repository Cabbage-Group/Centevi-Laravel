import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEditarBajaVision } from '../../redux/features/consultas/EditarBajaVisionSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import { fetchVerBajaVision } from '../../redux/features/pacientes/VerBajaVisionSlice.js';
import moment from 'moment';
import { funPermisosObtenidosBoolean } from '../../utils/ValidarPermisos.js';

const EditarBajaVision = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, id_consulta } = useParams();
  const { permisos } = useSelector((state) => state.auth);
  const { pacientes } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { data: bajavision } = useSelector((state) => state.verBajaVision)

  const [formData, setFormData] = useState({
    sucursal: '',
    doctor: localStorage.getItem('nombre'),
    paciente: '',
    edad: '',
    fecha_atencion: '',
    m_c: '',
    a_o: '',
    a_p: '',
    a_f: '',
    medicamentos: '',
    tratamientos: '',
    dx_oft_princ: '',
    objetivos: '',
    av_sc: {
      av_sc_od_vl: "",
      av_sc_oi_vl: "",
      av_sc_od_vp: "",
      av_sc_oi_vp: "",
      av_sc_od_ph: "",
      av_sc_oi_ph: "",
    },
    av_cc: {
      av_cc_od_vl: "",
      av_cc_oi_vl: "",
      av_cc_od_vp: "",
      av_cc_oi_vp: "",
      av_cc_od_ph: "",
      av_cc_oi_ph: ""
    },
    vision_exentrica: {
      ve_D: "",
      ve_I: ""
    },
    lensometria:
    {
      esfera_od: '',
      cilindro_od: '',
      eje_od: '',
      p_base_od: '',
      add_od: '',
      esfera_oi: '',
      cilindro_oi: '',
      eje_oi: '',
      p_base_oi: '',
      add_oi: ''
    },
    lensometria_extra:
    {
      len_tipo_lentes: '',
      len_filtros: '',
      len_tiempo: '',
      len_tipo_aro: ''
    },
    cv_so: {
      cv_od: "",
      so_od: "",
      cv_oi: "",
      so_oi: ""
    },
    amsler: {
      amsler_od: "",
      amsler_oi: ""
    },
    sensibilidad_c: {
      sensibilidad_od: "",
      sensibilidad_oi: ""
    },
    refraccion: {
      esfera_od_f: "",
      cilindro_od_f: "",
      eje_od_f: "",
      p_base_od_f: "",
      agz_od_f: "",
      esfera_oi_f: "",
      cilindro_oi_f: "",
      eje_oi_f: "",
      p_base_oi_f: "",
      agz_oi_f: "",
      lentes_marca_1: "",
      lentes_pd_1: "",
      lentes_dnp_1: "",
      lentes_altura_1: "",
      esfera_od_fc: "",
      cilindro_od_fc: "",
      eje_od_fc: "",
      p_base_od_fc: "",
      agz_od_fc: "",
      esfera_oi_fc: "",
      cilindro_oi_fc: "",
      eje_oi_fc: "",
      p_base_oi_fc: "",
      agz_oi_fc: "",
      lentes_marca_2: "",
      lentes_pd_2: "",
      lentes_dnp_2: "",
      lentes_altura_2: ""

    },
    pruebas: {
      vl_luces: "",
      vp_luces: "",
      vision_color: "",
      prueba_od: "",
      prueba_oi: ""
    },
    ayudas_opticas: '',
    ayudas_no_opticas: '',
    plan_rehabilitacion: '',
    plan_versiones: '',
    fecha_creacion: '',
    editado: {
      doctor: "",
      fecha_edicion: ""
    },
    fecha_creacion: '',
  });

  useEffect(() => {
    if (bajavision) {
      setFormData({
        sucursal: bajavision.sucursal || '',
        doctor: bajavision.doctor || '',
        paciente: bajavision.paciente || '',
        id_terapia: bajavision.id_terapia || '',
        edad: bajavision.edad || '',
        fecha_atencion: bajavision.fecha_atencion || '',
        m_c: bajavision.m_c || '',
        a_o: bajavision.a_o || '',
        a_p: bajavision.a_p || '',
        a_f: bajavision.a_f || '',
        medicamentos: bajavision.medicamentos || '',
        tratamientos: bajavision.tratamientos || '',
        dx_oft_princ: bajavision.dx_oft_princ || '',
        objetivos: bajavision.objetivos || '',
        av_sc: bajavision.av_sc ? JSON.parse(bajavision.av_sc) : {},
        av_cc: bajavision.av_cc ? JSON.parse(bajavision.av_cc) : {},
        vision_exentrica: bajavision.vision_exentrica ? JSON.parse(bajavision.vision_exentrica) : {},
        lensometria: bajavision.lensometria ? JSON.parse(bajavision.lensometria) : {},
        lensometria_extra: bajavision.lensometria_extra ? JSON.parse(bajavision.lensometria_extra) : {},
        cv_so: bajavision.cv_so ? JSON.parse(bajavision.cv_so) : {},
        amsler: bajavision.amsler ? JSON.parse(bajavision.amsler) : {},
        sensibilidad_c: bajavision.sensibilidad_c ? JSON.parse(bajavision.sensibilidad_c) : {},
        refraccion: bajavision.refraccion ? JSON.parse(bajavision.refraccion) : {},
        pruebas: bajavision.pruebas ? JSON.parse(bajavision.pruebas) : {},
        ayudas_opticas: bajavision.ayudas_opticas || '',
        ayudas_no_opticas: bajavision.ayudas_no_opticas || '',
        plan_rehabilitacion: bajavision.plan_rehabilitacion || '',
        plan_versiones: bajavision.plan_versiones || '',
        fecha_creacion: bajavision.fecha_creacion || '',
        editado: bajavision.editado ? JSON.parse(bajavision.editado) : {},
        fecha_proxima_consulta: moment.utc(bajavision.fecha_proxima_consulta).format('YYYY-MM-DD') || '',
      });
    }
  }, [bajavision]);

  useEffect(() => {
    if (id && id_consulta) {
      dispatch(fetchVerBajaVision({ id, id_consulta }));
      dispatch(fetchSucursales({ page: 1, limit: 100 }));
      dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    }
  }, [dispatch, id, id_consulta]);


  const handleChange = (e) => {
    const { name, value, dataset } = e.target;

    console.log('Handling change for:', name, value, dataset.group);

    setFormData((prevFormData) => {
      switch (dataset.group) {
        case 'av_sc':
          return {
            ...prevFormData,
            av_sc: {
              ...prevFormData.av_sc,
              [name]: value,
            },
          };
        case 'av_cc':
          return {
            ...prevFormData,
            av_cc: {
              ...prevFormData.av_cc,
              [name]: value,
            },
          };
        case 'vision_exentrica':
          return {
            ...prevFormData,
            vision_exentrica: {
              ...prevFormData.vision_exentrica,
              [name]: value,
            },
          };
        case 'lensometria':
          return {
            ...prevFormData,
            lensometria: {
              ...prevFormData.lensometria,
              [name]: value,
            },
          };
        case 'lensometria_extra':
          return {
            ...prevFormData,
            lensometria_extra: {
              ...prevFormData.lensometria_extra,
              [name]: value,
            },
          };
        case 'cv_so':
          return {
            ...prevFormData,
            cv_so: {
              ...prevFormData.cv_so,
              [name]: value,
            },
          };
        case 'amsler':
          return {
            ...prevFormData,
            amsler: {
              ...prevFormData.amsler,
              [name]: value,
            },
          };
        case 'sensibilidad_c':
          return {
            ...prevFormData,
            sensibilidad_c: {
              ...prevFormData.sensibilidad_c,
              [name]: value,
            },
          };
        case 'refraccion':
          return {
            ...prevFormData,
            refraccion: {
              ...prevFormData.refraccion,
              [name]: value,
            },
          };
        case 'pruebas':
          return {
            ...prevFormData,
            pruebas: {
              ...prevFormData.pruebas,
              [name]: value,
            },
          };
        case 'editado':
          return {
            ...prevFormData,
            editado: {
              ...prevFormData.editado,
              [name]: value,
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


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    dispatch(fetchEditarBajaVision({ id, id_consulta, data: formData }));
    navigate('');
  };


  return (
    <div
      className="admin-data-content"
      data-select2-id="13"
      style={{
        marginTop: '50px'
      }}
    >
      <div
        className="row layout-top-spacing"
        data-select2-id="12"
      >
        <div
          className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing"
          data-select2-id="11"
        >
          <div
            className="widget-content-area br-4"
            data-select2-id="10"
          >
            <form
              method="put"
              role="form"
              onSubmit={handleSubmit}
            >
              <div
                className="widget-one"
                data-select2-id="9"
              >
                <div
                  className="row"
                  data-select2-id="8"
                >
                  <div
                    className="col-lg-12 layout-spacing"
                    data-select2-id="flFormsGrid"
                    id="flFormsGrid"
                  >
                    <div
                      className="statbox widget box box-shadow"
                      data-select2-id="7"
                    >
                      <div className="widget-header">
                        <div className="row">
                          <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                            <h4>
                              {' '}Editar Baja Vision
                            </h4>
                          </div>
                        </div>
                      </div>
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
                              Creado por:
                            </a>
                          </li>
                          <li
                            aria-current="page"
                            className="breadcrumb-item active"
                          >
                            <b>
                              {bajavision.doctor}
                            </b>
                          </li>
                        </ol>
                      </nav>
                      <div
                        className="widget-content widget-content-area"
                        data-select2-id="6"
                      >
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="paciente">
                              Paciente:
                            </label>
                            <select
                              className="form-control"
                              name="paciente"
                              value={formData.paciente || ''}
                              onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            >
                              <option value="">Seleccione un paciente</option> { }
                              {pacientes.filter(paciente => paciente.id_paciente === bajavision.paciente).map((paciente) => (
                                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                  Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                </option>
                              ))}
                            </select>
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
                              value={formData.sucursal || ''}
                              onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            >
                              <option value="">Seleccione una sucursal</option> { }
                              {sucursales.filter(sucursal => sucursal.id_sucursal).map((sucursal) => (
                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                  {sucursal.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="edad">
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
                            <label htmlFor="inputAddress">
                              Fecha de atencion
                            </label>
                            <input
                              className="form-control"
                              value={formData.fecha_atencion}
                              name="fecha_atencion"
                              required
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
                              rows="15"
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
                          <div className="form-group col-md-4">
                            <label htmlFor="a_o">
                              Antecendentes Oculares
                            </label>
                            <input
                              className="form-control"
                              value={formData.a_o}
                              name="a_o"
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
                          <div className="form-group col-md-4">
                            <label htmlFor="a_P">
                              Antecedentes Personales
                            </label>
                            <input
                              className="form-control"
                              name="a_p"
                              type="text"
                              value={formData.a_p}
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
                            <label htmlFor="a_f">
                              Antecedentes Familiares
                            </label>
                            <input
                              className="form-control"
                              name="a_f"
                              type="text"
                              value={formData.a_f}
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
                            <label htmlFor="medicamentos">
                              Medicamentos
                            </label>
                            <input
                              className="form-control"
                              name="medicamentos"
                              type="text"
                              value={formData.medicamentos}
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
                            <label htmlFor="tratamientos">
                              Tratamientos anteriores
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Inyecciones de Eylea en AO / OD: DMAE Seca. OI: Atrofia Grafica "
                              name="tratamientos"
                              type="text"
                              value={formData.tratamientos}
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
                          <div className="form-group col-md-6">
                            <label htmlFor="dx_oftalmoligico">
                              DX. Oftalmologico Principal
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Degeneracion macular Seca en AO +OI"
                              name="dx_oft_princ"
                              type="text"
                              value={formData.dx_oft_princ}
                              onChange={handleChange}
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="objetivos">
                              Objetivos de paciente
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Le gusta leer bastante y ver la tele"
                              id="objetivos"
                              name="objetivos"
                              type="text"
                              value={formData.objetivos}
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
                          <div className="form-group col-md-6">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      AV/SC
                                    </th>
                                    <th>
                                      OD
                                    </th>
                                    <th>
                                      OI
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      VL
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"

                                        name="av_sc_od_vl"
                                        placeholder="od_vl"
                                        type="text"
                                        value={formData.av_sc.av_sc_od_vl}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"

                                        name="av_sc_oi_vl"
                                        placeholder="oi_vl"
                                        type="text"
                                        value={formData.av_sc.av_sc_oi_vl}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      VP
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="20/100"
                                        name="av_sc_od_vp"
                                        placeholder="od_vp"
                                        type="text"
                                        value={formData.av_sc.av_sc_od_vp}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"

                                        name="av_sc_oi_vp"
                                        placeholder="oi_vp"
                                        type="text"
                                        value={formData.av_sc.av_sc_oi_vp}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      PH
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        name="av_sc_od_ph"
                                        placeholder="od_ph"
                                        type="text"
                                        value={formData.av_sc.av_sc_od_ph}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }

                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"

                                        name="av_sc_oi_ph"
                                        placeholder="oi_ph"
                                        type="text"
                                        value={formData.av_sc.av_sc_oi_ph}
                                        onChange={handleChange}
                                        data-group="av_sc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="form-group col-md-6">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th className="text-center">
                                      AV/CC
                                    </th>
                                    <th>
                                      OD
                                    </th>
                                    <th>
                                      OI
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-center">
                                      VL
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="20/63"
                                        name="av_cc_od_vl"
                                        placeholder="od_vl"
                                        type="text"
                                        value={formData.av_cc.av_cc_od_vl}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="20/200"
                                        name="av_cc_oi_vl"
                                        placeholder="oi_vl"
                                        type="text"
                                        value={formData.av_cc.av_cc_oi_vl}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      VP
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="20/63"
                                        name="av_cc_od_vp"
                                        placeholder="od_vp"
                                        type="text"
                                        value={formData.av_cc.av_cc_od_vp}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="20/200"
                                        name="av_cc_oi_vp"
                                        placeholder="oi_vp"
                                        type="text"
                                        value={formData.av_cc.av_cc_oi_vp}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      PH
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="-----"
                                        name="av_cc_od_ph"
                                        placeholder="od_ph"
                                        type="text"
                                        value={formData.av_cc.av_cc_od_ph}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        defaultValue="------"
                                        name="av_cc_oi_ph"
                                        placeholder="oi_ph"
                                        type="text"
                                        value={formData.av_cc.av_cc_oi_ph}
                                        onChange={handleChange}
                                        data-group="av_cc"
                                        disabled={
                                          !funPermisosObtenidosBoolean(
                                            permisos,
                                            "consultas.editartodo"
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <h5>
                            RECETA
                          </h5>
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center">
                                    RX
                                  </th>
                                  <th>
                                    ESFERA
                                  </th>
                                  <th>
                                    CILINDRO
                                  </th>
                                  <th>
                                    EJE
                                  </th>
                                  <th>
                                    P/BASE
                                  </th>
                                  <th>
                                    ADD
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-center">
                                    Ojo Derecho
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="+2.50"
                                      name="esfera_od"
                                      placeholder="esfera_od"
                                      type="text"
                                      value={formData.lensometria.esfera_od}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="-3.00"
                                      name="cilindro_od"
                                      placeholder="cilindro_od"
                                      type="text"
                                      value={formData.lensometria.cilindro_od}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="80"
                                      name="eje_od"
                                      placeholder="eje_od"
                                      type="text"
                                      value={formData.lensometria.eje_od}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="△"
                                      name="p_base_od"
                                      placeholder="p_base_od"
                                      type="text"
                                      value={formData.lensometria.p_base_od}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue=""
                                      name="add_od"
                                      placeholder="add_od"
                                      type="text"
                                      value={formData.lensometria.add_od}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-center">
                                    Ojo Izquierdo
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="+2.00"
                                      name="esfera_oi"
                                      placeholder="esfera_oi"
                                      type="text"
                                      value={formData.lensometria.esfera_oi}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="-1.50"
                                      name="cilindro_oi"
                                      placeholder="cilindro_oi"
                                      type="text"
                                      value={formData.lensometria.cilindro_oi}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="90"
                                      name="eje_oi"
                                      placeholder="eje_oi"
                                      type="text"
                                      value={formData.lensometria.eje_oi}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue="△"
                                      name="p_base_oi"
                                      placeholder="p_base_oi"
                                      type="text"
                                      value={formData.lensometria.p_base_oi}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue=""
                                      name="add_oi"
                                      placeholder="add_oi"
                                      type="text"
                                      value={formData.lensometria.add_oi}
                                      onChange={handleChange}
                                      data-group="lensometria"
                                      disabled={
                                        !funPermisosObtenidosBoolean(
                                          permisos,
                                          "consultas.editartodo"
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Tipo de lentes
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Monofocales Poly Lectura"
                              name="len_tipo_lentes"
                              type="text"
                              value={formData.lensometria_extra.len_tipo_lentes}
                              onChange={handleChange}
                              data-group="lensometria_extra"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Filtros
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Antirreflejo"
                              name="len_filtros"
                              type="text"
                              value={formData.lensometria_extra.len_filtros}
                              onChange={handleChange}
                              data-group="lensometria_extra"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Tiempo
                            </label>
                            <input
                              className="form-control"
                              defaultValue="14 meses"
                              name="len_tiempo"
                              type="text"
                              value={formData.lensometria_extra.len_tiempo}
                              onChange={handleChange}
                              data-group="lensometria_extra"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Tipo de Aro
                            </label>
                            <input
                              className="form-control"
                              defaultValue="Pasta"
                              name="len_tipo_aro"
                              type="text"
                              value={formData.lensometria_extra.len_tipo_aro}
                              onChange={handleChange}
                              data-group="lensometria_extra"
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
                          <div className="form-group col-md-3">
                            <h5>
                              CV.CONFRONTACION
                            </h5>
                          </div>
                          <div className="form-group col-md-3">
                            <h5>
                              SALUD OCULAR
                            </h5>
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"

                              name="cv_od"
                              placeholder="OD"
                              type="text"
                              value={formData.cv_so.cv_od}
                              onChange={handleChange}
                              data-group="cv_so"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }

                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              defaultValue="OD Ptosis Palpebral"
                              name="so_od"
                              placeholder="OD"
                              type="text"
                              value={formData.cv_so.so_od}
                              onChange={handleChange}
                              data-group="cv_so"
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
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              defaultValue="--------"
                              name="cv_oi"
                              placeholder="OI"
                              type="text"
                              value={formData.cv_so.cv_oi}
                              onChange={handleChange}
                              data-group="cv_so"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              defaultValue=""
                              name="so_oi"
                              placeholder="OI"
                              type="text"
                              value={formData.cv_so.so_oi}
                              onChange={handleChange}
                              data-group="cv_so"
                              disabled={
                                !funPermisosObtenidosBoolean(
                                  permisos,
                                  "consultas.editartodo"
                                )
                              }
                            />
                          </div>
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <h6>
                            AMSLER
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <input
                                className="form-control"
                                defaultValue="OD Alterado Ondulacion "
                                name="amsler_od"
                                placeholder="OD"
                                type="text"
                                value={formData.amsler.amsler_od}
                                onChange={handleChange}
                                data-group="amsler"
                                disabled={
                                  !funPermisosObtenidosBoolean(
                                    permisos,
                                    "consultas.editartodo"
                                  )
                                }
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <input
                                className="form-control"
                                name="amsler_oi"
                                placeholder="OI"
                                type="text"
                                value={formData.amsler.amsler_oi}
                                onChange={handleChange}
                                data-group="amsler"
                                disabled={
                                  !funPermisosObtenidosBoolean(
                                    permisos,
                                    "consultas.editartodo"
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            SENSIBILIDAD AL CONTRASTE
                          </h6>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-6">
                              <input
                                className="form-control"
                                name="sensibilidad_od"
                                placeholder="OD"
                                type="text"
                                value={formData.sensibilidad_c.sensibilidad_od}
                                onChange={handleChange}
                                data-group="sensibilidad_c"
                                disabled={
                                  !funPermisosObtenidosBoolean(
                                    permisos,
                                    "consultas.editartodo"
                                  )
                                }
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <input
                                className="form-control"
                                name="sensibilidad_oi"
                                placeholder="OI"
                                type="text"
                                value={formData.sensibilidad_c.sensibilidad_oi}
                                onChange={handleChange}
                                data-group="sensibilidad_c"
                                disabled={
                                  !funPermisosObtenidosBoolean(
                                    permisos,
                                    "consultas.editartodo"
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            Versiones
                          </label>
                          <textarea
                            className="form-control textarea"
                            id="textarea"
                            maxLength="225"
                            name="plan_versiones"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                            value={formData.plan_versiones}
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
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className="text-center">
                                PRUEBAS SENSORIALES
                              </th>
                              <th>
                                VISION LEJANA
                              </th>
                              <th>
                                VISION PROXIMA
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-center">
                                Luces de Worth
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  name="vl_luces"
                                  placeholder="vl_luces"
                                  type="text"
                                  value={formData.pruebas.vl_luces}
                                  onChange={handleChange}
                                  data-group="pruebas"
                                  disabled={
                                    !funPermisosObtenidosBoolean(
                                      permisos,
                                      "consultas.editartodo"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  name="vp_luces"
                                  placeholder="vp_luces"
                                  type="text"
                                  value={formData.pruebas.vp_luces}
                                  onChange={handleChange}
                                  data-group="pruebas"
                                  disabled={
                                    !funPermisosObtenidosBoolean(
                                      permisos,
                                      "consultas.editartodo"
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            Visión de Color
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="vision_color"
                            placeholder="Visión de Color"
                            type="text"
                            value={formData.pruebas.vision_color}
                            onChange={handleChange}
                            data-group="pruebas"
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
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            OD
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="prueba_od"
                            placeholder="OD"
                            type="text"
                            value={formData.pruebas.prueba_od}
                            onChange={handleChange}
                            data-group="pruebas"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="prueba_od-group col-md-6">
                          <label htmlFor="inputAddress">
                            OI
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="prueba_oi"
                            placeholder="OI"
                            type="text"
                            value={formData.pruebas.prueba_oi}
                            onChange={handleChange}
                            data-group="pruebas"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <h5>
                          RECETA FINAL PARA DISTANCIA
                        </h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th className="text-center">
                                  RX
                                </th>
                                <th>
                                  ESFERA
                                </th>
                                <th>
                                  CILINDRO
                                </th>
                                <th>
                                  EJE
                                </th>
                                <th>
                                  P/BASE
                                </th>
                                <th>
                                  AGUDEZA VISUAL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">
                                  Ojo Derecho
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="esfera_od_f"
                                    placeholder="esfera_od"
                                    type="text"
                                    value={formData.refraccion.esfera_od_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="cilindro_od_f"
                                    placeholder="cilindro_od"
                                    type="text"
                                    value={formData.refraccion.cilindro_od_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="eje_od_f"
                                    placeholder="eje_od"
                                    type="text"
                                    value={formData.refraccion.eje_od_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="p_base_od_f"
                                    placeholder="p_base_od"
                                    type="text"
                                    value={formData.refraccion.p_base_od_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="agz_od_f"
                                    placeholder="agz_od"
                                    type="text"
                                    value={formData.refraccion.agz_od_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  Ojo Izquierdo
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="esfera_oi_f"
                                    placeholder="esfera_oi"
                                    type="text"
                                    value={formData.refraccion.esfera_oi_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="cilindro_oi_f"
                                    placeholder="cilindro_oi"
                                    type="text"
                                    value={formData.refraccion.cilindro_oi_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="eje_oi_f"
                                    placeholder="eje_oi"
                                    type="text"
                                    value={formData.refraccion.eje_oi_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="p_base_oi_f"
                                    placeholder="p_base_oi"
                                    type="text"
                                    value={formData.refraccion.p_base_oi_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="agz_oi_f"
                                    placeholder="agz_oi"
                                    type="text"
                                    value={formData.refraccion.agz_oi_f}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            Tipo Lentes
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="lentes_marca_1"
                            placeholder="Tipo Lentes"
                            type="text"
                            value={formData.refraccion.lentes_marca_1}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            PD:
                          </label>
                          <input
                            className="form-control"
                            name="lentes_pd_1"
                            placeholder="PD"
                            type="text"
                            value={formData.refraccion.lentes_pd_1}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            DNP:
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="lentes_dnp_1"
                            placeholder="USO"
                            type="text"
                            value={formData.refraccion.lentes_dnp_1}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            ALTURA:
                          </label>
                          <input
                            className="form-control"
                            id="inputAddress"
                            name="lentes_altura_1"
                            placeholder="USO"
                            type="text"
                            value={formData.refraccion.lentes_altura_1}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <h5>
                          RECETA FINAL PARA CERCA
                        </h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th className="text-center">
                                  RX
                                </th>
                                <th>
                                  ESFERA
                                </th>
                                <th>
                                  CILINDRO
                                </th>
                                <th>
                                  EJE
                                </th>
                                <th>
                                  P/BASE
                                </th>
                                <th>
                                  AGUDEZA VISUAL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">
                                  Ojo Derecho
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="esfera_od_fc"
                                    placeholder="esfera_od"
                                    type="text"
                                    value={formData.refraccion.esfera_od_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="cilindro_od_fc"
                                    placeholder="cilindro_od"
                                    type="text"
                                    value={formData.refraccion.cilindro_od_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="eje_od_fc"
                                    placeholder="eje_od"
                                    type="text"
                                    value={formData.refraccion.eje_od_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="p_base_od_fc"
                                    placeholder="p_base_od"
                                    type="text"
                                    value={formData.refraccion.p_base_od_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="agz_od_fc"
                                    placeholder="agz_od"
                                    type="text"
                                    value={formData.refraccion.agz_od_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  Ojo Izquierdo
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="esfera_oi_fc"
                                    placeholder="esfera_oi"
                                    type="text"
                                    value={formData.refraccion.esfera_oi_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="cilindro_oi_fc"
                                    placeholder="cilindro_oi"
                                    type="text"
                                    value={formData.refraccion.cilindro_oi_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="eje_oi_fc"
                                    placeholder="eje_oi"
                                    type="text"
                                    value={formData.refraccion.eje_oi_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="p_base_oi_fc"
                                    placeholder="p_base_oi"
                                    type="text"
                                    value={formData.refraccion.p_base_oi_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    name="agz_oi_fc"
                                    placeholder="agz_oi"
                                    type="text"
                                    value={formData.refraccion.agz_oi_fc}
                                    onChange={handleChange}
                                    data-group="refraccion"
                                    disabled={
                                      !funPermisosObtenidosBoolean(
                                        permisos,
                                        "consultas.editartodo"
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            Tipo Lentes
                          </label>
                          <input
                            className="form-control"
                            defaultValue="No se cambia la RX."
                            id="inputAddress"
                            name="lentes_marca_2"
                            placeholder="Tipo Lentes"
                            type="text"
                            value={formData.refraccion.lentes_marca_2}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            PD:
                          </label>
                          <input
                            className="form-control"
                            defaultValue=""
                            id="inputAddress"
                            name="lentes_pd_2"
                            placeholder="PD"
                            type="text"
                            value={formData.refraccion.lentes_pd_2}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            DNP:
                          </label>
                          <input
                            className="form-control"
                            defaultValue=""
                            id="inputAddress"
                            name="lentes_dnp_2"
                            placeholder="USO"
                            type="text"
                            value={formData.refraccion.lentes_dnp_2}
                            onChange={handleChange}
                            data-group="refraccion"
                            disabled={
                              !funPermisosObtenidosBoolean(
                                permisos,
                                "consultas.editartodo"
                              )
                            }
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            ALTURA:
                          </label>
                          <input
                            className="form-control"
                            defaultValue=""
                            id="inputAddress"
                            name="lentes_altura_2"
                            placeholder="USO"
                            type="text"
                            value={formData.refraccion.lentes_altura_2}
                            onChange={handleChange}
                            data-group="refraccion"
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
                            Ayudas Opticas Para Baja Visión
                          </label>
                          <textarea
                            className="form-control textarea"
                            defaultValue="Se le prueban ayudas para VL Telescopio Argus y mejora AV hasta 20/40 para ver tele pero no quiere mover la cabeza... Dice que eso no le va a funcionar... Para cerca trae una Lupa Echenbach con Luz de Baja Vision de España y dice que con eso se ayuda mas o menos.... No quiere lupa"
                            id="textarea"
                            maxLength="225"
                            name="ayudas_opticas"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                            value={formData.ayudas_opticas}
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
                            Ayudas No Opticas Para Baja Visión
                          </label>
                          <textarea
                            className="form-control textarea"
                            id="textarea"
                            maxLength="225"
                            name="ayudas_no_opticas"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                            value={formData.ayudas_no_opticas}
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
                            Plan de Rehabilitación Visual
                          </label>
                          <textarea
                            className="form-control textarea"
                            defaultValue="Uso de lentes con lupas y telescopio para lejos. Hoy el paciente paga 48 la consulta. Atendido por Dra Laura Toro"
                            id="textarea"
                            maxLength="225"
                            name="plan_rehabilitacion"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                            value={formData.plan_rehabilitacion}
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

export default EditarBajaVision
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchVerOrtoptica } from '../../redux/features/pacientes/VerOrtopticaSlice'
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatToDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const VerOrtoptica = () => {

  const dispatch = useDispatch();
  const { id, id_consulta } = useParams();

  const { pacientes } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { data: ortoptica } = useSelector((state) => state.verOrtoptica);

  let av_sc = {};
  let av_cc = {};
  let lensometria = {};
  let lensometria_extra = {};
  let sa_pp = {};
  let visuscopia = {};
  let visuscopia_extra = {};
  let refraccion = {};
  let lentes_contacto = {};
  let pruebas = {};
  let pruebas_extra = {};
  let acomodacion = {};
  let acomodacion_extra = {};
  let vergencia = {};
  let editado = {};
  try {
    av_sc = ortoptica && ortoptica.av_sc ? JSON.parse(ortoptica.av_sc) : {};
    av_cc = ortoptica && ortoptica.av_cc ? JSON.parse(ortoptica.av_cc) : {};
    lensometria = ortoptica && ortoptica.lensometria ? JSON.parse(ortoptica.lensometria) : {};
    lensometria_extra = ortoptica && ortoptica.lensometria_extra ? JSON.parse(ortoptica.lensometria_extra) : {};
    sa_pp = ortoptica && ortoptica.sa_pp ? JSON.parse(ortoptica.sa_pp) : {};
    visuscopia = ortoptica && ortoptica.visuscopia ? JSON.parse(ortoptica.visuscopia) : {};
    visuscopia_extra = ortoptica && ortoptica.visuscopia_extra ? JSON.parse(ortoptica.visuscopia_extra) : {};
    refraccion = ortoptica && ortoptica.refraccion ? JSON.parse(ortoptica.refraccion) : {};
    lentes_contacto = ortoptica && ortoptica.lentes_contacto ? JSON.parse(ortoptica.lentes_contacto) : {};
    pruebas = ortoptica && ortoptica.pruebas ? JSON.parse(ortoptica.pruebas) : {};
    pruebas_extra = ortoptica && ortoptica.pruebas_extra ? JSON.parse(ortoptica.pruebas_extra) : {};
    acomodacion = ortoptica && ortoptica.acomodacion ? JSON.parse(ortoptica.acomodacion) : {};
    acomodacion_extra = ortoptica && ortoptica.acomodacion_extra ? JSON.parse(ortoptica.acomodacion_extra) : {};
    vergencia = ortoptica && ortoptica.vergencia ? JSON.parse(ortoptica.vergencia) : {};
    editado = ortoptica && ortoptica.editado ? JSON.parse(ortoptica.editado) : {};
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  const handlePrint = () => {
    const input = document.getElementById('printableForm');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ortoptica-form.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  useEffect(() => {
    if (id && id_consulta) {
      dispatch(fetchVerOrtoptica({ id, id_consulta }));
      dispatch(fetchSucursales({ page: 1, limit: 100 }));
      dispatch(fetchPacientes({ page: 1, limit: 10000 }));
    }
  }, [dispatch, id, id_consulta]);

  return (
    <div
      className="admin-data-content"
      style={{
        marginTop: '50px'
      }}
    >
      <div className="row layout-top-spacing">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
          <div className="widget-content-area br-4">
            <form
              method="post"
              role="form"
            >
              <div className="widget-one" style={{ padding: "40px" }}>
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={handlePrint}
                  id="imprimir"
                >
                  <i className="fa fa-print m-r-5" />
                  IMPRIMIR
                </button>
                <div id="printableForm">
                  <div className="row">
                    <div
                      className="col-lg-12 layout-spacing"
                      id="flFormsGrid"
                    >
                      <div className="statbox widget box box-shadow">
                        <div className="widget-header">
                          <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <h4>
                                ORTOPTICA
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="widget-content widget-content-area">
                          <nav
                            aria-label="breadcrumb"
                            className="breadcrumb-one"
                          >
                            <ol
                              className="breadcrumb"
                              style={{
                                background: 'rgb(0 150 136 / 11%)'
                              }}
                            >
                              <li className="breadcrumb-item">
                                <a href="doctor">
                                  Doctor:
                                </a>
                              </li>
                              <li
                                aria-current="page"
                                className="breadcrumb-item active"
                              >
                                <b>
                                  {ortoptica ? ortoptica.doctor?.trim() : ''}
                                </b>
                              </li>
                            </ol>
                          </nav>
                          <nav
                            aria-label="breadcrumb"
                            className="breadcrumb-one"
                            id="editado"
                          >
                            <ol
                              className="breadcrumb"
                              style={{
                                backgroundColor: '#F7DC6F'
                              }}
                            >
                              <li className="breadcrumb-item">
                                <a href="javascript:void(0);">
                                  Editado por:
                                </a>
                              </li>
                              <li
                                aria-current="page"
                                className="breadcrumb-item active"
                              >
                                <b>
                                  {editado.doctor || ''}
                                </b>
                              </li>
                              <li
                                aria-current="page"
                                className="breadcrumb-item active"
                              >
                                <b>
                                  {editado.fecha_edicion || ''}
                                </b>
                              </li>
                            </ol>
                          </nav>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="paciente">
                                Paciente:
                              </label>
                              <select
                                className="form-control"
                                name="paciente"
                                disabled
                              >
                                <option>
                                  {pacientes.filter(paciente => paciente.id_paciente === ortoptica.paciente).map((paciente) => (
                                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                      Numero Cedula: {paciente.nro_cedula} || Nombres: {paciente.nombres} {paciente.apellidos}
                                    </option>
                                  ))}
                                </option>
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
                                disabled
                              >
                                <option>
                                  {sucursales.filter(sucursal => sucursal.id_sucursal === ortoptica.sucursal).map((sucursal) => (
                                    <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                      {sucursal.nombre}
                                    </option>
                                  ))}
                                </option>
                              </select>
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="edad">
                                Edad
                              </label>
                              <input
                                className="form-control"
                                value={ortoptica ? ortoptica.edad : ''}
                                name="edad"
                                disabled
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="inputAddress">
                                Fecha de atencion
                              </label>
                              <input
                                className="form-control"
                                value={ortoptica ? formatToDateDisplay(ortoptica.fecha_atencion) : ''}
                                name="fecha_atencion"
                                disabled
                                type="text"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-12">
                              <label htmlFor="inputAddress">
                                M/C:
                              </label>
                              <textarea
                                className="form-control textarea"
                                value={ortoptica ? ortoptica.m_c : ''}
                                disabled
                                maxLength="225"
                                name="m_c"
                                placeholder="Esta área tiene un limite de 225 caracteres."
                                rows="2"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-4">
                              <label htmlFor="lugarNacimiento">
                                A/O
                              </label>
                              <input
                                className="form-control"
                                value={ortoptica ? ortoptica.a_o : ''}
                                disabled
                                id="lugarNacimiento"
                                name="a_o"
                                placeholder="A/O"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress2">
                                A/P
                              </label>
                              <input
                                className="form-control"
                                value={ortoptica ? ortoptica.a_p : ''}
                                disabled
                                name="a_p"
                                placeholder="A/P"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-4">
                              <label htmlFor="inputAddress2">
                                A/F
                              </label>
                              <input
                                className="form-control"
                                value={ortoptica ? ortoptica.a_f : ''}
                                disabled
                                name="a_f"
                                placeholder="A/F"
                                type="text"
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
                                value={ortoptica ? ortoptica.medicamentos : ''}
                                disabled
                                name="medicamentos"
                                placeholder="Medicamentos"
                                type="text"
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
                                value={ortoptica ? ortoptica.tratamientos : ''}
                                disabled
                                name="tratamientos"
                                placeholder="Tratamientos"
                                type="text"
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
                                          value={av_sc.av_sc_od_vl || ''}
                                          disabled
                                          name="av/sc_od_vl"
                                          placeholder="od_vl"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_sc.av_sc_oi_vl || ''}
                                          disabled
                                          name="av/sc_oi_vl"
                                          placeholder="oi_vl"
                                          type="text"
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
                                          value={av_sc.av_sc_od_vp || ''}
                                          disabled
                                          name="av/sc_od_vp"
                                          placeholder="od_vp"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_sc.av_sc_oi_vp || ''}
                                          disabled
                                          name="av/sc_oi_vp"
                                          placeholder="oi_vp"
                                          type="text"
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
                                          value={av_sc.av_sc_od_ph || ''}
                                          disabled
                                          name="av/sc_od_ph"
                                          placeholder="od_ph"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_sc.av_sc_oi_ph || ''}
                                          disabled
                                          name="av/sc_oi_ph"
                                          placeholder="oi_ph"
                                          type="text"
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
                                          value={av_cc.av_cc_od_vl || ''}
                                          disabled
                                          name="av/cc_od_vl"
                                          placeholder="od_vl"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_cc.av_cc_oi_vl || ''}
                                          disabled
                                          name="av/cc_oi_vl"
                                          placeholder="oi_vl"
                                          type="text"
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
                                          value={av_cc.av_cc_od_vp || ''}
                                          disabled
                                          name="av/cc_od_vp"
                                          placeholder="od_vp"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_cc.av_cc_oi_vp || ''}
                                          disabled
                                          name="av/cc_oi_vp"
                                          placeholder="oi_vp"
                                          type="text"
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
                                          value={av_cc.av_cc_od_ph || ''}
                                          disabled
                                          name="av/cc_od_ph"
                                          placeholder="od_ph"
                                          type="text"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          className="form-control"
                                          value={av_cc.av_cc_oi_ph || ''}
                                          disabled
                                          name="av/cc_oi_ph"
                                          placeholder="oi_ph"
                                          type="text"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <h6>
                                OJO DOMINANTE
                              </h6>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-3">
                                  <div className="n-chk">
                                    <label className="new-control new-radio radio-classic-success">
                                      <input
                                        className="new-control-input"
                                        value="IZQUIERDO"
                                        name="ojo_dominante"
                                        readOnly
                                        type="radio"
                                        checked={ortoptica ? ortoptica.ojo_dominante === 'IZQUIERDO' : false}
                                      />
                                      <span className="new-control-indicator" />
                                      IZQUIERDO
                                    </label>
                                  </div>
                                </div>
                                <div className="form-group col-md-3">
                                  <div className="n-chk">
                                    <label className="new-control new-radio radio-classic-success">
                                      <input
                                        className="new-control-input"
                                        value="DERECHO"
                                        name="ojo_dominante"
                                        readOnly
                                        type="radio"
                                        checked={ortoptica ? ortoptica.ojo_dominante === 'DERECHO' : false}
                                      />
                                      <span className="new-control-indicator" />
                                      DERECHO
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <h6>
                                MANO DOMINANTE
                              </h6>
                              <div className="form-row mb-4">
                                <div className="form-group col-md-3">
                                  <div className="n-chk">
                                    <label className="new-control new-radio radio-classic-success">
                                      <input
                                        className="new-control-input"
                                        value="IZQUIERDA"
                                        disabled
                                        name="mano_dominante"
                                        type="radio"
                                        checked={ortoptica ? ortoptica.mano_dominante === 'IZQUIERDA' : false}
                                      />
                                      <span className="new-control-indicator" />
                                      IZQUIEDA
                                    </label>
                                  </div>
                                </div>
                                <div className="form-group col-md-3">
                                  <div className="n-chk">
                                    <label className="new-control new-radio radio-classic-success">
                                      <input
                                        className="new-control-input"
                                        value="DERECHO"
                                        disabled
                                        name="mano_dominante"
                                        type="radio"
                                        checked={ortoptica ? ortoptica.mano_dominante === 'DERECHO' : false}
                                      />
                                      <span className="new-control-indicator" />
                                      DERECHA
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group second_page">
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
                                        value={lensometria.esfera_od || ''}
                                        disabled
                                        name="esfera_od"
                                        placeholder="esfera_od"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.cilindro_od || ''}
                                        disabled
                                        name="cilindro_od"
                                        placeholder="cilindro_od"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.eje_od || ''}
                                        disabled
                                        name="eje_od"
                                        placeholder="eje_od"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.p_base_od || ''}
                                        disabled
                                        name="p_base_od"
                                        placeholder="p_base_od"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.add_od || ''}
                                        disabled
                                        name="add_od"
                                        placeholder="add_od"
                                        type="text"
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
                                        value={lensometria.esfera_oi || ''}
                                        disabled
                                        name="esfera_oi"
                                        placeholder="esfera_oi"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.cilindro_oi || ''}
                                        disabled
                                        name="cilindro_oi"
                                        placeholder="cilindro_oi"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.eje_oi || ''}
                                        disabled
                                        name="eje_oi"
                                        placeholder="eje_oi"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.p_base_oi || ''}
                                        disabled
                                        name="p_base_oi"
                                        placeholder="p_base_oi"
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={lensometria.add_oi || ''}
                                        disabled
                                        name="add_oi"
                                        placeholder="add_oi"
                                        type="text"
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
                                value={lensometria_extra.len_tipo_lentes || ''}
                                disabled
                                name="len_tipo_lentes"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Filtros
                              </label>
                              <input
                                className="form-control"
                                value={lensometria_extra.len_filtros || ''}
                                disabled
                                name="len_filtros"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tiempo
                              </label>
                              <input
                                className="form-control"
                                value={lensometria_extra.len_tiempo || ''}
                                disabled
                                name="len_tiempo"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label htmlFor="objetivos">
                                Tipo de Aro
                              </label>
                              <input
                                className="form-control"
                                value={lensometria_extra.len_tipo_arco || ''}
                                disabled
                                name="len_tipo_arco"
                                type="text"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <h5>
                                Segmento Anterior
                              </h5>
                            </div>
                            <div className="form-group col-md-3">
                              <h5>
                                Polo Posterior
                              </h5>
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <input
                                className="form-control"
                                value={sa_pp.sa_od || ''}
                                disabled
                                name="sa_od"
                                placeholder="OD"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <input
                                className="form-control"
                                value={sa_pp.pp_od || ''}
                                disabled
                                name="pp_od"
                                placeholder="OD"
                                type="text"
                              />
                            </div>
                          </div>
                          <div className="form-row mb-4">
                            <div className="form-group col-md-3">
                              <input
                                className="form-control"
                                value={sa_pp.sa_oi || ''}
                                disabled
                                name="sa_oi"
                                placeholder="OI"
                                type="text"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <input
                                className="form-control"
                                value={sa_pp.pp_oi || ''}
                                disabled
                                name="pp_oi"
                                placeholder="OI"
                                type="text"
                              />
                            </div>
                          </div>

                        </div>
                        <h6>
                          VISUSCOPIA:
                        </h6>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-6">
                            <label htmlFor="v_od">
                              OD
                            </label>
                            <input
                              className="form-control"
                              value={visuscopia.viscopia_od || ''}
                              disabled
                              name="viscopia_od"
                              placeholder="OD"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="v_oi">
                              OI
                            </label>
                            <input
                              className="form-control"
                              value={visuscopia.viscopia_oi || ''}
                              disabled
                              name="viscopia_oi"
                              placeholder="OI"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-6">
                            <label htmlFor="tratamientos">
                              Hirschberg
                            </label>
                            <input
                              className="form-control"
                              value={visuscopia.hirschberg || ''}
                              disabled
                              name="hirschberg"
                              placeholder="hirschberg"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="tratamientos">
                              Krismsky
                            </label>
                            <input
                              className="form-control"
                              value={visuscopia.krismsky || ''}
                              disabled
                              name="krismsky"
                              placeholder="krismsky"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <label htmlFor="versiones">
                            VERSIONES:
                          </label>
                          <textarea
                            className="form-control textarea"
                            value={ortoptica ? ortoptica.plan_versiones : ''}
                            disabled
                            maxLength="225"
                            name="plan_versiones"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-4">
                          <label htmlFor="VL">
                            CT: VL:
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.ct_vl || ''}
                            disabled
                            id="VL"
                            name="ct_vl"
                            placeholder="VL"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="VP">
                            VP
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.ct_vp || ''}
                            disabled
                            name="ct_vp"
                            placeholder="VP"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="maddox">
                            MADDOX:
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.maddox || ''}
                            disabled
                            name="maddox"
                            placeholder="maddox"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Seguimiento Visual(AO):{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.seguimiento_ao || ''}
                            disabled
                            name="seguimiento_ao"
                            placeholder="seguimiento"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Sacádicos(AO):{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.sacadicos_ao || ''}
                            disabled
                            name="sacadicos_ao"
                            placeholder="sacadicos"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            PPC: OR{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_or || ''}
                            disabled
                            name="ppc_or"
                            placeholder="ppc_or"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            L:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_l || ''}
                            disabled
                            name="ppc_l"
                            placeholder="ppc_l"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            FR:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_fr || ''}
                            disabled
                            name="ppc_fr"
                            placeholder="ppc_fr"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Posicion compensatoria:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_posicion || ''}
                            disabled
                            name="ppc_posicion"
                            placeholder="ppc_posicion"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            HELSHOSWSKY
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.helshoswky || ''}
                            disabled
                            name="helshoswky"
                            placeholder="helshoswky"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            VON GRAEFE
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.von_graefe || ''}
                            disabled
                            name="von_graefe"
                            placeholder="von_graefe"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className="text-center">
                                PRUEBAS
                              </th>
                              <th>
                                VL
                              </th>
                              <th>
                                VP
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
                                  value={pruebas.vl_luces || ''}
                                  disabled
                                  name="vl_luces"
                                  placeholder="vl_luces"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={pruebas.vp_luces || ''}
                                  disabled
                                  name="vp_luces"
                                  placeholder="vp_luces"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-center">
                                Bagolinni
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={pruebas.vl_bg || ''}
                                  disabled
                                  name="vl_bg"
                                  placeholder="vl_bg"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={pruebas.vp_bg || ''}
                                  disabled
                                  name="vp_bg"
                                  placeholder="vp_bg"
                                  type="text"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <h5 className="text-center">
                            Estereopsis
                          </h5>
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            Randot:
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extra.randot || ''}
                            disabled
                            name="randot"
                            placeholder="randot"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            Lang:
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extra.lang || ''}
                            disabled
                            name="lang"
                            placeholder="lang"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            Visión de Color
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extra.vision_color || ''}
                            disabled
                            name="vision_color"
                            placeholder="vision"
                            type="text"
                          />
                        </div>
                      </div>
                      <h4>
                        EVALUACION DE LA ACOMODACION
                      </h4>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            A.A OD:
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.aa_od || ''}
                            disabled
                            name="aa_od"
                            placeholder="aa_od"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            OI
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.aa_oi || ''}
                            disabled
                            name="aa_oi"
                            placeholder="aa_oi"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            FAN: OD
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.fan_od || ''}
                            disabled
                            name="fan_od"
                            placeholder="fan_od"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            OI:
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.fan_cpm || ''}
                            disabled
                            name="fan_cpm"
                            placeholder="fan_cpm"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            FAB
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.aco_oi || ''}
                            disabled
                            name="aco_oi"
                            placeholder="aco_oi"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            MEM: OD
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.aco_cpm || ''}
                            disabled
                            name="aco_cpm"
                            placeholder="aco_cpm"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            OI
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion.acp_fab || ''}
                            disabled
                            name="acp_fab"
                            placeholder="acp_fab"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            ARN
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion_extra.mem_arn || ''}
                            disabled
                            name="mem_arn"
                            placeholder="mem_arn"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            ARP
                          </label>
                          <input
                            className="form-control"
                            value={acomodacion_extra.mem_arp || ''}
                            disabled
                            name="mem_arp"
                            placeholder="mem_arp"
                            type="text"
                          />
                        </div>
                      </div>
                      <h4>
                        EVALUACION DE LAS VERGENCIAS
                      </h4>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            BT/VL
                          </label>
                          <input
                            className="form-control"
                            value={vergencia.v_vt_vl || ''}
                            disabled
                            name="v_vt_vl"
                            placeholder="v_vt_vl"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            BT/VP
                          </label>
                          <input
                            className="form-control"
                            value={vergencia.v_bt_vp || ''}
                            disabled
                            name="v_bt_vp"
                            placeholder="v_bt_vp"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            BN/VL
                          </label>
                          <input
                            className="form-control"
                            value={vergencia.v_bn_vl || ''}
                            disabled
                            name="v_bn_vl"
                            placeholder="v_bn_vl"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            BN/VP
                          </label>
                          <input
                            className="form-control"
                            value={vergencia.v_bn_vp || ''}
                            disabled
                            name="v_bn_vp"
                            placeholder="v_bn_vp"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <h5>
                          RECETA FINAL
                        </h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th className="text-center">
                                  RX{' '}
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
                                <th>
                                  AGUDEZA VISUAL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">
                                  OD
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.esfera_od_f || ''}
                                    disabled
                                    name="esfera_od_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.cilindro_od_f || ''}
                                    disabled
                                    name="cilindro_od_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.eje_od_f || ''}
                                    disabled
                                    name="eje_od_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.p_base_od_f || ''}
                                    disabled
                                    name="p_base_od_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.add_od_f || ''}
                                    disabled
                                    name="add_od_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.agz_od_f || ''}
                                    disabled
                                    name="agz_od_f"
                                    type="text"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  OI
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.esfera_oi_f || ''}
                                    disabled
                                    name="esfera_oi_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.cilindro_oi_f || ''}
                                    disabled
                                    name="cilindro_oi_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.eje_oi_f || ''}
                                    disabled
                                    name="eje_oi_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.p_base_oi_f || ''}
                                    disabled
                                    name="p_base_oi_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.add_oi_f || ''}
                                    disabled
                                    name="add_oi_f"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.agz_oi_f || ''}
                                    disabled
                                    name="agz_oi_f"
                                    type="text"
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
                            TIPO DE LENTE
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_marca_1 || ''}
                            disabled
                            name="lente_marca_1"
                            placeholder="Marca"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            PD:
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_pd_1 || ''}
                            disabled
                            name="lente_pd_1"
                            placeholder="pd"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            DNP:
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_dnp_1 || ''}
                            disabled
                            name="lente_dnp_1"
                            placeholder="dnp"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="inputAddress">
                            ALTURA:
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_altura_1 || ''}
                            disabled
                            name="lente_altura_1"
                            placeholder="altura"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <h5>
                          Lente de Contacto
                        </h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>
                                  PARAMETROS
                                </th>
                                <th>
                                  OD
                                </th>
                                <th className="text-center">
                                  OI
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">
                                  PODER
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.poder_od || ''}
                                    disabled
                                    name="poder_od"
                                    placeholder="poder_od"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.poder_oi || ''}
                                    disabled
                                    name="poder_oi"
                                    placeholder="poder_oi"
                                    type="text"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  C.B
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.cb_od || ''}
                                    disabled
                                    name="cb_od"
                                    placeholder="cb_od"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.cb_oi || ''}
                                    disabled
                                    name="cb_oi"
                                    placeholder="cb_oi"
                                    type="text"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="text-center">
                                  DIA
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.dia_od || ''}
                                    disabled
                                    name="dia_od"
                                    placeholder="dia_od"
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.dia_oi || ''}
                                    disabled
                                    name="dia_oi"
                                    placeholder="dia_oi"
                                    type="text"
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
                            Marca
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_marca || ''}
                            disabled
                            name="lente_marca"
                            placeholder="Marca"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            Tipo:
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_tipo || ''}
                            disabled
                            name="lente_tipo"
                            placeholder="Tipo"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            CONDUCTA A SEGUIR:
                          </label>
                          <textarea
                            className="form-control textarea"
                            value={ortoptica ? ortoptica.conducta_seguir : ''}
                            disabled
                            maxLength="225"
                            name="conducta_seguir"
                            placeholder="Esta área tiene un limite de 225 caracteres."
                            rows="2"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="inputAddress">
                            Fecha de proxima cita
                          </label>
                          <input
                            className="form-control"
                            value={
                              ortoptica
                                ? formatToDateDisplay(ortoptica.fecha_proxima_consulta)
                                : ''
                            }
                            disabled
                            name="fecha_proxima_consulta"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                      </div>
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

export default VerOrtoptica
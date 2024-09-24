import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchVerRefraccionGeneral } from '../../redux/features/pacientes/VerRefraccionGeneralSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatToDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const VerRefraccionGeneral = () => {

  const dispatch = useDispatch();
  const { id, id_consulta } = useParams();

  const { pacientes } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { data: RefraccionGeneral } = useSelector((state) => state.verRefraccionGeneral);

  let av_sc = {};
  let av_cc = {};
  let lensometria = {};
  let lensometria_extra = {};
  let sa_pp = {};
  let refraccion = {};
  let lentes_contacto = {};
  let tipo_lentes = {};
  let visuscopia = {};
  let visuscopia_extra = {};
  let pruebas = {};
  let pruebas_extra = {};
  let editado = {};
  try {
    av_sc = RefraccionGeneral && RefraccionGeneral.av_sc ? JSON.parse(RefraccionGeneral.av_sc) : {};
    av_cc = RefraccionGeneral && RefraccionGeneral.av_cc ? JSON.parse(RefraccionGeneral.av_cc) : {};
    lensometria = RefraccionGeneral && RefraccionGeneral.lensometria ? JSON.parse(RefraccionGeneral.lensometria) : {};
    lensometria_extra = RefraccionGeneral && RefraccionGeneral.lensometria_extra ? JSON.parse(RefraccionGeneral.lensometria_extra) : {};
    sa_pp = RefraccionGeneral && RefraccionGeneral.sa_pp ? JSON.parse(RefraccionGeneral.sa_pp) : {};
    visuscopia = RefraccionGeneral && RefraccionGeneral.visuscopia ? JSON.parse(RefraccionGeneral.visuscopia) : {};
    visuscopia_extra = RefraccionGeneral && RefraccionGeneral.visuscopia_extra ? JSON.parse(RefraccionGeneral.visuscopia_extra) : {};
    refraccion = RefraccionGeneral && RefraccionGeneral.refraccion ? JSON.parse(RefraccionGeneral.refraccion) : {};
    lentes_contacto = RefraccionGeneral && RefraccionGeneral.lentes_contacto ? JSON.parse(RefraccionGeneral.lentes_contacto) : {};
    tipo_lentes = RefraccionGeneral && RefraccionGeneral.tipo_lentes ? JSON.parse(RefraccionGeneral.tipo_lentes) : {};
    pruebas = RefraccionGeneral && RefraccionGeneral.pruebas ? JSON.parse(RefraccionGeneral.pruebas) : {};
    pruebas_extra = RefraccionGeneral && RefraccionGeneral.pruebas_extra ? JSON.parse(RefraccionGeneral.pruebas_extra) : {};
    editado = RefraccionGeneral && RefraccionGeneral.editado ? JSON.parse(RefraccionGeneral.editado) : {};
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
        pdf.save('RefraccionGeneral-form.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  useEffect(() => {
    if (id && id_consulta) {
      dispatch(fetchVerRefraccionGeneral({ id, id_consulta }));
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
              <div className="widget-one">
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
                              Refracción General
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
                            background: 'rgb(0 150 136 / 11%)!important'
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
                              {RefraccionGeneral ? RefraccionGeneral.doctor?.trim() : ''}
                            </b>
                          </li>
                        </ol>
                      </nav>
                      <div className="widget-content widget-content-area">
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="Pacientes">
                              Paciente
                            </label>
                            <select
                              className="form-control"
                              name="paciente"
                              disabled
                            >
                              <option>
                                {pacientes.filter(paciente => paciente.id_paciente === RefraccionGeneral.paciente).map((paciente) => (
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
                            <label htmlFor="Sucursales">
                              Sucursal
                            </label>
                            <select
                              className="form-control"
                              id="sucursal"
                              name="sucursal"
                              readOnly
                            >
                              <option value="3">
                                {sucursales.filter(sucursal => sucursal.id_sucursal === RefraccionGeneral.sucursal).map((sucursal) => (
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
                              value={RefraccionGeneral.edad}
                              name="edad"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="inputAddress">
                              Fecha de atencion
                            </label>
                            <input
                              className="form-control"
                              value={RefraccionGeneral ? formatToDateDisplay(RefraccionGeneral.fecha_atencion) : ''}
                              disabled
                              name="fecha_atencion"
                              type="text"
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
                              value={RefraccionGeneral ? RefraccionGeneral.m_c : ''}
                              maxLength="800"
                              name="m_c"
                              placeholder="Esta área tiene un limite de 800 caracteres."
                              readOnly
                              rows="5"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-4">
                            <label htmlFor="lugarNacimiento">
                              Antecedentes Oculares
                            </label>
                            <input
                              className="form-control"
                              value={RefraccionGeneral ? RefraccionGeneral.a_o : ''}
                              name="a_o"
                              placeholder="A/O"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputAddress2">
                              Antecedentes Personales
                            </label>
                            <input
                              className="form-control"
                              value={RefraccionGeneral ? RefraccionGeneral.a_p : ''}
                              id="inputAddress2"
                              name="a_p"
                              placeholder="A/P"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputAddress2">
                              Antecedentes Familiares
                            </label>
                            <input
                              className="form-control"
                              value={RefraccionGeneral ? RefraccionGeneral.a_f : ''}
                              id="inputAddress2"
                              name="a_f"
                              placeholder="A/F"
                              readOnly
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
                              value={RefraccionGeneral ? RefraccionGeneral.medicamentos : ''}
                              id="medicamentos"
                              name="medicamentos"
                              placeholder="Medicamentos"
                              readOnly
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
                              value={RefraccionGeneral ? RefraccionGeneral.tratamientos : ''}
                              id="tratamientos"
                              name="tratamientos"
                              placeholder="Tratamientos"
                              readOnly
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
                                        value={av_sc.av_sc_od_vl}
                                        name="av_sc_od_vl"
                                        placeholder="od_vl"
                                        readOnly
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_sc.av_sc_oi_vl}
                                        name="av_sc_oi_vl"
                                        placeholder="oi_vl"
                                        readOnly
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
                                        value={av_sc.av_sc_od_vp}
                                        name="av_sc_od_vp"
                                        placeholder="od_vp"
                                        readOnly
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_sc.av_sc_oi_vp}
                                        name="av_sc_oi_vp"
                                        placeholder="oi_vp"
                                        readOnly
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
                                      Visión Lejana
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_cc.av_cc_od_vl}
                                        name="av_cc_od_vl"
                                        placeholder="od_vl"
                                        readOnly
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_cc.av_cc_oi_vl}
                                        name="av_cc_oi_vl"
                                        placeholder="oi_vl"
                                        readOnly
                                        type="text"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-center">
                                      Visión Próxima
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_cc.av_cc_od_vp}
                                        name="av_cc_od_vp"
                                        placeholder="od_vp"
                                        readOnly
                                        type="text"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        value={av_cc.av_cc_oi_vp}
                                        name="av_cc_oi_vp"
                                        placeholder="dsadap"
                                        readOnly
                                        type="text"
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
                            LENSOMETRIA
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
                                    P/BASE △
                                  </th>
                                  <th>
                                    ADD
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
                                      value={lensometria.esfera_od}
                                      name="esfera_od"
                                      placeholder="esfera_od"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.cilindro_od}
                                      name="cilindro_od"
                                      placeholder="cilindro_od"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.eje_od}
                                      name="eje_od"
                                      placeholder="eje_od"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.p_base_od}
                                      name="p_base_od"
                                      placeholder="△"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.add_od}
                                      name="add_od"
                                      placeholder="add_od"
                                      readOnly
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
                                      value={lensometria.esfera_oi}
                                      name="esfera_oi"
                                      placeholder="esfera_oi"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.cilindro_oi}
                                      name="cilindro_oi"
                                      placeholder="cilindro_oi"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.eje_oi}
                                      name="eje_oi"
                                      placeholder="eje_oi"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.p_base_oi}
                                      name="p_base_oi"
                                      placeholder="△"
                                      readOnly
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.add_oi}
                                      name="add_oi"
                                      placeholder="add_oi"
                                      readOnly
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
                              value={lensometria_extra.len_tipo_lentes}
                              name="len_tipo_lentes"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Filtros
                            </label>
                            <input
                              className="form-control"
                              value={lensometria_extra.len_filtros}
                              name="len_filtros"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="objetivos">
                              Tiempo
                            </label>
                            <input
                              className="form-control"
                              value={lensometria_extra.len_tiempo}
                              name="len_tiempo"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div
                            className="form-group col-md-3"
                            onClick={() => {
                              console.log(lensometria_extra);
                            }}
                          >
                            <label htmlFor="objetivos">
                              Tipo de Aro
                            </label>
                            <input
                              className="form-control"
                              value={lensometria_extra.len_tipo_aro}
                              name="len_tipo_aro"
                              readOnly
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
                              value={sa_pp.sa_od}
                              name="sa_od"
                              placeholder="Ojo Derecho"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.pp_od}
                              name="pp_od"
                              placeholder="Ojo Derecho"
                              readOnly
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.sa_oi}
                              name="sa_oi"
                              placeholder="Ojo Izquierdo"
                              readOnly
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.pp_oi}
                              name="pp_oi"
                              placeholder="Ojo Izquierdo"
                              readOnly
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Hirschberg
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.hirschberg}
                            id="hirschberg"
                            name="hirschberg"
                            placeholder="hirschberg"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="VL">
                            CT: VL:
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.ct_vl}
                            id="VL"
                            name="ct_vl"
                            placeholder="VL"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="VP">
                            VP
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia.ct_vp}
                            id="VP"
                            name="ct_vp"
                            placeholder="VP"
                            readOnly
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            VERSIONES:
                          </label>
                          <textarea
                            className="form-control textarea"
                            id="textarea"
                            maxLength="800"
                            value={RefraccionGeneral.plan_versiones}
                            name="plan_versiones"
                            placeholder="Esta área tiene un limite de 800 caracteres."
                            readOnly
                            rows="5"
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
                            value={visuscopia_extra.ppc_or}
                            id="ppc_or"
                            name="ppc_or"
                            placeholder="ppc_or"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            L:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_l}
                            id="ppc_l"
                            name="ppc_l"
                            placeholder="ppc_l"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Posicion compensatoria:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={visuscopia_extra.ppc_posicion}
                            id="ppc_posicion"
                            name="ppc_posicion"
                            placeholder="ppc_posicion"
                            readOnly
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label htmlFor="inputAddress">
                            OBSERVACIONES:
                          </label>
                          <textarea
                            className="form-control textarea"
                            id="textarea"
                            maxLength="500"
                            value={visuscopia_extra.observaciones}
                            name="observaciones"
                            placeholder="Esta área tiene un limite de 500 caracteres."
                            readOnly
                            rows="3"
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
                              <th className="text-center">
                                Visión Lejana
                              </th>
                              <th className="text-center">
                                Visión Próxima
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
                                  value={pruebas.vl_luces}
                                  name="vl_luces"
                                  placeholder="vl_luces"
                                  readOnly
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={pruebas.vp_luces}
                                  name="vp_luces"
                                  placeholder="vp_luces"
                                  readOnly
                                  type="text"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <h4 className="text-center">
                            Estereopsis
                          </h4>
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            Randot:
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extra.randot}
                            id="inputAddress"
                            name="randot"
                            placeholder="randot"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            Lang:
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extra.lang}
                            id="inputAddress"
                            name="lang"
                            placeholder="lang"
                            readOnly
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
                            value={pruebas_extra.vision_color}
                            id="inputAddress"
                            name="vision_color"
                            placeholder="vision"
                            readOnly
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <h5
                          onClick={() => {
                            console.log(av_cc);
                            console.log(refraccion);

                          }}
                        >
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
                                    value={refraccion.esfera_od_f}
                                    name="esfera_od_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.cilindro_od_f}
                                    name="cilindro_od_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.eje_od_f}
                                    name="eje_od_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.p_base_od_f}
                                    name="p_base_od_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.add_od_f}
                                    name="add_od_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.agz_od_f}
                                    name="add_od_f"
                                    readOnly
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
                                    value={refraccion.esfera_oi_f}
                                    name="esfera_oi_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.cilindro_oi_f}
                                    name="cilindro_oi_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.eje_oi_f}
                                    name="eje_oi_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.p_base_oi_f}
                                    name="p_base_oi_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.add_oi_f}
                                    name="add_oi_f"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={refraccion.agz_oi_f}
                                    name="add_oi_f"
                                    readOnly
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
                          <label htmlFor="tratamientos">
                            Tipo Lentes{' '}
                          </label>
                          <input
                            className="form-control"
                            value={tipo_lentes.tipo_l}
                            id="tipo_l"
                            name="tipo_l"
                            placeholder="tipo_l"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            PD:{' '}
                          </label>
                          <input
                            className="form-control"
                            value={tipo_lentes.pd}
                            id="pd"
                            name="pd"
                            placeholder="pd"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            DNP
                          </label>
                          <input
                            className="form-control"
                            value={tipo_lentes.dnp}
                            id="dnp"
                            name="dnp"
                            placeholder="dnp"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="tratamientos">
                            ALTURA
                          </label>
                          <input
                            className="form-control"
                            value={tipo_lentes.alt}
                            id="alt"
                            name="alt"
                            placeholder="alt"
                            readOnly
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
                                    value={lentes_contacto.poder_od}
                                    name="poder_od"
                                    placeholder="poder_od"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.poder_oi}
                                    name="poder_oi"
                                    placeholder="poder_oi"
                                    readOnly
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
                                    value={lentes_contacto.cb_od}
                                    name="cb_od"
                                    placeholder="cb_od"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.cb_oi}
                                    name="cb_oi"
                                    placeholder="cb_oi"
                                    readOnly
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
                                    value={lentes_contacto.dia_od}
                                    name="dia_od"
                                    placeholder="dia_od"
                                    readOnly
                                    type="text"
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    value={lentes_contacto.dia_oi}
                                    name="dia_oi"
                                    placeholder="dia_oi"
                                    readOnly
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
                            value={lentes_contacto.lente_marca}
                            id="inputAddress"
                            name="lente_marca"
                            placeholder="Marca"
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            Tipo:
                          </label>
                          <input
                            className="form-control"
                            value={lentes_contacto.lente_tipo}
                            id="inputAddress"
                            name="lente_tipo"
                            placeholder="Tipo"
                            readOnly
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
                            value={RefraccionGeneral.conducta_seguir}
                            id="textarea"
                            maxLength="800"
                            name="conducta_seguir"
                            placeholder="Esta área tiene un limite de 800 caracteres."
                            readOnly
                            rows="5"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="inputAddress">
                            Fecha de proxima cita
                          </label>
                          <input
                            className="form-control"
                            value={
                              RefraccionGeneral
                                ? formatToDateDisplay(RefraccionGeneral.fecha_proxima_consulta)
                                : ''
                            }
                            disabled
                            name="fecha_proxima_consulta"
                            type="text"
                          />
                        </div>
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

export default VerRefraccionGeneral
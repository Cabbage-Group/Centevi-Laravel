import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchVerNeonatos } from '../../redux/features/pacientes/VerNeonatosSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatToDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const VerNeonatos = () => {

  const dispatch = useDispatch();
  const { id, id_consulta } = useParams();

  const { pacientes } = useSelector((state) => state.pacientes);
  const { sucursales } = useSelector((state) => state.sucursales);
  const { data: neonatos } = useSelector((state) => state.verNeonatos);

  let agudeza_visual = {};
  let lensometria = {};
  let lensometria_extra = {};
  let sa_pp = {};
  let pruebas_extras = {};
  let refraccion = {};
  let editado = {};
  try {
    agudeza_visual = neonatos && neonatos.agudeza_visual ? JSON.parse(neonatos.agudeza_visual) : {};
    lensometria = neonatos && neonatos.lensometria ? JSON.parse(neonatos.lensometria) : {};
    lensometria_extra = neonatos && neonatos.lensometria_extra ? JSON.parse(neonatos.lensometria_extra) : {};
    sa_pp = neonatos && neonatos.sa_pp ? JSON.parse(neonatos.sa_pp) : {};
    pruebas_extras = neonatos && neonatos.pruebas_extras ? JSON.parse(neonatos.pruebas_extras) : {};
    refraccion = neonatos && neonatos.refraccion ? JSON.parse(neonatos.refraccion) : {};
    editado = neonatos && neonatos.editado ? JSON.parse(neonatos.editado) : {};
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
        pdf.save('neonatos-form.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  useEffect(() => {
    if (id && id_consulta) {
      dispatch(fetchVerNeonatos({ id, id_consulta }));
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
              role="form"
            >
              <div className="widget-one">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={handlePrint}
                  id="imprimir"
                >
                  <i className="fa fa-print m-r-5" />
                  IMPRIMIR
                </button>
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
                              Optometría Neonatos
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
                              {neonatos ? neonatos.doctor?.trim() : ''}
                            </b>
                          </li>
                        </ol>
                      </nav>
                      {/* <nav
                        aria-label="breadcrumb"
                        className="breadcrumb-one"
                        id="editado"
                      >
                        <ol
                          className="breadcrumb"
                          style={{
                            backgroundColor: '#F7DC6F !important'
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
                      </nav> */}
                      <div className="widget-content widget-content-area">

                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="inputEmail4">
                              Paciente:
                            </label>
                            <select
                              className="form-control"
                              name="pacientes"
                              readOnly
                            >
                              <option>
                                {pacientes.filter(paciente => paciente.id_paciente === neonatos.paciente).map((paciente) => (
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
                            <label htmlFor="inputSucursal">
                              Sucursal
                            </label>
                            <select
                              className="form-control"
                              id="sucursal"
                              name="sucursal"
                              readOnly
                            >
                              <option>
                                {sucursales.filter(sucursal => sucursal.id_sucursal === neonatos.sucursal).map((sucursal) => (
                                  <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                    {sucursal.nombre}
                                  </option>
                                ))}
                              </option>

                            </select>
                          </div>
                          <div className="form-group col-md-3">
                            <label onClick={() => console.log(neonatos)} htmlFor="edad">
                              Edad
                            </label>
                            <input
                              className="form-control"
                              defaultValue={neonatos.edad}
                              id="edad"
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
                              value={neonatos ? formatToDateDisplay(neonatos.fecha_atencion) : ''}
                              disabled
                              id="inputAddress"
                              name="fecha_atencion"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label
                              disabled
                              htmlFor="inputAddress"
                            >
                              Motivo de Consulta:
                            </label>
                            <textarea
                              className="form-control textarea"
                              value={neonatos ? neonatos.m_c : ''}
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
                              Antecedentes Oculares
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.a_o : ''}
                              disabled
                              name="a_o"
                              placeholder="A/O"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputAddress2">
                              Antecedentes Personales
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.a_p : ''}
                              disabled
                              name="a_p"
                              placeholder="A/P"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputAddress2">
                              Antecedentes Familiares
                            </label>
                            <input
                              className="form-control"
                              defaultValue="  PADRES MIOP"
                              disabled
                              id="inputAddress2"
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
                              value={neonatos ? neonatos.medicamentos : ''}
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
                              value={neonatos ? neonatos.tratamientos : ''}
                              disabled
                              name="tratamientos"
                              placeholder="Tratamientos"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-12">
                            <label htmlFor="tratamientos">
                              Desarrollo del infante
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.desarrollo : ''}
                              disabled
                              name="desarrollo_infante"
                              placeholder="Desarrollo del infante"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <label htmlFor="tratamientos">
                              Nacimiento
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.nacimiento : ''}
                              disabled
                              name="nacimiento"
                              placeholder="Nacimiento"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="tratamientos">
                              Parto
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.parto : ''}
                              disabled
                              name="parto"
                              placeholder="Parto"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="tratamientos">
                              Gateo
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.gateo : ''}
                              disabled
                              name="gateo"
                              placeholder="Gateo"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="tratamientos">
                              Lenguaje
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.lenguaje : ''}
                              disabled
                              name="lenguaje"
                              placeholder="Lenguaje"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-4">
                            <label htmlFor="tratamientos">
                              Complicaciones Prenatales
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.complicaciones : ''}
                              disabled
                              name="complicaciones"
                              placeholder="Complicaciones Prenatales"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="tratamientos">
                              Perinatales
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.perinatales : ''}
                              disabled
                              name="perinatales"
                              placeholder="Perinatales"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="tratamientos">
                              Postnatales
                            </label>
                            <input
                              className="form-control"
                              value={neonatos ? neonatos.postnatales : ''}
                              disabled
                              name="postnatales"
                              placeholder="Postnatales"
                              type="text"
                            />
                          </div>
                        </div>
                        <h6 className="second_page">
                          AGUDEZA VISUAL:
                        </h6>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <label htmlFor="tambor">
                              Tambor Optocinético AO{' '}
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.tambor}
                              disabled
                              name="tambor"
                              placeholder="Tambor Optocinético"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="fija">
                              Fija
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.fija}
                              disabled
                              name="fija"
                              placeholder="Fija"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="sigue">
                              Sigue
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.sigue}
                              disabled
                              name="sigue"
                              placeholder="Sigue"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label htmlFor="mantiene">
                              Mantiene
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.mantiene}
                              disabled
                              name="mantiene"
                              placeholder="Mantiene"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-4">
                            <label htmlFor="test">
                              Test mirada prefencial OD{' '}
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.test}
                              disabled
                              name="test"
                              placeholder="Test"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="oi">
                              OI
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.a_oi}
                              disabled
                              name="a_oi"
                              placeholder="OI"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="ao">
                              AO
                            </label>
                            <input
                              className="form-control"
                              value={agudeza_visual.a_ao}
                              disabled
                              name="a_ao"
                              placeholder="AO"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <h5
                            onClick={() => {
                              console.log(lensometria);
                            }}
                          >
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
                                      value={lensometria.esfera_od}
                                      disabled
                                      name="esfera_od"
                                      placeholder="esfera_od"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.cilindro_od}
                                      disabled
                                      name="cilindro_od"
                                      placeholder="cilindro_od"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.eje_od}
                                      disabled
                                      name="eje_od"
                                      placeholder="eje_od"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.p_base_od}
                                      disabled
                                      name="p_base_od"
                                      placeholder="p_base_od"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.add_od}
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
                                      value={lensometria.esfera_oi}
                                      disabled
                                      name="esfera_oi"
                                      placeholder="esfera_oi"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.cilindro_oi}
                                      disabled
                                      name="cilindro_oi"
                                      placeholder="cilindro_oi"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.eje_oi}
                                      disabled
                                      name="eje_oi"
                                      placeholder="eje_oi"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.p_base_oi}
                                      disabled
                                      name="p_base_oi"
                                      placeholder="p_base_oi"
                                      type="text"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      value={lensometria.add_oi}
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
                              value={lensometria_extra.len_tipo_lentes}
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
                              value={lensometria_extra.len_filtros}
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
                              value={lensometria_extra.len_tiempo}
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
                              value={lensometria_extra.len_tipo_aro}
                              disabled
                              name="len_tipo_aro"
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
                              disabled
                              name="sa_od"
                              placeholder="SA_OD"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.pp_od}
                              disabled
                              name="pp_od"
                              placeholder="PP_OD"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.sa_oi}
                              disabled
                              name="sa_oi"
                              placeholder="SA_OI"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <input
                              className="form-control"
                              value={sa_pp.pp_oi}
                              disabled
                              name="pp_oi"
                              placeholder="PP_OI"
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
                            value={pruebas_extras.hirschberg}
                            disabled
                            name="hirschberg"
                            placeholder="Hirschberg"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="tratamientos">
                            Krismsky
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.krismsky}
                            disabled
                            name="krismsky"
                            placeholder="Krismsky"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-12">
                          <label
                            htmlFor="inputAddress"
                            onClick={() => {
                              console.log(neonatos);
                            }}
                          >
                            VERSIONES:
                          </label>
                          <textarea
                            className="form-control textarea"
                            value={neonatos.plan_versiones}
                            disabled
                            maxLength="225"
                            name="plan_versiones"
                            placeholder="Esta área tiene un limite de 225* caracteres."
                            rows="2"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            CT: VP:
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.ct_vp}
                            disabled
                            name="ct_vp"
                            placeholder="VP"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            Reflejo Cocleopalpebral
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.ct_reflejo}
                            disabled
                            name="ct_reflejo"
                            placeholder="Reflejo Cocleopalpebral"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            Ducciones:OD
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.ducciones_od}
                            disabled
                            name="ducciones_od"
                            placeholder="OD"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            OI
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.ducciones_oi}
                            disabled
                            name="ducciones_oi"
                            placeholder="OI"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-8">
                          <label htmlFor="tratamientos">
                            Posición Compensatoria
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.posicion_compensatoria}
                            disabled
                            name="posicion_compensatoria"
                            placeholder="Posicion Compensatoria"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4 third_page">
                        <div className="form-group col-md-3">
                          <label
                            className="reflejos"
                            htmlFor="tratamientos"
                          >
                            Reflejos Pupilares: Fotomotor/OD
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.fotomotor_od}
                            disabled
                            name="fotomotor_od"
                            placeholder="Fotomotor/OD"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            Consensual
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.consensual}
                            disabled
                            name="consensual"
                            placeholder="Consensual"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            Fotomotor:OI
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.fotomotor_oi}
                            disabled
                            name="fotomotor_oi"
                            placeholder="Fotomotor OI"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="tratamientos">
                            Consensual
                          </label>
                          <input
                            className="form-control"
                            value={pruebas_extras.fotomotor_consensual}
                            disabled
                            name="fotomotor_consensual"
                            placeholder="Fotomotor Consensual"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="inputAddress">
                            Reflejo retinoscopico OD:
                          </label>
                          <input
                            className="form-control"
                            value={refraccion.reflejo_r_od}
                            disabled
                            name="reflejo_r_od"
                            placeholder="Reflejo retinoscopico OD"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            OI:
                          </label>
                          <input
                            className="form-control"
                            value={refraccion.reflejo_r_oi}
                            disabled
                            name="reflejo_r_oi"
                            placeholder="OI"
                            type="text"
                          />
                        </div>
                        <div className="form-group col-md-3">
                          <label htmlFor="inputAddress">
                            AO:
                          </label>
                          <input
                            className="form-control"
                            value={refraccion.reflejo_r_ao}
                            disabled
                            name="reflejo_r_ao"
                            placeholder="AO"
                            type="text"
                          />
                        </div>
                      </div>
                      <h5>
                        RECETA FINAL
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
                                  value={refraccion.esfera_od_f}
                                  disabled
                                  name="esfera_od_f"
                                  placeholder="esfera_od"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.cilindro_od_f}
                                  disabled
                                  name="cilindro_od_f"
                                  placeholder="cilindro_od"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.eje_od_f}
                                  disabled
                                  name="eje_od_f"
                                  placeholder="eje_od"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.p_base_od_f}
                                  disabled
                                  name="p_base_od_f"
                                  placeholder="p_base_od"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.add_od_f}
                                  disabled
                                  name="add_od_f"
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
                                  value={refraccion.esfera_oi_f}
                                  disabled
                                  name="esfera_oi_f"
                                  placeholder="esfera_oi"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.cilindro_oi_f}
                                  disabled
                                  name="cilindro_oi_f"
                                  placeholder="cilindro_oi"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.eje_oi_f}
                                  disabled
                                  name="eje_oi_f"
                                  placeholder="eje_oi"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.p_base_oi_f}
                                  disabled
                                  name="p_base_oi_f"
                                  placeholder="p_base_oi"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  value={refraccion.add_oi_f}
                                  disabled
                                  name="add_oi_f"
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
                      <div className="form-group col-md-6">
                        <label htmlFor="inputAddress">
                          Tipo Lentes
                        </label>
                        <input
                          className="form-control"
                          value={refraccion.refraccion_tipo_lentes}
                          disabled
                          name="refraccion_tipo_lentes"
                          placeholder="Tipo Lentes"
                          type="text"
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <label htmlFor="inputAddress">
                          PD:
                        </label>
                        <input
                          className="form-control"
                          value={refraccion.refraccion_pd}
                          disabled
                          name="refraccion_pd"
                          placeholder="PD"
                          type="text"
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <label htmlFor="inputAddress">
                          USO:
                        </label>
                        <input
                          className="form-control"
                          value={refraccion.refraccion_uso}
                          disabled
                          name="refraccion_uso"
                          placeholder="USO"
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
                          value={neonatos ? neonatos.conducta_seguir : ''}
                          disabled
                          maxLength="225"
                          name="conducta_seguir"
                          placeholder="Esta área tiene un limite de 225 caracteres."
                          rows="2"
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label onClick={() => console.log(neonatos)} htmlFor="inputAddress">
                          Fecha de proxima cita
                        </label>
                        <input
                          className="form-control"
                          value={
                            neonatos
                              ? formatToDateDisplay(neonatos.fecha_proxima_consulta)
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerNeonatos
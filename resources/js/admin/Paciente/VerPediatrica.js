import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchVerPediatrica } from '../../redux/features/pacientes/VerPediatricaSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatToDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

const VerPediatrica = () => {

    const dispatch = useDispatch();
    const { id, id_consulta } = useParams();
    console.log(id, 'y', id_consulta)

    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: pediatrica } = useSelector((state) => state.verPediatrica);

    let av_sc = {};
    let av_cc = {};
    let lensometria = {};
    let lensometria_extra = {};
    let sa_pp = {};
    let refraccion = {};
    let lentes_contacto = {};
    let visuscopia = {};
    let visuscopia_extra = {};
    let pruebas = {};
    let pruebas_extra = {};
    let editado = {};
    try {
        av_sc = pediatrica && pediatrica.av_sc ? JSON.parse(pediatrica.av_sc) : {};
        av_cc = pediatrica && pediatrica.av_cc ? JSON.parse(pediatrica.av_cc) : {};
        lensometria = pediatrica && pediatrica.lensometria ? JSON.parse(pediatrica.lensometria) : {};
        lensometria_extra = pediatrica && pediatrica.lensometria_extra ? JSON.parse(pediatrica.lensometria_extra) : {};
        sa_pp = pediatrica && pediatrica.sa_pp ? JSON.parse(pediatrica.sa_pp) : {};
        visuscopia = pediatrica && pediatrica.visuscopia ? JSON.parse(pediatrica.visuscopia) : {};
        visuscopia_extra = pediatrica && pediatrica.visuscopia_extra ? JSON.parse(pediatrica.visuscopia_extra) : {};
        refraccion = pediatrica && pediatrica.refraccion ? JSON.parse(pediatrica.refraccion) : {};
        lentes_contacto = pediatrica && pediatrica.lentes_contacto ? JSON.parse(pediatrica.lentes_contacto) : {};
        pruebas = pediatrica && pediatrica.pruebas ? JSON.parse(pediatrica.pruebas) : {};
        pruebas_extra = pediatrica && pediatrica.pruebas_extra ? JSON.parse(pediatrica.pruebas_extra) : {};
        editado = pediatrica && pediatrica.editado ? JSON.parse(pediatrica.editado) : {};
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
                pdf.save('pediatrica-form.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerPediatrica({ id, id_consulta }));
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
                                                            Optometría Pediatrica
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
                                                            {pediatrica ? pediatrica.doctor?.trim() : ''}
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
                                                                {pacientes.filter(paciente => paciente.id_paciente === pediatrica.paciente).map((paciente) => (
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
                                                                {sucursales.filter(sucursal => sucursal.id_sucursal === pediatrica.sucursal).map((sucursal) => (
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
                                                            name="edad"
                                                            value={pediatrica.edad}
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
                                                            value={pediatrica ? formatToDateDisplay(pediatrica.fecha_atencion) : ''}
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
                                                            defaultValue="endoforia basica sin corrección , de 10 y 12 prismas. No se habian dado cuenta, refeido del dr Carlos Diaz"
                                                            disabled
                                                            id="textarea"
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
                                                            defaultValue="toxoplasmosi"
                                                            disabled
                                                            id="lugarNacimiento"
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
                                                            defaultValue=""
                                                            disabled
                                                            id="inputAddress2"
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
                                                            defaultValue="mama con len"
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
                                                            defaultValue="ninguno"
                                                            disabled
                                                            id="medicamentos"
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
                                                            defaultValue=""
                                                            disabled
                                                            id="tratamientos"
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
                                                            defaultValue="trillizos, premarturo"
                                                            disabled
                                                            id="tratamientos"
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
                                                            defaultValue="prematuro"
                                                            disabled
                                                            id="nacimiento"
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
                                                            defaultValue=""
                                                            disabled
                                                            id="parto"
                                                            name="parto"
                                                            placeholder="Parto"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Incubadora
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            disabled
                                                            id="incubadora"
                                                            name="incubadora"
                                                            placeholder="Incubadora"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor="tratamientos">
                                                            Tiempo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            disabled
                                                            id="tiempo"
                                                            name="tiempo"
                                                            placeholder="Tiempo"
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
                                                                                defaultValue="20/30"
                                                                                disabled
                                                                                name="av/sc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue="20/100"
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
                                                                                defaultValue=""
                                                                                disabled
                                                                                name="av/sc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
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
                                                                                defaultValue=""
                                                                                disabled
                                                                                name="av/sc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
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
                                                                                defaultValue="20/20"
                                                                                disabled
                                                                                name="av/cc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue="20/40"
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
                                                                                defaultValue=""
                                                                                disabled
                                                                                name="av/cc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
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
                                                                                defaultValue=""
                                                                                disabled
                                                                                name="av/cc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                defaultValue=""
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
                                                <div className="form-group">
                                                    <h5>
                                                        LENSOMETRIA
                                                    </h5>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-center">
                                                                        RX EN USO
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
                                                                        OD
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="esfera_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="cilindro_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="eje_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="p_base_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="add_od"
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
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="esfera_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="cilindro_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="eje_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="p_base_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue=""
                                                                            disabled
                                                                            name="add_oi"
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
                                                            defaultValue=""
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
                                                            defaultValue=""
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
                                                            defaultValue=""
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
                                                            defaultValue=""
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
                                                            defaultValue="normal"
                                                            disabled
                                                            name="sa_od"
                                                            placeholder="OD"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
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
                                                            defaultValue="normal"
                                                            disabled
                                                            name="sa_oi"
                                                            placeholder="OI"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            defaultValue="normal"
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
                                                        defaultValue="<br /><b>Notice</b>:  Undefined index: viscopia_od in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\ver-optometria-pediatrica.php</b> on line <b>491</b><br />"
                                                        disabled
                                                        id="v_od"
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
                                                        defaultValue="<br /><b>Notice</b>:  Undefined index: viscopia_oi in <b>D:\Trabajos\Cabbage\Centevi\vistas\modulos\ver-optometria-pediatrica.php</b> on line <b>495</b><br />"
                                                        disabled
                                                        id="v_oi"
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
                                                        defaultValue="normal"
                                                        disabled
                                                        id="hirschberg"
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
                                                        defaultValue=""
                                                        disabled
                                                        id="krismsky"
                                                        name="krismsky"
                                                        placeholder="krismsky"
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
                                                        defaultValue="normal"
                                                        disabled
                                                        id="textarea"
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
                                                        defaultValue="endoforia "
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
                                                        defaultValue="endoforia igual cerca y lejos"
                                                        disabled
                                                        id="VP"
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
                                                        defaultValue=""
                                                        disabled
                                                        id="maddox"
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
                                                        defaultValue="normal"
                                                        disabled
                                                        id="ao"
                                                        name="seguimiento_ao"
                                                        placeholder="ao"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Sacádicos(AO):{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="normal"
                                                        disabled
                                                        id="ao"
                                                        name="sacadicos_ao"
                                                        placeholder="ao"
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
                                                        defaultValue=""
                                                        disabled
                                                        id="or"
                                                        name="ppc_or"
                                                        placeholder="or"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        L:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="L"
                                                        name="ppc_l"
                                                        placeholder="L"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="tratamientos">
                                                        FR:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="FR"
                                                        name="ppc_fr"
                                                        placeholder="FR"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tratamientos">
                                                        Posicion compensatoria:{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="Posicion"
                                                        name="ppc_posicion"
                                                        placeholder="Posicion compensatoria"
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
                                                                    defaultValue="4 luces y a veces suprimia"
                                                                    disabled
                                                                    name="vl_luces"
                                                                    placeholder="vl_luces"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
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
                                                                    defaultValue=""
                                                                    disabled
                                                                    name="vl_bg"
                                                                    placeholder="vl_bg"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
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
                                                        defaultValue="--"
                                                        disabled
                                                        id="inputAddress"
                                                        name="randot"
                                                        placeholder="Randot"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="inputAddress">
                                                        Lang:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
                                                        name="lang"
                                                        placeholder="Lang"
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
                                                        defaultValue="normal"
                                                        disabled
                                                        id="inputAddress"
                                                        name="vision_color"
                                                        placeholder="Vision de Color"
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
                                                                        defaultValue="+1.25"
                                                                        disabled
                                                                        name="esfera_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="-1.25"
                                                                        disabled
                                                                        name="cilindro_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="180"
                                                                        disabled
                                                                        name="eje_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="2 base temporal"
                                                                        disabled
                                                                        name="p_base_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        disabled
                                                                        name="add_od_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
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
                                                                        defaultValue="+2.50"
                                                                        disabled
                                                                        name="esfera_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="-2.25"
                                                                        disabled
                                                                        name="cilindro_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="180"
                                                                        disabled
                                                                        name="eje_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue="2base temporal"
                                                                        disabled
                                                                        name="p_base_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
                                                                        disabled
                                                                        name="add_oi_f"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
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
                                                        Marca
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue="monofocal con fotocromatico"
                                                        disabled
                                                        id="inputAddress"
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
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
                                                        name="lente_pd_1"
                                                        placeholder="Tipo"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        DPN:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
                                                        name="lente_dpn_1"
                                                        placeholder="Tipo"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        ALTURA:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
                                                        name="lente_altura_1"
                                                        placeholder="Tipo"
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
                                                                        defaultValue=""
                                                                        disabled
                                                                        name="poder_od"
                                                                        placeholder="poder_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
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
                                                                        defaultValue=""
                                                                        disabled
                                                                        name="cb_od"
                                                                        placeholder="cb_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
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
                                                                        defaultValue=""
                                                                        disabled
                                                                        name="dia_od"
                                                                        placeholder="dia_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        defaultValue=""
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
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
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
                                                        defaultValue=""
                                                        disabled
                                                        id="inputAddress"
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
                                                        defaultValue="contorl 1 mes"
                                                        disabled
                                                        id="textarea"
                                                        maxLength="225"
                                                        name="conducta_seguir"
                                                        placeholder="Esta área tiene un limite de 225 caracteres."
                                                        rows="2"
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

export default VerPediatrica
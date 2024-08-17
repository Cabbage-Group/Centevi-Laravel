import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchVerBajaVision } from '../../redux/features/pacientes/VerBajaVisionSlice.js';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice.js';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatToDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

const VerBajaVision = () => {

    const dispatch = useDispatch();
    const { id, id_consulta } = useParams();
    console.log(id, 'y', id_consulta)

    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const { data: bajaVision } = useSelector((state) => state.verBajaVision);

    let av_sc = {};
    let av_cc = {};
    let lensometria = {};
    let lensometria_extra = {};
    let cv_so = {};
    let amsler = {};
    let sensibilidad_c = {};
    let refraccion = {};
    let pruebas = {};
    let editado = {};
    try {
        av_sc = bajaVision && bajaVision.av_sc ? JSON.parse(bajaVision.av_sc) : {};
        av_cc = bajaVision && bajaVision.av_cc ? JSON.parse(bajaVision.av_cc) : {};
        lensometria = bajaVision && bajaVision.lensometria ? JSON.parse(bajaVision.lensometria) : {};
        lensometria_extra = bajaVision && bajaVision.lensometria_extra ? JSON.parse(bajaVision.lensometria_extra) : {};
        cv_so = bajaVision && bajaVision.cv_so ? JSON.parse(bajaVision.cv_so) : {};
        amsler = bajaVision && bajaVision.amsler ? JSON.parse(bajaVision.amsler) : {};
        sensibilidad_c = bajaVision && bajaVision.sensibilidad_c ? JSON.parse(bajaVision.sensibilidad_c) : {};
        refraccion = bajaVision && bajaVision.refraccion ? JSON.parse(bajaVision.refraccion) : {};
        pruebas = bajaVision && bajaVision.pruebas ? JSON.parse(bajaVision.pruebas) : {};
        editado = bajaVision && bajaVision.editado ? JSON.parse(bajaVision.editado) : {};
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
                pdf.save('bajaVision-form.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };

    useEffect(() => {
        if (id && id_consulta) {
            dispatch(fetchVerBajaVision({ id, id_consulta }));
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
                                                            Baja Vision
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
                                                            {bajaVision ? bajaVision.doctor?.trim() : ''}
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
                                            </nav>
                                            <div className="widget-content widget-content-area">
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="Pacientes">
                                                            Paciente
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            value={bajaVision ? bajaVision.a_f : ''}
                                                            name="paciente"
                                                            disabled
                                                        >
                                                            <option>
                                                                {pacientes.filter(paciente => paciente.id_paciente === bajaVision.paciente).map((paciente) => (
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
                                                            value={bajaVision ? bajaVision.a_f : ''}
                                                            id="sucursal"
                                                            name="sucursal"
                                                            readOnly
                                                        >
                                                            <option value="3">
                                                                {sucursales.filter(sucursal => sucursal.id_sucursal === bajaVision.sucursal).map((sucursal) => (
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
                                                            value={bajaVision ? formatToDateDisplay(bajaVision.fecha_atencion) : ''}
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
                                                            value={bajaVision ? bajaVision.fecha_atencion : ''}
                                                            disabled
                                                            name="fecha_atencion"
                                                            type="date"
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
                                                            disabled
                                                            value={bajaVision ? bajaVision.m_c : ''}
                                                            maxLength="225"
                                                            name="m_c"
                                                            placeholder="Esta área tiene un limite de 225 caracteres."
                                                            rows="2"
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
                                                            disabled
                                                            value={bajaVision ? bajaVision.a_o : ''}
                                                            name="a_o"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="a_P">
                                                            Antecedentes personales
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            disabled
                                                            value={bajaVision ? bajaVision.a_p : ''}
                                                            name="a_p"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="a_f">
                                                            Antecedentes familiares
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            disabled
                                                            value={bajaVision ? bajaVision.a_f : ''}
                                                            name="a_f"
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
                                                            value={bajaVision ? bajaVision.medicamentos : ''}
                                                            disabled
                                                            name="medicamentos"
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
                                                            value={bajaVision ? bajaVision.tratamientos : ''}
                                                            disabled
                                                            name="tratamientos"
                                                            type="text"
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
                                                            value={bajaVision ? bajaVision.dx_oft_princ : ''}
                                                            disabled
                                                            name="dx_oft_princ"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="objetivos">
                                                            Objetivos de paciente
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            value={bajaVision ? bajaVision.objetivos : ''}
                                                            disabled
                                                            name="objetivos"
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
                                                                                disabled
                                                                                name="av/sc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_sc.av_sc_oi_vl}
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
                                                                                value={av_sc.av_sc_od_vp}
                                                                                disabled
                                                                                name="av/sc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_sc.av_sc_oi_vp}
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
                                                                                value={av_sc.av_sc_od_ph}
                                                                                disabled
                                                                                name="av/sc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_sc.av_sc_oi_ph}
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
                                                                                value={av_cc.av_cc_od_vl}
                                                                                disabled
                                                                                name="av/cc_od_vl"
                                                                                placeholder="od_vl"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_cc.av_cc_oi_vl}
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
                                                                                value={av_cc.av_cc_od_vp}
                                                                                disabled
                                                                                name="av/cc_od_vp"
                                                                                placeholder="od_vp"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_cc.av_cc_oi_vp}
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
                                                                                value={av_cc.av_cc_od_ph}
                                                                                disabled
                                                                                name="av/cc_od_ph"
                                                                                placeholder="od_ph"
                                                                                type="text"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control"
                                                                                value={av_cc.av_cc_oi_ph}
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
                                                            value={cv_so.cv_od}
                                                            disabled
                                                            name="cv_od"
                                                            placeholder="OD"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={cv_so.so_od}
                                                            disabled
                                                            name="so_od"
                                                            placeholder="OD"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mb-4">
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={cv_so.cv_oi}
                                                            disabled
                                                            name="cv_oi"
                                                            placeholder="OI"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <input
                                                            className="form-control"
                                                            value={cv_so.so_oi}
                                                            disabled
                                                            name="so_oi"
                                                            placeholder="OI"
                                                            type="text"
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
                                                                value={amsler.amsler_od}
                                                                disabled
                                                                name="amsler_od"
                                                                placeholder="OD"
                                                                type="text"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <input
                                                                className="form-control"
                                                                value={amsler.amsler_oi}
                                                                disabled
                                                                name="amsler_oi"
                                                                placeholder="OI"
                                                                type="text"
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
                                                                value={amsler.sensibilidad_od}
                                                                disabled
                                                                name="sensibilidad_od"
                                                                placeholder="OD"
                                                                type="text"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <input
                                                                className="form-control"
                                                                value={amsler.sensibilidad_oi}
                                                                disabled
                                                                name="sensibilidad_oi"
                                                                placeholder="OI"
                                                                type="text"
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
                                                        disabled
                                                        value={amsler.plan_versiones}
                                                        maxLength="225"
                                                        name="plan_versiones"
                                                        placeholder="Esta área tiene un limite de 225 caracteres."
                                                        rows="2"
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
                                                                    value={pruebas.vl_luces}
                                                                    disabled
                                                                    name="vl_luces"
                                                                    placeholder="vl_luces"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    value={pruebas.vp_luces}
                                                                    disabled
                                                                    name="vp_luces"
                                                                    placeholder="vp_luces"
                                                                    type="text"
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
                                                        value={pruebas.vision_color}
                                                        disabled
                                                        name="vision_color"
                                                        placeholder="Visión de Color"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress">
                                                        Ojo Derecho
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={pruebas.prueba_od}
                                                        disabled
                                                        name="prueba_od"
                                                        placeholder="OD"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="prueba_od-group col-md-6">
                                                    <label htmlFor="inputAddress">
                                                        Ojo Izquierdo
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={pruebas.prueba_oi}
                                                        disabled
                                                        name="prueba_oi"
                                                        placeholder="OI"
                                                        type="text"
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
                                                                        value={refraccion.agz_od_f}
                                                                        disabled
                                                                        name="agz_od_f"
                                                                        placeholder="agz_od"
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
                                                                        defaultValue="△"
                                                                        disabled
                                                                        name="p_base_oi_f"
                                                                        placeholder="p_base_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.agz_oi_f}
                                                                        disabled
                                                                        name="agz_oi_f"
                                                                        placeholder="agz_oi"
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
                                                        value={refraccion.lentes_marca_1}
                                                        disabled
                                                        name="lentes_marca_1"
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
                                                        value={refraccion.lentes_pd_1}
                                                        disabled
                                                        name="lentes_pd_1"
                                                        placeholder="Tipo"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        PD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={refraccion.lentes_dpn_1}
                                                        disabled
                                                        name="lentes_dpn_1"
                                                        placeholder="Tipo"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        Altura:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={refraccion.lentes_altura_1}
                                                        disabled
                                                        name="lentes_altura_1"
                                                        placeholder="Tipo"
                                                        type="text"
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
                                                                        value={refraccion.esfera_od_fc}
                                                                        disabled
                                                                        name="esfera_od_fc"
                                                                        placeholder="esfera_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.cilindro_od_fc}
                                                                        disabled
                                                                        name="cilindro_od_fc"
                                                                        placeholder="cilindro_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.eje_od_fc}
                                                                        disabled
                                                                        name="eje_od_fc"
                                                                        placeholder="eje_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.p_base_od_fc}
                                                                        disabled
                                                                        name="p_base_od_fc"
                                                                        placeholder="p_base_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.agz_od_fc}
                                                                        disabled
                                                                        name="agz_od_fc"
                                                                        placeholder="agz_od"
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
                                                                        value={refraccion.esfera_oi_fc}
                                                                        disabled
                                                                        name="esfera_oi_fc"
                                                                        placeholder="esfera_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.cilindro_oi_fc}
                                                                        disabled
                                                                        name="cilindro_oi_fc"
                                                                        placeholder="cilindro_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.eje_oi_fc}
                                                                        disabled
                                                                        name="eje_oi_fc"
                                                                        placeholder="eje_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.p_base_oi_fc}
                                                                        defaultValue="△"
                                                                        disabled
                                                                        name="p_base_oi_fc"
                                                                        placeholder="p_base_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        value={refraccion.agz_oi_fc}
                                                                        disabled
                                                                        name="agz_oi_fc"
                                                                        placeholder="agz_oi"
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
                                                        value={refraccion.lentes_marca_2}
                                                        disabled
                                                        id="inputAddress"
                                                        name="lentes_marca_2"
                                                        placeholder="Tipo Lentes"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        PD:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={refraccion.lentes_pd_2}
                                                        disabled
                                                        name="lentes_pd_2"
                                                        placeholder="PD"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        DNP:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={refraccion.lentes_dnp_2}
                                                        disabled
                                                        name="lentes_dnp_2"
                                                        placeholder="USO"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputAddress">
                                                        ALTURA:
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        value={refraccion.lentes_altura_2}
                                                        disabled
                                                        name="lentes_altura_2"
                                                        placeholder="USO"
                                                        type="text"
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
                                                        value={bajaVision ? bajaVision.ayudas_opticas : ''}
                                                        disabled
                                                        maxLength="225"
                                                        name="ayudas_opticas"
                                                        placeholder="Esta área tiene un limite de 225 caracteres."
                                                        rows="2"
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
                                                        disabled
                                                        value={bajaVision ? bajaVision.ayudas_no_opticas : ''}
                                                        maxLength="225"
                                                        name="ayudas_no_opticas"
                                                        placeholder="Esta área tiene un limite de 225 caracteres."
                                                        rows="2"
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
                                                        disabled
                                                        value={bajaVision ? bajaVision.plan_rehabilitacion : ''}
                                                        maxLength="225"
                                                        name="plan_rehabilitacion"
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

export default VerBajaVision
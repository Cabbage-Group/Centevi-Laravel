import React from 'react'

const CrearReceta = () => {
    return (
        <div className="admin-data-content" data-select2-id="15">
            <div className="row layout-top-spacing">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12 layout-spacing">
                    <div className="widget-content-area br-4">
                        <div className="widget-one">
                            <div className="row">
                                <div
                                    className="col-lg-12 layout-spacing"
                                    id="flFormsGrid"
                                >
                                    <div className="statbox widget box box-shadow">
                                        <div className="widget-header">
                                            <form
                                                method="post"
                                                role="form"
                                            >
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <img
                                                            alt="logo"
                                                            className="navbar-logo"
                                                            src="vistas/img/centevi-logo-in.png"
                                                            style={{
                                                                height: '80px'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h4>
                                                            Fecha de solicitud
                                                        </h4>
                                                        <p className="ml-5">
                                                            <b>
                                                                2024-07-11
                                                            </b>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <h4>
                                                            Nro. Orden
                                                        </h4>
                                                        <input
                                                            className="form-control"
                                                            name="nro_receta"
                                                            placeholder=""
                                                            style={{
                                                                color: 'red',
                                                                fontWeight: 'bold'
                                                            }}
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="widget-content widget-content-area" data-select2-id="8">
                                            <div className="form-row">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputEmail4">
                                                        Paciente
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control form-small select2-hidden-accessible"
                                                        data-select2-id="1"
                                                        name="paciente"
                                                        tabIndex="-1"
                                                    >
                                                        <option
                                                            data-select2-id="6"
                                                            value=""
                                                        >
                                                            {`<--- Seleccione el paciente --->`}
                                                        </option>
                                                        <option value="22" >
                                                            Número Cedula: 8-1219-383 || Nombres: Danna Lucia  Gonzalez Quiros
                                                        </option>
                                                        <option value="23" >
                                                            Número Cedula: 4-882-127 || Nombres: Amber Lizeth Martinez Moreno
                                                        </option>
                                                        <option value="24">
                                                            Número Cedula: 4-867-2164 || Nombres: Jenna Nicolle Martinez Moreno
                                                        </option>
                                                    </select>
                                                    <span
                                                        className="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                        data-select2-id="2"
                                                        dir="ltr"
                                                        style={{
                                                            width: '504.328px'
                                                        }}
                                                    >
                                                        <span className="selection">
                                                                <span
                                                                aria-expanded="true"
                                                                aria-haspopup="true"
                                                                aria-labelledby="select2-paciente-ly-container"
                                                                className="select2-selection select2-selection--single"
                                                                role="combobox"
                                                                tabIndex="0"
                                                            >
                                                                <span
                                                                    aria-readonly="true"
                                                                    className="select2-selection__rendered"
                                                                    id="select2-paciente-ly-container"
                                                                    role="textbox"
                                                                    title="<--- Seleccione el paciente --->"
                                                                >
                                                                    {`<--- Seleccione el paciente --->`}
                                                                </span>
                                                                <span
                                                                    className="select2-selection__arrow"
                                                                    role="presentation"
                                                                >
                                                                    <b role="presentation" />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="dropdown-wrapper"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputEmail4">
                                                        Sucursal
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control form-small select2-hidden-accessible"
                                                        data-select2-id="4"
                                                        name="direccion"
                                                        tabIndex="-1"
                                                    >
                                                        <option
                                                            data-select2-id="6"
                                                            value=""
                                                        >
                                                            {`<--- Seleccione la sucursal --->`}
                                                        </option>
                                                        <option value="CENTEVI Centro Médico San Judas Tadeo">
                                                            CENTEVI Centro Médico San Judas Tadeo
                                                        </option>
                                                        <option value="CENTEVI Consultorios Medicos Paitilla">
                                                            CENTEVI Consultorios Medicos Paitilla
                                                        </option>
                                                        <option value="CENTEVI Sede Chitre">
                                                            CENTEVI Sede Chitre
                                                        </option>
                                                        <option value="CENTEVI El Dorado">
                                                            CENTEVI El Dorado
                                                        </option>
                                                        <option value="CENTEVI Giras Interior del Pais">
                                                            CENTEVI Giras Interior del Pais
                                                        </option>
                                                    </select>
                                                    <span
                                                        className="select2 select2-container mb-4 select2-container--default"
                                                        data-select2-id="5"
                                                        dir="ltr"
                                                        style={{
                                                            width: '504.328px'
                                                        }}
                                                    >
                                                        <span className="selection">
                                                            <span
                                                                aria-expanded="false"
                                                                aria-haspopup="true"
                                                                aria-labelledby="select2-direccion-k0-container"
                                                                className="select2-selection select2-selection--single"
                                                                role="combobox"
                                                                tabIndex="0"
                                                            >
                                                                <span
                                                                    aria-readonly="true"
                                                                    className="select2-selection__rendered"
                                                                    id="select2-direccion-k0-container"
                                                                    role="textbox"
                                                                    title="<--- Seleccione la sucursal --->"
                                                                >
                                                                    {`<--- Seleccione la sucursal --->`}
                                                                </span>
                                                                <span
                                                                    className="select2-selection__arrow"
                                                                    role="presentation"
                                                                >
                                                                    <b role="presentation" />
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="dropdown-wrapper"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputEmail4">
                                                        Cedula
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="cedula"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputEmail4">
                                                        Telefono
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="telefono"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className="form-row"
                                                style={{
                                                    marginTop: '-30px'
                                                }}
                                            >
                                                <div className="form-group col-md-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr
                                                                    style={{
                                                                        backgroundColor: '#4361ee'
                                                                    }}
                                                                >
                                                                    <th
                                                                        className="text-center"
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        RX
                                                                    </th>
                                                                    <th
                                                                        className="text-center"
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        Esfera
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        Cilindro
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        Eje
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        ADD
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        PRISMA
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        DISTANCIA PUPILAR
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            color: 'white!important'
                                                                        }}
                                                                    >
                                                                        ALTURA
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
                                                                            name="esfera_od"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_od"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_od"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="add_od"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="△"
                                                                            name="prisma_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="distancia_od"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="altura_od"
                                                                            placeholder=""
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
                                                                            name="esfera_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="add_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            defaultValue="△"
                                                                            name="prisma_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="distancia_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="altura_oi"
                                                                            placeholder=""
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '-20px'
                                                }}
                                            >
                                                <div className="row p-1">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2">
                                                            TIPO DE LENTE:
                                                        </h6>
                                                    </div>
                                                    <div className="col-md-2 p-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="monofocal"
                                                                    name="tipo_lente_r"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Monofocal
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2 p-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="bifocal"
                                                                    name="tipo_lente_r"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Bifocal
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2 p-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="interview"
                                                                    name="tipo_lente_r"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Interview
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2 p-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="antifatigue"
                                                                    name="tipo_lente_r"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Antifatigue
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2 p-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="progresivo"
                                                                    name="tipo_lente_r"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Progresivo
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '10px',
                                                    padding: '10px 50px'
                                                }}
                                            >
                                                <div className="row p-1">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2">
                                                            TRATAMIENTOS Y FILTROS:
                                                        </h6>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="transitions"
                                                                    name="transitions"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Transitions
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="filtro_a"
                                                                    name="filtro_a"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Filtro de luz azul
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Gris
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="gris_t"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Cafe
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="cafe_t"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row p-2">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2" />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="fotocromatico"
                                                                    name="fotocromatico"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Fotocromático
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="antireflejo"
                                                                    name="antireflejo"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Antireflejo
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="espejado"
                                                                    name="espejado"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Espejado
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="uv"
                                                                    name="uv"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                UV
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row p-2">
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="tinte"
                                                                    name="tinte"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Tinte
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="degradante"
                                                                    name="degradante"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Degradante
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="uniforme"
                                                                    name="uniforme"
                                                                    type="checkbox"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Uniforme
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Color
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="color_t"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Intensidad
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="intensidad_t"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="p-2"
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '10px'
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2">
                                                            MATERIAL:
                                                        </h6>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="cr_39"
                                                                    name="material_1"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                CR-39
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="policarbonato"
                                                                    name="material_1"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                Policarbonato
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row p-2">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2" />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="drivewear"
                                                                    name="material_1"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                DRIVEWEAR
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="polarizado"
                                                                    name="material_1"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                POLARIZADO
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="thin_lite"
                                                                    name="material_2"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                THIN & LITE
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="policolor"
                                                                    name="material_2"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                POLICOLOR
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="n-chk">
                                                            <label className="new-control new-radio radio-classic-primary">
                                                                <input
                                                                    className="new-control-input"
                                                                    defaultValue="super_thin"
                                                                    name="material_2"
                                                                    type="radio"
                                                                />
                                                                <span className="new-control-indicator" />
                                                                {' '}SUPER THIN & LITE
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '10px',
                                                    padding: '10px 50px'
                                                }}
                                            >
                                                <div className="row ">
                                                    <div className="n-chk">
                                                        <label className="new-control new-radio radio-classic-primary">
                                                            <input
                                                                className="new-control-input"
                                                                defaultValue="aro_centevi"
                                                                name="propio"
                                                                type="checkbox"
                                                            />
                                                            <span className="new-control-indicator" />
                                                            <strong>
                                                                Aro Centevi
                                                            </strong>
                                                        </label>
                                                        <label className="new-control new-radio radio-classic-primary">
                                                            <input
                                                                className="new-control-input"
                                                                defaultValue="aro_propio"
                                                                name="propio"
                                                                type="checkbox"
                                                            />
                                                            <span className="new-control-indicator" />
                                                            <strong>
                                                                Aro Propio
                                                            </strong>
                                                        </label>
                                                    </div>
                                                    <div
                                                        className="col-md-3"
                                                        id="div1"
                                                        style={{
                                                            maxWidth: 'fit-content'
                                                        }}
                                                    >
                                                        <div>
                                                            <div className="n-chk">
                                                                <label className="new-control new-radio radio-classic-primary">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="metal_c"
                                                                        name="aro_centevi"
                                                                        type="radio"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Metal Completo
                                                                </label>
                                                                <label className="new-control new-radio radio-classic-primary">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="metal_semi"
                                                                        name="aro_centevi"
                                                                        type="radio"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Metal Semi - Aire
                                                                </label>
                                                                <label className="new-control new-radio radio-classic-primary">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="aire"
                                                                        name="aro_centevi"
                                                                        type="radio"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Al Aire
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="col-md-4"
                                                        id="div2"
                                                        style={{
                                                            maxWidth: 'fit-content'
                                                        }}
                                                    >
                                                        <div>
                                                            <div className="n-chk">
                                                                <label className="new-control new-checkbox checkbox-outline-info">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="pasta_c"
                                                                        name="propio"
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Pasta Completo
                                                                </label>
                                                            </div>
                                                            <div className="n-chk">
                                                                <label className="new-control new-checkbox checkbox-outline-primary">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="pasta_semi"
                                                                        name="propio"
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Pasta Semi - Aire
                                                                </label>
                                                            </div>
                                                            <div className="n-chk">
                                                                <label className="new-control new-checkbox checkbox-outline-success">
                                                                    <input
                                                                        className="new-control-input"
                                                                        defaultValue="seguridad"
                                                                        name="propio"
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="new-control-indicator" />
                                                                    Seguridad
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Codigo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="codigo_aro"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Color
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="color_aro"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mt-3">
                                                        <label htmlFor="inputEmail4">
                                                            Marca
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="marca"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '10px',
                                                    padding: '10px 50px'
                                                }}
                                            >
                                                <div className="row mt-2">
                                                    <div className="col-md-2">
                                                        <h6 className="text-center p-2">
                                                            MEDIDA DE LENTE:
                                                        </h6>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Altura (Vertical)
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="alto_l"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Horizontal
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="ancho_b_l"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Diagonal Total
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="diagonal_l"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputEmail4">
                                                            Puente
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="separacion_l"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '2px solid blue',
                                                    borderRadius: '25px',
                                                    marginTop: '10px',
                                                    padding: '10px 50px'
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputEmail4">
                                                            Doctor
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="doctor"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputEmail4">
                                                            Elaborado por
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            name="elaborado"
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputEmail4">
                                                            Observación
                                                        </label>
                                                        <textarea
                                                            className="form-control textarea"
                                                            id="textarea"
                                                            maxLength="800"
                                                            name="observacion"
                                                            placeholder="Esta área tiene un limite de 800 caracteres."
                                                            rows="6"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                name="crear_receta"
                                                type="hidden"
                                            />
                                            <input
                                                defaultValue="3"
                                                name="sucursal"
                                                type="hidden"
                                            />
                                            <input
                                                defaultValue="Administrador"
                                                name="doctor"
                                                type="hidden"
                                            />
                                            <button
                                                className="btn btn-success mt-3"
                                                type="submit"
                                            >
                                                Crear Receta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrearReceta
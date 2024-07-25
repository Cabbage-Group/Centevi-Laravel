import React from 'react'

const OptometriaPediatra = () => {
    return (
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
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                <h3 className="text-center">
                                                    Optometría Pediatrica
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <form
                                            method="post"
                                            role="form"
                                        >
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputEmail4">
                                                        Pacientes
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control form-small select2-hidden-accessible"
                                                        data-select2-id="1"
                                                        name="paciente"
                                                        tabIndex="-1"
                                                    >
                                                        <option
                                                            data-select2-id="3"
                                                            value=""
                                                        >
                                                            {`<--- Seleccione el paciente --->`}
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2018-08-21"
                                                            value="22"
                                                        >
                                                            {' '}Número Cedula: 8-1219-383 || Nombres: Danna Lucia Gonzalez Quiros
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2016-09-22"
                                                            value="23"
                                                        >
                                                            {' '}Número Cedula: 4-882-127 || Nombres: Amber Lizeth Martinez Moreno
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2013-06-28"
                                                            value="24"
                                                        >
                                                            {' '}Número Cedula: 4-867-2164 || Nombres: Jenna Nicolle Martinez Moreno
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2011-11-22"
                                                            value="26"
                                                        >
                                                            {' '}Número Cedula: 8-1118-185 || Nombres: Ambar Julieta Quintero Xatruch
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2011-07-25"
                                                            value="27"
                                                        >
                                                            {' '}Número Cedula: 0000 || Nombres: Noa Stella Edde Sasson
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2012-07-08"
                                                            value="28"
                                                        >
                                                            {' '}Número  Cedula: 8-1128-323 || Nombres: Daniel Antonio Halphen Tapia
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2013-04-09"
                                                            value="29"
                                                        >
                                                            {' '}Número Cedula: 8-1140-1390 || Nombres: Salomon Dayan Yedid
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1965-08-24"
                                                            value="32"
                                                        >
                                                            {' '}Número Cedula: N-17-806 || Nombres: Laura Fernández Refincor
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2005-12-07"
                                                            value="33"
                                                        >
                                                            {' '}Número Cedula: 8-1029-2242 || Nombres: Luis Fernando Palomo Chan
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2014-04-09"
                                                            value="35"
                                                        >
                                                            {' '}Número Cedula: 8-1156-1202 || Nombres: Jiam Carlos Tam Beitia
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="2016-11-07"
                                                            value="36"
                                                        >
                                                            {' '}Número Cedula: 8-1196-30 || Nombres: Luca Josiah Shacklett Arias
                                                        </option>
                                                    </select>
                                                    <span
                                                        className="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                        data-select2-id="2"
                                                        dir="ltr"
                                                        style={{
                                                            width: '865px'
                                                        }}
                                                    >
                                                        <span className="selection">
                                                            <span
                                                                aria-expanded="false"
                                                                aria-haspopup="true"
                                                                aria-labelledby="select2-paciente-2b-container"
                                                                className="select2-selection select2-selection--single"
                                                                role="combobox"
                                                                tabIndex="0"
                                                            >
                                                                <span
                                                                    aria-readonly="true"
                                                                    className="select2-selection__rendered"
                                                                    id="select2-paciente-2b-container"
                                                                    role="textbox"
                                                                    title="<--- Seleccione el paciente --->"
                                                                >
                                                                    {`<---Seleccione el paciente --->`}
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
                                            </div>
                                            <div className="form-row mb-12">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputSucursal">
                                                        Sucursal
                                                    </label>
                                                    <select
                                                        className="form-control selectsucursal"
                                                        id="sucursal"
                                                        name="sucursal"
                                                        required
                                                    >
                                                        <option value="">
                                                            Seleccionar sucursal
                                                        </option>
                                                        <option value="3">
                                                            CENTEVI Centro Médico San Judas Tadeo
                                                        </option>
                                                        <option value="4">
                                                            CENTEVI Consultorios Medicos Paitilla
                                                        </option>
                                                        <option value="5">
                                                            CENTEVI Sede Chitre
                                                        </option>
                                                        <option value="7">
                                                            CENTEVI El Dorado
                                                        </option>
                                                        <option value="8">
                                                            CENTEVI Giras Interior del Pais
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="edad">
                                                        Edad
                                                    </label>
                                                    <input
                                                        className="form-control"
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
                                                        className="form-control fechaantencion"
                                                        id="inputAddress"
                                                        max="2024-07-04"
                                                        name="fecha_atencion"
                                                        required
                                                        type="date"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputAddress">
                                                        Motivo de consulta:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="m_c"
                                                        rows="15"
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
                                                        id="lugarNacimiento"
                                                        name="a_o"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress2">
                                                        Antecedentes Personales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress2"
                                                        name="a_p"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress2">
                                                        Antecedentes Familiares
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="inputAddress2"
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
                                                        id="medicamentos"
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
                                                        id="tratamientos"
                                                        name="tratamientos"
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
                                                        id="tratamientos"
                                                        name="desarrollo_infante"
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
                                                        id="nacimiento"
                                                        name="nacimiento"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Parto
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="parto"
                                                        name="parto"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Incubadora
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="incubadora"
                                                        name="incubadora"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Tiempo
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tiempo"
                                                        name="tiempo"
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
                                                                            name="av/sc_od_vl"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/sc_oi_vl"
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
                                                                            name="av/sc_od_vp"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/sc_oi_vp"
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
                                                                            name="av/sc_od_ph"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/sc_oi_ph"
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
                                                                            name="av/cc_od_vl"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/cc_oi_vl"
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
                                                                            name="av/cc_od_vp"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/cc_oi_vp"
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
                                                                            name="av/cc_od_ph"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="av/cc_oi_ph"
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
                                                    RECETA EN USO
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
                                                                    Ojo Derecho
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="esfera_od"
                                                                        placeholder="esfera_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_od"
                                                                        placeholder="cilindro_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_od"
                                                                        placeholder="eje_od"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_od"
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
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
                                                                        name="esfera_oi"
                                                                        placeholder="esfera_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="cilindro_oi"
                                                                        placeholder="cilindro_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="eje_oi"
                                                                        placeholder="eje_oi"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="p_base_oi"
                                                                        placeholder="△"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
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
                                                        name="len_tipo_lentes"
                                                        placeholder="len_tipo_lentes"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="objetivos">
                                                        Filtros
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="len_filtros"
                                                        placeholder="len_filtros"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="objetivos">
                                                        Tiempo
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="len_tiempo"
                                                        placeholder="len_tiempo"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="objetivos">
                                                        Tipo de Aro
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="len_tipo_arco"
                                                        placeholder="len_tipo_arco"
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
                                                        name="sa_od"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_od"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="sa_oi"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_oi"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="tratamientos">
                                                Hirschberg
                                            </label>
                                            <input
                                                className="form-control"
                                                id="hirschberg"
                                                name="hirschberg"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="tratamientos">
                                                Krismsky
                                            </label>
                                            <input
                                                className="form-control"
                                                id="krismsky"
                                                name="krismsky"
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
                                                name="plan_versiones"
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="VL">
                                                COVER TEST: VISION LEJANA:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="VL"
                                                name="ct_vl"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="VP">
                                                VISION PROXIMA
                                            </label>
                                            <input
                                                className="form-control"
                                                id="VP"
                                                name="ct_vp"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="maddox">
                                                MADDOX:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="maddox"
                                                name="maddox"
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
                                                id="ao"
                                                name="seguimiento_ao"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="tratamientos">
                                                Sacádicos(AO):{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="ao"
                                                name="sacadicos_ao"
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
                                                id="or"
                                                name="ppc_or"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tratamientos">
                                                L:{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="L"
                                                name="ppc_l"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tratamientos">
                                                FR:{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="FR"
                                                name="ppc_fr"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="tratamientos">
                                                Posicion compensatoria:{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="Posicion"
                                                name="ppc_posicion"
                                                type="text"
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
                                                        VISION LEJANA
                                                    </th>
                                                    <th className="text-center">
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
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
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
                                                            name="vl_bg"
                                                            placeholder="vl_bg"
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
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
                                                id="inputAddress"
                                                name="randot"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="inputAddress">
                                                Lang:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lang"
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
                                                id="inputAddress"
                                                name="vision_color"
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
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_od_f"
                                                                placeholder="cilindro_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_od_f"
                                                                placeholder="eje_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="p_base_od_f"
                                                                placeholder="△"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="add_od_f"
                                                                placeholder="add_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="agz_od_f"
                                                                placeholder="agz_od_f"
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
                                                                name="esfera_oi_f"
                                                                placeholder="esfera_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_oi_f"
                                                                placeholder="cilindro_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_oi_f"
                                                                placeholder="eje_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="p_base_oi_f"
                                                                placeholder="△"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="add_oi_f"
                                                                placeholder="add_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="agz_oi_f"
                                                                placeholder="agz_oi_f"
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
                                                id="inputAddress"
                                                name="lente_marca_1"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                PD
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lente_pd_1"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                DPN
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lente_dpn_1"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                ALTURA
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lente_altura_1"
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
                                                        <th className="text-center">
                                                            OJO DERECHO
                                                        </th>
                                                        <th className="text-center">
                                                            OJO IZQUIERDO
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
                                                                name="poder_od"
                                                                placeholder="poder_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                                name="cb_od"
                                                                placeholder="cb_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                                name="dia_od"
                                                                placeholder="dia_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                id="inputAddress"
                                                name="lente_marca"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputAddress">
                                                Tipo:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lente_tipo"
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
                                                id="textarea"
                                                maxLength="800"
                                                name="conducta_seguir"
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        defaultValue="crear"
                                        name="crear_optometria_pediatrica"
                                        type="hidden"
                                    />
                                    <input
                                        defaultValue="Administrador"
                                        name="doctor"
                                        type="hidden"
                                    />
                                    <input
                                        defaultValue="0"
                                        name="id_terapia"
                                        type="hidden"
                                    />
                                    <button
                                        className="btn btn-success mt-3 btn-crear-paciente"
                                        type="submit"
                                    >
                                        <div className="txt-btn-crear">
                                            Crear Consulta
                                        </div>
                                        <div
                                            className="spinner-border no-mostrar-btn"
                                            role="status"
                                        >
                                            <span className="sr-only">
                                                {' '}Loading...
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OptometriaPediatra
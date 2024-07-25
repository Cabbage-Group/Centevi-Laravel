import React from 'react'

const OptometriaGeneral = () => {
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
                                                        Optometría General
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
                                                                Seleccione el paciente
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
                                                                {' '}Número Cedula: 8-1128-323 || Nombres: Daniel Antonio Halphen Tapia
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
                                                            className="form-control"
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
                                                            Motivo de Consulta:
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
                                                <h3>
                                                    AGUDEZA VISUAL
                                                </h3>
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
                                                                            Visión Lejana
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
                                                                            Visión Próxima
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
                                                                            Visión Próxima
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
                                                                            name="esfera_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="p_base_od"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="esfera_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="cilindro_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="eje_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="p_base_oi"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                            <div className="form-group col-md-3">
                                                <label htmlFor="VL">
                                                    CT: VL:
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="VL"
                                                    name="ct_vl"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="VP">
                                                    VP
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="VP"
                                                    name="ct_vp"
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
                                            <div className="form-group col-md-2">
                                                <label htmlFor="tratamientos">
                                                    PPC: OR{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="ppc_or"
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
                                                    id="ppc_l"
                                                    name="ppc_l"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tratamientos">
                                                    Posicion compensatoria:{' '}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="ppc_posicion"
                                                    name="ppc_posicion"
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
                                                    name="observaciones"
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
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="vp_luces"
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
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_od_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_od_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="p_base_od_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="add_od_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="agz_od_f"
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
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_oi_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_oi_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="p_base_oi_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="add_oi_f"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                            <label htmlFor="tratamientos">
                                                TIPO DE LENTE{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="tipo_l"
                                                name="tipo_l"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tratamientos">
                                                PD:{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="pd"
                                                name="pd"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tratamientos">
                                                DNP:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="dnp"
                                                name="dnp"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tratamientos">
                                                ALTURA:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="alt"
                                                name="alt"
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
                                                                name="poder_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="poder_oi"
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
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cb_oi"
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
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="dia_oi"
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
                                        name="crear_refraccion_general"
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
                                        className="btn btn-success mt-3"
                                        type="submit"
                                    >
                                        Guardar Consulta
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

export default OptometriaGeneral
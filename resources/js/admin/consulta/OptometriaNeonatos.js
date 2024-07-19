import React from 'react'

const OptometriaNeonatos = () => {
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
                                                    Optometría Neonatos
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <form
                                            method="post"
                                            role="form"
                                        >
                                            <div className="form-row mb-12">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="inputEmail4">
                                                        Pacientes
                                                    </label>
                                                    <select
                                                        aria-hidden="true"
                                                        className="form-control"
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
                                                        Motivo de consulta:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="10000"
                                                        name="m_c"
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="nacimiento"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Parto
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="parto"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Gateo
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="gateo"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tratamientos">
                                                        Lenguaje
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="lenguaje"
                                                        placeholder=""
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
                                                        id="tratamientos"
                                                        name="complicaciones"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="tratamientos">
                                                        Perinatales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="perinatales"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="tratamientos">
                                                        Postnatales
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tratamientos"
                                                        name="postnatales"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <h6>
                                                AGUDEZA VISUAL:
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="tambor">
                                                        Tambor Optocinético AO{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="tambor"
                                                        name="tambor"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="fija">
                                                        Fija
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="fija"
                                                        name="fija"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="sigue">
                                                        Sigue
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="sigue"
                                                        name="sigue"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="mantiene">
                                                        Mantiene
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="mantiene"
                                                        name="mantiene"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="test">
                                                        Test mirada preferencial OD{' '}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="test"
                                                        name="test"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="oi">
                                                        OI
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="oi"
                                                        name="a_oi"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="ao">
                                                        AO
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="ao"
                                                        name="a_ao"
                                                        placeholder=""
                                                        type="text"
                                                    />
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
                                                                        name="p_base_od"
                                                                        placeholder="△"
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
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">
                                                                    Ojo Izquierdo
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
                                                                        name="p_base_oi"
                                                                        placeholder="△"
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
                                                        name="sa_od"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_od"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="sa_oi"
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        className="form-control"
                                                        name="pp_oi"
                                                        placeholder=""
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
                                                id="D"
                                                name="hirschberg"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="tratamientos">
                                                Krismsky
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="krismsky"
                                                placeholder=""
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
                                                maxLength="10000"
                                                name="plan_versiones"
                                                placeholder=""
                                                rows="15"
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
                                                id="D"
                                                name="ct_vp"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Reflejo Cocleopalpebral
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="ct_reflejo"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Ducciones:OD
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="ducciones_od"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                OI
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="ducciones_oi"
                                                placeholder=""
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
                                                id="I"
                                                name="posicion_compensatoria"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Reflejos Pupilares: Fotomotor/OD{' '}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="D"
                                                name="fotomotor_od"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Consensual
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="consensual"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Fotomotor:OI
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="fotomotor_oi"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="tratamientos">
                                                Consensual
                                            </label>
                                            <input
                                                className="form-control"
                                                id="I"
                                                name="fotomotor_consensual"
                                                placeholder=""
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
                                                id="inputAddress"
                                                name="reflejo_r_od"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="inputAddress">
                                                OI:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="reflejo_r_oi"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="inputAddress">
                                                AO:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="reflejo_r_ao"
                                                placeholder=""
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
                                                                name="esfera_od_f"
                                                                placeholder=""
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_od_f"
                                                                placeholder=""
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_od_f"
                                                                placeholder=""
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
                                                                placeholder=""
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
                                                                placeholder=""
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_oi_f"
                                                                placeholder=""
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_oi_f"
                                                                placeholder=""
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
                                                                placeholder=""
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
                                                id="inputAddress"
                                                name="refraccion_tipo_lentes"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                PD:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="refraccion_pd"
                                                placeholder=""
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputAddress">
                                                USO:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="refraccion_uso"
                                                placeholder=""
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
                                                maxLength="10000"
                                                name="conducta_seguir"
                                                placeholder=""
                                                rows="15"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        defaultValue="crear"
                                        name="crear_optometria_neonatos"
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

export default OptometriaNeonatos
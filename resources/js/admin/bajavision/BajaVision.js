import React from 'react'

const BajaVision = () => {
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
                                                    Consulta de Baja Vision
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
                                                            data-fecha-nacimiento="2024-05-18"
                                                            value="8987"
                                                        >
                                                            Número Cedula: 7-67-87 || Nombres: Tomasa Castillo{' '}
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1968-11-04"
                                                            value="8988"
                                                        >
                                                            Número Cedula: 7-103-662 || Nombres: Victor Soriano{' '}
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1983-09-23"
                                                            value="8990"
                                                        >
                                                            Número Cedula: 1-712-1736 || Nombres: CASTILLO PALACIO MORALES
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1967-01-25"
                                                            value="8991"
                                                        >
                                                            Número Cedula: 9-150-629 || Nombres: CAROLINA VARGAS CASTILLO de PIMENTEL
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1953-09-14"
                                                            value="8992"
                                                        >
                                                            Número Cedula: 8-203-1442 || Nombres: JOSE ANTONIO RUIZ BARRANCO
                                                        </option>
                                                        <option
                                                            data-fecha-nacimiento="1985-06-29"
                                                            value="8993"
                                                        >
                                                            Número Cedula: 8-789-2088 || Nombres: ABDIEL ALMANZA DUTARI
                                                        </option>
                                                    </select>
                                                    <span
                                                        className="select2 select2-container mb-4 select2-container--default form-control-sm"
                                                        data-select2-id="2"
                                                        dir="ltr"
                                                        style={{
                                                            width: '1128.89px'
                                                        }}
                                                    >
                                                        <span className="selection">
                                                            <span
                                                                aria-expanded="false"
                                                                aria-haspopup="true"
                                                                aria-labelledby="select2-paciente-es-container"
                                                                className="select2-selection select2-selection--single"
                                                                role="combobox"
                                                                tabIndex="0"
                                                            >
                                                                <span
                                                                    aria-readonly="true"
                                                                    className="select2-selection__rendered"
                                                                    id="select2-paciente-es-container"
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
                                                        placeholder="Esta área tiene un limite de 10000 caracteres."
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
                                                        id="inputAddress2"
                                                        name="a_p"
                                                        placeholder="A/P"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputAddress2">
                                                        Antecentes Familiares
                                                    </label>
                                                    <input
                                                        className="form-control"
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
                                                        id="tratamientos"
                                                        name="tratamientos"
                                                        placeholder="Tratamientos"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="oftalmologico">
                                                        DX. Oftalmologico Principal
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="oftalmologico"
                                                        name="dx_oft_princ"
                                                        placeholder="Oftalmologico principal"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="objetivos">
                                                        Objetivos de paciente
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id="objetivos"
                                                        name="objetivos"
                                                        placeholder="Objetivos"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="lugarNacimiento">
                                                        Acudiente/Acompañante
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id=""
                                                        name=""
                                                        placeholder="Acudiente/Acompañante"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress2">
                                                        ¿Tuvo consulta de baja visión anteriormente?
                                                    </label>
                                                    <br />
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            placeContent: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <label htmlFor="vives-solo">
                                                                Si
                                                            </label>
                                                            <input
                                                                defaultValue="si"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: '10px'
                                                            }}
                                                        >
                                                            <label htmlFor="vives-solo">
                                                                No
                                                            </label>
                                                            <input
                                                                defaultValue="no"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputAddress2">
                                                        Consulta de baja visión anterior
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id=""
                                                        max="2024-07-04"
                                                        name=""
                                                        placeholder="Consulta de baja visión anterior"
                                                        type="date"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="lugarNacimiento">
                                                        ¿Ha utilizado ayudas para BV?
                                                    </label>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            placeContent: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <label htmlFor="vives-solo">
                                                                Si
                                                            </label>
                                                            <input
                                                                defaultValue="si"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: '10px'
                                                            }}
                                                        >
                                                            <label htmlFor="vives-solo">
                                                                No
                                                            </label>
                                                            <input
                                                                defaultValue="no"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="lugarNacimiento">
                                                        ¿Que tipo de ayudas?
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id=""
                                                        name=""
                                                        placeholder="¿Que tipo de ayudas?"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="lugarNacimiento">
                                                        ¿Quien le prescribió las ayudas?
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id=""
                                                        name=""
                                                        placeholder="¿Quien le prescribió las ayudas?"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-6">
                                                    <div
                                                        style={{
                                                            textAlignLast: 'center'
                                                        }}
                                                    >
                                                        <label htmlFor="lugarNacimiento">
                                                            ¿Conoce su problema ocular?
                                                        </label>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            placeContent: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <label htmlFor="vives-solo">
                                                                Si
                                                            </label>
                                                            <input
                                                                defaultValue="si"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: '10px'
                                                            }}
                                                        >
                                                            <label htmlFor="vives-solo">
                                                                No
                                                            </label>
                                                            <input
                                                                defaultValue="no"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <div
                                                        style={{
                                                            textAlignLast: 'center'
                                                        }}
                                                    >
                                                        <label htmlFor="lugarNacimiento">
                                                            ¿Su visión fluctúa día con día?
                                                        </label>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            placeContent: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <label htmlFor="vives-solo">
                                                                Si
                                                            </label>
                                                            <input
                                                                defaultValue="si"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: '10px'
                                                            }}
                                                        >
                                                            <label htmlFor="vives-solo">
                                                                No
                                                            </label>
                                                            <input
                                                                defaultValue="no"
                                                                name="vives-solo"
                                                                type="radio"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="lugarNacimiento">
                                                        ¿Cuando?
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id=""
                                                        name=""
                                                        placeholder="Detalle Brevemente"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <script
                                                dangerouslySetInnerHTML={{
                                                    __html: ' document.querySelectorAll(\'.switch input\').forEach(function(input) {input.addEventListener(\'change\', function() {                                                var slider = this.nextElementSibling;                                                var text = slider.nextElementSibling;                                                var circle = slider.querySelector(\'.slider-circle\');                                                if (this.) {                                                    slider.style.backgroundColor = \'#2196F3\';                                                    text.textContent = \'\';                                                    circle.style.transform = \'translateX(26px)\';                                                } else {                                                    slider.style.backgroundColor = \'#b0b0b0\';                                                    text.textContent = \'\';                                                    circle.style.transform = \'translateX(0)\';                                                }                                            });                                        });                                    '
                                                }}
                                            />
                                            <hr />
                                            <h6>
                                                <b>
                                                    Entorno Social
                                                </b>
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        ¿Vives Solo?
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="vives-solo">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="vives-solo"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="vives-solo">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="vives-solo"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        ¿Influyó la perdida de visión con su desempeño ocupacional?
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ipvision-desem-ocup">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ipvision-desem-ocup"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ipvision-desem-ocup">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ipvision-desem-ocup"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        ¿Cómo?
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            name="como"
                                                                            placeholder="Explique Brevemente"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Nivel de Educación
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="nivel-educacion">
                                                                                    Bachiller
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Bachiller"
                                                                                    name="nivel-educacion"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="nivel-educacion">
                                                                                    Licenciatura
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Licenciatura"
                                                                                    name="nivel-educacion"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="nivel-educacion">
                                                                                    Maestría
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Maestría"
                                                                                    name="nivel-educacion"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="nivel-educacion">
                                                                                    Doctorado
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Doctorado"
                                                                                    name="nivel-educacion"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Desplazamiento en lugares externos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="desplazamineto-lugares-externos">
                                                                                    Solo
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="desplazamineto-lugares-externos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="desplazamineto-lugares-externos">
                                                                                    Acompañado
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="desplazamineto-lugares-externos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Desplazamiento en lugares internos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="desplazamineto-lugares-internos">
                                                                                    Al tacto
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="desplazamineto-lugares-internos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="desplazamineto-lugares-internos">
                                                                                    Visión
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="desplazamineto-lugares-internos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="desplazamineto-lugares-internos">
                                                                                    Ambas
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Ambas"
                                                                                    name="desplazamineto-lugares-internos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        ¿En qué momento del día le gusta más desplazarse?
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="gusta-desplazarse">
                                                                                    Día
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="gusta-desplazarse"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="gusta-desplazarse">
                                                                                    Noche
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="gusta-desplazarse"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="gusta-desplazarse">
                                                                                    Ambas
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="Ambas"
                                                                                    name="gusta-desplazarse"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h6>
                                                <b>
                                                    Tareas de Lejos: Tiene Dificultad para:
                                                </b>
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Caminar en la calle
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="caminar-calle">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="caminar-calle"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="caminar-calle">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="caminar-calle"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Dezplazarse solo en un lugares conocidos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="desplazarse-lugares-conocidos">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="desplazarse-lugares-conocidos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="desplazarse-lugares-conocidos">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="desplazarse-lugares-conocidos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Dezplazarse solo en unos lugares lejanos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="desplazarse-lugares-lejanos">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="desplazarse-lugares-lejanos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="desplazarse-lugares-lejanos">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="desplazarse-lugares-lejanos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Conducir de noche
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="conducir-noche">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="conducir-noche"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="conducir-noche">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="conducir-noche"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Conducir de día
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="conducir-dia">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="conducir-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="conducir-dia">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="conducir-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver las señales de tránsito de día
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="seniales-transito-dia">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="seniales-transito-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="seniales-transito-dia">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="seniales-transito-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver las señales de tránsito de noche
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="seniales-transito-noche">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="seniales-transito-noche"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="seniales-transito-noche">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="seniales-transito-noche"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver el letrero de los buses
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="letreros-buses">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="letreros-buses"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="letreros-buses">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="letreros-buses"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Reconocer la letra las caras de las personas
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="reconocer-letra-caras-personas">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="reconocer-letra-caras-personas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="reconocer-letra-caras-personas">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="reconocer-letra-caras-personas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver al tablero en clases
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="tablero-clases">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="tablero-clases"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="tablero-clases">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="tablero-clases"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver los letreros de las Calles
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="letreros-calles">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="letreros-calles"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="letreros-calles">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="letreros-calles"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver bordes y peldaños de escaleras
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="bordes-peldanios-escaleras">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="bordes-peldanios-escaleras"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="bordes-peldanios-escaleras">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="bordes-peldanios-escaleras"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver las peliculas en el Cine o Teatro
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="peliculas-cine-teatro">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="peliculas-cine-teatro"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="peliculas-cine-teatro">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="peliculas-cine-teatro"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Reconocer los colores
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="reconocer-colores">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="reconocer-colores"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="reconocer-colores">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="reconocer-colores"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Hacer Deportes
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="hacer-deportes">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="hacer-deportes"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="hacer-deportes">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="hacer-deportes"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Realizar tareas del hogar
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="realizar-tareas-hogar">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="realizar-tareas-hogar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="realizar-tareas-hogar">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="realizar-tareas-hogar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Cocinar
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="cocinar">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="cocinar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="cocinar">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="cocinar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Manejar los Electrodomesticos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="manejar-electrodomesticos">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="manejar-electrodomesticos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="manejar-electrodomesticos">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="manejar-electrodomesticos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver la llama de la estufa
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-llama-estufa">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-llama-estufa"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-llama-estufa">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-llama-estufa"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Ver la comida en el plato
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-comida-plato">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-comida-plato"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-comida-plato">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-comida-plato"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Marcar un número telefónico
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="marcar-numero-telefonico">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="marcar-numero-telefonico"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="marcar-numero-telefonico">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="marcar-numero-telefonico"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center">
                                                                        Realizar su arreglo personal
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="arreglo-personal">
                                                                                    bañarse
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="bañarse"
                                                                                    name="arreglo-personal"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="arreglo-personal">
                                                                                    vestirse
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="vestirse"
                                                                                    name="arreglo-personal"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="arreglo-personal">
                                                                                    lavarse los dientes
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="lavarse los dientes"
                                                                                    name="arreglo-personal"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h6>
                                                <b>
                                                    Tareas de Cerca: Tiene Dificultad para:
                                                </b>
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Leer titulares de periodicos y revistas
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="leer-titulares-periodicos-revistas">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="leer-titulares-periodicos-revistas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="leer-titulares-periodicos-revistas">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="leer-titulares-periodicos-revistas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Leer letra manuscrita o cursiva
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="leer-letra-manuscrita-cursiva">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="leer-letra-manuscrita-cursiva"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="leer-letra-manuscrita-cursiva">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="leer-letra-manuscrita-cursiva"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Leer periodicos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="leer-periodicos">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="leer-periodicos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="leer-periodicos">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="leer-periodicos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Ver los precios o etiquetas de productos
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-precios-etiquetas-productos">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-precios-etiquetas-productos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-precios-etiquetas-productos">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-precios-etiquetas-productos"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Leer su correo electrónico
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="leer-correo-electronico">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="leer-correo-electronico"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="leer-correo-electronico">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="leer-correo-electronico"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Firmas cheques, recibos, papelería
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="firma-cheque-recibo-papeleria">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="firma-cheque-recibo-papeleria"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="firma-cheque-recibo-papeleria">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="firma-cheque-recibo-papeleria"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Escribir
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="escribir">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="escribir"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="escribir">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="escribir"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Coser, tejer, bordar
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="coser-tejer-bordar">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="coser-tejer-bordar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="coser-tejer-bordar">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="coser-tejer-bordar"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Leer su Libro Religioso
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="leer-libro-religioso">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="leer-libro-religioso"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="leer-libro-religioso">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="leer-libro-religioso"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Ver la pantalla de la computadora
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-pantalla-computadora">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-pantalla-computadora"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-pantalla-computadora">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-pantalla-computadora"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h6>
                                                <b>
                                                    Iluminación: Tiene Problemas para:
                                                </b>
                                            </h6>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Tolerar la luz del Sol
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="tolerar-luz-sol">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="tolerar-luz-sol"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="tolerar-luz-sol">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="tolerar-luz-sol"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Usar lentes oscuros de Sol
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="usar-lentes-oscuros-sol">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="usar-lentes-oscuros-sol"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="usar-lentes-oscuros-sol">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="usar-lentes-oscuros-sol"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Realizar actividades en lugares interiores
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="realizar-actividades-lugares-interiores">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="realizar-actividades-lugares-interiores"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="realizar-actividades-lugares-interiores">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="realizar-actividades-lugares-interiores"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Siente destellos de luces, o deslumbramiento de día
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="siente-destellos-luces-deslumbramiento-dia">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="siente-destellos-luces-deslumbramiento-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="siente-destellos-luces-deslumbramiento-dia">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="siente-destellos-luces-deslumbramiento-dia"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Prefiere la luz
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="prefiere-luz">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="prefiere-luz"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="prefiere-luz">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="prefiere-luz"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Ver en lugares que las luces son amarillas
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-lugares-luces-amarillas">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-lugares-luces-amarillas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-lugares-luces-amarillas">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-lugares-luces-amarillas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="text-center"
                                                                        style={{
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        Ver en lugares que las luces son blancas
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                placeContent: 'center'
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <label htmlFor="ver-lugares-luces-blancas">
                                                                                    Si
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="si"
                                                                                    name="ver-lugares-luces-blancas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <label htmlFor="ver-lugares-luces-blancas">
                                                                                    No
                                                                                </label>
                                                                                <input
                                                                                    defaultValue="no"
                                                                                    name="ver-lugares-luces-blancas"
                                                                                    type="radio"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <h6>
                                                AGUDEZA VISUAL
                                            </h6>
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
                                                                            placeholder="od_vl"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="av/sc_od_vp"
                                                                            placeholder="od_vp"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="av/sc_od_ph"
                                                                            placeholder="od_ph"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="av/cc_od_vl"
                                                                            placeholder="od_vl"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="av/cc_od_vp"
                                                                            placeholder="od_vp"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                                            name="av/cc_od_ph"
                                                                            placeholder="od_ph"
                                                                            type="text"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
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
                                                <h6>
                                                    RECETA EN USO
                                                </h6>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center">
                                                                    RX en uso
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
                                                                        defaultValue="△"
                                                                        name="p_base_od"
                                                                        placeholder="p_base_od"
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
                                                                        defaultValue="△"
                                                                        name="p_base_oi"
                                                                        placeholder="p_base_oi"
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
                                            <div className="form-group">
                                                <h6>
                                                    <b>
                                                        Test de Sensibilidad Luminosa (BAT)
                                                    </b>
                                                </h6>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                className="text-center"
                                                                style={{
                                                                    width: '150px'
                                                                }}
                                                            >
                                                                Ojo Evaluado
                                                            </th>
                                                            <th className="text-center">
                                                                Apagado
                                                            </th>
                                                            <th className="text-center">
                                                                Bajo
                                                            </th>
                                                            <th className="text-center">
                                                                Medio
                                                            </th>
                                                            <th className="text-center">
                                                                Alto
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
                                                                    name="Apagado"
                                                                    placeholder="Apagado"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    name="Bajo"
                                                                    placeholder="Bajo"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    name="Medio"
                                                                    placeholder="Medio"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="Alto"
                                                                    placeholder="Alto"
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
                                                                    name="Apagado"
                                                                    placeholder="Apagado"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    name="Bajo"
                                                                    placeholder="Bajo"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    name="Medio"
                                                                    placeholder="Medio"
                                                                    type="text"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="form-control"
                                                                    defaultValue=""
                                                                    name="Alto"
                                                                    placeholder="Alto"
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
                                                        Observaciones:
                                                    </label>
                                                    <textarea
                                                        className="form-control textarea"
                                                        id="textarea"
                                                        maxLength="1000"
                                                        name=""
                                                        placeholder="Esta área tiene un limite de 1000 caracteres."
                                                        rows="5"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row mb-4">
                                                <div className="form-group col-md-12">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center" />
                                                                <th className="text-center">
                                                                    CV.CONFRONTACION
                                                                </th>
                                                                <th className="text-center">
                                                                    SALUD OCULAR
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
                                                                        name="cv_od"
                                                                        placeholder="Ojo Derecho"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="so_od"
                                                                        placeholder="Ojo Derecho"
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
                                                                        name="cv_oi"
                                                                        placeholder="Ojo Izquierdo"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        name="so_oi"
                                                                        placeholder="Ojo Izquierdo"
                                                                        type="text"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
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
                                                        name="amsler_od"
                                                        placeholder="Ojo Derecho"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        className="form-control"
                                                        name="amsler_oi"
                                                        placeholder="Ojo Izquierdo"
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
                                                        name="sensibilidad_od"
                                                        placeholder="Ojo Derecho"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input
                                                        className="form-control"
                                                        name="sensibilidad_oi"
                                                        placeholder="Ojo Izquierdo"
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
                                                id="textarea"
                                                maxLength="800"
                                                name="plan_versiones"
                                                placeholder="Esta área tiene un limite de 800 caracteres."
                                                rows="5"
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
                                                defaultValue=""
                                                id="inputAddress"
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
                                                id="inputAddress"
                                                name="prueba_od"
                                                placeholder="Ojo Derecho"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputAddress">
                                                Ojo Izquierdo
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="prueba_oi"
                                                placeholder="Ojo Izquierdo"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <h5 className="p-4">
                                            RECETA FINAL PARA DISTANCIA
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
                                                                defaultValue="△"
                                                                name="p_base_od_f"
                                                                placeholder="p_base_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                                defaultValue="△"
                                                                name="p_base_oi_f"
                                                                placeholder="p_base_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                id="inputAddress"
                                                name="lentes_marca_1"
                                                placeholder="Marca"
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
                                                name="lentes_pd_1"
                                                placeholder="Tipo"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                DNP
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lentes_dnp_1"
                                                placeholder="Tipo"
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
                                                name="lentes_altura_1"
                                                placeholder="Tipo"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <h5 className="p-4">
                                            RECETA FINAL PARA CERCA
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
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_od_fc"
                                                                placeholder="cilindro_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_od_fc"
                                                                placeholder="eje_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                defaultValue="△"
                                                                name="p_base_od_fc"
                                                                placeholder="p_base_od"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                                name="esfera_oi_fc"
                                                                placeholder="esfera_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="cilindro_oi_fc"
                                                                placeholder="cilindro_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                name="eje_oi_fc"
                                                                placeholder="eje_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                defaultValue="△"
                                                                name="p_base_oi_fc"
                                                                placeholder="p_base_oi"
                                                                type="text"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
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
                                                TIPO DE LENTE
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lentes_marca_2"
                                                placeholder="Marca"
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
                                                name="lentes_pd_2"
                                                placeholder="Tipo"
                                                type="text"
                                            />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputAddress">
                                                DNP
                                            </label>
                                            <input
                                                className="form-control"
                                                id="inputAddress"
                                                name="lentes_dnp_2"
                                                placeholder="Tipo"
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
                                                name="lentes_altura_2"
                                                placeholder="Tipo"
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
                                                id="textarea"
                                                maxLength="800"
                                                name="ayudas_opticas"
                                                placeholder="Esta área tiene un limite de 800 caracteres."
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Microscopios
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" />
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Magnificador
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" />
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Telescopio
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" />
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Sistemas Telescopios Adaptados en Gafas
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" />
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Lte ADD
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Telemicroscopio
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th />
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        Lte ADD
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <h6>
                                            <b>
                                                Circuito Cerrado de Television
                                            </b>
                                        </h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th />
                                                    <th className="text-center">
                                                        Polaridad
                                                    </th>
                                                    <th className="text-center">
                                                        Potencia
                                                    </th>
                                                    <th className="text-center">
                                                        AV
                                                    </th>
                                                    <th className="text-center">
                                                        Dist
                                                    </th>
                                                    <th className="text-center">
                                                        Observaciones
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
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-center">
                                                        Ojo Izquierdo
                                                    </td>
                                                    <td className="text-center">
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            defaultValue=""
                                                            name=""
                                                            placeholder=""
                                                            type="text"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-12">
                                            <h6>
                                                <b>
                                                    Ayudas No Opticas/Otros
                                                </b>
                                            </h6>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="tiposcopio"
                                                    type="checkbox"
                                                />
                                                {' '}Tiposcopio
                                            </label>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="guia_escritura"
                                                    type="checkbox"
                                                />
                                                {' '}Guia de Escritura
                                            </label>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="atril"
                                                    type="checkbox"
                                                />
                                                {' '}Atril
                                            </label>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="iluminacion"
                                                    type="checkbox"
                                                />
                                                {' '}Iluminacion
                                            </label>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="macrotipo"
                                                    type="checkbox"
                                                />
                                                {' '}Macrotipo
                                            </label>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>
                                                <input
                                                    name="acetato_amarillo"
                                                    type="checkbox"
                                                />
                                                {' '}Acetato Amarillo
                                            </label>
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
                                                maxLength="800"
                                                name="ayudas_no_opticas"
                                                placeholder="Esta área tiene un limite de 800 caracteres."
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="">
                                                Materiales a Prescribir:
                                            </label>
                                            <textarea
                                                className="form-control textarea"
                                                id="textarea"
                                                maxLength="1000"
                                                name=""
                                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                                rows="5"
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
                                                id="textarea"
                                                maxLength="800"
                                                name="plan_rehabilitacion"
                                                placeholder="Esta área tiene un limite de 800 caracteres."
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="">
                                                Referencia a otro servicio:
                                            </label>
                                            <textarea
                                                className="form-control textarea"
                                                id="textarea"
                                                maxLength="1000"
                                                name=""
                                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-4">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="">
                                                Observaciones:
                                            </label>
                                            <textarea
                                                className="form-control textarea"
                                                id="textarea"
                                                maxLength="1000"
                                                name=""
                                                placeholder="Esta área tiene un limite de 1000 caracteres."
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        name="crear_baja_vision"
                                        type="hidden"
                                    />
                                    <input
                                        defaultValue="0"
                                        name="id_terapia"
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

export default BajaVision
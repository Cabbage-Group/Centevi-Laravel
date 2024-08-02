import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { crearRecetas } from '../../redux/features/recetas/crearRecetasSlice';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useLocation } from 'react-router-dom';
import { fetchVerUnaReceta } from '../../redux/features/recetas/verUnaRecetaSlice';
import ReactToPrint from 'react-to-print';



const SelectReceta = () => {
    



    const { id_receta } = useParams();
    const { pacientes } = useSelector((state) => state.pacientes);
    const { sucursales } = useSelector((state) => state.sucursales);
    const dispatch = useDispatch();
    const location = useLocation();
    const { data, status, error } = useSelector((state) => state.verUnaReceta);

    const [pacienteNombre, setPacienteNombre] = useState('');
    const [Nro_receta, setNro_receta] = useState('');
    const [Direccion, setDireccion] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Cedula, setCedula] = useState('');
    const [Doctor, setDoctor] = useState('');
    const [Observacion, setObservacion] = useState('');
    const [rxData, setRxData] = useState(null);
    const [tipoLente, setTipoLente] = useState('');
    const [tratamientosData, setTratamientosData] = useState(null);
    const [materialData, setMaterialData] = useState(null);
    const [aro_propioData, setAro_propioData] = useState(null);
    const [medidasData, setMedidasData] = useState(null);


    useEffect(() => {

        setPacienteNombre('');
        if (id_receta) {
            dispatch(fetchVerUnaReceta(id_receta));
        }
    }, [dispatch, id_receta, location.pathname]);

    useEffect(() => {
        if (data) {
            setPacienteNombre(data.PACIENTE_NOMBRE);
            setDireccion(data.DIRECCION);
            setNro_receta(data.NRO_RECETA);
            setTelefono(data.TELEFONO);
            setCedula(data.CEDULA);
            setDoctor(data.DOCTOR);
            setObservacion(data.OBSERVACION);
            setTipoLente(data.TIPO_LENTE);
            if (data.RX) {
                try {
                    const parsedRx = JSON.parse(data.RX);
                    setRxData(parsedRx);
                } catch (e) {
                    console.error('Error parsing RX data:', e);
                }
            }
            if (data.TRATAMIENTOS) {
                try {
                    const parsedTratamientos = JSON.parse(data.TRATAMIENTOS);
                    setTratamientosData(parsedTratamientos);
                } catch (e) {
                    console.error('Error parsing TRATAMIENTOS data:', e);
                }
            }
            if (data.MATERIAL) {
                try {
                    const parsedMaterial = JSON.parse(data.MATERIAL);
                    setMaterialData(parsedMaterial);
                } catch (e) {
                    console.error('Error parsing Material data:', e);
                }
            }
            if (data.ARO_PROPIO) {
                try {
                    const parsedAro_propio = JSON.parse(data.ARO_PROPIO);
                    setAro_propioData(parsedAro_propio);
                } catch (e) {
                    console.error('Error parsing Aro_propio data:', e);
                }
            }
            if (data.MEDIDAS) {
                try {
                    const parsedMedidas = JSON.parse(data.MEDIDAS);
                    setMedidasData(parsedMedidas);
                } catch (e) {
                    console.error('Error parsing Medidas data:', e);
                }
            }
        }
    }, [data]);


    const printPage = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        const printableContent = document.querySelector('.printable').innerHTML;
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; } .printable { padding: 20px; }</style>'); // Agrega estilos si es necesario
        printWindow.document.write('</head><body >');
        printWindow.document.write(printableContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      };

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;
    return (

        
        <div>
        <button onClick={printPage}>Imprimir</button>
        <div className="printable" data-select2-id="15">
            
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
                                        
                                            {rxData && medidasData && aro_propioData && materialData && tratamientosData ? (
                                                <div className="widget-content widget-content-area" >
                                                    
                                                    <Formik                                                  >

                                                        <Form  >
                                                        
                                                    
                                                       
                                                        
                                                          <div className="form-row" style={{ marginBottom: "2rem" }}>

                                                                <div className="col-md-4" >
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
                                                                <div class="col-md-2"  >
                                                                    <h4>Nro. Orden</h4>
                                                                    <input style={{ color: "red", fontWeight: "bold", marginBottom: "1rem" }}
                                                                        type="text" class="form-control"
                                                                        id="pacienteNombre"
                                                                        name="nro_receta"
                                                                        value={Nro_receta}
                                                                        readOnly
                                                                    />
                                                                </div>


                                                                <div className="form-group col-md-4" >
                                                                    <label htmlFor="pacientes">Pacientes</label>
                                                                    <input
                                                                        as="select"
                                                                        name="id_paciente"
                                                                        className="form-control"
                                                                        value={pacienteNombre}
                                                                        onChange={(e) => setPacienteNombre(e.target.value)}
                                                                        readOnly
                                                                    >

                                                                    </input>


                                                                </div>


                                                                <div className="form-group col-md-4" >
                                                                    <label htmlFor="inputSucursal">Sucursal</label>
                                                                    <input
                                                                        as="select"
                                                                        name="sucursal"
                                                                        className="form-control"
                                                                        value={Direccion}
                                                                        readOnly
                                                                    >

                                                                    </input>

                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <label htmlFor="cedula">
                                                                        Cedula
                                                                    </label>
                                                                    <Field
                                                                        className="form-control"
                                                                        name="cedula"
                                                                        value={Cedula}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-2">
                                                                    <label htmlFor="inputEmail4">
                                                                        Telefono
                                                                    </label>
                                                                    <Field
                                                                        className="form-control"
                                                                        name="telefono"
                                                                        value={Telefono}
                                                                        readOnly
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
                                                                                            name="rx.esfera_od"
                                                                                            id="esfera_od"
                                                                                            type="text"
                                                                                            value={rxData.esfera_od || ''}
                                                                                            readOnly


                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            name="rx.cilindro_od"
                                                                                            type="text"
                                                                                            value={rxData.cilindro_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            name="rx.eje_od"
                                                                                            type="text"
                                                                                            value={rxData.eje_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.add_od"
                                                                                            type="text"
                                                                                            value={rxData.add_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            defaultValue="△"
                                                                                            name="rx.prisma_od"
                                                                                            type="text"
                                                                                            value={rxData.prisma_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.distancia_od"
                                                                                            type="text"
                                                                                            value={rxData.distancia_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.altura_od"
                                                                                            type="text"
                                                                                            value={rxData.altura_od || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center">
                                                                                        OI
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.esfera_oi"
                                                                                            type="text"
                                                                                            value={rxData.esfera_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.cilindro_oi"
                                                                                            type="text"
                                                                                            value={rxData.cilindro_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.eje_oi"
                                                                                            type="text"
                                                                                            value={rxData.eje_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.add_oi"
                                                                                            type="text"
                                                                                            value={rxData.add_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            defaultValue="△"
                                                                                            name="rx.prisma_oi"
                                                                                            type="text"
                                                                                            value={rxData.prisma_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.distancia_oi"
                                                                                            type="text"
                                                                                            value={rxData.distancia_oi || ''}
                                                                                            readOnly
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <Field
                                                                                            className="form-control"
                                                                                            name="rx.altura_oi"
                                                                                            type="text"
                                                                                            value={rxData.altura_oi || ''}
                                                                                            readOnly
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
                                                                    {['monofocal', 'bifocal', 'interview', 'antifatigue', 'progresivo'].map((lente) => (
                                                                        <div className="col-md-2 p-2" key={lente}>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <input
                                                                                        className="new-control-input"
                                                                                        value={lente}
                                                                                        name="tipo_lente"
                                                                                        type="radio"
                                                                                        checked={tipoLente === lente} // Marca el radio button si coincide con el estado
                                                                                        readOnly // Solo lectura para visualización
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    {lente.charAt(0).toUpperCase() + lente.slice(1)} {/* Capitaliza la primera letra */}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    ))}

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
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.transitions}
                                                                                    name="tratamientos.transitions"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.transitions === 'transitions'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Transitions
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.filtro_a}
                                                                                    name="tratamientos.filtro_a"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.filtro_a === 'filtro_a'}
                                                                                    readOnly
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
                                                                        <Field
                                                                            className="form-control"
                                                                            name="tratamientos.gris_t"
                                                                            value={tratamientosData.gris_t}
                                                                            readOnly
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Cafe
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="tratamientos.cafe_t"
                                                                            value={tratamientosData.cafe_t}
                                                                            readOnly
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
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.fotocromatico_t}
                                                                                    name="tratamientos.fotocromatico_t"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.fotocromatico_t === 'fotocromatico'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Fotocromático
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value="antireflejo"
                                                                                    name="tratamientos.antireflejo_t"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.antireflejo === 'antireflejo'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Antireflejo
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.espejado}
                                                                                    name="tratamientos.espejado"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.espejado === 'espejado'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Espejado
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-checkbox checkbox-outline-success">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.uv}
                                                                                    name="tratamientos.uv"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.uv === 'uv'}
                                                                                    readOnly
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
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.tinte}
                                                                                    name="tratamientos.tinte"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.tinte === 'tinte'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Tinte
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.degradante}
                                                                                    name="tratamientos.degradante"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.degradante === 'degradante'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                Degradante
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={tratamientosData.uniforme}
                                                                                    name="tratamientos.uniforme"
                                                                                    type="checkbox"
                                                                                    checked={tratamientosData.uniforme === 'uniforme'}
                                                                                    readOnly
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
                                                                        <Field
                                                                            className="form-control"
                                                                            name="tratamientos.color_t"
                                                                            value={tratamientosData.color_t}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Intensidad
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="tratamientos.intensidad_t"
                                                                            value={tratamientosData.intensidad_t}
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
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_1}
                                                                                    name="material.material_1"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_1 === 'cr_39'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                CR-39
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_1}
                                                                                    name="material.material_1"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_1 === 'policarbonato'}
                                                                                    readOnly
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
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_1}
                                                                                    name="material.material_1"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_1 === 'drivewear'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                DRIVEWEAR
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_1}
                                                                                    name="material.material_1"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_1 === 'polarizado'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                POLARIZADO
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_2}
                                                                                    name="material.material_2"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_2 === 'thin_lite'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                THIN & LITE
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_2}
                                                                                    name="material.material_2"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_2 === 'policolor'}
                                                                                    readOnly
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                POLICOLOR
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <div className="n-chk">
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={materialData.material_2}
                                                                                    name="material.material_2"
                                                                                    type="checkbox"
                                                                                    checked={materialData.material_2 === 'super_thin'}
                                                                                    readOnly
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
                                                                            <Field
                                                                                className="new-control-input"
                                                                                value={aro_propioData.aro_centevi}
                                                                                name="propio"
                                                                                type="checkbox"
                                                                                checked={aro_propioData.aro_centevi === 'aro_centevi'}
                                                                                readOnly
                                                                            />
                                                                            <span className="new-control-indicator" />
                                                                            <strong>
                                                                                Aro Centevi
                                                                            </strong>
                                                                        </label>
                                                                        <label className="new-control new-radio radio-classic-primary">
                                                                            <Field
                                                                                className="new-control-input"
                                                                                value={aro_propioData.aro_centevi}
                                                                                name="aro_propio.propio"
                                                                                checked={aro_propioData.aro_centevi === 'aro_propio'}
                                                                                readOnly
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
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.aro_centevi}
                                                                                        name="aro_propio.aro_centevi"
                                                                                        type="checkbox"
                                                                                        checked={aro_propioData.aro_centevi === 'metal_c'}
                                                                                        readOnly
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Metal Completo
                                                                                </label>
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.aro_centevi}
                                                                                        name="aro_propio.aro_centevi"
                                                                                        type="radio"
                                                                                        checked={aro_propioData.aro_centevi === 'metal_semi'}
                                                                                        readOnly
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Metal Semi - Aire
                                                                                </label>
                                                                                <label className="new-control new-radio radio-classic-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.aro_centevi}
                                                                                        name="aro_propio.aro_centevi"
                                                                                        type="radio"
                                                                                        checked={aro_propioData.aro_centevi === 'aire'}
                                                                                        readOnly
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
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.propio}
                                                                                        name="aro_propio.propio"
                                                                                        type="checkbox"
                                                                                        checked={aro_propioData.propio === 'pasta_c'}
                                                                                        readOnly
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Pasta Completo
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-checkbox checkbox-outline-primary">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.propio}
                                                                                        name="aro_propio.propio"
                                                                                        type="checkbox"
                                                                                        checked={aro_propioData.propio === 'pasta_semi'}
                                                                                        readOnly
                                                                                    />
                                                                                    <span className="new-control-indicator" />
                                                                                    Pasta Semi - Aire
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-checkbox checkbox-outline-success">
                                                                                    <Field
                                                                                        className="new-control-input"
                                                                                        value={aro_propioData.propio}
                                                                                        name="aro_propio.propio"
                                                                                        checked={aro_propioData.propio === 'seguridad'}
                                                                                        readOnly
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
                                                                        <Field
                                                                            className="form-control"
                                                                            name="aro_propio.codigo_aro"
                                                                            value={aro_propioData.codigo_aro}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Color
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="aro_propio.color_aro"
                                                                            value={aro_propioData.color_aro}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6 mt-3">
                                                                        <label htmlFor="inputEmail4">
                                                                            Marca
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="aro_propio.marca"
                                                                            value={aro_propioData.marca}
                                                                            type="text"
                                                                            readOnly
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
                                                                        <Field
                                                                            className="form-control"
                                                                            name="medidas.alto_l"
                                                                            value={medidasData.alto_l}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Horizontal
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="medidas.ancho_b_l"
                                                                            value={medidasData.ancho_b_l}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Diagonal Total
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="medidas.diagonal_l"
                                                                            value={medidasData.diagonal_l}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Puente
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="medidas.separacion_l"
                                                                            value={medidasData.separacion_l}
                                                                            type="text"
                                                                            readOnly
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
                                                                        <Field
                                                                            className="form-control"
                                                                            name="doctor"
                                                                            value={Doctor}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <label htmlFor="inputEmail4">
                                                                            Elaborado por
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="aro_propio.elaborado"
                                                                            value={aro_propioData.elaborado}
                                                                            type="text"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <label htmlFor="inputEmail4">
                                                                            Observación
                                                                        </label>
                                                                        <Field
                                                                            className="form-control textarea"
                                                                            id="textarea"
                                                                            maxLength="800"
                                                                            name="observacion"
                                                                            value={Observacion}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Field
                                                                name="crear_receta"
                                                                type="hidden"
                                                            />
                                                            <Field
                                                                defaultValue="3"
                                                                name="sucursal"
                                                                type="hidden"
                                                            />
                                                            <Field
                                                                defaultValue="Administrador"
                                                                name="doctor"
                                                                type="hidden"
                                                            />
                                                            
                                                            {status === 'loading' && <p>Enviando...</p>}
                                                            {status === 'failed' && <p>Error: {error}</p>}
                                                            {status === 'succeeded' && <p>Neonato creado con éxito</p>}

                                                        </Form>

                                                    </Formik>

                                                    {status === 'error' && <div className="alert alert-danger">{error}</div>}

                                                </div>
                                            ) : (
                                                <div>No hay datos de receta disponibles.</div>
                                            )}
                                        </div>
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



export default SelectReceta


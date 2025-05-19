import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchSucursales } from '../../redux/features/sucursales/sucursalesSlice';
import { useParams, useLocation,useNavigate  } from 'react-router-dom';
import { fetchVerUnaReceta } from '../../redux/features/recetas/verUnaRecetaSlice';
import { editarReceta } from '../../redux/features/recetas/editarRecetasSlice';
import Swal from 'sweetalert2';

const EditarReceta = () => {

    const { id_receta } = useParams();
    const { sucursales } = useSelector((state) => state.sucursales);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { data, status, error } = useSelector((state) => state.verUnaReceta);
    const editarStatus = useSelector((state) => state.editarReceta.status);
    const [initialValues, setInitialValues] = useState({
        nro_receta: '',
        tipo_lente: '',
        observacion: '',
        doctor: '',
        id_paciente: '',
        direccion: '',
        cedula: '',
        sucursal: '',
        telefono: '',
        tratamientos: {
            transitions: '',
            filtro_a: '',
            gris_t: '',
            cafe_t: '',
            fotocromatico: '',
            antireflejo: '',
            espejado: '',
            uv: '',
            tinte: '',
            degradante: '',
            uniforme: '',
            color_t: '',
            intensidad_t: ''
        },
        rx: {
            esfera_od: '',
            cilindro_od: '',
            eje_od: '',
            add_od: '',
            prisma_od: '',
            distancia_od: '',
            altura_od: '',
            esfera_oi: '',
            cilindro_oi: '',
            eje_oi: '',
            add_oi: '',
            prisma_oi: '',
            distancia_oi: '',
            altura_oi: ''
        },
        material: {
            material_1: "",
            gris_m: "",
            cafe_m: "",
            material_2: ""
        },
        aro_propio: {
            aro_centevi: "",
            propio: "",
            codigo_aro: "",
            color_aro: "",
            marca: "",
            elaborado: "",
        },
        medidas: {
            alto_l: "",
            ancho_b_l: "",
            separacion_l: "",
            diagonal_l: "",
        },
    });

    useEffect(() => {
        if (id_receta) {
            dispatch(fetchVerUnaReceta(id_receta));
        }
    }, [dispatch, id_receta, location.pathname]);

    useEffect(() => {
        if (data) {
            const updatedValues = {
                nro_receta: data.NRO_RECETA,
                tipo_lente: data.TIPO_LENTE,
                doctor: data.DOCTOR,
                observacion: data.OBSERVACION,
                cedula: data.CEDULA,
                telefono: data.TELEFONO,
                paciente_nombre: data.PACIENTE_NOMBRE,
                sucursal: data.SUCURSAL,
                direccion: data.DIRECCION,
                tratamientos: data.TRATAMIENTOS ? JSON.parse(data.TRATAMIENTOS) : initialValues.tratamientos ,
                rx: data.RX ? JSON.parse(data.RX) : initialValues.rx,
                material: data.MATERIAL ? JSON.parse(data.MATERIAL) : initialValues.material,
                aro_propio: data.ARO_PROPIO ? JSON.parse(data.ARO_PROPIO) : initialValues.aro_propio,
                medidas: data.MEDIDAS ? JSON.parse(data.MEDIDAS) : initialValues.medidas,
            };
            setInitialValues(updatedValues);
        }
    }, [data]);

    useEffect(() => {
        dispatch(fetchSucursales({ page: 1, limit: 100 }));
        if (editarStatus === 'succeeded') {
            alert('Receta actualizada con éxito');
            window.location.reload();  
        }
    }, [editarStatus]);


    const handleSubmit = (values) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Confirmarás los cambios en la receta!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = {
                    id: id_receta,
                    data: {
                        ...values,
                        rx: JSON.stringify(values.rx),
                        tratamientos: JSON.stringify(values.tratamientos),
                        material: JSON.stringify(values.material),
                        aro_propio: JSON.stringify(values.aro_propio),
                        medidas: JSON.stringify(values.medidas)
                    }
                };
                dispatch(editarReceta(updatedData));
    
                // Opcional: Puedes mostrar una alerta de éxito después de que se complete la actualización
                Swal.fire(
                    'Guardado!',
                    'La receta ha sido actualizada.',
                    'success'
                ).then(() => {
                    navigate(-1);
                });
            }
        });
    };
    

    return (
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

                                            
                                                <div className="widget-content widget-content-area" >

                                                    <Formik
                                                        initialValues={initialValues}
                                                        enableReinitialize={true}
                                                        onSubmit={handleSubmit}
                                                    >
                                                        {({ values, handleChange, setFieldValue }) => (


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
                                                                            type="text"
                                                                            class="form-control"
                                                                            id="nro_receta"
                                                                            name="nro_receta"
                                                                            value={values.nro_receta}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-md-4" >
                                                                        <label htmlFor="pacientes">Pacientes</label>
                                                                        <input
                                                                            as="select"
                                                                            name="id_paciente"
                                                                            className="form-control"
                                                                            value={values.paciente_nombre}
                                                                            
                                                                        >
                                                                        </input>
                                                                    </div>
                                                                    <div className="form-group col-md-4" >
                                                                        <label htmlFor="inputSucursal">Sucursal</label>
                                                                        <Field
                                                                            as="select"
                                                                            name="sucursal"
                                                                            className="form-control"
                                                                            
                                                                            onChange={(e) => {
                                                                                const selectedSucursal = sucursales.find(sucursal => sucursal.id_sucursal === parseInt(e.target.value));
                                                                                setFieldValue('sucursal', e.target.value);
                                                                                setFieldValue('direccion', selectedSucursal ? selectedSucursal.nombre : '');
                                                                            }}
                                                                        >
                                                                            <option value={''}></option>
                                                                            {sucursales.map((sucursal) => (
                                                                            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>{sucursal.nombre}</option>
                                                                        ))}
                                                                        <ErrorMessage name="sucursal" component="div" className="text-danger" />
                                                                        </Field>

                                                                    </div>
                                                                    <div className="form-group col-md-2">
                                                                        <label htmlFor="cedula">
                                                                            Cedula
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="cedula"
                                                                            value={values.cedula}
                                                                            onChange={handleChange}
                                                                        

                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-md-2">
                                                                        <label htmlFor="inputEmail4">
                                                                            Telefono
                                                                        </label>
                                                                        <Field
                                                                            className="form-control"
                                                                            name="telefono"
                                                                            value={values.telefono}
                                                                            onChange={handleChange}
                                                                           

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
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="esfera_od"
                                                                                                id="esfera_od"
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
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="add_od"
                                                                                                type="text"
                                                                                              
                                                                                              
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                defaultValue="△"
                                                                                                name="prisma_od"
                                                                                                type="text"
                                                                                            
                                                                                             
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="distancia_od"
                                                                                                type="text"
                                                                                             
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="altura_od"
                                                                                                type="text"
                                                                                             
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
                                                                                                name="esfera_oi"
                                                                                                type="text"
                                                                                             
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="cilindro_oi"
                                                                                                type="text"
                                                                                              
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="eje_oi"
                                                                                                type="text"
                                                                                             
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="add_oi"
                                                                                                type="text"
                                                                                              
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                defaultValue="△"
                                                                                                name="prisma_oi"
                                                                                                type="text"
                                                                                            
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="distancia_oi"
                                                                                                type="text"
                                                                                          
                                                                                            />
                                                                                        </td>
                                                                                        <td>
                                                                                            <Field
                                                                                                className="form-control"
                                                                                                name="altura_oi"
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
                                                                        {['monofocal', 'bifocal', 'interview', 'antifatigue', 'progresivo'].map((lente) => (
                                                                            <div className="col-md-2 p-2" key={lente}>
                                                                                <div className="n-chk">
                                                                                    <label className="new-control new-radio radio-classic-primary">
                                                                                        <input
                                                                                            className="new-control-input"
                                                                                            value={lente} 
                                                                                            name="tipo_lente"
                                                                                            type="radio"  
                                                                                            checked={values.tipo_lente === lente}  
                                                                                            onChange={() => setFieldValue('tipo_lente', lente)}
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
                                                                                        value={values.tratamientos.transitions}
                                                                                        name="transitions"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.transitions === 'transitions'}
                                                                                        onChange={() => setFieldValue('tratamientos.transitions', values.tratamientos.transitions === 'transitions' ? '' : 'transitions')}
                                                                                    
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
                                                                                        value={values.tratamientos.filtro_a}
                                                                                        name="tratamientos.filtro_a"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.filtro_a === 'filtro_a'}
                                                                                        onChange={() => setFieldValue('tratamientos.filtro_a', values.tratamientos.filtro_a === 'filtro_a' ? '' : 'filtro_a')}
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
                                                                                value={values.tratamientos.gris_t}
                                                                                onChange={handleChange}
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
                                                                                value={values.tratamientos.cafe_t}
                                                                                onChange={handleChange}
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
                                                                                        value={values.tratamientos.fotocromatico}
                                                                                        name="tratamientos.fotocromatico"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.fotocromatico === 'fotocromatico'}
                                                                                        onChange={() => setFieldValue('tratamientos.fotocromatico', values.tratamientos.fotocromatico=== 'fotocromatico' ? '' : 'fotocromatico')}
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
                                                                                        value={values.tratamientos.antireflejo}
                                                                                        name="tratamientos.antireflejo"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.antireflejo === 'antireflejo'}
                                                                                        onChange={() => setFieldValue('tratamientos.antireflejo', values.tratamientos.antireflejo=== 'antireflejo' ? '' : 'antireflejo')}
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
                                                                                        value={values.tratamientos.espejado}
                                                                                        name="tratamientos.espejado"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.espejado === 'espejado'}
                                                                                        onChange={() => setFieldValue('tratamientos.espejado', values.tratamientos.espejado=== 'espejado' ? '' : 'espejado')}
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
                                                                                        value={values.tratamientos.uv}
                                                                                        name="tratamientos.uv"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.uv === 'uv'}
                                                                                        onChange={() => setFieldValue('tratamientos.uv', values.tratamientos.uv=== 'uv' ? '' : 'uv')}
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
                                                                                        value={values.tratamientos.tinte}
                                                                                        name="tratamientos.tinte"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.tinte === 'tinte'}
                                                                                        onChange={() => setFieldValue('tratamientos.tinte', values.tratamientos.tinte=== 'tinte' ? '' : 'tinte')}
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
                                                                                        value={values.tratamientos.degradante}
                                                                                        name="tratamientos.degradante"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.degradante === 'degradante'}
                                                                                        onChange={() => setFieldValue('tratamientos.degradante', values.tratamientos.degradante=== 'degradante' ? '' : 'degradante')}
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
                                                                                        value={values.tratamientos.uniforme}
                                                                                        name="tratamientos.uniforme"
                                                                                        type="checkbox"
                                                                                        checked={values.tratamientos.uniforme === 'uniforme'}
                                                                                        onChange={() => setFieldValue('tratamientos.uniforme', values.tratamientos.uniforme === 'uniforme' ? '' : 'uniforme')}
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
                                                                                value={values.tratamientos.color_t}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="inputEmail4">
                                                                                Intensidad
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="tratamientos.intensidad_t"
                                                                                value={values.tratamientos.intensidad_t}
                                                                                type="text"
                                                                                onChange={handleChange}
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
                                                                                        value={values.material.material_1}
                                                                                        name="material.material_1"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_1 === 'cr-39'}
                                                                                        onChange={() => setFieldValue('material.material_1', values.material.material_1 === 'cr-39' ? '' : 'cr-39')}
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
                                                                                        value={values.material.material_1}
                                                                                        name="material.material_1"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_1 === 'policarbonato'}
                                                                                        onChange={() => setFieldValue('material.material_1', values.material.material_1 === 'policarbonato' ? '' : 'policarbonato')}
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
                                                                                        value={values.material.material_1}
                                                                                        name="material.material_1"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_1 === 'drivewear'}
                                                                                        onChange={() => setFieldValue('material.material_1', values.material.material_1 === 'drivewear' ? '' : 'drivewear')}
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
                                                                                        value={values.material.material_1}
                                                                                        name="material.material_1"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_1 === 'polarizado'}
                                                                                        onChange={() => setFieldValue('material.material_1', values.material.material_1 === 'polarizado' ? '' : 'polarizado')}
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
                                                                                        value={values.material.material_2}
                                                                                        name="material.material_2"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_2 === 'thin_lite'}
                                                                                        onChange={() => setFieldValue('material.material_2', values.material.material_2 === 'thin_lite' ? '' : 'thin_lite')}
                                                                                
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
                                                                                        value={values.material.material_2}
                                                                                        name="material.material_2"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_2 === 'policolor'}
                                                                                        onChange={() => setFieldValue('material.material_2', values.material.material_2 === 'policolor' ? '' : 'policolor')}
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
                                                                                        value={values.material.material_2}
                                                                                        name="material.material_2"
                                                                                        type="checkbox"
                                                                                        checked={values.material.material_2 === 'super_thin'}
                                                                                        onChange={() => setFieldValue('material.material_2', values.material.material_2 === 'super_thin' ? '' : 'super_thin')}
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
                                                                                    value={values.aro_propio.aro_centevi}
                                                                                    name="aro_propio.aro_centevi"
                                                                                    type="checkbox"
                                                                                    checked={values.aro_propio.aro_centevi === 'aro_centevi'}
                                                                                    onChange={() => setFieldValue('aro_propio.aro_centevi', values.aro_propio.aro_centevi === 'aro_centevi' ? '' : 'aro_centevi')}
                                                                                />
                                                                                <span className="new-control-indicator" />
                                                                                <strong>
                                                                                    Aro Centevi
                                                                                </strong>
                                                                            </label>
                                                                            <label className="new-control new-radio radio-classic-primary">
                                                                                <Field
                                                                                    className="new-control-input"
                                                                                    value={values.aro_propio.propio}
                                                                                    name="aro_propio.propio"
                                                                                    type="checkbox"
                                                                                    checked={values.aro_propio.propio === 'propio'}
                                                                                    onChange={() => setFieldValue('aro_propio.propio', values.aro_propio.propio== 'propio' ? '' : 'propio')}
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
                                                                                            value={values.aro_propio.aro_centevi}
                                                                                            name="aro_propio.aro_centevi"
                                                                                            type="checkbox"
                                                                                            checked={values.aro_propio.aro_centevi === 'metal_c'}
                                                                                            onChange={() => setFieldValue('aro_propio.aro_centevi', values.aro_propio.aro_centevi== 'metal_c' ? '' : 'metal_c')}
                                                                                        />
                                                                                        <span className="new-control-indicator" />
                                                                                        Metal Completo
                                                                                    </label>
                                                                                    <label className="new-control new-radio radio-classic-primary">
                                                                                        <Field
                                                                                            className="new-control-input"
                                                                                            value={values.aro_propio.aro_centevi}
                                                                                            name="aro_propio.aro_centevi"
                                                                                            type="radio"
                                                                                            checked={values.aro_propio.aro_centevi === 'metal_semi'}
                                                                                            onChange={() => setFieldValue('aro_propio.aro_centevi', values.aro_propio.aro_centevi== 'metal_semi' ? '' : 'metal_semi')}
                                                                                        />
                                                                                        <span className="new-control-indicator" />
                                                                                        Metal Semi - Aire
                                                                                    </label>
                                                                                    <label className="new-control new-radio radio-classic-primary">
                                                                                        <Field
                                                                                            className="new-control-input"
                                                                                            value={values.aro_propio.aro_centevi}
                                                                                            name="aro_propio.aro_centevi"
                                                                                            type="radio"
                                                                                            checked={values.aro_propio.aro_centevi === 'aire'}
                                                                                            onChange={() => setFieldValue('aro_propio.aro_centevi', values.aro_propio.aro_centevi== 'aire' ? '' : 'aire')}
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
                                                                                            value={values.aro_propio.propio}
                                                                                            name="aro_propio.propio"
                                                                                            type="checkbox"
                                                                                            checked={values.aro_propio.propio === 'pasta_c'}
                                                                                            onChange={() => setFieldValue('aro_propio.propio', values.aro_propio.propio== 'pasta_c' ? '' : 'pasta_c')}
                                                                                        />
                                                                                        <span className="new-control-indicator" />
                                                                                        Pasta Completo
                                                                                    </label>
                                                                                </div>
                                                                                <div className="n-chk">
                                                                                    <label className="new-control new-checkbox checkbox-outline-primary">
                                                                                        <Field
                                                                                            className="new-control-input"
                                                                                            value={values.aro_propio.propio}
                                                                                            name="aro_propio.propio"
                                                                                            type="checkbox"
                                                                                            checked={values.aro_propio.propio === 'pasta_semi'}
                                                                                            onChange={() => setFieldValue('aro_propio.propio', values.aro_propio.propio== 'pasta_semi' ? '' : 'pasta_semi')}
                                                                                        />
                                                                                        <span className="new-control-indicator" />
                                                                                        Pasta Semi - Aire
                                                                                    </label>
                                                                                </div>
                                                                                <div className="n-chk">
                                                                                    <label className="new-control new-checkbox checkbox-outline-success">
                                                                                        <Field
                                                                                            className="new-control-input"
                                                                                            value={values.aro_propio.propio}
                                                                                            name="aro_propio.propio"
                                                                                            type="checkbox" 
                                                                                            checked={values.aro_propio.propio === 'seguridad'}
                                                                                            onChange={() => setFieldValue('aro_propio.propio', values.aro_propio.propio== 'seguridad' ? '' : 'seguridad')}
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
                                                                                value={values.aro_propio.codigo_aro}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                                
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="inputEmail4">
                                                                                Color
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="aro_propio.color_aro"
                                                                                value={values.aro_propio.color_aro}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-6 mt-3">
                                                                            <label htmlFor="inputEmail4">
                                                                                Marca
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="aro_propio.marca"
                                                                                value={values.aro_propio.marca}
                                                                                type="text"
                                                                                onChange={handleChange}
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
                                                                                value={values.medidas.alto_l}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="inputEmail4">
                                                                                Horizontal
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="medidas.ancho_b_l"
                                                                                value={values.medidas.ancho_b_l}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="inputEmail4">
                                                                                Diagonal Total
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="medidas.diagonal_l"
                                                                                value={values.medidas.diagonal_l}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="inputEmail4">
                                                                                Puente
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="medidas.separacion_l"
                                                                                value={values.medidas.separacion_l}
                                                                                type="text"
                                                                                onChange={handleChange}
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
                                                                                value={values.  doctor}
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <label htmlFor="inputEmail4">
                                                                                Elaborado por
                                                                            </label>
                                                                            <Field
                                                                                className="form-control"
                                                                                name="aro_propio.elaborado"
                                                                                value={values.aro_propio.elaborado}
                                                                                type="text"
                                                                                onChange={handleChange}
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
                                                                                value={values.observacion}
                                                                                onChange={handleChange}
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

                                                                <button type="submit" className="btn btn-success mt-3">
                                                                Editar Receta                                                     
                                                                </button>

                                                            

                                                            </Form>
                                                        )}
                                                    </Formik>

                                                    {status === 'error' && <div className="alert alert-danger">{error}</div>}

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



export default EditarReceta


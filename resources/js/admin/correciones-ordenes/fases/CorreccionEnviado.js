import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row, Tooltip, Button, Select } from 'antd';
import moment from 'moment';
import {
    ClockCircleTwoTone
} from '@ant-design/icons';
import { actualizarDatosFaseCorrecciones } from '../../../redux/features/correciones-ordenes/correccionesFasesOrdenesSlice';
import { fecthTiposFasesOrdenes } from '../../../redux/features/ordenes/tiposFasesOrdenesSlice';
import { createContactoCorreccionOrden } from '../../../redux/features/contacto-correccion-orden/ContactoCorreccionOrdenSlice';
import { fetchBases } from '../../../redux/features/bases/basesSlice';
import VecesContactoCorrecciones from '../VecesContactoCorrecciones';
import { fetchProveedorMaterial } from '../../../redux/features/proveedor-material/proveedorMaterialSlice';
import { updateLaboratorioEnviado } from '../../../redux/features/ordenes/fasesOrdenesSlice';

const CorreccionEnviado = ({
    tipoFaseId,
    isDisabled,
    correcionOrden,
    onBasesValidasChange,
    textoObs,
    setTextoObs,
    onGuardarObs,
    guardandoObs,
    modoEdicion,
    onCancelarEdicion
}) => {
    const dispatch = useDispatch();
    const [fechaActual, setFechaActual] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [fechaCreacion, setFechaCreacion] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [fechaIngresoLaboratorio, setFechaIngresoLaboratorio] = useState('');
    const tiposFasesOrdenes = useSelector((state) => state.tiposFasesOrdenes.tiposFasesOrdenes);
    const proveedor_material_options_selecteds = useSelector((state) => state.proveedorMaterial.proveedor_material_options_selecteds);
    const { bases, loading } = useSelector((state) => state.bases);
    const [baseOjoIzquierdoId, setBaseOjoIzquierdoId] = useState(null);
    const [baseOjoDerechoId, setBaseOjoDerechoId] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const { correccionOrderId } = useParams();
    const [laboratorio, setLaboratorio] = useState('');
    const [faseOrdenId, setFaseOrdenId] = useState();
    const [celular, setCelular] = useState('');
    const [mensaje, setMensaje] = useState(
        'Buenas Tardes, le escribimos de {sucursal} para informarle que los lentes de el Paciente {nombre} estan listo. Puede pasar a retirarlos en los siguientes horarios:  Lunes a Viernes de 9:00 am a 5:00 pm. sabados de 8:00 am a 12:00 pm. La esperamos, Saludos'
    );
    const [nombrePaciente, setNombrePaciente] = useState('');
    const [selectedSucursal, setSelectedSucursal] = useState('');
    const [ubicacionMaps, setUbicacionMaps] = useState('');
    const [status, setStatus] = useState('');
    const idUsuario = localStorage.getItem('id_usuario');
    const [lenteContacto, setLenteContacto] = useState(0);
    const [opcionesLaboratorio, setOpcionesLaboratorio] = useState([]);
    const [proveedorMaterial, setProveedorMaterial] = useState('');
    const [loadingLaboratorio, setLoadingLaboratorio] = useState(false);
    const [laboratorioOriginal, setLaboratorioOriginal] = useState('');
    const nombresBasesActuales = useSelector(
        (state) => state.correccionesFasesOrdenes.nombresBasesActuales
    );
    useEffect(() => {
        dispatch(fetchProveedorMaterial({}))
    }, [])



    useEffect(() => {
        if (correccionOrderId) {
            dispatch(fecthTiposFasesOrdenes(correccionOrderId));
        }
        dispatch(fetchBases({}));
    }, []);

    useEffect(() => {
        if (correcionOrden) {
            setSelectedSucursal(correcionOrden?.sucursal)
            setUbicacionMaps(correcionOrden?.ubicacion)
            setNombrePaciente(correcionOrden?.paciente_nombre_completo)
            setCelular(correcionOrden?.celular)
            setStatus(correcionOrden?.estado)
            setLenteContacto(correcionOrden?.lente_contacto || 0)
        }
    }, [correcionOrden])

    useEffect(() => {
        if (correcionOrden?.lente_contacto) {
            setOpcionesLaboratorio([
                { value: 'Vista Pro', label: 'Vista Pro' },
                { value: 'Haseth J&J', label: 'Haseth J&J' },
                { value: 'Alcon', label: 'Alcon' },
                { value: 'B+L', label: 'B+L' },
            ]);
        } else {
            setOpcionesLaboratorio([
                { value: 'Centilab', label: 'Centilab' },
                { value: 'Ping', label: 'Ping' },
                { value: 'Optilab', label: 'Optilab' },
            ]);
        }
    }, [correcionOrden?.lente_contacto]);

    useEffect(() => {
        if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
            const tipoFaseAnterior = tiposFasesOrdenes.find(fase =>
                fase.fases_correcciones_ordenes.some(faseOrden =>
                    faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId - 1
                )
            );
            if (tipoFaseAnterior) {
                const faseOrdenAnterior = tipoFaseAnterior.fases_correcciones_ordenes.find(faseOrden =>
                    faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId - 1
                );
                if (faseOrdenAnterior) {
                    setLaboratorio(faseOrdenAnterior.laboratorio);
                    setFechaIngresoLaboratorio(faseOrdenAnterior.fecha_fase);
                }
            }
        }

        const faseOrden = tiposFasesOrdenes
            .flatMap((tipoFaseOrden) => tipoFaseOrden.fases_correcciones_ordenes)
            .find((fasesOrden) =>
                fasesOrden.tipo_fase_correccion_orden_id == tipoFaseId
            );
    }, [tiposFasesOrdenes, correccionOrderId]);

    useEffect(() => {
        if (tiposFasesOrdenes && tiposFasesOrdenes.length > 0) {
            const tipoFase = tiposFasesOrdenes.find(fase =>
                fase.fases_correcciones_ordenes.some(faseOrden =>
                    faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
                )
            );
            if (tipoFase) {
                const faseOrden = tipoFase.fases_correcciones_ordenes.find(faseOrden =>
                    faseOrden.correccion_ordenes_id == correccionOrderId && faseOrden.tipo_fase_correccion_orden_id == tipoFaseId
                );
                if (faseOrden) {
                    setLaboratorio(faseOrden.laboratorio);
                    setObservaciones(faseOrden.observacion);
                    setLaboratorioOriginal(faseOrden.laboratorio);
                    setProveedorMaterial(faseOrden.proveedor_material);
                    setFechaActual(faseOrden.fecha_fase);
                    setFechaCreacion(faseOrden.created_at);
                    setFaseOrdenId(faseOrden.id)
                }
            }
        }
    }, [tiposFasesOrdenes, correccionOrderId, tipoFaseId]);

    useEffect(() => {
        const nuevaFase = {
            tipo_fase_correccion_orden_id: tipoFaseId,
            laboratorio: laboratorio,
            observacion: observaciones,
            proveedor_material: proveedorMaterial,
            fecha_fase: fechaActual,
            elaborado_por: idUsuario,
        };
        dispatch(actualizarDatosFaseCorrecciones(nuevaFase));
    }, [
        observaciones,
        laboratorio,
        fechaActual,
        proveedorMaterial,
        tipoFaseId,
        dispatch]
    );

    useEffect(() => {
        if (!loading && bases?.length && baseOjoIzquierdoId) {
            setBaseOjoIzquierdoId(baseOjoIzquierdoId);
        }
        if (!loading && bases?.length && baseOjoDerechoId) {
            setBaseOjoDerechoId(baseOjoDerechoId);
        }
    }, [loading, bases]);

    const getColorForStatus = (status) => {
        const colors = {
            Ok: 'green',
            Advertencia: 'yellow',
            Critico: 'red',
            Completado: 'blue',
        };
        return colors[status] || 'gray'; // Predeterminado: 'gray'
    };

    const generateWhatsAppLink = () => {
        const telefonoFormateado = `${celular.replace(/[^\d]/g, '')}`;
        let mensajePersonalizado = mensaje
            .replace('{nombre}', nombrePaciente)
            .replace('{sucursal}', selectedSucursal);

        if (ubicacionMaps) {
            mensajePersonalizado += `\n📍 Ubicación: ${ubicacionMaps}`;
        }
        const mensajeCodificado = encodeURIComponent(mensajePersonalizado);


        return `https://wa.me/${telefonoFormateado}?text=${mensajeCodificado}`;
    };


    const actualizarFecha = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro de actualizar esta fecha?',
            text: "¡Confirmarás los cambios en los datos!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (result.value === true) {
            const nuevaFecha = moment().format('YYYY-MM-DD HH:mm:ss');
            setFechaActual(nuevaFecha);
            await Swal.fire(
                'Guardado!',
                'La fecha ha sido actualizada.',
                'success'
            );
        }
    }

    const handleContactarPaciente = async () => {
        // Datos para la API
        const newContactoOrdenData = {
            correccion_ordenes_id: correcionOrden?.correccion_id,
            tipo_fase_cr_orden_id: tipoFaseId,
            usuario_id: idUsuario,
            cantidad: 1
        };

        try {
            // Llamar a la API
            await dispatch(createContactoCorreccionOrden(newContactoOrdenData)).unwrap();
            console.log('Contacto creado exitosamente');

            // Abrir enlace de WhatsApp
            window.open(generateWhatsAppLink(), '_blank');
        } catch (error) {
            console.error('Error al crear contacto:', error);
        }
    };

    const basesValidas = () => {
        if (lenteContacto === 1) {
            return true;
        }
        return baseOjoIzquierdoId !== null && baseOjoDerechoId !== null;
    };

    useEffect(() => {
        window.basesValidasEnConfeccion = basesValidas();
    }, [baseOjoIzquierdoId, baseOjoDerechoId, lenteContacto]);

    useEffect(() => {
        const validas = basesValidas();
        window.basesValidasEnConfeccion = validas;

        if (onBasesValidasChange) {
            onBasesValidasChange(validas);
        }
    }, [baseOjoIzquierdoId, baseOjoDerechoId, lenteContacto]);


    const handleGuardarLaboratorio = async () => {

        if (!laboratorio) {
            Swal.fire({
                icon: 'warning',
                title: 'Seleccione un laboratorio',
            });
            return;
        }

        if (!faseOrdenId) {
            Swal.fire({
                icon: 'error',
                title: 'No existe fase para actualizar',
            });
            return;
        }

        const mensajeCambio =
            laboratorio === 'Centilab'
                ? '¿Estas seguro de cambiar de laboratorio? Esta acción cambiará el pedido a pendiente.'
                : '¿Estas seguro de cambiar de laboratorio? Esta acción cambiará el pedido a realizado.';

        const result = await Swal.fire({
            title: 'Confirmar cambio',
            text: mensajeCambio,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });
        if (!result) return;

        try {

            setLoadingLaboratorio(true);

            await dispatch(
                updateLaboratorioEnviado({
                    id: faseOrdenId,
                    laboratorio,
                    tipo: correcionOrden?.correccion_id ? 'correccion' : 'orden',
                    id_orden: correcionOrden?.id_orden,
                    id_correccion: correcionOrden?.correccion_id || null,
                    observacion: correcionOrden?.observacion_pedido || null,
                    ojo: correcionOrden?.ojo || 'ambos',
                    receta_od: [
                        correcionOrden?.esfera_od,
                        correcionOrden?.cilindro_od,
                        correcionOrden?.eje_od
                            ? `${correcionOrden.eje_od}°`
                            : null,
                    ]
                        .filter(Boolean)
                        .join(' ') || null,
                    receta_oi: [
                        correcionOrden?.esfera_oi,
                        correcionOrden?.cilindro_oi,
                        correcionOrden?.eje_oi
                            ? `${correcionOrden.eje_oi}°`
                            : null,
                    ]
                        .filter(Boolean)
                        .join(' ') || null,
                    add_od: correcionOrden?.add_od || null,
                    add_oi: correcionOrden?.add_oi || null,
                    prisma_od: correcionOrden?.prisma_od || null,
                    prisma_oi: correcionOrden?.prisma_oi || null,
                    material: proveedorMaterial || null,
                    esfera_od: correcionOrden?.esfera_od || null,
                    esfera_oi: correcionOrden?.esfera_oi || null,
                    cilindro_od: correcionOrden?.cilindro_od || null,
                    cilindro_oi: correcionOrden?.cilindro_oi || null,
                    eje_od: correcionOrden?.eje_od || null,
                    eje_oi: correcionOrden?.eje_oi || null,
                    tipo_cristal_od: correcionOrden?.tipo_cristal_od || null,
                    tipo_cristal_oi: correcionOrden?.tipo_cristal_oi || null,
                    material_od: correcionOrden?.material_od || null,
                    material_oi: correcionOrden?.material_oi || null,
                    tratamientos_od: correcionOrden?.tratamientos_od || null,
                    tratamientos_oi: correcionOrden?.tratamientos_oi || null,
                    tipo_base_od: nombresBasesActuales.derecha || null,
                    tipo_base_oi: nombresBasesActuales.izquierda || null,
                })
            ).unwrap();

            setLaboratorioOriginal(laboratorio);

            await dispatch(fecthTiposFasesOrdenes(correccionOrderId));

            Swal.fire({
                icon: 'success',
                title: 'Laboratorio actualizado correctamente',
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {

            Swal.fire({
                icon: 'error',
                title:
                    error?.response?.data?.message ||
                    'Error al actualizar laboratorio',
            });

        } finally {
            setLoadingLaboratorio(false);
        }
    };

    return (
        <div>
            <Row
                style={{ marginBottom: '20px' }}
                gutter={[16, 16]}
            >
                <Col xxl={15} xl={15} md={12}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="laboratorio">Selecciona el laboratorio</label>
                            <Select
                                showSearch
                                placeholder="Selecciona un laboratorio"
                                options={opcionesLaboratorio}
                                style={{
                                    width: '200px',
                                    height: '30px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                                onChange={(value) => setLaboratorio(value)}
                                value={laboratorio}
                            />
                            <Button
                                type="primary"
                                size="small"
                                loading={loadingLaboratorio}
                                disabled={
                                    isDisabled ||
                                    !laboratorio ||
                                    laboratorio === laboratorioOriginal
                                }
                                onClick={handleGuardarLaboratorio}
                                style={{
                                    marginTop: '10px',
                                    width: '200px',
                                }}
                            >
                                Guardar
                            </Button>
                        </div>

                        {!correcionOrden?.lente_contacto && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="otraOpcion">Selecciona el proveedor de material</label>
                                <Select
                                    showSearch
                                    placeholder="Selecciona un proveedor"
                                    options={proveedor_material_options_selecteds}
                                    style={{
                                        width: '200px',
                                        height: '30px',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}
                                    onChange={(value) => setProveedorMaterial(value)}
                                    value={proveedorMaterial}
                                />
                            </div>
                        )}
                    </div>
                    <label htmlFor="observaciones">
                        {modoEdicion ? "Editando observacion" : "Nueva observacion"}
                    </label>
                    <Input.TextArea
                        rows={5}
                        placeholder="Escribe una observacion..."
                        onChange={(e) => setTextoObs(e.target.value)}
                        value={textoObs}
                        disabled={isDisabled}
                        style={{ borderColor: modoEdicion ? "#faad14" : undefined }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <Button
                            type="primary"
                            size="small"
                            loading={guardandoObs}
                            disabled={!textoObs?.trim()}
                            onClick={onGuardarObs}
                        >
                            {modoEdicion ? "Actualizar" : "Guardar observacion"}
                        </Button>
                        {modoEdicion && (
                            <Button size="small" onClick={onCancelarEdicion}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </Col>
                <Col
                    xxl={9} xl={9} md={12}
                    style={{
                        textAlign: 'right'
                    }}
                >
                    <label htmlFor="inputAddress">
                        Fecha de la fase confeccion
                    </label>
                    <div>
                        <Tooltip title="Actualizar Fecha">
                            <ClockCircleTwoTone
                                style={{
                                    marginRight: '10px', cursor: 'pointer', fontSize: '18px'
                                }}
                                onClick={isDisabled ? null : () => actualizarFecha()}
                            />
                        </Tooltip>
                        {fechaActual}
                    </div>
                    <Divider />
                    <label htmlFor="inputAddress">
                        Fecha de ingreso al laboratorio
                    </label>
                    <div>
                        {fechaIngresoLaboratorio || moment().format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <Divider />
                    <label htmlFor="status">Status</label>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'right',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <div
                            style={{
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '5px'
                            }}
                        >
                            <span>Días en proceso:</span>
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '23px',
                                    color: '#262626'
                                }}
                            >
                                {correcionOrden?.dias_en_proceso ?? 0}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '100%',
                                    backgroundColor: getColorForStatus(status),
                                    marginRight: '5px',
                                }}
                            ></div>
                            <span>{status || 'Sin estado'}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginTop: '10px' }}>
                        <VecesContactoCorrecciones id={correccionOrderId} />
                        <Button
                            style={{ marginLeft: '10px' }}
                            onClick={handleContactarPaciente}
                            disabled={isDisabled}
                        >
                            Contactar al paciente
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CorreccionEnviado;

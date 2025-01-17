import React, { useEffect, useState } from 'react';
import { fecthCorrecionesOrdenes } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setOrden, setOrdenPor } from '../../redux/features/ordenes/ordenesSlice';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';

const CollapsedTable = ({ data }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const {
        correcionesordenes,
        status,
        error,
        meta,
        totalPages,
        sortColumn,
        sortOrder } = useSelector((state) => state.correcionesordenes);
    
    useEffect(() => {
            dispatch(fecthCorrecionesOrdenes({
                page: currentPage,
                limit: 10,
                sortColumn,
                sortOrder,
            }));
        }, [dispatch,
            currentPage,
            sortColumn,
            sortOrder]);

    const handleSort = (newOrdenPor) => {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            dispatch(setOrden(newOrder));
            dispatch(setOrdenPor(newOrdenPor));
        };
    return (
        <div
            className="dataTables_wrapper container-fluid dt-bootstrap4"
            id="zero-config_wrapper"
        >
            <div className="table-responsive">
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>Error: {error}</p>}
                {status === 'succeeded' && (
                    <table
                        aria-describedby="zero-config_info"
                        className="table dt-table-hover tablaSucursal dataTable"
                        id="zero-config"
                        role="grid"
                        style={{
                            width: '100%'
                        }}
                    >
                        <thead>
                            <tr role="row">
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`nro_orden: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    aria-sort="descending"
                                    className="sorting_desc"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '527px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('nro_orden')}
                                >
                                    Nro_Orden
                                </th>
                                <th
                                    style={{
                                        width: '800px'
                                    }}>
                                    Pagado
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`created_at: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '299px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('created_at')}
                                >
                                    Fecha de creacion
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`Nombre: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    aria-sort="descending"
                                    className="sorting_desc"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '527px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('sucursal')}
                                >
                                    Sucursal
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`paciente_nombre_completo: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '266px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('paciente_nombre_completo')}
                                >
                                    Paciente
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`celular: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '266px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('celular')}
                                >
                                    Celular
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '266px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('DOCTOR')}
                                >
                                    Laboratorio
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '266px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('DOCTOR')}
                                >
                                    Fase
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label={`Doctor: activate to sort column ${sortOrder === 'desc' ? 'descending' : 'ascending'}`}
                                    className="sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '266px'
                                    }}
                                    tabIndex="0"
                                    onClick={() => handleSort('DOCTOR')}
                                >
                                    Status
                                </th>
                                <th
                                    aria-controls="zero-config"
                                    aria-label="Action: activate to sort column ascending"
                                    className="text-center dt-no-sorting sorting"
                                    colSpan="1"
                                    rowSpan="1"
                                    style={{
                                        width: '314px'
                                    }}
                                    tabIndex="0"

                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {correcionesordenes.map((correcionorden) => (
                                <tr key={correcionorden.id}>
                                    <td style={{ display: 'flex', alignItems: 'center' }}>
                                        {correcionorden.nro_orden}
                                        {correcionorden.lente_contacto ? (
                                            <img
                                                src="assets/img/recetas/lentesdecontacto.png"
                                                alt="Lente Contacto True"
                                                style={{ width: '20px', marginLeft: '8px' }}
                                            />
                                        ) : (
                                            <img
                                                src="assets/img/recetas/lentenormal.png"
                                                alt="Lente Contacto False"
                                                style={{ width: '20px', marginLeft: '8px' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className={`btn btn-xs ${parseInt(correcionorden.pagado_orden) === 1
                                                ? 'btn-success'
                                                : parseInt(correcionorden.pagado_orden) === 2
                                                    ? 'btn-warning'
                                                    : 'btn-danger'
                                                }`}
                                            onClick={() => handlePagoToggle(correcionorden.ordenes_id, parseInt(correcionorden.pagado_orden), correcionorden.nro_orden)}
                                            style={{ minWidth: '100px' }}
                                        >
                                            {parseInt(correcionorden.pagado_orden) === 1
                                                ? 'pagado'
                                                : parseInt(correcionorden.pagado_orden) === 2
                                                    ? 'abonado'
                                                    : 'sin pago'}
                                        </button>
                                    </td>
                                    <td>{dayjs(correcionorden.created_at).format('DD/MM/YYYY')}</td>
                                    <td>{correcionorden?.sucursal || ""}</td>
                                    <td>{
                                        correcionorden?.paciente_nombre_completo
                                    }</td>
                                    <td>{correcionorden?.celular || ""}</td>
                                    <td>{correcionorden?.laboratorio || ""}</td>
                                    <td>{correcionorden?.fase_actual || ""}</td>
                                    <td>
                                        <Tooltip title={correcionorden?.status ?? ""}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    backgroundColor:
                                                        correcionorden?.status === 'Ok'
                                                            ? 'green'
                                                            : correcionorden?.status === 'Advertencia'
                                                                ? 'yellow'
                                                                : correcionorden?.status === 'Critico'
                                                                    ? 'red'
                                                                    : correcionorden?.status === 'Completado'
                                                                        ? 'blue'
                                                                        : 'gray',
                                                }}
                                            ></span>{" "}
                                        </Tooltip>
                                    </td>
                   

                                </tr>
                            ))}

                        </tbody>
                        <tfoot>
                            <tr>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Nro_Orden
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Pagado
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Fecha de ingreso
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Sucursal
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Paciente
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Celular
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Laboratorio
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Fase
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Status
                                </th>
                                <th
                                    colSpan="1"
                                    rowSpan="1"
                                >
                                    Action
                                </th>
                                <th
                                    className="invisible"
                                    colSpan="1"
                                    rowSpan="1"
                                />
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
};
export default CollapsedTable;

import { Button, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { fetchQuotes, updateEstadoQuote } from "../../redux/features/quotes/quotesSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createInterfuerzaQuotes } from "../../redux/features/interfuerza/interfuerzaQuotes/interfuerzaQuotesSlice";

const TableCotizaciones = () => {
    const dispatch = useDispatch();
    const { quotes } = useSelector((state) => state.quotes);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchQuotes());
    }, []);

    const handleEstadoAction = async (record) => {
        if (record.estado === 1) {
            Swal.fire('Cotización ya verificada', 'Esta cotización ya está verificada en Interfuerza.', 'info');
            return;
        }
       
        const confirm = await Swal.fire({
            title: '¿Crear cotización en Interfuerza?',
            text: "¿Estás seguro que deseas crear esta cotización?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });
    
        if (confirm.isConfirmed) {
            const loadingSwal = Swal.fire({
                title: 'Creando cotización...',
                text: 'Por favor, espera mientras se crea la cotización en Interfuerza.',
                icon: 'info',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            try {
                const formattedRecord = {
                    ...record,
                    Lines: record.lines,
                };
    
                const responseInterfuerzaQuote = await dispatch(createInterfuerzaQuotes(formattedRecord)).unwrap();
    
                await dispatch(updateEstadoQuote({
                    id: record.id,
                    data: {
                        estado: 1,
                        codigo_interfuerza: responseInterfuerzaQuote.data.response.id
                    }
                }));
 
                loadingSwal.close();
                Swal.fire('¡Cotización creada!', 'Se creó y actualizó correctamente.', 'success');
            } catch (error) {
                console.error('Error creando cotización:', error);
                loadingSwal.close();
                Swal.fire('Error', 'No se pudo crear la cotización.', 'error');
            }
        }
    };
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Cliente',
            dataIndex: 'Cliente',
            key: 'Cliente'
        },
        {
            title: 'Bodega',
            dataIndex: 'Bodega',
            key: 'Bodega'
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status'
        },
        {
            title: 'Fecha Inicio',
            dataIndex: 'Date',
            key: 'Date'
        },
        {
            title: 'Fecha Fin',
            dataIndex: 'Expira',
            key: 'Expira'
        },
        {
            title: 'Total ',
            dataIndex: 'Total',
            key: 'Total'
        },
        {
            title: 'Reservar Productos ',
            dataIndex: 'Reservar_Productos',
            key: 'Reservar_Productos'
        },
        {
            title: 'Vendedor',
            dataIndex: 'Vendedor',
            key: 'Vendedor'
        },
        {
            title: 'Interfuerza',
            key: 'cotizacion',
            render: (_, record) => {
                let label = '';
                let color = '';

                if (record.estado === null) {
                    label = 'Sin verificar';
                    color = '#888';
                } else if (record.estado === 1) {
                    label = 'Verificado';
                    color = 'green';
                } else {
                    label = 'No creado';
                    color = 'red';
                }

                return (
                    <span
                        onClick={() => handleEstadoAction(record)}
                        style={{
                            cursor: 'pointer',
                            color,
                            textDecoration: 'underline',
                        }}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <Button
                    className="btn btn-primary btnVerCotizacion"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/ver-cotizacion/${record.id}`)}
                    style={{
                        marginRight: 8,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
            ),
        },
    ];

    return (
        <div>
            <a className="btn btn-success mb-4 ml-3 mt-4">
                <Link
                    to={"/crear-cotizacion"}
                    style={{ color: "white" }}
                >
                    Agregar Cotización
                </Link>
            </a>
            <Table
                columns={columns}
                dataSource={quotes}
                rowKey="id"
                className="dataTables_wrapper container-fluid dt-bootstrap4"
                id="zero-config_wrapper"
                pagination={{
                    showSizeChanger: false,
                    pageSize: 10,
                    hideOnSinglePage: true,
                }}
            />
        </div>
    );
};

export default TableCotizaciones;

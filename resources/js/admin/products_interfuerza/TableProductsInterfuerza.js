import { Alert, AutoComplete, Button, Input, Modal, Progress, Spin, Table } from "antd";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { fetchProductsInterfuerza, migrationProductsInterfuerza, setPage, setSearchTerm, setSort } from "../../redux/features/productsInterfuerza/ProductsInterfuerza";
import { deleteInterfuerzaProducts, fetchInterfuerzaProducts, verifyInterfuerzaProducts } from "../../redux/features/interfuerza/interfuerzaProducts/interfuerzaproductsSlice";
import { Link, useNavigate } from 'react-router-dom';



const TableProductsInterfuerza = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState('');
    const [isLoadingInterfuerzaProducts, setIsLoadingInterfuerzaProducts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        productsInterfuerza,
        limit,
        page,
        sortColumn,
        sortOrder,
        meta,
        searchTerm,
        status,
        error
    } = useSelector((state) => state.productsInterfuerza);

    const {
        total
    } = useSelector((state) => state.interfuerzaProducts)

    const [progressData, setProgressData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusMessage, setStatusMessage] = useState(null);
    const pageSize = 25;
    const totalPages = Math.ceil(total / pageSize);
    const scrollRef = useRef(null);
    const [isMigrating, setIsMigrating] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [progressData]);

    useEffect(() => {
        let isCurrent = true;
        setIsLoading(true);
        dispatch(fetchProductsInterfuerza({
            page,
            limit,
            sortColumn,
            sortOrder,
            search: searchValue,
            filter: searchTerm
        })).then(() => {
            if (isCurrent) setIsLoading(false);
        });
        return () => {
            isCurrent = false;
        };

    }, [dispatch, page, limit, sortColumn, sortOrder, searchValue, searchTerm]);

    useEffect(() => {
        const loadInterfuerzaProducts = async () => {
            try {
                setIsLoadingInterfuerzaProducts(true);
                await dispatch(fetchInterfuerzaProducts({ page })).unwrap();
            } catch (error) {
                console.error('Error cargando productos interfuerza:', error);
            } finally {
                setIsLoadingInterfuerzaProducts(false);
            }
        };

        loadInterfuerzaProducts();
    }, [page, dispatch]);

    useEffect(() => {
        dispatch(fetchInterfuerzaProducts({ page: 1 }))
    }, [])


    const migrateNextPage = async (page) => {
        if (isMigrating) return;

        if (page === 1) {
            setIsDeleting(true);
            setDeleteError(null);
            try {
                await dispatch(deleteInterfuerzaProducts()).unwrap();
            } catch (error) {
                setIsDeleting(false);
                setDeleteError('No se pudo limpiar la base antes de migrar.');
                return;
            }
            setIsDeleting(false);
        }
        setIsMigrating(true);
        try {

            const fetchedData = await dispatch(fetchInterfuerzaProducts({ page })).unwrap();

            const data = fetchedData.data

            const productsToMigrate = data.map(product => ({
                codigo: product.Producto.id,
                upc_code: product.Producto.UPC_Code,
                item_number: product.Producto.Item_Number,
                type: product.Producto.Type,
                nombre: product.Producto.Nombre,
                status: product.Producto.Status,
                category_l1: product.Producto.Category_L1,
                category_l2: product.Producto.Category_L2,
                category_l3: product.Producto.Category_L3,
                marca: product.Producto.Marca,
                proveedor_principal: product.Producto.Proveedor_Principal,
                ultimo_costo_unidad: product.Producto.Precio_Venta_Real
            }));

            await dispatch(migrationProductsInterfuerza(productsToMigrate)).unwrap();

            setProgressData(prev => [...prev, { page, status: 'success' }]);
        } catch (error) {
            setProgressData(prev => [...prev, { page, status: 'error' }]);
        } finally {
            setIsMigrating(false);
        }

        if (page < totalPages) {
            setCurrentPage(page + 1);
        } else {
            setStatusMessage(
                progressData.some(p => p.status === 'error')
                    ? { type: 'error', text: 'Migración finalizada con errores.' }
                    : { type: 'success', text: 'Migración completada exitosamente.' }
            );
        }
    };

    useEffect(() => {
        if (isModalVisible2) {
            setProgressData([]);
            setCurrentPage(1);
            setStatusMessage(null);
        }
    }, [isModalVisible2]);

    useEffect(() => {
        if (isModalVisible2 && currentPage <= totalPages && !isMigrating) {
            migrateNextPage(currentPage);
        }
    }, [currentPage, isModalVisible2]);


    const handleTableChange = (pagination, filters, sorter) => {
        const newPage = pagination.current;
        const newSortColumn = sorter.field;
        const newSortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null;

        if (newPage !== page) dispatch(setPage(newPage));
        dispatch(setSort({ sortColumn: newSortColumn, sortOrder: newSortOrder }));
    };

    const handleSearchChange = (value) => {
        dispatch(setSearchTerm(value));
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const response = await dispatch(verifyInterfuerzaProducts({ codigo: inputValue })).unwrap();

            const { exists_in_interfuerza, exists_in_local, message } = response.data;

            if (!exists_in_interfuerza && !exists_in_local) {
                Swal.fire({
                    title: 'Producto no encontrado',
                    text: message,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Crear Producto',
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/productos', { state: { nombreProducto: inputValue } });
                    }
                });
            } else if (!exists_in_interfuerza && exists_in_local) {
                Swal.fire({
                    title: '¡Producto encontrado en local!',
                    text: message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });

                setSearchValue(inputValue);
                setPage(1);
            } else if (exists_in_interfuerza && !exists_in_local) {
                Swal.fire({
                    title: 'Producto encontrado en Interfuerza',
                    text: message,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Crear Producto',
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/productos', { state: { nombreProducto: inputValue } });
                    }
                });
            } else {
                Swal.fire('¡Éxito!', message, 'success');
            }

        } catch (error) {
            loadingSwal.close();
            Swal.fire('Error', 'Ocurrió un error al verificar.', 'error');
        } finally {
            setIsModalOpen(false);
            setInputValue('');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setInputValue("");
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'CODIGO INTERFUERZA',
            dataIndex: 'codigo',
            key: 'codigo'
        },
        {
            title: 'TIPO',
            dataIndex: 'type',
            key: 'type',
            sorter: true,
            sortOrder: sortColumn === 'Cliente' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        },
        {
            title: 'PRODUCT MADRE',
            dataIndex: 'prod_madre',
            key: 'prod_madre',
            sorter: true,
            sortOrder: sortColumn === 'Bodega' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        },
        {
            title: 'UPC CODE',
            dataIndex: 'upc_code',
            key: 'upc_code'
        },
        {
            title: 'NUMB ITEM',
            dataIndex: 'item_number',
            key: 'item_number'
        },
        {
            title: 'NOMBRE',
            dataIndex: 'nombre',
            key: 'nombre'
        },
        {
            title: 'CATEGORIA',
            dataIndex: 'category_l1',
            key: 'category_l1'
        },
        {
            title: 'PROVEEDOR',
            dataIndex: 'proveedor_principal',
            key: 'proveedor_principal'
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'MARCA',
            dataIndex: 'marca',
            key: 'marca'
        },
        {
            title: 'PRECIO',
            dataIndex: 'ultimo_costo_unidad',
            key: 'ultimo_costo_unidad'
        }
    ];

    return (
        <div>
            <div className="search-container" style={{ marginBottom: 20 }}>
                <AutoComplete
                    allowClear
                    style={{ width: 200 }}
                    onSearch={handleSearchChange}
                    placeholder="Buscar producto"
                    value={searchTerm}
                />
            </div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>

                <a className="btn btn-success">
                    <Link to={`/crear-productos`} style={{ color: "white" }}>
                        Agregar Producto
                    </Link>
                </a>

                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setIsModalVisible2(true)}
                    disabled={isLoadingInterfuerzaProducts}
                >
                    Migrar Productos
                </Button>

                <Button
                    type="default"
                    icon={<SearchOutlined />}
                    onClick={openModal}
                >
                    Verificar Producto
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={productsInterfuerza}
                rowKey="id"
                onChange={handleTableChange}
                loading={isLoading}
                className="dataTables_wrapper container-fluid dt-bootstrap4"
                id="zero-config_wrapper"
                pagination={{
                    current: meta?.page || 1,
                    total: meta?.total || 0,
                    pageSize: limit,
                    showSizeChanger: false,
                }}
                scroll={{ x: 'max-content' }}
            />
            {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}

            <Modal
                title="Verificar Producto"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Input
                    placeholder="Ingrese Item Number o Código"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button onClick={handleOk} type="primary" style={{ marginRight: 8 }}>
                        Verificar
                    </Button>
                    <Button onClick={handleCancel}>Cancelar</Button>
                </div>
            </Modal>
            <Modal
                title="Migrando productos"
                open={isModalVisible2}
                onCancel={handleCancel2}
                footer={null}
            >
                <Spin spinning={isDeleting} tip="Eliminando productos anteriores...">
                    <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8 }} ref={scrollRef}>
                        {progressData.map(({ page, status }) => (
                            <Progress
                                key={page}
                                percent={100}
                                status={status === 'success' ? 'success' : 'exception'}
                                format={() => `Página ${page}`}
                                style={{ marginBottom: 8 }}
                            />
                        ))}
                    </div>

                    {deleteError && (
                        <Alert
                            message="Error"
                            description={deleteError}
                            type="error"
                            showIcon
                            style={{ marginTop: 16 }}
                        />
                    )}

                    {statusMessage && (
                        <Alert
                            type={statusMessage.type}
                            message={statusMessage.text}
                            showIcon
                            style={{ marginTop: 16 }}
                        />
                    )}
                </Spin>
            </Modal>

        </div>

    );
};

export default TableProductsInterfuerza;

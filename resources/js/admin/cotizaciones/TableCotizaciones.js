import { AutoComplete, Button, Table, Modal, Typography, Progress, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CopyOutlined, EyeOutlined, FilePdfOutlined, ProfileOutlined } from "@ant-design/icons";
import { fetchQuotes, findQuotesByIdAndUpdate, setPage, setSearchTerm, setSort, updateEstadoQuote, VerUnaQuote } from "../../redux/features/quotes/quotesSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createInterfuerzaQuotes } from "../../redux/features/interfuerza/interfuerzaQuotes/interfuerzaQuotesSlice";
import { generatePdfPreview, downloadPDF, formatDate } from './GeneradorPDF.js';
import '../../../css/tables/TableCotizaciones.css';
import { verCotizacionPdf } from '../../redux/features/quotes/quotesSlice';
import { constant, forEach, set } from "lodash";
import SeguimientoCotizacionModal from "./SeguimientoCotizacionModal.js";
import { Edit2Icon } from "lucide-react";
const { Text } = Typography;

const TableCotizaciones = () => {
  const dispatch = useDispatch();
  const {
    quotes,
    limit,
    page,
    sortColumn,
    sortOrder,
    meta,
    searchTerm,
    quote,
    status,
    codigoInterfuerzaList
  } = useSelector((state) => state.quotes);
  const { usuario } = useSelector(({ auth }) => auth);
  const navigate = useNavigate();
  const [seguimientoModalVisible, setSeguimientoModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pdfPreviewContent, setPdfPreviewContent] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [currentQuoteDetails, setCurrentQuoteDetails] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlPdf, setUrlPdf] = useState(null);
  const [pdfViewMode, setPdfViewMode] = useState('pdf');

  useEffect(() => {
    dispatch(fetchQuotes({ page, limit, sortColumn, sortOrder, searchTerm }));
  }, [page, limit, sortColumn, sortOrder, searchTerm]);

  useEffect(() => {
    if (quote && pdfModalVisible) {
      setCurrentQuoteDetails(quote);
      const previewContent = generatePdfPreview(quote);
      setPdfPreviewContent(previewContent);
      setLoadingPdf(false);
    }
  }, [quote, pdfModalVisible]);

  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newSortColumn = sorter.field;
    const newSortOrder = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null;

    if (newPage !== page) dispatch(setPage(newPage));
    dispatch(setSort({ sortColumn: newSortColumn, sortOrder: newSortOrder }));
  };

  const handleSyncQuotes = async () => {
    if (!codigoInterfuerzaList.length) {
      return message.warning('No hay códigos de cotización para sincronizar.');
    }

    setSyncing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev));
    }, 300);

    try {
      await dispatch(findQuotesByIdAndUpdate({ ids: codigoInterfuerzaList })).unwrap();
      clearInterval(interval);
      setProgress(100);
      message.success('Cotizaciones actualizadas correctamente');

      dispatch(fetchQuotes({ page, limit, sortColumn, sortOrder, searchTerm }));

    } catch (error) {
      clearInterval(interval);
      setProgress(100);
      message.error('Error al sincronizar cotizaciones');
    } finally {
      setTimeout(() => {
        setSyncing(false);
        setProgress(0);
      }, 800);
    }
  };

  const handleVerCotizacionPdf = async (id, record) => {
    try {
      setPdfViewMode('pdf');
      setLoadingPdf(true);
      setPdfModalVisible(true);
      setSelectedQuote(record);
      const url = await dispatch(verCotizacionPdf(id))
      if (url) {
        setUrlPdf(url.payload);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingPdf(false);
  };


  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
  };

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

  const showPdfModal = async (record) => {
    setLoadingPdf(true);
    setPdfModalVisible(true);
    setSelectedQuote(record);
    setCurrentQuoteDetails(null);
    setPdfPreviewContent('');

    try {
      await dispatch(VerUnaQuote(record.id));
    } catch (error) {
      console.error('Error obteniendo detalles de cotización:', error);
      Swal.fire('Error', 'No se pudieron cargar los detalles de la cotización.', 'error');
      setPdfModalVisible(false);
      setLoadingPdf(false);
    }
    setLoadingPdf(false);
  };
  const handleShowPreview = async () => {
    setPdfViewMode('preview');
    setLoadingPdf(true);

    try {
      await dispatch(VerUnaQuote(selectedQuote.id));
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
    }

    setLoadingPdf(false);
  };

  const handleDownloadPdf = async () => {
    try {
      setLoadingPdf(true);

      const quoteDetails = currentQuoteDetails || selectedQuote;
      const result = await downloadPDF(quoteDetails);

      setLoadingPdf(false);

      if (result.success) {
        setPdfModalVisible(false);
        Swal.fire({
          title: 'PDF descargado',
          text: `El archivo ${result.fileName} se ha descargado correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo generar el PDF.',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      setLoadingPdf(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el PDF.',
        icon: 'error'
      });
    }
  };

  const handleCloseModal = () => {
    setPdfModalVisible(false);
    setSelectedQuote(null);
    setCurrentQuoteDetails(null);
    setPdfPreviewContent('');
    setLoadingPdf(false);
  };

  const handleSeguimientoCotizacion = (id, record) => {
    setSelectedQuote(record);
    setSeguimientoModalVisible(true);
    // console.log(id, record);

  }
  const handleOnCloseSeguimientoModal = () => {
    setSeguimientoModalVisible(false);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${value}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Cotización',
      dataIndex: 'codigo_interfuerza',
      key: 'codigo_interfuerza',
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${value}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Paciente',
      // dataIndex: 'Cliente',
      // key: 'Cliente',
      // sorter: true,
      // sortOrder: sortColumn === 'Paciente' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_, record) => {

        return (
          // <span
          // >
          //   {record.paciente.nombres}
          // </span>
          <Text
            ellipsis
            title={`${record?.paciente?.nombres?.trim()} ${record?.paciente?.apellidos?.trim()}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {`${record?.paciente?.nombres?.trim().split(" ")[0] ?? ""} ${record?.paciente?.apellidos?.trim().split(" ")[0] ?? ""
                }`}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Bodega',
      dataIndex: 'Bodega',
      key: 'Bodega',
      sorter: true,
      sortOrder: sortColumn === 'Bodega' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${value}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${value}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Fec. Inicio',
      dataIndex: 'Date',
      key: 'Date',
      sorter: true,
      sortOrder: sortColumn === 'Date' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${formatDate(value)}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {formatDate(value)}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Fec. Fin',
      dataIndex: 'Expira',
      key: 'Expira',
      sorter: true,
      sortOrder: sortColumn === 'Expira' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${formatDate(value)}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {formatDate(value)}
            </span>
          </Text>
        );
      },
    },
    {
      title: 'Total ',
      dataIndex: 'Total',
      key: 'Total',
      sorter: true,
      sortOrder: sortColumn === 'Total' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,

      render: (value) => {
        return (
          <Text
            ellipsis
            title={`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </Text>
        );
      },
    },
    // {
    //   title: <Text
    //     ellipsis
    //     title={`Reservar Productos`}
    //   >
    //     <span
    //     >
    //       Reservar Productos
    //     </span>
    //   </Text>,
    //   dataIndex: 'Reservar_Productos',
    //   key: 'Reservar_Productos',
    //   width: '50px',
    //   render: (value) => {
    //     return (
    //       <Text
    //         ellipsis
    //         title={`${value}`}
    //       >
    //         <span
    //           style={{
    //             color: "#515365",
    //             fontSize: "13px",
    //             fontWeight: "normal",
    //           }}
    //         >
    //           {value}
    //         </span>
    //       </Text>
    //     );
    //   },
    // },
    {
      title: 'Vendedor',
      dataIndex: 'Vendedor',
      key: 'Vendedor',
      sorter: true,
      sortOrder: sortColumn === 'Vendedor' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (value) => {
        return (
          <Text
            ellipsis
            title={`${value}`}
          >
            <span
              style={{
                color: "#515365",
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {value}
            </span>
          </Text>
        );
      },
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
        } else if (record.estado == 1 || record.estado == true) {
          label = 'Verificado';
          color = 'green';
        } else {
          label = 'No creado';
          color = 'red';
        }

        return (
          <Text
            ellipsis
            title={`${label}`}
          >
            <span
              onClick={() => handleEstadoAction(record)}
              style={{
                cursor: 'pointer',
                color,
                textDecoration: 'underline',
                fontSize: "13px",
                fontWeight: "normal",
              }}
            >
              {label}
            </span>
          </Text>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <div style={{ display: 'flex' }}>
          <Button
            size="large"
            icon={<EyeOutlined style={{ width: '15px' }} />}
            onClick={() => navigate(`/ver-cotizacion/${record.id}`)}
            style={{
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#1890ff',
              color: '#fff',
              width: "30px",
              height: "30px"
            }}
          />
          <Link
            to="/crear-cotizacion"
            state={{ record }}
          >
            <Button
              size="large"
              icon={<CopyOutlined style={{ width: '15px' }} />}
              style={{
                marginRight: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: '#da2268',
                color: '#fff',
                width: "30px",
                height: "30px"
              }}
            />
          </Link>
          <Button
            size="large"
            icon={<FilePdfOutlined style={{ width: '15px' }} />}
            onClick={() => handleVerCotizacionPdf(record.id, record)}
            style={{
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#52c41a',
              color: '#fff',
              width: "30px",
              height: "30px"
            }}
          />
          <Button
            size="large"
            icon={<ProfileOutlined style={{ width: '15px' }} />}
            onClick={() => handleSeguimientoCotizacion(record.id, record)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#13c2c2',
              color: '#fff',
              width: "30px",
              height: "30px"
            }}
          />
          <Button
            size="large"
            icon={<Edit2Icon style={{ width: '15px' }} />}
            onClick={() => navigate(`/actualizar-cotizacion/${record.id}`)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#13c2c2',
              color: '#fff',
              width: "30px",
              height: "30px"
            }}
          />
        </div>
      ),
    },
  ];


  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link to={`/crear-cotizacion`} className="btn btn-success">
            Agregar Cotización
          </Link>
        </div>
        <div className="search-container">

          <AutoComplete
            style={{ width: 200, marginBottom: 20 }}
            onSearch={handleSearchChange}
            placeholder="Buscar cotización"
            value={searchTerm}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, marginLeft: 10 }}>
          <Button type="primary" onClick={handleSyncQuotes} disabled={syncing}>
            {syncing ? 'Sincronizando...' : 'Sincronizar cotizaciones'}
          </Button>

          {syncing && (
            <div style={{ marginLeft: 12, width: 150 }}>
              <Progress percent={progress} status="active" />
            </div>
          )}
        </div>


      </div>


      <Spin spinning={status === 'loading'} tip="Cargando datos..." size="large">
        <Table
          columns={columns}
          dataSource={quotes}
          rowKey="id"
          onChange={handleTableChange}
          className="compact-table"
          id="zero-config_wrapper"
          pagination={{
            current: meta?.page || 1,
            total: meta?.total || 0,
            pageSize: limit,
            showSizeChanger: false,
          }}
        // loading={{
        //   spinning: status === 'loading',
        //   tip: 'Cargando datos...', // mensaje que aparece junto al spinner
        // }}
        />
      </Spin>
      <Modal
        open={pdfModalVisible}
        width={pdfViewMode === 'preview' ? 900 : 1600}
        closable={false}
        footer={pdfViewMode === 'preview' ? [
          <button key="cancel" onClick={() => setPdfModalVisible(false)}
            className="btn btn-danger">
            Cancelar
          </button>,
          <button
            key="download"
            type="primary"
            onClick={handleDownloadPdf}
            loading={loadingPdf}
            disabled={!currentQuoteDetails}
            className="btn btn-danger"
          >
            Descargar PDF
          </button>,
        ] : null}
        height={pdfViewMode === 'preview' ? '80%' : '100%'}
        centered={pdfViewMode === 'preview'}

      >
        {pdfViewMode === 'preview' ? (
          <div style={{
            height: '70vh',
            overflow: 'auto',
            border: '1px solid #eee',
            padding: '10px',
            backgroundColor: '#f9f9f9'
          }}>
            {loadingPdf ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                Cargando vista previa...
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: pdfPreviewContent }} />
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => handleShowPreview()}
                className="btn btn-danger"
              >
                Modo Ventana
              </button>
            </div>

            {loadingPdf ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                Cargando PDF...
              </div>
            ) : urlPdf ? (
              <iframe
                src={urlPdf}
                width="100%"
                height="800px"
                style={{ border: 'none' }}
              />
            ) : (
              'PDF no disponible'
            )}
          </>
        )}

        {pdfViewMode === 'pdf' && (
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
            <button onClick={() => {
              setPdfModalVisible(false);
              setUrlPdf(null);
              setPdfViewMode('pdf');
            }}
              className="btn btn-danger">
              Cerrar
            </button>
          </div>
        )}
      </Modal>
      {seguimientoModalVisible && selectedQuote && (
        <SeguimientoCotizacionModal
          quoteId={selectedQuote.id}
          open={seguimientoModalVisible}
          usuario_id={usuario.usuario.id_usuario}
          onClose={handleOnCloseSeguimientoModal}
        />
      )}
    </div>
  );
};

export default TableCotizaciones;
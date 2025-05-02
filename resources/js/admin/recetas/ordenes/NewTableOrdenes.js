import React, { useEffect, useState } from 'react';
import { fecthPruebaOrdenes, setOrderId, setSearchTermPruebaOrdenes, verOrdenPdf, verOrdenPdfSize } from '../../../redux/features/ordenes/ordenesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete, Tooltip, Typography, Table, Button, Modal, Skeleton } from 'antd';
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const columnWidths = {
  nroOrden: 120,
  fecha: 120,
  sucursal: 140,
  cedula: 140,
  paciente: 180,
  laboratorio: 100,
  proveedor_material: 100,
  fase: 160,
  status: 60,
  codigoCristal: 100,
  acciones: 120
};

const NewTableOrdenes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    ordenes_prueba,
    status_prueba,
    error_prueba,
    meta_prueba,
    search_prueba
  } = useSelector((state) => state.ordenes);
  const OrdenId = useSelector((state) => state.ordenes.OrderId)
  const [showOrden, setShowOrden] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrdenSize, setShowOrdenSize] = useState(false);
  const [loadingPdfSize, setLoadingPdfSize] = useState(false);
  const [urlPdfOrdenSize, setUrlPdfOrdenSize] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [urlPdfOrden, setUrlPdfOrden] = useState(null)

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    dispatch(fecthPruebaOrdenes({
      page: currentPage,
      limit: 20,
      search: search_prueba
    })).then(() => {
      if (isCurrent) setIsLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [dispatch, currentPage, search_prueba]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const handleSearchChange = (value) => {
    dispatch(setSearchTermPruebaOrdenes(value));
  };

  const handleVerOrden = async (id_orden) => {

    try {
      setShowOrdenSize(false)
      setLoadingPdf(true)
      setShowOrden(true)
      const url = await dispatch(verOrdenPdf(id_orden))
      if (url) {
        dispatch(setOrderId(id_orden))
        setUrlPdfOrden(url.payload)
      } else {
        Swal.fire(
          'Error',
          'Hubo un problema al visualizar la orden.',
          'error'
        );
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        'Error',
        'Hubo un problema al visualizar la orden.',
        'error'
      );
      setLoadingPdf(false)
    }
    setLoadingPdf(false)
  }


  const handleVerOrdenSize = async (id_orden) => {

    try {
      setShowOrden(false)
      setLoadingPdfSize(true)
      setShowOrdenSize(true)
      const url = await dispatch(verOrdenPdfSize(id_orden))
      if (url) {
        setUrlPdfOrdenSize(url.payload)
      } else {
        Swal.fire(
          'Error',
          'Hubo un problema al visualizar la orden.',
          'error'
        );
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        'Error',
        'Hubo un problema al visualizar la orden.',
        'error'
      );
      setLoadingPdfSize(false)
    }
    setLoadingPdfSize(false)
  }

  const columns = [
    {
      title: 'N° de Orden',
      dataIndex: 'nro_orden_id',
      width: columnWidths.nroOrden,
      render: (text, record) => (
        <>
          {text}
          <img
            src={
              record?.lente_contacto
                ? 'assets/img/recetas/lentesdecontacto.png'
                : 'assets/img/recetas/lentenormal.png'
            }
            alt="Lente"
            style={{ width: '20px', marginLeft: '8px' }}
          />
        </>
      )
    },
    {
      title: 'Fec. de Creación',
      dataIndex: 'created_at',
      width: columnWidths.fecha,
      render: (text) => dayjs(text).format('DD/MM/YYYY')
    },
    {
      title: 'Sucursal',
      dataIndex: 'sucursal',
      width: columnWidths.sucursal,
      render: (sucursal) => sucursal?.nombre?.replace("CENTEVI", "").trim()
    },
    {
      title: 'Cédula',
      dataIndex: ['paciente', 'nro_cedula'],
      width: columnWidths.cedula
    },
    {
      title: 'Paciente',
      dataIndex: 'paciente',
      width: columnWidths.paciente,
      render: (paciente) => (
        <Text ellipsis title={`${paciente?.nombres} ${paciente?.apellidos}`}>
          <span style={{ color: "#515365", fontSize: "13px", fontWeight: "normal" }}>
            {`${paciente?.nombres?.split(" ")[0] ?? ''} ${paciente?.apellidos?.split(" ")[0] ?? ''}`}
          </span>
        </Text>
      )
    },
    {
      title: 'Laboratorio',
      dataIndex: 'fases_ordenes',
      width: columnWidths.laboratorio,
      render: (fases_ordenes) => {
        const faseConLaboratorio = (fases_ordenes ?? []).find(fase => fase?.laboratorio);
        return faseConLaboratorio?.laboratorio ?? 'Sin laboratorio';
      }
    },
    {
      title: 'Proveedor',
      dataIndex: 'fases_ordenes',
      width: columnWidths.proveedor_material,
      render: (fases_ordenes) => {
        const faseConProveedor = (fases_ordenes ?? []).find(fase => fase?.proveedor_material);
        return faseConProveedor?.proveedor_material ?? 'Sin Proveedor';
      }
    },
    {
      title: 'Fase',
      dataIndex: 'tipo_fase_orden',
      width: columnWidths.fase,
      render: (_, record) => {
        const fases = record?.fases_ordenes ?? [];
        const faseMayor = fases.length > 0
          ? [...fases].sort((a, b) => b.tipo_fase_orden_id - a.tipo_fase_orden_id)[0]
          : null;

        return (
          <div>{faseMayor?.tipo_fase_orden?.tipo_fase_orden ?? 'Nuevo'}</div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'fases_ordenes',
      width: columnWidths.status,
      render: (fases_ordenes) => {
        let estado = '';
        let color = '';

        if (!fases_ordenes || fases_ordenes.length === 0) {
          estado = 'Sin estado';
          color = 'gray';
        } else {
          const isCompletado = fases_ordenes.some(f => f.tipo_fase_orden_id === 4);

          if (isCompletado) {
            estado = 'Completado';
            color = 'blue';
          } else {
            const ultimaFase = fases_ordenes[fases_ordenes.length - 1];
            const ultimaFecha = new Date(ultimaFase?.created_at ?? ultimaFase?.updated_at ?? new Date());
            const hoy = new Date();
            const diffTime = Math.abs(hoy.getTime() - ultimaFecha.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 6) {
              estado = 'OK';
              color = 'green';
            } else if (diffDays === 7) {
              estado = 'Advertencia';
              color = 'yellow';
            } else {
              estado = 'Crítico';
              color = 'red';
            }
          }
        }

        return (
          <Tooltip title={estado}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: color
              }}
            ></span>
          </Tooltip>
        );
      }
    },
    {
      title: 'Codigo Cristal',
      dataIndex: 'codigo_cristal',
      width: columnWidths.codigoCristal,
      render: (codigoCristal) => codigoCristal ?? 'Sin codigo'
    },
    {
      title: "Acciones",
      key: "acciones",
      width: columnWidths.acciones,
      render: (_, record) => (
        <>
          <Button
            size="large"
            icon={<FilePdfOutlined />}
            onClick={() => {
              dispatch(setOrderId(record.id_orden))
              handleVerOrden(record.id_orden)
            }}
            style={{
              marginRight: '8px',
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#4361EE',
              color: '#fff',
            }}
          />
          <Button
            size="large"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/ver-orden/${record.id_orden}/${record?.nro_orden_id}/${record?.id_paciente}`)}
            style={{
              marginRight: '8px',
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#1890ff',
              color: '#fff',
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <AutoComplete
          allowClear
          style={{ width: 200 }}
          onSearch={handleSearchChange}
          onClear={() => handleSearchChange('')}
          placeholder="Buscar"
          value={search_prueba}
        />
      </div>
      <Table
        className="table-ordenes"
        columns={columns}
        dataSource={ordenes_prueba}
        rowKey="id_orden"
        loading={isLoading}
        pagination={{
          current: currentPage,
          total: meta_prueba?.total,
          pageSize: 20,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content' }}
      />
      {status_prueba === 'failed' && <p style={{ color: 'red' }}>Error: {error_prueba}</p>}
      <Modal
        open={showOrden}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >{
          OrdenId !== null && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handleVerOrdenSize(OrdenId)}
                className="btn btn-danger">
                Ticket
              </button>
            </div>
          )
        }

        {
          loadingPdf
            ? <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton.Node
                active
                style={{
                  width: 1500,
                  height: 600,
                  marginBottom: '10px'
                }}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                  </svg>
                </div>
              </Skeleton.Node>
            </div>
            : urlPdfOrden
              ? <iframe
                src={urlPdfOrden}
                title=""
                width="100%"
                height="800px"
                style={{ border: 'none' }}
              />
              : 'PDF no disponible'
        }

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <button
            onClick={() => {
              setShowOrden(false)
              setUrlPdfOrden(null)
            }}
            className='btn btn-danger'
          >Cerrar</button>
        </div>
      </Modal>
      <Modal
        open={showOrdenSize}
        zIndex={1000000000}
        width={1600}
        closable={false}
        footer={null}
        height='100%'
        centered={false}
      >

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => handleVerOrden(OrdenId)}
            className="btn btn-danger">
            A4
          </button>
        </div>

        {
          loadingPdfSize
            ? <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton.Node
                active
                style={{
                  width: 1500,
                  height: 600,
                  marginBottom: '10px'
                }}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                    <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                  </svg>
                </div>
              </Skeleton.Node>
            </div>
            : urlPdfOrdenSize
              ? <iframe
                src={urlPdfOrdenSize}
                title=""
                width="100%"
                height="800px"
                style={{ border: 'none' }}
              />
              : 'PDF no disponible'
        }

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <button
            onClick={() => {
              setShowOrdenSize(false)
              setUrlPdfOrdenSize(null)
            }}
            className='btn btn-danger'
          >Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default NewTableOrdenes;

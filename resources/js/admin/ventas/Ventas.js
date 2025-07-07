import { Button, DatePicker, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchVentas } from '../../redux/features/ventas/VentasSlice';
import PaginationVentas from './PaginationVentas';
import axios from 'axios';
import API from '../../config/config';

const Ventas = () => {

  const dispatch = useDispatch();
  const { meta, data, status, error, totalPages, searchDateAbono, searchDateFactura, searchAbono, searchFactura } = useSelector((state) => state.ventasSlice);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [localSearchDateAbono, setLocalSearchDateAbono] = useState(searchDateAbono);
  const [localSearchDateFactura, setLocalSearchDateFactura] = useState(searchDateFactura);
  const [localSearchAbono, setLocalSearchAbono] = useState(searchAbono);
  const [localSearchFactura, setLocalSearchFactura] = useState(searchFactura);
  const [downloadingExcel, setDownloadingExcel] = useState(false)

  const [debouncedAbono, setDebouncedAbono] = useState(localSearchAbono);
  const [debouncedFactura, setDebouncedFactura] = useState(localSearchFactura);

  const handleDownload = async () => {
    try {

      setDownloadingExcel(true)
      const response = await axios.post(
        `${API}/ventas/download-data`,
        {
          page: currentPage,
          limit: 10,
          sortOrder,
          searchDateAbono: localSearchDateAbono,
          searchDateFactura: localSearchDateFactura,
          searchAbono: localSearchAbono,
          searchFactura: localSearchFactura
        },
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Hubo un problema con la descarga:', error);
    } finally {
      setDownloadingExcel(false)
    }
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedAbono(localSearchAbono);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [localSearchAbono]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFactura(localSearchFactura);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [localSearchFactura]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchAbonoChange = (event) => {
    setLocalSearchAbono(event.target.value);
    setCurrentPage(1)
  };

  const handleSearchFacturaChange = (event) => {
    setLocalSearchFactura(event.target.value);
    setCurrentPage(1)
  };

  useEffect(() => {
    dispatch(fetchVentas({
      page: currentPage,
      limit: 10,
      sortOrder,
      searchDateAbono: localSearchDateAbono,
      searchDateFactura: localSearchDateFactura,
      searchAbono: localSearchAbono,
      searchFactura: localSearchFactura
    }));
  }, [dispatch, localSearchDateAbono, localSearchDateFactura, debouncedAbono, debouncedFactura, currentPage, sortOrder]);

  useEffect(() => {
    dispatch(fetchVentas({}))
  }, [])

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          loading={downloadingExcel}
          onClick={handleDownload}
          type="primary"
        >Descargar Excel</Button>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
        <div style={{ marginRight: '3px' }}>Buscar:</div>
        <DatePicker
          placeholder='Fecha abono'
          onChange={(date, dateString) => {
            setLocalSearchDateAbono(dateString)
          }} picker="month" />
        <DatePicker
          placeholder='Fecha factura'
          onChange={(date, dateString) => {
            setLocalSearchDateFactura(dateString)
          }} picker="month" />
        <Input style={{ width: '200px' }} onChange={handleSearchAbonoChange} placeholder='Buscar Abono' />
        <Input style={{ width: '200px' }} onChange={handleSearchFacturaChange} placeholder='Buscar Factura' />

      </div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <div className="dataTables_wrapper container-fluid dt-bootstrap4" id="zero-config_wrapper">
          <div className="table-responsive">


            <table
              aria-describedby="zero-config_info"
              className="table dt-table-hover tablas dataTable"
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
                    aria-sort="ascending"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '10.5234px'
                    }}
                    tabIndex="0"
                  >
                    #
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{ width: '153.82px', }}
                    tabIndex="0"
                  >
                    Abono
                  </th>
                  {/* <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '153.82px',
                      cursor: 'pointer'
                    }}
                    tabIndex="0"
                    onClick={() => handleSort('nombre')}
                  >
                    Factura
                  </th> */}
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Factura
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{ width: '78.1406px' }}
                    tabIndex="0"
                  >
                    Fecha Abono
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{ width: '78.1406px' }}
                    tabIndex="0"
                  >
                    Fecha Factura
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '34.2891px'
                    }}
                    tabIndex="0"
                  >
                    Monto
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{ width: '115.477px', }}
                    tabIndex="0"
                  >
                    Balance
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '120px'
                    }}
                    tabIndex="0"
                  >
                    Agente
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '123.68px'
                    }}
                    tabIndex="0"
                  >
                    Caja
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Bodega
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Pais
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Ciudad
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Vendedor
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Tipo
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Pos
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Tipo transaccion
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Ref
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Comentario
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Referencia
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Proyecto
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Abono ref
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Fiscal id
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Monto factura
                  </th>
                  <th
                    aria-controls="zero-config"
                    colSpan="1"
                    rowSpan="1"
                    style={{
                      width: '101.953px'
                    }}
                    tabIndex="0"
                  >
                    Tipo factura
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((dat, index) => {


                  return (
                    <tr key={dat.id}>
                      <td>{index + 1 + (currentPage - 1) * 7}</td>
                      <td>{dat.cobro_anticipo_id}</td>
                      <td>{dat.cobro_aplicado_pago}</td>
                      {/* <td>{dat.cobro_aplicado_factura}</td> */}
                      <td>{dat.cobro_anticipo_fecha}</td>
                      <td>{dat.cobro_anticipo_fecha_pago_fin}</td>
                      <td>{dat.cobro_anticipo_monto}</td>
                      <td>{dat.cobro_anticipo_balance}</td>
                      <td>{dat.cobro_aplicado_agente}</td>
                      <td>{dat.cobro_aplicado_caja}</td>
                      <td>{dat.cobro_anticipo_bodega}</td>
                      <td>{dat.cobro_aplicado_pais}</td>
                      <td>{dat.cobro_aplicado_ciudad}</td>
                      <td>{dat.cobro_aplicado_vendedor}</td>
                      <td>{dat.cobro_anticipo_tipo}</td>
                      <td>{dat.cobro_anticipo_pos}</td>
                      <td>{dat.cobro_aplicado_tipo_trans}</td>
                      <td>{dat.cobro_aplicado_ref}</td>
                      <td>{dat.cobro_anticipo_comentario}</td>
                      <td>{dat.cobro_anticipo_referencia}</td>
                      <td>{dat.cobro_anticipo_proyecto}</td>
                      <td>{dat.cobro_anticipo_abono_ref}</td>
                      <td>{dat.cobro_anticipo_fiscal_id}</td>
                      <td>{dat.cobro_aplicado_monto}</td>
                      <td>{dat.cobro_aplicado_tipo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>

          <PaginationVentas
            meta={meta}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>
      )}
    </div>
  )
}

export default Ventas
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  EyeOutlined
} from '@ant-design/icons';
import { fecthCorrecionesOrdenes, fetchContactoCorreccionesOrdenesDelPaciente } from '../../redux/features/correciones-ordenes/correcionesOrdenesSlice';

const VecesContactoCorrecciones = ({ id, correcionOrden }) => {

  const dispatch = useDispatch();
  const [showContacto, setShowContacto] = useState(false);
  const {
    contactoCorreccionOrden
  } = useSelector((state) => state.correcionesordenes);

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
  }

  const handleVerContacto = async (id) => {
    const rpta = await dispatch(fetchContactoCorreccionesOrdenesDelPaciente(id))
    if (rpta) {
      setShowContacto(true)
    } else {
      Swal.fire(
        'Error',
        'Hubo un problema al cargar los datos.',
        'error'
      );
    }
  }

  return (
    <div>

      <Button
        onClick={() => handleVerContacto(id)}
        type="primary"
        size="small" // Hace que el botón sea más pequeño
        icon={<EyeOutlined />} // Añade el icono directamente
        style={{
          height: '32px', // Altura similar a un input estándar
          padding: '0 12px', // Ajuste del relleno
          lineHeight: '32px', // Alineación vertical
        }}
      />
      <Modal
        open={showContacto}
        zIndex={1000000000}
        width={1000}
        closable={true}
        onClose={() => setShowContacto(false)}
        footer={null}
        onCancel={() => setShowContacto(false)}
        height='100%'
        centered={false}>
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '10px', fontWeight: 600, fontSize: '18px' }}>Veces contactada: {contactoCorreccionOrden.length}</div>
          <Table
            className='Table-Orden-Contacts'
            columns={[
              { title: 'Usuario', dataIndex: 'nombre', key: 'nombre' },
              {
                title: 'Fecha',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text, record) => {
                  return formatDate(text)
                }
              },
            ]}
            dataSource={contactoCorreccionOrden}
          />

        </div>
      </Modal>
    </div>
  );
};

export default VecesContactoCorrecciones;

import React, {useState} from "react";
import { Row, Col, } from "antd";

const CotizacionesHistoria = ({ 
  data = {},
  onClick = (data) => {},
  color = '#8884D8'
}) => {

  const [hover, setHover] = useState(false);

  const dotColor = color;


  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);
  }

  const getChannelLabel = (value) => {
    const communicationChannelOptions = [
      {label: 'WhatsApp', value: 'whatsapp'},
      {label: 'Celular/Telefono', value: 'phone'},
      {label: 'Correo electónico', value: 'email'},
      {label: 'Presencial', value: 'presential'},
      {label: 'Otro', value: 'other'},
    ]
    const option = communicationChannelOptions.find(opt => opt.value === value);
    return option ? option.label : value || 'Ninguna';
  };
  
  return (
    <Row
      onClick={() => onClick(data)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        background: hover ? "#f5f5f5" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <Col xs={2} sm={2} lg={2} xl={1} style={{display: 'flex', alignContent:'start'}}
        onMouseEnter={() => setHover(true)}
      >
        {/* punto */}
        <div
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: 12,
            background: dotColor,
            boxShadow: "0 0 0 3px rgba(255,255,255,0.6)",
            zIndex: 2,
            position: "relative",
            margin: "4px 0px",
          }}
        />
        {/* línea vertical */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "0",
            transform: "translateX(-50%)",
            marginLeft: '6px',
            width: 2,
            height: "calc(100% - 18px)",
            background: dotColor,
            zIndex: 1,
          }}
        />
      </Col>

      <Col xs={22} sm={22} lg={22} xl={23} 
        style={{fontSize: '10px', borderBottom: '1px solid #F0F0F0', paddingBottom: '4px', marginBottom: '2px'}}
      >
        <Row gutter={[4,4]}>
          <Col xs={24} sm={24}>
            <div style={{fontSize: '10px', color: 'gray', fontStyle: 'italic', marginTop: '2px'}}>
              Ocurrido en: {formatDate(data.occurred_at) || 'Sin fecha disponible.'}
            </div>
            
          </Col>
          <Col xs={24} sm={24}>
            <div style={{fontSize: '12px', fontWeight: 'bold'}}>
              {data.context_title || 'Titulo no disponible.'}
            </div>
            <div style={{fontSize: '10px'}}>
              {data.details || 'Sin detalles adicionales.'}
            </div>
          </Col>
          <Col xs={24} sm={24}>
            <div style={{fontWeight: 'bold', color:"#6C5CE7", fontSize: '10px'}}>
              Mediante: <span style={{fontWeight: 'normal',}}>{getChannelLabel(data.communication_channel) || 'Ninguna.'}</span>
            </div>
            <div style={{fontSize: '10px', color: "#6C5CE7"}}>
              {data.communication_info || 'Sin informacion de comunicacion adicional.'}
            </div>
          </Col>

        </Row>
      </Col>

    </Row>
  );
};

export default CotizacionesHistoria;